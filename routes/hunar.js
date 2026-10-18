const express = require('express');
const crypto = require('node:crypto');
const router = express.Router();
const db = require('../database/database');
const llm = require('../utils/llm');
const hunar = require('../utils/hunar');
const i18n = require('../utils/i18n');

const MAX_STORY_LENGTH = 4000;

function languageName(code) {
  const found = i18n.SUPPORTED_LANGUAGES.find(l => l.code === code);
  return found ? found.name : 'Hindi';
}

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
}

function loadProfile(userId) {
  const row = db.get('SELECT * FROM student_profiles WHERE user_id = ?', [userId]);
  if (!row) return null;
  return {
    ...row,
    skills: JSON.parse(row.skills),
    interests: JSON.parse(row.interests),
    constraints: JSON.parse(row.constraints),
    explanations: JSON.parse(row.explanations)
  };
}

// ---------- ChatGPT prompts ----------

const EXTRACT_SYSTEM = `You are a skills assessor for students from rural and tribal India.
Read the student's story (it may be in any Indian language or mixed with English).
Identify skills the student has clearly shown through real activities, choosing ONLY from the provided skill list.
Rules:
- Every skill must have an "evidence" field that quotes the exact words from the story that prove it (keep the original language).
- Do not include a skill without direct evidence. Do not guess from hobbies alone.
- "confidence" is 0.4 (mentioned once) to 1.0 (does it regularly / teaches others).
- "needs_income_soon" is true if the story mentions money pressure, family needing income, or wanting to earn soon.
- "can_relocate" is false if the story says they must stay near home / family.
Respond with JSON only, in this exact shape:
{"skills":[{"id":"skill_id","evidence":"quote","confidence":0.8}],"interests":["short phrase"],"needs_income_soon":false,"can_relocate":true}`;

async function extractSkills(story) {
  const skillList = hunar.SKILLS.map(s => `${s.id}: ${s.name}`).join('\n');
  const result = await llm.chatJSON(
    EXTRACT_SYSTEM,
    `Allowed skills (id: name):\n${skillList}\n\nStudent story:\n"""${story}"""`,
    { temperature: 0.2, maxTokens: 900 }
  );
  if (!result) return null;

  const data = result.data || {};
  const seen = new Set();
  const skills = (Array.isArray(data.skills) ? data.skills : [])
    .filter(s => s && hunar.getSkill(s.id) && !seen.has(s.id) && seen.add(s.id))
    .map(s => ({
      id: s.id,
      evidence: String(s.evidence || '').slice(0, 200),
      confidence: Math.min(1, Math.max(0.4, Number(s.confidence) || 0.7))
    }));

  return {
    skills,
    interests: (Array.isArray(data.interests) ? data.interests : []).map(String).slice(0, 5),
    constraints: {
      needs_income_soon: Boolean(data.needs_income_soon),
      can_relocate: data.can_relocate !== false
    }
  };
}

async function explainCards(cards, profile, lang) {
  const facts = cards.map(c => ({
    career_id: c.id,
    career: c.title,
    path: c.path.map(p => p.title),
    student_evidence: c.matchedSkills.map(s => `${s.name}: "${s.evidence}"`),
    skills_to_learn: c.skillsToLearn.map(s => s.name),
    first_income_after_months: c.kamai.earnFromMonth,
    training_cost_inr: c.kamai.cost,
    salary_range_inr_per_month: `${c.kamai.salaryMin}-${c.kamai.salaryMax}`
  }));

  const result = await llm.chatJSON(
    `You explain career suggestions to a student from rural India in ${languageName(lang)}.
For each career write 2 short, warm sentences in simple ${languageName(lang)} words:
first connect it to what the student already does (use their evidence), then say what they would need to learn or the first step.
Use ONLY the facts given. Never invent numbers, schemes or institutions.
Respond with JSON only: {"why":{"<career_id>":"text"}}`,
    JSON.stringify({ student_interests: profile.interests, careers: facts }),
    { temperature: 0.5, maxTokens: 900 }
  );
  if (!result || !result.data || typeof result.data.why !== 'object') return {};
  return result.data.why;
}

