"use client";

// One card at a time, arrow/dot-navigated, autoplaying on an interval —
// replaces the old scroll-jacked horizontal slide entirely (both its
// desktop "pin the viewport and drive translateX off scroll position"
// track and its separate plain-stacked mobile fallback). Two real
// problems with the old approach drove this: it only worked at all on
// desktop (mobile always got the stacked list, no equivalent experience),
// and scroll-jacking doesn't scale — every new project added more
// vertical scroll distance to the pinned driver regardless of whether
// anyone wants to sit through it. A carousel costs the same amount of
// scrolling whether there are 4 projects or 14; you just click through.

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ProjectCard, type ProjectVariant } from "@/components/projects/ProjectCard";
import { EASE_DECELERATE } from "@/lib/motion-tokens";
import type { Project } from "@/lib/content";

export interface ProjectSlide {
  project: Project;
  category: string;
  variant?: ProjectVariant;
  terminalLines?: string[];
}

const AUTOPLAY_MS = 6000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Case-study pages link back as "/#project=<id>" instead of the plain
// "/#work" anchor — landing on a bare #work put every visitor back at
// project 1 regardless of which case study they came from.
function getTargetIndexFromHash(slides: ProjectSlide[]): number | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#project=(.+)$/);
  if (!match) return null;
  const idx = slides.findIndex((s) => s.project.id === match[1]);
  return idx === -1 ? null : idx;
}

// Shared styling for every arrow button (there are two pairs of these —
// one flanking the card at lg+, one below it below lg — see the render
// below for why that's two separate elements rather than one repositioned
// via CSS). Pixel font ("<"/">" in Press Start 2P, the same face the
// section's own headline uses), not a lucide chevron icon — asked for
// specifically, and it also keeps the control visually tied to the site's
// own display type rather than a generic icon library glyph.
const ARROW_BUTTON =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-surface-border text-accent transition-colors duration-150 hover:border-accent hover:bg-accent/10 active:border-accent active:bg-accent/10 sm:h-11 sm:w-11";

function ArrowGlyph({ direction }: { direction: "prev" | "next" }) {
  return (
    <span className="font-display-3d text-sm sm:text-base" aria-hidden="true">
      {direction === "prev" ? "<" : ">"}
    </span>
  );
}

// Direction-aware slide, like a real carousel: pressing next brings the
// new card in from the right while the old one exits left, pressing prev
// is the mirror of that. `custom` (1 = forward/next, -1 = backward/prev)
// picks which side each state sits on; x is a percentage of the card's
// OWN width, not a fixed px offset, so it scales correctly at any card
// size from mobile to desktop. direction 0 is the very first mount only
// (no prior navigation to have a "from" side) — that one still gets the
// original small pop-in instead of a slide, since sliding in from an
// arbitrary edge on first paint wouldn't mean anything.
const slideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : `${direction * 100}%`,
    opacity: 0,
    scale: direction === 0 ? 0.9 : 1,
  }),
  center: { x: "0%", opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : `${direction * -100}%`,
    opacity: 0,
    scale: direction === 0 ? 0.94 : 1,
  }),
};

