import type z from "zod";
import type { AnalyticsEntryListSchema, AnalyticsEntryPostSchema } from "./schemas";

export type AnalyticsEntry_ListItem = z.infer<typeof AnalyticsEntryListSchema>;
export type AnalyticsEntry_ListItem_Post = z.infer<typeof AnalyticsEntryPostSchema>;