async function writeParentPitch(card, studentName, lang) {
  const k = card.kamai;
  const facts = {
    student_first_name: studentName,
    career: card.title,
    path: card.path.map(p => p.title),
    first_step: card.steps[0] ? card.steps[0].title : '',
    all_steps: card.steps.map(s => s.title),
    what_student_already_does: card.matchedSkills.map(s => s.evidence || s.name),
    first_income_after_months: k.earnFromMonth,
    early_monthly_income_inr: k.earlyIncome,
    later_monthly_income_inr: `${k.salaryMin} to ${k.salaryMax}`,
    training_cost_inr: k.cost,
    regular_degree_first_income_after_months: hunar.baselineKamai().earnFromMonth
  };

  const result = await llm.chatText(
    `You write a short spoken voice message (60-90 seconds, about 130-170 words) in ${languageName(lang)} from "Yukti" to the parents of a student in rural India.
Tone: respectful, warm, simple village-level words, like a trusted teacher speaking.
Cover: what the child is already good at (use their real examples), what this career is, that it is respected work, when money starts coming, the training cost, and the first step.
Use ONLY the facts given. Never invent numbers, schemes, institutions or guarantees. Say amounts in rupees exactly as given.
End by asking the parents to talk with their child and teacher about it.
Plain text only: no markdown, no emojis, no headings.`,
    [{ role: 'user', content: JSON.stringify(facts) }],
    { temperature: 0.6, maxTokens: 600 }
  );
  return result ? result.text.trim() : null;
}

// ---------- Kaam Kahani ----------

router.get('/', requireLogin, async (req, res) => {
  const lang = res.locals.lang;
  const profile = loadProfile(req.session.user.id);
  let cards = [];

  if (profile && profile.skills.length > 0) {
    cards = hunar.recommend(profile, profile.surprise_seed);

    const sameLang = profile.explanations_lang === lang;
    const explanations = sameLang ? profile.explanations : {};
    const missing = cards.filter(c => !explanations[c.id]);
    if (missing.length > 0 && llm.getProvider()) {
      Object.assign(explanations, await explainCards(missing, profile, lang));
      db.run('UPDATE student_profiles SET explanations = ?, explanations_lang = ? WHERE user_id = ?',
        [JSON.stringify(explanations), lang, req.session.user.id]);
    }
    cards.forEach(c => { c.why = explanations[c.id] || ''; });
  }

  res.render('hunar', {
    activeTab: 'hunar',
    aiProvider: llm.getProvider(),
    profile,
    cards,
    baseline: hunar.baselineKamai(),
    skillsCatalog: hunar.SKILLS,
    error: req.query.error || null
  });
});

router.post('/analyze', requireLogin, async (req, res) => {
  const story = String(req.body.story || '').trim().slice(0, MAX_STORY_LENGTH);
  if (story.length < 20) return res.redirect('/hunar?error=empty_story');
  if (!llm.getProvider()) return res.redirect('/hunar?error=no_key');

  const extracted = await extractSkills(story);
  if (!extracted) return res.redirect('/hunar?error=ai_failed');
  if (extracted.skills.length === 0) return res.redirect('/hunar?error=no_skills');

  if (req.body.needs_income_soon === 'on') extracted.constraints.needs_income_soon = true;

  db.run(
    `INSERT INTO student_profiles (user_id, story, story_lang, skills, interests, constraints, explanations, explanations_lang, surprise_seed, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, '{}', NULL, 0, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET story = excluded.story, story_lang = excluded.story_lang, skills = excluded.skills,
       interests = excluded.interests, constraints = excluded.constraints, explanations = '{}', explanations_lang = NULL,
       surprise_seed = 0, updated_at = CURRENT_TIMESTAMP`,
    [req.session.user.id, story, res.locals.lang, JSON.stringify(extracted.skills),
      JSON.stringify(extracted.interests), JSON.stringify(extracted.constraints)]
  );
  res.redirect('/hunar#passport');
});

