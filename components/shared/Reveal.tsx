"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

/**
 * Progressive-enhancement reveal: content remains visible in server HTML
 * and without JavaScript. Hydrated, off-screen elements animate on entry.
 */
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

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hiddenTransform = `translateY(${y}px)${scale ? ` scale(${scale})` : ""}`;
    el.style.opacity = "0";
    el.style.transform = hiddenTransform;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const animation = el.animate(
          [
            { opacity: 0, transform: hiddenTransform },
            { opacity: 1, transform: "none" },
          ],
          { duration: 500, delay, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
        );
        animation.addEventListener(
          "finish",
          () => {
            el.style.opacity = "";
            el.style.transform = "";
          },
          { once: true },
        );
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, scale, y]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
