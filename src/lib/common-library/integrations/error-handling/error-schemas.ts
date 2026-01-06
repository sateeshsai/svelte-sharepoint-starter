// ERROR REPORT

import z from "zod";
import { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema } from "../sharepoint-rest-api/data/schemas";

export const ERROR_TYPES = ["Network", "Auth", "Validation", "Render", "Load", "Submit", "Other"] as const;
export const ErrorReportSchema = z.strictObject({
  Title: z.string().min(1, "Error message is required."),
  ErrorType: z.enum(ERROR_TYPES),
  Context: z.string().min(1, "Context is required."),
  TechnicalMessage: z.string().optional(),
  UserMessage: z.string().optional(),
  RouteUrl: z.string().optional(),
  BrowserUserAgent: z.string().optional(),
});

export const ErrorReportListSchema = z.strictObject({
  ...Sharepoint_Default_Props_Schema.shape,
  ...ErrorReportSchema.shape,
  Author: Sharepoint_Lookup_DefaultProps_Schema,
});

export const ErrorReportPostSchema = z.strictObject({
  ...ErrorReportSchema.shape,
});
