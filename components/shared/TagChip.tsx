export function TagChip({
  label,
  filled = false,
  onLight = false,
}: {
  label: string;
  filled?: boolean;
  /** Card background is itself the light accent fill (e.g. the flagship
   * project card) — needs dark-on-light contrast instead of the usual
   * muted-on-dark, or the chip is nearly invisible. */
  onLight?: boolean;
}) {
  const classes = onLight
    ? "border-background/30 text-background"
    : filled
      ? "border-accent bg-accent text-background"
      : "border-surface-border text-muted";

  return (
    <span className={`rounded-md border px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wide ${classes}`}>
      {label}
    </span>
  );
}
