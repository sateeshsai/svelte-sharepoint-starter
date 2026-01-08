/**
 * User Schemas and Types
 *
 * This module defines the data structure for User items:
 * - UserSchema: Core fields for user access control
 * - UserListSchema: Full schema including SharePoint metadata (for GET)
 * - UserPostSchema: Schema for creating user records (for POST)
 *
 * @example
 * ```typescript
 * import { UserListSchema, type User_ListItem } from "$lib/data/items/users/schemas";
 *
 * const users: User_ListItem[] = UserListSchema.array().parse(apiResponse.value);
 * const admins = users.filter(u => u.AccessRole === "Admin");
 * ```
 */
import { Sharepoint_Default_Props_Schema, SharepointTitleProps_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "$lib/common-library/integrations/sharepoint-rest-api/data/schemas";
import { z } from "zod";

/**
 * Core User fields schema
 * AccessRole determines user permissions in the application
 */
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

/** Type definitions derived from schemas */
export type User_ListItem = z.infer<typeof UserListSchema>;
export type User_ListItem_Post = z.infer<typeof UserPostSchema>;