router.post('/skill/remove', requireLogin, (req, res) => {
  const profile = loadProfile(req.session.user.id);
  if (profile) {
    const skills = profile.skills.filter(s => s.id !== req.body.skill_id);
    db.run(`UPDATE student_profiles SET skills = ?, explanations = '{}', explanations_lang = NULL WHERE user_id = ?`,
      [JSON.stringify(skills), req.session.user.id]);
  }
  res.redirect('/hunar#passport');
});

router.post('/surprise', requireLogin, (req, res) => {
  db.run('UPDATE student_profiles SET surprise_seed = surprise_seed + 1 WHERE user_id = ?', [req.session.user.id]);
  res.redirect('/hunar#ladders');
});

router.post('/choose', requireLogin, (req, res) => {
  const career = hunar.getCareer(req.body.career_id);
  if (career) {
    const userId = req.session.user.id;
    db.run('UPDATE student_profiles SET target_career = ? WHERE user_id = ?', [career.id, userId]);
    db.run('INSERT OR IGNORE INTO user_settings (user_id) VALUES (?)', [userId]);
    db.run('UPDATE user_settings SET target_career = ? WHERE user_id = ?', [career.title, userId]);
  }
  res.redirect('/hunar#ladders');
});

// ---------- Parent Pitch ----------

router.post('/parent-pitch', requireLogin, async (req, res) => {
  const lang = res.locals.lang;
  const profile = loadProfile(req.session.user.id);
  if (!profile) return res.redirect('/hunar');
  if (!llm.getProvider()) return res.redirect('/hunar?error=no_key');

  const cards = hunar.recommend(profile, profile.surprise_seed);
  const card = cards.find(c => c.id === req.body.career_id);
  if (!card) return res.redirect('/hunar#ladders');

  const firstName = String(req.session.user.name || '').split(' ')[0];
  const message = await writeParentPitch(card, firstName, lang);
  if (!message) return res.redirect('/hunar?error=ai_failed');

  const token = crypto.randomBytes(9).toString('base64url');
  db.run('INSERT INTO parent_pitches (token, user_id, career_id, lang, message) VALUES (?, ?, ?, ?, ?)',
    [token, req.session.user.id, card.id, lang, message]);
  res.redirect(`/hunar/p/${token}?new=1`);
});

// Public page opened by parents from WhatsApp: first name only, no other personal data.
router.get('/p/:token', (req, res) => {
  const pitch = db.get(
    `SELECT p.*, u.name FROM parent_pitches p JOIN users u ON u.id = p.user_id WHERE p.token = ?`,
    [req.params.token]
  );
  if (!pitch) return res.status(404).send('This message link is not valid.');

  const career = hunar.getCareer(pitch.career_id);
  res.render('parent-pitch', {
    pitch,
    firstName: String(pitch.name || '').split(' ')[0],
    career,
    kamaiInfo: hunar.kamai(career.kamai),
    baseline: hunar.baselineKamai(),
    pitchLang: pitch.lang,
    shareUrl: `${req.protocol}://${req.get('host')}/hunar/p/${pitch.token}`,
    isNew: req.query.new === '1'
  });
});

// ---------- Coming soon placeholders ----------

