/**
 * Story Schemas, Types, and Validation
 *
 * This module defines the data structure for Story items:
 * - StorySchema: Core fields for story content
 * - StoryListSchema: Full schema including SharePoint metadata (for GET)
 * - StoryPostSchema: Schema for creating/updating stories (for POST/PATCH)
 *
 * @example
 * ```typescript
 * import { StoryListSchema, type Story_ListItem } from "$lib/data/items/stories/schemas";
 *
 * // Validate API response
 * const story = StoryListSchema.parse(apiResponse);
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
export const StorySchema = z.strictObject({
  Title: z.string().min(10, "Title must be at least 10 characters."),
  Content: z.string().min(10, "Content must be at least 10 characters."),
  Tags: z.string(), //Comma separated string
  Introduction: z.string().min(10, "Introduction must be at least 10 characters.").max(255, "Introduction must be 255 characters or less."),
  CoverFileName: z.string().min(2, "Cover image is required."),
  ActiveStatus: z.enum(["Active", "Inactive"]),
  PublishStatus: z.enum(["Draft", "Published"]),
});

/** Full Story schema including SharePoint metadata - use for GET responses */
export const StoryListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...StorySchema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
});

/** Story schema for POST/PATCH operations - excludes SharePoint metadata */
export const StoryPostSchema = z.strictObject({
  ...StorySchema.shape,
});

/** Type definitions derived from schemas */
export type Story_ListItem = z.infer<typeof StoryListSchema>;
export type Story_ListItem_Post = z.infer<typeof StoryPostSchema>;

/**
 * Validate story data for POST/creation
 * @returns Typed success result or error with formatted message
 */
export function validateStoryForPost(data: unknown): { success: true; data: Story_ListItem_Post } | { success: false; error: string } {
  const result = StoryPostSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") };
}
