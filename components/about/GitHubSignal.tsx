// A real, personal fact rendered as a small interactive-feeling visual —
// the honest equivalent of "make a static personal fact playful" without
// inventing one profile.md doesn't have (see IMPLEMENTATION.md §4 for why
// height/distance were excluded; this uses verifiable GitHub activity
// instead). Server-rendered from real data (lib/github.ts), degrades to
// nothing if the fetch fails — never a broken widget over missing content.
//
// Async Server Component: no client JS at all. Hover tooltips are native
// `title` attributes; the aggregate numbers are real visible text, not just
// an aria-label, so the information survives with zero JS and for
// screen readers alike (365 individually-tabbable cells would be a real
// keyboard trap, so cells are decorative — the count is stated in prose).

import { getContributions } from "@/lib/github";

function levelClass(level: number) {
  switch (level) {
    case 4:
      return "bg-accent";
    case 3:
      return "bg-accent/70";
    case 2:
      return "bg-accent/45";
    case 1:
      return "bg-accent/20";
    default:
      return "bg-surface-border";
  }
}

export async function GitHubSignal() {
  const data = await getContributions();
  if (!data) return null;

  const weeks: (typeof data.days[number] | null)[][] = [];
  let currentWeek: (typeof data.days[number] | null)[] = [];

  const firstWeekday = new Date(data.days[0].date + "T00:00:00Z").getUTCDay();
  for (let i = 0; i < firstWeekday; i++) currentWeek.push(null);

  for (const day of data.days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return (
    <div className="mt-10 border-t border-surface-border pt-8">
      <p className="font-mono text-xs text-muted/60">
        {data.total.toLocaleString()} GitHub contributions in the last year · active on {data.activeDays} days
      </p>
      {/* max-w-full: without a width constraint, an inline-grid sizes
          itself to fit ALL of its content (52+ weeks, ~630px) regardless
          of the viewport — overflow-x-auto never actually had anything to
          scroll, so on a phone-width screen this was pushing the entire
          page wider instead of scrolling internally within its own box. */}
      <div
        role="img"
        aria-label={`GitHub contribution graph: ${data.total} contributions across ${data.activeDays} active days in the last year`}
        className="mt-3 inline-grid max-w-full grid-flow-col gap-[3px] overflow-x-auto"
      >
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-rows-7 gap-[3px]">
            {week.map((day, di) =>
              day ? (
                <div
                  key={di}
                  title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                  className={`h-[9px] w-[9px] rounded-[2px] transition-transform duration-150 hover:scale-125 ${levelClass(day.level)}`}
                />
              ) : (
                <div key={di} className="h-[9px] w-[9px]" />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
