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

async function loadProgrammingData(): Promise<ProgrammingPageData> {
  // Fetch all three platforms in parallel — each independently failable
  const [ghResult, lcResult, cfResult] = await Promise.allSettled([
    getCached('github', fetchGitHubData),
    getCached('leetcode', fetchLeetCodeData),
    getCached('codeforces', fetchCodeforcesData)
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

  // 2. GitHub Contributions (2026 only)
  const card2: StatCard = (() => {
    if (!gh.data) {
      return { id: 'github-contributions', label: 'GitHub Contributions', value: '—', subLabel: '2026 · Jan → today', error: gh.error };
    }
    return {
      id: 'github-contributions',
      label: 'GitHub Contributions',
      value: String(gh.data.contributions2026),
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

  // 4. LeetCode Global Rank
  const card4: StatCard = (() => {
    if (!lc.data) {
      return { id: 'leetcode-rank', label: 'LeetCode Global Rank', value: '—', subLabel: 'Current ranking', error: lc.error };
    }
    const rank = lc.data.globalRank;
    return {
      id: 'leetcode-rank',
      label: 'LeetCode Global Rank',
      value: rank > 0 ? `#${rank.toLocaleString()}` : '—',
      subLabel: 'Current global ranking',
      error: null
    };
  })();

  // 5. LeetCode Maximum Streak
  const card5: StatCard = (() => {
    if (!lc.data) {
      return { id: 'leetcode-streak', label: 'Max Solving Streak', value: '—', subLabel: 'Consecutive days', error: lc.error };
    }
    return {
      id: 'leetcode-streak',
      label: 'Max Solving Streak',
      value: `${lc.data.maxStreak}d`,
      subLabel: 'Consecutive days with ≥1 accepted',
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

export const load: PageServerLoad = async () => {
  // Use cache wrapper — data is refreshed at most every REVALIDATE_SECONDS
  const data = await getCached('programming-page', loadProgrammingData);
  return data;
};
