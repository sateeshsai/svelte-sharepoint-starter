import { getDataProvider as getProviderFromRegistry, registerProviders as registerProvidersInRegistry } from "$lib/common-library/integrations/sharepoint-rest-api/providers/provider-registry";
import { SharePointDataProvider } from "$lib/common-library/integrations/sharepoint-rest-api/providers/sharepoint-data-provider";
import { validateSharePointConfig, type SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";
import { MockDataProvider } from "./mock-data-provider";
import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import type { DataProvider } from "$lib/common-library/integrations/sharepoint-rest-api/providers/data-provider";

/**
 * Initialize DataProvider implementations in the registry
 * Call this once at app startup (in main.ts)
 *
 * This function:
 * 1. Validates SharePoint configuration at runtime
 * 2. Creates app-layer MockDataProvider with config
 * 3. Creates SharePointDataProvider with config
 * 4. Registers both into the common-library registry
 * 5. Enables automatic LOCAL_MODE switching
 *
 * Config is injected here, so individual API calls don't need to pass siteCollectionUrl
 * Throws descriptive error if config is invalid
 */
export function initializeDataProviders(): void {
  // Validate config at startup - catches typos and missing required fields
  const validConfig = validateSharePointConfig(SHAREPOINT_CONFIG);

  registerProvidersInRegistry(new MockDataProvider(validConfig), new SharePointDataProvider(validConfig));
}

/**
 * Get the singleton DataProvider instance
 * Uses the common-library registry to select between mock and real based on LOCAL_MODE
 *
 * @returns DataProvider instance (MockDataProvider in LOCAL_MODE, SharePointDataProvider in production)
 */
export function getDataProvider(): DataProvider {
  return getProviderFromRegistry(LOCAL_MODE);
}

/**
 * Override the data provider (mainly for testing)
 * @param mock - Custom MockDataProvider implementation
 * @param real - Custom SharePointDataProvider implementation
 */
export function setDataProvider(mock: DataProvider | null, real: DataProvider | null): void {
  const validatedConfig = validateSharePointConfig(SHAREPOINT_CONFIG);
  if (mock !== null || real !== null) {
    registerProvidersInRegistry(mock || new MockDataProvider(validatedConfig), real || new SharePointDataProvider(validatedConfig));
  }
}

/**
 * Reset to default providers (useful in tests)
 */
export function resetDataProvider(): void {
  initializeDataProviders();
}
