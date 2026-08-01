/**
 * GitHub data adapter — server-side only.
 *
 * Uses GitHub GraphQL API v4 with GITHUB_TOKEN if available, and seamlessly
 * falls back to fetching live HTML directly from github.com/users/<username>/contributions.
 *
 * Both the heatmap and the "GitHub Contributions" stat card derive their values
 * from a SINGLE canonical source: `Object.values(calendar).reduce(...)`. This
 * guarantees the displayed total always equals the sum of heatmap cells.
 *
 * Contribution type: ALL contribution types (commits, PRs, issues, reviews) —
 * which matches what GitHub's own contribution graph shows.
 */

import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { PROGRAMMING_CONFIG } from './config';
import type { FetchResult, GitHubData } from './types';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

// Jan 1 2026 UTC — the inclusive start of the tracked date range
const START_DATE = new Date(PROGRAMMING_CONFIG.calendarStart);

/** Converts a YYYY-MM-DD or ISO string to YYYY-MM-DD (UTC) */
function toUTCDateString(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Computes contributions2026 as the sum of all values in the calendar dict.
 * This is the ONLY correct way to compute the total — it ensures the stat
 * card value is identical to what you'd get by summing the heatmap cells.
 *
 * NOTE: zero-contribution days are not stored in the calendar dict (they are
 * filled to 0 by page.server.ts's generateDateRange). So summing calendar
 * values gives the correct non-zero total.
 */
function sumCalendar(calendar: Record<string, number>): number {
  return Object.values(calendar).reduce((acc, v) => acc + v, 0);
}

/** Emits a dev-only debug log for the GitHub pipeline. */
function debugLog(
  source: 'graphql' | 'html-scrape',
  calendar: Record<string, number>,
  total: number
): void {
  if (!dev) return;
  const dates = Object.keys(calendar).sort();
  const dayCount = dates.length; // non-zero days only
  const firstDate = dates[0] ?? 'none';
  const lastDate = dates[dates.length - 1] ?? 'none';
  const rangeStart = toUTCDateString(START_DATE.toISOString());
  const rangeEnd = toUTCDateString(new Date().toISOString());
  console.log(
    `[GitHub/${source}] range=${rangeStart}→${rangeEnd}` +
    ` | active_days=${dayCount}` +
    ` | total=${total}` +
    ` | first_active=${firstDate}` +
    ` | last_active=${lastDate}`
  );
}

/**
 * Direct fetch from official github.com/users/<username>/contributions HTML page.
 * Bypasses 3rd party APIs and reflects live commits instantly without token requirement.
 */
async function fetchGitHubDataDirect(username: string): Promise<FetchResult<GitHubData>> {
  try {
    const [userRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'User-Agent': 'portfolio-app',
          'Cache-Control': 'no-cache, no-store, max-age=0'
        },
        cache: 'no-store'
      }),
      fetch(`https://github.com/users/${username}/contributions`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Cache-Control': 'no-cache, no-store, max-age=0'
        },
        cache: 'no-store'
      })
    ]);

    let repoCount = 0;
    if (userRes.ok) {
      const userData = await userRes.json();
      repoCount = userData.public_repos ?? 0;
    }

    // calendar: only stores days with count > 0 (zero days filled by page.server.ts)
    const calendar: Record<string, number> = {};

    if (contribRes.ok) {
      const html = await contribRes.text();

      // GitHub HTML contribution cells — two patterns GitHub uses:
      // Pattern A: <tool-tip ...>N contribution(s) on Month DD, YYYY</tool-tip>
      // Pattern B: <td data-date="YYYY-MM-DD">...</td> with contribution count inside
      //
      // IMPORTANT: GitHub can emit multiple tooltip elements for the same date
      // (e.g. for accessibility / different week views). We therefore store each
      // date as a SET operation (last-write wins for the same day after dedup),
      // NOT += on a running total. The final total is always sumCalendar(calendar).
      const seen = new Set<string>();
      const toolTipRegex = /(\d+)\s+contribution[s]?\s+on\s+([A-Za-z]+\s+\d+,\s+\d{4})/gi;
      let tipMatch: RegExpExecArray | null;

      while ((tipMatch = toolTipRegex.exec(html)) !== null) {
        const count = parseInt(tipMatch[1], 10);
        const dateParsed = new Date(tipMatch[2] + ' UTC');

        if (!isNaN(dateParsed.getTime()) && dateParsed >= START_DATE && count > 0) {
          const dateStr = toUTCDateString(dateParsed.toISOString());
          // Use last-seen value for a date (GitHub tooltips are authoritative per-day)
          // If the same date appears multiple times, only keep the first occurrence
          // (all occurrences for the same day should have the same count).
          if (!seen.has(dateStr)) {
            seen.add(dateStr);
            calendar[dateStr] = count;
          }
        }
      }

      // Fallback: td data-date pattern if tooltip regex found nothing
      if (Object.keys(calendar).length === 0) {
        const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*>([\s\S]*?)<\/td>/gi;
        let cellMatch: RegExpExecArray | null;
        while ((cellMatch = cellRegex.exec(html)) !== null) {
          const dateStr = cellMatch[1];
          const inner = cellMatch[2];
          const cntMatch = inner.match(/(\d+)\s+contribution/i);
          const count = cntMatch ? parseInt(cntMatch[1], 10) : 0;

          const dayDate = new Date(dateStr + 'T00:00:00Z');
          if (dayDate >= START_DATE && count > 0 && !calendar[dateStr]) {
            calendar[dateStr] = count;
          }
        }
      }
    }

    // CANONICAL TOTAL: always sum the calendar dict — never use a separate accumulator.
    // This guarantees: stat card value === sum of heatmap cells.
    const contributions2026 = sumCalendar(calendar);
    debugLog('html-scrape', calendar, contributions2026);

    return {
      data: { calendar, contributions2026, repoCount },
      error: null
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: `Direct GitHub fetch failed: ${msg}` };
  }
}

