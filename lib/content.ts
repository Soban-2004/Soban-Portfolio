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
  resumeUrl: "/resume-soban-shankar-2026.pdf", // TODO: drop the actual PDF into /public — see build notes
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
    id: "resume-matcher",
    name: "AI Resume & Job Matcher",
    period: "Aug 2025 – Nov 2025 (Updated May 2026)",
    description:
      "Full-stack AI recruitment platform — resume analysis for job seekers, hiring workflows for recruiters. Pipeline: query → dense + BM25 retrieval → reciprocal rank fusion → cross-encoder rerank → GitHub-corroborated, cited answer.",
    highlights: [
      "Hybrid retrieval: dense + sparse (BM25) search, reciprocal rank fusion, cross-encoder reranking, citation-backed AI responses.",
      "Three-stage recruiter evaluation pipeline (dense prescreen → skill match → LLM review) — shortlists top ~5% of candidates, cutting full rubric reviews by ~95%.",
      "Three-tier LLM fallback chain (Ollama → Gemini → Groq) for rate-limit resilience; Supabase auth + PostgreSQL backend for persistent hiring campaigns.",
      "Corroboration layer verifies weak resume claims against live GitHub repo content before upgrading evidence score — closes a keyword-stuffing gap.",
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
      "Ollama",
      "Gemini",
      "Groq",
      "Next.js 16",
      "Supabase",
    ],
    githubUrl: "https://github.com/Soban-2004/Job_Resume_Matcher",
    liveUrl: "https://ai-resume-job-matcher-rag-platform-soban-2004s-projects.vercel.app/",
    headlineStat: { label: "Fewer full rubric reviews needed", value: "~95%", numericValue: 95, suffix: "%" },
    featured: true,
    caseStudyRoute: "/work/resume-matcher",
  },
  {
    id: "flipkart-faq",
    name: "Agentic RAG Customer Support Platform",
    period: "Nov 2025 – Jan 2026",
    description:
      "Agentic RAG customer support system over a ~2,000-entry Flipkart FAQ corpus — order status, refund tracking, human escalation via MCP tools. Pipeline: query → intent routing → hybrid Qdrant retrieval → MCP tool fallback → 7-scanner LLM Guard → grounded answer.",
    highlights: [
      "Built on LlamaIndex: intent-routing planner, 5 integrated tools (FAQ search + 4 MCP tools), LiteLLM gateway with fallback across 3 models / 2 providers.",
      "LLM Guard guardrails (7 parallel scanners) cut latency from ~4.5s → ~1s.",
      "Validated via 25-scenario RAGAS evaluation; deployed as a Docker container on Render.",
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
    techTags: ["Agentic AI", "MCP (Model Context Protocol)", "LlamaIndex", "LiteLLM", "Qdrant", "Docker", "LLM Guard", "RAGAS"],
    githubUrl: "https://github.com/Soban-2004/Flipkart_faq_chatbot",
    liveUrl: "https://agentic-rag-customer-support-platform.onrender.com",
    headlineStat: { label: "Latency reduction", value: "4.5s → 1s" },
    featured: true,
    caseStudyRoute: "/work/flipkart-faq",
  },
  {
    id: "fitnova",
    name: "FitNova — AI Sales-Call Intelligence System",
    period: "Jul 2026 – Aug 2026",
    description:
      "An AI pipeline that ingests recorded sales calls, transcribes and diarizes them, runs a 3-pass LLM analysis, computes a deterministic score, and surfaces it all through director/team-leader/advisor dashboards with a live contest-and-review workflow. Built at production-level care, not as a demo.",
    highlights: [
      "Director / Team Leader / Advisor dashboards with score-trend charts (4/8/12-week ranges).",
      "Filterable, paginated, URL-driven call log with shareable filtered views.",
      "Call detail page: diarized transcript synced to an audio player, per-tag issue cards, full score version history.",
      "Contest/confirm/dismiss workflow — a dismissal triggers a live, versioned score recalculation (scores are appended, never overwritten).",
      "Live updates via Server-Sent Events — no polling, no manual reload.",
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
      "LLM Evaluation / Output Validation",
      "Prompt Engineering",
      "Groq",
      "Gemini",
      "Ollama Cloud",
      "FastAPI (async)",
      "SQLAlchemy 2.0",
      "Neon Postgres",
      "Next.js 14",
      "TypeScript",
      "Tailwind",
      "Recharts",
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
    highlights: [
      "Overall Tournament Analysis, Player Analysis (Openers, Middle Order, Finishers, All-Rounders, Bowlers), and a data-driven 'Final 11 (Best XI)' of the tournament.",
    ],
    techTags: ["Python", "Pandas", "BeautifulSoup", "Power BI"],
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
    sourceLabel: "IEEE proceedings TOC",
    sourceUrl: "https://www.proceedings.com/content/082/082651webtoc.pdf",
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
    sourceLabel: "ResearchGate / DOI",
    sourceUrl:
      "https://www.researchgate.net/publication/403068370_Automated_Water_Quality_Monitoring_and_Prediction_System_Using_AI_and_PINNs_for_Sustainable_Aquaculture",
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
  { label: "Fewer full rubric reviews", value: "~95%", numericValue: 95, suffix: "%" },
  { label: "Report latency cut", value: "4.5s → 1s" },
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
  { id: "python", label: "Python", category: "backend", relatedProjectIds: ["cricket-analysis"] },
  { id: "fastapi", label: "FastAPI", category: "backend", relatedProjectIds: ["resume-matcher", "fitnova"] },
  { id: "sql", label: "SQL", category: "backend", relatedProjectIds: [] },
  { id: "mysql", label: "MySQL", category: "backend", relatedProjectIds: [] },
  { id: "postgresql", label: "PostgreSQL (Supabase)", category: "backend", relatedProjectIds: ["resume-matcher", "fitnova"] },

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

  // Vector DB & Retrieval
  { id: "qdrant", label: "Qdrant", category: "vector-db", relatedProjectIds: ["resume-matcher", "flipkart-faq"] },
  { id: "weaviate", label: "Weaviate", category: "vector-db", relatedProjectIds: [] },
  { id: "hybrid-search", label: "Hybrid Search (BM25) & Reranking", category: "vector-db", relatedProjectIds: ["resume-matcher"] },
  { id: "huggingface", label: "Hugging Face Models", category: "vector-db", relatedProjectIds: [] },

  // LLMOps & Evaluation
  { id: "litellm", label: "LiteLLM", category: "llmops", relatedProjectIds: ["flipkart-faq"] },
  { id: "llm-guard", label: "LLM Guard", category: "llmops", relatedProjectIds: ["flipkart-faq"] },
  { id: "langfuse", label: "Langfuse", category: "llmops", relatedProjectIds: [] },
  { id: "ragas", label: "RAGAS", category: "llmops", relatedProjectIds: ["flipkart-faq"] },
  { id: "openrouter", label: "OpenRouter", category: "llmops", relatedProjectIds: [] },
  { id: "groq", label: "Groq API", category: "llmops", relatedProjectIds: ["fitnova"] },
  { id: "openai-api", label: "OpenAI API", category: "llmops", relatedProjectIds: [] },

  // Machine Learning
  { id: "scikit-learn", label: "Scikit-Learn", category: "ml", relatedProjectIds: [] },
  { id: "tensorflow", label: "TensorFlow", category: "ml", relatedProjectIds: [] },
  { id: "nlp", label: "NLP (NLTK & spaCy)", category: "ml", relatedProjectIds: [] },

  // Cloud & DevOps
  { id: "git", label: "Git", category: "cloud-devops", relatedProjectIds: [] },
  { id: "github", label: "GitHub", category: "cloud-devops", relatedProjectIds: [] },
  { id: "docker", label: "Docker", category: "cloud-devops", relatedProjectIds: ["flipkart-faq"] },
  { id: "nginx", label: "Nginx", category: "cloud-devops", relatedProjectIds: [] },
  { id: "redis", label: "Redis", category: "cloud-devops", relatedProjectIds: [] },
  { id: "linux", label: "Linux", category: "cloud-devops", relatedProjectIds: [] },
  { id: "azure", label: "Azure", category: "cloud-devops", relatedProjectIds: [] },
  { id: "oci", label: "Oracle Cloud Infrastructure (OCI)", category: "cloud-devops", relatedProjectIds: [] },
  { id: "render", label: "Render", category: "cloud-devops", relatedProjectIds: ["flipkart-faq", "fitnova"] },
  { id: "vercel", label: "Vercel", category: "cloud-devops", relatedProjectIds: ["resume-matcher", "fitnova"] },
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
