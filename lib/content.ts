// lib/content.ts
//
// Single source of truth for every fact rendered on the site.
// Every value here is transcribed from `profile.md` at the repo root — nothing
// invented. If a claim needs to change, change it in profile.md first, then here.
//
// Note on `TechNode.relatedProjectIds`: a project is only linked to a skill when
// that skill is verifiably evidenced in profile.md's text for that project (its
// title, bullet points, or "Tech:" line) — not inferred because it's "probably"
// used. An empty `relatedProjectIds` array is expected and fine for skills that
// are real but not tied to a specific featured project in the copy (e.g. Git,
// SQL) — the graph can still display the node, just without a connecting line.

export interface ImpactStat {
  label: string;
  value: string; // e.g. "95%", "4.5s → 1s" — kept as string to preserve exact formatting
  numericValue?: number; // for count-up animation, when a single clean number applies
  suffix?: string; // e.g. "%", "+"
}

export interface Project {
  id: string;
  name: string;
  period: string;
  description: string;
  // A plain-language "what is this" sentence, not a shorter cut of
  // `description` — that field leads with pipeline/architecture detail
  // (retrieval strategy, tool-call order), which reads fine in full but
  // turns into an unhelpful fragment when clamped to fit a phone screen
  // (e.g. cut off mid-list at "Pipeline: query → dense + BM25 retrieval
  // →..."). This is what the mobile card actually shows instead.
  shortDescription: string;
  highlights: string[];
  techTags: string[]; // full display list, as written in profile.md's "Tech:" line
  githubUrl?: string;
  liveUrl?: string;
  secondaryUrl?: { label: string; url: string }; // e.g. FitNova's backend health check
  headlineStat: ImpactStat;
  featured: boolean;
  earlierWork?: boolean;
  caseStudyRoute?: string; // e.g. "/work/fitnova"
  screenshot?: { src: string; alt: string; width: number; height: number };
}

export interface ResearchPaper {
  id: string;
  title: string;
  authorsNote: string; // e.g. "Co-authored — 2nd of 5 authors"
  conference: string;
  year: string;
  oneLiner: string;
  sourceLabel: string; // e.g. "IEEE proceedings TOC"
  sourceUrl: string; // primary source, not a secondary aggregator
  doi?: string;
}

export interface OpenSourceContribution {
  repo: string;
  prNumber: string;
  prUrl: string;
  issueNumber?: string;
  issueUrl?: string;
  before: string;
  after: string;
  testsAdded: number;
  totalPassing: number;
}

export type TechCategory =
  | "backend"
  | "llm-agentic"
  | "voice"
  | "vector-db"
  | "llmops"
  | "ml"
  | "cloud-devops";

export interface TechNode {
  id: string;
  label: string;
  category: TechCategory;
  relatedProjectIds: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  detail?: string; // e.g. score/percentile, verified from certificate PDF
  items?: string[]; // e.g. the individual courses making up a multi-course specialization
  // Only set where profile.md actually documents a real public verify link
  // (2 of the 9, both Coursera) — most of these certs have no public
  // verify URL at all (Oracle's aren't public, NPTEL's are roll-number-
  // based, Cisco/MongoDB don't publish one), so this stays undefined for
  // the rest rather than linking to something that doesn't exist.
  verifyUrl?: string;
}

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

export const identity = {
  name: "Soban Shankar",
  role: "AI Engineer (LLMs, RAG, Agentic AI)",
  location: "Chennai, India",
  relocation: "open to relocation",
  email: "ssoban2004@gmail.com",
  phone: "+91 94443 89781", // tel: link uses the digits-only form, see Contact.tsx
  github: "https://github.com/Soban-2004",
  linkedin: "https://www.linkedin.com/in/soban-shankar-7731b3305/",
  resumeUrl: "/resume-soban-shankar-2026.pdf", // served from public/ — stale "TODO: drop the PDF in" note removed, it's already there and current
};

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const hero = {
  headline:
    "AI Engineer building production-grade agentic RAG systems, multi-agent orchestration, and retrieval pipelines.",
  subline:
    "I build systems that retrieve grounded evidence, reason over it, and take real action — not just prompts wrapped in a chatbot.",
  locationLine: `${identity.location} — ${identity.relocation}`,
};

// ---------------------------------------------------------------------------
// About (first-person, every clause traceable to profile.md §3)
// ---------------------------------------------------------------------------

