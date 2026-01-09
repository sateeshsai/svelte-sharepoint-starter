/**
 * @deprecated Import from domain-specific folders instead:
 * - Stories: import { storyToPost } from "$lib/data/items/stories/factory"
 * - Files: import { fileToPost } from "$lib/data/items/files/factory"
 *
 * This file re-exports for backward compatibility only.
 */

import { storyToPost } from "$lib/data/items/stories/factory";
import { fileToPost } from "$lib/data/items/files/factory";
import type { Story_ListItem_Post, Story_ListItem } from "$lib/data/items/stories/schemas";
import type { File_ListItem, File_ListItem_Post_ForStory } from "$lib/data/items/files/schemas";

/** @deprecated Use storyToPost from $lib/data/items/stories/factory */
export function convert_Story_ListItem_ToPost(storyListItem: Story_ListItem): Story_ListItem_Post {
  return storyToPost(storyListItem);
}

/** @deprecated Use fileToPost from $lib/data/items/files/factory */
export function convert_File_ListItem_To_Post(fileListItem: File_ListItem): File_ListItem_Post_ForStory {
  return fileToPost(fileListItem);
}
