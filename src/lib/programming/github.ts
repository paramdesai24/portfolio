/**
 * GitHub data adapter — server-side only.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CANONICAL PIPELINE DESIGN (Jan 1, 2026 → Today)
 * ─────────────────────────────────────────────────────────────────────────────
 * Data Source: GitHub GraphQL API v4 (https://api.github.com/graphql)
 * Auth:        GITHUB_TOKEN (Personal Access Token, scope: read:user)
 *
 * 1. INSPECT GRAPHQL RESPONSE:
 *    Fetches contributionCalendar for range `2026-01-01T00:00:00Z` → `${today}T23:59:59Z`.
 *    Logs response metadata (first/last dates, week count, total days) to verify structure.
 *
 * 2. FLATTEN & FILTER:
 *    Flattens all `contributionDays` from GraphQL weeks into `{ date, contributionCount }`.
 *    Filters individually: keeps only days where `2026-01-01` <= date <= `today`.
 *    Discards all dates prior to January 1, 2026.
 *
 * 3. BUILD ONE CANONICAL DATASET:
 *    Synthesizes a complete, contiguous array for every single day from `2026-01-01`
 *    through `today`:
 *      [ { date: '2026-01-01', count: 0 }, ..., { date: '2026-08-01', count: N } ]
 *    Zero-contribution days are explicitly included. Every date appears exactly once.
 *
 * 4. STATISTICS & HEATMAP SINGLE SOURCE OF TRUTH:
 *    Total contributions = sum(canonicalDataset.map(d => d.count)).
 *    `calendar` map is created directly from this canonical dataset.
 *    No third-party APIs, HTML scraping, or separate total computations are used.
 *
 * 5. TIMEZONE HANDLING:
 *    All date filtering and range building uses opaque YYYY-MM-DD calendar strings
 *    and UTC date math. No local `new Date(dateString)` conversions are used.
 */

import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { PROGRAMMING_CONFIG } from './config';
import type { FetchResult, GitHubData } from './types';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

export interface CanonicalContributionDay {
  date: string;
  count: number;
}

/**
 * Returns today's date as a YYYY-MM-DD string in UTC.
 */
function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Generates every YYYY-MM-DD string from `startDate` to `endDate` (inclusive)
 * using UTC arithmetic to eliminate DST and timezone shifts.
 */
function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const cur = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  while (cur <= end) {
    const y = cur.getUTCFullYear();
    const m = String(cur.getUTCMonth() + 1).padStart(2, '0');
    const d = String(cur.getUTCDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }

  return dates;
}

/**
 * Dev assertions for the canonical GitHub dataset.
 */
function validateCanonicalDataset(
  dataset: CanonicalContributionDay[],
  total: number,
  expectedStart: string,
  expectedEnd: string
): void {
  if (!dev) return;

  let valid = true;

  if (dataset.length === 0) {
    console.warn('[GitHub Validation FAIL] Canonical dataset is empty!');
    return;
  }

  const firstDate = dataset[0].date;
  const lastDate = dataset[dataset.length - 1].date;

  // 1. First displayed date == 2026-01-01
  if (firstDate !== expectedStart) {
    console.warn(`[GitHub Validation FAIL] First date is ${firstDate}, expected ${expectedStart}`);
    valid = false;
  }

  // 2. Last displayed date == today
  if (lastDate !== expectedEnd) {
    console.warn(`[GitHub Validation FAIL] Last date is ${lastDate}, expected ${expectedEnd}`);
    valid = false;
  }

  // 3. Every date appears exactly once (unique keys)
  const dateSet = new Set(dataset.map((d) => d.date));
  if (dateSet.size !== dataset.length) {
    console.warn(`[GitHub Validation FAIL] Duplicate dates detected! Unique: ${dateSet.size}, Total: ${dataset.length}`);
    valid = false;
  }

  // 4. No missing calendar days (contiguous check)
  for (let i = 1; i < dataset.length; i++) {
    const prev = dataset[i - 1].date;
    const curr = dataset[i].date;
    const expectedCurr = (() => {
      const d = new Date(`${prev}T00:00:00Z`);
      d.setUTCDate(d.getUTCDate() + 1);
      return d.toISOString().slice(0, 10);
    })();

    if (curr !== expectedCurr) {
      console.warn(`[GitHub Validation FAIL] Gap detected between ${prev} and ${curr} (expected ${expectedCurr})`);
      valid = false;
    }
  }

  // 5. Heatmap total == statistics total
  const sumCount = dataset.reduce((s, d) => s + d.count, 0);
  if (sumCount !== total) {
    console.warn(`[GitHub Validation FAIL] Sum of daily counts (${sumCount}) !== reported total (${total})`);
    valid = false;
  }

  if (valid) {
    console.log(
      `[GitHub Validation OK] Canonical dataset verified: ` +
      `range=${firstDate}→${lastDate}, total_days=${dataset.length}, total_contributions=${total}`
    );
  }
}

