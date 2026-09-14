import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/shared/BrandIcons";
import { Button } from "@/components/shared/Button";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ArchitectureDiagram, type DiagramNode } from "@/components/shared/ArchitectureDiagram";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "AI Architect — Soban Shankar",
  description:
    "How AI Architect turns a plain-language description into a real, validated system architecture — the LLM never draws the diagram directly, it only emits typed mutation commands checked against real structural rules.",
};

const project = projects.find((p) => p.id === "ai-architect")!;

// The core technical hook, as a pipeline: three genuinely different entry
// points (a chat edit, a manual drag-and-drop on the canvas, an imported
// GitHub repo) all converge on the exact same validated path — none of
// them is a separate, less-trusted shortcut. The canvas only ever renders
// from validated state, never from whatever the model said directly.
const MUTATION_PIPELINE: DiagramNode[] = [
  {
    id: "entry",
    label: "Entry point — any of 3",
    detail: "A chat message, a manual drag-and-drop edit on the canvas, or a reconstructed diagram from an imported GitHub repo — all three go through the exact same path from here on.",
  },
  {
    id: "command",
    label: "Typed mutation command",
    detail: "The LLM never emits a diagram or a picture — only one of a handful of typed commands: add a node, connect two nodes, change a field.",
  },
  {
    id: "validate",
    label: "Structural validation",
    detail: "Every command is checked against real rules before it touches anything — a connectivity registry, schema checks, duplicate-node detection.",
  },
  {
    id: "state",
    label: "Validated state update",
    detail: "Only a command that passes validation is allowed to change the architecture's actual state.",
  },
  {
    id: "render",
    label: "Deterministic canvas render",
    detail: "The diagram is always drawn FROM that validated state, never BY the model — so the LLM can't propose something structurally broken and have the tool draw it anyway.",
  },
];

// A separate, genuinely different flow — not another mutation, an analysis
// pass over an already-valid design.
const ANALYSIS_PIPELINE: DiagramNode[] = [
  {
    id: "scenario",
    label: "Traffic multiplier or component kill",
    detail: "Pick a load scenario, or fail a specific component outright.",
  },
  {
    id: "propagate",
    label: "Deterministic capacity propagation",
    detail: "A modeled cascade, not another LLM guess — shows what breaks, in what order, and why.",
  },
  {
    id: "animate",
    label: "Live canvas animation",
    detail: "Particles animate along edges; an overloaded component is flagged directly on the diagram, live.",
  },
  {
    id: "analyzer",
    label: "Analyzer — 7 categories",
    detail: "Scalability, reliability, security, cost, observability, performance, maintainability — every finding cites the exact fact behind it, not a vague score.",
  },
  {
    id: "fix",
    label: "One-click \"Fix it\"",
    detail: "Hands a specific finding straight back to the architect agent to resolve — same validated mutation path as everything else.",
  },
];

const DECISIONS = [
  {
    q: "Why typed mutation commands, not letting the LLM draw the diagram directly?",
    a: "Most \"AI diagram\" tools have the model generate a picture or a blob of JSON that gets rendered as-is — so it can propose something structurally broken (two data flows into the same entry point, a load balancer in front of something with one instance, a dangling edge) and the tool just draws it. Here the LLM only ever emits one of a handful of typed commands, each validated before it can touch the architecture state — the diagram is always a rendering of validated state, never a rendering of the model's own words.",
  },
  {
    q: "Why validate a GitHub import the same way as a chat edit?",
    a: "Because it's the same pipeline, not a separate one. A deterministic discovery pass extracts real, source-attributed facts first — routes, ORM models, SQL migrations, auth usage, real third-party API calls — and only those facts reach the LLM, which then proposes components checked against real citations before acceptance. There's no less-trusted side door into the architecture state.",
  },
  {
    q: "Why a deterministic cost/capacity model instead of asking the LLM to estimate?",
    a: "An LLM guessing at infrastructure cost is unreproducible and wrong in ways that are hard to catch. ~30 component types each carry versioned capacity/cost assumptions that scale with compute size, storage, and the actual engine named — CockroachDB and Postgres are priced differently, so are DynamoDB and Redis — so the number is the same every time you ask, and it's actually grounded in what was chosen.",
  },
  {
    q: "Why real per-visitor privacy in guest mode, not just client-side hiding?",
    a: "No login is required to use the tool, but a guest's projects are only ever visible to the browser that created them via a private per-visitor identity — not a client-side filter that a different tab or a direct API call could see straight through.",
  },
];

export default function AiArchitectPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <ScrollProgress />
      <Link
        href="/#project=ai-architect"
        className="inline-flex min-h-11 items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to work
      </Link>

      <p className="mt-8 font-mono text-sm text-accent-soft">Featured Case Study</p>
      <h1 className="font-display-3d mt-2 text-balance text-2xl leading-[1.4] text-foreground sm:text-3xl">
        AI Architect
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
            <ExternalLink size={16} /> Live App
          </Button>
        )}
      </div>

      {/* 1. Overview */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Overview</h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">{project.description}</p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          A requirements interview (scale, budget, availability, consistency needs) produces the first grounded
          design — never a single LLM call guessing at a diagram. From there, a real cost &amp; capacity model
          across ~30 component types, a load/failure simulator, and a 7-category Analyzer all operate on the same
          validated architecture state.
        </p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          A validated design becomes an actual starting point, not just a picture of one — export produces
          architecture docs, a dependency-ordered build plan, and a runnable docker-compose.yml for every
          component with an honest local equivalent.
        </p>
      </section>

      {/* 2. Architecture — mutation pipeline */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Architecture — The Mutation Pipeline</h2>
        <p className="mt-4 text-muted">
          Three different ways in, one validated path — the diagram is rendered from state, never by the model.
        </p>
        <div className="mt-8">
          <ArchitectureDiagram nodes={MUTATION_PIPELINE} />
        </div>
      </section>

      {/* 3. Architecture — analysis & simulation */}
      <section className="mt-8">
        <h2 className="font-mono text-sm text-accent-soft">Architecture — Analysis &amp; Simulation</h2>
        <p className="mt-4 text-muted">
          A separate flow over an already-valid design — what breaks, in what order, and why.
        </p>
        <div className="mt-8">
          <ArchitectureDiagram nodes={ANALYSIS_PIPELINE} />
        </div>
      </section>

      {/* 4. Key engineering decisions */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Key Engineering Decisions</h2>
        <div className="mt-6 space-y-6">
          {DECISIONS.map((d) => (
            <div key={d.q} className="border-l-2 border-surface-border pl-5">
              <p className="font-medium text-foreground">{d.q}</p>
              <p className="mt-1.5 text-pretty text-sm text-muted">{d.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Tech stack */}
      <section className="mt-16 border-t border-surface-border pt-10">
        <h2 className="font-mono text-sm text-accent-soft">Tech Stack</h2>
        <p className="mt-4 font-mono text-sm text-muted">{project.techTags.join(" · ")}</p>
      </section>
    </main>
  );
}
