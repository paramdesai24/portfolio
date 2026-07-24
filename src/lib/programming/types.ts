/**
 * TypeScript types for the Programming page data layer.
 */

/** Per-day activity counts from each platform */
export interface PlatformCounts {
  github: number;
  leetcode: number;
  codeforces: number;
}

/** A single calendar day entry for the heatmap */
export interface CalendarDay {
  /** ISO date string YYYY-MM-DD (UTC) */
  date: string;
  github: number;
  leetcode: number;
  codeforces: number;
  /** Sum of all three platforms */
  total: number;
}

/** Result wrapper allowing partial failures — each platform is independently failable */
export interface FetchResult<T> {
  data: T | null;
  error: string | null;
}

/** GitHub-specific stats */
export interface GitHubData {
  /** Per-day contribution counts Jan 1 2026 → today */
  calendar: Record<string, number>;
  /** Total GitHub contributions in 2026 */
  contributions2026: number;
  /** Current public repository count */
  repoCount: number;
}

/** LeetCode-specific stats */
export interface LeetCodeData {
  /** Per-day accepted submission counts */
  calendar: Record<string, number>;
  /** Total problems solved (all time, all difficulties) */
  totalSolved: number;
  /** Current global ranking */
  globalRank: number;
  /** Max consecutive-day solving streak */
  maxStreak: number;
  /** Current contest rating */
  contestRating: number;
}

/** Codeforces-specific stats */
export interface CodeforcesData {
  /** Per-day accepted submission counts (verdict OK, UTC) */
  calendar: Record<string, number>;
  /** Total distinct accepted problems solved */
  totalSolved: number;
}

/** The 6 stat cards — exactly 6, no more, no less */
export interface StatCard {
  id: string;
  label: string;
  value: string;
  subLabel: string;
  /** null = data loaded fine; string = error/unavailable message */
  error: string | null;
}

/** Full payload returned by the server load function */
export interface ProgrammingPageData {
  /** Merged heatmap data, one entry per calendar day */
  calendar: CalendarDay[];
  /** Exactly 6 stat cards */
  stats: StatCard[];
  /** ISO timestamp of when data was fetched/cached */
  lastUpdated: string;
  /** Per-platform error messages (null = success) */
  errors: {
    github: string | null;
    leetcode: string | null;
    codeforces: string | null;
  };
}
