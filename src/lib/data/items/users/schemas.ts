/**
 * User Schemas and Types
 *
 * This module defines the data structure for User items:
 * - User_Schema: Core fields for user access control
 * - UserListItem_Schema: Full schema including SharePoint metadata (for GET)
 * - UserPostItem_Schema: Schema for creating user records (for POST)
 *
 * @example
 * ```typescript
 * import { UserListItem_Schema, type User_ListItem } from "$lib/data/items/users/schemas";
 *
 * const users: User_ListItem[] = UserListItem_Schema.array().parse(apiResponse.value);
 * const admins = users.filter(u => u.AccessRole === "Admin");
 * ```
 */
import { Sharepoint_Default_Props_Schema, SharepointTitleProps_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "$lib/common-library/integrations/sharepoint-rest-api/data/schemas";
import { z } from "zod";

/**
 * Core User fields schema
 * AccessRole determines user permissions in the application
 */
export const User_Schema = z.strictObject({
  AccessRole: z.enum(["Admin"]).nullable(),
});

export const UserListItem_Schema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...User_Schema.shape,
  User: Sharepoint_Lookup_DefaultProps_Schema,
});

export const UserPostItem_Schema = z.strictObject({
  ...SharepointTitleProps_Schema.shape,
  ...User_Schema.shape,
  UserId: z.number().positive("User ID is required."),
});

/** Type definitions derived from schemas */
export type User_ListItem = z.infer<typeof UserListItem_Schema>;
export type User_PostItem = z.infer<typeof UserPostItem_Schema>;
