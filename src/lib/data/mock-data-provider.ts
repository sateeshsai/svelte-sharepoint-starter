import type { DataProvider } from "./data-provider";
import type { Sharepoint_Error_Formatted, Sharepoint_Get_Operations, Sharepoint_User } from "$lib/common-library/integrations/sharepoint-rest-api/types";
import { LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "$lib/common-library/integrations/sharepoint-rest-api/local-data";
import { LOCAL_STORY_ITEMS, LOCAL_ENGAGEMENTS, LOCAL_FILES, LOCAL_USERS } from "./local-data";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";

/**
 * MockDataProvider - implements DataProvider interface using mock/simulated data
 * Used in LOCAL_MODE to simulate SharePoint API responses without network calls
 * Allows developers to work offline and test without real SharePoint access
 */
export class MockDataProvider implements DataProvider {
  /**
   * Simulates a delay to mimic network latency
   */
  private simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getListItems<T extends { value: Record<string, any> }>(options: {
    siteCollectionUrl?: string;
    listName: string;
    operations?: Sharepoint_Get_Operations;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<T | Sharepoint_Error_Formatted> {
    await this.simulateDelay(300);

    // Return mock data based on list name
    let mockData: any[] = [];

    if (options.listName === SHAREPOINT_CONFIG.lists.Story.name) {
      mockData = LOCAL_STORY_ITEMS;
    } else if (options.listName === SHAREPOINT_CONFIG.lists.Engagements.name) {
      mockData = LOCAL_ENGAGEMENTS;
    } else if (options.listName === SHAREPOINT_CONFIG.lists.Files.name) {
      mockData = LOCAL_FILES;
    } else if (options.listName === SHAREPOINT_CONFIG.lists.UsersInfo.name) {
      mockData = LOCAL_USERS;
    }

    // Apply filtering if operations include a filter
    if (options.operations) {
      const filterOp = (options.operations as Array<[string, any]>).find((op) => op[0] === "filter");
      if (filterOp) {
        const filterValue = filterOp[1];
        // Simple mock filtering: only handle "Created ge 'date'" filters
        if (filterValue && typeof filterValue === "string" && filterValue.includes("Created ge")) {
          const dateMatch = filterValue.match(/'([^']+)'/);
          if (dateMatch) {
            const filterDate = new Date(dateMatch[1]);

            // Simulate new items being created for polling
            // 30% chance to return a simulated new item with creation date after the filter
            if (Math.random() < 0.3 && options.listName === SHAREPOINT_CONFIG.lists.Story.name) {
              const newStory = {
                ...LOCAL_STORY_ITEMS[0], // Copy first story as template
                Id: Math.floor(Math.random() * 10000) + 5000,
                Title: `New Story ${new Date().getTime()}`,
                Created: new Date().toISOString(),
                Modified: new Date().toISOString(),
              };
              mockData = [newStory];
            } else {
              // Otherwise return empty (no new items created since filter date)
              mockData = mockData.filter((item) => {
                const itemDate = new Date(item.Created);
                return itemDate >= filterDate;
              });
            }
          }
        }
      }
    }

    const result: T = { value: mockData } as unknown as T;
    return result;
  }

  async getCurrentUser<T extends Sharepoint_User>(options: {
    siteCollectionUrl?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<T | Sharepoint_Error_Formatted> {
    await this.simulateDelay(400);

    // Return the first mock user
    const mockUser = LOCAL_SHAREPOINT_USERS[0];
    return mockUser as T;
  }

  async getCurrentUserProperties(options: {
    siteCollectionUrl?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<{ value: Record<string, any> } | Sharepoint_Error_Formatted> {
    await this.simulateDelay(300);

    // Return the first mock user properties
    const mockProps = LOCAL_SHAREPOINT_USERS_PROPERTIES[0];
    return { value: mockProps as Record<string, any> };
  }

  async getFormDigestValue(options: { siteCollectionUrl?: string; logToConsole?: boolean; signal?: AbortSignal }): Promise<string | Sharepoint_Error_Formatted> {
    await this.simulateDelay(200);

    // Return a dummy form digest for mock requests
    return "0x1234567890ABCDEF";
  }

  async postListItem<T extends { d: Record<string, any> }>(options: {
    siteCollectionUrl?: string;
    listName: string;
    body: Record<string, any>;
    logToConsole?: boolean;
    signal?: AbortSignal;
  }): Promise<T | Sharepoint_Error_Formatted> {
    await this.simulateDelay(400);

    // Create and return mock item with ID
    const mockItem: T = {
      d: {
        Id: Math.floor(Math.random() * 1000) + 1000,
        ...options.body,
      },
    } as unknown as T;
    return mockItem;
  }

  async readAndUploadFile(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    file: File;
    folder?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
  }): Promise<{ Url: string } | Sharepoint_Error_Formatted> {
    await this.simulateDelay(500);

    // Return a mock file URL
    return {
      Url: `./assets/${options.folder || "files"}/${options.file.name}`,
    };
  }

  async updateListItem(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    body: Record<string, any>;
    logToConsole?: boolean;
    signal?: AbortSignal;
  }): Promise<void | Sharepoint_Error_Formatted> {
    await this.simulateDelay(300);

    // Mock update succeeds silently
    return;
  }

  async deleteListItem(options: { siteCollectionUrl?: string; listName: string; itemId: number; logToConsole?: boolean; signal?: AbortSignal }): Promise<void | Sharepoint_Error_Formatted> {
    await this.simulateDelay(300);

    // Mock delete succeeds silently
    return;
  }
}