export async function fetchGitHubData(): Promise<FetchResult<GitHubData>> {
  const username = PROGRAMMING_CONFIG.github;
  const token = env.GITHUB_TOKEN;

  if (!token) {
    return {
      data: null,
      error: 'GITHUB_TOKEN is not set in environment. Please add GITHUB_TOKEN to .env.'
    };
  }

  const rangeStart = PROGRAMMING_CONFIG.calendarStart; // '2026-01-01'
  const rangeEnd = utcToday();                          // YYYY-MM-DD (today in UTC)

  const from = `${rangeStart}T00:00:00Z`;
  const to = `${rangeEnd}T23:59:59Z`;

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
        Authorization: `Bearer ${token}`,
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
        error: `GitHub GraphQL Error: ${json.errors[0]?.message ?? 'Unknown'}`
      };
    }

    if (!json?.data?.user) {
      return {
        data: null,
        error: `GitHub user "${username}" not found`
      };
    }

    const user = json.data.user;
    const repoCount: number = user.repositories?.totalCount ?? 0;
    const calendarData = user.contributionsCollection?.contributionCalendar;
    const weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }> =
      calendarData?.weeks ?? [];

    // ── 1. INSPECT GRAPHQL RESPONSE ──────────────────────────────────────────
    const allFetchedDays = weeks.flatMap((w) => w.contributionDays ?? []);
    if (dev) {
      console.log('[GitHub Pipeline Inspection]', {
        firstFetchedDate: allFetchedDays[0]?.date ?? 'none',
        lastFetchedDate: allFetchedDays[allFetchedDays.length - 1]?.date ?? 'none',
        numberOfWeeks: weeks.length,
        numberOfContributionDays: allFetchedDays.length,
        apiTotalContributions: calendarData?.totalContributions ?? 0
      });
    }

    // ── 2. FLATTEN & FILTER ──────────────────────────────────────────────────
    // Extract every day and filter strictly by 2026-01-01 <= date <= rangeEnd.
    // Discards all dates prior to Jan 1, 2026.
    const fetchedMap = new Map<string, number>();
    for (const day of allFetchedDays) {
      if (!day.date) continue;
      if (day.date >= rangeStart && day.date <= rangeEnd) {
        fetchedMap.set(day.date, day.contributionCount ?? 0);
      }
    }

    // ── 3. BUILD ONE CANONICAL DATASET ──────────────────────────────────────
    // Synthesize every day from rangeStart to rangeEnd so zero-contribution days exist
    // and every single date appears exactly once in strict ascending order.
    const dateRange = generateDateRange(rangeStart, rangeEnd);
    const canonicalDataset: CanonicalContributionDay[] = dateRange.map((date) => ({
      date,
      count: fetchedMap.get(date) ?? 0
    }));

    // ── 4. CANONICAL STATISTICS & CALENDAR DICT ──────────────────────────────
    // Total is calculated directly by summing canonicalDataset counts.
    const contributions2026 = canonicalDataset.reduce((sum, d) => sum + d.count, 0);

    // Build per-day record for merged calendar consumption
    const calendar: Record<string, number> = {};
    for (const day of canonicalDataset) {
      calendar[day.date] = day.count;
    }

    // ── 5. VALIDATION ────────────────────────────────────────────────────────
    validateCanonicalDataset(canonicalDataset, contributions2026, rangeStart, rangeEnd);

    return {
      data: {
        calendar,
        contributions2026,
        repoCount
      },
      error: null
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: `GitHub fetch failed: ${msg}` };
  }
}
