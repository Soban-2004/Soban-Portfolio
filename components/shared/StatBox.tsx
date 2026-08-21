import { Reveal } from "@/components/shared/Reveal";

// A bordered stat readout — a small mono label above a big bold number.
// The `filled` variant is the "one card breaks the rhythm" device (Commit
// Log reference): a solid accent-filled box among plain bordered ones.
// Same lift/shadow/border-brighten hover treatment as the project and
// paper cards elsewhere on the site, scaled down for a smaller box, so
// SYS_STATS reads as interactive/alive rather than static text in boxes.
// active: mirrors every hover: utility — :hover never fires on a touch
// tap (there's no persistent pointer to be "over" the element), so
// without this the whole lift/glow treatment was invisible on mobile.
// :active does fire on touchstart, so tapping (and holding) a card now
// gets the same feedback a mouse hover gives on desktop.

export function StatBox({
  value,
  label,
  filled = false,
  accent = "text-accent",
  delay = 0,
}: {
  value: string;
  label: string;
  filled?: boolean;
  accent?: string;
  // Lets a parent row of StatBoxes stagger their scroll-in reveal (each a
  // little after the last) instead of all three popping in at once.
  delay?: number;
}) {
  return (
    <Reveal
      y={16}
      delay={delay}
      className={`rounded-md border p-4 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 active:-translate-y-1 ${
        filled
          ? "border-accent bg-accent text-background hover:shadow-[0_10px_28px_-10px_rgba(62,207,142,0.55)] active:shadow-[0_10px_28px_-10px_rgba(62,207,142,0.55)]"
          : "border-surface-border hover:border-accent/60 hover:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)] active:border-accent/60 active:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)]"
      }`}
    >
      <p className={`font-mono text-2xl font-black sm:text-3xl ${filled ? "text-background" : accent}`}>{value}</p>
      <p className={`mt-1 font-mono text-xs uppercase tracking-wide ${filled ? "text-background/70" : "text-muted"}`}>
        {label}
      </p>
    </Reveal>
  );
}
