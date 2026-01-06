import type { DataProvider } from "./data-provider";
import type { Sharepoint_Error_Formatted, Sharepoint_Get_Operations, Sharepoint_User } from "../data/types";
import type { SharePointConfig } from "../config";
import { LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "../data/local-data";

/**
 * BaseMockDataProvider - abstract base class with reusable mock data logic
 * Extend this class in your app layer and implement getDataForList() to provide project-specific data
 * Lives in common-library for portability across different projects
 *
 * Config is injected via constructor for use as defaults in all methods
 */
export abstract class BaseMockDataProvider implements DataProvider {
  protected config: SharePointConfig;

  constructor(config: SharePointConfig) {
    this.config = config;
  }

  /**
   * Abstract method - implement in concrete class to return mock data for a given list
   * @param listName - Name of the SharePoint list
   * @returns Array of mock items for that list
   */
  protected abstract getDataForList(listName: string): any[];

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

    // Get mock data for this list (implemented by subclass)
    let mockData = this.getDataForList(options.listName);

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
            if (Math.random() < 0.3) {
              const firstItem = mockData[0];
              if (firstItem) {
                const newItem = {
                  ...firstItem,
                  Id: Math.floor(Math.random() * 10000) + 5000,
                  Title: `New Item ${new Date().getTime()}`,
                  Created: new Date().toISOString(),
                  Modified: new Date().toISOString(),
                };
                mockData = [newItem];
              }
            } else {
              // Otherwise return items created after filter date
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

    // Return the first mock user from common-library local data
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

    // Return the first mock user properties from common-library local data
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
