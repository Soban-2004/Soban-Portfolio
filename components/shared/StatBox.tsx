"use client";

import { useReducedMotion } from "motion/react";
import { Reveal } from "@/components/shared/Reveal";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

// A bordered stat readout — a small mono label above a big bold number.
// The `filled` variant is the "one card breaks the rhythm" device (Commit
// Log reference): a solid accent-filled box among plain bordered ones.
// Same lift/shadow/border-brighten hover treatment as the project and
// paper cards elsewhere on the site, scaled down for a smaller box, so
// SYS_STATS reads as interactive/alive rather than static text in boxes.
// active: mirrors every hover: utility — :hover never fires on a touch
// tap (there's no persistent pointer to be "over" the element), so
// without this the whole lift/glow treatment was invisible on mobile.
// :active does fire on touchstart, so tapping (and holding) a card now
// gets the same feedback a mouse hover gives on desktop.
//
// value is a caller-formatted string, not a raw number — most callers
// pass things like "20+", "~95%", "4.5s → 1s" that don't have a
// meaningful "count up to" animation. Only a genuinely bare integer
// string ("3", "20") gets the AnimatedNumber count-up/resolve treatment;
// anything else (checked via a plain digits-only regex, not a parseFloat
// that'd happily also accept "20+" or "2,000") just renders as-is, same
// safety net AnimatedNumber's own original home (CountUpStat) always had.
export function StatBox({
  value,
  label,
  filled = false,
  accent = "text-accent",
  delay = 0,
}: {
  value: string;
  label: string;
  filled?: boolean;
  accent?: string;
  // Lets a parent row of StatBoxes stagger their scroll-in reveal (each a
  // little after the last) instead of all three popping in at once.
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const numeric = /^\d+$/.test(value) ? Number(value) : null;
  const canAnimate = numeric !== null && !prefersReducedMotion;

  return (
    <Reveal
      y={16}
      delay={delay}
      className={`rounded-md border p-2.5 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 active:-translate-y-1 sm:p-4 ${
        filled
          ? "border-accent bg-accent text-background hover:shadow-[0_10px_28px_-10px_rgba(62,207,142,0.55)] active:shadow-[0_10px_28px_-10px_rgba(62,207,142,0.55)]"
          : "border-surface-border hover:border-accent/60 hover:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)] active:border-accent/60 active:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)]"
      }`}
    >
      <p className={`font-mono text-2xl font-black sm:text-3xl ${filled ? "text-background" : accent}`}>
        {canAnimate ? <AnimatedNumber target={numeric} /> : value}
      </p>
      <p className={`mt-1 font-mono text-xs uppercase tracking-wide ${filled ? "text-background/70" : "text-muted"}`}>
        {label}
      </p>
    </Reveal>
  );
}
