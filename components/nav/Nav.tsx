"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EASE_DECELERATE } from "@/lib/motion-tokens";

const LINKS = [
  { href: "#stats", label: "Stats" },
  { href: "#experience", label: "History" },
  { href: "#work", label: "Projects" },
  { href: "#open-source", label: "OSS" },
  { href: "#research", label: "Research" },
  { href: "#credentials", label: "Certs" },
  { href: "#skills", label: "Skills" },
];

// Mobile menu open/close timing — a deliberate "digital system activation"
// beat, not a plain drawer slide: opening runs longer since it's doing
// three things in sequence-ish (scanline sweeps, panel expands, items
// stagger in), closing is quicker since collapsing reads right as a
// snappier reversal, not a mirrored replay at the same speed. Bumped up
// from 520/360 per "make it a bit slow" — specifically to give the
// scanline sweep (below) more room to travel at a slower, more visible
// pace; the panel's own clip-path reveal and item stagger keep their own
// separate, already-tuned durations regardless of this.
const OPEN_MS = 700;
const CLOSE_MS = 480;

// The clip-path's origin point — roughly under the hamburger (which sits
// at the nav's left edge, half its own 44px width in), so the panel visibly
// expands outward from the button that triggered it rather than from a
// generic top-left page corner.
const PANEL_ANCHOR = "2.75rem 0%";

// The scanline sweep — replaced the earlier grid-cell cascade per explicit
// feedback ("remove this grid effect... suggest a different one"), from a
// menu of alternatives discussed and picked from directly: a single bright
// band traveling top-to-bottom across the panel as it opens, bottom-to-top
// as it closes — a CRT tube scanning on/off, not many cells flashing at
// once. Purely a decorative flourish layered over the panel (z-10,
// pointer-events-none, aria-hidden) — the actual reveal is still the
// panel's own clip-path circle expand/contract below; this never gates
// content visibility itself, it just sweeps past already-revealed content
// once. The gradient's bright edge sits at whichever end is the direction
// of travel's *leading* edge (bottom for the downward open sweep, top for
// the upward close sweep) with a fading trail behind it, not a flat line —
// a flat 2px bar read as a moving rule, not a beam.
const SCAN_BAND_HEIGHT = "3rem";

function NavScanline({ reverse }: { reverse: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 z-10"
      style={{
        height: SCAN_BAND_HEIGHT,
        background: reverse
          ? "linear-gradient(to bottom, rgba(62, 207, 142, 0.85), rgba(62, 207, 142, 0.2) 45%, transparent)"
          : "linear-gradient(to bottom, transparent, rgba(62, 207, 142, 0.2) 55%, rgba(62, 207, 142, 0.85))",
        boxShadow: reverse ? "0 -6px 14px -2px rgba(62, 207, 142, 0.5)" : "0 6px 14px -2px rgba(62, 207, 142, 0.5)",
      }}
      initial={{ top: reverse ? "100%" : `-${SCAN_BAND_HEIGHT}` }}
      animate={{ top: reverse ? `-${SCAN_BAND_HEIGHT}` : "100%" }}
      transition={{ duration: (reverse ? CLOSE_MS - 20 : OPEN_MS - 40) / 1000, ease: EASE_DECELERATE }}
    />
  );
}

