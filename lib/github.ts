// Fetches Soban's real GitHub contribution calendar (server-side only) by
// parsing the same HTML fragment github.com's own profile page renders —
// there's no public REST/GraphQL endpoint for this without a personal
// access token, so this reads the same markup a browser would. Cached for
// 12h via Next's fetch cache; returns null on any failure so the calling
// component can degrade gracefully (this is personality, not core content —
// never worth a broken build or a visibly failed widget over).

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  level: number; // 0-4, GitHub's own bucketing
  count: number;
}

export interface ContributionData {
  days: ContributionDay[];
  total: number;
  activeDays: number;
}

const GITHUB_USERNAME = "Soban-2004";

export async function getContributions(): Promise<ContributionData | null> {
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; portfolio-build)",
      },
      next: { revalidate: 60 * 60 * 12 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Each day is a <td data-date="YYYY-MM-DD" id="..." data-level="0-4" class="ContributionCalendar-day">
    const dayMatches = [...html.matchAll(/<td\s+([^>]*class="ContributionCalendar-day"[^>]*)>/g)];
    const idToDay = new Map<string, { date: string; level: number }>();

    for (const [, attrs] of dayMatches) {
      const date = attrs.match(/data-date="([\d-]+)"/)?.[1];
      const level = attrs.match(/data-level="(\d)"/)?.[1];
      const id = attrs.match(/\sid="([^"]+)"/)?.[1];
      if (date && level && id) {
        idToDay.set(id, { date, level: Number(level) });
      }
    }

    // Each tooltip: <tool-tip ... for="{id}" ...>N contributions on Month Day.</tool-tip>
    const tooltipMatches = [
      ...html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>(?:(\d+) contributions?|No contributions) on[^<]*<\/tool-tip>/g),
    ];

    const days: ContributionDay[] = [];
    for (const [, id, countStr] of tooltipMatches) {
      const day = idToDay.get(id);
      if (!day) continue;
      days.push({ date: day.date, level: day.level, count: countStr ? Number(countStr) : 0 });
    }

    days.sort((a, b) => a.date.localeCompare(b.date));
    const total = days.reduce((sum, d) => sum + d.count, 0);
    const activeDays = days.filter((d) => d.count > 0).length;

    if (days.length === 0) return null;
    return { days, total, activeDays };
  } catch {
    return null;
  }
}
