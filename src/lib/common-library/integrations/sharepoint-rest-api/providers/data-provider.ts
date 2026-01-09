import type { Sharepoint_Error_Formatted, Sharepoint_Get_Operations, Sharepoint_User, Sharepoint_User_Properties } from "../data/types";

/**
 * DataProvider interface - abstracts data operations from implementation
 * Allows switching between real SharePoint API and mock data without changing UI code
 *
 * All methods support an optional `mockResponse` parameter for LOCAL_MODE testing.
 * When provided, the mock provider returns this data instead of generating mock data.
 * The real SharePoint provider ignores this parameter.
 */
export interface DataProvider {
  /**
   * Get list items from a SharePoint list
   * @param options - Configuration for the request (listName, filters, etc)
   * @param options.mockResponse - Optional override response for LOCAL_MODE testing
   * @returns Promise resolving to list items array or error
   */
  getListItems<T extends { value: any[] }>(options: {
    siteCollectionUrl?: string;
    listName: string;
    operations?: Sharepoint_Get_Operations;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
    /** Whether to cache the response (default: true). Set to false for polling contexts. */
    cacheResponse?: boolean;
    /** Override mock response for LOCAL_MODE testing - ignored in production */
    mockResponse?: T;
  }): Promise<T | Sharepoint_Error_Formatted>;

  /**
   * Get current user information
   * @param options - Configuration for the request
   * @returns Promise resolving to user object or error
   */
  getCurrentUser<T extends Sharepoint_User>(options: {
    siteCollectionUrl?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<T | Sharepoint_Error_Formatted>;

  /**
   * Get current user properties (role, groups, etc)
   * @param options - Configuration for the request
   * @returns Promise resolving to user properties or error
   */
  getCurrentUserProperties(options: {
    siteCollectionUrl?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<{ value: Record<string, any> } | Sharepoint_Error_Formatted>;

  /**
   * Get user properties for a specific user by logonName or emailId
   * Uses PeopleManager GetPropertiesFor endpoint
   * @param options - Configuration including accountName (email, emailId, or full logonName)
   * @returns Promise resolving to user properties or error
   */
  getUserProperties<T extends Sharepoint_User_Properties>(options: {
    siteCollectionUrl?: string;
    /** Email address (user@domain.com), emailId (username), or full logonName */
    accountName: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<T | Sharepoint_Error_Formatted>;

  /**
   * Get a user by their SharePoint ID
   * @param options - Configuration including userId
   * @returns Promise resolving to user object or error
   */
  getUser<T extends Sharepoint_User>(options: {
    siteCollectionUrl?: string;
    userId: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<T | Sharepoint_Error_Formatted>;

  /**
   * Ensure a user exists in the site by their email address
   * Creates the user if they don't exist, returns user info if they do
   * @param options - Configuration including emailId
   * @returns Promise resolving to user object or error
   */
  ensureUserByEmailId<T extends Sharepoint_User>(options: { siteCollectionUrl?: string; emailId: string; logToConsole?: boolean; signal?: AbortSignal }): Promise<T | Sharepoint_Error_Formatted>;

  /**
   * Get form digest value for POST/UPDATE/DELETE operations
   * @param options - Configuration for the request
   * @returns Promise resolving to digest value or error
   */
  getFormDigestValue(options: { siteCollectionUrl?: string; logToConsole?: boolean; signal?: AbortSignal }): Promise<string | Sharepoint_Error_Formatted>;

  /**
   * Create a new list item
   * @param options - Configuration including listName, body data, and metadata
   * @param options.mockResponse - Optional override response for LOCAL_MODE testing
   * @returns Promise resolving to created item (flat, odata=nometadata format) or error
   */
  postListItem<T extends Record<string, any>>(options: {
    siteCollectionUrl?: string;
    listName: string;
    body: Record<string, any>;
    logToConsole?: boolean;
    signal?: AbortSignal;
    /** Override mock response for LOCAL_MODE testing - ignored in production */
    mockResponse?: T;
  }): Promise<T | Sharepoint_Error_Formatted>;

  /**
   * Upload a file to a folder
   * @param options - Configuration including listName, item ID, and file data
   * @param options.mockResponse - Optional override response for LOCAL_MODE testing
   * @returns Promise resolving to file data or error
   */
  readAndUploadFile(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    file: File;
    folder?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    /** Override mock response for LOCAL_MODE testing - ignored in production */
    mockResponse?: { Url: string };
  }): Promise<{ Url: string } | Sharepoint_Error_Formatted>;

  /**
   * Update an existing list item
   * @param options - Configuration including listName, item ID, and updated data
   * @param options.mockResponse - Optional override response for LOCAL_MODE testing
   * @returns Promise resolving to void or error
   */
  updateListItem(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    body: Record<string, any>;
    logToConsole?: boolean;
    signal?: AbortSignal;
    /** Override mock response for LOCAL_MODE testing - ignored in production */
    mockResponse?: void;
  }): Promise<void | Sharepoint_Error_Formatted>;

  /**
   * Delete a list item
   * @param options - Configuration including listName and item ID
   * @param options.mockResponse - Optional override response for LOCAL_MODE testing
   * @returns Promise resolving to void or error
   */
  deleteListItem(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    logToConsole?: boolean;
    signal?: AbortSignal;
    /** Override mock response for LOCAL_MODE testing - ignored in production */
    mockResponse?: void;
  }): Promise<void | Sharepoint_Error_Formatted>;
}