export async function fetchGitHubData(): Promise<FetchResult<GitHubData>> {
  const username = PROGRAMMING_CONFIG.github;
  const token = env.GITHUB_TOKEN || (typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined);

  if (!token) {
    return fetchGitHubDataDirect(username);
  }

  try {
    const today = new Date();
    const from = START_DATE.toISOString();
    const to = today.toISOString();

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          repositories(privacy: PUBLIC, ownerAffiliations: OWNER) {
            totalCount
          }
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'portfolio-app',
        'Cache-Control': 'no-cache, no-store, max-age=0'
      },
      cache: 'no-store',
      body: JSON.stringify({ query, variables: { username, from, to } })
    });

    if (!res.ok) {
      return fetchGitHubDataDirect(username);
    }

    const json = await res.json();
    if (json.errors || !json?.data?.user) {
      return fetchGitHubDataDirect(username);
    }

    const user = json.data.user;
    const repoCount: number = user.repositories?.totalCount ?? 0;
    const calendarData = user.contributionsCollection?.contributionCalendar;

    // Build calendar from GraphQL weeks data.
    // Each date appears exactly once in the GraphQL response (one entry per
    // contributionDay), so no deduplication is needed. We only store non-zero
    // days; zero days are filled in by page.server.ts's generateDateRange.
    const calendar: Record<string, number> = {};
    const weeks = calendarData?.weeks ?? [];
    for (const week of weeks) {
      for (const day of week.contributionDays ?? []) {
        const dateStr = toUTCDateString(day.date);
        const dayDate = new Date(dateStr + 'T00:00:00Z');
        if (dayDate >= START_DATE && day.contributionCount > 0) {
          // GraphQL returns one entry per day — no += needed, but safe to use:
          calendar[dateStr] = (calendar[dateStr] ?? 0) + day.contributionCount;
        }
      }
    }

    // CANONICAL TOTAL: recalculate from the filtered calendar dict.
    // Do NOT use calendarData.totalContributions — that is an API-computed
    // value that may include days outside our filtered range or differ from
    // the sum of the calendar entries we actually stored.
    const contributions2026 = sumCalendar(calendar);
    debugLog('graphql', calendar, contributions2026);

    return {
      data: { calendar, contributions2026, repoCount },
      error: null
    };
  } catch {
    return fetchGitHubDataDirect(username);
  }
}
