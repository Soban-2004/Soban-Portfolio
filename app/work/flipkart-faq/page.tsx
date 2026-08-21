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
          order status, refund tracking, and human escalation via MCP tools, not just FAQ lookup.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          A LiteLLM gateway falls back across 3 models and 2 providers for resilience. Validated via a 25-scenario
          RAGAS evaluation and deployed as a Docker container on Render.
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

      {/* 3. Tech stack */}
      <section className="mt-16 border-t border-surface-border pt-10">
        <h2 className="font-mono text-sm text-accent-soft">Tech Stack</h2>
        <p className="mt-4 font-mono text-sm text-muted">{project.techTags.join(" · ")}</p>
      </section>
    </main>
  );
}
