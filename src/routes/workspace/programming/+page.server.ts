/**
 * Server-side load function for the Programming page.
 *
 * All external API calls happen here — tokens never touch the client.
 * The three platforms (GitHub, LeetCode, Codeforces) are fetched in parallel.
 * Each platform is independently failable: if one fails, the page still
 * renders correctly with data from the other two.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH INVARIANT
 * ─────────────────────────────────────────────────────────────────────────────
 * After fetching all platforms, a merged calendar array is built:
 *
 *   CalendarDay[]  →  { date, github, leetcode, codeforces, total }
 *
 * This array covers every day from calendarStart → today (inclusive).
 * Zero-contribution days exist with all counts set to 0.
 *
 * The GitHub stat card value is:
 *
 *   githubTotal = sum of calendar[i].github for all i
 *
 * This is IDENTICAL to what the heatmap renders — they share the same array.
 * There is no separate GitHub total computation anywhere in the codebase.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TIMEZONE HANDLING
 * ─────────────────────────────────────────────────────────────────────────────
 * Date generation uses UTC methods exclusively (getUTCFullYear, getUTCMonth,
 * getUTCDate, setUTCDate) to avoid local-timezone shifts.
 *
 * `todayUTC()` produces the UTC date string (YYYY-MM-DD) at call time.
 * The calendar always ends on the current UTC date — never yesterday, never
 * a day ahead.
 */

import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { getCached } from '$lib/programming/cache';
import { fetchGitHubData } from '$lib/programming/github';
import { fetchLeetCodeData } from '$lib/programming/leetcode';
import { fetchCodeforcesData } from '$lib/programming/codeforces';
import { PROGRAMMING_CONFIG, GITHUB_CACHE_SECONDS } from '$lib/programming/config';
import type { CalendarDay, StatCard, ProgrammingPageData } from '$lib/programming/types';

// ─── Date helpers ────────────────────────────────────────────────────────────

/** Returns today's date as YYYY-MM-DD in UTC, computed fresh each call. */
function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Generates every YYYY-MM-DD string from `startDate` through `endDate`
 * (both inclusive). Uses UTC arithmetic to avoid DST / local-timezone shifts.
 *
 * @param startDate - YYYY-MM-DD string (e.g. '2026-01-01')
 * @param endDate   - YYYY-MM-DD string (e.g. '2026-08-01')
 */
function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];

  // Parse as explicit UTC midnight to avoid timezone interpretation
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

// ─── Dev-only page-level validation ─────────────────────────────────────────

function devValidatePage(
  calendar: CalendarDay[],
  githubTotal: number,
  statCardTotal: number
): void {
  if (!dev) return;

  // 1. Heatmap total must equal stat card total (they derive from the same array)
  if (githubTotal !== statCardTotal) {
    console.warn(
      `[page] VALIDATION FAIL: heatmap GitHub total (${githubTotal}) ` +
      `!== stat card total (${statCardTotal})`
    );
  } else {
    console.log(`[page] GitHub total validated: ${githubTotal}`);
  }

  // 2. No missing dates — calendar must be contiguous
  for (let i = 1; i < calendar.length; i++) {
    const prev = calendar[i - 1].date;
    const curr = calendar[i].date;
    // Quick contiguity check: adjacent strings should differ by 1 day.
    // We verify by comparing computed next-day string.
    const expectedNext = (() => {
      const d = new Date(`${prev}T00:00:00Z`);
      d.setUTCDate(d.getUTCDate() + 1);
      return d.toISOString().slice(0, 10);
    })();
    if (curr !== expectedNext) {
      console.warn(`[page] VALIDATION FAIL: gap in calendar between ${prev} and ${curr} (expected ${expectedNext})`);
    }
  }

  // 3. Range bounds
  const first = calendar[0]?.date;
  const last  = calendar[calendar.length - 1]?.date;
  const today = utcToday();

  if (first !== PROGRAMMING_CONFIG.calendarStart) {
    console.warn(`[page] VALIDATION FAIL: calendar starts at ${first}, expected ${PROGRAMMING_CONFIG.calendarStart}`);
  }
  if (last !== today) {
    console.warn(`[page] VALIDATION FAIL: calendar ends at ${last}, expected today=${today}`);
  }

  console.log(
    `[page] calendar: ${calendar.length} days, ${first}→${last}, githubTotal=${githubTotal}`
  );
}

// ─── Main loader ─────────────────────────────────────────────────────────────

