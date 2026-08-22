import type { ReactNode } from "react";

// Reusable terminal/log-panel window chrome (Commit Log reference) — used
// wherever the site shows something as "system output": the hero status
// readout, a project's real test output, the contact panel. Content is
// always real (verified facts styled as log lines) or explicitly labeled
// illustrative — never presented as a live computed result.
export function TerminalPanel({
  title,
  meta,
  children,
  accent = "border-surface-border",
}: {
  title: string;
  meta?: string;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-md border bg-background/60 ${accent}`}>
      <div className="flex items-center gap-3 border-b border-surface-border px-3 py-1.5 sm:py-2">
        {/* The traffic-light dots — red/yellow/green via critical/amber/
            accent specifically, the same three tokens every other
            terminal-style header on the site uses (SystemLog, LoadingScreen)
            so this reads as one consistent window chrome wherever it shows
            up, not a slightly different palette per panel. Not `success`:
            that token is actually a cyan/blue (#4db8d9), despite the name —
            using it here read as a blue dot where red/yellow/green was
            expected. Full-strength fill (not the old /60 translucent one)
            for an actually bright dot, not a glow — that was tried and
            explicitly not wanted, just the plain saturated color. */}
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-critical" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        </div>
        <span className="font-mono text-xs text-muted">{title}</span>
        {meta && <span className="ml-auto font-mono text-[10px] text-muted/50">{meta}</span>}
      </div>
      {/* space-y/padding tightened for mobile only — the Contact panel has
          8 real lines in it, the tallest single element in that section, so
          shaving a few px per line adds up; sm+ restores the original
          breathing room. */}
      <div className="space-y-1 px-3 py-2 sm:space-y-1.5 sm:px-4 sm:py-3">{children}</div>
    </div>
  );
}
