import type { DataProvider } from "./data-provider";
import type { Sharepoint_Error_Formatted, Sharepoint_Get_Operations, Sharepoint_UploadFile_SuccessResponse, Sharepoint_User, Sharepoint_User_Properties } from "../data/types";
import type { SharePointConfig } from "../config";
import { LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "../data/local-data";
import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";

/**
 * BaseMockDataProvider - abstract base class with reusable mock data logic
 * Extend this class in your app layer and implement getDataForList() to provide project-specific data
 * Lives in common-library for portability across different projects
 *
 * Maintains an in-memory session store that persists POST/UPDATE/DELETE operations
 * Config is injected via constructor for use as defaults in all methods
 */
export abstract class BaseMockDataProvider implements DataProvider {
  protected config: SharePointConfig;

  /**
   * Session store for mock data - persists changes during the browser session
   * Key: listName, Value: array of items
   * Initialized lazily from getDataForList() on first access
   */
  private sessionStore: Map<string, any[]> = new Map();

  /**
   * Counter for generating unique IDs per list
   */
  private idCounters: Map<string, number> = new Map();

  /**
   * Counter for simulated new entries in LOCAL_MODE
   */
  private simulatedEntryCount: Map<string, number> = new Map();

  constructor(config: SharePointConfig) {
    this.config = config;
  }

  /**
   * Abstract method - implement in concrete class to return initial mock data for a given list
   * This data seeds the session store on first access
   * @param listName - Name of the SharePoint list
   * @returns Array of mock items for that list
   */
  protected abstract getDataForList(listName: string): any[];

  /**
   * Get the session data for a list, initializing from seed data if needed
   * All reads go through this to ensure we're using the mutable session store
   */
  private getSessionData(listName: string): any[] {
    if (!this.sessionStore.has(listName)) {
      // Initialize from seed data (deep clone to avoid mutation of original)
      const seedData = this.getDataForList(listName);
      this.sessionStore.set(listName, JSON.parse(JSON.stringify(seedData)));

      // Initialize ID counter based on max ID in seed data
      const maxId = seedData.reduce((max, item) => Math.max(max, item.Id || 0), 0);
      this.idCounters.set(listName, maxId + 1);
      // console.log(`[MockDataProvider] Initialized session for ${listName}, maxId=${maxId}, items=${seedData.length}`);
    }
    return this.sessionStore.get(listName)!;
  }

  /**
   * Generate the next unique ID for a list
   */
  private getNextId(listName: string): number {
    // Ensure session is initialized
    this.getSessionData(listName);
    const nextId = this.idCounters.get(listName) || 1000;
    this.idCounters.set(listName, nextId + 1);
    return nextId;
  }

  /**
   * Simulates a delay to mimic network latency
   */
  private simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Parse operations array into a map for easier access
   */
  private parseOperations(operations?: Sharepoint_Get_Operations): Map<string, string | number> {
    const opMap = new Map<string, string | number>();
    if (!operations) return opMap;

    if (typeof operations === "string") {
      // Handle raw query string format: "$select=Id,Title&$filter=..."
      const parts = operations.replace(/^\$/, "").split("&$");
      parts.forEach((part) => {
        const [key, value] = part.split("=");
        if (key && value) opMap.set(key, value);
      });
    } else {
      operations.forEach(([op, value]) => {
        opMap.set(op, value);
      });
    }
    return opMap;
  }

  /**
   * Apply $filter operation - supports SharePoint 2013 REST API filter syntax
   * SharePoint-specific behaviors:
   * - String values use single quotes: Title eq 'Hello'
   * - Numeric values have no quotes: Id eq 5
   * - Dates use ISO format with quotes: Created ge '2024-01-01T00:00:00Z'
   * - Lookup fields use / for nested: Author/Id eq 1
   * - Boolean: Active eq true (lowercase, no quotes)
   * - Null: Field eq null
   * - Operators: eq, ne, gt, ge, lt, le
   * - Logical: and, or (case-insensitive)
   * - Functions: substringof, startswith, endswith (SharePoint 2013 uses substringof, not contains)
   */
  private applyFilter(data: any[], filterExpr: string): any[] {
    if (!filterExpr) return data;

    return data.filter((item) => this.evaluateFilterExpression(item, filterExpr));
  }

  /**
   * Evaluate a filter expression against an item
   * Follows SharePoint 2013 REST API OData conventions
   */
  private evaluateFilterExpression(item: any, expr: string): boolean {
    // Handle 'and' operator (lower precedence than comparisons)
    if (/ and /i.test(expr)) {
      const parts = expr.split(/ and /i);
      return parts.every((part) => this.evaluateFilterExpression(item, part.trim()));
    }

    // Handle 'or' operator
    if (/ or /i.test(expr)) {
      const parts = expr.split(/ or /i);
      return parts.some((part) => this.evaluateFilterExpression(item, part.trim()));
    }

    // SharePoint 2013 uses substringof('value', field) - note: value comes FIRST
    // This is different from OData 4's contains(field, 'value')
    const substringOfMatch = expr.match(/substringof\(\s*'([^']+)'\s*,\s*([^)]+)\)/i);
    if (substringOfMatch) {
      const searchValue = substringOfMatch[1];
      const fieldValue = this.getNestedValue(item, substringOfMatch[2].trim());
      return fieldValue != null && String(fieldValue).toLowerCase().includes(searchValue.toLowerCase());
    }

    // Also support contains() for forward compatibility
    const containsMatch = expr.match(/contains\(\s*([^,]+)\s*,\s*'([^']+)'\s*\)/i);
    if (containsMatch) {
      const fieldValue = this.getNestedValue(item, containsMatch[1].trim());
      return fieldValue != null && String(fieldValue).toLowerCase().includes(containsMatch[2].toLowerCase());
    }

    // Handle startswith(field, 'value')
    const startsWithMatch = expr.match(/startswith\(\s*([^,]+)\s*,\s*'([^']+)'\s*\)/i);
    if (startsWithMatch) {
      const fieldValue = this.getNestedValue(item, startsWithMatch[1].trim());
      return fieldValue != null && String(fieldValue).toLowerCase().startsWith(startsWithMatch[2].toLowerCase());
    }

    // Handle endswith(field, 'value')
    const endsWithMatch = expr.match(/endswith\(\s*([^,]+)\s*,\s*'([^']+)'\s*\)/i);
    if (endsWithMatch) {
      const fieldValue = this.getNestedValue(item, endsWithMatch[1].trim());
      return fieldValue != null && String(fieldValue).toLowerCase().endsWith(endsWithMatch[2].toLowerCase());
    }

    // Handle comparison operators: eq, ne, gt, ge, lt, le
    const comparisonMatch = expr.match(/^(.+?)\s+(eq|ne|gt|ge|lt|le)\s+(.+)$/i);
    if (comparisonMatch) {
      const field = comparisonMatch[1].trim();
      const operator = comparisonMatch[2].toLowerCase();
      let compareValue: any = comparisonMatch[3].trim();

      // Parse the compare value according to SharePoint conventions
      // Strings: wrapped in single quotes 'value'
      // Numbers: no quotes, parsed as number
      // Booleans: true/false (lowercase, no quotes)
      // Null: null keyword
      // Dates: ISO string in single quotes '2024-01-01T00:00:00Z'
      if (compareValue.startsWith("'") && compareValue.endsWith("'")) {
        // String or date value - remove quotes
        compareValue = compareValue.slice(1, -1);
      } else if (compareValue === "null") {
        compareValue = null;
      } else if (compareValue === "true") {
        compareValue = true;
      } else if (compareValue === "false") {
        compareValue = false;
      } else if (!isNaN(Number(compareValue))) {
        // Numeric value (no quotes in SharePoint for numbers)
        compareValue = Number(compareValue);
      }

      const fieldValue = this.getNestedValue(item, field);

      // SharePoint date comparisons - dates are ISO strings in quotes
      // Check if compareValue looks like a date string
      const isDateComparison = typeof compareValue === "string" && /^\d{4}-\d{2}-\d{2}/.test(compareValue);
      const fieldDate = isDateComparison && fieldValue ? new Date(fieldValue) : null;
      const compareDate = isDateComparison ? new Date(compareValue) : null;

      switch (operator) {
        case "eq":
          // SharePoint eq is case-sensitive for strings
          if (isDateComparison && fieldDate && compareDate) {
            return fieldDate.getTime() === compareDate.getTime();
          }
          // Use == for type coercion (SharePoint sometimes returns string IDs)
          return fieldValue == compareValue;
        case "ne":
          if (isDateComparison && fieldDate && compareDate) {
            return fieldDate.getTime() !== compareDate.getTime();
          }
          return fieldValue != compareValue;
        case "gt":
          if (fieldDate && compareDate) return fieldDate > compareDate;
          return fieldValue > compareValue;
        case "ge":
          if (fieldDate && compareDate) return fieldDate >= compareDate;
          return fieldValue >= compareValue;
        case "lt":
          if (fieldDate && compareDate) return fieldDate < compareDate;
          return fieldValue < compareValue;
        case "le":
          if (fieldDate && compareDate) return fieldDate <= compareDate;
          return fieldValue <= compareValue;
        default:
          return true;
      }
    }

    return true; // If we can't parse the expression, include the item
  }

  /**
   * Get nested property value (e.g., "Author/Id" -> item.Author.Id)
   */
  private getNestedValue(item: any, path: string): any {
    const parts = path.split("/");
    let value = item;
    for (const part of parts) {
      if (value == null) return null;
      value = value[part];
    }
    return value;
  }

  /**
   * Apply $select operation - returns only specified fields
   * Handles nested fields like "Author/Id,Author/Title" by preserving nested structure
   * In DEV mode, wraps items in Proxy to warn when accessing non-selected fields
   */
  private applySelect(data: any[], selectExpr: string): any[] {
    if (!selectExpr) return data;

    const fields = selectExpr.split(",").map((f) => f.trim());
    // Extract top-level field names (including parent names from nested fields)
    const topLevelFields = new Set(fields.map((f) => f.split("/")[0]));

    return data.map((item) => {
      const selected: Record<string, any> = {};

      fields.forEach((field) => {
        if (field.includes("/")) {
          // Nested field like "Author/Id"
          const [parent, child] = field.split("/");
          if (item[parent] != null) {
            if (!selected[parent]) selected[parent] = {};
            selected[parent][child] = item[parent][child];
          }
        } else {
          // Top-level field
          if (field in item) {
            selected[field] = item[field];
          }
        }
      });

      // DEV mode: wrap in Proxy to catch access to non-selected fields
      // Helps catch bugs where code relies on fields not in $select
      if (import.meta.env.DEV) {
        return new Proxy(selected, {
          get(target, prop) {
            if (typeof prop === "string" && !topLevelFields.has(prop) && prop !== "then" && !prop.startsWith("$")) {
              console.warn(`[MockProvider] Accessing "${prop}" but it wasn't in $select. ` + `This will return undefined in SharePoint. Selected fields: ${fields.join(", ")}`);
            }
            return target[prop as keyof typeof target];
          },
        });
      }

      return selected;
    });
  }

  /**
   * Apply $orderby operation - sorts results by specified field
   * Accepts SharePoint format: "ColumnName" or "ColumnName asc" or "ColumnName desc"
   * Default direction is ascending if not specified
   */
  private applyOrderBy(data: any[], orderByExpr: string): any[] {
    if (!orderByExpr) return data;

    // Parse "ColumnName direction" format (e.g., "Created desc", "Title asc", "Id")
    const parts = orderByExpr.trim().split(/\s+/);
    const field = parts[0];
    const direction = parts[1]?.toLowerCase() || "asc";
    const dir = direction === "desc" ? -1 : 1;

    return [...data].sort((a, b) => {
      const aVal = this.getNestedValue(a, field);
      const bVal = this.getNestedValue(b, field);

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return dir;
      if (bVal == null) return -dir;

      // Handle date strings
      const aDate = Date.parse(aVal);
      const bDate = Date.parse(bVal);
      if (!isNaN(aDate) && !isNaN(bDate)) {
        return (aDate - bDate) * dir;
      }

      // Handle strings
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * dir;
      }

      // Handle numbers
      return (aVal - bVal) * dir;
    });
  }

  /**
   * Apply $top operation - limits results
   */
  private applyTop(data: any[], top: number): any[] {
    return data.slice(0, top);
  }

  /**
   * Apply $skip operation - skips first N results (for pagination)
   */
  private applySkip(data: any[], skip: number): any[] {
    return data.slice(skip);
  }

  async getListItems<T extends { value: any[] }>(options: {
    siteCollectionUrl?: string;
    listName: string;
    operations?: Sharepoint_Get_Operations;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
    cacheResponse?: boolean;
    mockResponse?: T;
  }): Promise<T | Sharepoint_Error_Formatted> {
    await this.simulateDelay(300);

    // If mockResponse provided, return it directly (escape hatch for testing)
    if (options.mockResponse !== undefined) {
      if (options.logToConsole) {
        console.log("[MockDataProvider] getListItems using mockResponse override", options.mockResponse);
      }
      return options.mockResponse;
    }

    // Get mock data from session store (includes any POST/UPDATE/DELETE changes)
    let mockData = [...this.getSessionData(options.listName)]; // Clone to avoid mutation during filtering
    // console.log(`[MockDataProvider] getListItems ${options.listName}, sessionItems=${mockData.length}, ids=[${mockData.map((i) => i.Id).join(",")}]`);

    // Simulate new entries being created during polling for testing live updates
    // Only for Story list, when cacheResponse is false (polling scenario), and with a Created >= filter
    const operations = options.operations;
    const hasCreatedFilter = operations && typeof operations !== "string" && operations.some(([op, value]) => op === "filter" && typeof value === "string" && /Created\s+ge\s+/.test(value));

    if (LOCAL_MODE && hasCreatedFilter && options.cacheResponse === false && options.listName === this.config.lists.Story?.name) {
      const currentCount = this.simulatedEntryCount.get(options.listName) || 0;

      // Randomly create 1 or 2 new entries per poll (50% chance for each)
      const numNewEntries = Math.random() > 0.5 ? (Math.random() > 0.5 ? 2 : 1) : 0;

      for (let i = 0; i < numNewEntries; i++) {
        const entryNum = currentCount + i + 1;
        // console.log(`[MockDataProvider] Simulating new story entry #${entryNum}`);

        const newStory = {
          Id: this.getNextId(options.listName),
          Title: `Live Update Story #${entryNum}`,
          Introduction: `This story was dynamically created during polling to test live updates. Created at ${new Date().toLocaleTimeString()}`,
          Content: `<h2>Live Update Test</h2><p>This story appeared dynamically during polling at ${new Date().toLocaleTimeString()} to demonstrate the live update feature.</p>`,
          Created: new Date().toISOString(),
          Modified: new Date().toISOString(),
          Author: { Id: 1, Title: "Modukuru, Sateeshsai" },
          Tags: "live,polling,test",
          CoverFileName: "1.avif",
          ActiveStatus: "Active",
          PublishStatus: "Published",
        };

        // Add to session store so it persists (will be picked up on next poll)
        const sessionData = this.getSessionData(options.listName);
        sessionData.push(newStory);
      }

      if (numNewEntries > 0) {
        this.simulatedEntryCount.set(options.listName, currentCount + numNewEntries);
      }
    }

    // Simulate new engagements during polling for testing live reaction/comment updates
    // Only for Engagements list, when cacheResponse is false (polling scenario), and with Parent/Id filter
    const hasParentIdFilter = operations && typeof operations !== "string" && operations.some(([op, value]) => op === "filter" && typeof value === "string" && /Parent\/Id\s+eq\s+\d+/.test(value));

    if (LOCAL_MODE && hasParentIdFilter && options.cacheResponse === false && options.listName === this.config.lists.Engagements?.name) {
      // Extract parentId from filter
      const filterOp = operations && typeof operations !== "string" && operations.find(([op, value]) => op === "filter" && typeof value === "string" && /Parent\/Id\s+eq\s+\d+/.test(String(value)));
      const parentIdMatch = filterOp ? String(filterOp[1]).match(/Parent\/Id\s+eq\s+(\d+)/) : null;
      const parentId = parentIdMatch ? parseInt(parentIdMatch[1], 10) : 1;

      const engagementKey = `${options.listName}_${parentId}`;
      const currentCount = this.simulatedEntryCount.get(engagementKey) || 0;

      // Randomly create 0-2 new engagements per poll (50% chance for each)
      const numNewEntries = Math.random() > 0.5 ? (Math.random() > 0.5 ? 2 : 1) : 0;

      // Emoji and comment options for simulation
      const reactionEmojis = ["❤️", "🚀", "⭐", "👏", "💡", "🎉"];
      const mockAuthors = [
        { Id: 1, Title: "Modukuru, Sateeshsai" },
        { Id: 2, Title: "Doe, John" },
        { Id: 3, Title: "Simpson, Homer" },
        { Id: 4, Title: "Test, User" },
      ];
      const mockComments = ["Great work on this!", "Very insightful content.", "I learned something new today.", "Thanks for sharing!", "This is really helpful."];

      for (let i = 0; i < numNewEntries; i++) {
        const entryNum = currentCount + i + 1;
        const isReaction = Math.random() > 0.3; // 70% reactions, 30% comments
        const randomAuthor = mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
        const now = new Date().toISOString();

        if (isReaction) {
          const emoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
          // console.log(`[MockDataProvider] Simulating new engagement reaction #${entryNum}: ${emoji}`);

          const newEngagement = {
            Id: this.getNextId(options.listName),
            Title: emoji,
            EngagementType: "Reaction",
            Content: null,
            Created: now,
            Modified: now,
            Author: randomAuthor,
            Parent: { Id: parentId, Title: `Parent ${parentId}` },
            ParentType: "Story",
          };

          const sessionData = this.getSessionData(options.listName);
          sessionData.push(newEngagement);
        } else {
          const comment = mockComments[Math.floor(Math.random() * mockComments.length)];
          // console.log(`[MockDataProvider] Simulating new engagement comment #${entryNum}`);

          const newEngagement = {
            Id: this.getNextId(options.listName),
            Title: "",
            EngagementType: "Comment",
            Content: comment,
            Created: now,
            Modified: now,
            Author: randomAuthor,
            Parent: { Id: parentId, Title: `Parent ${parentId}` },
            ParentType: "Story",
          };

          const sessionData = this.getSessionData(options.listName);
          sessionData.push(newEngagement);
        }
      }

      if (numNewEntries > 0) {
        this.simulatedEntryCount.set(engagementKey, currentCount + numNewEntries);
      }
    }

    // Apply operations in the order they are passed (respects caller's intent)
    if (operations && typeof operations !== "string") {
      for (const [op, value] of operations) {
        switch (op) {
          case "filter":
            if (typeof value === "string") {
              mockData = this.applyFilter(mockData, value);
            }
            break;
          case "orderby":
            if (typeof value === "string") {
              mockData = this.applyOrderBy(mockData, value);
            }
            break;
          case "skip":
            if (typeof value === "number") {
              mockData = this.applySkip(mockData, value);
            }
            break;
          case "top":
            if (typeof value === "number") {
              mockData = this.applyTop(mockData, value);
            }
            break;
          case "select":
            if (typeof value === "string") {
              mockData = this.applySelect(mockData, value);
            }
            break;
          case "expand":
            // $expand is handled implicitly - mock data already has nested objects populated
            // SharePoint's $expand tells the API to include related entities, which we already have
            break;
        }
      }
    } else if (typeof operations === "string") {
      // Handle raw query string format - parse and apply in standard order
      const opMap = this.parseOperations(operations);

      const filterExpr = opMap.get("filter");
      if (filterExpr && typeof filterExpr === "string") {
        mockData = this.applyFilter(mockData, filterExpr);
      }

      const orderbyExpr = opMap.get("orderby");
      if (orderbyExpr && typeof orderbyExpr === "string") {
        mockData = this.applyOrderBy(mockData, orderbyExpr);
      }

      const skipValue = opMap.get("skip");
      if (typeof skipValue === "number") {
        mockData = this.applySkip(mockData, skipValue);
      }

      const topValue = opMap.get("top");
      if (typeof topValue === "number") {
        mockData = this.applyTop(mockData, topValue);
      }

      const selectExpr = opMap.get("select");
      if (selectExpr && typeof selectExpr === "string") {
        mockData = this.applySelect(mockData, selectExpr);
      }
    }

    if (options.logToConsole) {
      console.log("[MockDataProvider] getListItems", {
        listName: options.listName,
        operations: options.operations,
        resultCount: mockData.length,
      });
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

  async getUserProperties<T extends Sharepoint_User_Properties>(options: {
    siteCollectionUrl?: string;
    accountName: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<T | Sharepoint_Error_Formatted> {
    await this.simulateDelay(300);

    // Extract username from accountName (could be email, emailId, or logonName)
    let username = options.accountName;
    if (username.includes("@")) {
      username = username.split("@")[0];
    } else if (username.includes("|")) {
      // Extract from logonName format: "i:0ǵ.t|adfs prod|username"
      const parts = username.split("|");
      username = parts[parts.length - 1];
    }
    username = username.toLowerCase();

    // Find matching user properties by AccountName or email
    const mockProps = LOCAL_SHAREPOINT_USERS_PROPERTIES.find((props) => {
      const accountName = props.AccountName?.toLowerCase() || "";
      const email = props.Email?.toLowerCase() || "";
      return accountName.includes(username) || email.includes(username);
    });

    if (!mockProps) {
      // Return first user as fallback
      return LOCAL_SHAREPOINT_USERS_PROPERTIES[0] as unknown as T;
    }

    return mockProps as unknown as T;
  }

  async getUser<T extends Sharepoint_User>(options: {
    siteCollectionUrl?: string;
    userId: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    deduplicationTtlMs?: number;
  }): Promise<T | Sharepoint_Error_Formatted> {
    await this.simulateDelay(300);

    // Find user by ID
    const userId = parseInt(options.userId, 10);
    const mockUser = LOCAL_SHAREPOINT_USERS.find((u) => u.Id === userId);

    if (!mockUser) {
      return { error: `User with ID ${options.userId} not found` };
    }

    return mockUser as unknown as T;
  }

  async ensureUserByEmailId<T extends Sharepoint_User>(options: {
    siteCollectionUrl?: string;
    emailId: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
  }): Promise<T | Sharepoint_Error_Formatted> {
    await this.simulateDelay(400);

    // Extract username from emailId
    let username = options.emailId;
    if (username.includes("@")) {
      username = username.split("@")[0];
    }
    username = username.toLowerCase();

    // Find matching user
    const mockUser = LOCAL_SHAREPOINT_USERS.find((user) => {
      const loginName = user.LoginName?.toLowerCase() || "";
      const email = user.Email?.toLowerCase() || "";
      return loginName.includes(username) || email.includes(username);
    });

    if (!mockUser) {
      // Return first user as fallback (ensureUser creates user if not exists)
      return LOCAL_SHAREPOINT_USERS[0] as unknown as T;
    }

    return mockUser as unknown as T;
  }

  async getFormDigestValue(options: { siteCollectionUrl?: string; logToConsole?: boolean; signal?: AbortSignal }): Promise<string | Sharepoint_Error_Formatted> {
    await this.simulateDelay(200);

    // Return a dummy form digest for mock requests
    return "0x1234567890ABCDEF";
  }

  async postListItem<T extends Record<string, any>>(options: {
    siteCollectionUrl?: string;
    listName: string;
    body: Record<string, any>;
    logToConsole?: boolean;
    signal?: AbortSignal;
    mockResponse?: T;
  }): Promise<T | Sharepoint_Error_Formatted> {
    await this.simulateDelay(400);

    // If mockResponse provided, return it directly (escape hatch for testing)
    if (options.mockResponse !== undefined) {
      if (options.logToConsole) {
        console.log("[MockDataProvider] postListItem using mockResponse override", options.mockResponse);
      }
      // Still add to session store so subsequent getListItems can find it
      const sessionData = this.getSessionData(options.listName);
      sessionData.push(options.mockResponse);
      return options.mockResponse;
    }

    const now = new Date().toISOString();
    const newId = this.getNextId(options.listName);

    // Create new item with SharePoint POST response format
    // POST responses return flat fields (AuthorId, EditorId) - NOT expanded objects
    // Expanded objects only come from GET with $expand
    const mockAuthor = LOCAL_SHAREPOINT_USERS[0];

    // POST response: keep lookup fields flat (e.g., ParentId stays as ParentId)
    // Do NOT expand to Parent: { Id, Title } - that's only for GET with $expand
    const newItem = {
      // SharePoint POST response metadata
      Id: newId,
      ID: newId, // SharePoint returns both Id and ID
      Created: now,
      Modified: now,
      AuthorId: mockAuthor?.Id ?? 1,
      EditorId: mockAuthor?.Id ?? 1,
      FileSystemObjectType: 0,
      ContentTypeId: "0x0100",
      OData__UIVersionString: "1.0",
      Attachments: false as const,
      GUID: crypto.randomUUID(),
      // Include posted data as-is (flat lookup IDs stay flat)
      ...options.body,
    };

    // For session store, we need expanded format for subsequent GET queries
    // Create a separate expanded version for the session
    const expandedItem = { ...newItem };
    // Expand lookup fields for session store (so GET with $expand works)
    for (const key of Object.keys(options.body)) {
      if (key.endsWith("Id") && typeof options.body[key] === "number") {
        const lookupFieldName = key.slice(0, -2);
        const lookupId = options.body[key];
        (expandedItem as any)[lookupFieldName] = { Id: lookupId, Title: `${lookupFieldName} ${lookupId}` };
      }
    }
    // Add Author as expanded for GET queries
    (expandedItem as any).Author = mockAuthor ? { Id: mockAuthor.Id, Title: mockAuthor.Title } : { Id: 1, Title: "Mock User" };

    // Add to session store so subsequent getListItems will find it
    // Use expanded version so GET with $expand works correctly
    const sessionData = this.getSessionData(options.listName);
    sessionData.push(expandedItem);

    if (options.logToConsole) {
      console.log("[MockDataProvider] postListItem", {
        listName: options.listName,
        newId,
        item: newItem,
      });
    }

    return newItem as unknown as T;
  }

  async readAndUploadFile(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    file: File;
    folder?: string;
    logToConsole?: boolean;
    signal?: AbortSignal;
    mockResponse?: Sharepoint_UploadFile_SuccessResponse;
  }): Promise<Sharepoint_UploadFile_SuccessResponse | Sharepoint_Error_Formatted> {
    await this.simulateDelay(500);

    // If mockResponse provided, return it directly (escape hatch for testing)
    if (options.mockResponse !== undefined) {
      if (options.logToConsole) {
        console.log("[MockDataProvider] readAndUploadFile using mockResponse override", options.mockResponse);
      }
      return options.mockResponse;
    }

    // Return a mock response matching Sharepoint_UploadFile_SuccessResponse
    const now = new Date().toISOString();
    return {
      Name: options.file.name,
      ServerRelativeUrl: `/${options.folder || "files"}/${options.file.name}`,
      Length: options.file.size,
      TimeCreated: now,
      TimeLastModified: now,
      UniqueId: crypto.randomUUID(),
      CheckInComment: "",
      CheckOutType: 0,
      ContentTag: "",
      CustomizedPageStatus: 0,
      ETag: "",
      Exists: true,
      IrmEnabled: false,
      Level: 1,
      LinkingUrl: "",
      MajorVersion: 1,
      MinorVersion: 0,
      UIVersion: 512,
      UIVersionLabel: "1.0",
    };
  }

  async updateListItem(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    body: Record<string, any>;
    logToConsole?: boolean;
    signal?: AbortSignal;
    mockResponse?: void;
  }): Promise<void | Sharepoint_Error_Formatted> {
    await this.simulateDelay(300);

    // If mockResponse provided (even if undefined/void), skip normal logic
    // For update, mockResponse is typically undefined to simulate success
    if ("mockResponse" in options) {
      if (options.logToConsole) {
        console.log("[MockDataProvider] updateListItem using mockResponse override");
      }
      return options.mockResponse;
    }

    const sessionData = this.getSessionData(options.listName);
    const itemIndex = sessionData.findIndex((item) => item.Id === options.itemId);

    if (itemIndex === -1) {
      return { error: `Item with Id ${options.itemId} not found in list ${options.listName}` };
    }

    // Update the item in session store
    sessionData[itemIndex] = {
      ...sessionData[itemIndex],
      ...options.body,
      Modified: new Date().toISOString(),
    };

    if (options.logToConsole) {
      console.log("[MockDataProvider] updateListItem", {
        listName: options.listName,
        itemId: options.itemId,
        updatedItem: sessionData[itemIndex],
      });
    }

    return;
  }

  async deleteListItem(options: {
    siteCollectionUrl?: string;
    listName: string;
    itemId: number;
    logToConsole?: boolean;
    signal?: AbortSignal;
    mockResponse?: void;
  }): Promise<void | Sharepoint_Error_Formatted> {
    await this.simulateDelay(300);

    // If mockResponse provided (even if undefined/void), skip normal logic
    // For delete, mockResponse is typically undefined to simulate success
    if ("mockResponse" in options) {
      if (options.logToConsole) {
        console.log("[MockDataProvider] deleteListItem using mockResponse override");
      }
      return options.mockResponse;
    }

    const sessionData = this.getSessionData(options.listName);
    const itemIndex = sessionData.findIndex((item) => item.Id === options.itemId);

    if (itemIndex === -1) {
      return { error: `Item with Id ${options.itemId} not found in list ${options.listName}` };
    }

    // Remove the item from session store
    sessionData.splice(itemIndex, 1);

    if (options.logToConsole) {
      console.log("[MockDataProvider] deleteListItem", {
        listName: options.listName,
        itemId: options.itemId,
      });
    }

    return;
  }
}