export function ProjectsSlider({ slides }: { slides: ProjectSlide[] }) {
  const n = slides.length;
  // Plain matchMedia in an effect, not motion/react's useReducedMotion()
  // hook — that hook returns null on its very first read and only
  // resolves a render or two later (documented already in
  // LoadingScreen.tsx, which hit the same issue). Here it's worse than
  // just "briefly wrong": this value feeds `initial={...}` on an
  // AnimatePresence motion.div, so a value that starts as `null` server-
  // side but resolves synchronously true on a real client with
  // prefers-reduced-motion set produces genuinely different server vs.
  // client markup on the very first paint — a real hydration mismatch,
  // reproduced by loading this page with reduced motion enabled. Starting
  // at `false` here matches the server's render unconditionally; the
  // effect corrects it immediately after mount if the preference is
  // actually set.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  // Same reason for reading this in an effect rather than at render time —
  // matchMedia isn't available during SSR, so this has to start at a fixed
  // default and correct itself after mount, not be computed inline.
  // pointer:coarse (not a viewport-width check) is the actual signal for
  // "swipe is the natural gesture here" — a touch laptop at desktop width
  // still benefits, and it avoids hijacking mouse-drag text selection on
  // trackpad/mouse devices, which a plain width breakpoint couldn't tell
  // apart from touch.
  const [supportsSwipe, setSupportsSwipe] = useState(false);
  useEffect(() => {
    setSupportsSwipe(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  // amount: 0.6, not "once" — autoplay should stop advancing once the
  // section has mostly scrolled out of view (no point cycling slides
  // nobody's looking at), and resume if the visitor scrolls back up to it.
  const inView = useInView(containerRef, { amount: 0.6 });

  const [index, setIndex] = useState(0);
  // Which side the current transition slides in from: 1 = the new card
  // enters from the right (moving forward), -1 = enters from the left
  // (moving backward), 0 = initial mount (no slide, see slideVariants).
  const [direction, setDirection] = useState(0);
  // Once a visitor manually navigates (arrow, dot, or a case-study
  // back-link landing on a specific project), autoplay stops for good —
  // yanking the view to the next slide out from under someone who just
  // deliberately chose one would be actively hostile, not a nice-to-have
  // to avoid.
  const [userInteracted, setUserInteracted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const goTo = (i: number, dir: 1 | -1) => {
    setUserInteracted(true);
    setDirection(dir);
    setIndex(((i % n) + n) % n);
  };

  // Resolved once, on mount — same bounded-retry pattern the old version
  // used (Next's own hash-apply lands ~30ms after a same-navigation click,
  // not synchronously, so a single read on mount reliably misses it).
  useEffect(() => {
    let attempts = 0;
    let timer: number | undefined;
    let done = false;
    const tryResolve = () => {
      if (done) return;
      const idx = getTargetIndexFromHash(slides);
      if (idx !== null) {
        done = true;
        // 0, not a real direction — this is "land directly on this
        // project" from a case-study back-link, not a forward/backward
        // step from whatever the default index was, so the plain fade/pop
        // (same as the very first mount) reads more honestly than an
        // arbitrary slide direction would.
        setDirection(0);
        setIndex(idx);
        setUserInteracted(true);
        history.replaceState(null, "", window.location.pathname + window.location.search);
        containerRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
        window.removeEventListener("hashchange", tryResolve);
        return;
      }
      if (attempts++ < 20) timer = window.setTimeout(tryResolve, 30);
    };
    window.addEventListener("hashchange", tryResolve);
    tryResolve();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", tryResolve);
    };
  }, [slides]);

  useEffect(() => {
    if (prefersReducedMotion || userInteracted || hovered || !inView || n <= 1) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % n);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, userInteracted, hovered, inView, n]);

  const slide = slides[index];

  // Swipe-to-navigate on touch: two independent ways to commit a swipe,
  // each checked on its own value's sign only (not combined into one
  // "power" score) so a slow deliberate drag and a quick light flick both
  // work without a fast end-of-drag direction reversal being able to
  // contradict which way the offset actually moved.
  const DRAG_OFFSET_THRESHOLD = 60; // px — a deliberate drag this far commits regardless of speed
  const FLICK_VELOCITY_THRESHOLD = 500; // px/s — a quick flick commits even with little travel
  const handleDragEnd = (_event: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -DRAG_OFFSET_THRESHOLD || info.velocity.x < -FLICK_VELOCITY_THRESHOLD) {
      goTo(index + 1, 1);
    } else if (info.offset.x > DRAG_OFFSET_THRESHOLD || info.velocity.x > FLICK_VELOCITY_THRESHOLD) {
      goTo(index - 1, -1);
    }
  };

  const dots = (
    <div className="flex items-center gap-2" role="group" aria-label="Select a project">
      {slides.map((s, i) => (
        <button
          key={s.project.id}
          type="button"
          onClick={() => goTo(i, i > index ? 1 : -1)}
          aria-label={`View ${s.project.name}`}
          aria-current={i === index}
          className={`h-2 w-2 rounded-full transition-[background-color,transform] duration-200 ${
            i === index ? "scale-125 bg-accent" : "bg-surface-border hover:bg-muted active:bg-muted"
          }`}
        />
      ))}
    </div>
  );

  return (
    // No width/padding constraint of its own — Projects.tsx's section
    // wrapper already provides mx-auto max-w-6xl px-6 (this used to need
    // its own, back when the section itself was deliberately unconstrained
    // for the old scroll-jacked slide's vw-based math).
    <div ref={containerRef} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-wide text-muted">
        <span>
          Project <span className="text-foreground">{pad(index + 1)}</span> / {pad(n)}
        </span>
        <span className="hidden text-foreground sm:inline">{slide.project.name}</span>
      </div>

      {/* lg+: arrows flank the card, vertically centered against it — the
          "keep arrows at the sides" layout. Below lg there's rarely enough
          spare width beside a near-full-bleed card for a side arrow not to
          feel cramped, so those stay hidden there and the below-card pair
          (further down) takes over instead — same goTo/prev/next calls,
          just two different button elements shown via a breakpoint rather
          than one button repositioned by CSS (repositioning a flex item
          across "beside the card" vs "below it" isn't something a single
          set of classes can express — those are two different grid
          contexts, not one element moving within the same one). */}
      <div className="relative mt-6 lg:flex lg:items-center lg:gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1, -1)}
          aria-label="Previous project"
          className={`${ARROW_BUTTON} hidden lg:flex`}
        >
          <ArrowGlyph direction="prev" />
        </button>

        {/* The slide's actual clipping viewport: p-4/-m-4 is bleed room,
            not visible spacing — padding pushes this box's own edges out
            a bit so a card's hover glow (box-shadow) doesn't get cut off
            flush against the clip boundary, and the matching negative
            margin cancels that padding back out for layout purposes, so
            neither the arrow gap above nor the section's overall width
            actually changes. Kept deliberately smaller than the section's
            own px-6 side padding (both derive from the same fluid
            --spacing token, so this stays proportionally safe at any
            viewport) — enough bleed isn't the point here, not overflowing
            past the edge of the page is. overflow-hidden is what turns the
            100%-offscreen enter/exit below into an actual "slides past the
            edge of a fixed frame" carousel motion instead of visibly
            overflowing the page (and avoiding a temporary horizontal
            scrollbar mid-transition). */}
        <div className="relative -m-4 min-w-0 overflow-hidden p-4 lg:flex-1">
          <AnimatePresence mode="popLayout" custom={direction}>
            {/* Direction-aware slide (see slideVariants) — pressing next
                brings the new card in from the right as the old one exits
                left, mirrored for prev, matching how a real carousel/slide
                deck transitions rather than the previous in-place scale
                pop. `custom={direction}` is what feeds slideVariants'
                per-state functions which side each transition uses.
                mode="popLayout" (not "wait"): the two cards need to be
                visibly on screen and sliding past each other at the same
                time — "wait" runs the exit fully to completion before the
                enter even starts, which read as a blank flash between them
                rather than a continuous slide. popLayout pulls the exiting
                card out of normal layout flow the instant it starts
                exiting, so the entering one doesn't have to wait for it
                (and the two never double-stack the container's height in
                the meantime, without this needing a fixed-height track). */}
            <motion.div
              key={slide.project.id}
              custom={direction}
              variants={slideVariants}
              initial={prefersReducedMotion ? false : "enter"}
              animate="center"
              exit={prefersReducedMotion ? undefined : "exit"}
              // A 300/30 spring here settled in under 100ms — far too quick
              // to actually read as a slide, just a snap. A slower tween on
              // the site's own EASE_DECELERATE curve (the same one every
              // scroll reveal uses) gives the motion enough duration to
              // actually be seen traveling across the frame; opacity/scale
              // stay a bit quicker so the card doesn't look transparent for
              // the entire trip.
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      x: { duration: 0.45, ease: EASE_DECELERATE },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                    }
              }
              // sm:w-[70%]/mx-auto: the other half of shrinking the desktop
              // card to 70% (see ProjectCard.tsx's own zoom:0.7 comment for
              // why that's on the card and this is on its unzoomed parent
              // instead of both together) — this element was stretching
              // full-width via the wrapper's flex-1; capping it at 70% of
              // that and re-centering is what actually shrinks the
              // carousel's footprint instead of just the content painted
              // inside a same-size box. Left off below sm — mobile is
              // untouched.
              className="relative touch-pan-y sm:mx-auto sm:w-[70%]"
              drag={supportsSwipe && n > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
            >
              <ProjectCard
                project={slide.project}
                category={slide.category}
                variant={slide.variant}
                terminalLines={slide.terminalLines}
                skipReveal
              />
              {/* The "glitch" flourish on top of the smooth pop above —
                  a green CRT-scanline pattern that flickers in on arrival
                  and burns off in under half a second (mix-blend-mode
                  "screen" so it lightens toward green rather than sitting
                  as a flat tinted rectangle over the card). Distinct from
                  the scale/opacity motion on the card itself: this is a
                  short, jittery multi-step flicker (four opacity keyframes
                  in ~0.4s), not an eased transition, which is what actually
                  reads as "glitch" rather than just "another fade". Skipped
                  entirely under reduced motion, same rule as every other
                  effect on this site. */}
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 rounded-xl"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, rgba(62,207,142,0.55) 0px, rgba(62,207,142,0.55) 2px, transparent 2px, transparent 5px)",
                    mixBlendMode: "screen",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.7, 0.05, 0.45, 0] }}
                  transition={{ duration: 0.4, times: [0, 0.15, 0.4, 0.6, 1], ease: "linear" }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1, 1)}
          aria-label="Next project"
          className={`${ARROW_BUTTON} hidden lg:flex`}
        >
          <ArrowGlyph direction="next" />
        </button>
      </div>

      {/* Below lg: prev/dots/next all in one row under the card (the
          layout every breakpoint used before this round). At lg+ the
          arrows above take over, so only the dots repeat here — one row,
          not duplicated. */}
      <div className="mt-5 flex items-center justify-center gap-4 sm:mt-8 sm:gap-6 lg:hidden">
        <button type="button" onClick={() => goTo(index - 1, -1)} aria-label="Previous project" className={ARROW_BUTTON}>
          <ArrowGlyph direction="prev" />
        </button>
        {dots}
        <button type="button" onClick={() => goTo(index + 1, 1)} aria-label="Next project" className={ARROW_BUTTON}>
          <ArrowGlyph direction="next" />
        </button>
      </div>
      <div className="mt-6 hidden justify-center lg:flex">{dots}</div>
    </div>
  );
}