export const about = {
  paragraph:
    "I'm an AI Engineer with hands-on enterprise AI experience through a 6-month internship and several end-to-end generative AI projects I built and shipped myself. My focus is production systems built on large language models, retrieval-augmented generation, and agentic AI — grounded in Python, LangChain, LangGraph, and vector databases. I care less about wiring a demo together and more about the parts that make a system trustworthy in production: validating what a model outputs, handling provider failures gracefully, and knowing exactly which parts of a pipeline are guessed versus verified.",
};

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export const experience = {
  title: "AI Engineering Intern",
  company: "Drivestream",
  // Drivestream's own "three diamond" mark — pulled from their site's own
  // favicon reference (drivestream.com/hubfs/drivestream-three-diamond.png),
  // not redrawn or invented. Red-on-transparent, so ExperienceCard renders
  // it inside a light chip rather than straight on the card's dark bg.
  logo: { src: "/logos/drivestream.png", width: 4495, height: 5045, alt: "Drivestream logo" },
  location: "Chennai, India",
  period: "Jan 2026 – Jul 2026",
  bullets: [
    "Designed a multi-agent orchestration system to automate enterprise Oracle Fusion cloud transformation workflows, reducing manual configuration effort by ~60–70%.",
    "Developed a configuration automation agent that autonomously configured 20+ Oracle Fusion HCM and ERP modules, translating complex business rules into LLM-driven workflows.",
    "Built a conversational AI report agent using RAG over 2,000+ Oracle Fusion HCM table/view definitions, enabling schema-aware SQL generation and natural-language creation of OTBI and BI Publisher reports.",
  ],
  stats: [
    { label: "Manual effort reduced", value: "60–70%", numericValue: 65, suffix: "%" },
    { label: "Modules configured", value: "20+", numericValue: 20, suffix: "+" },
    { label: "Schema objects indexed", value: "2,000+", numericValue: 2000, suffix: "+" },
  ] satisfies ImpactStat[],
};

// profile.md §5b — first internship, predates Drivestream. Supporting
// credential, not a featured role — rendered as a compact secondary entry
// beneath the main experience card, not a second full timeline item.
export interface EarlierExperience {
  title: string;
  company: string;
  period: string;
  bullets: string[];
  skills: string[];
}

