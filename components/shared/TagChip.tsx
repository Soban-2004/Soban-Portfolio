export function TagChip({
  label,
  mobileLabel,
  filled = false,
  onLight = false,
}: {
  label: string;
  /** Shorter text to show below `sm` only (e.g. "MCP" instead of "MCP
   * (Model Context Protocol)") — a couple of the longer tag names are the
   * reason a wrapped mobile chip row needs more rows than it should.
   * Pure CSS breakpoint swap (two spans, one hidden each side) rather
   * than a JS viewport check, so there's no client-only mismatch between
   * server and first paint. Omit when `label` is already short enough. */
  mobileLabel?: string;
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
      {mobileLabel ? (
        <>
          <span className="sm:hidden">{mobileLabel}</span>
          <span className="hidden sm:inline">{label}</span>
        </>
      ) : (
        label
      )}
    </span>
  );
}
