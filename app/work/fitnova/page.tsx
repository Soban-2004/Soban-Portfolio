import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Activity } from "lucide-react";
import { GitHubIcon } from "@/components/shared/BrandIcons";
import { Button } from "@/components/shared/Button";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ArchitectureDiagram, type DiagramNode } from "@/components/shared/ArchitectureDiagram";
import { WhatsSimplifiedToggle } from "@/components/work/fitnova/WhatsSimplifiedToggle";
import { GotchasList } from "@/components/work/fitnova/GotchasList";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "FitNova — AI Sales-Call Intelligence System | Soban Shankar",
  description:
    "How FitNova ingests, transcribes, and scores sales calls with a 3-pass LLM pipeline, deterministic scoring, and real production error handling.",
};

const fitnova = projects.find((p) => p.id === "fitnova")!;

const PIPELINE: DiagramNode[] = [
  {
    id: "ingest",
    label: "Ingestion",
    detail: "An idempotency check (unique per source + external id) either rejects a duplicate or moves the call to QUEUED — retries are explicitly allowed after a prior FAILED.",
  },
  {
    id: "worker",
    label: "Background worker",
    detail: "An async worker polls for QUEUED rows every few seconds — no message broker — and moves state to TRANSCRIBING.",
  },
  {
    id: "deepgram",
    label: "Deepgram Nova-3 + PII redaction",
    detail: "Transcribes and diarizes the call (multi-language), then redacts PII before anything touches an LLM.",
  },
  {
    id: "pass1",
    label: "LLM pass 1 — speaker role ID",
    detail: "Narrow, schema-validated, temperature=0. Identifies which diarized speaker is the advisor before any scoring logic runs.",
  },
  {
    id: "pass2",
    label: "LLM pass 2 — issue detection + validation",
    detail: "Flags compliance/quality issues, each tag run through 3 layers before it's trusted: Pydantic schema → RapidFuzz fuzzy match near the timestamp → Gemini semantic embeddings, only if the fuzzy match fails.",
  },
  {
    id: "pass3",
    label: "LLM pass 3 — dimension ratings",
    detail: "Rates the call along fixed dimensions — still no arithmetic, just structured ratings the scoring engine will weight.",
  },
  {
    id: "scoring",
    label: "Deterministic scoring",
    detail: "The LLM never does arithmetic — dimension ratings feed a weighted base score, validated tags apply severity-based deductions, deduplicated by tag type.",
  },
  {
    id: "broadcast",
    label: "SSE broadcast",
    detail: "State moves to COMPLETED and every open dashboard tab gets pushed a call_status_changed event — no polling, no manual reload.",
  },
];

const DECISIONS = [
  {
    q: "Why 3-pass LLM analysis, not one call?",
    a: "Narrow, schema-validated passes at temperature=0, each validated before the next touches the output — a single sprawling call is harder to validate and more prone to silent drift.",
  },
  {
    q: "Why deterministic scoring?",
    a: "The LLM never does arithmetic. Dimension ratings feed a weighted score, tags apply severity deductions, deduplicated by type — the score is reproducible, not regenerated on a whim.",
  },
  {
    q: "Why a fallback model chain (Groq → Gemini → Ollama Cloud)?",
    a: "One provider's outage doesn't fail a call outright. A thin custom abstraction handles the chain — no LangChain or LiteLLM in the loop.",
  },
  {
    q: "Why SSE, not polling or WebSockets?",
    a: "Data only flows server→client here (a call finished, please refresh). A one-directional stream fits better than full-duplex, and pushing on real state change beats polling on a timer.",
  },
  {
    q: "Why a DB-column state machine, not a message broker?",
    a: "A single-process worker at this scale doesn't need one. A distributed queue would add infrastructure without demonstrable benefit yet, and swapping the executor later doesn't change the schema.",
  },
  {
    q: "How is LLM output validated?",
    a: "The 3-layer chain above: Pydantic schema → RapidFuzz fuzzy match → Gemini semantic embeddings, escalating only when a cheaper check fails.",
  },
];

const WHATS_NEXT = [
  "Deepgram transcribe-by-URL, once B2 holds a permanent copy — removes the local upload write entirely.",
  "Neon's pooled (-pooler) connection endpoint, to reduce connection flakiness under concurrent load.",
  "Real voiceprint verification for advisor identity, replacing asserted metadata.",
  "Redis-backed SSE broadcast and progress store, needed the moment the backend runs as more than one instance.",
  "Granular retry/backoff per failure type, instead of one flat retry policy for every exception.",
];

export default function FitNovaPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <ScrollProgress />
      <Link
        href="/#project=fitnova"
        className="inline-flex min-h-11 items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to work
      </Link>

      <p className="mt-8 font-mono text-sm text-accent-soft">Featured Case Study</p>
      <h1 className="font-display-3d mt-2 text-balance text-2xl leading-[1.4] text-foreground sm:text-3xl">
        FitNova — AI Sales-Call Intelligence System
      </h1>
      <p className="mt-3 font-mono text-sm text-muted">{fitnova.period}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {fitnova.githubUrl && (
          <Button href={fitnova.githubUrl} variant="secondary">
            <GitHubIcon size={16} /> GitHub
          </Button>
        )}
        {fitnova.liveUrl && (
          <Button href={fitnova.liveUrl} variant="secondary">
            <ExternalLink size={16} /> Live Frontend
          </Button>
        )}
        {fitnova.secondaryUrl && (
          <Button href={fitnova.secondaryUrl.url} variant="secondary">
            <Activity size={16} /> {fitnova.secondaryUrl.label}
          </Button>
        )}
      </div>

      {/* 1. Overview */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Overview</h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">{fitnova.description}</p>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          Built at production-level care, not as a demo: 35 real, integration-style tests against a real
          database, real error handling, real failure-path recovery.
        </p>
      </section>

      {/* 2. Architecture */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Architecture</h2>
        <p className="mt-4 text-muted">
          Recording in, diarized transcript and 3-pass analysis through, live-scored call out.
        </p>
        <div className="mt-8">
          <ArchitectureDiagram nodes={PIPELINE} />
        </div>
      </section>

      {/* 3. Key engineering decisions */}
      <section className="mt-8">
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

      {/* 4. Real deployment gotchas */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Real Deployment Gotchas</h2>
        <p className="mt-4 text-muted">Three real ones hit during actual deployment, not a hypothetical list.</p>
        <div className="mt-6">
          <GotchasList />
        </div>
      </section>

      {/* 5. What's real vs. simplified */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Honesty Check</h2>
        <p className="mt-4 text-muted">
          Not every part of a personal project is production-grade — here&apos;s exactly which parts are, and
          which aren&apos;t.
        </p>
        <div className="mt-6">
          <WhatsSimplifiedToggle />
        </div>
      </section>

      {/* 6. What's next */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">What&apos;s Next</h2>
        <ul className="mt-4 space-y-2">
          {WHATS_NEXT.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-muted">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Tech stack */}
      <section className="mt-16 border-t border-surface-border pt-10">
        <h2 className="font-mono text-sm text-accent-soft">Tech Stack</h2>
        <p className="mt-4 font-mono text-sm text-muted">{fitnova.techTags.join(" · ")}</p>
      </section>
    </main>
  );
}
