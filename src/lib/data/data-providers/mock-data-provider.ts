import { BaseMockDataProvider } from "$lib/common-library/integrations/sharepoint-rest-api/providers/base-mock-data-provider";
import { LOCAL_STORY_ITEMS, LOCAL_ENGAGEMENTS, LOCAL_FILES, LOCAL_USERS, LOCAL_ANALYTICS, LOCAL_ERROR_REPORTS } from "../local-data";
import { SHAREPOINT_CONFIG, type AppSharePointConfig } from "$lib/env/sharepoint-config";

/**
 * Type-safe mock data mapping
 * TypeScript enforces an entry for EVERY list defined in SHAREPOINT_CONFIG
 * Adding a new list to config without adding mock data here will cause a compile error
 */
type ListNames = AppSharePointConfig["lists"][keyof AppSharePointConfig["lists"]]["name"];
type MockDataMap = Record<ListNames, any[]>;

const MOCK_DATA_BY_LIST_NAME: MockDataMap = {
  [SHAREPOINT_CONFIG.lists.Story.name]: LOCAL_STORY_ITEMS,
  [SHAREPOINT_CONFIG.lists.Engagements.name]: LOCAL_ENGAGEMENTS,
  [SHAREPOINT_CONFIG.lists.StoryFiles.name]: LOCAL_FILES,
  [SHAREPOINT_CONFIG.lists.UsersInfo.name]: LOCAL_USERS,
  [SHAREPOINT_CONFIG.lists.Analytics.name]: LOCAL_ANALYTICS,
  [SHAREPOINT_CONFIG.lists.ErrorReports.name]: LOCAL_ERROR_REPORTS,
};

/**
 * App-specific MockDataProvider
 * Uses MOCK_DATA_BY_LIST_NAME for type-safe list name mapping
 */
export class MockDataProvider extends BaseMockDataProvider {
  protected getDataForList(listName: string): any[] {
    return MOCK_DATA_BY_LIST_NAME[listName] ?? [];
  }
}
