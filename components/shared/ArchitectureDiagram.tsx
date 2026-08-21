"use client";

// Reusable architecture diagram (IMPLEMENTATION.md §14). Driven by a plain
// data array — nodes render as a vertical pipeline (reads naturally at any
// width, so mobile needs no separate layout). On scroll-into-view, each
// connecting segment draws once, in sequence, simulating the data flow
// described. Nodes are real buttons — focusable, with a tooltip on
// hover/tap/focus, grounded in the real project detail passed in.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useState } from "react";

export interface DiagramNode {
  id: string;
  label: string;
  detail: string;
}

export function ArchitectureDiagram({ nodes }: { nodes: DiagramNode[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const shouldAnimate = inView && !prefersReducedMotion;

  return (
    <div ref={containerRef} className="flex flex-col">
      {nodes.map((node, i) => {
        const isActive = activeId === node.id;
        return (
          <div key={node.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <motion.button
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => setActiveId(node.id)}
                onMouseLeave={() => setActiveId((cur) => (cur === node.id ? null : cur))}
                onFocus={() => setActiveId(node.id)}
                onBlur={() => setActiveId((cur) => (cur === node.id ? null : cur))}
                onClick={() => setActiveId((cur) => (cur === node.id ? null : node.id))}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: shouldAnimate ? i * 0.15 : 0, ease: [0.16, 1, 0.3, 1] }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs transition-colors duration-150 ${
                  isActive ? "border-accent bg-accent/20 text-accent-soft" : "border-surface-border bg-surface text-muted"
                }`}
              >
                {i + 1}
              </motion.button>
              {i < nodes.length - 1 && (
                <div className="my-1 h-full w-px flex-1 bg-surface-border" style={{ minHeight: 32 }}>
                  <motion.div
                    className="w-px bg-accent"
                    style={{ transformOrigin: "top" }}
                    initial={{ scaleY: 0, height: "100%" }}
                    animate={inView ? { scaleY: 1 } : {}}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.5,
                      delay: shouldAnimate ? i * 0.15 + 0.15 : 0,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              )}
            </div>

            <div className="pb-8">
              <button
                type="button"
                onMouseEnter={() => setActiveId(node.id)}
                onMouseLeave={() => setActiveId((cur) => (cur === node.id ? null : cur))}
                onFocus={() => setActiveId(node.id)}
                onClick={() => setActiveId((cur) => (cur === node.id ? null : node.id))}
                className="min-h-11 text-left"
              >
                <p className="font-mono text-sm font-medium text-foreground">{node.label}</p>
              </button>
              <p className={`mt-1 max-w-md text-sm text-muted transition-opacity duration-150`}>
                {node.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
