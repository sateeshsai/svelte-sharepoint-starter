import { EngagementListSchema, EngagementPostSchema, FileListSchema, FilePostSchema_ForStory, StoryListSchema, StoryPostSchema, UserListSchema, UserPostSchema } from "$lib/data/schemas";
import { z, type ZodObject } from "zod";
import { AnalyticsEntryListSchema, AnalyticsEntryPostSchema } from "$lib/common-library/integrations/analytics/schemas";
import { ErrorReportListSchema, ErrorReportPostSchema } from "$lib/common-library/integrations/error-handling/error-schemas";
import { SHAREPOINT_PATHS, getFolderRelativePath } from "./sharepoint-paths";

export type SharepointListNames = "Story" | "Engagements" | "Files" | "UsersInfo" | "Analytics" | "ErrorReports";
export type SharepointFolderNames = "StoryFiles";

export interface SharepointList {
  name: string;
  schemas: {
    list: ZodObject;
    post: ZodObject;
  };
}

export interface SharepointFolder {
  name: string;
  rel_path: string;
}

export interface SharepointEnv {
  info: { version: string; emails: { support: { email: string; subject: string; body: string; cc: string[]; bcc: string[] } } };
  lists: Record<SharepointListNames, SharepointList>;
  paths: {
    root: string;
    assets: string;
    page: string;
    domain: string;
    site_collection: string;
  };
  folders: Record<SharepointFolderNames, SharepointFolder>;
}

/**
 * Static SharePoint configuration
 * Contains list definitions with their validation schemas and folder configurations
 * Uses runtime paths from sharepoint-paths.ts
 */
export const SHAREPOINT_CONFIG: SharepointEnv = {
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
    Files: {
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
};

console.log(SHAREPOINT_CONFIG);
