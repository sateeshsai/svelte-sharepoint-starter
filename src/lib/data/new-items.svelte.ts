/** Factory functions for creating new list items with default values */

import type { File_ListItem, File_ListItem_Post_ForStory, Story_ListItem, Story_ListItem_Post, File_ListItem_Post } from "$lib/data/types";

/**
 * Create Story list item template with default values
 * Used primarily for generating $select/$expand queries via createSelectExpandQueries()
 * Not intended for actual new item creation - use createNew_Story_Post() instead
 */
export function createNew_Story_ListItem(): Story_ListItem {
  const story: Story_ListItem = {
    Id: 1,
    Created: "",
    Modified: "",
    Title: "New story",
    Introduction: "Brief intro for the story",
    Author: {
      Id: 1,
      Title: "",
    },
    Content: "New story content",
    Tags: "",
    CoverFileName: "",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  };
  return story;
}

/**
 * Create File list item template with default values
 * Used primarily for generating $select/$expand queries via createSelectExpandQueries()
 * Not intended for actual new item creation - use createNew_File_Post() instead
 */
export function createNew_File_ListItem(options: { ParentId: number; ParentType: File_ListItem_Post_ForStory["ParentType"] }): File_ListItem {
  const file: File_ListItem = {
    Id: 1,
    Created: "",
    Modified: "",
    Title: "Story title goes here",
    Author: {
      Id: 1,
      Title: "",
    },
    Parent: {
      Id: options.ParentId,
      Title: "",
    },
    ParentType: options.ParentType,
    Description: "",
    FileOrder: 1,
  };
  return file;
}

/**
 * Create new Story POST item with sensible defaults for actual item creation
 * Returns data ready to be posted to SharePoint
 */
export function createNew_Story_Post(): Story_ListItem_Post {
  return {
    Title: "Untitled Story",
    Introduction: "Add a brief introduction for your story...",
    Content: "<h1>Your Story Title</h1><p>Start writing your story here...</p>",
    Tags: "",
    CoverFileName: "",
    ActiveStatus: "Active",
    PublishStatus: "Draft",
  };
}

/**
 * Create new File POST item with sensible defaults for story attachments
 * Returns data ready to be posted to SharePoint
 */
export function createNew_File_Post(options: { ParentId: number; ParentType: File_ListItem_Post_ForStory["ParentType"] }): File_ListItem_Post_ForStory {
  return {
    ParentId: options.ParentId,
    Title: "",
    Description: "",
    ParentType: options.ParentType,
    FileOrder: 1,
  };
}
