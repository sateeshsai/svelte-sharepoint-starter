/**
 * IndexedDB Cache with Dexie
 *
 * Provides persistent caching with stale-while-revalidate pattern.
 * Use for large datasets (like Stories) that benefit from offline-first loading.
 *
 * @example
 * ```typescript
 * const result = await getCachedOrFetch({
 *   cacheKey: "stories-list",
 *   fetchFn: () => getStoriesFromAPI(),
 *   maxAge: 60 * 60 * 1000, // 1 hour
 *   onStale: () => loadState.setStale(),
 *   onFresh: () => loadState.setReady(),
 * });
 * ```
 */

import Dexie, { type EntityTable } from "dexie";

interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
  listName?: string; // For invalidation by list
}

// Dexie database for cache
class CacheDatabase extends Dexie {
  cache!: EntityTable<CacheEntry, "key">;

  constructor() {
    super("AppCache");
    this.version(1).stores({
      cache: "key, listName, timestamp",
    });
  }
}

const db = new CacheDatabase();

export interface GetCachedOrFetchOptions<T> {
  /** Unique cache key */
  cacheKey: string;
  /** Function to fetch fresh data */
  fetchFn: () => Promise<T | undefined>;
  /** Max age in milliseconds before data is considered stale (default: 1 hour) */
  maxAge?: number;
  /** Optional list name for bulk invalidation */
  listName?: string;
  /** Called when returning stale data while fetching fresh */
  onStale?: () => void;
  /** Called when fresh data is available */
  onFresh?: () => void;
  /** If true, skip cache entirely (useful for polling) */
  skipCache?: boolean;
}

export interface CachedResult<T> {
  data: T | undefined;
  fromCache: boolean;
  stale: boolean;
}

const DEFAULT_MAX_AGE = 60 * 60 * 1000; // 1 hour

/**
 * Get cached data or fetch fresh, with stale-while-revalidate pattern
 *
 * Behavior:
 * 1. If cache exists and not expired → return cached data
 * 2. If cache exists but expired → return stale data immediately, fetch fresh in background
 * 3. If no cache → fetch fresh, cache result
 *
 * @returns Object with data, fromCache flag, and stale flag
 */
export async function getCachedOrFetch<T>(options: GetCachedOrFetchOptions<T>): Promise<CachedResult<T>> {
  const { cacheKey, fetchFn, maxAge = DEFAULT_MAX_AGE, listName, onStale, onFresh, skipCache = false } = options;

  // Skip cache entirely if requested
  if (skipCache) {
    const freshData = await fetchFn();
    if (freshData !== undefined) {
      await setCacheEntry(cacheKey, freshData, listName);
    }
    onFresh?.();
    return { data: freshData, fromCache: false, stale: false };
  }

  // Try to get cached data
  const cached = await getCacheEntry<T>(cacheKey);
  const now = Date.now();

  if (cached) {
    const age = now - cached.timestamp;
    const isExpired = age > maxAge;

    if (!isExpired) {
      // Fresh cache - return immediately
      onFresh?.();
      return { data: cached.data, fromCache: true, stale: false };
    }

    // Stale cache - return immediately, fetch in background
    onStale?.();

    // Background fetch and update
    fetchFn().then(async (freshData) => {
      if (freshData !== undefined) {
        await setCacheEntry(cacheKey, freshData, listName);
        onFresh?.();
      }
    });

    return { data: cached.data, fromCache: true, stale: true };
  }

  // No cache - fetch and cache
  const freshData = await fetchFn();
  if (freshData !== undefined) {
    await setCacheEntry(cacheKey, freshData, listName);
  }
  onFresh?.();
  return { data: freshData, fromCache: false, stale: false };
}

/**
 * Get a single cache entry
 */
async function getCacheEntry<T>(key: string): Promise<CacheEntry<T> | undefined> {
  try {
    return (await db.cache.get(key)) as CacheEntry<T> | undefined;
  } catch (error) {
    console.warn("[DexieCache] Failed to get cache entry:", error);
    return undefined;
  }
}

/**
 * Set a cache entry
 */
async function setCacheEntry<T>(key: string, data: T, listName?: string): Promise<void> {
  try {
    await db.cache.put({
      key,
      data,
      timestamp: Date.now(),
      listName,
    });
  } catch (error) {
    console.warn("[DexieCache] Failed to set cache entry:", error);
  }
}

/**
 * Invalidate cache for a specific key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await db.cache.delete(key);
  } catch (error) {
    console.warn("[DexieCache] Failed to invalidate cache:", error);
  }
}

/**
 * Invalidate all cache entries for a specific list
 * Call after POST/UPDATE/DELETE operations
 */
export async function invalidateCacheByList(listName: string): Promise<void> {
  try {
    await db.cache.where("listName").equals(listName).delete();
    console.log(`[DexieCache] Invalidated cache for list: ${listName}`);
  } catch (error) {
    console.warn("[DexieCache] Failed to invalidate cache by list:", error);
  }
}

/**
 * Clear all cached data
 */
export async function clearAllCache(): Promise<void> {
  try {
    await db.cache.clear();
    console.log("[DexieCache] Cleared all cache");
  } catch (error) {
    console.warn("[DexieCache] Failed to clear cache:", error);
  }
}

/**
 * Get cache statistics (for debugging)
 */
export async function getCacheStats(): Promise<{ count: number; lists: string[] }> {
  try {
    const count = await db.cache.count();
    const entries = await db.cache.toArray();
    const lists = [...new Set(entries.map((e) => e.listName).filter(Boolean))] as string[];
    return { count, lists };
  } catch (error) {
    console.warn("[DexieCache] Failed to get cache stats:", error);
    return { count: 0, lists: [] };
  }
}
