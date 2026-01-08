/**
 * @deprecated Import from domain-specific folders instead:
 * - Stories: $lib/data/items/stories/schemas
 * - Files: $lib/data/items/files/schemas
 * - Users: $lib/data/items/users/schemas
 * - Engagements: $lib/common-library/integrations
 *
 * This file re-exports for backward compatibility only.
 */

// Story types
export type {
  Story_ListItem,
  Story_ListItem_Post,
} from "$lib/data/items/stories/schemas";

// File types
export type {
  File_ListItem,
  File_ListItem_Post,
  File_ListItem_Post_ForStory,
} from "$lib/data/items/files/schemas";

// User types
export type {
  User_ListItem,
  User_ListItem_Post,
} from "$lib/data/items/users/schemas";

// Engagement types - re-export from common library
export type { Engagement_ListItem, Engagement_Post as Engagement_ListItem_Post } from "$lib/common-library/integrations";
