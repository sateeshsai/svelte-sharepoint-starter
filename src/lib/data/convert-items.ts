/**
 * @deprecated Import from domain-specific folders instead:
 * - Stories: import { storyListItemToPostItem } from "$lib/data/items/stories/factory"
 * - Files: import { fileListItemToPostItem } from "$lib/data/items/files/factory"
 *
 * This file re-exports for backward compatibility only.
 */

import { storyListItemToPostItem } from "$lib/data/items/stories/factory";
import { fileListItemToPostItem } from "$lib/data/items/files/factory";
import type { Story_PostItem, Story_ListItem } from "$lib/data/items/stories/schemas";
import type { File_ListItem, File_PostItem } from "$lib/data/items/files/schemas";

/** @deprecated Use storyListItemToPostItem from $lib/data/items/stories/factory */
export function convert_Story_ListItem_ToPostItem(storyListItem: Story_ListItem): Story_PostItem {
  return storyListItemToPostItem(storyListItem);
}

/** @deprecated Use fileListItemToPostItem from $lib/data/items/files/factory */
export function convert_File_ListItem_ToPostItem(fileListItem: File_ListItem): File_PostItem {
  return fileListItemToPostItem(fileListItem);
}
