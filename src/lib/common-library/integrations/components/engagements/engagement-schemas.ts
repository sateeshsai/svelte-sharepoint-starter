import { z } from "zod";
import { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "../../sharepoint-rest-api/data/schemas";

/**
 * Base engagement schema - reactions and comments on content items
 * Extends SharePoint default props for consistent list item structure
 */
export const EngagementSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  Title: z.string(), // Emoji for reactions, empty for comments
  Parent: Sharepoint_Lookup_DefaultProps_Schema,
  ParentType: z.string(),
  EngagementType: z.enum(["Reaction", "Comment"]),
  Content: z.string().nullable(), // Comment text, null for reactions
  Author: Sharepoint_Lookup_DefaultProps_Schema,
});

/** Schema for creating engagements - no SharePoint-generated fields */
export const EngagementPostSchema = z.strictObject({
  Title: z.string().optional(),
  ParentId: z.number().positive(),
  ParentType: z.string(),
  EngagementType: z.enum(["Reaction", "Comment"]),
  Content: z.string().optional(),
});

/** Inferred types from schemas */
export type Engagement_ListItem = z.infer<typeof EngagementSchema>;
export type Engagement_Post = z.infer<typeof EngagementPostSchema>;

/** Legacy alias for list schema - use EngagementSchema directly */
export const EngagementListSchema = EngagementSchema;

/**
 * Factory to create engagement schema with custom parent type enum
 * Use when you need to restrict ParentType to specific values
 */
export function createEngagementSchema<T extends [string, ...string[]]>(parentTypes: T) {
  return EngagementSchema.extend({
    ParentType: z.enum(parentTypes),
  });
}

export function createEngagementListSchema<T extends [string, ...string[]]>(parentTypes: T) {
  return createEngagementSchema(parentTypes);
}

export function createEngagementPostSchema<T extends [string, ...string[]]>(parentTypes: T) {
  return EngagementPostSchema.extend({
    ParentType: z.enum(parentTypes),
  });
}

/** Validation helpers for post operations */
export function validateReactionForPost(emoji: string, parentId: number, parentType = "Story") {
  return EngagementPostSchema.parse({
    Title: emoji,
    ParentId: parentId,
    ParentType: parentType,
    EngagementType: "Reaction",
    Content: "",
  });
}

export function validateCommentForPost(text: string, parentId: number, parentType = "Story") {
  return EngagementPostSchema.parse({
    Title: "",
    ParentId: parentId,
    ParentType: parentType,
    EngagementType: "Comment",
    Content: text,
  });
}

export function validateEngagementForPost(data: unknown) {
  return EngagementPostSchema.parse(data);
}

/** Type guards */
export function isReaction(engagement: Engagement_ListItem): boolean {
  return engagement.EngagementType === "Reaction";
}

export function isComment(engagement: Engagement_ListItem): boolean {
  return engagement.EngagementType === "Comment";
}
