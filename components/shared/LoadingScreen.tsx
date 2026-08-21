"use client";

// A terminal boot sequence shown once before the site reveals itself — the
// same real, already-verified facts SystemLog.tsx shows in the hero (not
// invented copy for the occasion), just framed as a boot log instead of a
// status readout. Mounted once in the root layout, so it only ever fires on
// a genuine fresh page load: Next's App Router keeps the layout mounted
// across client-side navigation between sections/case-study pages, so
// clicking around the site never re-triggers it. sessionStorage skips it
// on a same-tab refresh later in the same session, and it's skipped
// entirely under prefers-reduced-motion (jumps straight to the site,
// no held screen, no line-by-line animation, no unlock wipe).
//
// Dismissal is a "Matrix unlock" wipe, not a plain fade: the terminal
// panel fades out first, then a grid of cells — same idea as the site's
// own ambient background grid — cascades open top-left to bottom-right,
// each cell briefly flashing a green glow right before it goes
// transparent and reveals the real page underneath it. Pure CSS keyframe
// animation with a per-cell stagger delay (see .matrix-unlock-cell in
// globals.css); no canvas, no per-frame JS.

import { useEffect, useRef, useState } from "react";
import { identity, projects, openSource, research, experience } from "@/lib/content";
import { BOOT_SESSION_KEY, BOOT_UNLOCK_EVENT } from "@/lib/bootSignal";

// Paced so the full boot sequence (6 lines) plus hold lands around 2.8s,
// then the panel fade + grid unlock adds another ~1.1s on top — a bit over
// 3.5s total end to end.
const LINE_DELAY_MS = 380;
const HOLD_MS = 500;
const PANEL_FADE_MS = 280;

// The unlock grid: fixed column/row counts (not tied to actual viewport
// pixel size like the ambient background's 40px cells) — chunky, deliberate
// pixel-block tiles rather than a literal continuation of that finer grid,
// which reads better at this size and keeps the DOM to a flat 60 divs
// regardless of screen size. wave = col + row is each cell's distance from
// the top-left corner along the diagonal, so staggering by wave is what
// produces the top-left → bottom-right cascade rather than a row-by-row or
// random reveal.
const GRID_COLS = 10;
const GRID_ROWS = 6;
const WAVE_DELAY_MS = 35;
const CELL_DURATION_MS = 380;
const MAX_WAVE = GRID_COLS - 1 + (GRID_ROWS - 1);
const UNLOCK_TOTAL_MS = MAX_WAVE * WAVE_DELAY_MS + CELL_DURATION_MS;

