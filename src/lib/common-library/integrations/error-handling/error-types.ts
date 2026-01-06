import type z from "zod";
import type { ErrorReportListSchema, ErrorReportPostSchema } from "./error-schemas";

export type ErrorReport_ListItem = z.infer<typeof ErrorReportListSchema>;
export type ErrorReport_ListItem_Post = z.infer<typeof ErrorReportPostSchema>;
