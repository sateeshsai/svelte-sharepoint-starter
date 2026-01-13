/**
 * IndexedDB Cache with Dexie
 *
 * Provides persistent caching with stale-while-revalidate pattern.
 * Use for large datasets (like Stories) that benefit from offline-first loading.
 *
 * IMPORTANT: Call initCacheDatabase(siteName) on app boot before using cache functions.
 *
 * @example
 * ```typescript
 * // On app boot
 * initCacheDatabase("my-site-collection");
 *
 * // Then use cache
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

// Dexie database for cache - initialized lazily with site prefix
class CacheDatabase extends Dexie {
  cache!: EntityTable<CacheEntry, "key">;

  constructor(siteName: string) {
    // Sanitize site name for valid IndexedDB name (alphanumeric, dashes, underscores)
    const safeSiteName = siteName.replace(/[^a-zA-Z0-9_-]/g, "_") || "default";
    const dbName = `AppCache_${safeSiteName}`;
    super(dbName);
    this.version(1).stores({
      cache: "key, listName, timestamp",
    });
    console.log(`[DexieCache] Database initialized: ${dbName}`);
  }
}

let db: CacheDatabase | null = null;

/**
 * Initialize the cache database with a site-specific prefix.
 * Call this once on app boot before using any cache functions.
 * Database name will be: AppCache_{siteName}
 *
 * @param siteName - Site identifier (e.g., site collection name from SharePoint)
 */
export function initCacheDatabase(siteName: string): void {
  if (db) {
    console.warn("[DexieCache] Database already initialized, skipping re-initialization");
    return;
  }
  db = new CacheDatabase(siteName);
}

/**
 * Get the database instance, throwing if not initialized
 */
function getDb(): CacheDatabase {
  if (!db) {
    throw new Error("[DexieCache] Database not initialized. Call initCacheDatabase(siteName) on app boot.");
  }
  return db;
}

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
  /** Called when background fetch fails (only fires on stale-while-revalidate path) */
  onBackgroundError?: (error: unknown) => void;
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
  const { cacheKey, fetchFn, maxAge = DEFAULT_MAX_AGE, listName, onStale, onFresh, onBackgroundError, skipCache = false } = options;

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
    fetchFn()
      .then(async (freshData) => {
        if (freshData !== undefined) {
          await setCacheEntry(cacheKey, freshData, listName);
          onFresh?.();
        }
      })
      .catch((error) => {
        console.warn("[DexieCache] Background fetch failed:", error);
        onBackgroundError?.(error);
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
    const entry = (await getDb().cache.get(key)) as CacheEntry<T> | undefined;
    console.log(`[DexieCache] Get cache entry: key=${key}, found=${!!entry}`);
    return entry;
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
    // console.log(`[DexieCache] Setting cache entry: key=${key}, listName=${listName}`);
    // Use $state.snapshot to strip Proxies (from Svelte reactivity or dev warnings)
    const clonedData = $state.snapshot(data);
    await getDb().cache.put({
      key,
      data: clonedData,
      timestamp: Date.now(),
      listName,
    });
    console.log(`[DexieCache] Successfully cached: key=${key}`);
  } catch (error) {
    console.warn("[DexieCache] Failed to set cache entry:", error);
  }
}

/**
 * Invalidate cache for a specific key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await getDb().cache.delete(key);
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
    await getDb().cache.where("listName").equals(listName).delete();
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
    await getDb().cache.clear();
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
    const count = await getDb().cache.count();
    const entries = await getDb().cache.toArray();
    const lists = [...new Set(entries.map((e) => e.listName).filter(Boolean))] as string[];
    return { count, lists };
  } catch (error) {
    console.warn("[DexieCache] Failed to get cache stats:", error);
    return { count: 0, lists: [] };
  }
}
