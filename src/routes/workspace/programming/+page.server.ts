/**
 * Server-side load function for the Programming page.
 *
 * All external API calls happen here — GITHUB_TOKEN never touches the client.
 * The three platforms are fetched in parallel. Each has independent error
 * handling: if one fails, the page still renders with the other two.
 *
 * Data is cached for REVALIDATE_SECONDS (12h) using the module-level cache.
 */

import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { getCached } from '$lib/programming/cache';
import { fetchGitHubData } from '$lib/programming/github';
import { fetchLeetCodeData } from '$lib/programming/leetcode';
import { fetchCodeforcesData } from '$lib/programming/codeforces';
import { PROGRAMMING_CONFIG } from '$lib/programming/config';
import type { CalendarDay, StatCard, ProgrammingPageData } from '$lib/programming/types';

const CALENDAR_START = new Date(PROGRAMMING_CONFIG.calendarStart);

/** Generates all YYYY-MM-DD UTC dates from start to today (inclusive) */
function generateDateRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  cur.setUTCHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setUTCHours(0, 0, 0, 0);

  while (cur <= endDay) {
    const y = cur.getUTCFullYear();
    const m = String(cur.getUTCMonth() + 1).padStart(2, '0');
    const d = String(cur.getUTCDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

async function loadProgrammingData(forceRefresh: boolean = false): Promise<ProgrammingPageData> {
  // Fetch all three platforms in parallel — each independently failable
  const [ghResult, lcResult, cfResult] = await Promise.allSettled([
    getCached('github', fetchGitHubData, forceRefresh),
    getCached('leetcode', fetchLeetCodeData, forceRefresh),
    getCached('codeforces', fetchCodeforcesData, forceRefresh)
  ]);

  const gh = ghResult.status === 'fulfilled' ? ghResult.value : { data: null, error: 'GitHub fetch threw an exception' };
  const lc = lcResult.status === 'fulfilled' ? lcResult.value : { data: null, error: 'LeetCode fetch threw an exception' };
  const cf = cfResult.status === 'fulfilled' ? cfResult.value : { data: null, error: 'Codeforces fetch threw an exception' };

  const errors = {
    github: gh.error,
    leetcode: lc.error,
    codeforces: cf.error
  };

  // Build merged calendar: one entry per day from Jan 1 2026 → today
  const today = new Date();
  const allDates = generateDateRange(CALENDAR_START, today);

  const calendar: CalendarDay[] = allDates.map((date) => {
    const github = gh.data?.calendar[date] ?? 0;
    const leetcode = lc.data?.calendar[date] ?? 0;
    const codeforces = cf.data?.calendar[date] ?? 0;
    return { date, github, leetcode, codeforces, total: github + leetcode + codeforces };
  });

  // CANONICAL GitHub total: sum the github column of the heatmap.
  // This is the single source of truth used by BOTH the stat card and the heatmap,
  // so they are guaranteed to match.
  const githubHeatmapTotal = calendar.reduce((s, d) => s + d.github, 0);

  // Dev-mode validation: warn if the value from the GitHub fetcher differs from
  // the heatmap sum. These should always be equal after the github.ts fix.
  if (dev && gh.data) {
    if (githubHeatmapTotal !== gh.data.contributions2026) {
      console.warn(
        `[GitHub validation FAILED] ` +
        `stat card total (${gh.data.contributions2026}) !== ` +
        `heatmap sum (${githubHeatmapTotal}). ` +
        `Using heatmap sum as the displayed value.`
      );
    } else {
      console.log(
        `[GitHub validation OK] total=${githubHeatmapTotal} matches heatmap sum.`
      );
    }
    // Server-side range/day debug log
    const activeDays = calendar.filter((d) => d.github > 0);
    const rangeStart = allDates[0] ?? 'none';
    const rangeEnd = allDates[allDates.length - 1] ?? 'none';
    const firstActive = activeDays[0]?.date ?? 'none';
    const lastActive = activeDays[activeDays.length - 1]?.date ?? 'none';
    console.log(
      `[GitHub/page] range=${rangeStart}→${rangeEnd}` +
      ` | total_days=${allDates.length}` +
      ` | github_total=${githubHeatmapTotal}` +
      ` | first_active=${firstActive}` +
      ` | last_active=${lastActive}`
    );
  }

  // ── Stat cards — exactly 6 ──────────────────────────────────────────────

  // 1. Competitive Programming Problems Solved (LeetCode + Codeforces combined)
  const card1: StatCard = (() => {
    if (!lc.data && !cf.data) {
      return { id: 'problems-solved', label: 'Problems Solved', value: '—', subLabel: 'LeetCode + Codeforces', error: 'Data unavailable' };
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

  // 2. GitHub Contributions (Jan 2026 → today)
  // Value is derived from githubHeatmapTotal, which is the sum of the github
  // column in the rendered calendar — identical to what the heatmap shows.
  const card2: StatCard = (() => {
    if (!gh.data) {
      return { id: 'github-contributions', label: 'GitHub Contributions', value: '—', subLabel: '2026 · Jan → today', error: gh.error };
    }
    return {
      id: 'github-contributions',
      label: 'GitHub Contributions',
      value: String(githubHeatmapTotal),
      subLabel: '2026 · Jan → today',
      error: null
    };
  })();

  // 3. GitHub Repositories (current public count)
  const card3: StatCard = (() => {
    if (!gh.data) {
      return { id: 'github-repos', label: 'GitHub Repositories', value: '—', subLabel: 'Public repositories', error: gh.error };
    }
    return {
      id: 'github-repos',
      label: 'GitHub Repositories',
      value: String(gh.data.repoCount),
      subLabel: 'Public repositories',
      error: null
    };
  })();

  // 4. LeetCode Contest Global Rank (Percentile)
  const card4: StatCard = (() => {
    if (!lc.data) {
      return { id: 'leetcode-rank', label: 'LeetCode Contest Rank', value: '—', subLabel: 'Contest percentile rank', error: lc.error };
    }
    const topPct = lc.data.contestTopPercentage;
    const contestRank = lc.data.contestGlobalRanking;

    let valueStr = '—';
    if (topPct && topPct > 0) {
      valueStr = `Top ${topPct % 1 === 0 ? topPct : topPct.toFixed(1)}%`;
    } else if (lc.data.globalRank > 0) {
      valueStr = `#${lc.data.globalRank.toLocaleString()}`;
    }

    const subLabelStr = contestRank && contestRank > 0
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

  // 5. LeetCode Maximum Streak
  const card5: StatCard = (() => {
    if (!lc.data) {
      return { id: 'leetcode-streak', label: 'Max Solving Streak', value: '—', subLabel: 'Consecutive problem solving days', error: lc.error };
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
      return { id: 'leetcode-rating', label: 'Contest Rating', value: '—', subLabel: 'LeetCode contests', error: lc.error };
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

  return {
    calendar,
    stats: [card1, card2, card3, card4, card5, card6],
    lastUpdated: new Date().toISOString(),
    errors
  };
}

export const load: PageServerLoad = async ({ url }) => {
  const forceRefresh = url.searchParams.has('refresh');
  const data = await getCached('programming-page', () => loadProgrammingData(forceRefresh), forceRefresh);
  return data;
};
