/**
 * Error handling integration exports
 * Includes error reporting and error type helpers
 */

// Error reporting
export { reportError } from "./error-api";

// Error types, schemas, and helpers
export type { ErrorReport_ListItem_Post, ErrorReport_ListItem, ErrorReportParams, ErrorReportForUI } from "./error-types";
export { apiError, validationError, notFoundError, boundaryError, unknownError, offlineError, isOffline, createErrorReportForUI, createMailtoLink } from "./error-types";
export { ERROR_TYPES } from "./error-schemas";
export { ErrorReportListSchema, ErrorReportPostSchema } from "./error-schemas";

// Local mock data
export { LOCAL_ERROR_REPORTS } from "./local-data";
