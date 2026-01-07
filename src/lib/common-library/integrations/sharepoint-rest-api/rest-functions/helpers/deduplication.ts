/**
 * Request deduplication with configurable TTL and error handling
 * Prevents duplicate simultaneous API calls
 */

export interface DeduplicationOptions {
  ttlMs?: number; // Cache TTL in milliseconds (undefined = no expiry)
  clearOnError?: boolean; // Clear cache on error to allow retries (default: true)
}

interface CacheEntry<T> {
  promise: Promise<T>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

// Auto-cleanup configuration
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_TTL_MS = 30 * 1000; // 30 seconds
let cleanupIntervalId: ReturnType<typeof setInterval> | null = null;
let isCleanupRunning = false;

/**
 * Start automatic cache cleanup (runs every 5 minutes)
 * Called automatically on first deduplicate() use
 */
function startAutoCleanup() {
  if (isCleanupRunning) return;

  isCleanupRunning = true;
  cleanupIntervalId = setInterval(() => {
    const entriesBeforeCleanup = cache.size;
    clearExpired(DEFAULT_TTL_MS);
    const entriesAfterCleanup = cache.size;

    if (entriesBeforeCleanup > entriesAfterCleanup) {
      console.log(`[Deduplication] Cleaned ${entriesBeforeCleanup - entriesAfterCleanup} expired cache entries`);
    }
  }, CLEANUP_INTERVAL_MS);
}

/**
 * Stop automatic cache cleanup (useful for testing or cleanup)
 */
export function stopAutoCleanup() {
  if (cleanupIntervalId !== null) {
    clearInterval(cleanupIntervalId);
    cleanupIntervalId = null;
    isCleanupRunning = false;
  }
}

/**
 * Generate cache key from endpoint and request parameters
 */
export function generateCacheKey(endpoint: string, params: Record<string, any>): string {
  const paramString = JSON.stringify(params);
  return `${endpoint}:${paramString}`;
}

/**
 * Execute request with deduplication
 * If identical request is in flight and not expired, returns same promise
 * Otherwise executes and caches the promise
 */
export async function deduplicate<T>(cacheKey: string, executor: () => Promise<T>, options: DeduplicationOptions = {}): Promise<T> {
  const { ttlMs, clearOnError = true } = options;

  // Start auto-cleanup on first use
  if (!isCleanupRunning) {
    startAutoCleanup();
  }

  // Check if request is cached and not expired
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    const age = Date.now() - cached.timestamp;

    // Return cached promise if TTL not exceeded (or no TTL set)
    if (!ttlMs || age < ttlMs) {
      return cached.promise;
    }

    // Cached entry expired, remove it
    cache.delete(cacheKey);
  }

  // Create new promise and cache it
  const promise = executor()
    .then((result) => {
      // Keep successful result in cache
      return result;
    })
    .catch((error) => {
      // Clear cache on error if configured, allowing retries
      if (clearOnError) {
        cache.delete(cacheKey);
      }
      throw error;
    });

  cache.set(cacheKey, { promise, timestamp: Date.now() });
  return promise;
}

/**
 * Clear all cached requests
 * Useful for testing or forcing fresh data
 */
export function clearCache(): void {
  cache.clear();
  console.log("[Deduplication] Cache cleared manually");
}

/**
 * Get number of cached requests
 */
export function getCacheSize(): number {
  return cache.size;
}

/**
 * Clear expired entries from cache
 * Removes entries older than the specified TTL
 * Called automatically every 5 minutes
 * @param ttlMs - Time-to-live in milliseconds (entries older than this are removed)
 */
export function clearExpired(ttlMs: number): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > ttlMs) {
      cache.delete(key);
    }
  }
}
