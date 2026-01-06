import dayjs from "dayjs";
import { z } from "zod";
import { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema, SharepointTitleProps_Schema } from "../sharepoint-rest-api/data/schemas";

// ANALYTICS ENTRY
export const AnalyticsEntrySchema = z.strictObject({
  SessionId: z.string().max(255),
  Route: z.string().min(1).max(255),
  Data: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return typeof parsed === "object" && parsed !== null;
      } catch {
        return false;
      }
    },
    { message: "Data must be a valid JSON stringified object" }
  ),
});

export const AnalyticsEntryListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...AnalyticsEntrySchema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
});

export const AnalyticsEntryPostSchema = z.strictObject({
  ...SharepointTitleProps_Schema.shape,
  ...AnalyticsEntrySchema.shape,
});
