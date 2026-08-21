import { TagChip } from "@/components/shared/TagChip";
import { highlightNumbers } from "@/lib/highlightNumbers";

export interface ExperienceCardData {
  key: string;
  variant: "primary" | "earlier";
  period: string;
  title: string;
  company: string;
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
      className={`rounded-md border bg-background p-6 sm:p-8 ${
        isPrimary
          ? "border-accent/60 shadow-[6px_6px_0_0_rgba(62,207,142,0.35)]"
          : "border-surface-border shadow-[4px_4px_0_0_rgba(232,240,230,0.08)]"
      } ${className}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-muted">{data.period}</p>
          <h3 className={`mt-1 uppercase text-foreground ${isPrimary ? "text-2xl" : "text-lg"}`}>{data.title}</h3>
          <p className={isPrimary ? "text-muted" : "text-sm text-muted"}>
            @ {data.company}
            {data.location ? ` · ${data.location}` : ""}
          </p>
        </div>
        <span className="rounded-md border border-surface-border px-2.5 py-1 font-mono text-[10px] font-medium text-muted">
          {data.badge}
        </span>
      </div>

      <ul className={`mt-5 space-y-3 border-l-2 pl-4 ${isPrimary ? "border-accent/50" : "border-surface-border"}`}>
        {data.bullets.map((bullet) => (
          <li key={bullet} className={`text-pretty text-muted ${isPrimary ? "" : "text-sm"}`}>
            {highlightNumbers(bullet)}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {data.tags.map((tag) => (
          <TagChip key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}
