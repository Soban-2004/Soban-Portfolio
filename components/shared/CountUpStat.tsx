"use client";

// Metric count-up on scroll (IMPLEMENTATION.md §4.5). Fires once when the
// stat scrolls into view. Under reduced motion, or when the value isn't a
// clean number (e.g. "4.5s → 1s"), it just renders the final string — never
// blocks readability on an animation completing.

import { useRef, useEffect } from "react";
import { animate, motion, useInView, useReducedMotion, useMotionValue, useTransform } from "motion/react";
import type { ImpactStat } from "@/lib/content";

function AnimatedNumber({ target, suffix }: { target: number; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toLocaleString());
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  // A fixed-duration tween, not a spring — guaranteed to land exactly on
  // the target at a known time, rather than an overdamped spring that's
  // still ~1% off a second or more after entering view.
  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, target, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [inView, motionValue, target]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v + (suffix ?? "");
    });
    return unsub;
  }, [rounded, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

export function CountUpStat({ stat }: { stat: ImpactStat }) {
  const prefersReducedMotion = useReducedMotion();
  const canAnimate = typeof stat.numericValue === "number" && !prefersReducedMotion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-1"
    >
      <div className="font-mono text-3xl font-medium text-foreground sm:text-4xl">
        {canAnimate ? (
          <AnimatedNumber target={stat.numericValue!} suffix={stat.suffix} />
        ) : (
          <span>{stat.value}</span>
        )}
      </div>
      <div className="text-sm text-muted">{stat.label}</div>
    </motion.div>
  );
}
