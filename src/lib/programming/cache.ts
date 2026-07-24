/**
 * Module-level in-memory cache for the programming page.
 * Works in any SvelteKit adapter (no ISR/edge KV required).
 *
 * Uses REVALIDATE_SECONDS as the single named TTL constant.
 */

import { REVALIDATE_SECONDS } from './config';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Returns cached data if still valid, otherwise calls `fetcher`, caches
 * the result (if successful), and returns it. Each cache key is independently cached.
 */
export async function getCached<T extends { error?: string | null }>(
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh: boolean = false
): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key) as CacheEntry<T> | undefined;

  if (!forceRefresh && entry && entry.expiresAt > now) {
    return entry.data;
  }

  const data = await fetcher();
  // Only cache if the request succeeded without error
  if (!data.error) {
    cache.set(key, {
      data,
      expiresAt: now + REVALIDATE_SECONDS * 1000
    });
  }
  return data;
}
