/**
 * SharePoint-integrated async state classes
 * Extends pure utilities with automatic error reporting to SharePoint
 */

import { reportError, type SharePointConfig, type ErrorReportParams } from "$lib/common-library/integrations";
import { AsyncLoadState, AsyncSubmitState } from "$lib/common-library/utils/async";
import { getContext } from "svelte";

/**
 * AsyncSubmitState with automatic SharePoint error reporting
 * Use helper functions: apiError(), validationError(), notFoundError()
 */
export class SharePointAsyncSubmitState extends AsyncSubmitState {
  #config: SharePointConfig | null = null;

  /**
   * Set error and automatically report to SharePoint ErrorReports list.
   * Use helper functions for consistent error categorization:
   * @example
   * // API/network errors
   * state.setError(apiError({ userMessage: "Could not save", technicalMessage: response.error, context: "updateStory" }))
   * @example
   * // Validation errors
   * state.setError(validationError({ userMessage: "Form is incomplete", context: "StoryEditor" }))
   * @see apiError, validationError, notFoundError, boundaryError from "$lib/common-library/integrations"
   */
  override setError(error: ErrorReportParams) {
    const params = { errorType: "Submit" as const, ...error };
    super.setError(params);
    // Lazy load config from context on first error
    this.#config = this.#config ?? getContext<SharePointConfig>("sharePointConfig");
    reportError(this.#config, params).catch(() => {});
  }
}

/**
 * AsyncLoadState with automatic SharePoint error reporting
 * Use helper functions: apiError(), validationError(), notFoundError()
 */
export class SharePointAsyncLoadState extends AsyncLoadState {
  #config: SharePointConfig;

  constructor() {
    super();
    this.#config = getContext<SharePointConfig>("sharePointConfig");
  }

  /**
   * Set error and automatically report to SharePoint ErrorReports list.
   * Use helper functions for consistent error categorization:
   * @example
   * // API/network errors
   * state.setError(apiError({ userMessage: "Could not fetch", technicalMessage: response.error, context: "getStories" }))
   * @example
   * // Not found errors
   * state.setError(notFoundError({ userMessage: "Story not found", context: "StoryPage" }))
   * @see apiError, validationError, notFoundError, boundaryError from "$lib/common-library/integrations"
   */
  override setError(error: ErrorReportParams) {
    const params = { errorType: "Load" as const, ...error };
    super.setError(params);
    reportError(this.#config, params).catch(() => {});
  }
}
