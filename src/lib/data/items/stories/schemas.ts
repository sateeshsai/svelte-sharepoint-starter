/**
 * Story Schemas, Types, and Validation
 *
 * This module defines the data structure for Story items:
 * - Story_Schema: Core fields for story content
 * - StoryListItem_Schema: Full schema including SharePoint metadata (for GET)
 * - StoryPostItem_Schema: Schema for creating/updating stories (for POST/PATCH)
 *
 * @example
 * ```typescript
 * import { StoryListItem_Schema, type Story_ListItem } from "$lib/data/items/stories/schemas";
 *
 * // Validate API response
 * const story = StoryListItem_Schema.parse(apiResponse);
 *
 * // Type-safe usage
 * const stories: Story_ListItem[] = validatedData;
 * ```
 */
import { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "$lib/common-library/integrations/sharepoint-rest-api/data/schemas";
import { z } from "zod";

/**
 * Core Story fields schema
 * Used as base for both list and post schemas
 */
export const Story_Schema = z.strictObject({
  Title: z.string().min(10, "Title must be at least 10 characters."),
  Content: z.string().min(10, "Content must be at least 10 characters."),
  Tags: z.string(), //Comma separated string
  Introduction: z.string().min(10, "Introduction must be at least 10 characters.").max(255, "Introduction must be 255 characters or less."),
  CoverFileName: z.string().min(2, "Cover image is required."),
  ActiveStatus: z.enum(["Active", "Inactive"]),
  PublishStatus: z.enum(["Draft", "Published"]),
});

/** Full Story schema including SharePoint metadata - use for GET responses */
export const StoryListItem_Schema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...Story_Schema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
});

/** Story schema for POST/PATCH operations - excludes SharePoint metadata */
export const StoryPostItem_Schema = z.strictObject({
  ...Story_Schema.shape,
});

/** Type definitions derived from schemas */
export type Story_ListItem = z.infer<typeof StoryListItem_Schema>;
export type Story_PostItem = z.infer<typeof StoryPostItem_Schema>;

/**
 * Validate story data for POST/creation
 * @returns Typed success result or error with formatted message
 */
export function validateStoryForPost(data: unknown): { success: true; data: Story_PostItem } | { success: false; error: string } {
  const result = StoryPostItem_Schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") };
}

// ============================================================================
// Story-specific File Schemas
// These extend base FilePostItem_Schema with story-specific validation rules
// ============================================================================

import { FilePostItem_Schema } from "$lib/data/items/files/schemas";

/** File schema with required caption for story images */
export const FilePostItem_ForStory_Schema = FilePostItem_Schema.extend({
  Description: z.string().min(6, "Caption must be at least 6 characters.").max(255, "Caption can't be longer than 255 characters."),
});

/** Validates array of story files */
export const StoryFiles_Schema = z.object({
  files: z.array(FilePostItem_ForStory_Schema).min(1, "Add at least one supporting file."),
});

/** Type for story file POST data */
export type File_PostItem_ForStory = z.infer<typeof FilePostItem_ForStory_Schema>;

/**
 * Validate story file data for POST/creation (with required description/caption)
 * @returns Typed success result or error with formatted message
 */
export function validateStoryFileForPost(data: unknown): { success: true; data: File_PostItem_ForStory } | { success: false; error: string } {
  const result = FilePostItem_ForStory_Schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") };
}

/**
 * Validate multiple story files at once
 * @returns Typed success result or error with formatted message
 */
export function validateStoryFiles(data: unknown): { success: true; data: z.infer<typeof StoryFiles_Schema> } | { success: false; error: string } {
  const result = StoryFiles_Schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") };
}
