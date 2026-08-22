import Link from "next/link";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accent } from "@/components/shared/Accent";
import { StatBox } from "@/components/shared/StatBox";
import { TagChip } from "@/components/shared/TagChip";
import { Reveal } from "@/components/shared/Reveal";
import { identity, projects, research } from "@/lib/content";

// Recruiters skim this row for keyword matches, and the previous list was
// all specific tools/frameworks (LangChain, Qdrant, ...) with none of the
// higher-level terms an ATS/recruiter search actually keys on. Leading
// with the domain terms themselves — spelled out, not just implied by the
// tool names — fixes that; each one is directly attested in profile.md
// (identity.role: "AI Engineer (LLMs, RAG, Agentic AI)"; hero.headline:
// "agentic RAG systems, multi-agent orchestration"; MCP is a named tool
// in the Flipkart FAQ project's tech list).
const CORE_STACK = [
  "Agentic AI",
  "RAG",
  "LLMs",
  "Multi-Agent Orchestration",
  "MCP (Model Context Protocol)",
  "Python",
  "FastAPI",
  "LangChain",
  "LangGraph",
  "Qdrant",
  "Docker",
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Deepgram",
];

// Same abbreviation used on the project cards' own tech-tag chips — the
// two names here long enough to be the reason a wrapped mobile row needs
// extra lines; everything else in CORE_STACK is already short.
const CORE_STACK_MOBILE_LABEL: Record<string, string> = {
  "Multi-Agent Orchestration": "Multi-Agent",
  "MCP (Model Context Protocol)": "MCP",
};

export function Stats() {
  const flipkart = projects.find((p) => p.id === "flipkart-faq")!;
  const resumeMatcher = projects.find((p) => p.id === "resume-matcher")!;

  return (
    <section id="stats" className="mx-auto max-w-6xl px-6 py-12 sm:py-24">
      <SectionHeading
        index="02"
        label="METRICS"
        title={
          <>
            SYS<wbr />
            <Accent>_STATS</Accent>
          </>
        }
      />

      {/* grid-cols-3 even on the narrowest phone (was grid-cols-1 below sm,
          stacking all three full-width — reading as three separate falling
          blocks instead of the compact laptop-style row this is meant to
          echo). StatBox's own text scales down enough (text-2xl value,
          text-xs label) to still read fine at a ~110px column width. */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-4">
        <StatBox value={String(projects.filter((p) => p.featured).length)} label="Systems Shipped" />
        <StatBox value={String(research.length)} label="Papers Co-Authored" delay={80} />
        <StatBox value={resumeMatcher.headlineStat.value} label={resumeMatcher.headlineStat.label} filled delay={160} />
      </div>

      {/* Same hover lift/shadow treatment as StatBox above, hand-applied
          here since these three are one-off layouts rather than StatBox
          instances — keeps the whole SYS_STATS section consistently
          "hoverable" rather than just the top row. active: mirrors every
          hover: so tapping works the same way on touch (see StatBox.tsx
          for why). Each also gets Reveal directly (not StatBox, which is a
          different component) with the same small stagger as the row above.
          Mobile layout: Core Stack spans both columns of a 2-col grid,
          Latency Cut/Schema Scale sit side by side beneath it — three full-
          width stacked cards (the old grid-cols-1 default) ran too tall to
          keep this section on one screen. lg+ still resolves to the
          original single-row [1fr_auto_auto] layout, col-span reset to 1. */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-[1fr_auto_auto]">
        <Reveal
          y={16}
          className="col-span-2 rounded-md border border-surface-border p-3 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)] active:-translate-y-1 active:border-accent/60 active:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)] sm:p-5 lg:col-span-1"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Core Stack</p>
          {/* Wraps at every breakpoint now — no horizontal scroll/slide to
              discover. The two longest names get a shorter mobileLabel
              (see CORE_STACK_MOBILE_LABEL) specifically to keep this from
              needing more rows than it should below sm. */}
          <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3">
            {CORE_STACK.map((tech, i) => (
              <TagChip key={tech} label={tech} mobileLabel={CORE_STACK_MOBILE_LABEL[tech]} filled={i === 0} />
            ))}
          </div>
        </Reveal>
        <Reveal
          y={16}
          delay={80}
          className="rounded-md border border-critical p-3 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_10px_28px_-12px_rgba(255,59,110,0.4)] active:-translate-y-1 active:shadow-[0_10px_28px_-12px_rgba(255,59,110,0.4)] sm:p-5"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Latency Cut</p>
          <p className="mt-1 font-mono text-xl font-black text-critical sm:mt-2 sm:text-3xl">{flipkart.headlineStat.value}</p>
          <p className="mt-1 font-mono text-[10px] text-muted">7 parallel guardrail scanners</p>
        </Reveal>
        <Reveal
          y={16}
          delay={160}
          className="rounded-md border border-surface-border p-3 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)] active:-translate-y-1 active:border-accent/60 active:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)] sm:p-5"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Schema Scale</p>
          <p className="mt-1 font-mono text-xl font-black text-foreground sm:mt-2 sm:text-3xl">2,000+</p>
          <p className="mt-1 font-mono text-[10px] text-muted">HCM tables/views via RAG</p>
        </Reveal>
      </div>

      <Reveal
        y={16}
        as="div"
        className="relative mt-3 flex flex-col items-start gap-2 overflow-hidden rounded-md border border-accent p-4 sm:mt-4 sm:flex-row sm:items-center sm:gap-4 sm:p-6"
      >
        <div
          aria-hidden="true"
          className="glow-pulse pointer-events-none absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-wide text-accent">Current Status</p>
          <p className="mt-1 text-xl font-black uppercase text-foreground sm:text-2xl">Open_to_Work</p>
        </div>
        <p className="max-w-md text-xs text-muted sm:ml-6 sm:text-sm">{identity.location} — {identity.relocation}. Focused on production AI/RAG engineering roles.</p>
        {/* Filled at rest, inverts to outlined (transparent fill, accent
            border + text) on hover/tap — same "opposite colors" treatment
            as HIRE() in the nav and LIVE_LINK on project cards. */}
        <Link
          href="#contact"
          className="ml-auto inline-flex min-h-9 shrink-0 items-center rounded-md border-2 border-accent bg-accent px-3.5 py-1.5 font-mono text-xs font-medium text-background transition-colors duration-150 hover:bg-transparent hover:text-accent active:bg-transparent active:text-accent sm:min-h-11 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          CONTACT()
        </Link>
      </Reveal>
    </section>
  );
}
