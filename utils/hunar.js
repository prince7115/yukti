/**
 * Yukti - Hunar Engine
 * Deterministic career matching, ladders and earnings maths.
 * The LLM only extracts skills and writes explanations; every fact and number comes from /data.
 */

const SKILLS = require('../data/skills.json');
const CAREER_DATA = require('../data/careers.json');

const CAREERS = CAREER_DATA.careers;
const BASELINE = CAREER_DATA.baseline;
const SKILL_BY_ID = Object.fromEntries(SKILLS.map(s => [s.id, s]));
const CAREER_BY_ID = Object.fromEntries(CAREERS.map(c => [c.id, c]));

const NEXT_STEP_WEIGHT = 0.8;
const SECOND_STEP_WEIGHT = 0.6;
const QUICK_INCOME_MONTHS = 12;

function getSkill(id) {
  return SKILL_BY_ID[id] || null;
}

function getCareer(id) {
  return CAREER_BY_ID[id] || null;
}

// Share of a career's skills the student already has, weighted by confidence (0..1).
function fitScore(career, skillMap) {
  const total = career.skills.reduce((sum, id) => sum + (skillMap[id] || 0), 0);
  return total / career.skills.length;
}

// Best route to every career: direct fit, or reached through a career the student already fits.
function buildLadders(skillMap) {
  const best = {};
  const consider = (careerId, score, path) => {
    if (!best[careerId] || score > best[careerId].score) {
      best[careerId] = { score, path };
    }
  };

  for (const career of CAREERS) {
    const direct = fitScore(career, skillMap);
    consider(career.id, direct, [career.id]);
    if (direct === 0) continue;

    for (const nextId of career.next) {
      const next = getCareer(nextId);
      if (!next) continue;
      consider(nextId, Math.max(fitScore(next, skillMap), direct * NEXT_STEP_WEIGHT), [career.id, nextId]);

      for (const secondId of next.next) {
        if (!getCareer(secondId)) continue;
        consider(secondId, direct * SECOND_STEP_WEIGHT, [career.id, nextId, secondId]);
      }
    }
  }
  return best;
}

function kamai(k) {
  const salaryMid = (k.salary_min + k.salary_max) / 2;
  let fiveYear = 0;
  for (let month = 0; month < 60; month++) {
    if (month < k.earn_from_month) continue;
    fiveYear += month < k.earn_from_month + 12 ? k.early_income : salaryMid;
  }
  return {
    earnFromMonth: k.earn_from_month,
    cost: k.cost_inr,
    earlyIncome: k.early_income,
    salaryMin: k.salary_min,
    salaryMax: k.salary_max,
    fiveYearNet: Math.round(fiveYear - k.cost_inr)
  };
}

function baselineKamai() {
  return { id: BASELINE.id, title: BASELINE.title, title_hi: BASELINE.title_hi, ...kamai(BASELINE.kamai) };
}

/**
 * profile: { skills: [{ id, evidence, confidence }], constraints: { needs_income_soon } }
 * surpriseSeed: integer that rotates the surprise pick
 * Returns up to 4 cards: best match, best vocational, best non-STEM, and one surprise.
 */
function recommend(profile, surpriseSeed = 0) {
  const skillMap = {};
  for (const s of profile.skills || []) skillMap[s.id] = Math.max(skillMap[s.id] || 0, s.confidence || 0.7);
  if (Object.keys(skillMap).length === 0) return [];

  const needsIncomeSoon = Boolean(profile.constraints && profile.constraints.needs_income_soon);
  const ladders = buildLadders(skillMap);

  const ranked = Object.entries(ladders)
    .filter(([, l]) => l.score > 0)
    .map(([id, l]) => {
      const career = getCareer(id);
      let score = l.score;
      if (needsIncomeSoon) {
        score += career.kamai.earn_from_month <= QUICK_INCOME_MONTHS ? 0.15 : -0.1;
      }
      return { career, score, path: l.path };
    })
    .sort((a, b) => b.score - a.score);

  const picked = [];
  const take = (entry, tag) => {
    if (entry && !picked.some(p => p.career.id === entry.career.id)) picked.push({ ...entry, tag });
  };

  take(ranked[0], 'best');
  take(ranked.find(e => e.career.vocational && !picked.some(p => p.career.id === e.career.id)), 'vocational');
  take(ranked.find(e => !e.career.stem && !picked.some(p => p.career.id === e.career.id)), 'nonstem');

  // Surprise: a sector outside the picks and the student's strong direct matches, sharing at least one skill.
  const knownSectors = new Set(
    ranked.filter(e => e.path.length === 1 && e.score >= 0.5).map(e => e.career.sector)
  );
  picked.forEach(p => knownSectors.add(p.career.sector));
  const surprisePool = ranked.filter(e =>
    !knownSectors.has(e.career.sector) && !picked.some(p => p.career.id === e.career.id)
  );
  if (surprisePool.length > 0) {
    take(surprisePool[Math.abs(surpriseSeed) % Math.min(surprisePool.length, 6)], 'surprise');
  }

  return picked.map(entry => toCard(entry, skillMap, profile.skills));
}

function toCard({ career, score, path, tag }, skillMap, studentSkills) {
  const evidenceById = Object.fromEntries((studentSkills || []).map(s => [s.id, s.evidence]));
  return {
    id: career.id,
    tag,
    title: career.title,
    title_hi: career.title_hi,
    sector: career.sector,
    vocational: career.vocational,
    risk: career.risk,
    fitPercent: Math.round(Math.min(score, 1) * 100),
    path: path.map(id => ({ id, title: getCareer(id).title, title_hi: getCareer(id).title_hi })),
    matchedSkills: career.skills.filter(id => skillMap[id]).map(id => ({
      id, name: getSkill(id).name, name_hi: getSkill(id).name_hi, evidence: evidenceById[id] || ''
    })),
    skillsToLearn: career.skills.filter(id => !skillMap[id]).map(id => ({
      id, name: getSkill(id).name, name_hi: getSkill(id).name_hi
    })),
    steps: career.steps,
    exams: career.exams,
    source: career.source,
    kamai: kamai(career.kamai)
  };
}

module.exports = {
  SKILLS,
  CAREERS,
  getSkill,
  getCareer,
  fitScore,
  recommend,
  kamai,
  baselineKamai
};
