"use client";

// Tech stack as a live graph, not a list (IMPLEMENTATION.md §4.2 / §18).
// Hovering (desktop) or tapping (mobile) a technology node shows which real
// projects used it, grounded in profile.md — never a claim not backed by a
// project's own tech line.

import { useEffect, useState, type MouseEvent, type FocusEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { techNodes, techCategoryLabels, projects, type TechCategory } from "@/lib/content";

const CATEGORY_ORDER: TechCategory[] = [
  "backend",
  "llm-agentic",
  "voice",
  "vector-db",
  "llmops",
  "ml",
  "cloud-devops",
];

// Popover geometry — kept as plain constants (not read off the DOM) since
// they're the same fixed size (w-56) regardless of which node opened it.
const POPOVER_WIDTH = 224; // 14rem
const VIEWPORT_MARGIN = 16;

interface PopoverPos {
  left: number;
  top: number;
  arrowLeft: number;
}

export function TechGraph() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pos, setPos] = useState<PopoverPos | null>(null);

  // Computes the popover's on-screen position from the node button's own
  // bounding rect, clamped so it can never bleed past the left/right
  // viewport edge. The old version just centered the popover under the
  // node via `left-1/2 -translate-x-1/2` — fine for nodes in the middle of
  // a row, but a node near the left edge (common on a narrow phone screen,
  // where each category row wraps to more lines) pushed roughly half the
  // popover's 224px width past x=0. That's not just visually clipped: an
  // un-clamped absolutely-positioned element bleeding past the edge widens
  // the page's actual scrollable area, and mobile browsers tend to
  // auto-scroll the viewport to keep newly-overflowing content in view —
  // which is what read as "other chips disappearing to the left" (the
  // whole page was shifting to accommodate the overflow, not anything
  // actually happening to those other chips). Fixed positioning computed
  // from the real trigger position, clamped to the viewport, has nowhere
  // left to bleed from in the first place.
  const activate = (id: string, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const nodeCenterX = rect.left + rect.width / 2;
    const left = Math.min(
      Math.max(nodeCenterX - POPOVER_WIDTH / 2, VIEWPORT_MARGIN),
      window.innerWidth - POPOVER_WIDTH - VIEWPORT_MARGIN,
    );
    const arrowLeft = Math.min(Math.max(nodeCenterX - left, 16), POPOVER_WIDTH - 16);
    setPos({ left, top: rect.bottom + 10, arrowLeft });
    setActiveId(id);
  };
  const deactivate = (id: string) => {
    setActiveId((cur) => (cur === id ? null : cur));
  };

  const activeNode = techNodes.find((n) => n.id === activeId);
  const relatedProjects = activeNode ? projects.filter((p) => activeNode.relatedProjectIds.includes(p.id)) : [];

  // The popover's position is computed once, at activation, from the
  // trigger node's getBoundingClientRect() — correct at that instant, but
  // position: fixed means it won't follow the node if the page scrolls
  // while it's open (unlike the old parent-relative absolute version,
  // which scrolled with the node automatically). Closing on scroll avoids
  // it being left floating over the wrong content.
  useEffect(() => {
    if (!activeId) return;
    const onScroll = () => setActiveId(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeId]);

  return (
    <div>
      <div className="flex flex-col gap-6">
        {CATEGORY_ORDER.map((category) => {
          const nodes = techNodes.filter((n) => n.category === category);
          if (nodes.length === 0) return null;
          return (
            <div key={category}>
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                {techCategoryLabels[category]}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {nodes.map((node) => {
                  const isActive = activeId === node.id;
                  const hasProjects = node.relatedProjectIds.length > 0;
                  // Spotlight (every other node dims while one is active).
                  // The floating popover itself is rendered once, fixed to
                  // the viewport, below — not per-node — since its position
                  // is now computed rather than parent-relative.
                  return (
                    <button
                      key={node.id}
                      type="button"
                      aria-pressed={isActive}
                      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => activate(node.id, e.currentTarget)}
                      onMouseLeave={() => deactivate(node.id)}
                      onFocus={(e: FocusEvent<HTMLButtonElement>) => activate(node.id, e.currentTarget)}
                      onBlur={() => deactivate(node.id)}
                      // No onClick here (there was one, toggling active on
                      // click) — a tap on a native <button> fires a focus
                      // event before the click does, so onFocus had already
                      // activated the node by the time the click handler's
                      // own isActive check ran, and it always saw "already
                      // active" and immediately deactivated again. On a real
                      // phone that meant a tap opened and instantly closed
                      // the popover in the same gesture. Tapping a button
                      // reliably focuses it on every mobile browser, so
                      // onFocus/onBlur alone already cover touch the same
                      // way onMouseEnter/onMouseLeave cover a mouse — no
                      // separate click handling needed.
                      className={`min-h-11 rounded-md border px-3.5 py-2 font-mono text-xs transition-all duration-200 ${
                        isActive
                          ? "scale-105 border-accent bg-accent/15 text-accent-soft shadow-[0_0_16px_-2px_rgba(62,207,142,0.55)]"
                          : activeId
                            ? "border-surface-border/40 text-muted/40"
                            : hasProjects
                              ? "border-surface-border text-foreground hover:border-accent/50"
                              : "border-surface-border text-muted hover:border-surface-border"
                      }`}
                    >
                      {node.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeNode && pos && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
            style={{ left: pos.left, top: pos.top }}
            // w-[224px] (a literal pixel value), not w-56 — w-56 resolves
            // through Tailwind's fluid --spacing scale (see globals.css)
            // and would render narrower than 224px below 640px, which
            // POPOVER_WIDTH above assumes is exact for its clamping math.
            className="fixed z-20 w-[224px] rounded-md border border-accent/40 bg-surface p-3 text-left shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]"
          >
            <div
              style={{ left: pos.arrowLeft }}
              className="absolute -top-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-accent/40 bg-surface"
            />
            {relatedProjects.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wide text-muted">Used in</span>
                {/* A small circuit-trace connector, not just a plain list —
                    this node really does connect to these projects (it's
                    the same relatedProjectIds data the "Used in" links
                    themselves use), so a trunk line branching out to each
                    one visualizes that relationship instead of just
                    asserting it in a label. The trunk draws downward
                    (scaleY, transform-origin: top) and each branch/chip
                    fades in with a slight rightward settle, staggered —
                    quick (given the whole popover only exists for a hover),
                    not a moment to slow down for. */}
                <div className="relative flex flex-col gap-1.5 pl-3">
                  <motion.span
                    aria-hidden="true"
                    className="absolute bottom-1 left-0 top-1 w-px origin-top bg-accent/50"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                  />
                  {relatedProjects.map((p, i) => (
                    <motion.a
                      key={p.id}
                      href={`#${p.id}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.18 }}
                      className="relative rounded-md bg-accent/15 px-2.5 py-1 font-mono text-xs text-accent-soft transition-colors duration-150 before:absolute before:-left-3 before:top-1/2 before:h-px before:w-3 before:bg-accent/50 hover:bg-accent/25"
                    >
                      {p.name}
                    </motion.a>
                  ))}
                </div>
              </div>
            ) : (
              <span className="font-mono text-xs text-muted">
                Part of Soban&apos;s day-to-day toolset, not tied to a single featured project.
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 font-mono text-xs text-muted/60">Hover or tap a technology to see where it&apos;s actually used.</p>
    </div>
  );
}
