/**
 * File Schemas, Types, and Validation
 *
 * This module defines the data structure for File attachments:
 * - File_Schema: Core fields for file metadata
 * - File_ListItem_Schema: Full schema including SharePoint metadata (for GET)
 * - File_PostItem_Schema: Schema for uploading files (for POST)
 *
 * Story-specific file schemas (File_PostItem_ForStory_Schema, StoryFiles_Schema) are in
 * $lib/data/items/stories/schemas to maintain proper module isolation.
 *
 * @example
 * ```typescript
 * import { validateFileForPost, type File_ListItem } from "$lib/data/items/files/schemas";
 *
 * const result = validateFileForPost(fileData);
 * if (result.success) {
 *   await uploadFile(result.data);
 * }
 * ```
 */
import { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "$lib/common-library/integrations/sharepoint-rest-api/data/schemas";
import { z } from "zod";

/**
 * Core File fields schema
 * Used as base for both list and post schemas
 */
export const File_Schema = z.strictObject({
  Title: z.string().min(3, "File name must be at least 3 characters."),
  Description: z.string().max(255, "Description must be 255 characters or less."),
  ParentType: z.enum(["Story"], "Parent type is required."),
  FileOrder: z.number().positive("File order must be a positive number."),
});

export const File_ListItem_Schema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...File_Schema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
  Parent: Sharepoint_Lookup_DefaultProps_Schema,
});

export const File_PostItem_Schema = z.strictObject({
  ...File_Schema.shape,
  ParentId: z.number().positive("Parent ID is required."),
});

/** Type definitions derived from schemas */
export type File_ListItem = z.infer<typeof File_ListItem_Schema>;
export type File_PostItem = z.infer<typeof File_PostItem_Schema>;

/**
 * Validate file data for POST/creation
 * @returns Typed success result or error with formatted message
 */
export function validateFileForPost(data: unknown): { success: true; data: File_PostItem } | { success: false; error: string } {
  const result = File_PostItem_Schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") };
}
