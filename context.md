# Yukti (एडू-सारथी) — Project Context

> **From learning to livelihood, in the student's own language and voice.**
> Yukti is an AI-powered, multilingual, voice-first and low-bandwidth platform for rural Indian students (Class 9 to graduation) and their village teachers/facilitators. It finds the skills a student *already has* from the story of their everyday life, turns them into career ladders with honest earnings maths, convinces the family, connects the student to real opportunities, and lets teachers spot talent and earn by teaching.

Built for: **Citi India Hackathon — "Reimagining Education & Economic Empowerment for Rural India"**
Last updated: 18 Oct 2026

---

## Table of Contents

1. [One-Minute Pitch](#1-one-minute-pitch)
2. [Problem We Are Solving](#2-problem-we-are-solving)
3. [Who We Build For](#3-who-we-build-for)
4. [Our Innovation (What Makes Us Different)](#4-our-innovation-what-makes-us-different)
5. [Feature Catalogue](#5-feature-catalogue)
6. [End-to-End User Journeys](#6-end-to-end-user-journeys)
7. [Where the Intelligence Comes From](#7-where-the-intelligence-comes-from)
8. [Tech Stack](#8-tech-stack)
9. [System Architecture](#9-system-architecture)
10. [Data Model](#10-data-model)
11. [Routes & APIs](#11-routes--apis)
12. [Knowledge Base (Curated Data)](#12-knowledge-base-curated-data)
13. [Alignment With the Problem Statement](#13-alignment-with-the-problem-statement)
14. [Mapping to Judging Criteria](#14-mapping-to-judging-criteria)
15. [Business Model & Monetization](#15-business-model--monetization)
16. [Impact & Key Metrics](#16-impact--key-metrics)
17. [Lean Canvas](#17-lean-canvas)
18. [Security, Privacy & Responsible AI](#18-security-privacy--responsible-ai)
19. [Setup, Configuration & Testing](#19-setup-configuration--testing)
20. [Demo Script (4 minutes)](#20-demo-script-4-minutes)
21. [Scalability & Roadmap](#21-scalability--roadmap)
22. [Known Limitations](#22-known-limitations)
23. [Glossary](#23-glossary)
24. [Research & Data Sources](#24-research--data-sources)
25. [Appendix: Build Status Checklist](#25-appendix-build-status-checklist)

---

## 1. One-Minute Pitch

Rahul, a Class 10 student from a Jharkhand village, fixes the borewell pump when it breaks and keeps the hisab at his father's kirana shop. No quiz or school report will ever say he has a skill. No one has told him about the Suryamitra solar course or that it is **free and leads to income in about 4 months**.

With Yukti, Rahul **speaks his day in Hindi**. The AI finds his real skills (basic electrical, pump repair, bookkeeping) and **quotes his own words as proof** in a **Skill Passport**. A deterministic engine builds **career ladders** from official data, and every set includes a vocational path, a non-STEM path and a **🎲 surprise career** he would never have considered. The **Kamai Calculator** shows that the solar path earns roughly ₹8 lakh in five years, compared with about ₹1.4 lakh for a regular degree. A **voice note goes to his father on WhatsApp** in Hindi. His **teacher endorses him** from the class Talent Radar, and the **Opportunity Inbox** shows an apprenticeship he is eligible for, with the reasons and a document checklist. He applies, and earns a **verifiable skill badge** on the way.

**The AI understands and explains. Curated data and code decide.** That is how we stay accurate, explainable and cheap enough to scale.

---

## 2. Problem We Are Solving

| Barrier | Reality in rural India |
| :--- | :--- |
| **No guidance** | About 93% of Indian schools have no dedicated career counsellor. Students follow relatives or trends. |
| **Hidden skills** | Students learn real skills from farm, shop and household work, but nothing records them. Recognition-of-prior-learning (RPL) programmes exist because such skills go unrecognised. |
| **Narrow options** | Boys are steered to engineering or government jobs and girls to caregiving. Vocational and non-STEM paths are invisible or stigmatised. |
| **Money pressure** | Families choose what pays sooner and more safely, and nobody shows them the numbers. |
| **Parents decide** | Mentoring raises interest, but enrolment barely moves because of parental scepticism and stigma (randomised trials in Bhutan). |
| **Disconnected ecosystems** | Schools, ITIs, apprenticeships (NAPS), schemes, scholarships, mentors and employers all sit in separate portals. |
| **Access** | Low literacy, regional languages, shared low-end Android phones and patchy 2G/3G data. |
| **Teachers under-used** | Village teachers know their students' talents but have no tool to act on it or to earn from teaching skills. |

Problem-statement vision: *"Every rural student should know what they are good at, how to build it, monetize it and who can open a door for them."*

---

## 3. Who We Build For

| Segment | Role | Needs |
| :--- | :--- | :--- |
| **Students (Class 9 to graduation)** | Primary users | Discover skills, see realistic paths, find and apply to opportunities, in their language and by voice |
| **Village teachers / facilitators** | Primary users and multipliers | Help many students on one phone, spot talent, recommend students, create and sell training modules |
| **Parents / family** | Decision-makers | Simple spoken explanation: is it respected, when does money come, what does it cost |
| **Mentors / alumni (Didi/Bhaiya)** | Supply side | Share stories and answer questions asynchronously |
| **NGOs, CSR, employers, colleges, govt skill missions** | Supply side and payers | Reach verified talent, post opportunities, sponsor cohorts, measure outcomes |

**Early adopters:** schools and NGOs in tribal districts of Jharkhand and Odisha; Suryamitra and PMKVY training partners; FPOs looking for accountants and drone operators.

**Out of scope (per problem statement):** villages with zero connectivity. We are still low-bandwidth-first and work offline where practical.

---

## 4. Our Innovation (What Makes Us Different)

Most career platforms (including past Smart India Hackathon entries and aptitude-test startups) follow **psychometric quiz → career list → chatbot**. We deliberately do not.

| # | Innovation | Why it matters | Conventional approach |
| :--: | :--- | :--- | :--- |
| 1 | **Kaam Kahani: skills from life stories, not quizzes** | Finds hidden practical skills (RPL-inspired) and shows the student's own words as evidence | Personality or aptitude quizzes |
| 2 | **Grounded AI: "AI understands, data decides"** | The LLM may only choose skill IDs from our list, and every number comes from curated data with an official source. No made-up careers or salaries. | Free-form chatbot answers |
| 3 | **Option-widening by design** | Every recommendation set must include vocational, non-STEM and 🎲 surprise cards (the brief says "AI should widen the options") | Top-N "best fit", usually STEM |
| 4 | **Career ladders on a skills map** | Shows the path from what you do today (pump repair → electrician → solar technician → solar business), with the reason at each step | A single job title |
| 5 | **Kamai Calculator** | Money-first honesty: months to first income, cost, stipend and 5-year earnings vs a regular degree | Rarely shown |
| 6 | **Parent Pitch** | Designs for the real decision-maker with a spoken message in the family's language, shared on WhatsApp | Ignores parents |
| 7 | **Shared-phone facilitator mode** | Matches how villages really use phones: one teacher, one phone, many students | One user per device |
| 8 | **Teacher creator economy** | A teacher's 5-minute voice recording becomes a structured lesson and quiz in many languages, sold free, per module or by subscription | Content only from central teams |
| 9 | **Proof-of-skill badges** | A real task (photo of wiring, crop budget) is AI-checked, teacher-verified and issued as an Open Badge | Certificates for attendance |
| 10 | **Rules-as-code eligibility** | Scheme and scholarship eligibility is decided by deterministic rules with reasons. "Unknown" triggers a voice question, never a guess. | LLM guessing eligibility |

---

## 5. Feature Catalogue

### 5.1 Livelihood Core (Hunar → Raasta → Kamai)

#### A. Kaam Kahani — Voice Skill Discovery (`/hunar`)
- Four guided prompts: *your day / what people ask your help for / what you enjoy / anything that limits you*.
- Speak (Web Speech API, regional locale) or type. A demo story is available in Hindi and English.
- **ChatGPT (OpenAI)** extracts `skills[] {id, evidence quote, confidence}`, `interests[]`, `needs_income_soon` and `can_relocate`.
  - **Guardrail:** only IDs in `data/skills.json` are accepted, and anything else is dropped on the server.
- The student can tick "I need to start earning soon", which overrides the AI's reading.

#### B. Skill Passport
- Skill chips, each showing *"because you said: '…'"*. The student removes anything wrong, so the student stays in control.
- Shows interests and teacher endorsements (text or voice) and earned badges.
- Printable. Shareable with employers or the Opportunity API **only with consent**.

#### C. Career Ladders + 🎲 Surprise
- Deterministic engine (`utils/hunar.js`):
  - **Fit** = confidence-weighted share of a career's required skills the student has.
  - **Ladders** = paths of up to 3 steps through the `next` links (weights 0.8 and 0.6 per extra step).
  - **Constraint boost**: if the student needs income soon, paths with first income within 12 months get +0.15 and slower ones get −0.1.
  - **Variety**: the set always contains ⭐ best match, 🛠️ vocational, 🌿 non-STEM and 🎲 surprise (a sector outside the student's strong matches that still shares at least one skill).
- Each card shows the path, skills already held and skills to learn, steps, exams, a mini earnings summary and an official source link.
- **AI "why this fits you"**: 2 sentences in the student's language, using **only** the card's facts. Cached per language.
- "Surprise me" rotates the surprise card. "Choose this path" sets `target_career` (shown on the dashboard).

#### D. Kamai Calculator (earnings comparison)
- For each path: first-income month, training cost, first-year monthly income, later salary range, and **5-year net earnings** (pure function, no AI).
- SVG bar chart against a **regular B.A./B.Sc. baseline** (first income after 42 months, ₹1.44 lakh net over 5 years).
- Marked as an estimate, with sources.

#### E. Parent Pitch (family voice message)
- One tap on a career card. ChatGPT writes a 60–90 second spoken script in the student's language **using only the calculator's facts**: what the child already does, respect, when money starts, cost, first step.
- Public link `/hunar/p/:token` (random token, **first name only**) with a large ▶ Play button (text-to-speech), key numbers in large text, **WhatsApp share** and copy link.

### 5.2 Opportunity & Connect

#### F. Opportunity Inbox (`/opportunities`)
- One feed of **apprenticeships (NAPS), Skill India/PMKVY courses, government schemes, scholarships, internships and jobs**, ranked by eligibility first, then fit with the chosen path, then deadline.
- **Rule-based eligibility engine** (`utils/eligibility.js`):
  - Rules are JSON, for example `{"all":[{"field":"income","lte":250000},{"field":"category","in":["ST","SC"]}]}`.
  - Result is `eligible`, `not_eligible` or `unknown`, with `reasons[]` and `missing_fields[]`.
  - `unknown` → asks the student for the missing fact by voice.
- Document checklist, deadline reminders, "Mark applied" status tracking (`applications`).
- Teacher recommendations arrive in the inbox with the endorsement attached.

#### G. Scholarship Finder (`/scholarships`)
- Curated national and state schemes, filtered by category, state, income, gender and education level. Feeds into the Opportunity Inbox.

#### H. Didi / Bhaiya Stories (`/stories`)
- 60-second "how I did it" voice stories from seniors of the **same district**, matched by district, path and gender.
- Asynchronous "ask a senior" voice notes that work on slow internet.

#### I. Mentors (`/mentors`)
- Directory of verified mentors (engineering, civil services, health, agriculture) with session requests and preferred language.

#### J. Partner API (`/api/v1`, OpenAPI documented)
- NGOs, colleges, employers and government systems can post opportunities, read the occupation catalogue, and read a student's Skill Passport with consent.

### 5.3 Facilitator Enablement & Sustainability

#### K. Teacher Talent Radar (`/facilitator`)
- **Shared-phone mode** (`/device`): the teacher logs in once, students switch by photo or emoji plus a 4-digit PIN (hashed with bcrypt, locked out after repeated failures).
- **Class dashboard**: each student's top skills, passport completeness, quiz average and chosen path.
- **Hidden-talent flags** (transparent rule): strong confirmed practical skills **and** quiz average below 60%, **or** a skill in an in-demand sector. The reason is always shown.
- **20-second voice endorsements** (MediaRecorder) attached to the passport.
- **Recommend to opportunity** in one tap.

#### L. Voice-to-Course Builder (teacher creator economy)
- The teacher records a voice lesson in their dialect. AI transcribes it, structures it into a lesson with key points and a quiz, and translates it into other supported languages.
- Publish as **free, pay-per-module or subscription**. Revenue split: 70% teacher, 30% platform. NGOs and CSR can sponsor modules for free access.

#### M. Proof-of-Skill Badges (`/badges`)
- Practical challenges per skill, for example "photograph the solar connection you wired" or "make a budget for one acre of tomatoes".
- AI vision pre-check, then **teacher verification**, then an **Open Badges** credential with a verification URL (DigiLocker-ready format).

### 5.4 Learning Foundation

| Feature | Route | What it does |
| :--- | :--- | :--- |
| Courses & lessons | `/learn` | Curriculum courses with lessons, village-life examples, key points and mini-quizzes; content in English and Hindi |
| Offline lessons | `/learn/api/lesson/:id` | "Download for Offline" stores the full lesson in IndexedDB |
| AI Tutor | `/tutor` | ChatGPT tutor with rural analogies, step-by-step maths, voice input and read-aloud, helper prompt chips; answers in any supported language without changing the site language |
| Quizzes & tests | `/quizzes` | Daily 5-question challenge, subject tests, mock exams, live timer, instant grading with explanations |
| Progress | `/progress` | Weekly study chart (pure SVG), subject mastery, streaks, badges |
| Career Guidance (classic) | `/career` | Original questionnaire roadmap, now with a banner pointing to Kaam Kahani |
| Profile & settings | `/profile`, `/profile/settings` | Language, Low-Data Mode, theme (light, dark, high-contrast), cache controls |

### 5.5 Access & Inclusion (cross-cutting)

- **9 languages:** English, Hindi, Bengali, Odia, Telugu, Marathi, Gujarati, Tamil, Santhali.
  - The choice persists in localStorage and a cookie and is rendered server-side, so the page never flashes English first.
- **Voice everywhere:** speech-to-text and read-aloud with regional locales (`hi-IN`, `bn-IN`, …).
- **Simple, low-literacy interface:** big tap targets, icons and emoji cues, mobile bottom navigation, print-friendly passport.
- **Low-Data Mode:** one tap disables heavy visuals and animations.
- **PWA and offline:** a service worker caches the app shell. IndexedDB stores lessons.
- **Offline sync outbox:** stories, quiz attempts, progress and endorsements are queued with a client-generated UUID and sent when the connection returns (`online` event plus Background Sync). The server ignores duplicates.

---

## 6. End-to-End User Journeys

### Student (Rahul, Class 10, Jharkhand, ST)
1. One-click login (or OTP in production), then the dashboard tile **"Find My Skills"**.
2. **Kaam Kahani**: speaks his day in Hindi → **Skill Passport** with quoted evidence.
3. **Career ladders**: Electrician → Solar Technician (⭐), Village Solar Business (🛠️), FPO Manager (🌿), Agri-Drone Pilot (🎲).
4. **Kamai**: solar technician, first income in about 4 months, free training, about ₹8.2 lakh net over 5 years, against ₹1.44 lakh for a degree.
5. **Parent Pitch**: a Hindi voice note on WhatsApp to his father.
6. **Opportunity Inbox**: Suryamitra batch and NAPS apprenticeship marked *eligible*, with reasons and a document checklist. He applies.
7. **Badge**: uploads a photo of a pump wiring task; it is AI pre-checked, teacher-verified, and the badge is added to his passport.
8. **Didi/Bhaiya**: listens to a district senior who became a solar installer, and asks her a voice question.

### Teacher (Facilitator)
1. Opens **shared-phone mode** for the class, and 30 students complete Kaam Kahani on one phone.
2. The **Talent Radar** flags Sunita (strong sewing and drawing, average marks).
3. Records a **voice endorsement**, then **recommends** her to a PMKVY apparel batch.
4. Records a 5-minute **"Basic Tally" voice lesson**, which becomes a module in 4 languages, offered at ₹49 per student or sponsored by an NGO.

### Parent
1. Receives a WhatsApp link, taps ▶, and hears in their language when money starts, the cost, and that it is respected work.
2. Large numbers on the page: "4 months, Free, ₹12,000–₹20,000".

### Partner (NGO / employer)
1. Gets an API key, then `POST /api/v1/opportunities`.
2. Eligible, matching students see it in their inbox. With consent, the partner reads their Skill Passports.

---

## 7. Where the Intelligence Comes From

| Capability | Engine | Why this design |
| :--- | :--- | :--- |
| Understanding free-form stories (any Indian language) | **OpenAI ChatGPT** (`gpt-4o-mini` by default, JSON mode) | Strong multilingual understanding |
| "Why this fits you", Parent Pitch scripts, AI Tutor answers | **OpenAI ChatGPT** | Warm, simple local-language writing |
| Teacher voice lessons → text; badge photo pre-check | **OpenAI speech-to-text and vision models** | One provider, consistent quality |
| Career facts, steps, costs, stipends, salaries | **Curated JSON knowledge base** with official sources | Accurate, auditable, no made-up facts |
| Matching, ladders, surprise, Kamai maths, hidden-talent flags | **Deterministic JavaScript** | Explainable, testable, instant, free |
| Scheme and scholarship eligibility | **Rules-as-code engine** | Legally sensitive, so it must be exact and give reasons |
| Voice input and read-aloud | **Browser Web Speech API** | Free and built into Android Chrome |

**LLM guardrails**
- Closed list of skill IDs, validated on the server.
- "Use ONLY the facts given" in every generation prompt, with facts passed as structured JSON.
- Low temperature for extraction (0.2).
- JSON response mode, with validation and clamping of confidence values.
- Generated text is cached (explanations per language) to cut cost and delay.

**Provider switch** (`utils/llm.js`): OpenAI is used when `OPENAI_API_KEY` is set, otherwise Gemini (`GEMINI_API_KEY`). The key is sent in a header, never in the URL.

---

## 8. Tech Stack

| Layer | Technology |
| :--- | :--- |
| Runtime | **Node.js** v22.5+ / v24 (uses the built-in `node:sqlite`) |
| Web framework | **Express 4.21** |
| Views | **EJS** server-side rendering, so pages arrive already in the right language |
| Database | **SQLite** via `node:sqlite` (`DatabaseSync`), WAL mode, foreign keys, prepared statements; schema can move to PostgreSQL/MySQL |
| Auth & sessions | `express-session` (httpOnly, sameSite=lax), `bcryptjs` password and PIN hashing |
| Config | `dotenv` (`.env`, git-ignored) |
| AI | **OpenAI API** (Chat Completions, JSON mode, speech-to-text, vision); Gemini as an alternative provider |
| Voice | Web Speech API (`SpeechRecognition`, `speechSynthesis`), `MediaRecorder` for voice notes and endorsements |
| Frontend | Vanilla JS, CSS custom properties, responsive grid/flex, dark and high-contrast themes, inline SVG charts (no chart library) |
| Offline / PWA | Service Worker + Cache API, `manifest.json`, **IndexedDB** for lessons and the sync outbox |
| Credentials | Open Badges format for proof-of-skill |
| API docs | OpenAPI 3 (`/api/openapi.yaml`) |
| Testing | Node scripts with `node:http` and no external test framework |
| License | **MIT** (open source, as the brief requires) |

**Only 5 runtime dependencies:** express, express-session, ejs, bcryptjs, dotenv. This keeps the app light enough for cheap hosting.

---

## 9. System Architecture

```
            ┌──────────────────────── Student / Teacher / Parent (low-end Android, Chrome) ────────────────────────┐
            │  EJS pages (SSR, 9 languages) · Web Speech (STT/TTS) · MediaRecorder · IndexedDB (lessons + outbox) │
            │  Service Worker (app shell cache, background sync)                                                   │
            └───────────────────────────────────────────────┬───────────────────────────────────────────────────────┘
                                                            │ HTTPS (sync when online)
┌───────────────────────────────────────────────────────────▼─────────────────────────────────────────────────────────────┐
│ Express app (app.js) — session, language middleware, auth                                                               │
│                                                                                                                         │
│  routes/hunar.js ── Kaam Kahani, passport, ladders, Kamai, Parent Pitch      routes/learn.js, quizzes.js, progress.js   │
│  routes/opportunities.js ── inbox, applications                              routes/ai.js (AI Tutor)                    │
│  routes/facilitator.js ── talent radar, shared-phone, endorsements, modules  routes/scholarships.js, mentors.js        │
│  routes/badges.js, stories.js                                                routes/api.js (/api/v1, OpenAPI, API keys) │
│                                                                                                                         │
│  utils/llm.js ───────► OpenAI (chat, JSON, speech-to-text, vision)  [Gemini fallback provider]                          │
│  utils/hunar.js ─────► fit score · ladders · variety (best/vocational/non-STEM/surprise) · Kamai maths                  │
│  utils/eligibility.js ► rules-as-code → eligible / not_eligible / unknown + reasons                                     │
│  utils/i18n.js ──────► server-side translations                                                                         │
│                                                                                                                         │
│  data/skills.json · data/careers.json · data/programs.json  (curated knowledge base, each record with source_url)       │
│  database/ (SQLite, schema.sql, seed.js)                                                                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Request flow, Kaam Kahani:**
1. Story → `POST /hunar/analyze`.
2. `llm.chatJSON` (allowed skill list + story).
3. Validate the IDs, save to `student_profiles`, redirect to `GET /hunar`.
4. `hunar.recommend()` builds the deterministic cards.
5. `llm.chatJSON` writes the "why" text for those cards (cached), and the page is rendered.

---

## 10. Data Model

| Table | Purpose / key columns |
| :--- | :--- |
| `users` | Students and facilitators: name, email, password_hash, state, preferred_language, education_level, **role** (`student` / `facilitator`) |
| `user_settings` | Language, low_data, voice, theme, college, **target_career**, subjects |
| `courses`, `lessons` | Bilingual curriculum: content, examples, key points, quiz JSON |
| `progress` | Lesson completion and quiz score per user |
| `quizzes`, `quiz_questions`, `quiz_attempts` | Quiz bank, bilingual explanations, graded attempts |
| `scholarships` | Curated schemes with eligibility fields and a document list (feeds into opportunities) |
| `mentors`, `mentor_requests` | Mentor directory and session requests |
| `student_profiles` | **Kaam Kahani**: story, skills JSON `[{id, evidence, confidence}]`, interests, constraints, cached explanations + language, surprise_seed, target_career |
| `parent_pitches` | token, user_id, career_id, lang, message |
| `classrooms`, `classroom_members` | Facilitator ↔ students |
| `device_profiles` | Shared-phone profiles: avatar, PIN hash, lockout |
| `endorsements` | Facilitator → student: text and/or audio_path, skill_ids |
| `opportunities` | type (apprenticeship / scheme / scholarship / training / job), organisation, district, eligibility_rules JSON, stipend, deadline, apply_url, source_url |
| `applications` | student ↔ opportunity, status, recommended_by |
| `modules`, `module_purchases` | Teacher-created courses, pricing model, purchases and sponsorships |
| `badge_tasks`, `badge_submissions`, `badges` | Proof-of-skill tasks, evidence, AI pre-check, teacher verification, issued Open Badge |
| `stories`, `story_questions` | Didi/Bhaiya voice stories and async Q&A |
| `api_clients` | Partner API keys (hashed), scopes |
| `sync_log` | Client UUIDs already processed (makes offline sync safe to retry) |

---

## 11. Routes & APIs

### Pages
| Route | Description |
| :--- | :--- |
| `/`, `/auth/login`, `/auth/register`, `/auth/demo-login` | Landing page and authentication |
| `/dashboard` | Continue learning, goals, quick actions ("Find My Skills") |
| `/hunar` | Kaam Kahani, Skill Passport, ladders, Kamai |
| `POST /hunar/analyze` · `/skill/remove` · `/surprise` · `/choose` · `/parent-pitch` | Kaam Kahani actions |
| `/hunar/p/:token` | Public Parent Pitch page (no login) |
| `/opportunities` | Opportunity Inbox |
| `/facilitator`, `/device` | Teacher Talent Radar, shared-phone mode |
| `/badges`, `/stories` | Proof-of-skill badges, Didi/Bhaiya stories |
| `/learn`, `/learn/:course`, `/learn/lesson/:id` | Courses and lessons |
| `/tutor`, `POST /tutor/chat` | AI Tutor |
| `/quizzes`, `/quizzes/take/:id`, `/quizzes/results/:id` | Quizzes |
| `/progress`, `/scholarships`, `/mentors`, `/career`, `/profile`, `/profile/settings` | Other modules |

### Partner REST API — `/api/v1` (header `X-API-Key`)
| Method & path | Purpose |
| :--- | :--- |
| `GET /api/v1/occupations` | Occupation catalogue (NCO/NSQF-tagged) |
| `GET /api/v1/opportunities` | List and filter opportunities |
| `POST /api/v1/opportunities` | NGO / employer / college posts an opportunity |
| `GET /api/v1/passport/:token` | Student Skill Passport (consent token only) |
| `GET /api/v1/badges/:id/verify` | Verify an issued badge |
| `GET /api/openapi.yaml` | OpenAPI 3 specification |

---

## 12. Knowledge Base (Curated Data)

| File | Contents | Size |
| :--- | :--- | :--- |
| `data/skills.json` | Closed skill list with English and Hindi names and categories (technical, agri, business, people, digital, craft, creative, physical, service, academic) | 33 skills |
| `data/careers.json` | Careers with sector, vocational/STEM flags, risk, required skills, `next` links (ladder), training steps (EN/HI), exams, Kamai figures and an **official source URL**; plus the regular-degree baseline | 25 careers (20 vocational, 16 non-STEM) |
| `data/programs.json` | ITI trades, NAPS, PMKVY, Suryamitra, SWAYAM: duration, cost, stipend, minimum education, source | — |
| Opportunities and scholarships | Seeded from official portals, plus partner postings through the API | 8+ scholarships, growing |

**Example careers:** Electrician, Solar PV Technician (Suryamitra), Village Solar Business, Farm Machinery & Pump Mechanic, Agri-Drone Pilot, EV Technician, Mobile Repair, Accounts Assistant (Tally/GST), Bank Mitra, FPO Manager, Para-vet / Pashu Sakhi, Dairy Entrepreneur, Tailoring & Boutique, Fashion Designer, Beautician, Tour Guide & Homestay, Commis Chef, ANM Nurse, Agniveer / Police, Forest Guard, Primary Teacher, Content Creator, Carpenter, Plumber, Software Developer.

**Sources used:** DGT (ITI trades), Apprenticeship India (NAPS), NISE (Suryamitra), PM Surya Ghar, Skill India Digital (PMKVY), DGCA Digital Sky, IIBF, SFAC, DAHD, NIFT, Ministry of Tourism, Indian Nursing Council, Join Indian Army, JSSC, CTET, AICTE, National Qualifications Register.

**Extending it:** adding a career or language means editing JSON or `utils/i18n.js`. No code changes are needed, which covers "easily extendable".

---

## 13. Alignment With the Problem Statement

### Objectives
| Objective | How Yukti delivers |
| :--- | :--- |
| **Discover**: voice/text conversation builds the profile; AI suggests options including non-STEM and vocational | Kaam Kahani voice story → Skill Passport with evidence; ladders guarantee vocational, non-STEM and surprise picks |
| **Learn**: personal pathway, what to learn next, competitive exams, wider options | Ladder steps, skills to learn, exams per path, links to lessons and SWAYAM/Skill India; target path shown on the dashboard |
| **Opportunity**: match to scholarships, schemes, apprenticeships, mentors, employers | Opportunity Inbox with rules-based eligibility; scholarships, mentors, Didi/Bhaiya |
| **Connect & Earn**: onboarding for mentors, companies and NGOs, listings, a way to apply | Partner API and onboarding, listings, apply tracking, verifiable badges |
| **Facilitator enablement**: spot talent, recommend students | Talent Radar, hidden-talent flags, voice endorsements, one-tap recommend |
| **Sustainability**: teachers build and run their own modules (free / per module / subscription) | Voice-to-Course Builder with a 70/30 revenue split and NGO sponsorship |

### "Must include"
| Requirement | Delivered by |
| :--- | :--- |
| (a) Local language, voice in and out, simple UI for low literacy | 9 languages, speech-to-text and read-aloud, Parent Pitch audio, icon-led mobile interface |
| (b) Low-end Android, offline/low-bandwidth syncing | PWA, Low-Data Mode, IndexedDB lessons, offline outbox sync |
| (c) Facilitator mode, one teacher with many students | Shared-phone mode and class Talent Radar |
| (d) AI grounded in real data | Closed skill list, curated careers and programs with sources, rules-as-code eligibility |
| (e) Easily accessible and extendable | Open source (MIT), JSON knowledge base, i18n dictionary, REST API |

### Technical requirements
| # | Requirement | Delivered by |
| :--: | :--- | :--- |
| 1 | Open-source architecture and extensibility | MIT license, 5 dependencies, data-driven careers and languages |
| 2 | Meaningful intelligence: LLM + knowledge base for profiling, matching, eligibility, pathways | LLM profiling, deterministic matching, rules eligibility, ladder pathways |
| 3 | Multilingual and voice | 9 languages, speech-to-text and text-to-speech everywhere |
| 4 | Low-bandwidth and offline-first with sync | Service worker, IndexedDB, outbox with safe retries |
| 5 | Standards-based APIs and interoperability | `/api/v1` with OpenAPI 3, Open Badges, NCO/NSQF tags |

---

## 14. Mapping to Judging Criteria

| Criterion (weight) | Our strongest evidence |
| :--- | :--- |
| **Innovation & Originality (25%)** | Skills from life stories instead of quizzes; option-widening by design; Parent Pitch; teacher creator economy; grounded-AI pattern |
| **Technical Feasibility & Architecture (20%)** | Clear split between LLM work and deterministic logic; closed-list validation; source-cited data; rules engine; 83+ automated tests; 5 dependencies; provider switch |
| **Usability & Scalability (20%)** | Voice-first, 9 languages, shared-phone mode, Low-Data Mode; stateless Express that scales horizontally; SQLite → PostgreSQL path; cached AI output |
| **Monetization (15%)** | Module marketplace (30% commission), NGO/CSR sponsorship, employer verified-talent access, B2G licensing |
| **Customer Impact & UX (20%)** | Time to first income shown up front; family buy-in; real applications and badges; dignity for vocational paths |

---

## 15. Business Model & Monetization

**Principle: always free for students.** The people who benefit from talent pay.

| Revenue stream | Payer | Model |
| :--- | :--- | :--- |
| **Teacher module marketplace** | Students (small fees) or sponsors | 30% platform commission on per-module (₹29–₹99) or subscription sales |
| **NGO / CSR sponsorship** | CSR budgets (Companies Act Sec. 135), NGOs | Sponsor modules, cohorts or districts; impact dashboards included |
| **Verified talent access** | Employers, apprenticeship establishments, training partners | Per-listing or per-hire fee for reaching consented passports and verified badges |
| **B2G licensing** | State skill missions, district administrations, education departments | Annual licence plus analytics on skill supply and gaps by district |
| **Training-partner lead generation** | PMKVY / Suryamitra / ITI partners | Per qualified enrolment |

**Cost advantages:**
- Deterministic engine instead of LLM calls for every decision.
- Cached AI text.
- A small model (`gpt-4o-mini`), so a full Kaam Kahani session costs well under ₹1 in API fees.
- Open-source stack and cheap hosting.

---

## 16. Impact & Key Metrics

| Metric | Why |
| :--- | :--- |
| Kaam Kahani stories completed, and confirmed skills per passport | Discovery reach and depth |
| % of chosen paths that are vocational or non-STEM; % who explore the 🎲 surprise | Proof of option-widening |
| Parent Pitch links shared and listened to | Family engagement |
| Opportunities applied for, and eligibility "unknowns" resolved | Moving from guidance to action |
| Apprenticeship / training enrolments and placements | Livelihood outcome |
| **Median months to first income** for users vs the degree baseline | Core economic impact |
| Verified badges issued; teacher endorsements | Trust and recognition |
| Active facilitators; students per facilitator; modules published and revenue | Scale and sustainability |

---

## 17. Lean Canvas

| Block | Content |
| :--- | :--- |
| **Problem** | (1) Rural students can't see their own practical skills or realistic careers. (2) Parents decide on income and safety without numbers. (3) Schemes, apprenticeships and employers are fragmented and unreachable. |
| **Existing alternatives** | Relatives' advice; generic career portals and aptitude tests (English-heavy); NSP / Skill India / NAPS portals used separately; rare school counsellors |
| **Solution** | Voice life-story → Skill Passport; grounded career ladders with surprise picks; Kamai Calculator; Parent Pitch; Opportunity Inbox with rules-based eligibility; teacher Talent Radar and module marketplace |
| **Key metrics** | Passports created; % vocational/non-STEM paths chosen; applications; enrolments and placements; median months to first income; active facilitators and module revenue |
| **Unique value proposition** | *"Tell your day in your language — we show the skills you already have, the job they lead to, when the money starts, and we help convince your family."* |
| **High-level concept** | "LinkedIn + career counsellor for village students, by voice" / "Duolingo-simple, Naukri-useful, in your mother tongue" |
| **Unfair advantage** | Evidence-backed skills data from real life stories; curated rural career ladder graph with sources; teacher network that brings classrooms and content; family-facing design |
| **Channels** | Government schools and ITIs through teachers; NGOs and SHGs; CSC village entrepreneurs; WhatsApp sharing (Parent Pitch); state skill missions; Didi/Bhaiya alumni |
| **Customer segments** | Users: rural students (Class 9 to graduation), village teachers. Payers: CSR/NGOs, employers and apprenticeship establishments, training partners, state governments. Early adopters: tribal districts of Jharkhand and Odisha. |
| **Cost structure** | AI API usage (small, cached); hosting; curation and data verification; facilitator onboarding; local-language content moderation |
| **Revenue streams** | Module marketplace commission; CSR sponsorship; employer per-hire/listing; B2G licences; training-partner leads |

---

## 18. Security, Privacy & Responsible AI

- **Secrets:** `OPENAI_API_KEY` and `SESSION_SECRET` live only in `.env`, which is git-ignored. Keys are sent in headers, never in URLs.
- **Accounts:** bcrypt password and PIN hashing; httpOnly, sameSite session cookies; PIN lockout in shared-phone mode.
- **Minimal sharing:** the Parent Pitch page shows only the first name, behind an unguessable token. Passport API access needs explicit student consent. No personal data in query strings.
- **Grounded AI:** a closed skill vocabulary, facts-only prompts, server-side validation, and source links on every number.
- **Human in the loop:** students can remove skills; teachers verify badges and endorsements; eligibility uses rules, not the LLM.
- **Honest numbers:** all earnings are labelled as estimates, with official sources, and compared against a baseline.
- **Bias checks:** the variety rules counter stereotyped steering (the surprise card crosses sectors whatever the student's gender or background).
- **Child safety:** no public profiles; mentor and alumni Q&A is moderated and asynchronous.

---

## 19. Setup, Configuration & Testing

```bash
npm install                 # install dependencies (first time)
cp .env.example .env        # Windows: copy .env.example .env
npm run seed                # create SQLite DB with demo data
npm start                   # http://localhost:3000
npm test                    # all automated test suites
```

| Variable | Required | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `OPENAI_API_KEY` | **Yes** (AI features) | — | ChatGPT for Kaam Kahani, explanations, Parent Pitch, AI Tutor, transcription, vision |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | Chat model name |
| `GEMINI_API_KEY` | No | — | Alternative provider, used only if no OpenAI key |
| `SESSION_SECRET` | Yes in production | dev value | Signs session cookies |
| `PORT` | No | `3000` | HTTP port |

**Demo account:** `demo@yukti.test` / `Demo@123`, or click **"Login as Demo Student (1-Click)"**.

**Test suites:**
- `tests/test-routes.js`: system and route tests (32).
- `tests/test-language-persistence.js`: language persistence (30).
- `tests/test-hunar.js`: Kaam Kahani engine and routes (21). Covers data integrity, variety rules, surprise rotation, income-priority ranking, Kamai maths, auth, passport actions, the public parent page and placeholder pages.

Tests run without any AI key, so they're deterministic.

---

## 20. Demo Script (4 minutes)

| Time | Show | Say |
| :--- | :--- | :--- |
| 0:00 | Problem slide | "93% of schools have no counsellor. Rahul fixes pumps but no one calls it a skill." |
| 0:30 | `/hunar`: 🎤 speak the Hindi demo story | "No quiz. He just tells his day." |
| 1:00 | Skill Passport with quotes | "Every skill is proven by his own words. AI can't invent skills; it can only pick from our list." |
| 1:30 | Ladders + 🎲 Surprise | "Always a vocational, a non-STEM and a surprise option. The AI widens choices." |
| 2:00 | Kamai chart | "Solar path: first income in about 4 months, around ₹8 lakh in 5 years, vs ₹1.4 lakh for a regular degree." |
| 2:30 | Parent Pitch on a phone ▶ | "Parents decide, so we talk to them, in their language, on WhatsApp." |
| 3:00 | Teacher Radar → endorse → Opportunity Inbox eligible → Apply | "One teacher, one phone, a whole class. Eligibility by rules, with reasons." |
| 3:30 | Teacher voice-to-course + revenue | "Teachers earn by teaching skills. That's our sustainability and monetization." |
| 3:50 | Architecture one-liner | "AI understands and explains; data and code decide. Open source, 9 languages, low data." |

---

## 21. Scalability & Roadmap

**Scaling from 10 to 10,000 users and beyond:**
- Stateless Express behind a load balancer.
- Move from SQLite to PostgreSQL (schema already portable) and keep sessions in Redis.
- Cache AI explanations per (career, skills, language). Queue AI calls.
- CDN for static assets. The PWA shell cuts repeat traffic.

**Roadmap:**
1. OTP / Aadhaar-less phone login for students without email.
2. **Bhashini / AI4Bharat** open Indic speech and translation models for Santhali and other low-resource languages, plus on-premise options.
3. Live integration with the **National Scholarship Portal, NAPS and Skill India Digital** where APIs allow.
4. Retrieval over NCERT and NSQF qualification packs for the AI Tutor and module builder.
5. IVR / missed-call voice line for feature phones; WhatsApp bot entry point.
6. DigiLocker push for badges; employer verification portal.
7. District skill-gap analytics for administrators.
8. On-device small models once low-end phone support is practical.

---

## 22. Known Limitations

- Kamai figures are **indicative** and vary by district; they need periodic verification against sources.
- Browser speech recognition needs Chrome and a connection, and has no native Santhali support (falls back to `hi-IN`). Planned fix: Bhashini / AI4Bharat.
- LLM quality varies by language. Low-resource languages need human review of generated content.
- Fully offline AI isn't supported; we target low bandwidth, as the brief scopes out zero-connectivity villages.
- Career catalogue breadth (25 careers today) must grow with partners. The JSON format makes this easy.

---

## 23. Glossary

| Term | Meaning |
| :--- | :--- |
| **Hunar** (हुनर) | Skill / talent |
| **Kaam Kahani** (काम कहानी) | "Work story": the voice life-story that reveals skills |
| **Raasta** (रास्ता) | Path: the career ladder |
| **Kamai** (कमाई) | Earnings: the earnings comparison calculator |
| **Skill Passport** | Evidence-backed record of a student's skills, endorsements and badges |
| **Parent Pitch** | AI-written spoken message to the family about a chosen path |
| **Didi / Bhaiya** | Elder sister / brother: near-peer alumni mentors |
| **Facilitator** | Village teacher or community worker using shared-phone mode |
| **NAPS** | National Apprenticeship Promotion Scheme (stipend-supported apprenticeships) |
| **PMKVY** | Pradhan Mantri Kaushal Vikas Yojana (free short-term skill courses) |
| **NSQF / NCO** | National Skills Qualifications Framework / National Classification of Occupations |
| **RPL** | Recognition of Prior Learning |

---

## 24. Research & Data Sources

- Citi India Hackathon problem statement and data references (DIKSHA, SWAYAM, Skill India, NAPS, NSP, AISHE, BHASHINI).
- Wadhwani Foundation, *Why career guidance is important for students*: 93% of schools lack a dedicated counsellor.
- Mentoring field experiments in Bhutan (HKUST research portal): near-peer mentoring raises interest, but parental scepticism and stigma limit TVET enrolment.
- Systematic review on mentoring and career development (Marjon repository): cultural proximity of mentors matters.
- Swisscontact and Kenya KNQA on Recognition of Prior Learning for informal skills.
- Skills-based matching with knowledge graphs (arXiv 2109.02554, 2603.14558), and LLM + career knowledge-graph prediction to reduce hallucination.
- RAG for AI career guidance in high schools (pilot study, 2025).
- Past approaches reviewed: Smart India Hackathon 2022 winner and 2024 finalist (EduNext), Bodhami, EON Vernacular Career Guide, IBM voice-based employment exchange research.
- Official career data portals listed in [Section 12](#12-knowledge-base-curated-data).

---

## 25. Appendix: Build Status Checklist

This document describes the full product. Use this table to track what is live in the codebase.

| Feature | Status |
| :--- | :--- |
| Learning foundation (courses, lessons, offline download, AI Tutor, quizzes, progress, scholarships, mentors, 9 languages, voice, PWA, Low-Data Mode) | ✅ Live |
| OpenAI provider switch (`utils/llm.js`) | ✅ Live |
| Kaam Kahani, Skill Passport, Career Ladders + Surprise, Kamai Calculator, Parent Pitch | ✅ Live (`/hunar`) |
| Teacher Talent Radar + shared-phone mode | 🟡 Placeholder page (`/hunar/teacher`) → build |
| Opportunity Inbox + eligibility engine + applications | 🟡 Placeholder page (`/hunar/opportunities`) → build |
| Proof-of-Skill Badges | 🟡 Placeholder page (`/hunar/badges`) → build |
| Didi / Bhaiya Stories | 🟡 Placeholder page (`/hunar/stories`) → build |
| Voice-to-Course Builder + marketplace | ⬜ To build |
| Partner API `/api/v1` + OpenAPI | ⬜ To build |
| Offline sync outbox | ⬜ To build |
| `data/programs.json` | ⬜ To build |
