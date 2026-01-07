import { postListItem } from "$lib/common-library/integrations/sharepoint-rest-api/rest-functions/post/postListItem";
import type { ErrorReport_ListItem_Post } from "$lib/common-library/integrations/error-handling/error-types";
import type { SharePointConfig } from "../sharepoint-rest-api/config";
import { ERROR_TYPES } from "./error-schemas";

/**
 * Report an error to the ErrorReports list in SharePoint
 * This is non-blocking - if reporting fails, it will be silently ignored to prevent cascading errors
 */
export async function reportError(
  config: SharePointConfig,
  params: { context?: string; errorType: string; technicalMessage: string; userMessage?: string; signal?: AbortSignal; logToConsole?: boolean }
): Promise<void> {
  try {
    const routeUrl = window?.location.href ?? "";

    const browserUserAgent = navigator?.userAgent ?? "Unknown";

    const errorReportToPost: ErrorReport_ListItem_Post = {
      Title: `${params.errorType ?? "Unknown error type"} - ${params.context ?? "Unknown context"}`,
      ErrorType: (params.errorType ?? "Other") as (typeof ERROR_TYPES)[number],
      Context: params.context ?? "",
      TechnicalMessage: params.technicalMessage ?? "",
      UserMessage: params.userMessage ?? "",
      RouteUrl: routeUrl,
      BrowserUserAgent: browserUserAgent,
    };

    if (params.logToConsole) {
      console.warn("[ERROR REPORT]", errorReportToPost);
      return;
    }

    await postListItem({ dataToPost: errorReportToPost, listName: config.lists.ErrorReports.name });
  } catch (err) {
    // Silently fail - don't let error reporting break the app
    console.error("[ERROR REPORT FAILED]", err);
  }
}
