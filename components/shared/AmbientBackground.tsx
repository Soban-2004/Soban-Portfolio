// A dim, static grid across the whole viewport as you scroll — fixed
// positioning, not tied to the hero. Pure CSS, no JS, no per-frame work.
// (An earlier version brightened a soft circle of this grid around the
// cursor as you moved — removed per feedback; this is back to just the
// plain static texture.)

export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient-grid absolute inset-0" />
    </div>
  );
}
