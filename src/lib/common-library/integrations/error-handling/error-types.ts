import type z from "zod";
import type { ErrorReportListSchema, ErrorReportPostSchema, ERROR_TYPES } from "./error-schemas";

/** SharePoint list item from ErrorReports list */
export type ErrorReport_ListItem = z.infer<typeof ErrorReportListSchema>;

/** Data for POST to SharePoint ErrorReports list */
export type ErrorReport_ListItem_Post = z.infer<typeof ErrorReportPostSchema>;

/**
 * Parameters for error reporting - used by setError in async state classes
 * Derived from ErrorReport_ListItem_Post with required user/tech messages and runtime-only fields
 */
export type ErrorReportParams = {
  /** Technical details for developers/logs (required for setError) */
  technicalMessage: string;
  /** User-friendly message shown in UI (required for setError) */
  userMessage: string;
  /** Error category - defaults based on state class type */
  errorType?: (typeof ERROR_TYPES)[number];
  /** Where the error occurred (component/function name) */
  context?: string;
  /** Log to console instead of posting to SharePoint (runtime-only) */
  logToConsole?: boolean;
  /** Whether this error can be retried, e.g., network errors (runtime-only) */
  retryable?: boolean;
};

/**
 * Full error report for UI display (popover, clipboard, email)
 * Extends ErrorReportParams with runtime-populated fields
 */
export type ErrorReportForUI = ErrorReportParams & {
  /** Current page URL */
  siteUrl: string;
  /** ISO timestamp */
  timestamp: string;
  /** Browser user agent */
  userAgent: string;
};

/**
 * Create a full error report for UI display from ErrorReportParams
 */
export function createErrorReportForUI(params: ErrorReportParams): ErrorReportForUI {
  return {
    ...params,
    siteUrl: typeof window !== "undefined" ? window.location.href : "",
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
  };
}

// ============================================================================
// Error Helper Functions - Use these to construct ErrorReportParams
// ============================================================================

/** Params requiring technical details (API failures, boundary errors) */
type ErrorParamsWithTechnical = Pick<ErrorReportParams, "userMessage" | "technicalMessage" | "context">;

/** Params for user-facing errors (validation, not found) - technicalMessage auto-derived */
type ErrorParamsSimple = Pick<ErrorReportParams, "userMessage" | "context">;

/**
 * Create error params for API/network failures
 * Automatically marked as retryable
 */
export function apiError(params: ErrorParamsWithTechnical): ErrorReportParams {
  return {
    userMessage: params.userMessage,
    technicalMessage: params.technicalMessage,
    errorType: "Network",
    context: params.context,
    retryable: true,
  };
}

/**
 * Create error params for validation failures (form, input, data)
 */
export function validationError(params: ErrorParamsSimple): ErrorReportParams {
  return {
    userMessage: params.userMessage,
    technicalMessage: params.userMessage,
    errorType: "Validation",
    context: params.context,
  };
}

/**
 * Create error params for not found scenarios
 */
export function notFoundError(params: ErrorParamsSimple): ErrorReportParams {
  return {
    userMessage: params.userMessage,
    technicalMessage: params.userMessage,
    errorType: "Load",
    context: params.context,
  };
}

/**
 * Create error params for render/boundary errors (use in svelte:boundary)
 */
export function boundaryError(params: ErrorParamsWithTechnical): ErrorReportParams {
  return {
    userMessage: params.userMessage,
    technicalMessage: params.technicalMessage,
    errorType: "Render",
    context: params.context,
  };
}

/**
 * Create error params from unknown caught errors (use in catch blocks)
 * Safely extracts message from Error objects or stringifies unknown values
 * @example
 * try { ... } catch (e) {
 *   state.setError(unknownError({ error: e, userMessage: "Operation failed", context: "MyComponent" }))
 * }
 */
export function unknownError(params: { error: unknown; userMessage: string; context?: string }): ErrorReportParams {
  const technicalMessage = params.error instanceof Error ? params.error.message : String(params.error);
  return {
    userMessage: params.userMessage,
    technicalMessage,
    errorType: "Other",
    context: params.context,
  };
}

/**
 * Create error params for offline/connectivity issues
 * Automatically detects offline state and provides appropriate messaging
 * @example
 * if (!navigator.onLine) {
 *   state.setError(offlineError({ context: "MyComponent" }))
 * }
 */
export function offlineError(params: { context?: string } = {}): ErrorReportParams {
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
  return {
    userMessage: isOffline ? "You appear to be offline. Please check your connection and try again." : "Network connection lost. Please try again.",
    technicalMessage: isOffline ? "navigator.onLine = false" : "Network connectivity error",
    errorType: "Network",
    context: params.context,
    retryable: true,
  };
}

/**
 * Check if the browser is currently offline
 */
export function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

/** Support email config structure from SharePointConfig */
type SupportEmailConfig = {
  email: string;
  subject: string;
  body: string;
  cc: string[];
  bcc: string[];
};

/**
 * Create a properly formatted mailto link for error reporting.
 * Uses encodeURIComponent to properly encode newlines (not URLSearchParams which double-encodes).
 */
export function createMailtoLink(support: SupportEmailConfig, errorReport: ErrorReportForUI): string {
  const bodyLines = [
    `Site URL: ${errorReport.siteUrl}`,
    errorReport.context ? `Context: ${errorReport.context}` : "",
    `Error: ${errorReport.userMessage}`,
    errorReport.technicalMessage !== errorReport.userMessage ? `Technical: ${errorReport.technicalMessage}` : "",
    "",
    support.body,
  ]
    .filter(Boolean)
    .join("\n");

  // Build mailto params manually - URLSearchParams encodes \n as %0A then again to %250A
  const params: string[] = [];
  params.push(`subject=${encodeURIComponent(support.subject)}`);
  params.push(`body=${encodeURIComponent(bodyLines)}`);
  if (support.cc.length) params.push(`cc=${encodeURIComponent(support.cc.join(","))}`);
  if (support.bcc.length) params.push(`bcc=${encodeURIComponent(support.bcc.join(","))}`);

  return `mailto:${support.email}?${params.join("&")}`;
}
