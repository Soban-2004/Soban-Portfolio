"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ProjectCard, type ProjectVariant } from "@/components/projects/ProjectCard";
import type { Project } from "@/lib/content";

export interface ProjectSlide {
  project: Project;
  category: string;
  variant?: ProjectVariant;
  terminalLines?: string[];
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Case-study pages link back as "/#project=<id>" instead of the plain
// "/#work" anchor — landing on a bare #work put every visitor back at
// project 1 regardless of which case study they came from, since this
// section is one tall scroll-jacked driver: every slide's DOM element sits
// at roughly the same document height (they're arranged horizontally by a
// CSS transform, not vertically), so even a native id-based anchor to a
// specific project's element wouldn't land at the right scroll position —
// only an explicit scroll computed from that slide's index actually does.
// A hash that doesn't match any real element id (no "#work" or "#fitnova")
// avoids the browser's own scroll-into-view firing and fighting this.
function getTargetIndexFromHash(slides: ProjectSlide[]): number | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#project=(.+)$/);
  if (!match) return null;
  const idx = slides.findIndex((s) => s.project.id === match[1]);
  return idx === -1 ? null : idx;
}

// Scroll-jacked horizontal slide: vertical scroll drives horizontal motion
// through the project cards, one 100vw slide per card, vertical page
// position held until the last one. Same driver-height / translate-range
// formula as the Experience section's vertical pin (see that component for
// the full reasoning) — just built on the x-axis with vw instead of the
// y-axis with vh, so the track finishes its last card at exactly the
// scroll position the sticky element naturally releases at.
function PinnedProjectsSlide({ slides, targetIndex }: { slides: ProjectSlide[]; targetIndex: number | null }) {
  const n = slides.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Springed rather than following raw scroll 1:1 — a direct useTransform
  // output tracks the wheel/trackpad's own choppiness exactly (every small
  // stutter in scroll input becomes a stutter in the slide), where a spring
  // settles toward that target smoothly, reading as inertia instead of a
  // rigid scrollbar-linked jump. useMotionTemplate composes the springed
  // number back into a "-123.4vw" string for the x transform.
  const trackXRaw = useTransform(scrollYProgress, [0, 1], [0, -(n - 1) * 100]);
  const trackXSpring = useSpring(trackXRaw, { stiffness: 110, damping: 22, mass: 0.4 });
  const trackX = useMotionTemplate`${trackXSpring}vw`;
  const barScale = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [index, setIndex] = useState(() => targetIndex ?? 0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setIndex(Math.min(n - 1, Math.max(0, Math.round(v * (n - 1)))));
    });
    return unsub;
  }, [scrollYProgress, n]);

  // Jump straight to the project a case-study page linked back from,
  // instead of always landing on project 1. targetIndex resolves
  // asynchronously in the parent (it has to wait out Next's own hash-apply
  // delay — see ProjectsSlider), which is very likely AFTER this component
  // has already mounted with targetIndex still null — so this must react
  // to targetIndex changing, not just run once at mount, or the one
  // moment it actually becomes available would be missed entirely.
  useEffect(() => {
    const driver = containerRef.current;
    if (targetIndex === null || !driver) return;
    const rect = driver.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const dwell = rect.height - window.innerHeight;
    // "instant", not "auto": html has scroll-behavior: smooth globally
    // (the site's normal anchor-nav glide), and per spec `behavior: "auto"`
    // on scrollTo means "defer to the element's own CSS scroll-behavior" —
    // it does NOT mean immediate. That silently turned this into a slow
    // multi-second smooth-scroll animation across thousands of px, so by
    // the time anything read the resulting position it hadn't arrived yet
    // and the visible project index was still mid-scroll, off by one or
    // more. "instant" is the one value that actually forces an immediate
    // jump regardless of the page's CSS.
    window.scrollTo({ top: top + (dwell * targetIndex) / (n - 1), behavior: "instant" });
    setIndex(targetIndex);
  }, [targetIndex, n]);

  return (
    <div ref={containerRef} style={{ height: `${n * 100}vh` }} className="relative">
      {/* pt-24: the indicator row sits at the sticky element's own top edge
          (top-0), which is exactly where the fixed nav bar (z-40, solid
          background) covers — without this clearance the indicator renders
          but is fully hidden underneath it. */}
      <div className="sticky top-0 flex h-screen flex-col gap-6 overflow-hidden pt-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-wide text-muted">
            <span>
              Project <span className="text-foreground">{pad(index + 1)}</span> / {pad(n)}
            </span>
            <span className="hidden text-foreground sm:inline">{slides[index].project.name}</span>
          </div>
          <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-surface-border">
            <motion.div className="h-full origin-left bg-accent" style={{ scaleX: barScale }} />
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <motion.div className="flex h-full" style={{ x: trackX }}>
            {slides.map((slide, i) => (
              <div key={slide.project.id} className="flex h-full w-screen shrink-0 items-center px-6">
                {/* The slide centered in the viewport (the one actually
                    being read) scales up and sits at full brightness; its
                    neighbors — visible mid-transition at the slide's edges
                    — sit slightly smaller and dimmed, so "arriving at
                    center" itself reads as the card's own hover-like
                    emphasis, not just a straight cut between equal cards. */}
                <motion.div
                  className="mx-auto w-full max-w-6xl"
                  animate={{ scale: i === index ? 1 : 0.94, opacity: i === index ? 1 : 0.55 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard
                    project={slide.project}
                    category={slide.category}
                    variant={slide.variant}
                    terminalLines={slide.terminalLines}
                    fixedHeight
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StackedProjects({ slides, targetIndex }: { slides: ProjectSlide[]; targetIndex: number | null }) {
  // Plain document flow here, so a real element id exists per card — a
  // normal scrollIntoView is enough (no scroll-position math needed like
  // the pinned version above). "instant" for the same reason as the pinned
  // version's scrollTo: the default "auto" behavior defers to the page's
  // global scroll-behavior: smooth, which isn't what a landing correction
  // should do.
  useEffect(() => {
    if (targetIndex === null) return;
    document.getElementById(slides[targetIndex].project.id)?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [targetIndex, slides]);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="flex flex-col gap-4">
        {slides.map((slide) => (
          <ProjectCard
            key={slide.project.id}
            project={slide.project}
            category={slide.category}
            variant={slide.variant}
            terminalLines={slide.terminalLines}
          />
        ))}
      </div>
    </div>
  );
}

export function ProjectsSlider({ slides }: { slides: ProjectSlide[] }) {
  const prefersReducedMotion = useReducedMotion();
  // Same rule as the Experience pin: scroll-jacking only below lg has no
  // real "vertical page held while horizontal slides" benefit on a single
  // narrow column, and reduced-motion users get the plain stacked list.
  const [pinEnabled, setPinEnabled] = useState(false);

  // Resolved exactly once, here in the stable parent — this component
  // doesn't unmount when pinEnabled flips, unlike its two children. Reading
  // (and clearing) the hash independently in each child looked fine in
  // isolation but raced: pinEnabled starts false, so StackedProjects always
  // mounts first even on desktop, however briefly, before the matchMedia
  // effect below flips it — its cleanup was clearing the hash before
  // PinnedProjectsSlide ever got a chance to see it.
  //
  // Reading it synchronously at mount (a lazy useState initializer) turned
  // out to race Next's own router too: measured window.location.hash as
  // still "" immediately after a same-navigation click, only becoming
  // "#project=..." about 30ms later once Next actually applies it — so
  // this component's very first render always saw nothing. A short
  // bounded retry (not a single synchronous read) accounts for that gap.
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  useEffect(() => {
    let attempts = 0;
    let timer: number | undefined;
    let done = false;
    const tryResolve = () => {
      if (done) return;
      const idx = getTargetIndexFromHash(slides);
      if (idx !== null) {
        done = true;
        setTargetIndex(idx);
        history.replaceState(null, "", window.location.pathname + window.location.search);
        window.removeEventListener("hashchange", tryResolve);
        return;
      }
      if (attempts++ < 20) timer = window.setTimeout(tryResolve, 30);
    };
    // Polling covers the common case; hashchange is a backstop for it —
    // background/unfocused tabs (easy to end up with mid-testing, not
    // realistic single-tab usage, but worth being correct under anyway)
    // can have setTimeout intervals throttled well past 30ms, where a
    // genuine DOM event fired by the browser's own navigation isn't.
    window.addEventListener("hashchange", tryResolve);
    tryResolve();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", tryResolve);
    };
  }, [slides]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPinEnabled(mq.matches && !prefersReducedMotion);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  return pinEnabled ? (
    <PinnedProjectsSlide slides={slides} targetIndex={targetIndex} />
  ) : (
    <StackedProjects slides={slides} targetIndex={targetIndex} />
  );
}
