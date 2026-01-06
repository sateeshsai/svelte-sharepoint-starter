import {
  EngagementListSchema,
  EngagementPostSchema,
  FileListSchema,
  FilePostSchema,
  FilePostSchema_ForStory,
  StoryListSchema,
  StoryPostSchema,
  UserListSchema,
  UserPostSchema,
} from "$lib/data/schemas";
import type z from "zod";

//Type definitions derived from ./schemas.ts where applicable
export type Story_ListItem = z.infer<typeof StoryListSchema>;
export type Story_ListItem_Post = z.infer<typeof StoryPostSchema>;

export type Engagement_ListItem = z.infer<typeof EngagementListSchema>;
export type Engagement_ListItem_Post = z.infer<typeof EngagementPostSchema>;

export type File_ListItem = z.infer<typeof FileListSchema>;
export type File_ListItem_Post = z.infer<typeof FilePostSchema>;
export type File_ListItem_Post_ForStory = z.infer<typeof FilePostSchema_ForStory>;

export type User_ListItem = z.infer<typeof UserListSchema>;
export type User_ListItem_Post = z.infer<typeof UserPostSchema>;
