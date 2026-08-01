/**
 * GitHub data adapter — server-side only.
 *
 * PRIMARY SOURCE: github-contributions-api.jogruber.de/v4/<username>?y=2026
 *   - Returns a clean JSON array of { date, count, level } per calendar day.
 *   - No auth token required. No HTML scraping. Works reliably right now.
 *   - Source: https://github.com/grubersjoe/github-contributions-api
 *
 * SECONDARY SOURCE (if GITHUB_TOKEN is set): GitHub GraphQL API v4
 *   - More authoritative but requires a personal access token.
 *   - Used as the primary path when the token is available.
 *
 * REPO COUNT: Always fetched from the official GitHub REST API (public, no token).
 *
 * CANONICAL INVARIANT: contributions2026 = Object.values(calendar).reduce(+)
 *   — the stat card and heatmap always derive from the same source.
 *
 * Contribution type: ALL contribution types (commits, PRs, issues, reviews),
 * matching what GitHub's own contribution graph shows.
 */

import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { PROGRAMMING_CONFIG } from './config';
import type { FetchResult, GitHubData } from './types';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';
// Community-maintained GitHub contribution JSON API (no token required)
// Returns: { total: { "2026": N }, contributions: [{ date, count, level }] }
const GH_CONTRIB_API = 'https://github-contributions-api.jogruber.de/v4';

// Jan 1 2026 UTC — the inclusive start of the tracked date range
const START_DATE = new Date(PROGRAMMING_CONFIG.calendarStart);

/** Converts a YYYY-MM-DD string to a Date at UTC midnight */
function parseUTCDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00Z');
}

/**
 * Returns the sum of all values in the calendar dict.
 * This is the ONLY way contributions2026 is computed — it guarantees
 * the stat card value === sum of heatmap daily cells.
 */
function sumCalendar(calendar: Record<string, number>): number {
  return Object.values(calendar).reduce((acc, v) => acc + v, 0);
}

/** Emits a dev-only debug log for the GitHub pipeline. */
function debugLog(
  source: 'contributions-api' | 'graphql',
  calendar: Record<string, number>,
  total: number
): void {
  if (!dev) return;
  const dates = Object.keys(calendar).sort();
  const rangeStart = '2026-01-01';
  const rangeEnd = new Date().toISOString().slice(0, 10);
  console.log(
    `[GitHub/${source}] range=${rangeStart}→${rangeEnd}` +
    ` | active_days=${dates.length}` +
    ` | total=${total}` +
    ` | first_active=${dates[0] ?? 'none'}` +
    ` | last_active=${dates[dates.length - 1] ?? 'none'}`
  );
}

/** Fetch public repo count from the GitHub REST API (no token needed). */
async function fetchRepoCount(username: string): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'portfolio-app' },
      cache: 'no-store'
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.public_repos ?? 0;
  } catch {
    return 0;
  }
}

/**
 * PRIMARY: Fetch from github-contributions-api.jogruber.de
 *
 * Endpoint: GET /v4/<username>?y=2026
 * Response: {
 *   total: { "2026": <number> },
 *   contributions: [{ date: "YYYY-MM-DD", count: <number>, level: 0|1|2|3|4 }]
 * }
 *
 * Trade-off: This is a community-maintained service. If it goes down,
 * the adapter falls back to the GitHub GraphQL path (token required) or
 * returns an error. The service itself scrapes GitHub's public HTML server-side,
 * so it reflects the same data as GitHub's own contribution graph.
 */
async function fetchViaContributionsAPI(username: string): Promise<FetchResult<GitHubData>> {
  try {
    const [contribRes, repoCount] = await Promise.all([
      fetch(`${GH_CONTRIB_API}/${username}?y=2026`, {
        headers: { 'User-Agent': 'portfolio-app' },
        cache: 'no-store'
      }),
      fetchRepoCount(username)
    ]);

    if (!contribRes.ok) {
      return { data: null, error: `GitHub contributions API error: ${contribRes.status} ${contribRes.statusText}` };
    }

    const json = await contribRes.json();

    // Validate response shape
    if (!Array.isArray(json.contributions)) {
      return { data: null, error: 'GitHub contributions API: unexpected response shape' };
    }

    const calendar: Record<string, number> = {};

    for (const entry of json.contributions as Array<{ date: string; count: number }>) {
      if (!entry.date || typeof entry.count !== 'number') continue;
      if (entry.count <= 0) continue; // skip zero-contribution days (filled by page.server.ts)

      const dayDate = parseUTCDate(entry.date);
      if (dayDate < START_DATE) continue; // only 2026+
      if (dayDate > new Date()) continue;  // skip future dates the API pre-fills

      // Date is already YYYY-MM-DD from the API — no conversion needed
      calendar[entry.date] = entry.count;
    }

    const contributions2026 = sumCalendar(calendar);
    debugLog('contributions-api', calendar, contributions2026);

    return { data: { calendar, contributions2026, repoCount }, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: `GitHub contributions API fetch failed: ${msg}` };
  }
}

/**
 * SECONDARY: Fetch from the official GitHub GraphQL API v4.
 * Requires GITHUB_TOKEN. Used when the token is present (more authoritative).
 */
async function fetchViaGraphQL(username: string, token: string): Promise<FetchResult<GitHubData>> {
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
        'User-Agent': 'portfolio-app'
      },
      cache: 'no-store',
      body: JSON.stringify({ query, variables: { username, from, to } })
    });

    if (!res.ok) {
      return { data: null, error: `GitHub GraphQL HTTP error: ${res.status}` };
    }

    const json = await res.json();
    if (json.errors || !json?.data?.user) {
      const msg = json.errors?.[0]?.message ?? 'unknown GraphQL error';
      return { data: null, error: `GitHub GraphQL error: ${msg}` };
    }

    const user = json.data.user;
    const repoCount: number = user.repositories?.totalCount ?? 0;
    const weeks = user.contributionsCollection?.contributionCalendar?.weeks ?? [];

    const calendar: Record<string, number> = {};
    for (const week of weeks) {
      for (const day of week.contributionDays ?? []) {
        if (day.contributionCount <= 0) continue;
        const dayDate = parseUTCDate(day.date);
        if (dayDate < START_DATE) continue;
        // day.date is already YYYY-MM-DD in the GraphQL response
        calendar[day.date] = (calendar[day.date] ?? 0) + day.contributionCount;
      }
    }

    const contributions2026 = sumCalendar(calendar);
    debugLog('graphql', calendar, contributions2026);

    return { data: { calendar, contributions2026, repoCount }, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: `GitHub GraphQL fetch failed: ${msg}` };
  }
}

/**
 * Main entry point.
 *
 * Strategy:
 *   1. If GITHUB_TOKEN is set → try GraphQL (most authoritative).
 *      On failure → fall back to the contributions API.
 *   2. If no token → use the contributions API directly (no auth needed,
 *      returns live data via the community-maintained scraping proxy).
 */
export async function fetchGitHubData(): Promise<FetchResult<GitHubData>> {
  const username = PROGRAMMING_CONFIG.github;
  const token = env.GITHUB_TOKEN || (typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined);

  if (token) {
    const result = await fetchViaGraphQL(username, token);
    if (result.data) return result;
    // GraphQL failed — fall back to contributions API
    if (dev) console.warn(`[GitHub] GraphQL failed (${result.error}), falling back to contributions API`);
  }

  return fetchViaContributionsAPI(username);
}
