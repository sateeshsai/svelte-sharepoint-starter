import { getDataProvider as getProviderFromRegistry, registerProviders as registerProvidersInRegistry } from "$lib/common-library/integrations/sharepoint-rest-api/providers/provider-registry";
import { SharePointDataProvider } from "$lib/common-library/integrations/sharepoint-rest-api/providers/sharepoint-data-provider";
import { validateSharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";
import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import type { DataProvider } from "$lib/common-library/integrations/sharepoint-rest-api/providers/data-provider";

/**
 * Initialize data providers at app startup
 *
 * IMPORTANT: Call in main.ts BEFORE any component renders
 * Components calling getDataProvider() before init will throw
 *
 * This function:
 * 1. Validates SharePoint config at runtime
 * 2. Creates MockDataProvider (dev only, tree-shaken in prod)
 * 3. Creates SharePointDataProvider
 * 4. Registers both into common-library registry
 * 5. Enables automatic LOCAL_MODE switching
 *
 * Config injected here so API calls don't need siteCollectionUrl
 */
export async function initializeDataProviders(): Promise<void> {
  // Validate config at startup - catches typos and missing required fields
  const validConfig = validateSharePointConfig(SHAREPOINT_CONFIG);

  // Use build-time check (import.meta.env.DEV) to exclude mock data from production builds
  // Tree-shaking will completely remove MockDataProvider and local-data.ts from prod bundle
  let mockProvider: DataProvider;
  if (import.meta.env.DEV) {
    // Development: dynamically import mock data (won't be in production bundle)
    const { MockDataProvider } = await import("./mock-data-provider");
    mockProvider = new MockDataProvider(validConfig);
  } else {
    // Production: use SharePointDataProvider for both (LOCAL_MODE is always false anyway)
    mockProvider = new SharePointDataProvider(validConfig);
  }

  registerProvidersInRegistry(mockProvider, new SharePointDataProvider(validConfig));
}

/**
 * Get singleton DataProvider instance
 * Uses common-library registry to switch between mock and real based on LOCAL_MODE
 * @returns MockDataProvider in LOCAL_MODE, SharePointDataProvider in production
 */
export function getDataProvider(): DataProvider {
  return getProviderFromRegistry(LOCAL_MODE);
}

/** Override data provider (mainly for testing) */
export async function setDataProvider(mock: DataProvider | null, real: DataProvider | null): Promise<void> {
  const validatedConfig = validateSharePointConfig(SHAREPOINT_CONFIG);
  if (mock !== null || real !== null) {
    // In test scenarios, we might need MockDataProvider
    let mockProvider = mock;
    if (mock === null && LOCAL_MODE) {
      const { MockDataProvider } = await import("./mock-data-provider");
      mockProvider = new MockDataProvider(validatedConfig);
    }
    registerProvidersInRegistry(mockProvider || new SharePointDataProvider(validatedConfig), real || new SharePointDataProvider(validatedConfig));
  }
}

/** Reset to default providers (for testing) */
export async function resetDataProvider(): Promise<void> {
  await initializeDataProviders();
}
