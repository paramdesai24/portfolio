/**
 * GitHub data adapter — server-side only.
 *
 * Uses GitHub GraphQL API v4 with GITHUB_TOKEN if available, and seamlessly
 * falls back to fetching live HTML directly from github.com/users/<username>/contributions.
 *
 * This ensures GitHub contribution activity updates LIVE in real-time on every load.
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

/**
 * Direct fetch from official github.com/users/<username>/contributions HTML page.
 * Bypasses 3rd party APIs and reflects live commits instantly without token requirement.
 */
async function fetchGitHubDataDirect(username: string): Promise<FetchResult<GitHubData>> {
  try {
    const [userRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'User-Agent': 'portfolio-app',
          'Cache-Control': 'no-cache, no-store, max-age=0'
        },
        cache: 'no-store'
      }),
      fetch(`https://github.com/users/${username}/contributions`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Cache-Control': 'no-cache, no-store, max-age=0'
        },
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
      const html = await contribRes.text();

      // GitHub HTML contribution cells pattern:
      // Pattern A: <tool-tip ...>N contribution(s) on Month DD, YYYY</tool-tip>
      // Pattern B: <td ... data-date="YYYY-MM-DD" ...> ... N contribution(s) ...
      const toolTipRegex = /(\d+)\s+contribution[s]?\s+on\s+([A-Za-z]+\s+\d+,\s+\d{4})/gi;
      let tipMatch: RegExpExecArray | null;

      while ((tipMatch = toolTipRegex.exec(html)) !== null) {
        const count = parseInt(tipMatch[1], 10);
        const dateParsed = new Date(tipMatch[2] + ' UTC');

        if (!isNaN(dateParsed.getTime()) && dateParsed >= START_DATE && count > 0) {
          const dateStr = toUTCDateString(dateParsed.toISOString());
          calendar[dateStr] = (calendar[dateStr] ?? 0) + count;
          contributions2026 += count;
        }
      }

      // Fallback regex matching td data-date & data-level / tooltips if toolTipRegex yielded no results
      if (Object.keys(calendar).length === 0) {
        const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*>([\s\S]*?)<\/td>/gi;
        let cellMatch: RegExpExecArray | null;
        while ((cellMatch = cellRegex.exec(html)) !== null) {
          const dateStr = cellMatch[1];
          const inner = cellMatch[2];
          const cntMatch = inner.match(/(\d+)\s+contribution/i);
          const count = cntMatch ? parseInt(cntMatch[1], 10) : 0;

          const dayDate = new Date(dateStr + 'T00:00:00Z');
          if (dayDate >= START_DATE && count > 0) {
            calendar[dateStr] = count;
            contributions2026 += count;
          }
        }
      }
    }

    return {
      data: { calendar, contributions2026, repoCount },
      error: null
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: `Direct GitHub fetch failed: ${msg}` };
  }
}

export async function fetchGitHubData(): Promise<FetchResult<GitHubData>> {
  const username = PROGRAMMING_CONFIG.github;
  const token = env.GITHUB_TOKEN || (typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined);

  if (!token) {
    return fetchGitHubDataDirect(username);
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
        'Cache-Control': 'no-cache, no-store, max-age=0'
      },
      cache: 'no-store',
      body: JSON.stringify({ query, variables: { username, from, to } })
    });

    if (!res.ok) {
      return fetchGitHubDataDirect(username);
    }

    const json = await res.json();
    if (json.errors || !json?.data?.user) {
      return fetchGitHubDataDirect(username);
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
    return fetchGitHubDataDirect(username);
  }
}
