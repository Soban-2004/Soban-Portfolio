import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/shared/BrandIcons";
import { Button } from "@/components/shared/Button";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ArchitectureDiagram, type DiagramNode } from "@/components/shared/ArchitectureDiagram";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Agentic RAG Customer Support Platform — Soban Shankar",
  description:
    "How the Flipkart FAQ agentic RAG system routes intent, retrieves over a 2,000-entry corpus, falls back across MCP tools, and clears every response through 7 parallel guardrail scanners.",
};

const project = projects.find((p) => p.id === "flipkart-faq")!;

const PIPELINE: DiagramNode[] = [
  { id: "query", label: "Query received", detail: "Treated like a real customer support message, not a benchmark prompt." },
  {
    id: "vision",
    label: "Vision (optional)",
    detail: "If a photo is attached — e.g. a damaged item — Groq's Llama 4 Scout produces a factual description that folds into the message as plain-text context before anything else runs.",
  },
  { id: "route", label: "Intent-routing planner", detail: "Decides whether this is a pure FAQ lookup, an order/refund status question, or something needing escalation." },
  { id: "vector-db", label: "Vector DB — Qdrant", detail: "Hybrid dense + BM25 search across the ~2,000-entry FAQ corpus." },
  { id: "tools", label: "MCP tool selection", detail: "If it isn't a pure FAQ match, one of 4 MCP tools is invoked instead — e.g. order status or refund tracking." },
  { id: "guardrails", label: "LLM Guard — 7 scanners", detail: "The retrieved context and the draft response both pass through 7 parallel guardrail scanners before anything is shown — cut latency from ~4.5s to ~1s." },
  { id: "answer", label: "Grounded answer", detail: "The response is backed by the retrieved FAQ entry or a live tool result — never the model's own memory." },
];

export default function FlipkartFaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <ScrollProgress />
      <Link
        href="/#project=flipkart-faq"
        className="inline-flex min-h-11 items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to work
      </Link>

      <p className="mt-8 font-mono text-sm text-accent-soft">Case Study</p>
      <h1 className="font-display-3d mt-2 text-balance text-2xl leading-[1.4] text-foreground sm:text-3xl">
        Agentic RAG Customer Support Platform
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
          An agentic RAG customer support system over a ~2,000-entry Flipkart FAQ corpus, built on LlamaIndex —
          order status, refund tracking, and human escalation via MCP tools, not just FAQ lookup. A customer can
          also attach a photo of a damaged or defective item; a vision-capable model (Groq&apos;s Llama 4 Scout)
          describes it in plain text before the normal pipeline runs, so nothing downstream needed to change.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          A LiteLLM gateway falls back across 3 models and 2 providers for resilience. Validated via a 25-scenario
          RAGAS evaluation and deployed as a Docker container on Render.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Every chat turn is tagged in Langfuse with exactly how it was resolved — cache hit, guardrail block, a
          specific tool call, plain chat, or error — so &quot;what fraction of turns hit a tool vs. the cache vs.
          plain chat&quot; is answerable straight from the dashboard, not guessed at.
        </p>
      </section>

      {/* 2. Architecture */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Architecture</h2>
        <p className="mt-4 text-muted">Message in, routed through intent and retrieval, guardrail-checked out.</p>
        <div className="mt-8">
          <ArchitectureDiagram nodes={PIPELINE} />
        </div>
      </section>

      {/* 3. Real-world reliability */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Real-World Reliability</h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          On Aug 16, Groq deprecated both models this app&apos;s LLM gateway depended on — its primary
          (llama-3.3-70b-versatile) and its fallback (llama-3.1-8b-instant). Every call had been failing silently
          for two weeks: the intent classifier fails open to a safe default rather than raising, so nothing
          visibly broke in the meantime.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Caught by a new intent-classification eval suite — a gold-labeled case set covering all five intents,
          including a regression case tied to a real bug found earlier the same session — on its first real run.
          Fixed by moving to Groq&apos;s recommended successors, reasoning models with different failure modes
          than their predecessors, which needed automatic reasoning_effort/reasoning_format handling added to the
          LLM gateway so every caller stays safe with zero per-call changes. Verified against the live API three
          ways: the new intent suite (9/9), the existing tool-calling suite (9/9), and the exact configuration
          Render runs in production — confirmed with real tool calls and correct answers, not just a passing test.
        </p>
      </section>

      {/* 4. Tech stack */}
      <section className="mt-16 border-t border-surface-border pt-10">
        <h2 className="font-mono text-sm text-accent-soft">Tech Stack</h2>
        <p className="mt-4 font-mono text-sm text-muted">{project.techTags.join(" · ")}</p>
      </section>
    </main>
  );
}