// The hamburger's three bars, morphing into an X via plain CSS transform/
// opacity transitions rather than crossfading two different icon glyphs —
// a real morph (top/bottom bars rotate and slide to meet in the middle,
// the middle bar fades out) reads as one shape becoming another, which a
// glyph swap never quite does. bg-current picks up the button's own text
// color, so the accent tint applied there while open (see the button
// below) colors these bars too.
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
      <span
        className={`ease-decelerate h-0.5 w-full rounded-full bg-current transition-transform duration-300 ${
          open ? "translate-y-[7px] rotate-45" : ""
        }`}
      />
      <span
        className={`ease-decelerate h-0.5 w-full rounded-full bg-current transition-opacity duration-200 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`ease-decelerate h-0.5 w-full rounded-full bg-current transition-transform duration-300 ${
          open ? "-translate-y-[7px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  // mobileOpen is still the one source of truth every existing behavior
  // below (outside-tap close, Escape, body-scroll lock, aria-expanded)
  // reads from — untouched. `phase` is a purely visual layer on top of it
  // that drives the animation, so the panel can keep rendering (and
  // playing its closing animation) for a beat after mobileOpen already
  // flips back to false, instead of vanishing instantly.
  const [mobileOpen, setMobileOpen] = useState(false);
  const [phase, setPhase] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const [reducedMotion, setReducedMotion] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // Skips the initial mount below — mobileOpen always starts false, so
  // without this the first effect run would still run the "closing"
  // branch (phase was already "closed", but the effect doesn't know that
  // without checking) and briefly mount a closing-styled panel that was
  // never actually open. Ref, not state, since it shouldn't itself cause
  // a re-render.
  const didMountRef = useRef(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      setPhase(mobileOpen ? "open" : "closed");
      return;
    }
    if (mobileOpen) {
      if (reducedMotion) {
        setPhase("open");
        return;
      }
      setPhase("opening");
      const t = window.setTimeout(() => setPhase("open"), OPEN_MS);
      return () => window.clearTimeout(t);
    }
    if (reducedMotion) {
      setPhase("closed");
      return;
    }
    setPhase("closing");
    const t = window.setTimeout(() => setPhase("closed"), CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [mobileOpen, reducedMotion]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Two real gaps the mobile menu had: tapping anywhere outside it (the
  // normal way any app dropdown/sheet is expected to close) did nothing —
  // only the X button or one of the menu's own links closed it — and the
  // page underneath stayed scrollable while it was open, so a drag on what
  // looked like the menu's own background could scroll the page behind it.
  // Both fixed here: a pointerdown listener outside the panel/toggle closes
  // it, and body scroll is locked for as long as it's open. Only attached
  // while mobileOpen is true, and only after this render commits — so the
  // same tap that opens the menu can't also be seen as the "outside" tap
  // that immediately closes it again.
  useEffect(() => {
    if (!mobileOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return;
      setMobileOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    // "top" (Hero) and "about" aren't in LINKS — there's no nav link for
    // either — but they still need to be observed, not just the sections
    // that *do* have a link. Without them, scrolling back up into Hero
    // left whatever section was active last (typically "#stats", the
    // first real link) stuck highlighted: the observer's callback only
    // ever fires setActive when something in `ids` is actually
    // intersecting, so once you scrolled back above every observed
    // section, the callback stopped firing at all and `active` just held
    // its last value instead of clearing. Observing "top"/"about" too, and
    // explicitly clearing `active` when one of them is what's intersecting,
    // fixes that — the nav now correctly shows nothing highlighted while
    // you're at the very top of the page.
    const linkIds = LINKS.map((l) => l.href.slice(1));
    const ids = ["top", "about", ...linkIds, "contact"];
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const id = visible[0].target.id;
        setActive(linkIds.includes(id) || id === "contact" ? "#" + id : "");
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-[background-color,border-color] duration-200 ${
        scrolled
          ? "border-b border-accent/40 bg-background/85 backdrop-blur-md"
          : "border-b border-accent/40 bg-background"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Hamburger sits to the left of the wordmark, not the right — the
            layout most mobile apps/sites use (toggle first, brand next to
            it). Grouped in one flex child together with the logo rather
            than positioned via order utilities: the button is display:none
            at md+ (zero width, doesn't affect layout there), and with only
            this one group + HIRE() visible below md, `justify-between` on
            the parent nav naturally pins the group to the left and HIRE()
            (where visible, sm+) to the right — no extra positioning rules
            needed, and the md+ desktop layout (logo, links, HIRE — the
            hamburger contributes nothing there) is unchanged. */}
        <div className="flex items-center gap-3">
          <button
            ref={menuButtonRef}
            type="button"
            className={`flex h-11 w-11 items-center justify-center transition-colors duration-200 md:hidden ${
              mobileOpen ? "text-accent" : "text-foreground"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>

          {/* Color-swap hover — same "opposite colors" treatment as
              HIRE()/CONTACT()/LIVE_LINK elsewhere on the site, just applied
              to the two halves of the wordmark instead of a filled button:
              the "//" and "SOBAN" trade colors on hover/tap rather than one
              plain color shift, so the logo itself feels alive/clickable
              instead of just sitting there as a static label. */}
          <a href="#top" className="group font-mono text-sm font-bold">
            <span className="text-accent transition-colors duration-150 group-hover:text-foreground group-active:text-foreground">
              //
            </span>{" "}
            <span className="text-foreground transition-colors duration-150 group-hover:text-accent group-active:text-accent">
              SOBAN
            </span>
          </a>
        </div>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`font-mono text-xs font-bold uppercase tracking-wide transition-colors duration-150 hover:text-foreground ${
                  active === link.href ? "text-foreground" : "text-muted"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Filled at rest, inverts to outlined (transparent fill, accent
            border + text) on hover/tap — same treatment as CONTACT() in
            SYS_STATS and LIVE_LINK on project cards. Now shown on mobile
            too (was hidden below sm, entirely unreachable without a
            keyboard/desktop viewport) — the hamburger moved to the left
            in an earlier round specifically so this had somewhere to sit
            on the right, the way most mobile app bars pair a menu toggle
            with a primary action. */}
        <a
          href="#contact"
          className="invert-static-burst flex min-h-9 items-center rounded-md border-2 border-accent bg-accent px-3 py-1.5 font-mono text-xs font-bold text-background transition-colors duration-150 hover:bg-transparent hover:text-accent active:bg-transparent active:text-accent sm:px-4"
        >
          HIRE()
        </a>
      </nav>

      {phase !== "closed" && (
        <motion.div
          ref={menuRef}
          // max-h + its own scroll, since body scroll is now locked while
          // this is open (see the effect above) — without it, on a short
          // phone screen the lower links (Certs/Skills/Contact) would be
          // stuck unreachable: the page itself can no longer scroll to
          // reveal them, so the panel has to be able to scroll internally
          // instead. relative: the anchor NavGridTrace's absolute overlay
          // positions itself against.
          className="relative max-h-[calc(100vh-4.5rem)] overflow-x-hidden overflow-y-auto overscroll-contain border-t border-surface-border bg-background/95 backdrop-blur-md md:hidden"
          initial="closed"
          animate={phase === "closing" ? "closed" : "open"}
          variants={{
            // circle(...% at PANEL_ANCHOR): a reveal mask centered right
            // under the hamburger, growing from nothing to well past the
            // panel's own diagonal (150%, so it fully covers a wide phone
            // in landscape too) — "materializes outward from a single
            // source" as an actual expanding shape, not just a fade.
            closed: {
              clipPath: `circle(0% at ${PANEL_ANCHOR})`,
              transition: reducedMotion ? { duration: 0 } : { duration: 0.26, delay: 0.08, ease: EASE_DECELERATE },
            },
            open: {
              clipPath: `circle(150% at ${PANEL_ANCHOR})`,
              transition: reducedMotion ? { duration: 0 } : { duration: 0.42, ease: EASE_DECELERATE },
            },
          }}
        >
          {!reducedMotion && (phase === "opening" || phase === "closing") && (
            // key={phase}: "opening" and "closing" are two different
            // strings, so switching between them forces React to unmount
            // and remount this — guarantees a fresh initial->animate run
            // every time the menu opens or closes, rather than leaving it
            // to the (already-reliable, but less explicit) fact that this
            // element only ever exists during these two phases anyway.
            <NavScanline key={phase} reverse={phase === "closing"} />
          )}
          <motion.ul
            className="flex flex-col px-6 py-4"
            initial="closed"
            animate={phase === "closing" ? "closed" : "open"}
            variants={{
              closed: { transition: reducedMotion ? {} : { staggerChildren: 0.02, staggerDirection: -1 } },
              open: {
                transition: reducedMotion ? {} : { staggerChildren: 0.025, delayChildren: 0.13 },
              },
            }}
          >
            {[...LINKS, { href: "#about", label: "About" }, { href: "#contact", label: "Contact" }].map((link) => (
              <motion.li
                key={link.href}
                variants={{
                  // A small fade/slide, not a real travel distance — this
                  // is meant to read as content settling into place after
                  // the system around it activates, not its own separate
                  // slide-in moment.
                  closed: { opacity: 0, y: 6, transition: reducedMotion ? { duration: 0 } : { duration: 0.12 } },
                  open: {
                    opacity: 1,
                    y: 0,
                    transition: reducedMotion ? { duration: 0 } : { duration: 0.16, ease: EASE_DECELERATE },
                  },
                }}
              >
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block min-h-11 py-3 font-mono text-sm font-bold uppercase text-foreground"
                >
                  {link.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </header>
  );
}
