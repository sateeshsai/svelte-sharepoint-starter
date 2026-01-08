import { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "$lib/common-library/integrations/sharepoint-rest-api/data/schemas";
import { z } from "zod";

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

/** Type definitions derived from schemas */
export type File_ListItem = z.infer<typeof FileListSchema>;
export type File_ListItem_Post = z.infer<typeof FilePostSchema>;
export type File_ListItem_Post_ForStory = z.infer<typeof FilePostSchema_ForStory>;

/**
 * Validate file data for POST/creation
 * @returns Typed success result or error with formatted message
 */
export function validateFileForPost(data: unknown): { success: true; data: File_ListItem_Post } | { success: false; error: string } {
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
export function validateStoryFileForPost(data: unknown): { success: true; data: File_ListItem_Post_ForStory } | { success: false; error: string } {
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
