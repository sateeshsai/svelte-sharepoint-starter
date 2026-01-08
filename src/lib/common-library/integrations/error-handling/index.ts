/**
 * Error handling integration exports
 * Includes error reporting and SharePoint-integrated async state classes
 */

// Error reporting
export { reportError } from "./error-api";

// Error types, schemas, and helpers
export type { ErrorReport_ListItem_Post, ErrorReport_ListItem, ErrorReportParams, ErrorReportForUI } from "./error-types";
export { apiError, validationError, notFoundError, boundaryError, unknownError, offlineError, isOffline, createErrorReportForUI } from "./error-types";
export { ERROR_TYPES } from "./error-schemas";
export { ErrorReportListSchema, ErrorReportPostSchema } from "./error-schemas";

// SharePoint-integrated async state (with error reporting)
export { SharePointAsyncSubmitState, SharePointAsyncLoadState } from "./sharepoint-async-state.svelte";
