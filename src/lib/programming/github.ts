/**
 * GitHub data adapter — server-side only.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CANONICAL SOURCE OF TRUTH
 * ─────────────────────────────────────────────────────────────────────────────
 * Endpoint: GitHub GraphQL API v4
 * URL:      https://api.github.com/graphql
 * Auth:     GITHUB_TOKEN (Personal Access Token, scope: read:user)
 *
 * This is the ONLY data source. There are no fallbacks to:
 *   - HTML scraping
 *   - Third-party proxy APIs (jogruber.de, readme-stats, etc.)
 *   - Cached mirrors
 *
 * If the token is missing or the API call fails, the function returns
 * { data: null, error: "<reason>" } — it never silently fabricates values.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NORMALIZED OUTPUT
 * ─────────────────────────────────────────────────────────────────────────────
 * After fetching, contribution days are normalized into a single flat dict:
 *
 *   calendar: Record<string, number>   // { "YYYY-MM-DD": count, ... }
 *
 * Only days with count > 0 are stored. Zero-contribution days are filled
 * in by page.server.ts's generateDateRange() so every calendar cell exists.
 *
 * The total (contributions2026) is ALWAYS:
 *
 *   Object.values(calendar).reduce((s, v) => s + v, 0)
 *
 * It is NEVER taken from GitHub's `totalContributions` field (which is an
 * API-internal aggregate that may differ from the sum of individual days
 * due to range boundary rounding).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TIMEZONE HANDLING
 * ─────────────────────────────────────────────────────────────────────────────
 * GitHub's GraphQL API returns contributionDays.date as a YYYY-MM-DD string
 * representing the calendar date in the user's account timezone. These strings
 * are treated as OPAQUE CALENDAR DATES throughout the pipeline.
 *
 * We NEVER call new Date(day.date) to do range comparisons. Instead we use
 * direct lexicographic string comparison:
 *
 *   '2026-01-01' <= day.date && day.date <= '2026-08-01'
 *
 * This is exact and timezone-safe because YYYY-MM-DD strings sort correctly.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CACHING
 * ─────────────────────────────────────────────────────────────────────────────
 * Cached for GITHUB_CACHE_SECONDS (30 minutes) by the caller (page.server.ts).
 * GitHub GraphQL is rate-limited to 5,000 points/hour; one calendar query
 * costs ~1 point so 30-minute caching is conservative and safe.
 */

import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { PROGRAMMING_CONFIG } from './config';
import type { FetchResult, GitHubData } from './types';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns today's date as a YYYY-MM-DD string in UTC.
 * Called fresh on every fetch — never cached at module level.
 *
 * Using UTC ensures the range end is consistent with how GitHub stores
 * contribution dates (the `to` boundary covers the full UTC day).
 */
function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Dev-only validation of the normalized calendar data.
 * Runs after every successful fetch and logs warnings for any violations.
 * Has zero effect in production (dev === false → entire body is dead code).
 */
function devValidate(
  calendar: Record<string, number>,
  total: number,
  rangeStart: string,
  rangeEnd: string
): void {
  if (!dev) return;

  const dates = Object.keys(calendar).sort();
  let ok = true;

  // 1. No dates outside the requested range
  for (const date of dates) {
    if (date < rangeStart || date > rangeEnd) {
      console.warn(`[GitHub] VALIDATION FAIL: date ${date} is outside range ${rangeStart}→${rangeEnd}`);
      ok = false;
    }
  }

  // 2. No duplicate dates (dict keys are unique by definition, but assert)
  const uniqueCount = new Set(dates).size;
  if (uniqueCount !== dates.length) {
    console.warn(`[GitHub] VALIDATION FAIL: ${dates.length - uniqueCount} duplicate date(s) detected`);
    ok = false;
  }

  // 3. Dates are strictly increasing (already sorted — check adjacent pairs)
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] <= dates[i - 1]) {
      console.warn(`[GitHub] VALIDATION FAIL: dates not strictly increasing: ${dates[i - 1]} then ${dates[i]}`);
      ok = false;
    }
  }

  // 4. Heatmap total === stat card total (they are the same value by construction,
  //    but this asserts the construction itself is correct)
  const computedSum = Object.values(calendar).reduce((s, v) => s + v, 0);
  if (computedSum !== total) {
    console.warn(`[GitHub] VALIDATION FAIL: calendar sum (${computedSum}) !== reported total (${total})`);
    ok = false;
  }

  // 5. Summary log
  console.log(
    `[GitHub/graphql] ${ok ? 'OK' : 'WARNINGS'}` +
    ` | range=${rangeStart}→${rangeEnd}` +
    ` | active_days=${dates.length}` +
    ` | total=${total}` +
    ` | first_active=${dates[0] ?? 'none'}` +
    ` | last_active=${dates[dates.length - 1] ?? 'none'}`
  );
}

