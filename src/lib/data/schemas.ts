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
export {
  StorySchema,
  StoryListSchema,
  StoryPostSchema,
  validateStoryForPost,
} from "$lib/data/items/stories/schemas";

// File schemas - re-export from domain folder
export {
  FileSchema,
  FileListSchema,
  FilePostSchema,
  FilePostSchema_ForStory,
  storyFilesSchema,
  validateFileForPost,
  validateStoryFileForPost,
  validateStoryFiles,
} from "$lib/data/items/files/schemas";

// User schemas - re-export from domain folder
export {
  UserSchema,
  UserListSchema,
  UserPostSchema,
} from "$lib/data/items/users/schemas";

// Engagement schemas - re-export from common library
export {
  EngagementSchema,
  EngagementListSchema,
  EngagementPostSchema,
} from "$lib/common-library/integrations/components/engagements/engagement-schemas";
