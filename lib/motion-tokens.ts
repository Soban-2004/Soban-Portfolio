// lib/motion-tokens.ts
//
// The single shared set of easing/duration constants (IMPLEMENTATION.md §5.4).
// No component defines its own one-off easing curve — import from here.

export const EASE_DECELERATE = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  micro: 0.18, // hover, tag highlight — 150-200ms
  reveal: 0.5, // section reveals — 400-600ms
  diagramDraw: 1.2, // architecture diagram path draw — 1000-1400ms, once
} as const;

// Standard "reveal on scroll into view" variants for Framer Motion.
// Consumers pass `viewport={{ once: true, amount: 0.3 }}` alongside these.
export const revealUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE_DECELERATE },
  },
};

export const revealFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.reveal, ease: EASE_DECELERATE },
  },
};

// Framer Motion `viewport` default used across all scroll-triggered reveals —
// fires once, never re-triggers on scroll-back (IMPLEMENTATION.md §21).
export const viewportOnce = { once: true, amount: 0.3 } as const;
