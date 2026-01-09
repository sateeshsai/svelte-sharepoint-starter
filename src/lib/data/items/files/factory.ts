/**
 * File Factory Functions
 *
 * Factory functions for creating File items with default values.
 * Used for generating query templates and new item creation.
 */

import type { File_ListItem, File_ListItem_Post_ForStory } from "./schemas";

/**
 * Create File list item template with default values
 * Used primarily for generating $select/$expand queries via createSelectExpandQueries()
 * Not intended for actual new item creation - use createFilePost() instead
 */
export function createFileTemplate(options: { ParentId: number; ParentType: File_ListItem_Post_ForStory["ParentType"] }): File_ListItem {
  return {
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
}

/**
 * Create new File POST item with sensible defaults for story attachments
 * Returns data ready to be posted to SharePoint
 */
export function createFilePost(options: { ParentId: number; ParentType: File_ListItem_Post_ForStory["ParentType"] }): File_ListItem_Post_ForStory {
  return {
    ParentId: options.ParentId,
    Title: "",
    Description: "",
    ParentType: options.ParentType,
    FileOrder: 1,
  };
}

/**
 * Convert File list item to POST format for story attachments
 * Useful when editing an existing file
 */
export function fileToPost(file: File_ListItem): File_ListItem_Post_ForStory {
  return {
    ParentId: file.Parent.Id,
    Title: file.Title,
    Description: file.Description,
    ParentType: file.ParentType,
    FileOrder: file.FileOrder,
  };
}
