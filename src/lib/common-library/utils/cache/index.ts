/**
 * Cache utilities
 *
 * Provides IndexedDB-based caching with stale-while-revalidate pattern.
 *
 * @example
 * ```typescript
 * import { getCachedOrFetch, invalidateCacheByList } from "$lib/common-library/utils/cache";
 *
 * // Fetch with cache
 * const result = await getCachedOrFetch({
 *   cacheKey: "stories-list",
 *   fetchFn: () => getStoriesFromAPI(),
 *   listName: "Story",
 *   maxAge: 60 * 60 * 1000, // 1 hour
 * });
 *
 * // Invalidate after mutation
 * await invalidateCacheByList("Story");
 * ```
 */

export { initCacheDatabase, getCachedOrFetch, invalidateCache, invalidateCacheByList, clearAllCache, getCacheStats, type GetCachedOrFetchOptions, type CachedResult } from "./dexie-cache.svelte";
