/**
 * Central configuration for the Programming page.
 * All usernames and constants live here — change once, applies everywhere.
 */

export const PROGRAMMING_CONFIG = {
  github: 'paramdesai24',
  leetcode: 'paramdesai7',
  codeforces: 'Perom_7',

  /** Calendar date range start — Jan 1 2026, UTC midnight */
  calendarStart: '2026-01-01T00:00:00Z',

  /** External profile links */
  links: {
    github: 'https://github.com/paramdesai24',
    leetcode: 'https://leetcode.com/u/paramdesai7/',
    codeforces: 'https://codeforces.com/profile/Perom_7'
  }
} as const;

/** Cache TTL in seconds (12 hours). Named constant, never hardcoded inline. */
export const REVALIDATE_SECONDS = 12 * 60 * 60;
