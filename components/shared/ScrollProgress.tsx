"use client";

// Thin top-of-viewport progress bar — a real UX aid on the one long-form
// page (FitNova), not decoration. transform-only (scaleX), driven by
// Framer Motion's scroll progress so it never touches layout properties.

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-accent"
    />
  );
}
