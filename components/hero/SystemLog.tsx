// A real status readout, not a fake one — every line here is pulled from
// the same content.ts values used elsewhere on the site, formatted as a
// terminal/log panel (the device Commit Log uses with git commits; this
// uses Soban's actual verified facts instead). Static — no motion, matches
// a real system-status readout rather than a performing animation.

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
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        </div>
        <span className="font-mono text-xs text-muted">whoami --status</span>
      </div>
      <div className="space-y-1 px-3 py-2 sm:space-y-1.5 sm:px-4 sm:py-3">
        {lines.map((line) => (
          <p key={line} className="font-mono text-xs text-muted">
            <span className="text-accent">[OK]</span> {line}
          </p>
        ))}
        <p className="font-mono text-xs text-accent-soft">
          STATUS: <span className="text-foreground">OPEN_TO_RELOCATION</span>
        </p>
      </div>
    </div>
  );
}
