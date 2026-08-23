"use client";

// A shared "readout resolving" count-up primitive — climbs smoothly most
// of the way to `target`, then a short flicker through a few random
// nearby values before locking onto the exact number, reading as a live
// system settling on a value rather than a steady climb the entire way.
// Used by StatBox for any of its values that are genuinely clean integers
// (StatBox itself decides that — see the regex gate there); this
// component just assumes `target` is meaningful and animatable.
//
// Was originally CountUpStat.tsx, home to a full standalone section-stat
// component (its own Reveal-style card, its own ImpactStat prop) that
// never actually got wired into any section — StatBox.tsx, the component
// every section's stat grid genuinely renders, just showed plain static
// strings the whole time. Trimmed down to the one piece that was actually
// worth keeping and reusing rather than left sitting there unused.

import { useRef, useEffect } from "react";
import { animate, useInView, useMotionValue, useTransform } from "motion/react";

export function AnimatedNumber({ target, suffix }: { target: number; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toLocaleString());
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  // A fixed-duration tween, not a spring — guaranteed to land exactly on
  // the target at a known time, rather than an overdamped spring that's
  // still ~1% off a second or more after entering view. Climbs smoothly
  // to ~92% of the target, then a short "resolve" flicker takes over —
  // a few quick jumps to random nearby values before locking onto the
  // exact number. jitter is floored at 1 so this still does something
  // visible on small single-digit stats, not just bigger ones.
  useEffect(() => {
    if (!inView) return;
    const APPROACH_FRACTION = 0.92;
    const RESOLVE_TICKS = 4;
    const RESOLVE_TICK_MS = 55;
    const approach = Math.round(target * APPROACH_FRACTION);
    const jitter = Math.max(1, Math.round(target * 0.08));
    let resolveInterval: number | undefined;

    const controls = animate(motionValue, approach, { duration: 1.15, ease: [0.16, 1, 0.3, 1] });
    controls.then(() => {
      let tick = 0;
      resolveInterval = window.setInterval(() => {
        tick += 1;
        if (tick > RESOLVE_TICKS) {
          window.clearInterval(resolveInterval);
          motionValue.set(target);
          return;
        }
        const randomNear = target + Math.round((Math.random() - 0.5) * 2 * jitter);
        motionValue.set(Math.min(Math.max(0, randomNear), Math.round(target * 1.15)));
      }, RESOLVE_TICK_MS);
    });

    return () => {
      controls.stop();
      window.clearInterval(resolveInterval);
    };
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
