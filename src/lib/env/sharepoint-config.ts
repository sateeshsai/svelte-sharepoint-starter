import { EngagementListSchema, EngagementPostSchema, FileListSchema, FilePostSchema_ForStory, StoryListSchema, StoryPostSchema, UserListSchema, UserPostSchema } from "$lib/data/schemas";
import { z, type ZodObject } from "zod";
import { AnalyticsEntryListSchema, AnalyticsEntryPostSchema } from "$lib/common-library/integrations/analytics/schemas";
import { ErrorReportListSchema, ErrorReportPostSchema } from "$lib/common-library/integrations/error-handling/error-schemas";
import { SHAREPOINT_PATHS, getFolderRelativePath } from "./sharepoint-paths";
import type { SharePointConfig } from "$lib/common-library/integrations";

/**
 * SharePoint configuration with list definitions and validation schemas
 * Uses runtime paths from sharepoint-paths.ts
 *
 * Note: Uses `satisfies` to validate config while preserving literal types
 * for better autocomplete (e.g., lists.Story vs lists[string])
 */
export const SHAREPOINT_CONFIG = {
  info: {
    version: "Version 1",
    emails: {
      support: {
        email: "smodukuru@deloitte.com",
        subject: "Site name: support request",
        body: "%0D%0A%0D%0APlease describe the issue you are facing, along with any additional details and screenshots",
        cc: [""],
        bcc: ["smodukuru@deloitte.com"],
      },
    },
  },
  lists: {
    Analytics: {
      name: "AnalyticsList",
      schemas: {
        list: AnalyticsEntryListSchema,
        post: AnalyticsEntryPostSchema,
      },
    },
    Story: {
      name: "StoryList",
      schemas: {
        list: StoryListSchema,
        post: StoryPostSchema,
      },
    },
    Engagements: {
      name: "EngagementsList",
      schemas: {
        list: EngagementListSchema,
        post: EngagementPostSchema,
      },
    },
    StoryFiles: {
      name: "FilesList",
      schemas: {
        list: FileListSchema,
        post: FilePostSchema_ForStory,
      },
    },
    UsersInfo: {
      name: "UsersInfoList",
      schemas: {
        list: UserListSchema,
        post: UserPostSchema,
      },
    },
    ErrorReports: {
      name: "ErrorReportsList",
      schemas: {
        list: ErrorReportListSchema,
        post: ErrorReportPostSchema,
      },
    },
  },
  folders: {
    StoryFiles: {
      name: "StoryFiles",
      rel_path: getFolderRelativePath(SHAREPOINT_PATHS.root) + "/assets/StoryFiles",
    },
  },
  paths: SHAREPOINT_PATHS,
} satisfies SharePointConfig;

/**
 * Type of the app's SharePoint configuration
 * Preserves literal types for better autocomplete
 */
export type AppSharePointConfig = typeof SHAREPOINT_CONFIG;
