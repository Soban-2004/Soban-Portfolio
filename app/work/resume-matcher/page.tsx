import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/shared/BrandIcons";
import { Button } from "@/components/shared/Button";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ArchitectureDiagram, type DiagramNode } from "@/components/shared/ArchitectureDiagram";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "AI Resume & Job Matcher — Soban Shankar",
  description:
    "How the AI Resume & Job Matcher retrieves, reranks, and corroborates evidence from a candidate's resume — hybrid dense + BM25 search, reciprocal rank fusion, and a GitHub corroboration layer.",
};

const project = projects.find((p) => p.id === "resume-matcher")!;

// Two distinct real pipelines in this platform — kept as two separate
// diagrams rather than merged into one, since they're genuinely different
// flows: one answers a recruiter's free-form question against a single
// resume, the other screens an entire applicant pool automatically.
const RETRIEVAL_PIPELINE: DiagramNode[] = [
  { id: "query", label: "Query received", detail: "Treated as a recruiter's screening question against one candidate's resume." },
  { id: "embed", label: "Embedding", detail: "Encoded into a dense vector; a parallel BM25 sparse index is built from the same resume text." },
  { id: "vector-db", label: "Vector DB — Qdrant", detail: "Dense + sparse search run in parallel, then merged with reciprocal rank fusion." },
  { id: "rerank", label: "Cross-encoder reranking", detail: "The fused candidates are reranked purely on relevance to the recruiter's exact question." },
  { id: "corroborate", label: "Corroboration layer", detail: "Weak resume claims are checked against the candidate's live GitHub repo content before the evidence score is upgraded — closes a keyword-stuffing gap." },
  { id: "answer", label: "Grounded, cited answer", detail: "The LLM only sees the reranked, corroborated evidence — every claim is cited back to an exact resume line." },
];

const EVALUATION_PIPELINE: DiagramNode[] = [
  { id: "prescreen", label: "Dense prescreen", detail: "A fast first pass over the full applicant pool using dense retrieval alone." },
  { id: "skill-match", label: "Skill match", detail: "Prescreened candidates are checked against the role's required skills before anything reaches an LLM." },
  { id: "llm-review", label: "LLM review", detail: "Only the shortlisted remainder — roughly the top ~5% — gets a full LLM review, cutting full rubric reviews by ~95%." },
];

export default function ResumeMatcherPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <ScrollProgress />
      <Link
        href="/#project=resume-matcher"
        className="inline-flex min-h-11 items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to work
      </Link>

      <p className="mt-8 font-mono text-sm text-accent-soft">Case Study</p>
      <h1 className="font-display-3d mt-2 text-balance text-2xl leading-[1.4] text-foreground sm:text-3xl">
        AI Resume &amp; Job Matcher
      </h1>
      <p className="mt-3 font-mono text-sm text-muted">{project.period}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.githubUrl && (
          <Button href={project.githubUrl} variant="secondary">
            <GitHubIcon size={16} /> GitHub
          </Button>
        )}
        {project.liveUrl && (
          <Button href={project.liveUrl} variant="secondary">
            <ExternalLink size={16} /> Live Link
          </Button>
        )}
      </div>

      {/* 1. Overview */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Overview</h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          A full-stack AI recruitment platform (Next.js 16, FastAPI, Supabase, Qdrant) with two sides: resume
          analysis for job seekers, and a hiring workflow for recruiters — screening one candidate at a time
          through free-form Q&amp;A, or an entire applicant pool through an automated shortlist.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          A three-tier LLM fallback chain (Ollama → Gemini → Groq) keeps both flows working through rate limits;
          Supabase auth and PostgreSQL persist hiring campaigns across sessions.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          A scanned or photographed resume — no text layer for the PDF parser to read — falls back to OCR
          automatically once extracted text drops below a length threshold, verified end-to-end against a real
          zero-text-layer PDF through the actual document-loading entry point, not just unit-tested in isolation.
          An LRU cache also dedupes repeated Cohere embedding calls for identical text, and job creation across all
          three intake paths is content-hash idempotent, so a repeat submission returns the original job instead
          of starting a duplicate.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          A groundedness eval harness checks the one guarantee the whole pipeline is built around: for every
          requirement the rubric marks satisfied, does the cited evidence snippet actually appear in the source
          resume text? Run against a real resume, it evaluated 15 requirements with zero ungrounded citations.
        </p>
      </section>

      {/* 2. Retrieval architecture */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Architecture — Recruiter Q&amp;A</h2>
        <p className="mt-4 text-muted">
          A recruiter asks a free-form question about one candidate; the answer is retrieved and corroborated, not
          guessed.
        </p>
        <div className="mt-8">
          <ArchitectureDiagram nodes={RETRIEVAL_PIPELINE} />
        </div>
      </section>

      {/* 3. Evaluation pipeline */}
      <section className="mt-8">
        <h2 className="font-mono text-sm text-accent-soft">Architecture — Recruiter Evaluation Pipeline</h2>
        <p className="mt-4 text-muted">
          A separate, cheaper-first flow for screening an entire applicant pool automatically.
        </p>
        <div className="mt-8">
          <ArchitectureDiagram nodes={EVALUATION_PIPELINE} />
        </div>
      </section>

      {/* 4. Tech stack */}
      <section className="mt-16 border-t border-surface-border pt-10">
        <h2 className="font-mono text-sm text-accent-soft">Tech Stack</h2>
        <p className="mt-4 font-mono text-sm text-muted">{project.techTags.join(" · ")}</p>
      </section>
    </main>
  );
}