// ─── Main fetch ──────────────────────────────────────────────────────────────

export async function fetchGitHubData(): Promise<FetchResult<GitHubData>> {
  const username = PROGRAMMING_CONFIG.github;
  const token = env.GITHUB_TOKEN;

  // Hard requirement: no token → no data. We never silently fall back to
  // third-party APIs or fabricated values.
  if (!token) {
    return {
      data: null,
      error: 'GITHUB_TOKEN is not set. Add it to .env to enable GitHub contributions.'
    };
  }

  // Date range — computed dynamically on every call.
  // rangeStart: the configured calendar start (e.g. '2026-01-01')
  // rangeEnd:   today in UTC (e.g. '2026-08-01')
  const rangeStart = PROGRAMMING_CONFIG.calendarStart; // YYYY-MM-DD
  const rangeEnd = utcToday();                          // YYYY-MM-DD

  // GraphQL DateTime scalars require ISO 8601 with time component.
  // We use T23:59:59Z for `to` to ensure all contributions on `rangeEnd`
  // are included regardless of when during the UTC day they occurred.
  const from = `${rangeStart}T00:00:00Z`;
  const to   = `${rangeEnd}T23:59:59Z`;

  try {
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
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'portfolio-app'
      },
      cache: 'no-store',
      body: JSON.stringify({ query, variables: { username, from, to } })
    });

    if (!res.ok) {
      return {
        data: null,
        error: `GitHub GraphQL HTTP ${res.status}: ${res.statusText}`
      };
    }

    const json = await res.json();

    if (json.errors?.length) {
      return {
        data: null,
        error: `GitHub GraphQL error: ${json.errors[0]?.message ?? 'unknown'}`
      };
    }

    if (!json?.data?.user) {
      return {
        data: null,
        error: `GitHub GraphQL: user "${username}" not found`
      };
    }

    const user = json.data.user;
    const repoCount: number = user.repositories?.totalCount ?? 0;
    const weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }> =
      user.contributionsCollection?.contributionCalendar?.weeks ?? [];

    // ── Build normalized calendar ──────────────────────────────────────────
    //
    // Rules:
    //   • Treat day.date as an opaque YYYY-MM-DD string — no Date parsing.
    //   • Filter strictly: rangeStart <= date <= rangeEnd.
    //   • Skip zero-contribution days (page.server.ts fills those as 0).
    //   • Each date appears exactly once in the GraphQL response; no += needed.
    //
    const calendar: Record<string, number> = {};

    for (const week of weeks) {
      for (const day of week.contributionDays) {
        // Lexicographic string comparison — correct for YYYY-MM-DD
        if (day.date < rangeStart || day.date > rangeEnd) continue;
        if (day.contributionCount <= 0) continue;

        calendar[day.date] = day.contributionCount;
      }
    }

    // ── Canonical total ────────────────────────────────────────────────────
    //
    // NEVER use calendarData.totalContributions here.
    // That value is computed by GitHub internally and may differ from the
    // sum of individual days (e.g. off-by-one on range boundaries).
    //
    // The total is ALWAYS the sum of calendar values — identical to what
    // page.server.ts computes from the same dict for the stat card.
    //
    const contributions2026 = Object.values(calendar).reduce((s, v) => s + v, 0);

    devValidate(calendar, contributions2026, rangeStart, rangeEnd);

    return { data: { calendar, contributions2026, repoCount }, error: null };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: `GitHub fetch failed: ${msg}` };
  }
}
