import { EngagementListSchema, EngagementPostSchema, StoryListSchema, StoryPostSchema, StorySchema, UserListSchema, UserPostSchema } from "$lib/data/schemas";
import { z, type ZodObject } from "zod";
import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
import { AnalyticsEntryListSchema, AnalyticsEntryPostSchema } from "$lib/common-library/integrations/analytics/schemas";

export type SharepointListNames = "Story" | "Engagements" | "Files" | "UsersInfo" | "Analytics";
export type SharepointFolderNames = "StoryFiles";

const ROOT_FOLDER_PATH_RELATIVE_TO_SITE_COLLECTION_URL = "pages/builder-test/"; //https://americas.internal.deloitteonline.com/sites/sitename/<root folder relative path>/pagename.html

//DO NOT MODIFY _X varibales unless you know what you are doing.
const _PAGE_URL = window?.location.href.split("#")[0];
const _PAGE_URL_SPLIT = _PAGE_URL.split("/sites/");
const _SHAREPOINT_DOMAIN_URL = LOCAL_MODE ? _PAGE_URL : _PAGE_URL_SPLIT[0];
const _SHAREPOINT_SITECOLLECTION_NAME = LOCAL_MODE ? "" : _PAGE_URL_SPLIT?.[1]?.split("/")?.[0] ?? "";
const _SHAREPOINT_SITECOLLECTION_URL = _SHAREPOINT_DOMAIN_URL + (LOCAL_MODE ? "" : "/sites/" + _SHAREPOINT_SITECOLLECTION_NAME);
const _ROOT_FOLDER_REL_PATH = LOCAL_MODE ? "" : ROOT_FOLDER_PATH_RELATIVE_TO_SITE_COLLECTION_URL; // Set to "SitePages" if you need to host the files there
const _ROOT_FOLDER_URL = LOCAL_MODE ? _PAGE_URL : _SHAREPOINT_SITECOLLECTION_URL + "/" + _ROOT_FOLDER_REL_PATH;
const _ASSETS_FOLDER_URL = _ROOT_FOLDER_URL + "assets/";

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
    // server_relative: "sites/";
  };
  folders: Record<SharepointFolderNames, SharepointFolder>;
}

export const SHAREPOINT_ENV: SharepointEnv = {
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
  paths: {
    root: _ROOT_FOLDER_URL,
    assets: _ASSETS_FOLDER_URL,
    page: _PAGE_URL,
    domain: _SHAREPOINT_DOMAIN_URL,
    site_collection: _SHAREPOINT_SITECOLLECTION_URL,
    // server_relative: "sites/",
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
        list: EngagementListSchema,
        post: EngagementPostSchema,
      },
    },
    UsersInfo: {
      name: "UsersInfoList",
      schemas: {
        list: UserListSchema,
        post: UserPostSchema,
      },
    },
  },

  folders: {
    StoryFiles: {
      name: "StoryFiles",
      rel_path: _ROOT_FOLDER_URL.split(_SHAREPOINT_SITECOLLECTION_URL)[1] + "/assets/StoryFiles",
    },
  },
};

console.log(SHAREPOINT_ENV);
