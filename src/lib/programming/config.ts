/**
 * Central configuration for the Programming page.
 * All usernames and constants live here — change once, applies everywhere.
 */

export const PROGRAMMING_CONFIG = {
  github: 'paramdesai24',
  leetcode: 'paramdesai7',
  codeforces: 'Perom_7',

  /**
   * Calendar start date — inclusive lower bound of the tracked date range.
   * Format: YYYY-MM-DD (plain calendar date, no timezone suffix).
   * Used as a string for direct lexicographic date comparison — never parsed
   * through new Date() inside the data pipeline.
   */
  calendarStart: '2026-01-01',

  /** External profile links */
  links: {
    github: 'https://github.com/paramdesai24',
    leetcode: 'https://leetcode.com/u/paramdesai7/',
    codeforces: 'https://codeforces.com/profile/Perom_7'
  }
} as const;

/**
 * Cache TTL for LeetCode and Codeforces adapters.
 * These use public endpoints without strict rate limits.
 */
export const REVALIDATE_SECONDS = 15;

/**
 * Cache TTL for the GitHub GraphQL adapter.
 * GitHub GraphQL is rate-limited to 5,000 points/hour per token.
 * 30 minutes is a safe default that keeps data reasonably fresh.
 */
export const GITHUB_CACHE_SECONDS = 1800;
