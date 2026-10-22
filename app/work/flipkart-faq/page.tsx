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
  title: "Aster — Agentic RAG Customer Support | Soban Shankar",
  description:
    "How Aster combines bounded intent routing, grounded FAQ retrieval, account-scoped tools, durable WebSocket chat, and production safety controls.",
};

const project = projects.find((p) => p.id === "flipkart-faq")!;

const PIPELINE: DiagramNode[] = [
  { id: "frame", label: "Validated WebSocket turn", detail: "FastAPI validates the frame, session, origin, quotas, payload size, and idempotency key before any model work begins." },
  { id: "guard", label: "Input guardrails", detail: "Deterministic checks and Prompt Guard reject dangerous requests and injection attempts; unavailable checks fail closed." },
  { id: "planner", label: "Eight-intent planner", detail: "The bounded planner separates FAQ, order, refund, note, escalation, multi-action, social, and out-of-scope messages." },
  { id: "fixed", label: "Deterministic response", detail: "Social, unsupported, and multi-action requests use fixed behavior and never reach a general-purpose answer path." },
  { id: "faq", label: "Grounded FAQ retrieval", detail: "Versioned Qdrant knowledge, Cohere embeddings and reranking, and Groq synthesis produce answers with source metadata." },
  { id: "tools", label: "Account-scoped tool", detail: "Order, refund, note, and handoff operations use trusted actor context and execute at most one simulated action per turn." },
  { id: "commit", label: "Review, commit, deliver", detail: "The full answer is reviewed, authenticated turns commit to PostgreSQL, then the final completion event is sent." },
];

export default function FlipkartFaqPage() {
  return (
    <PageTransition>
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <ScrollProgress />
      <Link
        href="/#project=flipkart-faq"
        transitionTypes={["nav-back"]}
        className="inline-flex min-h-11 items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to work
      </Link>

      <p className="mt-8 font-mono text-sm text-accent-soft">Case Study</p>
      <h1 className="font-display-3d mt-2 text-balance text-2xl leading-[1.4] text-foreground sm:text-3xl">
        Aster
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
          Aster is a full-stack support assistant built on a Flipkart help-centre dataset. It combines bounded
          intent routing, grounded FAQ retrieval, citations, durable conversations, account-scoped tools, and
          production deployment on Oracle Cloud. The commerce records, notes, and handoff tickets are deliberately
          simulated and clearly labelled; the app is not connected to Flipkart or a live commerce system.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Authenticated conversations persist in PostgreSQL, while an anonymous demo keeps its chat ephemeral.
          Typed WebSocket frames, stable client message IDs, replay after reconnect, turn deadlines, idempotent
          mutations, and committed completion semantics make interrupted and retried turns predictable.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Public FAQ answers come from immutable, versioned Qdrant knowledge collections that can be atomically
          promoted or rolled back. The shared semantic cache accepts only a closed vocabulary of public questions;
          account and conversation content never crosses that boundary.
        </p>
      </section>

      {/* 2. Architecture */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Architecture</h2>
        <p className="mt-4 text-muted">One bounded support turn, from transport checks to durable completion.</p>
        <div className="mt-8">
          <ArchitectureDiagram nodes={PIPELINE} />
        </div>
      </section>

      {/* 3. Real-world reliability */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Real-World Reliability</h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Identity comes from server-side context, never from an LLM argument. Every authenticated tool call
          rechecks the session and thread owner; mutation keys combine the durable turn, action, and resource so a
          retry returns the recorded result instead of repeating the operation. Regeneration is versioned and
          read-only, preventing a previous account action from being replayed as a new mutation.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Current validation reports 71/71 deterministic backend and PostgreSQL tests and 24/24 live intent cases.
          Production WebSocket smoke tests cover FAQ citations, tools, notes, simulated handoff, prompt injection,
          invalid frames, reconnect-safe IDs, and scope control. The OCI deployment runs Caddy, a non-root app
          container, private PostgreSQL and Qdrant services, health probes, backups, and bounded log rotation.
        </p>
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
