/**
 * Integrations Module - Central Entry Point
 * Exports all integration functionality for the application
 *
 * This is the primary export point for all integrations.
 * App layer imports should use this barrel export rather than deep paths.
 */

// ============================================================================
// SharePoint REST API
// ============================================================================

// Config
export { validateSharePointConfig, SharePointConfigSchema } from "./sharepoint-rest-api/config";
export type { SharePointConfig } from "./sharepoint-rest-api/config";

// Data types and schemas
export type {
  Sharepoint_User,
  Sharepoint_User_Properties,
  Sharepoint_Error,
  Sharepoint_Error_Formatted,
  Sharepoint_FormDigestResponse,
  Sharepoint_Get_Operations,
  Sharepoint_PostItem_SuccessResponse_WithPostedData,
  Sharepoint_PostItemResponse,
  Sharepoint_UploadFile_SuccessResponse,
  Sharepoint_UpdateItemResponse,
  Sharepoint_UpdateItem_DataResponse,
  Sharepoint_Lookup_DefaultProps,
  Sharepoint_Default_Props,
  AccessRole,
} from "./sharepoint-rest-api/data";
export { Sharepoint_Default_Props_Schema, Sharepoint_Lookup_DefaultProps_Schema, LOCAL_SHAREPOINT_USERS, LOCAL_SHAREPOINT_USERS_PROPERTIES } from "./sharepoint-rest-api/data";

// REST Operations
export {
  // GET
  getListItems,
  getCurrentUser,
  getCurrentUserProperties,
  getFormDigestValue,
  // POST
  postListItem,
  readAndUploadFile,
  // UPDATE
  updateListItem,
  // DELETE
  deleteListItem,
  // Helpers
  poll,
  deduplicate,
} from "./sharepoint-rest-api/rest-functions";

// Constants
export { ACCESS_ROLES, RECOMMENDED_ERROR_ACTIONS_FOR_UI } from "./sharepoint-rest-api/constants";

// Utilities
export { createSelectExpandQueries, getPictureUrl, getUserFirstLastNames } from "./sharepoint-rest-api/utilities";

// Data Providers
export type { DataProvider } from "./sharepoint-rest-api/providers";
export { BaseMockDataProvider, SharePointDataProvider, getDataProvider, registerProviders } from "./sharepoint-rest-api/providers";

// ============================================================================
// Error Handling & Async State
// ============================================================================

export { reportError } from "./error-handling/error-api";
export type { ErrorReport_ListItem_Post, ErrorReport_ListItem, ErrorReportParams } from "./error-handling/error-types";
export { apiError, validationError, notFoundError, boundaryError } from "./error-handling/error-types";
export { ERROR_TYPES, ErrorReportListSchema, ErrorReportPostSchema } from "./error-handling/error-schemas";
export { AsyncSubmitState, AsyncLoadState } from "./error-handling/sharepoint-async-state.svelte";

// ============================================================================
// Analytics
// ============================================================================

export { trackAnalytics } from "./analytics/analytics";
export type { AnalyticsEntry_ListItem_Post, AnalyticsEntry_ListItem } from "./analytics/types";
export { AnalyticsEntryPostSchema, AnalyticsEntryListSchema } from "./analytics/schemas";

// ============================================================================
// Engagements (Reactions & Comments)
// ============================================================================

// Re-export engagement utilities and UI from the new colocated components folder
export {
  // Constants
  EMOJI_REACTIONS,
  EMOJI_REACTIONS_ARRAY,
  EMOJI_CATEGORIES,
  getEmojisByCategory,
  findEmojiReaction,
  getEmojiLabel,
  isValidEmoji,
  // Schemas
  EngagementSchema,
  EngagementListSchema,
  EngagementPostSchema,
  createEngagementSchema,
  createEngagementListSchema,
  createEngagementPostSchema,
  validateReactionForPost,
  validateCommentForPost,
  validateEngagementForPost,
  // Type guards
  isReaction,
  isComment,
  // Fetchers
  getEngagements,
  postReaction,
  postComment,
  deleteEngagement,
  groupReactionsByEmoji,
  getComments,
  getReactions,
} from "./components/engagements";
export type { EmojiReaction, EmojiCategory, Engagement_ListItem, Engagement_Post, EmojiReactionCount } from "./components/engagements";

// ============================================================================
// Router
// ============================================================================

export { navigating } from "./router/router-helpers.svelte";

// ============================================================================
// PWA
// ============================================================================

export { default as Head } from "./pwa/Head.svelte";
export { default as PWA } from "./pwa/PWA.svelte";
export { generateManifestData, type FixedWebAppManifest } from "./pwa/manifest";

// ============================================================================
// Rich Text Editor Components
// ============================================================================

// The Edra RTEs are specialized integrations - teams should import from their specific paths
// if they need to use them. They're not general-purpose utilities.
// export { EdraEditor, EdraToolBar, EdraDragHandleExtended } from "./components/rich-text/edra-rich-text/shadcn";
