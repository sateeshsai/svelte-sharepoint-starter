/**
 * @deprecated This file is deprecated and will be removed in a future release.
 * Please import local data directly from their respective item folders:
 *
 * - LOCAL_STORY_ITEMS: import from "$lib/data/items/stories"
 * - LOCAL_FILES: import from "$lib/data/items/files"
 * - LOCAL_USERS: import from "$lib/data/items/users"
 * - LOCAL_ENGAGEMENTS: import from "$lib/common-library/integrations/components/engagements"
 * - LOCAL_ANALYTICS: import from "$lib/common-library/integrations/analytics"
 * - LOCAL_ERROR_REPORTS: import from "$lib/common-library/integrations/error-handling"
 *
 * Type aliases are now exported directly from the respective schema files.
 */

// Re-export local data from their new locations for backward compatibility
export { LOCAL_STORY_ITEMS } from "./items/stories/local-data";
export { LOCAL_FILES } from "./items/files/local-data";
export { LOCAL_USERS } from "./items/users/local-data";
export { LOCAL_ENGAGEMENTS } from "$lib/common-library/integrations/components/engagements/local-data";
export { LOCAL_ANALYTICS } from "$lib/common-library/integrations/analytics/local-data";
export { LOCAL_ERROR_REPORTS } from "$lib/common-library/integrations/error-handling/local-data";

// Re-export type aliases for backward compatibility
export type { AnalyticsEntry_ListItem as Analytics_ListItem } from "$lib/common-library/integrations/analytics/types";
export type { ErrorReport_ListItem } from "$lib/common-library/integrations/error-handling/error-types";
