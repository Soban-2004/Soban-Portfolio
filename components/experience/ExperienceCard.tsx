import Image from "next/image";
import { TagChip } from "@/components/shared/TagChip";
import { highlightNumbers } from "@/lib/highlightNumbers";

export interface ExperienceCardData {
  key: string;
  variant: "primary" | "earlier";
  period: string;
  title: string;
  company: string;
  // Optional — only Drivestream has one so far. Most brand marks assume a
  // light background, so this always renders inside its own light chip
  // (see the logo block below) rather than straight on the card's dark bg.
  logo?: { src: string; width: number; height: number; alt: string };
  location?: string;
  bullets: string[];
  tags: string[];
  badge: string;
}

// Shared between the pinned scroll-scene track and the plain stacked
// fallback (mobile / reduced motion) — same card markup either way, only
// the surrounding layout differs.
export function ExperienceCard({ data, className = "" }: { data: ExperienceCardData; className?: string }) {
  const isPrimary = data.variant === "primary";

  return (
    // bg-background: the pinned scroll scene sits directly over the grid
    // background — without a solid fill, a hairline border-surface-border
    // (9% opacity by design) all but disappeared against it. The border
    // carries a permanent hard offset shadow (same block-shadow language as
    // .font-display-3d and the research-card hover) — a solid, non-blurred
    // accent-colored duplicate offset behind the card, not a soft drop
    // shadow, so it reads as a chunky 3D block sitting on the page rather
    // than a flat rectangle. Primary gets the fuller-strength version;
    // earlier gets a dimmer one so it still reads as visually secondary.
    <div
      className={`rounded-md border bg-background p-4 sm:p-6 md:p-8 ${
        isPrimary
          ? "border-accent/60 shadow-[6px_6px_0_0_rgba(62,207,142,0.35)]"
          : "border-surface-border shadow-[4px_4px_0_0_rgba(232,240,230,0.08)]"
      } ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          {data.logo && (
            // A light chip behind the mark, not the card's own dark
            // surface — Drivestream's logo (like most brand marks) assumes
            // a light background and reads as a near-invisible dark shape
            // without one.
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-foreground/95 p-1.5 sm:h-11 sm:w-11">
              <Image
                src={data.logo.src}
                alt={data.logo.alt}
                width={data.logo.width}
                height={data.logo.height}
                className="h-full w-full object-contain"
                sizes="44px"
              />
            </div>
          )}
          <div>
            <p className="font-mono text-xs text-muted">{data.period}</p>
            <h3 className={`mt-1 uppercase text-foreground ${isPrimary ? "text-lg sm:text-2xl" : "text-base sm:text-lg"}`}>
              {data.title}
            </h3>
            <p className={`text-sm ${isPrimary ? "sm:text-base text-muted" : "text-muted"}`}>
              @ {data.company}
              {data.location ? ` · ${data.location}` : ""}
            </p>
          </div>
        </div>
        <span className="rounded-md border border-surface-border px-2.5 py-1 font-mono text-[10px] font-medium text-muted">
          {data.badge}
        </span>
      </div>

      <ul className={`mt-3 space-y-2 border-l-2 pl-4 sm:mt-5 sm:space-y-3 ${isPrimary ? "border-accent/50" : "border-surface-border"}`}>
        {data.bullets.map((bullet) => (
          <li key={bullet} className={`text-pretty text-sm text-muted ${isPrimary ? "sm:text-base" : ""}`}>
            {highlightNumbers(bullet)}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-5">
        {data.tags.map((tag) => (
          <TagChip key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}
