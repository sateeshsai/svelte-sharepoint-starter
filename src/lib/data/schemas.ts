import { Sharepoint_Default_Props_Schema, SharepointTitleProps_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "$lib/common-library/integrations/sharepoint-rest-api/data/schemas";
import { z } from "zod";
import dayjs from "dayjs";
import {
  EngagementListSchema as GenericEngagementListSchema,
  EngagementPostSchema as GenericEngagementPostSchema,
  EngagementSchema as GenericEngagementSchema,
} from "$lib/common-library/integrations";

/**
 * Schema version for migration tracking
 * Increment when making breaking changes to schemas
 */
export const SCHEMA_VERSION = "1.0.0";

/** When updating schemas, verify derived types in ./types.ts */

/** File attachment schemas - used for story images/documents */
export const FileSchema = z.strictObject({
  Title: z.string().min(3, "File name must be at least 3 characters."),
  Description: z.string().max(255, "Description must be 255 characters or less."),
  ParentType: z.enum(["Story"], "Parent type is required."),
  FileOrder: z.number().positive("File order must be a positive number."),
});

export const FileListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...FileSchema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
  Parent: Sharepoint_Lookup_DefaultProps_Schema,
});

export const FilePostSchema = z.strictObject({
  // ...SharepointTitleProps_Schema.shape,
  ...FileSchema.shape,
  ParentId: z.number().positive("Parent ID is required."),
});

/** Variant with required description (for story image captions) */
export const FilePostSchema_ForStory = FilePostSchema.extend({
  Description: z.string().min(6, "Caption must be at least 6 characters.").max(255, "Caption can't be longer than 255 characters."),
});

export const storyFilesSchema = z.object({
  files: z.array(FilePostSchema_ForStory).min(1, "Add at least one supporting file."),
});

/**
 * Engagement schemas - tracks user interactions (emoji reactions and comments)
 * Configured for Story parent type, uses generic schemas from common library
 */
export const EngagementSchema = GenericEngagementSchema;
export const EngagementListSchema = GenericEngagementListSchema;
export const EngagementPostSchema = GenericEngagementPostSchema;

/** Story schemas - main content items with validation */
export const StorySchema = z.strictObject({
  Title: z.string().min(10, "Title must be at least 10 characters."),
  Content: z.string().min(10, "Content must be at least 10 characters."),
  Tags: z.string(), //Comma seperated string
  Introduction: z.string().min(10, "Introduction must be at least 10 characters.").max(255, "Introduction must be 255 characters or less."),
  CoverFileName: z.string().min(2, "Cover image is required."),
  ActiveStatus: z.enum(["Active", "Inactive"]),
  PublishStatus: z.enum(["Draft", "Published"]),
});

export const StoryListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...StorySchema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
});

export const StoryPostSchema = z.strictObject({
  // ...SharepointTitleProps_Schema.shape,
  ...StorySchema.shape,
});

/** User schemas - SharePoint user list with access roles */
export const UserSchema = z.strictObject({
  AccessRole: z.enum(["Admin"]).nullable(),
});

export const UserListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...UserSchema.shape,
  User: Sharepoint_Lookup_DefaultProps_Schema,
});

export const UserPostSchema = z.strictObject({
  ...SharepointTitleProps_Schema.shape,
  ...UserSchema.shape,
  UserId: z.number().positive("User ID is required."),
});

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// Centralized validation with consistent error handling
// ============================================================================

/**
 * Validate story data for POST/creation
 * @returns Typed success result or error with formatted message
 */
export function validateStoryForPost(data: unknown): { success: true; data: z.infer<typeof StoryPostSchema> } | { success: false; error: string } {
  const result = StoryPostSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") };
}

/**
 * Validate file data for POST/creation
 * @returns Typed success result or error with formatted message
 */
export function validateFileForPost(data: unknown): { success: true; data: z.infer<typeof FilePostSchema> } | { success: false; error: string } {
  const result = FilePostSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") };
}

/**
 * Validate story file data for POST/creation (with required description/caption)
 * @returns Typed success result or error with formatted message
 */
export function validateStoryFileForPost(data: unknown): { success: true; data: z.infer<typeof FilePostSchema_ForStory> } | { success: false; error: string } {
  const result = FilePostSchema_ForStory.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") };
}

/**
 * Validate multiple story files at once
 * @returns Typed success result or error with formatted message
 */
export function validateStoryFiles(data: unknown): { success: true; data: z.infer<typeof storyFilesSchema> } | { success: false; error: string } {
  const result = storyFilesSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") };
}
