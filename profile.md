# Profile Data — Soban Shankar

> Source of truth for portfolio content. All data below is verified from resume PDFs and GitHub (github.com/Soban-2004). No unverified claims (e.g. research papers) are included — see note at bottom.

---

## 1. Identity

- **Name:** Soban Shankar
- **Role / Target:** AI Engineer (LLMs, RAG, Agentic AI)
- **Location:** Chennai, India — open to relocation (Bengaluru)
- **Email:** ssoban2004@gmail.com
- **Phone:** +91-94443-89781
- **GitHub:** https://github.com/Soban-2004
- **LinkedIn:** https://www.linkedin.com/in/soban-shankar-7731b3305/

---

## 2. Headline / Tagline options

- "AI Engineer building production-grade agentic RAG systems, multi-agent orchestration, and retrieval pipelines."
- "I build systems that retrieve grounded evidence, reason over it, and take real action — not just prompts wrapped in a chatbot."

---

## 3. Professional Summary

AI Engineer with hands-on enterprise AI experience through a 6-month internship and multiple end-to-end Generative AI projects. Skilled in building AI applications using Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), agentic AI systems, and Model Context Protocol (MCP). Proficient in Python, LangChain, LangGraph, and vector databases.

---

## 4. Experience

### AI Engineering Intern — Drivestream
**Chennai, India | Jan 2026 – Jul 2026**

- Designed a multi-agent orchestration system to automate enterprise Oracle Fusion cloud transformation workflows, reducing manual configuration effort by ~60–70%.
- Developed a configuration automation agent that autonomously configured 20+ Oracle Fusion HCM and ERP modules, translating complex business rules into LLM-driven workflows.
- Built a conversational AI report agent using RAG over 2,000+ Oracle Fusion HCM table/view definitions, enabling schema-aware SQL generation and natural-language creation of OTBI and BI Publisher reports.

**Impact numbers to feature visually:** `60–70%` manual effort reduced · `20+` modules configured · `2,000+` schema objects indexed

---

## 5. Featured Projects

