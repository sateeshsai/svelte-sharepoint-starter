import { Sharepoint_Default_Props_Schema, SharepointTitleProps_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "$lib/common-library/sharepoint-rest-api/schemas";
import { z } from "zod";
import dayjs from "dayjs";

// FILEDETAILS
export const FileSchema = z.strictObject({
  Title: z.string().min(3, "File name is required."),
  Description: z.string().max(255),
  ParentType: z.enum(["Story"], "Parent type is required."),
  FileOrder: z.number().positive(),
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
  ParentId: z.number().positive("Parent Id is required."),
});

//VARIANT TO MAKE DESCRIPTION A REQUIRED PROPERTY
export const FilePostSchema_ForStory = FilePostSchema.extend({
  Description: z.string().min(6, "Caption must be at least 6 characters.").max(255, "Caption can't be longer than 255 characters."),
});

export const storyFilesSchema = z.object({
  files: z.array(FilePostSchema_ForStory).min(1, "Add at least one supporting file."),
});

// ENGAGEMENT
export const EngagementSchema = z.strictObject({
  ParentType: z.enum(["Story"], "Parent type is required."),
});

export const EngagementListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...EngagementSchema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
  Parent: Sharepoint_Lookup_DefaultProps_Schema,
});

export const EngagementPostSchema = z.strictObject({
  ...SharepointTitleProps_Schema.shape,
  ...EngagementSchema.shape,
  ParentId: z.number().positive(),
});

// STORY
export const StorySchema = z.strictObject({
  Title: z.string().min(10, "Minimum 10 characters."),
  Content: z.string().min(10, "Minimum 100 characters."),
  Tags: z.string(), //Comma seperated string
  Introduction: z.string("Minimum 10 and maximum 255 characters.").min(10).max(255),
  CoverFileName: z.string().min(2, "Please add cover art."),
});

export const StoryListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...StorySchema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
  Engagements: z.array(EngagementSchema),
});

export const StoryPostSchema = z.strictObject({
  // ...SharepointTitleProps_Schema.shape,
  ...StorySchema.shape,
});

// USER
export const UserSchema = z.strictObject({
  AccessRole: z.literal(["Admin"]).nullable(),
});

export const UserListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...UserSchema.shape,
  User: Sharepoint_Lookup_DefaultProps_Schema,
});

export const UserPostSchema = z.strictObject({
  ...SharepointTitleProps_Schema.shape,
  ...UserSchema.shape,
  UserId: z.number().positive(),
});
