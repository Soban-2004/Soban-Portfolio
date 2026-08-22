// A real status readout, not a fake one — every line here is pulled from
// the same content.ts values used elsewhere on the site, formatted as a
// terminal/log panel (the device Commit Log uses with git commits; this
// uses Soban's actual verified facts instead). The [OK] lines are static,
// matching a real system-status readout rather than a performing
// animation — only the actual live-status line (STATUS: OPEN_TO_WORK, the
// one line that's genuinely "currently true" rather than a completed
// fact) gets its own pulsing/sweeping treatment, deliberately singling it
// out from the rest.

import { projects, openSource, research, experience } from "@/lib/content";

export function SystemLog() {
  const shippedCount = projects.filter((p) => p.featured).length;

  const lines = [
    `${shippedCount} production RAG/agentic systems shipped`,
    `1 OSS PR merged · ${openSource.repo}${openSource.prNumber}`,
    `${research.length} papers co-authored · IEEE`,
    `${experience.stats[0].value} avg. manual effort reduced · Drivestream`,
  ];

  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-surface-border bg-surface/60">
      <div className="flex items-center gap-3 border-b border-surface-border px-3 py-1.5 sm:py-2">
        {/* Red/yellow/green via critical/amber/accent — the same triad
            TerminalPanel and LoadingScreen use, so every terminal-style
            header on the site reads as one consistent window chrome
            rather than each panel picking its own palette. This used to
            be amber/success/accent (no red at all, and `success` is
            actually a cyan/blue token despite the name — two off notes at
            once). Full-strength fill (not the old /60 translucent one)
            for an actually bright dot — a glow was tried on top of this
            and explicitly not wanted, just the plain saturated color. */}
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-critical" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        </div>
        <span className="font-mono text-xs text-muted">whoami --status</span>
      </div>
      <div className="space-y-1 px-3 py-2 sm:space-y-1.5 sm:px-4 sm:py-3">
        {lines.map((line) => (
          <p key={line} className="font-mono text-xs text-muted">
            <span className="text-accent">[OK]</span> {line}
          </p>
        ))}
        {/* Matches the same "Open_to_Work" status label Stats.tsx's own
            Current Status block already uses — this line said
            OPEN_TO_RELOCATION, a different (also true, just narrower)
            fact than the one the rest of the site leads with.
            status-badge: see the CSS comment in globals.css for what the
            neon-flash animation is doing and why. */}
        <p className="font-mono text-xs text-accent-soft">
          STATUS: <span className="status-badge">OPEN_TO_WORK</span>
        </p>
      </div>
    </div>
  );
}
