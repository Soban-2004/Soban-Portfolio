"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";

// Types the eyebrow line ("// 04 — PROJECTS") in character by character the
// first time it scrolls into view, then leaves it alone — a quick "this
// section just booted" beat that ties every section transition back to
// the terminal motif, without touching the big display heading itself
// (that still just fades/rises via Reveal, unchanged). Genuinely once:
// the observer disconnects after firing, so scrolling back up and down
// past a section repeatedly doesn't replay it.
//
// Starts already showing the full text (not empty) — this is the safe
// default for both SSR (no window/matchMedia there) and a no-JS visitor,
// who'd otherwise never see the eyebrow at all. The effect only ever
// *clears* it back to "" right before typing it back out, and only once
// it's confirmed there's a real browser to run the animation in.
function TypewriterEyebrow({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let interval: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setOut("");
        let i = 0;
        interval = window.setInterval(() => {
          i += 1;
          setOut(text.slice(0, i));
          if (i >= text.length) window.clearInterval(interval);
        }, 16);
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
    // Runs once per mount against this one static string — re-running it
    // if `text` ever changed would restart mid-page, which never happens
    // here (each SectionHeading's index/label are fixed props).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <p ref={ref} className="font-mono text-xs text-accent">
      {out}
      {out.length < text.length && <span className="cert-log-cursor" aria-hidden="true">▌</span>}
    </p>
  );
}

// Eyebrow index line + giant display headline (Commit Log reference) —
// replaces the earlier smaller/quieter section header. `title` accepts
// JSX so callers can wrap part of it in <Accent> for the bicolor look.
// Wrapped in Reveal (small 12px rise + fade, triggered once this scrolls
// into view) — this single component backs every section title site-wide,
// so it's the one edit that gives every section heading the same
// scroll-in "activating" beat.
export function SectionHeading({
  index,
  label,
  title,
  note,
}: {
  index: string; // e.g. "01"
  label: string; // e.g. "METRICS"
  title: ReactNode;
  note?: string;
}) {
  return (
    <Reveal y={12}>
      <TypewriterEyebrow text={`// ${index} — ${label}`} />
      {/* break-words as a safety net: every caller's title is one
          unbroken "word" (PREFIX_SUFFIX, no space — the underscore isn't a
          break opportunity), which at this font/size overflowed the page
          on narrow phone screens with nowhere to wrap. Each caller now
          also gets a <wbr /> right before the <Accent> half, so the
          natural break (when one's needed at all) lands at that
          prefix/suffix color boundary instead of splitting a word
          mid-character. */}
      <h2 className="font-display-3d mt-3 break-words text-3xl uppercase leading-[1.2] text-foreground sm:mt-4 sm:text-5xl">
        {title}
      </h2>
      {note && <p className="mt-2 max-w-xl text-sm text-muted sm:mt-4 sm:text-base">{note}</p>}
    </Reveal>
  );
}
