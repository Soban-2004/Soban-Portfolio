"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

// Deliberately not a rounded-full colored pill — that's the single most
// recognizable "AI-generated SaaS" tell. Primary is a flat off-white fill
// with a sharp-ish corner; secondary is a hairline outline. Accent color is
// reserved for the motif and hover states, not button fills.
//
// Also magnetic: pulls a few px toward the cursor on hover, same restraint
// level as the hero's background parallax — disabled on touch and reduced
// motion, capped small enough that it reads as "responsive," not "flying."

// Scaled down for mobile (was the same min-h-11/px-5/text-sm at every
// size — a laptop-sized button sitting in an otherwise-shrunk mobile
// layout reads as mismatched, not "the same design, smaller"). sm: and up
// restore the exact original values, so laptop/desktop is untouched.
const base =
  "inline-flex min-h-9 items-center gap-1.5 rounded-md px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wide transition-colors duration-150 sm:min-h-11 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm";

const variants = {
  primary: "bg-foreground text-background hover:bg-accent-soft hover:text-background",
  secondary: "border border-surface-border text-foreground hover:border-foreground/40",
  accent: "bg-accent text-background hover:bg-accent-soft",
};

const MAX_PULL = 7;
const STRENGTH = 0.3;

export function Button({
  href,
  variant = "secondary",
  children,
  external,
  ariaLabel,
}: {
  href: string;
  variant?: keyof typeof variants;
  children: ReactNode;
  external?: boolean;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const onPointerMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    const clamp = (v: number) => Math.max(-MAX_PULL, Math.min(MAX_PULL, v * STRENGTH));
    setOffset({ x: clamp(px), y: clamp(py) });
  };

  const onPointerLeave = () => setOffset({ x: 0, y: 0 });

  const className = `${base} ${variants[variant]} transition-transform duration-200 ease-out`;
  const style = { transform: `translate(${offset.x}px, ${offset.y}px)` };

  if (!external && href.startsWith("/")) {
    return (
      <Link
        ref={ref}
        href={href}
        className={className}
        style={style}
        aria-label={ariaLabel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      style={style}
      aria-label={ariaLabel}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </a>
  );
}
