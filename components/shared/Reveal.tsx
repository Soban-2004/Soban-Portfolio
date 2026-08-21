"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

// Generic scroll-triggered reveal — translateY + opacity by default (cards,
// headings, stats), or translateY + scale when `scale` is given (images/
// previews). IntersectionObserver-driven, fires once per element then
// disconnects (a one-time "activating as you scroll to it" beat, not a
// repeating show/hide-on-scroll-back gimmick). Skipped entirely under
// prefers-reduced-motion — renders at rest immediately, no animation, same
// rule as every other motion effect on this site. `delay` (ms) staggers a
// group of siblings without needing a separate IntersectionObserver
// instance per item.
//
// This is deliberately a *different* mechanism from Hero's own left-to-right
// fade-in: Hero is above the fold and syncs to the loading screen's unlock
// event, everything using Reveal is below the fold and triggers off actual
// scroll position — mixing the two would either fire Hero's reveal on
// mount (pointless, nothing to scroll to) or make every card wait on a
// boot event that's long over by the time you scroll to it.
export function Reveal<T extends ElementType = "div">({
  children,
  as,
  delay = 0,
  y = 20,
  scale,
  className = "",
  ...rest
}: {
  children: ReactNode;
  as?: T;
  delay?: number;
  y?: number;
  scale?: number;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "className">) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSkip(true);
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform = `translateY(${y}px)${scale ? ` scale(${scale})` : ""}`;

  return (
    <Tag
      ref={ref}
      className={`${skip ? "" : "transition-[opacity,transform] duration-500 ease-out"} ${visible ? "opacity-100" : "opacity-0"} ${className}`}
      // transform is only ever set inline while hidden. Once visible, it's
      // left unset entirely (not forced to "none") — an inline style always
      // beats a class for the same property, and several of these cards
      // have their own hover:-translate-... utilities for an unrelated
      // hover-lift effect. Leaving an inline `transform: none` behind after
      // the reveal finishes would permanently block those hover classes
      // from ever applying. Un-setting it lets CSS (including :hover) own
      // the property again once there's nothing left to reveal.
      style={
        skip
          ? undefined
          : {
              transform: visible ? undefined : hiddenTransform,
              transitionDelay: visible ? `${delay}ms` : "0ms",
            }
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
