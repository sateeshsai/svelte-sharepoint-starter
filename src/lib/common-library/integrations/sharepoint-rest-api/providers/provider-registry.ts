import type { DataProvider } from "./data-provider";

/**
 * Provider registry for managing DataProvider implementations
 *
 * Pattern keeps common-library free of app-layer imports:
 * - App layer calls registerProviders(mock, real) at startup
 * - Common-library calls getDataProvider(localMode) as needed
 * - Enables portability and testing with custom implementations
 */

let mockDataProvider: DataProvider | null = null;
let realDataProvider: DataProvider | null = null;

/**
 * Register DataProvider implementations at app startup
 * @example
 * registerProviders(new MockDataProvider(), new SharePointDataProvider());
 */
export function registerProviders(mock: DataProvider, real: DataProvider): void {
  mockDataProvider = mock;
  realDataProvider = real;
}

/**
 * Get DataProvider implementation based on mode
 * @param localMode - true for mock, false for real SharePoint API
 * @throws Error if registerProviders() not called first
 */
export function getDataProvider(localMode: boolean): DataProvider {
  if (!mockDataProvider || !realDataProvider) {
    throw new Error("DataProviders not registered. Call registerProviders(mockImpl, realImpl) at app startup.");
  }
  return localMode ? mockDataProvider : realDataProvider;
}

/** Override providers (for testing) */
export function setProviders(mock: DataProvider | null, real: DataProvider | null): void {
  if (mock !== null) mockDataProvider = mock;
  if (real !== null) realDataProvider = real;
}

/** Reset to uninitialized state (for testing) */
export function resetProviders(): void {
  mockDataProvider = null;
  realDataProvider = null;
}
