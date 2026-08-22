import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";

// Eyebrow index line + giant display headline (Commit Log reference) —
// replaces the earlier smaller/quieter section header. `title` accepts
// JSX so callers can wrap part of it in <Accent> for the bicolor look.
// Wrapped in Reveal (small 12px rise + fade, triggered once this scrolls
// into view) — this single component backs every section title site-wide,
// so it's the one edit that gives every section heading the same
// scroll-in "activating" beat.
export function SectionHeading({
  index,
  label,
  title,
  note,
}: {
  index: string; // e.g. "01"
  label: string; // e.g. "METRICS"
  title: ReactNode;
  note?: string;
}) {
  return (
    <Reveal y={12}>
      <p className="font-mono text-xs text-accent">
        // {index} — {label}
      </p>
      {/* break-words as a safety net: every caller's title is one
          unbroken "word" (PREFIX_SUFFIX, no space — the underscore isn't a
          break opportunity), which at this font/size overflowed the page
          on narrow phone screens with nowhere to wrap. Each caller now
          also gets a <wbr /> right before the <Accent> half, so the
          natural break (when one's needed at all) lands at that
          prefix/suffix color boundary instead of splitting a word
          mid-character. */}
      <h2 className="font-display-3d mt-3 break-words text-3xl uppercase leading-[1.2] text-foreground sm:mt-4 sm:text-5xl">
        {title}
      </h2>
      {note && <p className="mt-2 max-w-xl text-sm text-muted sm:mt-4 sm:text-base">{note}</p>}
    </Reveal>
  );
}
