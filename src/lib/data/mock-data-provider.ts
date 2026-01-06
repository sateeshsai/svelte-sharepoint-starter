import { BaseMockDataProvider } from "$lib/common-library/integrations/sharepoint-rest-api/providers/base-mock-data-provider";
import type { SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";
import { LOCAL_STORY_ITEMS, LOCAL_ENGAGEMENTS, LOCAL_FILES, LOCAL_USERS } from "./local-data";

/**
 * MockDataProvider - app-specific implementation of BaseMockDataProvider
 * Provides project-specific mock data by mapping list names to local data
 * Used in LOCAL_MODE to simulate SharePoint API responses without network calls
 * Receives config via constructor from parent class
 */
export class MockDataProvider extends BaseMockDataProvider {
  /**
   * Implement the abstract method to return mock data for this project's lists
   * Uses config passed to constructor to get list names
   */
  protected getDataForList(listName: string): any[] {
    // Map list names to app-specific mock data
    // Use config.lists if available to be data-driven, fallback to hardcoded names
    const storyListName = this.config.lists?.Story?.name ?? "Story";
    const engagementsListName = this.config.lists?.Engagements?.name ?? "Engagements";
    const filesListName = this.config.lists?.Files?.name ?? "Files";
    const usersListName = this.config.lists?.UsersInfo?.name ?? "UsersInfo";

    if (listName === storyListName) {
      return LOCAL_STORY_ITEMS;
    } else if (listName === engagementsListName) {
      return LOCAL_ENGAGEMENTS;
    } else if (listName === filesListName) {
      return LOCAL_FILES;
    } else if (listName === usersListName) {
      return LOCAL_USERS;
    }
    return [];
  }
}