const COMING_SOON = {
  teacher: {
    icon: '🧑‍🏫',
    title: 'Teacher Talent Radar', title_hi: 'शिक्षक टैलेंट रडार',
    summary: 'One teacher, many students: spot hidden talent and open doors for them.',
    summary_hi: 'एक शिक्षक, कई विद्यार्थी: छिपी प्रतिभा पहचानें और उनके लिए अवसर खोलें।',
    features: [
      ['Shared-phone mode: many students on one phone with photo + PIN', 'साझा फ़ोन मोड: एक फ़ोन पर कई विद्यार्थी, फ़ोटो + पिन से'],
      ['Class view of every Skill Passport and chosen path', 'हर विद्यार्थी का स्किल पासपोर्ट और चुना रास्ता एक नज़र में'],
      ['Hidden-talent flags: strong practical skills but low marks', 'छिपी प्रतिभा संकेत: व्यावहारिक कौशल मज़बूत, अंक कम'],
      ['20-second voice endorsements attached to the passport', 'पासपोर्ट पर 20 सेकंड की आवाज़ में सिफ़ारिश'],
      ['Build and sell your own training modules (free / per module / subscription)', 'अपने प्रशिक्षण मॉड्यूल बनाएं और बेचें (मुफ़्त / प्रति मॉड्यूल / सदस्यता)']
    ]
  },
  opportunities: {
    icon: '📬',
    title: 'Opportunity Inbox', title_hi: 'अवसर इनबॉक्स',
    summary: 'Apprenticeships, schemes, scholarships and jobs matched to your path, with an eligibility check.',
    summary_hi: 'आपके रास्ते से मेल खाती अप्रेंटिसशिप, योजनाएं, छात्रवृत्ति और नौकरियां, पात्रता जांच के साथ।',
    features: [
      ['NAPS apprenticeships, Skill India courses and state schemes in one inbox', 'NAPS अप्रेंटिसशिप, स्किल इंडिया कोर्स और राज्य योजनाएं एक जगह'],
      ['Rule-based eligibility check with reasons (no AI guessing)', 'कारण सहित नियम-आधारित पात्रता जांच (AI अनुमान नहीं)'],
      ['Document checklist and deadline reminders', 'दस्तावेज़ सूची और अंतिम तिथि की याद'],
      ['Teacher recommendations arrive with an endorsement', 'शिक्षक की सिफ़ारिश के साथ अवसर'],
      ['Open API for NGOs, colleges and employers to post opportunities', 'NGO, कॉलेज और नियोक्ताओं के लिए ओपन API']
    ]
  },
  badges: {
    icon: '🏅',
    title: 'Proof-of-Skill Badges', title_hi: 'कौशल प्रमाण बैज',
    summary: 'Show your skill with a real task and earn a badge employers can verify.',
    summary_hi: 'असली काम करके अपना कौशल दिखाएं और ऐसा बैज पाएं जिसे नियोक्ता जांच सकें।',
    features: [
      ['Practical challenges: photo of wiring you did, a crop budget, a stitched blouse', 'व्यावहारिक चुनौतियां: आपकी वायरिंग की फ़ोटो, फसल बजट, सिली हुई ब्लाउज़'],
      ['AI checks the submission, teacher verifies', 'AI जांच करता है, शिक्षक पुष्टि करते हैं'],
      ['Open Badges standard, DigiLocker-ready', 'ओपन बैज मानक, डिजीलॉकर के लिए तैयार']
    ]
  },
  stories: {
    icon: '🎙️',
    title: 'Didi / Bhaiya Stories', title_hi: 'दीदी / भैया की कहानियां',
    summary: 'Short voice stories from seniors of your own district who made it.',
    summary_hi: 'आपके ही ज़िले के सफल सीनियर्स की छोटी आवाज़ कहानियां।',
    features: [
      ['60-second "how I did it" voice stories in local language', 'स्थानीय भाषा में 60 सेकंड की "मैंने कैसे किया" कहानियां'],
      ['Matched by district, path and gender', 'ज़िले, रास्ते और लिंग के अनुसार मिलान'],
      ['Ask a senior by voice note – works on slow internet', 'वॉइस नोट से सीनियर से पूछें – धीमे इंटरनेट पर भी']
    ]
  }
};

router.get('/:feature(teacher|opportunities|badges|stories)', (req, res) => {
  res.render('coming-soon', {
    activeTab: `hunar-${req.params.feature}`,
    feature: COMING_SOON[req.params.feature],
    allFeatures: COMING_SOON
  });
});

module.exports = router;
