import { Sharepoint_Default_Props_Schema, SharepointTitleProps_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "$lib/common-library/integrations/sharepoint-rest-api/data/schemas";
import { z } from "zod";

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

/** Type definitions derived from schemas */
export type User_ListItem = z.infer<typeof UserListSchema>;
export type User_ListItem_Post = z.infer<typeof UserPostSchema>;
