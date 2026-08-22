import { GitPullRequest } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import type { OpenSourceContribution } from "@/lib/content";

// Before/after comparison card (IMPLEMENTATION.md §4.7) — no fabricated code
// diff, just a truthful two-column behavior comparison grounded in the real
// PR description.
export function DiffCard({ contribution }: { contribution: OpenSourceContribution }) {
  return (
    <Reveal y={20} className="rounded-lg border border-surface-border bg-surface/50 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 font-mono text-sm text-foreground">
          <GitPullRequest size={16} className="text-accent" />
          {contribution.repo} {contribution.prNumber}
          <span className="rounded-md bg-success/15 px-2 py-0.5 text-xs text-success">Merged</span>
        </div>
        {/* underline-hover (same "underline draws in from the left" as
            VIEW_CASE_STUDY/VIEW_REPO) instead of a color-only hover — was
            just hover:text-accent, which is easy to miss as a "hover
            effect" at all next to an already-accent-colored link. */}
        <a
          href={contribution.prUrl}
          className="underline-hover font-mono text-sm text-accent-soft transition-colors duration-150 hover:text-accent active:text-accent"
        >
          View PR ↗
        </a>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
        <div className="rounded-md border border-amber/25 bg-amber/5 p-3 sm:p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-amber">Before</p>
          <p className="mt-1.5 text-sm text-muted sm:mt-2">{contribution.before}</p>
        </div>
        <div className="rounded-md border border-success/25 bg-success/5 p-3 sm:p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-success">After</p>
          <p className="mt-1.5 text-sm text-muted sm:mt-2">{contribution.after}</p>
        </div>
      </div>

      <p className="mt-3 font-mono text-xs text-muted sm:mt-4">
        {contribution.testsAdded} regression tests added · {contribution.totalPassing} tests passing
        {contribution.issueNumber ? ` · traces to issue ${contribution.issueNumber}` : ""}
      </p>
    </Reveal>
  );
}
