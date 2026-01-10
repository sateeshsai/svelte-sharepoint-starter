/**
 * Story Factory Functions
 *
 * Factory functions for creating Story items with default values.
 * Used for generating query templates and new item creation.
 */

import type { Story_ListItem, Story_PostItem } from "./schemas";

/**
 * Create Story list item template with default values
 * Used primarily for generating $select/$expand queries via createSelectExpandQueries()
 * Not intended for actual new item creation - use createStoryPostItem() instead
 */
export function createStoryListItem(): Story_ListItem {
  return {
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
}

/**
 * Create new Story POST item with sensible defaults for actual item creation
 * Returns data ready to be posted to SharePoint
 */
export function createStoryPostItem(): Story_PostItem {
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
 * Convert Story list item to POST format (strips SharePoint metadata)
 * Useful when editing an existing story
 */
export function storyListItemToPostItem(story: Story_ListItem): Story_PostItem {
  return {
    Title: story.Title,
    Introduction: story.Introduction,
    Content: story.Content,
    Tags: story.Tags,
    CoverFileName: story.CoverFileName,
    PublishStatus: story.PublishStatus,
    ActiveStatus: story.ActiveStatus,
  };
}