async function loadProgrammingData(forceRefresh: boolean): Promise<ProgrammingPageData> {
  // Fetch all three platforms in parallel, each independently failable.
  // GitHub uses a 30-minute cache; LeetCode and Codeforces use 15 seconds.
  const [ghResult, lcResult, cfResult] = await Promise.allSettled([
    getCached('github',     fetchGitHubData,     forceRefresh, GITHUB_CACHE_SECONDS),
    getCached('leetcode',   fetchLeetCodeData,   forceRefresh),
    getCached('codeforces', fetchCodeforcesData, forceRefresh)
  ]);

  const gh = ghResult.status === 'fulfilled' ? ghResult.value : { data: null, error: 'GitHub fetch threw' };
  const lc = lcResult.status === 'fulfilled' ? lcResult.value : { data: null, error: 'LeetCode fetch threw' };
  const cf = cfResult.status === 'fulfilled' ? cfResult.value : { data: null, error: 'Codeforces fetch threw' };

  const errors = {
    github:     gh.error,
    leetcode:   lc.error,
    codeforces: cf.error
  };

  // ── Build merged calendar ──────────────────────────────────────────────────
  //
  // One CalendarDay entry for every calendar day from calendarStart → today.
  // Zero-contribution days are included with all counts = 0.
  // The order is strictly ascending by date.
  //
  const today    = utcToday();
  const allDates = generateDateRange(PROGRAMMING_CONFIG.calendarStart, today);

  const calendar: CalendarDay[] = allDates.map((date) => {
    const github    = gh.data?.calendar[date] ?? 0;
    const leetcode  = lc.data?.calendar[date] ?? 0;
    const codeforces = cf.data?.calendar[date] ?? 0;
    return { date, github, leetcode, codeforces, total: github + leetcode + codeforces };
  });

  // ── Canonical GitHub total ─────────────────────────────────────────────────
  //
  // Computed by summing the github column of the SAME array the heatmap uses.
  // This is the only place the total is computed — it is used directly in
  // the stat card. There is no other GitHub total anywhere in the codebase.
  //
  const githubTotal = calendar.reduce((s, d) => s + d.github, 0);

  // ── Stat cards ─────────────────────────────────────────────────────────────

  // 1. Problems Solved (LeetCode + Codeforces combined)
  const card1: StatCard = (() => {
    if (!lc.data && !cf.data) {
      return {
        id: 'problems-solved',
        label: 'Problems Solved',
        value: '—',
        subLabel: 'LeetCode + Codeforces',
        error: 'Data unavailable'
      };
    }
    const lcSolved = lc.data?.totalSolved ?? 0;
    const cfSolved = cf.data?.totalSolved ?? 0;
    return {
      id: 'problems-solved',
      label: 'Problems Solved',
      value: String(lcSolved + cfSolved),
      subLabel: `${lcSolved} LeetCode · ${cfSolved} Codeforces`,
      error: null
    };
  })();

  // 2. GitHub Contributions
  // Value = githubTotal, which is sum(calendar[i].github) — same data as heatmap.
  const card2: StatCard = (() => {
    if (!gh.data) {
      return {
        id: 'github-contributions',
        label: 'GitHub Contributions',
        value: '—',
        subLabel: `${PROGRAMMING_CONFIG.calendarStart} → today`,
        error: gh.error
      };
    }
    return {
      id: 'github-contributions',
      label: 'GitHub Contributions',
      value: String(githubTotal),
      subLabel: `Jan ${new Date(`${PROGRAMMING_CONFIG.calendarStart}T00:00:00Z`).getUTCFullYear()} → today`,
      error: null
    };
  })();

  // 3. GitHub Repositories
  const card3: StatCard = (() => {
    if (!gh.data) {
      return {
        id: 'github-repos',
        label: 'GitHub Repositories',
        value: '—',
        subLabel: 'Public repositories',
        error: gh.error
      };
    }
    return {
      id: 'github-repos',
      label: 'GitHub Repositories',
      value: String(gh.data.repoCount),
      subLabel: 'Public repositories',
      error: null
    };
  })();

  // 4. LeetCode Contest Rank
  const card4: StatCard = (() => {
    if (!lc.data) {
      return {
        id: 'leetcode-rank',
        label: 'LeetCode Contest Rank',
        value: '—',
        subLabel: 'Contest percentile rank',
        error: lc.error
      };
    }
    const topPct = lc.data.contestTopPercentage;
    const contestRank = lc.data.contestGlobalRanking;
    let valueStr = '—';
    if (topPct && topPct > 0) {
      valueStr = `Top ${topPct % 1 === 0 ? topPct : topPct.toFixed(1)}%`;
    } else if (lc.data.globalRank > 0) {
      valueStr = `#${lc.data.globalRank.toLocaleString()}`;
    }
    const subLabelStr =
      contestRank && contestRank > 0
        ? `#${contestRank.toLocaleString()} in global contests`
        : 'Contest percentile rank';
    return {
      id: 'leetcode-rank',
      label: 'LeetCode Contest Rank',
      value: valueStr,
      subLabel: subLabelStr,
      error: null
    };
  })();

  // 5. LeetCode Max Streak
  const card5: StatCard = (() => {
    if (!lc.data) {
      return {
        id: 'leetcode-streak',
        label: 'Max Solving Streak',
        value: '—',
        subLabel: 'Consecutive problem solving days',
        error: lc.error
      };
    }
    return {
      id: 'leetcode-streak',
      label: 'Max Solving Streak',
      value: `${lc.data.maxStreak}d`,
      subLabel: 'Consecutive problem solving days',
      error: null
    };
  })();

  // 6. LeetCode Contest Rating
  const card6: StatCard = (() => {
    if (!lc.data) {
      return {
        id: 'leetcode-rating',
        label: 'Contest Rating',
        value: '—',
        subLabel: 'LeetCode contest rating',
        error: lc.error
      };
    }
    const rating = lc.data.contestRating;
    return {
      id: 'leetcode-rating',
      label: 'Contest Rating',
      value: rating > 0 ? String(rating) : '—',
      subLabel: 'LeetCode contest rating',
      error: null
    };
  })();

  // ── Validate (dev only) ────────────────────────────────────────────────────
  devValidatePage(calendar, githubTotal, githubTotal); // same value by construction

  return {
    calendar,
    stats: [card1, card2, card3, card4, card5, card6],
    lastUpdated: new Date().toISOString(),
    errors
  };
}

export const load: PageServerLoad = async ({ url }) => {
  const forceRefresh = url.searchParams.has('refresh');
  return loadProgrammingData(forceRefresh);
};
