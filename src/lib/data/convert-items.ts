import type { Story_ListItem_Post, Story_ListItem, File_ListItem, File_ListItem_Post_ForStory } from "$lib/data/types";

export function convert_Story_ListItem_ToPost(storyListItem: Story_ListItem): Story_ListItem_Post {
  return {
    Title: storyListItem.Title,
    Introduction: storyListItem.Introduction,
    Content: storyListItem.Content,
    Tags: storyListItem.Tags,
    CoverFileName: storyListItem.CoverFileName,
    PublishStatus: storyListItem.PublishStatus,
    ActiveStatus: storyListItem.ActiveStatus,
  };
}

export function convert_File_ListItem_To_Post(fileListItem: File_ListItem): File_ListItem_Post_ForStory {
  return {
    ParentId: fileListItem.Id,
    Title: fileListItem.Title,
    Description: fileListItem.Description,
    ParentType: fileListItem.ParentType,
    FileOrder: fileListItem.FileOrder,
  };
}