export const earlierExperience: EarlierExperience[] = [
  {
    title: "Machine Learning Intern",
    company: "Prodigy InfoTech",
    period: "Mar–Apr 2024 · 30 days",
    bullets: [
      "Developed a predictive regression model to estimate housing prices — Pandas for feature engineering, Scikit-Learn for model optimization.",
      "Built a Convolutional Neural Network (CNN) with TensorFlow to classify images (dogs vs. cats), using data augmentation to improve validation accuracy.",
    ],
    skills: ["Jupyter", "Matplotlib", "SQL", "Machine Learning"],
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projects: Project[] = [
  {
    // New flagship project as of this addition — see Projects.tsx for the
    // slide ordering/variant that makes that visual (ArchMind now
    // "flagship"/accent-green in the carousel, FitNova moved to the new
    // "secondary"/violet variant rather than being demoted into sharing
    // an existing color).
    // period: confirmed by user — Aug 2026 (was a "2026"-only placeholder
    // before that, since the source brief didn't supply a date range).
    id: "ai-architect",
    name: "ArchMind",
    period: "Aug 2026 · Updated Oct 2026",
    description:
      "AI architecture workbench that turns a product idea or an existing repository into a validated, versioned system design. Chat, direct canvas edits, and repository reconstruction all converge on typed mutation commands that pass schema and structural validation before the React Flow canvas renders the accepted state.",
    shortDescription:
      "Design, validate, compare, and pressure-test a system architecture — the AI proposes changes, but validated state always draws the diagram.",
    highlights: [
      "Requirements interview → real architecture (scale, budget, availability, consistency needs) — never a single LLM call guessing at a diagram.",
      "Cost and capacity estimation across roughly 30 service, database, queue, dependency, and infrastructure types, using declared assumptions rather than an LLM estimate.",
      "Load & failure simulation — pick a traffic multiplier or kill a component, and a deterministic capacity-propagation model shows what breaks, in what order, and why, animated live on the canvas.",
      "A deterministic Analyzer scores scalability, reliability, security, cost, observability, performance, and maintainability, with evidence behind each finding.",
      "Import a real, existing repo (zip or GitHub URL) — a deterministic discovery pipeline extracts source-attributed facts (routes, ORM models, SQL migrations, auth usage, real third-party API calls) across Python and JS/TS, and every proposed component is checked against real citations before being accepted. Click a node to see the exact file and line that justified it.",
      "Version history supports branching, diffs, and design comparison; exports include architecture docs, an AI brief, Docker Compose, and an environment template.",
    ],
    // First 3 (the card's own chip row) picked to signal what this
    // actually is at a glance: the backend-AI infra (FastAPI, Groq) and
    // the canvas technology (React Flow) that makes it visually distinct
    // from a typical chat-only AI tool.
    techTags: [
      "FastAPI",
      "React Flow",
      "Groq",
      "Pydantic v2",
      "PostgreSQL 16",
      "Next.js 16",
      "React 19",
      "Tailwind CSS 4",
      "dagre",
      "asyncpg",
      "OpenRouter",
      "Mistral",
      "Gemini",
      "Tavily",
      "Docker Compose",
      "Caddy",
      "OCI Ampere A1",
    ],
    githubUrl: "https://github.com/Soban-2004/Archmind-AI-Architect",
    liveUrl: "https://140.245.234.125",
    headlineStat: {
      label: "Modeled service, data, queue & infrastructure types",
      value: "~30",
      numericValue: 30,
      suffix: "+",
    },
    featured: true,
    caseStudyRoute: "/work/ai-architect",
  },
  {
    id: "resume-matcher",
    name: "AI Resume & Job Matcher",
    period: "Aug 2025 – Nov 2025 · Updated Oct 2026",
    description:
      "Evidence-first recruitment platform for job seekers and recruiters. Pipeline: resume and job description → dense + BM25 retrieval → reciprocal rank fusion → Cohere reranking → requirement-level verdicts with cited resume evidence, visible gaps, and a weighted fit report.",
    shortDescription: "Evidence-first resume matching with cited requirements, honest gaps, ATS rewrites, and a staged recruiter funnel.",
    highlights: [
      "Hybrid retrieval: dense + sparse (BM25) search, reciprocal rank fusion, cross-encoder reranking, citation-backed AI responses.",
      "Three-stage recruiter funnel — dense prescreen, lightweight skill matching, then full evidence retrieval and requirement-level LLM review — pauses for approval between rounds.",
      "Job seekers can inspect eligibility, supporting evidence, and gaps; generate a cover letter and ATS-oriented rewrite; run a separate fabrication check; and export the accepted resume as PDF.",
      "Recruiters can create persistent hiring projects, upload up to 25 resumes per batch, compare ranked candidates, and accumulate candidates across multiple batches.",
      "Supabase authentication and owner-scoped PostgreSQL records protect saved reports and recruiter projects; fixed server-side samples provide an account-free demo.",
      "OCR fallback handles scanned PDFs; rolling rate limits, content-based deduplication, upload limits, structured logs, and optional Sentry reporting harden the production path.",
    ],
    // First 3 (the ones ProjectCard shows as chips) specified directly —
    // "RAG (Retrieval-Augmented Generation)" and "Hybrid Search &
    // Reranking" are category labels for what this project verifiably
    // does (dense+BM25 hybrid retrieval, cross-encoder reranking, per the
    // highlights above), not new unverified claims. "Hybrid Search &
    // Reranking" replaces the old separate "BM25"/"Cross-encoder
    // reranking" tags rather than duplicating them.
    techTags: [
      "RAG (Retrieval-Augmented Generation)",
      "Hybrid Search & Reranking",
      "FastAPI",
      "Qdrant",
      "Cohere",
      "Ollama Cloud",
      "Gemini",
      "Groq",
      "Next.js 16",
      "React 19",
      "PostgreSQL 17",
      "Supabase",
      "OCR",
      "Docker Compose",
      "Caddy",
      "OCI",
    ],
    githubUrl: "https://github.com/Soban-2004/AI-Resume-Job-Matcher---Full-Stack-RAG-Platform",
    liveUrl: "https://140.245.234.125/job-resume-matcher/",
    headlineStat: { label: "Backend + Playwright tests passing", value: "32", numericValue: 32 },
    featured: true,
    caseStudyRoute: "/work/resume-matcher",
  },
  {
    id: "flipkart-faq",
    name: "Aster",
    period: "Nov 2025 – Jan 2026 · Rebuilt Oct 2026",
    description:
      "Production-minded support assistant built on a Flipkart help-centre dataset. A bounded planner routes each WebSocket turn to a deterministic response, grounded FAQ retrieval, or one account-scoped tool; PostgreSQL persists conversations and idempotent actions, while versioned Qdrant collections keep knowledge releases reversible.",
    shortDescription: "A scoped support assistant with grounded FAQ answers, durable chats, safe account tools, citations, and reconnect-safe WebSockets.",
    highlights: [
      "Eight bounded intents keep social chat, off-topic requests, multiple actions, public FAQ lookup, and account support on explicit paths; unsupported requests never reach a general-purpose answer path.",
      "FAQ answers use versioned Qdrant knowledge collections, Cohere embeddings and reranking, Groq synthesis, citations, and a tightly allowlisted semantic cache for public questions only.",
      "Order status, refund status, order notes, and handoff use trusted server-side actor context and allow at most one simulated account action per turn.",
      "Typed WebSocket frames use stable client message IDs, replay after reconnect, turn deadlines, idempotency keys, and committed completion semantics.",
      "PostgreSQL stores users, revocable sessions, threads, messages, quotas, and an action ledger; anonymous demo conversations remain ephemeral.",
      "Production validation: 71/71 deterministic backend and PostgreSQL tests plus 24/24 live intent cases, with smoke coverage for citations, tools, notes, handoff, injection attempts, invalid frames, reconnects, and scope control.",
    ],
    // Requested order was ["LangGraph / Agentic AI", "MCP (Model Context
    // Protocol)", "LlamaIndex"] — used "Agentic AI" alone rather than
    // "LangGraph / Agentic AI": this project's own description (LlamaIndex
    // intent-routing planner + tool integrations + LiteLLM gateway) never
    // names LangGraph specifically, and techNodes' own "langgraph" entry
    // has an empty relatedProjectIds for exactly that reason — didn't want
    // to attribute a specific framework the project doesn't verifiably
    // use. "Agentic AI" as a category label is well-supported (it's
    // agentic RAG with tool-calling, per the project's own title).
    techTags: [
      "Agentic AI",
      "LlamaIndex",
      "LiteLLM",
      "Qdrant",
      "Cohere",
      "FastAPI",
      "WebSockets",
      "PostgreSQL 17",
      "React 19",
      "TypeScript 6",
      "Vite 8",
      "Docker",
      "Vision (Llama 4 Scout)",
      "Langfuse",
      "Caddy",
      "OCI",
    ],
    githubUrl: "https://github.com/Soban-2004/Agentic-RAG-Customer-Support-Platform-Flipkart-FAQ-",
    liveUrl: "https://140.245.234.125/aster/",
    headlineStat: { label: "Deterministic backend + PostgreSQL tests", value: "71/71" },
    featured: true,
    caseStudyRoute: "/work/aster",
  },
  {
    id: "fitnova",
    name: "FitNova — AI Sales-Call Intelligence System",
    period: "Jul 2026 – Aug 2026",
    description:
      "A call-intelligence platform, not just a scoring pipeline: recorded sales calls are transcribed, diarized, run through a 3-pass LLM analysis, and deterministically scored on director/team-leader/advisor dashboards — plus a real-time coaching companion for calls in progress, and an AI voice agent that runs its own qualification calls and hands off structured leads to a human pipeline. Built at production-level care, not as a demo.",
    shortDescription: "AI that transcribes and scores real sales calls, coaches them live, and runs its own AI qualification calls — with the results surfaced on live team dashboards.",
    highlights: [
      "Director / Team Leader / Advisor dashboards with score-trend charts (4/8/12-week ranges).",
      "Filterable, paginated, URL-driven call log with shareable filtered views.",
      "Call detail page: diarized transcript synced to an audio player, per-tag issue cards, full score version history.",
      "Contest/confirm/dismiss workflow — a dismissal triggers a live, versioned score recalculation (scores are appended, never overwritten).",
      "Live updates via Server-Sent Events — no polling, no manual reload.",
      "Live Call Coaching — streams the advisor's mic to Deepgram's live streaming API over a WebSocket and surfaces short coaching nudges as the call happens; the session is persisted and scored through the same pipeline as an uploaded recording once it ends.",
      "Voice Intake Agent — an AI that runs its own qualification calls: decides what to say via an LLM, speaks the reply with Cartesia TTS (with barge-in if the caller interrupts), then extracts structured lead data (name, goal, health notes, availability, confirmed time) into a trackable Lead.",
      "Leads pipeline — every lead the voice agent creates is assignable to a human advisor and tracked New → Assigned → Contacted → Trial Booked.",
      "A labeled eval harness (3 hand-scored transcript scenarios) caught a live production incident — two of three fallback-chain LLM models silently deprecated by their providers — on its first run; fixed and verified across 5 consecutive live runs.",
      "Per-IP + global rate limiting on the one unauthenticated, state-mutating endpoint (upload); per-LLM-call telemetry (latency, outcome, which fallback-chain provider served the call) persisted so it survives a restart, with an admin endpoint to query it; short-TTL in-memory caching on the dashboard aggregation endpoints, explicitly invalidated the moment a score changes underneath them.",
      "A full UI/UX design pass — a colorful, dark-mode-capable design system with identity-based color coding for teams/advisors/tags kept strictly separate from status/severity colors, dense-table hover-lift interactions with inline magnitude bars and filter chips, a Web-Audio-driven level meter on the live call screen, and a color-displacement live-state indicator in place of a blinking dot.",
    ],
    // First 3 specified directly. "Speech-to-Text (Deepgram)" replaces
    // the old plain "Deepgram Nova-3" tag (same fact, this wording).
    // "LLM Evaluation / Output Validation" describes the 3-layer tag
    // validation system (Pydantic schema check → RapidFuzz fuzzy match →
    // Gemini semantic embeddings) and the deterministic-scoring rule
    // ("the LLM never does arithmetic") from this project's own
    // architecture notes — a category label for verified work, not a new
    // claim. "Prompt Engineering" reflects the narrow, schema-validated,
    // temperature=0 multi-pass prompt design also described there;
    // techNodes' "prompt-engineering" entry is now linked to this project
    // too (see below) since it's the first project that specifically
    // evidences it.
    techTags: [
      "Speech-to-Text (Deepgram)",
      "Deepgram Live Streaming (WebSocket)",
      "Text-to-Speech (Cartesia)",
      "LLM Evaluation / Output Validation",
      "Prompt Engineering",
      "Groq",
      "Gemini",
      "Ollama Cloud",
      "FastAPI (async)",
      "WebSockets",
      "SQLAlchemy 2.0",
      "Neon Postgres",
      "Next.js 14",
      "TypeScript",
      "Tailwind",
      "Recharts",
      "Web Audio API",
      "RapidFuzz",
      "Server-Sent Events",
      "Render",
      "Vercel",
    ],
    githubUrl: "https://github.com/Soban-2004/fitnova-ai-call-auditor",
    liveUrl: "https://fitnova-ai-call-auditor.vercel.app",
    secondaryUrl: { label: "Backend health", url: "https://fitnova-backend-t1nz.onrender.com/api/health" },
    headlineStat: { label: "Real integration tests against a real DB", value: "35" },
    featured: true,
    caseStudyRoute: "/work/fitnova",
  },
  {
    id: "cricket-analysis",
    name: "End-to-End Cricket Data Analysis",
    period: "Earlier work",
    description:
      "Scraped ICC Men's T20 World Cup 2024 data from ESPN Cricinfo, processed it with Pandas, and built a 7-page interactive Power BI dashboard.",
    shortDescription: "T20 World Cup data, scraped and turned into a 7-page interactive dashboard.",
    highlights: [
      "Overall Tournament Analysis, Player Analysis (Openers, Middle Order, Finishers, All-Rounders, Bowlers), and a data-driven 'Final 11 (Best XI)' of the tournament.",
    ],
    // Power BI moved into the first 3 (what the card's own chip row
    // shows, ProjectCard.tsx's techTags.slice(0, 3)) — it's the actual
    // deliverable (the 7-page dashboard the screenshot shows), arguably
    // more representative of this project at a glance than BeautifulSoup,
    // which stays in the full list for the case-study page's own tech
    // stack line and the "N Technologies" count.
    techTags: ["Python", "Pandas", "Power BI", "BeautifulSoup"],
    githubUrl: "https://github.com/Soban-2004/ICC-Mens-T20-Cricket-World-Cup-2024-Data-Analysis",
    headlineStat: { label: "Dashboard pages", value: "7" },
    featured: false,
    earlierWork: true,
    caseStudyRoute: "/work/cricket-analysis",
    screenshot: {
      src: "/projects/cricket-bowlers.png",
      alt: "Power BI dashboard page showing bowler performance analysis for the ICC Men's T20 World Cup 2024",
      width: 959,
      height: 539,
    },
  },
];

// ---------------------------------------------------------------------------
// Open Source
// ---------------------------------------------------------------------------

export const openSource: OpenSourceContribution = {
  repo: "langchain-ai/langchain",
  prNumber: "#39238",
  prUrl: "https://github.com/langchain-ai/langchain/pull/39238",
  issueNumber: "#39192",
  before:
    "RecursiveJsonSplitter.split_json() silently discarded non-dict top-level input — a data-loss bug with no error raised.",
  after:
    "Raises a clear error; 9 regression tests added covering lists, primitives, None, and existing dict behavior; validated against 149 passing tests. Merged.",
  testsAdded: 9,
  totalPassing: 149,
};

// ---------------------------------------------------------------------------
// Research
// ---------------------------------------------------------------------------

export const research: ResearchPaper[] = [
  {
    id: "smart-pen-survey",
    title: "Survey on Methodologies to Implement Automated Data Entry Using Smart Pen",
    authorsNote: "Co-authored — 2nd of 5 authors",
    conference: "2025 2nd International Conference on Computing and Data Science (ICCDS)",
    year: "2025",
    oneLiner:
      "Co-authored a survey on methodologies for smart-pen-based automated data entry — examining handwriting recognition, pattern-recognition approaches, and techniques for converting handwritten input into structured digital information.",
    sourceLabel: "IEEE Xplore",
    sourceUrl: "https://ieeexplore.ieee.org/document/11209653",
  },
  {
    id: "aquaculture-pinns",
    title:
      "Automated Water Quality Monitoring and Prediction System Using AI and PINNs for Sustainable Aquaculture",
    authorsNote: "Co-authored — 3rd of 3 authors",
    conference:
      "2025 IConSCEPT (International Conference on Signal Processing, Computation, Electronics, Power and Telecommunication)",
    year: "2025",
    oneLiner:
      "Co-authored a research paper on automated water-quality monitoring and prediction for sustainable aquaculture, using AI with Physics-Informed Neural Networks (PINNs) to move from reactive to predictive water-quality management.",
    sourceLabel: "IEEE Xplore",
    sourceUrl: "https://ieeexplore.ieee.org/document/11436713",
    doi: "10.1109/IConSCEPT66142.2025.11436713",
  },
];

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

// Reverse chronological order (newest → oldest) — flipped from the
// original oldest-first ordering per feedback; `projects` above still
// goes oldest→newest, so these two lists now deliberately run in opposite
// directions from each other. Google AI Essentials and MongoDB both land
// in Aug 2024 with no day shown on-site — their relative order here is
// still set by the real verified day (Aug 8 vs. Aug 10), even though the
// displayed detail is month/year only.
export const certifications: Certification[] = [
  {
    name: "Agentic AI Certified Foundations Associate",
    issuer: "Oracle Cloud Infrastructure",
    detail: "Completed Aug 2026",
  },
  {
    name: "Oracle Cloud Infrastructure 2025 Certified Foundations Associate",
    issuer: "Oracle Cloud Infrastructure",
    detail: "Completed Dec 24, 2025",
  },
  {
    name: "AI Foundations Associate",
    issuer: "Oracle Cloud Infrastructure",
    detail: "Completed Dec 2025",
  },
  {
    name: "Data Analytics with Python",
    issuer: "NPTEL / IIT Roorkee (Swayam)",
    detail: "86% — Elite, Top 5% (\"Topper\") · Jan–Apr 2025",
  },
  {
    name: "Machine Learning Specialization",
    issuer: "Stanford University (via Coursera)",
    detail: "Completed Jan 2025",
    items: [
      "Supervised Machine Learning: Regression and Classification",
      "Advanced Learning Algorithms",
      "Unsupervised Learning, Recommenders, Reinforcement Learning",
    ],
    verifyUrl: "https://coursera.org/verify/specialization/TZJIJDLOYNF2",
  },
  {
    name: "Introduction to Internet of Things",
    issuer: "NPTEL (Swayam)",
    detail: "91% — Top 2% · Jul–Oct 2024",
  },
  {
    name: "Networking Basics",
    issuer: "Cisco Networking Academy",
    detail: "Completed Sep 2024",
  },
  {
    name: "Introduction to MongoDB (For Students)",
    issuer: "MongoDB",
    detail: "Completed Aug 2024",
  },
  {
    name: "Google AI Essentials",
    issuer: "Coursera (Google Career Certificates)",
    detail: "Completed Aug 2024",
    verifyUrl: "https://coursera.org/verify/7AGU8IHCBC8X",
  },
];

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export const education = {
  degree: "B.E. Computer Science and Engineering (Honours)",
  school: "SRM Easwari Engineering College",
  period: "2022–2026",
  cgpa: "8.8/10",
};

// ---------------------------------------------------------------------------
// Impact snapshot (profile.md §10 — top-level count-up stats)
// ---------------------------------------------------------------------------

export const impactSnapshot: ImpactStat[] = [
  { label: "Aster deterministic tests", value: "71/71" },
  { label: "Resume Matcher tests", value: "32", numericValue: 32 },
  { label: "Schema objects indexed via RAG", value: "2,000+", numericValue: 2000, suffix: "+" },
  { label: "Manual config effort automated", value: "~60–70%", numericValue: 65, suffix: "%" },
  { label: "OSS PR merged", value: "langchain-ai/langchain #39238" },
];

// ---------------------------------------------------------------------------
// Skills / Tech graph (profile.md §9 — canonical grouping)
// relatedProjectIds only set where the tech is verifiably named in that
// project's profile.md text (title, bullets, or Tech: line).
// ---------------------------------------------------------------------------

export const techNodes: TechNode[] = [
  // Programming & Backend
  { id: "python", label: "Python", category: "backend", relatedProjectIds: ["ai-architect", "resume-matcher", "flipkart-faq", "fitnova", "cricket-analysis"] },
  { id: "fastapi", label: "FastAPI", category: "backend", relatedProjectIds: ["resume-matcher", "flipkart-faq", "fitnova", "ai-architect"] },
  { id: "sql", label: "SQL", category: "backend", relatedProjectIds: [] },
  { id: "mysql", label: "MySQL", category: "backend", relatedProjectIds: [] },
  { id: "postgresql", label: "PostgreSQL", category: "backend", relatedProjectIds: ["resume-matcher", "flipkart-faq", "fitnova", "ai-architect"] },
  // Added with FitNova's Live Call Coaching update — the mic stream to
  // Deepgram's live API runs over a WebSocket, not the REST calls the
  // rest of the pipeline uses.
  { id: "websockets", label: "WebSockets", category: "backend", relatedProjectIds: ["flipkart-faq", "fitnova"] },

  // LLM & Agentic AI
  { id: "langchain", label: "LangChain", category: "llm-agentic", relatedProjectIds: [] },
  { id: "langgraph", label: "LangGraph", category: "llm-agentic", relatedProjectIds: [] },
  { id: "llamaindex", label: "LlamaIndex", category: "llm-agentic", relatedProjectIds: ["flipkart-faq"] },
  { id: "mcp", label: "MCP (Model Context Protocol)", category: "llm-agentic", relatedProjectIds: ["flipkart-faq"] },
  { id: "rag-pipelines", label: "RAG Pipelines", category: "llm-agentic", relatedProjectIds: ["resume-matcher", "flipkart-faq"] },
  { id: "prompt-engineering", label: "Prompt Engineering", category: "llm-agentic", relatedProjectIds: ["fitnova"] },

  // Speech & Voice AI
  { id: "deepgram", label: "Deepgram Nova-3 (STT)", category: "voice", relatedProjectIds: ["fitnova"] },
  { id: "diarization", label: "Speaker Diarization", category: "voice", relatedProjectIds: ["fitnova"] },
  { id: "multilingual-audio", label: "Multilingual / Code-Switched Audio", category: "voice", relatedProjectIds: [] },
  // Added with FitNova's Live Call Coaching (Deepgram live streaming) and
  // Voice Intake Agent (Cartesia TTS reply + barge-in) update.
  { id: "cartesia", label: "Cartesia (TTS)", category: "voice", relatedProjectIds: ["fitnova"] },

  // Vector DB & Retrieval
  { id: "qdrant", label: "Qdrant", category: "vector-db", relatedProjectIds: ["resume-matcher", "flipkart-faq"] },
  { id: "cohere", label: "Cohere Embeddings & Reranking", category: "vector-db", relatedProjectIds: ["resume-matcher", "flipkart-faq"] },
  { id: "weaviate", label: "Weaviate", category: "vector-db", relatedProjectIds: [] },
  { id: "hybrid-search", label: "Hybrid Search (BM25) & Reranking", category: "vector-db", relatedProjectIds: ["resume-matcher"] },
  { id: "huggingface", label: "Hugging Face Models", category: "vector-db", relatedProjectIds: [] },

  // LLMOps & Evaluation
  { id: "litellm", label: "LiteLLM", category: "llmops", relatedProjectIds: ["flipkart-faq"] },
  { id: "llm-guard", label: "LLM Guard", category: "llmops", relatedProjectIds: [] },
  { id: "langfuse", label: "Langfuse", category: "llmops", relatedProjectIds: ["flipkart-faq"] },
  // Added when ArchMind's brief named Gemini as its structural-review
  // pass — at that point genuinely evidenced across 3 projects' own
  // Tech: lines (fitnova, resume-matcher, ai-architect), not just one,
  // so worth its own node rather than staying untracked.
  { id: "gemini", label: "Gemini", category: "llmops", relatedProjectIds: ["fitnova", "resume-matcher", "ai-architect"] },
  { id: "ragas", label: "RAGAS", category: "llmops", relatedProjectIds: [] },
  { id: "openrouter", label: "OpenRouter", category: "llmops", relatedProjectIds: ["ai-architect"] },
  { id: "groq", label: "Groq API", category: "llmops", relatedProjectIds: ["resume-matcher", "flipkart-faq", "fitnova", "ai-architect"] },
  { id: "openai-api", label: "OpenAI API", category: "llmops", relatedProjectIds: [] },

  // Machine Learning
  { id: "scikit-learn", label: "Scikit-Learn", category: "ml", relatedProjectIds: [] },
  { id: "tensorflow", label: "TensorFlow", category: "ml", relatedProjectIds: [] },
  { id: "nlp", label: "NLP (NLTK & spaCy)", category: "ml", relatedProjectIds: [] },

  // Cloud & DevOps
  { id: "git", label: "Git", category: "cloud-devops", relatedProjectIds: [] },
  { id: "github", label: "GitHub", category: "cloud-devops", relatedProjectIds: [] },
  { id: "docker", label: "Docker", category: "cloud-devops", relatedProjectIds: ["resume-matcher", "flipkart-faq", "ai-architect"] },
  { id: "caddy", label: "Caddy", category: "cloud-devops", relatedProjectIds: ["resume-matcher", "flipkart-faq", "ai-architect"] },
  { id: "nginx", label: "Nginx", category: "cloud-devops", relatedProjectIds: [] },
  { id: "redis", label: "Redis", category: "cloud-devops", relatedProjectIds: [] },
  { id: "linux", label: "Linux", category: "cloud-devops", relatedProjectIds: [] },
  { id: "azure", label: "Azure", category: "cloud-devops", relatedProjectIds: [] },
  { id: "oci", label: "Oracle Cloud Infrastructure (OCI)", category: "cloud-devops", relatedProjectIds: ["resume-matcher", "flipkart-faq", "ai-architect"] },
  { id: "render", label: "Render", category: "cloud-devops", relatedProjectIds: ["fitnova"] },
  { id: "vercel", label: "Vercel", category: "cloud-devops", relatedProjectIds: ["fitnova"] },
];

export const techCategoryLabels: Record<TechCategory, string> = {
  backend: "Programming & Backend",
  "llm-agentic": "LLM & Agentic AI",
  voice: "Speech & Voice AI",
  "vector-db": "Vector DB & Retrieval",
  llmops: "LLMOps & Evaluation",
  ml: "Machine Learning",
  "cloud-devops": "Cloud & DevOps",
};

// Note: the two real hybrid-retrieval systems' pipeline mechanics (query →
// retrieval → rerank → grounded answer, per project) used to live here as
// data for a dedicated interactive walkthrough section (components/rag/).
// That section was removed; the same factual stage summary is now folded
// directly into each project's own `description` above instead.
