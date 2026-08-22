import { BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import type { ResearchPaper } from "@/lib/content";

// The "Grounded, not guessed" research card (IMPLEMENTATION.md §4.6) — a
// citation strip echoes the same grounding principle behind Soban's actual
// engineering work: nothing stated without a verifiable source.
export function PaperCard({ paper }: { paper: ResearchPaper }) {
  return (
    // The hover lift + hard offset shadow is the same "coming out of the
    // screen" block-shadow language as .font-display-3d elsewhere on the
    // site, just applied to a whole card via box-shadow instead of
    // text-shadow — a solid (non-blurred) accent-colored offset, not a soft
    // drop shadow, so it reads as a chunky 3D pop, not a generic elevation.
    <Reveal
      y={20}
      className="rounded-lg border border-surface-border bg-surface/50 p-4 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:border-accent hover:shadow-[4px_4px_0_0_var(--accent)] active:-translate-x-1 active:-translate-y-1 active:border-accent active:shadow-[4px_4px_0_0_var(--accent)] sm:p-6"
    >
      <h3 className="text-pretty text-sm font-medium text-foreground sm:text-lg">{paper.title}</h3>
      <p className="mt-1 font-mono text-xs text-muted">
        {paper.conference} · {paper.year} · {paper.authorsNote}
      </p>
      {/* line-clamp-2 on mobile only — the full one-liner plus everything
          else in this card (title, conference line, verify link) doesn't
          fit two dense papers on one phone screen otherwise; sm+ (where
          both cards sit side by side with more width, not stacked) shows
          the full text. */}
      <p className="mt-2 line-clamp-2 text-pretty text-xs text-muted sm:mt-3 sm:line-clamp-none sm:text-sm">{paper.oneLiner}</p>

      <a
        href={paper.sourceUrl}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-1.5 font-mono text-xs text-accent-soft transition-colors duration-150 hover:border-accent/50 active:border-accent/50 sm:mt-4"
      >
        <BadgeCheck size={13} />
        Verified against: {paper.sourceLabel}
        {paper.doi ? ` (DOI)` : ""}
      </a>
    </Reveal>
  );
}
