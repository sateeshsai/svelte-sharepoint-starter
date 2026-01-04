// To create new objects

import type { File_ListItem, File_ListItem_Post_ForStory, Story_ListItem } from "$lib/data/types";

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
  };
  return story;
}

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
