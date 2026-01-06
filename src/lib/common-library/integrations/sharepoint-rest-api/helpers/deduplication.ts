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
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get number of cached requests
 */
export function getCacheSize(): number {
  return cache.size;
}

/**
 * Clear expired entries from cache
 */
export function clearExpired(ttlMs: number): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > ttlMs) {
      cache.delete(key);
    }
  }
}