### 0. ArchMind — AI Architecture Workbench *(flagship)*
**Aug 2026 · Updated Oct 2026**
[GitHub](https://github.com/Soban-2004/Archmind-AI-Architect) · [Live Demo](https://140.245.234.125)

Describe a system in plain language and get back a real, validated system architecture — the AI never draws the
diagram directly, it only emits structured mutation commands checked against real structural rules before
anything reaches the canvas. Most "AI diagram" tools let the model directly generate a picture or a JSON blob
rendered as-is, so it can propose something structurally broken and the tool just draws it anyway. This doesn't:
the LLM only emits one of a handful of typed commands (add a node, connect two nodes, change a field), each
validated (connectivity registry, schema checks, duplicate-node detection) before it can touch the architecture
state — and that's the ONLY path in: a chat edit, a manual canvas drag-and-drop, and a reconstructed diagram from
an imported real GitHub repo all produce the exact same validated commands.

- Requirements interview (scale, budget, availability, consistency needs) → a grounded first design, never a
  single LLM call guessing at a diagram.
- Cost and capacity estimation across roughly 30 service, database, queue, dependency, and infrastructure types,
  using declared assumptions rather than an LLM estimate.
- Load & failure simulation — a traffic multiplier or a killed component drives a deterministic
  capacity-propagation model showing what breaks, in what order, and why, animated live on the canvas.
- A deterministic Analyzer scoring any design across 7 categories (scalability, reliability, security, cost,
  observability, performance, maintainability), citing the exact facts behind every finding, with a one-click
  "Fix it" back to the architect agent.
- Import a real, existing repo (zip or GitHub URL) — a deterministic discovery pipeline extracts real,
  source-attributed facts (routes, ORM models, SQL migrations, auth usage, real third-party API calls) across
  Python and JS/TS, hands only those facts to the LLM, and checks every proposed component against real citations
  before accepting it. Click a node to see the exact file and line that justified it.
- Version history supports branching from earlier designs, inspecting diffs, and comparing versions.
- Export produces `ARCHITECTURE.md`, `AI_BRIEF.md`, `docker-compose.yml`, and `.env.example`.
- Guest mode with real per-visitor privacy — no login, but projects are genuinely only visible to the browser
  that created them, via a private per-visitor identity, not just client-side hiding.

**Tech:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Flow, dagre, FastAPI, Pydantic, asyncpg,
PostgreSQL 16, OpenRouter, Groq, Mistral, Gemini, Tavily, Docker Compose, Caddy, OCI Ampere A1
**Headline stat:** `~30` modeled component types

**Portfolio placement:** the site's flagship project. The strongest story is the validated mutation pipeline:
model output proposes typed changes, backend rules decide what becomes architecture state, and every downstream
view operates on that accepted state.

---

### 1. AI Resume & Job Matcher — Full-Stack RAG Platform
**Aug 2025 – Nov 2025 · Updated Oct 2026**
[GitHub](https://github.com/Soban-2004/AI-Resume-Job-Matcher---Full-Stack-RAG-Platform) · [Live Demo](https://140.245.234.125/job-resume-matcher/)

- Full-stack AI recruitment platform (Next.js 16, FastAPI, Supabase, Qdrant) — resume analysis for job seekers, hiring workflows for recruiters.
- Hybrid retrieval: dense + sparse (BM25) search, reciprocal rank fusion, cross-encoder reranking, citation-backed AI responses.
- Three-stage recruiter funnel (dense prescreen → skill match → full evidence review), with explicit approval between rounds.
- Job seekers can inspect evidence and gaps, generate a tailored cover letter and ATS-oriented rewrite, run a separate fabrication check, and export PDF.
- Recruiters can create persistent projects, upload up to 25 resumes per batch, compare ranked candidates, and accumulate candidates across batches.
- Three-tier LLM fallback chain (Ollama Cloud → Gemini → Groq); Supabase auth + owner-scoped PostgreSQL records persist private work.

**Tech:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, FastAPI, Python 3.12, SQLAlchemy, PostgreSQL 17,
Supabase, Qdrant, Cohere embeddings/reranking, BM25, reciprocal rank fusion, Ollama Cloud, Gemini, Groq,
Docker Compose, Caddy, OCI
**Headline stat:** `32` current tests passing — 16 backend + 16 Playwright

**Recent additions (verified this round, mapped to a target job's skill checklist):**
- **Caching:** `embed_texts()` now caches every Cohere embedding by `(model, input_type, text)` in a bounded LRU — a recruiter batch re-embedding the same JD requirement text against 50 candidates now embeds each distinct string once, not 50 times.
- **Idempotency:** job creation across all 3 endpoints (job-seeker, guest demo, recruiter batch) hashes submitted content and dedupes a repeat within a short TTL, returning the original job instead of starting a duplicate.
- **Observability:** logs are now JSON lines (parseable by `jq`/any aggregator); Sentry wired in behind an optional `SENTRY_DSN`, a genuine no-op until configured.
- **OCR fallback:** PyMuPDF only reads a PDF's text layer, so a scanned/photographed resume used to silently extract to near-nothing. `document_loader` now detects that (extracted text below a length threshold) and falls back to OCR.space's hosted API — verified live against a real synthetic image-only PDF through the actual `load_document()` entry point, not just unit-tested.
- **Current validation:** 16 backend tests cover auth, ownership, upload constraints, deduplication, and atomic recruiter approvals; 16 Playwright tests cover desktop/mobile loading, protected routes, keyboard interaction, overflow, browser errors, and serious Axe violations.
- **Production:** Docker Compose on OCI behind a shared Caddy gateway, with health checks, restart policies, bounded logs, named volumes, and scheduled PostgreSQL backups.

---

### 2. Aster — Agentic RAG Customer Support
**Nov 2025 – Jan 2026 · Rebuilt Oct 2026**
[GitHub](https://github.com/Soban-2004/Agentic-RAG-Customer-Support-Platform-Flipkart-FAQ-) · [Live Demo](https://140.245.234.125/aster/)

- Production-minded support assistant built on a Flipkart help-centre dataset. Commerce records and handoffs are clearly labelled simulations; it is not connected to Flipkart.
- Eight bounded intents route turns to deterministic responses, grounded FAQ retrieval, or one authorized account action; off-topic and mixed-scope requests never reach an unrestricted answer path.
- Versioned Qdrant knowledge collections, Cohere embeddings/reranking, Groq synthesis, citations, and a public-only semantic cache support grounded FAQ answers.
- Durable WebSocket chat uses typed frames, stable client message IDs, reconnect replay, deadlines, idempotent mutations, and committed completion semantics.
- PostgreSQL stores accounts, revocable sessions, threads, messages, quotas, and an action ledger; an anonymous demo remains ephemeral.

**Tech:** React 19, TypeScript 6, Vite 8, Tailwind CSS 4, FastAPI, WebSockets, LlamaIndex FunctionAgent,
LiteLLM, Groq, Prompt Guard 2, Cohere, Qdrant 1.16, PostgreSQL 17, Langfuse/OpenInference, Docker, Caddy, OCI
**Headline stat:** `71/71` deterministic backend and PostgreSQL tests passing

**Recent additions (verified this round):**
- **Safety boundary:** identity comes from server-side actor context; authenticated tools recheck session and thread ownership; only one account action may run per turn.
- **Private cache boundary:** only allowlisted public FAQ questions can enter the shared cache. Account and conversation content cannot.
- **Knowledge releases:** ingestion builds and validates an immutable collection, then atomically moves the live alias; prior revisions remain available for rollback.
- **Current validation:** 71/71 deterministic backend/PostgreSQL tests, 24/24 live intent cases, and production WebSocket smoke tests covering citations, tools, notes, simulated handoff, prompt injection, invalid frames, reconnect-safe IDs, and scope control.
- **Production:** OCI Always Free A1 with Caddy, private PostgreSQL/Qdrant services, non-root containers, health probes, daily backups, and log rotation.

---

### 3. FitNova — AI Sales-Call Intelligence System
**Jul 2026 – Aug 2026**
[GitHub](https://github.com/Soban-2004/fitnova-ai-call-auditor) · [Frontend Live](https://fitnova-ai-call-auditor.vercel.app) · [Backend Health](https://fitnova-backend-t1nz.onrender.com/api/health)

A call-intelligence platform, not just a scoring pipeline. The core is an AI pipeline that ingests recorded sales calls, transcribes and diarizes them, runs a 3-pass LLM analysis (speaker roles, compliance/quality issues, dimension ratings), computes a deterministic score, and surfaces all of it through director/team-leader/advisor dashboards with a live contest-and-review workflow. Built at production-level care, not as a demo — real tests (35, integration-style against a real DB), real error handling, real failure-path recovery. On top of that core, three real product surfaces: real-time coaching for a call already in progress, an AI voice agent that runs its own qualification calls, and a leads pipeline connecting that agent's hand-off to a human advisor (see "Platform expansion" below).

**Core features:**
- Director / Team Leader / Advisor dashboards with score-trend charts (4/8/12-week ranges)
- Filterable, paginated, URL-driven call log (shareable filtered views)
- Call detail page: diarized transcript synced to an audio player, per-tag issue cards, full score version history
- Contest/confirm/dismiss workflow — a dismissal triggers a live, versioned score recalculation (scores are appended, never overwritten)
- Live updates via Server-Sent Events — no polling, no manual reload

**Architecture highlights:**
- State machine (`QUEUED → TRANSCRIBING → ANALYZING → COMPLETED/FAILED`) lives in a DB column, driven by a background async worker polling — no message broker needed at this scale
- 3-pass LLM analysis, each pass narrow, schema-validated, `temperature=0` before the next step touches the output
- **3-layer tag validation** — an issue tag is never trusted on the LLM's word alone: Pydantic schema check → RapidFuzz fuzzy match against the transcript → Gemini semantic embeddings for genuine paraphrases fuzzy match misses
- LLM provider fallback chain: Groq → Gemini → Ollama Cloud (thin custom abstraction, no LangChain/LiteLLM)
- Deterministic scoring — the LLM never does arithmetic; dimension ratings feed a weighted base score, validated tags apply severity-based deductions, deduplicated by tag type
- Durable audio storage as an additive second field (Backblaze B2), not a replacement for the local path already proven to work

**Tech:** FastAPI (async), WebSockets, SQLAlchemy 2.0, Neon Postgres, Next.js 14 (App Router), TypeScript, Deepgram Nova-3 (batch + live streaming), Cartesia (TTS), Groq/Gemini/Ollama, RapidFuzz, Server-Sent Events, Web Audio API, Render + Vercel

**Recent additions (verified this round):**
- **Eval harness + live incident (the strongest story here):** `scripts/eval_issue_detection.py` runs 3 hand-written, hand-labeled transcript scenarios (a clean call, a high-pressure call, a compliance-violation call) through the real issue-detection pipeline and scores recall/false-positives against known-correct answers. On its very first run it caught both the Groq tier (`llama-3.3-70b-versatile`, deprecated by Groq 2026-08-16) and the Gemini tier (`gemini-2.0-flash`, retired) 404ing on every call in production, silently rescued by falling all the way through to the Ollama tier. Fixed both model configs, which surfaced a second bug — the reasoning-model replacement (`gpt-oss-20b`) needed a `reasoning_effort` parameter the pinned SDK didn't natively support, fixed via `extra_body` passthrough. Verified clean across 5 consecutive live runs.
- **Rate limiting** (`services/rate_limit.py`): per-IP cooldown + global daily cap on `POST /api/upload`, the one endpoint with no auth at all — closes a real DoS/cost-drain hole, not a hypothetical one.
- **Observability:** a new `llm_call_logs` table (real Alembic migration), an async `track_llm_call()` wrapper around every LLM call in the 3-pass analysis chain and the validation layer's semantic-similarity calls, and an admin-gated `GET /api/admin/llm-stats` endpoint — this is what turned "two dead models" from a guess into a queryable fact.
- **Caching:** a 30-second TTL cache on the director/team/advisor dashboards (previously recomputed from scratch on every request), with explicit invalidation wired into the tag contest/confirm/dismiss actions so a team leader's action is never served stale.
- Already present before this round, not new, but worth knowing cold for interviews: idempotency (`UNIQUE(source_system, external_id)`), the DB-backed worker queue (`SELECT...FOR UPDATE SKIP LOCKED`), retries/backoff, event-driven SSE pub-sub, and Human-in-the-loop (`contest.py`'s advisor-contests → team-leader-reviews → live-rescore state machine) — arguably the single strongest, most literal HITL example across either project.

**Platform expansion (verified this round — Sep 2026):** three new product surfaces on top of the core pipeline above, plus further hardening.
- **Live Call Coaching** — a real-time companion for a call already happening. Streams the advisor's mic to Deepgram's live streaming API over a WebSocket and surfaces short coaching nudges as the conversation unfolds, instead of only scoring after the fact. When the session ends, it's persisted and scored through the exact same pipeline as an uploaded recording.
- **Voice Intake Agent** — an AI that runs its own qualification calls. It listens, decides what to say via an LLM, and speaks the reply back with Cartesia TTS, including barge-in (it stops talking if the caller interrupts). When the call ends, it extracts structured lead data (name, goal, health notes, availability, confirmed time) into a trackable Lead — a real hand-off, not just a transcript.
- **Leads pipeline** — every lead the voice agent creates is now assignable to a human advisor and tracked through a New → Assigned → Contacted → Trial Booked pipeline, connecting the AI's qualification call to the human follow-up it hands off to.
- **Further platform hardening**, alongside the three surfaces above: per-LLM-call telemetry (latency, outcome, which provider in the Groq→Gemini→Ollama fallback chain actually served the call), persisted so it survives a restart, with an admin endpoint to query it; rate limiting on the one unauthenticated, state-mutating endpoint (upload), bounding how much pipeline capacity a scripted abuser could burn; short-TTL in-memory caching on the dashboard aggregation endpoints, explicitly invalidated the moment a score actually changes underneath them, rather than served stale.
- **A full UI/UX design pass** across all of it — a colorful, dark-mode-capable design system with identity-based color coding for teams/advisors/tags kept strictly separate from status/severity colors, dense-table interactions (hover-lift instead of zebra striping, inline magnitude bars, filter chips), a real Web-Audio-driven level meter on the live call screen, and a "color displacement" live-state indicator instead of a blinking dot.
- Net effect: what shipped as a single-purpose scoring tool is now a three-surface platform — analyze past calls, coach a call as it happens, and run AI-led intake calls that hand off to a human — with the telemetry and rate-limiting a real deployed service needs, and a UI that looks intentional rather than templated.

**What makes this stand out:** the README documents real production gotchas hit during actual deployment (a Python-version wheel-build failure on Render, a CORS misconfiguration, boto3's SigV2-vs-S3v4 presigned URL mismatch against Backblaze) and is explicit about what's simplified vs. real (e.g. advisor identity is asserted metadata, not a voiceprint; single-process SSE broadcaster). This kind of engineering honesty is rare and worth featuring prominently — possibly with a pull-quote from the "What's real vs. what's simplified" section.

**Portfolio note:** was the site's flagship/hero project; AI Architect (§5 #0, added later) took that slot — comparable or greater technical depth, and more recent. FitNova stays a fully featured project with its own distinct card color (violet/"secondary"), just no longer leading the carousel. Has an architecture diagram already built from the README's own flowcharts (call state machine, 3-layer validation flow, deployment topology).

---

### 4. End-to-End Cricket Data Analysis *(earlier work)*
[GitHub](https://github.com/Soban-2004/ICC-Mens-T20-Cricket-World-Cup-2024-Data-Analysis)

- Scraped ICC Men's T20 World Cup 2024 data from ESPN Cricinfo (BeautifulSoup).
- Processed/analyzed match statistics with Python + Pandas.
- Built a 7-page interactive Power BI dashboard: Overall Tournament Analysis, Player Analysis (broken into Openers, Middle Order, Finishers, All-Rounders, Bowlers), and a data-driven "Final 11 (Best XI)" of the tournament.

**Tech:** Python, Pandas, BeautifulSoup, Power BI
**Placement:** "Earlier Work" section, not featured — shows range without diluting AI focus. Has real dashboard screenshots in the repo worth using as visuals.

---

## 5b. Machine Learning Internship — Prodigy InfoTech *(earlier work, confirmed via LinkedIn)*
**Mar–Apr 2024 (30 days)**

Corroborated by your LinkedIn role edit screenshot, which matches your GitHub repos `House_price_prediction` and `Dog-vs-Cat-Classification` directly:

- Developed a predictive regression model to estimate housing prices — used Pandas for feature engineering, Scikit-Learn for model optimization.
- Built a Convolutional Neural Network (CNN) using TensorFlow to classify images (Dogs vs. Cats), implementing data augmentation to improve validation accuracy.

**Skills tagged on LinkedIn:** Jupyter, Matplotlib, SQL, Machine Learning
**Placement:** Earlier Work / internship history — supporting credential, not a featured project.

---

## 6. Open Source

**langchain-ai/langchain — PR #39238 (merged)**
Fixed a data-loss bug where `RecursiveJsonSplitter.split_json()` silently discarded non-dict top-level input instead of raising an error. Traced the regression, opened issue #39192, shipped a merged fix with 9 regression tests covering lists, primitives, `None`, and existing dict behavior — validated against 149 passing tests.

[PR link](https://github.com/langchain-ai/langchain/pull/39238)

---

## 7. Education

**B.E. Computer Science and Engineering (Honours)**
SRM Easwari Engineering College | 2022–2026 | CGPA: 8.8/10

---

## 8. Certifications

Listed in reverse chronological order (newest → oldest) — flipped from the
original oldest-first ordering per feedback; Projects above still runs
oldest→newest, so these two lists deliberately go opposite directions.
Two entries share August 2024 with no day-of-month shown on the site; the
underlying verified days (Google AI Essentials: Aug 8; MongoDB: read as
Aug 10) are what determined their relative order below.

- **Oracle Cloud Infrastructure – Agentic AI Certified Foundations Associate** — completed Aug 2026
- **Oracle Cloud Infrastructure 2025 Certified Foundations Associate** — completed Dec 24, 2025
  *(verified from certificate PDF; expiry date and credential ID intentionally omitted from the public-facing site — completion date only. Exact day for "AI Foundations Associate" below isn't known, only "Dec 2025" — the two could be either order relative to each other)*
- **Oracle Cloud Infrastructure – AI Foundations Associate** — completed Dec 2025
- **Data Analytics with Python** — NPTEL / IIT Roorkee (Swayam), Jan–Apr 2025, 12-week course
  Score: 86% (Elite, Top 5% — "Topper") · Online Assignments 24.69/25 · Proctored Exam 61.22/75
  Roll No: NPTEL25CS17S843207084 · 10,022 candidates certified in this course
  *(verified from certificate PDF; ordered here by the course's Apr 2025 end date)*
- **Machine Learning Specialization** — Stanford University (via Coursera), completed Jan 20, 2025
  3 courses: Supervised Machine Learning: Regression and Classification · Advanced Learning Algorithms ·
  Unsupervised Learning, Recommenders, Reinforcement Learning
  Instructor: Andrew Ng (DeepLearning.AI)
  Verify: https://coursera.org/verify/specialization/TZJIJDLOYNF2
  *(verified from certificate PDF; site shows month/year only, per user request)*
- **Introduction to Internet of Things** — NPTEL (Swayam), Jul–Oct 2024, 12-week course
  Score: 91% (Top 2%) · Online Assignments 21.66/25 · Proctored Exam 69/75 · Credits recommended: 3 or 4
  Roll No: NPTEL24CS115S1452502820
  *(verified from certificate PDF; issuing institute not specified on the certificate itself, unlike the Data Analytics one which names IIT Roorkee — don't attribute one; ordered here by the course's Oct 2024 end date)*
- **Networking Basics** — Cisco Networking Academy, completed Sep 2024
  *(verified — completion month/year per user confirmation; certificate image itself didn't show a visible date)*
- **Introduction to MongoDB (For Students)** — MongoDB, completed Aug 2024
  Credential ID: MDByhm5ofsn4g
  *(the certificate's printed date, 08-10-2024, was ambiguous MM-DD vs DD-MM; site shows month/year only per user request, read as August 2024)*
- **Google AI Essentials** — Coursera (an online non-credit course authorized by Google, offered through Coursera), completed Aug 8, 2024
  Verify: https://coursera.org/verify/7AGU8IHCBC8X
  *(verified from certificate PDF; site shows month/year only, per user request)*

---

## 9. Technical Skills (grouped for UI display)

**Programming & Backend:** Python (Pandas, NumPy), FastAPI, SQL, MySQL, PostgreSQL (Supabase)

**LLM & Agentic AI:** LangChain, LangGraph, LlamaIndex, MCP (Model Context Protocol), RAG Pipelines, Prompt Engineering

**Speech & Voice AI:** Deepgram Nova-3 (STT), Speaker Diarization, Multilingual/Code-Switched Audio

**Vector DB & Retrieval:** Qdrant, Weaviate, Cohere Embeddings & Reranking, Hybrid Search (BM25) & Reranking, Hugging Face Models

**LLMOps & Evaluation:** LiteLLM, LLM Guard, Langfuse, RAGAS, OpenRouter, Groq API, OpenAI API

**Machine Learning:** Scikit-Learn, TensorFlow, NLP (NLTK & spaCy)

**Cloud & DevOps:** Git, GitHub, Docker, Caddy, Nginx, Redis, Linux, Azure, Oracle Cloud Infrastructure (OCI), Render, Vercel

---

## 10. Impact Snapshot (for a stats/counter section in the UI)

| Metric | Value |
|---|---|
| Aster deterministic validation | 71/71 backend and PostgreSQL tests |
| Resume Matcher validation | 32 tests (16 backend + 16 Playwright) |
| Schema scale indexed | 2,000+ HCM tables/views via RAG |
| Config effort reduced | ~60–70% manual effort automated |
| OSS PR merged | langchain-ai/langchain #39238 |

---

## 11. Research & Publications (verified against official IEEE conference proceedings)

Both papers below are now independently confirmed — bibliographic details verified against IEEE proceedings/J-GLOBAL, and plain-English explanations added below for portfolio copy. Contribution-level detail (exactly which section you worked on) is not established from public sources — safe to describe as co-author, not to claim a specific sub-contribution unless you confirm it.

### 1. Survey on Methodologies to Implement Automated Data Entry Using Smart Pen

**Authors:** M. Sivakumar, **Soban Shankar** (2nd author), K. S. Vishal, J. Richardson, D. Kavitha
**Conference:** 2025 2nd International Conference on Computing and Data Science (ICCDS), IEEE Proceedings, pages 1–6 (proceedings page 688)
**Affiliation:** Easwari Engineering College, Dept. of CSE
**Sources:** [J-GLOBAL record](https://jglobal.jst.go.jp/en/public/202502257505682938) · [IEEE Xplore](https://ieeexplore.ieee.org/document/11209653)

**What it's about (portfolio-safe description):**
A survey of methodologies for using smart/digital pen technology to automate data entry from handwriting — examining how pen-stroke capture, handwriting recognition, and field-mapping techniques can convert handwritten form input directly into structured digital data, without manual transcription.

**Recommended one-liner for site:**
> "Co-authored a survey on methodologies for smart-pen-based automated data entry — examining handwriting recognition, pattern-recognition approaches, and techniques for converting handwritten input into structured digital information."

**Note:** This is a survey/review paper, not a novel system you built — be precise about that framing (don't say "developed a smart pen system"). If asked in an interview what your specific contribution was, be upfront that it's not something we've broken down section-by-section; offer to clarify separately if needed.

---

### 2. Automated Water Quality Monitoring and Prediction System Using AI and PINNs for Sustainable Aquaculture

**Authors:** C. Renil Immanuel, S. Kayalvizhi, **Soban Shankar** (3rd author)
**Conference:** 2025 IConSCEPT (International Conference on Signal Processing, Computation, Electronics, Power and Telecommunication)
**DOI:** `10.1109/IConSCEPT66142.2025.11436713`
**Source:** [IEEE Xplore](https://ieeexplore.ieee.org/document/11436713) · [ResearchGate](https://www.researchgate.net/publication/403068370_Automated_Water_Quality_Monitoring_and_Prediction_System_Using_AI_and_PINNs_for_Sustainable_Aquaculture)

**What it's about (portfolio-safe description):**
Uses AI combined with Physics-Informed Neural Networks (PINNs) to monitor and predict water-quality conditions in aquaculture (fish farming), moving from reactive monitoring (react after a problem occurs) to predictive monitoring (anticipate and intervene before conditions become harmful). PINNs differ from standard neural networks by incorporating known physical constraints into training, not just historical sensor data — producing predictions more consistent with how the real environmental system behaves.

**Recommended one-liner for site:**
> "Co-authored a research paper on automated water-quality monitoring and prediction for sustainable aquaculture, using AI with Physics-Informed Neural Networks (PINNs) to move from reactive to predictive water-quality management."

**Interview-ready explainer for "what's a PINN?":**
> "A Physics-Informed Neural Network doesn't rely only on observed data — it incorporates known physical relationships or constraints into training, so predictions stay consistent with how the underlying physical system actually behaves."

**Note:** Specific dataset, sensors, or architecture details are not confirmed from public sources — don't state specifics (e.g. which sensors, which parameters) unless you can verify from the actual paper PDF.

---

**Portfolio placement suggestion:** A "Research" section separate from "Projects" — short cards for each paper with the one-liner + conference name + DOI/link, not full abstracts. Keeps it credible without overclaiming depth you can't back up in an interview.

## 12. Not included

Not included (no reliable source found / not worth featuring): NPTEL IoT certification claim, Prodigy InfoTech internship (from oldest resume, superseded by Drivestream) — can add back if you want them included, just confirm.

---

## 14. Confirmed for build

- **Resume version to use:** Voice AI Engineer resume (2026, has FitNova + Aster projects) — confirmed
- **FitNova:** full details pulled from GitHub README — confirmed as flagship project
- **Cricket project:** confirmed for inclusion as earlier work

## 15. Still open

- [ ] Design tone: minimal/technical vs bold/playful, any design references
- [ ] Any additional certifications beyond NPTEL/OCI/Stanford ML
