import { Story_ListItem_Schema, Story_PostItem_Schema, File_PostItem_ForStory_Schema } from "$lib/data/items/stories/schemas";
import { File_ListItem_Schema } from "$lib/data/items/files/schemas";
import { User_ListItem_Schema, User_PostItem_Schema } from "$lib/data/items/users/schemas";
import { EngagementListSchema, EngagementPostSchema } from "$lib/common-library/integrations/components/engagements/engagement-schemas";
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
  /** Unique short name - used for IndexedDB cache isolation between projects */
  shortname: "starter",
  info: {
    version: "Version 1",
    emails: {
      support: {
        email: "sateesh.modukuru@yourdomain.com",
        subject: "Site name: support request",
        body: "Please describe the issue you are facing, along with any additional details and screenshots",
        cc: [""],
        bcc: ["sateesh.modukuru@yourdomain.com"],
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
        list: Story_ListItem_Schema,
        post: Story_PostItem_Schema,
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
        list: File_ListItem_Schema,
        post: File_PostItem_ForStory_Schema,
      },
    },
    UsersInfo: {
      name: "UsersInfoList",
      schemas: {
        list: User_ListItem_Schema,
        post: User_PostItem_Schema,
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
  pwa: {
    name: "Svelte + SharePoint starter",
    short_name: "Starter",
    description: "A batteries-included starter project.",
    install_description: "Install this as an app on your device for easy access.",
    theme_color: "black",
    background_color: "black",
  },
  paths: SHAREPOINT_PATHS,
} satisfies SharePointConfig;

/**
 * Type of the app's SharePoint configuration
 * Preserves literal types for better autocomplete
 */
export type AppSharePointConfig = typeof SHAREPOINT_CONFIG;
