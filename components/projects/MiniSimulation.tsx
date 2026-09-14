"use client";

// A real, if simple, architecture diagram for the AI Architect card —
// stands in for the real thing (the brief's own suggested hero visual is
// "the canvas view mid-simulation: particles animating along edges, a
// component flagged overloaded in red") until a real screenshot/GIF
// exists. Deliberately not a screenshot substitute pretending to be one —
// an abstracted, generic 3-tier layout (client → API → data stores), not
// the real app's actual UI — same spirit as the terminal-log slot other
// cards use: a stylized representation of what the project does.
//
// Sits directly on the card's own green flagship background now (no
// enclosing dark box), so every color here is picked for contrast against
// --accent specifically, not the dark --surface a wrapping panel used to
// provide — dark lines/hub/particles instead of the light ones that would
// have made sense inside a dark box. The 3 data-store nodes keep their
// own type-color borders (info/amber/violet, matching the site's own
// palette) since those already read fine as dark boxes on green.
//
// The red "overload" flash on a store is driven by the exact same timing
// constants as that store's own particle (PARTICLE_*, below) — computed
// so the flash fires right as the particle visually arrives, not on an
// independent timer that just happens to be running nearby. That's a
// deliberate fix: an earlier pass used its own unrelated cycle for the
// flash, which read as random relative to the particle motion.

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const CLIENT = { x: 170, y: 20 };
const API = { x: 170, y: 75 };
// colorHex matches this site's own --success/--amber/--violet tokens —
// literal, not var(), since it feeds an animated `stroke` (see the note
// on SURFACE_HEX/CRITICAL_HEX below for why).
const STORES = [
  { id: "database", x: 60, y: 155, label: "DATABASE", colorHex: "#4db8d9" },
  { id: "cache", x: 170, y: 155, label: "CACHE", colorHex: "#e0a63e" },
  { id: "queue", x: 280, y: 155, label: "QUEUE", colorHex: "#a78bfa" },
];

// Literal color values, not var(--token) references, for anything that
// goes through Framer's animate() — it needs a real, parseable color
// (hex/rgba) to tween between states; handed a CSS custom-property string
// instead it can't interpolate it correctly (confirmed empirically on an
// earlier pass at this component).
const SURFACE_HEX = "#14170f"; // matches --surface — each store's own resting fill
const CRITICAL_HEX = "#ff3b6e"; // matches --critical — the overload flash only
const DARK_LINE = "rgba(11, 13, 10, 0.32)"; // matches --background at low opacity — for lines on the green card, standing in for the light on-dark line color this used inside the old dark box
const DARK_PARTICLE = "rgba(11, 13, 10, 0.85)"; // a visible dark dot traveling across green — an accent-green particle would nearly vanish against the card's own green fill
const DARK_TEXT_SOFT = "rgba(11, 13, 10, 0.55)";

// One shared timing spec drives both a store's particle AND its overload
// flash, so they can't drift apart the way two independent schedules did
// before. times=[0, ARRIVE_FRACTION, 1] on the particle's own transition
// means it visually reaches its target at ARRIVE_FRACTION * DURATION_S
// into each of its cycles — the flash below fires at exactly that moment.
const DURATION_S = 1.5;
const ARRIVE_FRACTION = 0.85;
const REPEAT_DELAY_S = 0.4;
const CYCLE_S = DURATION_S + REPEAT_DELAY_S;
const BASE_DELAY_S = 0.35;
const STAGGER_S = 0.35;
const FLASH_MS = 420; // how long a store stays red once its particle lands

function storeDelayS(i: number) {
  return BASE_DELAY_S + i * STAGGER_S;
}
function storeArriveS(i: number) {
  return storeDelayS(i) + DURATION_S * ARRIVE_FRACTION;
}

function Particle({ from, to, delay }: { from: { x: number; y: number }; to: { x: number; y: number }; delay: number }) {
  return (
    <motion.circle
      r={2.75}
      fill={DARK_PARTICLE}
      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
      animate={{ cx: [from.x, to.x, to.x], cy: [from.y, to.y, to.y], opacity: [0, 1, 0] }}
      transition={{ duration: DURATION_S, times: [0, ARRIVE_FRACTION, 1], repeat: Infinity, repeatDelay: REPEAT_DELAY_S, delay, ease: "easeInOut" }}
    />
  );
}

