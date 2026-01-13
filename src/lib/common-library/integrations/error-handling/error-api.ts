import { postListItem } from "$lib/common-library/integrations/sharepoint-rest-api/rest-functions/post/postListItem";
import type { ErrorReport_ListItem_Post, ErrorReportParams } from "$lib/common-library/integrations/error-handling/error-types";
import type { SharePointConfig } from "../sharepoint-rest-api/config";

// Rate limiting: Track recent errors to prevent spam
const recentErrors = new Map<string, number>();
const RATE_LIMIT_MS = 5000; // Don't report same error within 5 seconds
const MAX_TRACKED_ERRORS = 50; // Limit memory usage

function getErrorKey(params: ErrorReportParams): string {
  return `${params.context}:${params.errorType}:${params.technicalMessage}`.slice(0, 200);
}

function isRateLimited(key: string): boolean {
  const lastReported = recentErrors.get(key);
  if (lastReported && Date.now() - lastReported < RATE_LIMIT_MS) {
    return true;
  }
  // Cleanup old entries if map is getting large
  if (recentErrors.size > MAX_TRACKED_ERRORS) {
    const now = Date.now();
    for (const [k, time] of recentErrors) {
      if (now - time > RATE_LIMIT_MS) recentErrors.delete(k);
    }
  }
  recentErrors.set(key, Date.now());
  return false;
}

/**
 * Convert ErrorReportParams to SharePoint POST format
 */
function toSharePointPost(params: ErrorReportParams): ErrorReport_ListItem_Post {
  return {
    Title: `${params.errorType ?? "Other"} - ${params.context ?? "Unknown"}`,
    ErrorType: params.errorType ?? "Other",
    Context: params.context ?? "",
    TechnicalMessage: params.technicalMessage,
    UserMessage: params.userMessage,
    RouteUrl: typeof window !== "undefined" ? window.location.href : "",
    BrowserUserAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
  };
}

/**
 * Report error to SharePoint ErrorReports list
 * Non-blocking - silently fails to prevent cascading errors
 * Rate-limited - same error won't be reported twice within 5 seconds
 */
export async function reportError(config: SharePointConfig, params: ErrorReportParams): Promise<void> {
  try {
    // Rate limit check - prevent reporting same error multiple times
    if (isRateLimited(getErrorKey(params))) {
      return;
    }

    if (params.logToConsole) {
      console.warn("[ERROR REPORT]", toSharePointPost(params));
      return;
    }

    console.log(toSharePointPost(params));

    await postListItem({
      siteCollectionUrl: config.paths.site_collection,
      dataToPost: toSharePointPost(params),
      listName: config.lists.ErrorReports.name,
    });
  } catch (err) {
    // Silently fail - don't let error reporting break the app
    console.error("[ERROR REPORT FAILED]", err);
  }
}
