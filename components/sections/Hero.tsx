"use client";

import { useEffect, useState } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { Button } from "@/components/shared/Button";
import { CropMarks } from "@/components/shared/CropMarks";
import { SystemLog } from "@/components/hero/SystemLog";
import { hero, identity } from "@/lib/content";
import { BOOT_SESSION_KEY, BOOT_UNLOCK_EVENT } from "@/lib/bootSignal";

// Evaluated once when this module first loads — which happens as the
// client bundle is set up, strictly before any component's effects can
// run. That timing matters: LoadingScreen's own effect writes this exact
// sessionStorage key, and if this read happened inside Hero's effect
// instead, effect-ordering between the two components would decide
// whether it saw the value before or after that write — a race, not a
// reliable "was this a fresh session" check. Reading it at module scope
// sidesteps the race entirely.
const bootedFresh = typeof window !== "undefined" && !sessionStorage.getItem(BOOT_SESSION_KEY);

export function Hero() {
  // Starts visible — matches the server-rendered markup, so there's no
  // hydration mismatch and no-JS visitors see the content immediately.
  // The effect below only ever moves this to false (briefly) on a
  // genuine fresh boot session with motion allowed; that's the one case
  // where it should wait for LoadingScreen's unlock wipe and then fade
  // in left-to-right in the same beat, rather than just popping into
  // view fully rendered underneath the loading screen the whole time.
  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (!bootedFresh) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setReady(false);
    const onUnlock = () => setReady(true);
    window.addEventListener(BOOT_UNLOCK_EVENT, onUnlock, { once: true });
    return () => window.removeEventListener(BOOT_UNLOCK_EVENT, onUnlock);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-28 pb-16"
    >
      <CropMarks />

      {/* Depth: a soft off-color glow, slowly breathing instead of static —
          cheap, GPU-only (opacity/transform, no layout impact). The grid
          texture and scanline sweep are now global (AmbientBackground,
          mounted once in the root layout) so they're visible throughout
          the page, not just here. */}
      <div
        aria-hidden="true"
        className="glow-pulse pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />

      {/* Ghost watermark typography (Sawad-style layered type) — the site's
          own identity, blown up huge. Position history, per successive
          rounds of feedback: started at -right-6/top-32; bled further off
          the right edge to -right-14; moved back onto the bottom-right
          corner (bottom-0) to stop colliding with the "SOBAN SHANKAR"
          headline; pulled 50px further left to -right-1.5; another 50px
          left to right-11/top-32.
          Visibility breakpoint raised from sm to lg: hiding it only below
          sm (640px) still left it rendering — badly — on tablets (iPad
          Mini is 768px wide, comfortably past sm), the exact size it was
          reported broken on. This is explicitly decorative-only and only
          reads as intended with the full-width breathing room a real
          laptop viewport gives it, so it's now laptop-and-up only
          (lg: 1024px+), hidden through every phone AND tablet size rather
          than just phones. */}
      <div aria-hidden="true" className="pointer-events-none absolute right-11 top-32 hidden select-none lg:block">
        <p className="watermark-base whitespace-nowrap font-mono text-[3.5rem] font-bold leading-none sm:text-[4.5rem]">
          AI ENGINEER
        </p>
        <p className="watermark-sweep absolute inset-0 whitespace-nowrap font-mono text-[3.5rem] font-bold leading-none sm:text-[4.5rem]">
          AI ENGINEER
        </p>
      </div>

      {/* Left-to-right fade-in, triggered by LoadingScreen's
          BOOT_UNLOCK_EVENT (see the listener above) once the Matrix-unlock
          wipe has fully finished and the overlay is gone — a distinct
          second beat after the wipe, not simultaneous with it. Dispatching
          this the instant the wipe *started* instead was the first
          version, and it barely read as a fade at all: Hero sits in the
          upper part of the screen, so the cells covering it cleared early
          in the cascade too, while Hero's own 700ms fade was still
          running — the two overlapped almost completely instead of one
          visibly following the other. Only plays once, on a genuine fresh
          session; a repeat page load or reduced motion just renders this
          at rest (opacity-100/translate-x-0) the whole time, per the
          `ready` state's default. */}
      <div
        className={`relative mx-auto w-full max-w-6xl transition-[opacity,transform] duration-700 ease-out ${
          ready ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          SYS_STATUS: AVAILABLE — {identity.name.toUpperCase()}
        </div>

        {/* The name is the one big display statement now — the pixel-3D
            font (font-display-3d), as large as anything gets on the page.
            The role/headline sentence drops to a smaller, plain-weight
            line underneath: normal-case, sans body font, not the display
            face — a tagline under a name, not a second display headline. */}
        <h1 className="mt-5 max-w-4xl text-balance leading-[1.15] text-foreground">
          <span className="font-display-3d block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {identity.name}
          </span>
          <span className="mt-4 block font-sans text-lg font-normal normal-case tracking-normal text-muted sm:text-xl md:text-2xl">
            {hero.headline}
          </span>
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-xl text-pretty text-lg text-muted">{hero.subline}</p>
          <p className="font-mono text-sm text-muted/70">{hero.locationLine}</p>
        </div>

        <div className="mt-8">
          <SystemLog />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="#work" variant="primary">
            $ view --work
          </Button>
          <Button href={identity.resumeUrl} variant="secondary">
            resume.pdf
          </Button>
          <div className="ml-1 flex items-center gap-1">
            <a
              href={identity.github}
              aria-label="GitHub"
              className="flex h-11 w-11 items-center justify-center text-muted transition-colors duration-150 hover:text-foreground"
            >
              <GitHubIcon size={20} />
            </a>
            <a
              href={identity.linkedin}
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center text-muted transition-colors duration-150 hover:text-foreground"
            >
              <LinkedInIcon size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
