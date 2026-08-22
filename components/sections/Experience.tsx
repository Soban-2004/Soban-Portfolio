"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accent } from "@/components/shared/Accent";
import { StatBox } from "@/components/shared/StatBox";
import { ExperienceCard, type ExperienceCardData } from "@/components/experience/ExperienceCard";
import { experience, earlierExperience } from "@/lib/content";

const EXPERIENCE_TECH = ["Python", "LangChain", "LangGraph", "RAG", "Oracle Fusion", "SQL"];

const cards: ExperienceCardData[] = [
  {
    key: "drivestream",
    variant: "primary",
    period: experience.period,
    title: experience.title,
    company: experience.company,
    location: experience.location,
    bullets: experience.bullets,
    tags: EXPERIENCE_TECH,
    badge: "COMPLETED",
  },
  ...earlierExperience.map(
    (role): ExperienceCardData => ({
      key: role.company,
      variant: "earlier",
      period: role.period,
      title: role.title,
      company: role.company,
      bullets: role.bullets,
      tags: role.skills,
      badge: "EARLIER",
    }),
  ),
];

function IntroColumn() {
  return (
    <div>
      <p className="text-muted">
        {cards.length} roles. Real enterprise systems shipped into a production Oracle Fusion environment, plus an
        earlier ML internship.
      </p>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatBox value={String(cards.length)} label="Companies" />
        <StatBox value="6" label="Months (latest)" />
        <StatBox value="20+" label="Modules" />
      </div>
      <p className="mt-6 hidden font-mono text-[11px] uppercase tracking-wide text-muted/60 lg:block">
        Keep scrolling — history logs upward &darr;
      </p>
    </div>
  );
}

// Each card gets its own SLOT_VH-tall slot in the track rather than a full
// viewport — a full 100vh slot around content that's maybe half that tall
// left a huge dead gap of empty space visible between cards mid-transition
// (each card centered in its own mostly-empty viewport). A shorter slot,
// shared by both the track's card slots and the intro column's own box (so
// they center to the same band), keeps the cards close together as they
// pass through instead of floating past each other across a wide gap.
//
// The sticky pin still spans a full 100vh (H) for generous nav clearance
// and framing, decoupled from SLOT_VH — the two don't need to match. What
// does need to match: the driver's total height (H + (n-1)*SLOT_VH) against
// the track's total translate range ((n-1)*SLOT_VH) — both derived from the
// same constants below, so the track finishes its last card at exactly the
// scroll position the sticky element releases at.
const SLOT_VH = 50;

function HistoryHeading() {
  return (
    <SectionHeading
      index="03"
      label="HISTORY"
      title={
        <>
          LOG<wbr />
          <Accent>_HISTORY</Accent>
        </>
      }
    />
  );
}

// The heading used to sit in normal document flow above the driver div —
// meaning it scrolled away before the pin even engaged, leaving a big gap
// between it and the (vertically-centered-in-the-viewport) card once
// pinned. Now it's inside the sticky element itself, so it pins right along
// with the left column for the whole scroll-lock, close above the cards —
// not scrolled past and gapped from them.
function PinnedExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Springed rather than following raw scroll 1:1 — same fix as the
  // Projects horizontal slide: a direct useTransform output tracks the
  // wheel/trackpad's own choppiness exactly, where a spring settles toward
  // that target smoothly, reading as one card easing into the next instead
  // of a rigid scrollbar-linked jump.
  const trackYRaw = useTransform(scrollYProgress, [0, 1], [0, -(cards.length - 1) * SLOT_VH]);
  const trackYSpring = useSpring(trackYRaw, { stiffness: 110, damping: 22, mass: 0.4 });
  const trackY = useMotionTemplate`${trackYSpring}vh`;
  const driverHeight = `calc(100vh + ${(cards.length - 1) * SLOT_VH}vh)`;

  return (
    <div ref={containerRef} style={{ height: driverHeight }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-6">
        <HistoryHeading />

        <div className="flex items-center gap-8">
          <div className="flex w-[280px] shrink-0 items-center" style={{ height: `${SLOT_VH}vh` }}>
            <IntroColumn />
          </div>

          <div className="relative flex-1 overflow-hidden" style={{ height: `${SLOT_VH}vh` }}>
            <motion.div style={{ y: trackY }}>
              {cards.map((card) => (
                <div key={card.key} className="flex items-center" style={{ height: `${SLOT_VH}vh` }}>
                  <ExperienceCard data={card} className="w-full" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedExperience() {
  return (
    <>
      <HistoryHeading />
      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-8 lg:grid-cols-[280px_1fr]">
        {/* Cards ordered first on mobile (order-1) so the heading is
            immediately followed by a full experience card, not by the
            intro paragraph + stat row — those move below instead. lg+
            resets both back to source order (intro column on the left,
            cards on the right), matching the original two-column layout. */}
        <div className="order-1 flex flex-col gap-4 lg:order-2">
          {cards.map((card) => (
            <ExperienceCard key={card.key} data={card} />
          ))}
        </div>
        <div className="order-2 lg:order-1">
          <IntroColumn />
        </div>
      </div>
    </>
  );
}

export function Experience() {
  const prefersReducedMotion = useReducedMotion();
  // Scroll-jacking only makes sense at the two-column (lg+) layout — below
  // that, "pin the left column" has nothing meaningful to pin next to, and
  // it's also disabled outright under prefers-reduced-motion, per the
  // reduced-motion pattern used throughout the rest of the site.
  const [pinEnabled, setPinEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPinEnabled(mq.matches && !prefersReducedMotion);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-12 sm:py-24">
      {pinEnabled ? <PinnedExperience /> : <StackedExperience />}
    </section>
  );
}
