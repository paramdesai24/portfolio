/**
 * Codeforces data adapter — server-side only.
 *
 * Uses the official public Codeforces API (no auth required):
 *   - user.status  → accepted submissions per day (verdict === "OK")
 *   - Only counts verdict "OK" submissions; all others are ignored.
 *
 * Activity definition: a day is active if at least one submission
 * has verdict "OK" on that UTC day.
 *
 * Total solved = count of distinct (contestId, problem.index) pairs
 * with verdict "OK" across all time.
 */

import { PROGRAMMING_CONFIG } from './config';
import type { FetchResult, CodeforcesData } from './types';

const CF_BASE = 'https://codeforces.com/api';
const START_DATE = new Date(PROGRAMMING_CONFIG.calendarStart);

interface CfSubmission {
  id: number;
  creationTimeSeconds: number;
  verdict?: string;
  problem: {
    contestId?: number;
    index: string;
  };
}

/** Converts a Unix timestamp (seconds) to a YYYY-MM-DD UTC date string */
function unixToUTCDate(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function fetchCodeforcesData(): Promise<FetchResult<CodeforcesData>> {
  try {
    const handle = PROGRAMMING_CONFIG.codeforces;

    // Fetch all submissions for the user (public endpoint, no auth)
    const res = await fetch(`${CF_BASE}/user.status?handle=${handle}&from=1&count=10000`, {
      headers: { 'User-Agent': 'portfolio-app' }
    });

    if (!res.ok) {
      return {
        data: null,
        error: `Codeforces API error: ${res.status} ${res.statusText}`
      };
    }

    const json = await res.json();

    if (json.status !== 'OK') {
      return {
        data: null,
        error: `Codeforces API status: ${json.comment ?? json.status}`
      };
    }

    const submissions: CfSubmission[] = json.result ?? [];

    // Per-day accepted count (2026 range only)
    const calendar: Record<string, number> = {};
    // Total distinct accepted problems (all time)
    const solvedSet = new Set<string>();

    for (const sub of submissions) {
      if (sub.verdict !== 'OK') continue;

      // Distinct problem key for all-time dedup
      const problemKey = `${sub.problem.contestId ?? 'gym'}-${sub.problem.index}`;
      solvedSet.add(problemKey);

      // Calendar: only count 2026+ dates
      const dateStr = unixToUTCDate(sub.creationTimeSeconds);
      const d = new Date(dateStr + 'T00:00:00Z');
      if (d >= START_DATE) {
        calendar[dateStr] = (calendar[dateStr] ?? 0) + 1;
      }
    }

    return {
      data: {
        calendar,
        totalSolved: solvedSet.size
      },
      error: null
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: `Codeforces fetch failed: ${msg}` };
  }
}
