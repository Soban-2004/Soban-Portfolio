import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/shared/BrandIcons";
import { Button } from "@/components/shared/Button";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ArchitectureDiagram, type DiagramNode } from "@/components/shared/ArchitectureDiagram";
import { projects } from "@/lib/content";
import { PageTransition } from "@/components/shared/PageTransition";
import { CaseStudyPager } from "@/components/projects/CaseStudyPager";

export const metadata: Metadata = {
  title: "AI Resume & Job Matcher — Soban Shankar",
  description:
    "How the AI Resume & Job Matcher combines hybrid retrieval, evidence-grounded verdicts, fabrication checks, and a staged recruiter funnel.",
};

const project = projects.find((p) => p.id === "resume-matcher")!;

const RETRIEVAL_PIPELINE: DiagramNode[] = [
  { id: "requirements", label: "Weighted requirements", detail: "The job description is converted into technical requirements with explicit importance weights." },
  { id: "chunks", label: "Resume chunks", detail: "PDF, DOCX, or TXT content is parsed into overlapping passages; scanned PDFs can fall back to OCR." },
  { id: "retrieve", label: "Dense + BM25 retrieval", detail: "Semantic and keyword search run over the same resume evidence." },
  { id: "fusion", label: "Reciprocal rank fusion", detail: "The two rankings are combined without letting either retrieval method dominate by scale alone." },
  { id: "rerank", label: "Cohere reranking", detail: "The strongest fused passages are reranked against the exact requirement." },
  { id: "verdict", label: "Evidence-grounded verdict", detail: "The rubric model evaluates each requirement only against retrieved evidence and keeps missing requirements visible." },
  { id: "report", label: "Explainable fit report", detail: "The final score weights requirement importance and evidence quality, with citations back to the resume." },
];

const EVALUATION_PIPELINE: DiagramNode[] = [
  { id: "prescreen", label: "Dense prescreen", detail: "A fast first pass over the full applicant pool using dense retrieval alone." },
  { id: "skill-match", label: "Skill match", detail: "Prescreened candidates are checked against the role's required skills before anything reaches an LLM." },
  { id: "llm-review", label: "Evidence review", detail: "Only candidates approved through the first two rounds receive full retrieval and requirement-level LLM review." },
];

export default function ResumeMatcherPage() {
  return (
    <PageTransition>
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <ScrollProgress />
      <Link
        href="/#project=resume-matcher"
        transitionTypes={["nav-back"]}
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
          An evidence-first recruitment platform with two complete product paths. Job seekers can compare a
          resume with a role, inspect requirement verdicts and supporting excerpts, see honest gaps, generate a
          cover letter, and create an ATS-oriented resume rewrite that passes a separate fabrication check before
          it can be accepted and exported as PDF.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Recruiters create persistent hiring projects, upload up to 25 resumes per batch, and move candidates
          through a three-round funnel: dense prescreen, lightweight skill matching, then full evidence retrieval
          and requirement-level review. Every round pauses for approval, and its scores stay in a separate tier
          because the methods are intentionally different.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Supabase access tokens are verified on every authenticated request, role guards separate job-seeker and
          recruiter APIs, and PostgreSQL records are scoped to their owner. Upload limits, filename normalization,
          rolling rate limits, content-based deduplication, OCR fallback, structured logs, and optional Sentry
          reporting cover the less visible production paths.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          The current validation suite passes 16 backend tests and 16 Playwright tests, covering authentication,
          ownership, upload boundaries, deduplication, recruiter approvals, protected-route redirects, keyboard
          interaction, responsive overflow, browser errors, and serious accessibility violations.
        </p>
      </section>

      {/* 2. Retrieval architecture */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Architecture — Evidence Matching</h2>
        <p className="mt-4 text-muted">
          Each job requirement is evaluated against retrieved resume evidence, with missing requirements left visible.
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
      <CaseStudyPager currentId={project.id} />
    </article>
    </PageTransition>
  );
}
