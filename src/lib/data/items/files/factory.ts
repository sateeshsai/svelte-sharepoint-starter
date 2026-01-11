/**
 * File Factory Functions
 *
 * Factory functions for creating File items with default values.
 * Used for generating query templates and new item creation.
 */

import type { File_ListItem, File_PostItem } from "./schemas";

/**
 * Create File list item template with default values
 * Used primarily for generating $select/$expand queries via createSelectExpandQueries()
 * Not intended for actual new item creation - use createFilePostItem() instead
 */
export function createFileListItem(options: { ParentId: number; ParentType: File_PostItem["ParentType"] }): File_ListItem {
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
 * Create new File POST item with sensible defaults
 * Returns data ready to be posted to SharePoint
 * For story files, validate with File_PostItem_ForStory_Schema from stories/schemas
 */
export function createFilePostItem(options: { ParentId: number; ParentType: File_PostItem["ParentType"] }): File_PostItem {
  return {
    ParentId: options.ParentId,
    Title: "",
    Description: "",
    ParentType: options.ParentType,
    FileOrder: 1,
  };
}

/**
 * Convert File list item to POST format
 * For story files, validate result with File_PostItem_ForStory_Schema from stories/schemas
 */
export function fileListItemToPostItem(file: File_ListItem): File_PostItem {
  return {
    ParentId: file.Parent.Id,
    Title: file.Title,
    Description: file.Description,
    ParentType: file.ParentType,
    FileOrder: file.FileOrder,
  };
}