const GRID_CELLS = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS);
  return { col, row, wave: col + row };
});

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [panelHidden, setPanelHidden] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [shownCount, setShownCount] = useState(0);
  // Holds the one-time decision (skip / reduced-motion-skip / run) made the
  // first time this effect fires. React's Strict Mode (on by default under
  // the App Router in `next dev`) intentionally mounts every effect twice
  // — mount, cleanup, mount — to surface missing-cleanup bugs. That's fine
  // for the interval below (its own cleanup tears it down and the second
  // invocation just starts a fresh one), but the sessionStorage check was
  // reading its own write from the first invocation and concluding the
  // second invocation was a repeat visit — killing the boot sequence
  // within milliseconds, only in dev. Caching the decision in a ref (which
  // persists across the double-invoke, same component instance) means the
  // sessionStorage read only ever happens once.
  const decisionRef = useRef<"skip" | "reduced" | "run" | null>(null);

  const shippedCount = projects.filter((p) => p.featured).length;
  const slug = identity.name.toLowerCase().replace(/\s+/g, "-");
  const lines = [
    `booting ${slug}`,
    `identity verified — ${identity.role}`,
    `${shippedCount} production RAG/agentic systems mounted`,
    `1 OSS PR merged — ${openSource.repo}${openSource.prNumber}`,
    `${research.length} papers co-authored — IEEE`,
    `${experience.stats[0].value} avg. manual effort reduced — Drivestream`,
  ];

  useEffect(() => {
    if (decisionRef.current === null) {
      if (sessionStorage.getItem(BOOT_SESSION_KEY)) {
        decisionRef.current = "skip";
      } else {
        sessionStorage.setItem(BOOT_SESSION_KEY, "1");
        // Direct matchMedia, not the useReducedMotion() hook: the hook
        // doesn't resolve synchronously on this component's very first
        // effect run (it settles a render or two later), which meant this
        // branch could be skipped once with a stale falsy value and the
        // animated sequence would already be underway by the time it
        // corrected itself. matchMedia is accurate immediately.
        decisionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "reduced"
          : "run";
      }
    }

    if (decisionRef.current !== "run") {
      setVisible(false);
      // Hero waits for this event before running its own left-to-right
      // content fade-in — it has no other way to know the boot sequence
      // is being skipped (repeat visit / reduced motion) rather than about
      // to play, and would otherwise sit invisible forever in that case.
      window.dispatchEvent(new Event(BOOT_UNLOCK_EVENT));
      return;
    }

    let i = 0;
    const timers: number[] = [];
    const interval = window.setInterval(() => {
      i++;
      setShownCount(i);
      if (i >= lines.length) {
        window.clearInterval(interval);
        timers.push(
          window.setTimeout(() => {
            setPanelHidden(true);
            timers.push(
              window.setTimeout(() => {
                setUnlocking(true);
                timers.push(
                  window.setTimeout(() => {
                    setVisible(false);
                    // Fired once this overlay is actually gone, not when
                    // the grid starts cascading — dispatching it earlier
                    // meant Hero's 700ms fade-in was racing the unlock
                    // wipe itself: since Hero sits in the upper portion of
                    // the screen, the cells over it cleared early in the
                    // cascade too, so by the time they did, Hero was
                    // already most of the way through fading in
                    // underneath them — the two effects overlapped instead
                    // of reading as "wipe, then reveal", and the fade was
                    // barely perceptible. Waiting until the wipe has fully
                    // finished means Hero's reveal now plays out clearly
                    // as its own, visible second beat.
                    window.dispatchEvent(new Event(BOOT_UNLOCK_EVENT));
                  }, UNLOCK_TOTAL_MS),
                );
              }, PANEL_FADE_MS),
            );
          }, HOLD_MS),
        );
      }
    }, LINE_DELAY_MS);

    return () => {
      window.clearInterval(interval);
      timers.forEach((t) => window.clearTimeout(t));
    };
    // Runs once on mount only — lines/shippedCount are derived from static
    // content.ts data, not props/state that should re-trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div role="status" aria-label="Loading" className="fixed inset-0 z-[200] overflow-hidden bg-background">
      {/* The unlock grid. Always mounted while the loading screen is —
          before `unlocking` flips true every cell is just a plain solid
          bg-background square (visually identical to a single solid
          backdrop, matching the boot panel's background), so there's no
          visual difference from the old plain-fade version until the
          wipe actually starts. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}
      >
        {GRID_CELLS.map(({ col, row, wave }) => (
          <div
            key={`${col}-${row}`}
            className={`border border-surface-border/40 ${unlocking ? "matrix-unlock-cell" : "bg-background"}`}
            style={unlocking ? { animationDelay: `${wave * WAVE_DELAY_MS}ms` } : undefined}
          />
        ))}
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center px-6 transition-opacity ease-out ${
          panelHidden ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{ transitionDuration: `${PANEL_FADE_MS}ms` }}
      >
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-lg border border-surface-border bg-surface/60">
            <div className="flex items-center gap-3 border-b border-surface-border px-3 py-2">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
              </div>
              <span className="font-mono text-xs text-muted">boot.sh</span>
            </div>
            <div className="min-h-[9.5rem] space-y-1.5 px-4 py-4">
              {lines.slice(0, shownCount).map((line) => (
                <p key={line} className="font-mono text-xs text-muted">
                  <span className="text-accent">[OK]</span> {line}
                </p>
              ))}
              {shownCount >= lines.length && (
                <p className="font-mono text-xs text-accent-soft">
                  STATUS: <span className="text-foreground">READY</span>
                  <span className="cursor-blink ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-accent" />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
