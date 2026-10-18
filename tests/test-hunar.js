// Run without any AI key so results are deterministic (dotenv never overrides existing vars).
process.env.OPENAI_API_KEY = '';
process.env.GEMINI_API_KEY = '';

const http = require('node:http');
const app = require('../app');
const db = require('../database/database');
const hunar = require('../utils/hunar');

const TEST_PORT = 3098;
let server;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (options.body) headers['Content-Type'] = 'application/json';
    if (options.cookie) headers['Cookie'] = options.cookie;

    const req = http.request(`http://localhost:${TEST_PORT}${path}`, { method: options.method || 'GET', headers }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const RAHUL = {
  skills: [
    { id: 'motor_pump_repair', evidence: 'जब बोरवेल का पंप बंद हो जाता है', confidence: 0.9 },
    { id: 'electrical_repair', evidence: 'तार चेक करता हूँ', confidence: 0.8 },
    { id: 'bookkeeping', evidence: 'कॉपी में हिसाब रखता हूँ', confidence: 0.8 },
    { id: 'crop_farming', evidence: 'धान के खेत में काम', confidence: 0.7 }
  ],
  constraints: { needs_income_soon: true, can_relocate: false }
};

async function runTests() {
  console.log('🧪 Starting Kaam Kahani (Hunar) Test Suite...\n');
  server = app.listen(TEST_PORT);
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✕ ${name}:`, err.message);
      failed++;
    }
  }

  // ---------- Engine ----------
  await test('Every career references existing skills and next careers', async () => {
    for (const c of hunar.CAREERS) {
      c.skills.forEach(id => assert(hunar.getSkill(id), `${c.id} uses unknown skill ${id}`));
      c.next.forEach(id => assert(hunar.getCareer(id), `${c.id} points to unknown career ${id}`));
      assert(c.source && c.source.url.startsWith('https://'), `${c.id} has no source link`);
    }
  });

  await test('Recommendation returns best, vocational, non-STEM and surprise cards', async () => {
    const tags = hunar.recommend(RAHUL, 0).map(c => c.tag);
    ['best', 'vocational', 'nonstem', 'surprise'].forEach(t => assert(tags.includes(t), `Missing ${t} card`));
  });

  await test('Surprise card rotates with the seed', async () => {
    const picks = new Set([0, 1, 2, 3].map(seed => hunar.recommend(RAHUL, seed).find(c => c.tag === 'surprise').id));
    assert(picks.size >= 2, 'Surprise pick never changes');
  });

  await test('Needing income soon puts a quick-income path first', async () => {
    const best = hunar.recommend(RAHUL, 0)[0];
    assert(best.kamai.earnFromMonth <= 12, `Best match ${best.id} takes ${best.kamai.earnFromMonth} months`);
  });

  await test('Career ladder path starts from a career the student already fits', async () => {
    const laddered = hunar.recommend(RAHUL, 0).find(c => c.path.length > 1);
    assert(laddered, 'No multi-step ladder produced');
    const first = hunar.getCareer(laddered.path[0].id);
    assert(first.skills.some(id => RAHUL.skills.some(s => s.id === id)), 'Ladder does not start from a matched career');
  });

  await test('Kamai maths matches a hand calculation for the regular degree baseline', async () => {
    // 18 earning months: 12 x 9,000 + 6 x 16,000 - 60,000 cost = 1,44,000
    assert(hunar.baselineKamai().fiveYearNet === 144000, `Got ${hunar.baselineKamai().fiveYearNet}`);
  });

  await test('No skills means no recommendations', async () => {
    assert(hunar.recommend({ skills: [] }).length === 0, 'Expected empty list');
  });

  // ---------- Routes ----------
  await test('GET /hunar without login redirects to login', async () => {
    const res = await request('/hunar');
    assert(res.statusCode === 302 && res.headers.location === '/auth/login', `Got ${res.statusCode} ${res.headers.location}`);
  });

  let cookie = '';
  const login = await request('/auth/demo-login', { method: 'POST' });
  cookie = (login.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
  const demoUser = db.get("SELECT id FROM users WHERE email = 'demo@yukti.test'");
  db.run('DELETE FROM student_profiles WHERE user_id = ?', [demoUser.id]);

  await test('GET /hunar shows story form and AI-not-connected notice', async () => {
    const res = await request('/hunar', { cookie });
    assert(res.statusCode === 200, `Got ${res.statusCode}`);
    assert(res.body.includes('story-input'), 'Story box missing');
    assert(res.body.includes('OPENAI_API_KEY'), 'Missing-key notice not shown');
  });

  await test('POST /hunar/analyze without a key reports the missing key', async () => {
    const res = await request('/hunar/analyze', { method: 'POST', cookie, body: { story: 'I repair the village pump and keep shop accounts every evening.' } });
    assert(res.headers.location === '/hunar?error=no_key', `Got ${res.headers.location}`);
  });

  await test('POST /hunar/analyze rejects an empty story', async () => {
    const res = await request('/hunar/analyze', { method: 'POST', cookie, body: { story: 'hi' } });
    assert(res.headers.location === '/hunar?error=empty_story', `Got ${res.headers.location}`);
  });

  db.run(
    `INSERT INTO student_profiles (user_id, story, skills, interests, constraints) VALUES (?, ?, ?, '[]', ?)`,
    [demoUser.id, 'test story', JSON.stringify(RAHUL.skills), JSON.stringify(RAHUL.constraints)]
  );

  await test('GET /hunar with a saved profile shows passport, ladders and Kamai calculator', async () => {
    const res = await request('/hunar', { cookie });
    assert(res.body.includes('id="passport"'), 'Passport missing');
    assert(res.body.includes('id="ladders"'), 'Ladders missing');
    assert(res.body.includes('id="kamai"'), 'Kamai calculator missing');
    assert(res.body.includes('तार चेक करता हूँ'), 'Evidence quote missing');
  });

  await test('POST /hunar/surprise increments the surprise seed', async () => {
    await request('/hunar/surprise', { method: 'POST', cookie });
    const row = db.get('SELECT surprise_seed FROM student_profiles WHERE user_id = ?', [demoUser.id]);
    assert(row.surprise_seed === 1, `Seed is ${row.surprise_seed}`);
  });

  await test('POST /hunar/choose saves the target career', async () => {
    await request('/hunar/choose', { method: 'POST', cookie, body: { career_id: 'solar_technician' } });
    const row = db.get('SELECT target_career FROM student_profiles WHERE user_id = ?', [demoUser.id]);
    assert(row.target_career === 'solar_technician', `Got ${row.target_career}`);
  });

  await test('POST /hunar/skill/remove removes a skill from the passport', async () => {
    await request('/hunar/skill/remove', { method: 'POST', cookie, body: { skill_id: 'crop_farming' } });
    const row = db.get('SELECT skills FROM student_profiles WHERE user_id = ?', [demoUser.id]);
    assert(!JSON.parse(row.skills).some(s => s.id === 'crop_farming'), 'Skill still present');
  });

  db.run(`INSERT INTO parent_pitches (token, user_id, career_id, lang, message) VALUES ('testtoken123', ?, 'solar_technician', 'hi', 'नमस्ते, यह परीक्षण संदेश है।')`, [demoUser.id]);

  await test('Public parent page plays message and offers WhatsApp share (no login needed)', async () => {
    const res = await request('/hunar/p/testtoken123');
    assert(res.statusCode === 200, `Got ${res.statusCode}`);
    assert(res.body.includes('यह परीक्षण संदेश है'), 'Message missing');
    assert(res.body.includes('https://wa.me/?text='), 'WhatsApp share missing');
    assert(!res.body.includes('demo@yukti.test'), 'Parent page leaks email');
  });

  await test('Unknown parent link returns 404', async () => {
    const res = await request('/hunar/p/doesnotexist');
    assert(res.statusCode === 404, `Got ${res.statusCode}`);
  });

  for (const feature of ['teacher', 'opportunities', 'badges', 'stories']) {
    await test(`Coming-soon page /hunar/${feature} renders`, async () => {
      const res = await request(`/hunar/${feature}`, { cookie });
      assert(res.statusCode === 200, `Got ${res.statusCode}`);
      assert(res.body.includes('Coming soon') || res.body.includes('जल्द आ रहा है'), 'Coming soon badge missing');
    });
  }

  // Cleanup test data
  db.run(`DELETE FROM parent_pitches WHERE token = 'testtoken123'`);
  db.run('DELETE FROM student_profiles WHERE user_id = ?', [demoUser.id]);

  console.log(`\n========================================`);
  console.log(`📊 Hunar Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  if (server) server.close();
  process.exit(1);
});
