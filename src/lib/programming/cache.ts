/**
 * Module-level in-memory cache for the programming page.
 * Works in any SvelteKit adapter (no ISR/edge KV required).
 *
 * Supports per-call TTL overrides so different platforms can have
 * different freshness windows (e.g. GitHub = 30 min, LC/CF = 15 sec).
 */

import { REVALIDATE_SECONDS } from './config';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Returns cached data if still valid; otherwise calls `fetcher`, stores
 * the result, and returns it. Failed fetches (where `data` is null) are
 * NOT cached — the next request will retry immediately.
 *
 * @param key          - Unique cache key
 * @param fetcher      - Async function that produces the data
 * @param forceRefresh - Skip cache lookup and force a live fetch
 * @param ttlSeconds   - Custom TTL; defaults to REVALIDATE_SECONDS
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh: boolean = false,
  ttlSeconds: number = REVALIDATE_SECONDS
): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key) as CacheEntry<T> | undefined;

  if (!forceRefresh && entry && entry.expiresAt > now) {
    return entry.data;
  }

  const data = await fetcher();

  // Only cache successful results.
  // A result is considered successful if it has no top-level truthy `error` field.
  const hasError =
    data !== null &&
    typeof data === 'object' &&
    'error' in (data as object) &&
    Boolean((data as Record<string, unknown>).error);

  if (!hasError) {
    cache.set(key, { data, expiresAt: now + ttlSeconds * 1000 });
  }

  return data;
}
