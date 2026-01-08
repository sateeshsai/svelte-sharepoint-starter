import type { Story_ListItem_Post, Story_ListItem } from "$lib/data/items/stories/schemas";
import type { File_ListItem, File_ListItem_Post_ForStory } from "$lib/data/items/files/schemas";

/** Convert Story list item to POST format (strips SharePoint metadata) */
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

/** Convert File list item to POST format for story attachments */
export function convert_File_ListItem_To_Post(fileListItem: File_ListItem): File_ListItem_Post_ForStory {
  return {
    ParentId: fileListItem.Parent.Id,
    Title: fileListItem.Title,
    Description: fileListItem.Description,
    ParentType: fileListItem.ParentType,
    FileOrder: fileListItem.FileOrder,
  };
}
