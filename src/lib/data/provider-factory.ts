import type { DataProvider } from "./data-provider";
import { SharePointDataProvider } from "$lib/common-library/integrations/sharepoint-rest-api/sharepoint-data-provider";
import { MockDataProvider } from "./mock-data-provider";
import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";

/**
 * Global data provider instance
 * Automatically selects between SharePointDataProvider (production) and MockDataProvider (dev/LOCAL_MODE)
 */
let dataProviderInstance: DataProvider | null = null;

/**
 * Get the singleton DataProvider instance
 * Creates instance on first call and reuses thereafter
 *
 * @returns DataProvider instance (SharePointDataProvider in production, MockDataProvider in LOCAL_MODE)
 */
export function getDataProvider(): DataProvider {
  if (!dataProviderInstance) {
    dataProviderInstance = LOCAL_MODE ? new MockDataProvider() : new SharePointDataProvider();
  }
  return dataProviderInstance;
}

/**
 * Override the data provider (mainly for testing)
 * @param provider - Custom DataProvider implementation to use
 */
export function setDataProvider(provider: DataProvider): void {
  dataProviderInstance = provider;
}

/**
 * Reset to default provider (useful in tests)
 */
export function resetDataProvider(): void {
  dataProviderInstance = null;
}