export function MiniSimulation() {
  const prefersReducedMotion = useReducedMotion();
  // One flag per store — a plain timer per store synced to that store's
  // own particle-arrival time (see storeArriveS above), not a single
  // rotating index: two stores' arrivals are close enough together
  // (0.35s apart) that their flashes can legitimately overlap, which a
  // single "only one at a time" value couldn't represent.
  const [hitFlags, setHitFlags] = useState<boolean[]>(() => STORES.map(() => false));

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timeouts: number[] = [];
    const intervals: number[] = [];

    STORES.forEach((_, i) => {
      const setHit = (value: boolean) => setHitFlags((flags) => flags.map((f, idx) => (idx === i ? value : f)));
      const flash = () => {
        setHit(true);
        timeouts.push(window.setTimeout(() => setHit(false), FLASH_MS));
      };
      timeouts.push(
        window.setTimeout(() => {
          flash();
          intervals.push(window.setInterval(flash, CYCLE_S * 1000));
        }, storeArriveS(i) * 1000),
      );
    });

    return () => {
      timeouts.forEach(window.clearTimeout);
      intervals.forEach(window.clearInterval);
    };
  }, [prefersReducedMotion]);

  return (
    <svg
      viewBox="0 0 340 200"
      className="h-full w-full"
      role="img"
      aria-label="Architecture diagram: a client connected to an API service, fanning out to a database, cache, and queue, with one data store flashing red the moment a request reaches it"
    >
      <line x1={CLIENT.x} y1={CLIENT.y + 10} x2={API.x} y2={API.y - 16} stroke={DARK_LINE} strokeWidth={1.5} />
      {STORES.map((s) => (
        <line key={`line-${s.id}`} x1={API.x} y1={API.y + 16} x2={s.x} y2={s.y - 14} stroke={DARK_LINE} strokeWidth={1.5} />
      ))}

      {!prefersReducedMotion && (
        <>
          <Particle from={{ x: CLIENT.x, y: CLIENT.y + 10 }} to={{ x: API.x, y: API.y - 16 }} delay={0} />
          {STORES.map((s, i) => (
            <Particle key={`particle-${s.id}`} from={{ x: API.x, y: API.y + 16 }} to={{ x: s.x, y: s.y - 14 }} delay={storeDelayS(i)} />
          ))}
        </>
      )}

      {/* Client — outline only, not a real system component, so it
          deliberately doesn't share the filled-box treatment below. */}
      <rect x={CLIENT.x - 30} y={CLIENT.y - 10} width={60} height={20} rx={4} fill="none" stroke={DARK_TEXT_SOFT} strokeWidth={1.25} />
      <text x={CLIENT.x} y={CLIENT.y + 4} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill={DARK_TEXT_SOFT}>
        CLIENT
      </text>

      {/* API — the hub. Dark fill + light text here (inverted from the
          store boxes below), since a green fill would disappear into the
          card's own green background — this is what should read as the
          one bright/"lit" element floating on it instead. */}
      <rect x={API.x - 42} y={API.y - 16} width={84} height={32} rx={5} fill="var(--background)" />
      <text x={API.x} y={API.y + 4} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fontWeight={700} fill="var(--accent)">
        API
      </text>

      {STORES.map((s, i) => {
        const isOverloaded = hitFlags[i];
        return (
          <g key={s.id}>
            <motion.rect
              x={s.x - 44}
              y={s.y - 14}
              width={88}
              height={28}
              rx={5}
              strokeWidth={1.75}
              initial={{ fill: SURFACE_HEX, stroke: s.colorHex }}
              animate={{ fill: isOverloaded ? CRITICAL_HEX : SURFACE_HEX, stroke: isOverloaded ? CRITICAL_HEX : s.colorHex }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
            <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--foreground)">
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
