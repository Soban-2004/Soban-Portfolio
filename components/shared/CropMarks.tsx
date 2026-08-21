// Small "+" crop-marks at the corners — a print/technical-drawing motif
// (Commit Log reference). Purely decorative, aria-hidden.
//
// Two looks: the plain default (Hero) is a static, muted outline — quiet,
// just texture. "glow" (Contact) is green, given depth via a layered
// drop-shadow (a hard dark offset plus a soft accent glow — the same
// "coming out of the screen" language as the site's other 3D touches,
// applied via filter since this is an SVG icon rather than text/a box),
// and spins continuously. The left/right marks spin at different speeds
// and in opposite directions (crop-mark-glow-a/b in globals.css) — a
// single shared duration read as too mechanical/synced for two corners
// that aren't actually connected to each other; this reads more like two
// independent bits of "system activity" instead of one ornament mirrored
// twice. Only Contact opts into it, so Hero's marks are unaffected.
export function CropMarks({ variant = "default" }: { variant?: "default" | "glow" }) {
  const glow = variant === "glow";
  const mark = (spinClass: string) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={glow ? `${spinClass} text-accent` : "text-surface-border"}
    >
      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth={glow ? 1.5 : 1} />
    </svg>
  );
  return (
    <>
      <span className="pointer-events-none absolute left-4 top-4">{mark("crop-mark-glow-a")}</span>
      <span className="pointer-events-none absolute right-4 top-4">{mark("crop-mark-glow-b")}</span>
    </>
  );
}
