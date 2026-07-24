/**
 * LeetCode data adapter — server-side only.
 *
 * ⚠️  RISK NOTICE: LeetCode has no official public API. This adapter uses
 * the community-discovered GraphQL endpoint at https://leetcode.com/graphql.
 * It may break without notice if LeetCode changes their schema or adds auth.
 * The adapter is fully isolated here — update only this file if it breaks.
 *
 * Fetches (no auth required for public profiles):
 *   - Total problems solved
 *   - Global ranking
 *   - Max streak (consecutive solving days)
 *   - Contest rating
 *   - Per-day accepted submission calendar
 */

import { PROGRAMMING_CONFIG } from './config';
import type { FetchResult, LeetCodeData } from './types';

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const START_DATE = new Date(PROGRAMMING_CONFIG.calendarStart);

/** Converts a Unix timestamp (seconds) to a YYYY-MM-DD UTC date string */
function unixToUTCDate(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function fetchLeetCodeData(): Promise<FetchResult<LeetCodeData>> {
  try {
    const username = PROGRAMMING_CONFIG.leetcode;

    // Single GraphQL call fetching both profile stats and submission calendar
    const query = `
      query getUserData($username: String!) {
        matchedUser(username: $username) {
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
          }
          userCalendar(year: 2026) {
            streak
            totalActiveDays
            submissionCalendar
          }
          contestBadge {
            name
          }
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
          totalParticipants
          topPercentage
        }
      }
    `;

    const res = await fetch(LEETCODE_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-app',
        'Cache-Control': 'no-cache, no-store',
        Referer: 'https://leetcode.com'
      },
      cache: 'no-store',
      body: JSON.stringify({ query, variables: { username } })
    });

    if (!res.ok) {
      return { data: null, error: `LeetCode API error: ${res.status} ${res.statusText}` };
    }

    const json = await res.json();

    if (json.errors) {
      return { data: null, error: `LeetCode GraphQL error: ${json.errors[0]?.message ?? 'unknown'}` };
    }

    const matchedUser = json?.data?.matchedUser;
    if (!matchedUser) {
      return { data: null, error: 'LeetCode user not found' };
    }

    // Total solved = accepted count across all difficulties
    const acStats: Array<{ difficulty: string; count: number }> =
      matchedUser.submitStatsGlobal?.acSubmissionNum ?? [];
    const totalSolved: number = acStats.find((s) => s.difficulty === 'All')?.count ?? 0;

    const globalRank: number = matchedUser.profile?.ranking ?? 0;

    // submissionCalendar is a JSON string: { "<unix_ts>": <submission_count> }
    const calendarRaw: string = matchedUser.userCalendar?.submissionCalendar ?? '{}';
    let calendarParsed: Record<string, number> = {};
    try {
      calendarParsed = JSON.parse(calendarRaw);
    } catch {
      calendarParsed = {};
    }

    // Convert Unix timestamps → UTC date strings, filter to >= Jan 1 2026
    const calendar: Record<string, number> = {};
    for (const [tsStr, count] of Object.entries(calendarParsed)) {
      const ts = Number(tsStr);
      const dateStr = unixToUTCDate(ts);
      const d = new Date(dateStr + 'T00:00:00Z');
      if (d >= START_DATE && count > 0) {
        calendar[dateStr] = (calendar[dateStr] ?? 0) + count;
      }
    }

    // maxStreak from userCalendar (LeetCode computes this)
    const maxStreak: number = matchedUser.userCalendar?.streak ?? 0;

    // Contest info
    const contestRankingData = json?.data?.userContestRanking;
    const contestRating: number = Math.round(contestRankingData?.rating ?? 0);
    const contestGlobalRanking: number = contestRankingData?.globalRanking ?? 0;
    const contestTopPercentage: number = contestRankingData?.topPercentage ?? 0;

    return {
      data: {
        calendar,
        totalSolved,
        globalRank,
        maxStreak,
        contestRating,
        contestTopPercentage: contestTopPercentage > 0 ? contestTopPercentage : undefined,
        contestGlobalRanking: contestGlobalRanking > 0 ? contestGlobalRanking : undefined
      },
      error: null
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: `LeetCode fetch failed: ${msg}` };
  }
}
