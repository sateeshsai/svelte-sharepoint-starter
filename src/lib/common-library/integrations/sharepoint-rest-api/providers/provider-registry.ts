import type { DataProvider } from "./data-provider";

/**
 * ProviderRegistry - manages DataProvider implementations for common-library
 *
 * App layer registers implementations at startup:
 * - registerProviders(mockImpl, realImpl)
 *
 * Common-library calls getDataProvider(localMode) to get the appropriate implementation
 *
 * This pattern:
 * ✅ Keeps common-library free of app-layer imports
 * ✅ Enables portability across projects
 * ✅ Supports testing with custom implementations
 */

let mockDataProvider: DataProvider | null = null;
let realDataProvider: DataProvider | null = null;

/**
 * Register DataProvider implementations
 * Call this once at app startup (in main.ts or equivalent)
 *
 * @param mock - MockDataProvider instance for LOCAL_MODE
 * @param real - SharePointDataProvider instance for production
 *
 * @example
 * import { MockDataProvider } from "$lib/data/mock-data-provider";
 * import { SharePointDataProvider } from "$lib/common-library/.../sharepoint-data-provider";
 * import { registerProviders } from "$lib/common-library/.../provider-registry";
 *
 * registerProviders(
 *   new MockDataProvider(),
 *   new SharePointDataProvider()
 * );
 */
export function registerProviders(mock: DataProvider, real: DataProvider): void {
  mockDataProvider = mock;
  realDataProvider = real;
}

/**
 * Get the appropriate DataProvider implementation
 *
 * Must call registerProviders() first at app startup
 *
 * @param localMode - true to use mock provider, false for real API
 * @returns DataProvider instance
 * @throws Error if providers not registered
 *
 * @example
 * const provider = getDataProvider(LOCAL_MODE);
 * const stories = await provider.getListItems({ listName: "Stories" });
 */
export function getDataProvider(localMode: boolean): DataProvider {
  if (!mockDataProvider || !realDataProvider) {
    throw new Error("DataProviders not registered. Call registerProviders(mockImpl, realImpl) at app startup.");
  }
  return localMode ? mockDataProvider : realDataProvider;
}

/**
 * Override a specific implementation (mainly for testing)
 * @param mock - Custom mock provider or null to reset
 * @param real - Custom real provider or null to reset
 */
export function setProviders(mock: DataProvider | null, real: DataProvider | null): void {
  if (mock !== null) mockDataProvider = mock;
  if (real !== null) realDataProvider = real;
}

/**
 * Reset to uninitialized state (for testing)
 */
export function resetProviders(): void {
  mockDataProvider = null;
  realDataProvider = null;
}
