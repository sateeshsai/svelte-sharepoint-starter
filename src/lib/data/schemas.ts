/**
 * @deprecated Import from domain-specific folders instead:
 * - Stories: $lib/data/items/stories/schemas
 * - Files: $lib/data/items/files/schemas
 * - Users: $lib/data/items/users/schemas
 * - Engagements: $lib/common-library/integrations/components/engagements/engagement-schemas
 *
 * This file re-exports for backward compatibility only.
 */

// Schema version
export const SCHEMA_VERSION = "1.0.0";

// Story schemas - re-export from domain folder
export { Story_Schema, Story_ListItem_Schema, Story_PostItem_Schema, validateStoryForPost } from "$lib/data/items/stories/schemas";

// Story-specific file schemas - re-export from stories domain
export { StoryFiles_Schema, validateStoryFileForPost, validateStoryFiles } from "$lib/data/items/stories/schemas";
export type { File_PostItem_ForStory } from "$lib/data/items/stories/schemas";

// File schemas - re-export from domain folder
export { File_Schema, File_ListItem_Schema, File_PostItem_Schema, validateFileForPost } from "$lib/data/items/files/schemas";

// User schemas - re-export from domain folder
export { User_Schema, User_ListItem_Schema, User_PostItem_Schema } from "$lib/data/items/users/schemas";

// Engagement schemas - re-export from common library
export { EngagementSchema, EngagementListSchema, EngagementPostSchema } from "$lib/common-library/integrations/components/engagements/engagement-schemas";
