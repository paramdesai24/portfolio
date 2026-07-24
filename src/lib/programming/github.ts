/**
 * GitHub data adapter — server-side only.
 *
 * Uses the GitHub GraphQL API v4 with GITHUB_TOKEN (stored in .env, never
 * shipped to client). Fetches:
 *   - Contribution calendar (Jan 1 2026 → today UTC)
 *   - Public repository count
 *
 * GITHUB_TOKEN requires no scopes for public data — it is used only to
 * raise the rate limit from 60 to 5000 requests/hour.
 */

import { env } from '$env/dynamic/private';
import { PROGRAMMING_CONFIG } from './config';
import type { FetchResult, GitHubData } from './types';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

// Jan 1 2026 UTC
const START_DATE = new Date(PROGRAMMING_CONFIG.calendarStart);

/** Converts a YYYY-MM-DD or ISO string to YYYY-MM-DD (UTC) */
function toUTCDateString(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Fallback fetch using public REST APIs when GITHUB_TOKEN is not available or rate limited */
async function fetchGitHubDataPublic(username: string): Promise<FetchResult<GitHubData>> {
  try {
    const [userRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { 'User-Agent': 'portfolio-app', 'Cache-Control': 'no-cache, no-store' },
        cache: 'no-store'
      }),
      fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=2026`, {
        headers: { 'User-Agent': 'portfolio-app', 'Cache-Control': 'no-cache, no-store' },
        cache: 'no-store'
      })
    ]);

    let repoCount = 0;
    if (userRes.ok) {
      const userData = await userRes.json();
      repoCount = userData.public_repos ?? 0;
    }

    const calendar: Record<string, number> = {};
    let contributions2026 = 0;

    if (contribRes.ok) {
      const contribData = await contribRes.json();
      const contributionsList: Array<{ date: string; count: number }> = contribData.contributions ?? [];
      contributions2026 = contribData.total?.['2026'] ?? 0;

      for (const item of contributionsList) {
        const dateStr = item.date;
        const dayDate = new Date(dateStr + 'T00:00:00Z');
        if (dayDate >= START_DATE && item.count > 0) {
          calendar[dateStr] = item.count;
        }
      }
    }

    return {
      data: { calendar, contributions2026, repoCount },
      error: null
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: `Public GitHub fetch failed: ${msg}` };
  }
}

export async function fetchGitHubData(): Promise<FetchResult<GitHubData>> {
  const username = PROGRAMMING_CONFIG.github;
  const token = env.GITHUB_TOKEN || (typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined);

  if (!token) {
    // Seamless fallback to public endpoints so stats update live without token dependency
    return fetchGitHubDataPublic(username);
  }

  try {
    const today = new Date();
    const from = START_DATE.toISOString();
    const to = today.toISOString();

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
        'User-Agent': 'portfolio-app',
        'Cache-Control': 'no-cache, no-store'
      },
      cache: 'no-store',
      body: JSON.stringify({ query, variables: { username, from, to } })
    });

    if (!res.ok) {
      return fetchGitHubDataPublic(username);
    }

    const json = await res.json();
    if (json.errors || !json?.data?.user) {
      return fetchGitHubDataPublic(username);
    }

    const user = json.data.user;
    const repoCount: number = user.repositories?.totalCount ?? 0;
    const calendarData = user.contributionsCollection?.contributionCalendar;
    const contributions2026: number = calendarData?.totalContributions ?? 0;

    const calendar: Record<string, number> = {};
    const weeks = calendarData?.weeks ?? [];
    for (const week of weeks) {
      for (const day of week.contributionDays ?? []) {
        const dateStr = toUTCDateString(day.date);
        const dayDate = new Date(dateStr + 'T00:00:00Z');
        if (dayDate >= START_DATE && day.contributionCount > 0) {
          calendar[dateStr] = (calendar[dateStr] ?? 0) + day.contributionCount;
        }
      }
    }

    return {
      data: { calendar, contributions2026, repoCount },
      error: null
    };
  } catch {
    return fetchGitHubDataPublic(username);
  }
}
