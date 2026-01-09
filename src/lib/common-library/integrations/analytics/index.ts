/**
 * Analytics integration exports
 * Includes tracking functions, schemas, types, and mock data
 */

// Analytics tracking
export { trackAnalytics } from "./analytics";

// Schemas and validation
export { AnalyticsEntrySchema, AnalyticsEntryListSchema, AnalyticsEntryPostSchema } from "./schemas";

// Types
export type { AnalyticsEntry_ListItem, AnalyticsEntry_ListItem_Post } from "./types";

// Local mock data
export { LOCAL_ANALYTICS } from "./local-data";
