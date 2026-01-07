/** Factory functions for creating new list items with default values */

import type { File_ListItem, File_ListItem_Post_ForStory, Story_ListItem } from "$lib/data/types";

/** Create Story list item with default values (useful for forms and select/expand queries) */
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
    Engagements: [],
    Content: "New story content",
    Tags: "",
    CoverFileName: "",
    ActiveStatus: "Active",
    PublishStatus: "Published",
  };
  return story;
}

/** Create File list item with default values for story attachments */
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
