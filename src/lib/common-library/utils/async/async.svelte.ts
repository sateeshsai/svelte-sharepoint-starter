/**
 * Framework-agnostic async state management for form submissions
 * Tracks initial, in-progress, success, and error states
 * Use for POST/PUT/DELETE operations
 */

import type { ErrorReportParams } from "$lib/common-library/integrations/error-handling/error-types";

export class AsyncSubmitState {
  initial = $state(true);
  attempted = $state(false);
  inProgress = $state(false);
  success = $state(false);
  error: string | undefined = $state("");
  /** Full error details for UI components (popover, report button) */
  errorDetails: ErrorReportParams | undefined = $state(undefined);
  message = $state("");

  /**
   * Set error state with structured error params.
   * Stores full details in `errorDetails` for UI components (popover, report button).
   * Use helper functions for consistent error categorization:
   * @example
   * // API/network errors
   * state.setError(apiError({ userMessage: "Could not save", technicalMessage: response.error, context: "updateStory" }))
   * @example
   * // Validation errors
   * state.setError(validationError({ userMessage: "Form is incomplete", context: "StoryEditor" }))
   * @example
   * // Catch blocks with unknown errors
   * state.setError(unknownError({ error: e, userMessage: "Operation failed", context: "MyComponent" }))
   * @see apiError, validationError, notFoundError, boundaryError, unknownError
   */
  setError(error: ErrorReportParams) {
    this.error = error.userMessage;
    this.errorDetails = error;
    this.attempted = true;
    this.#clearInProgress();
  }

  appendError(errorMessage: string) {
    this.error = this.error + errorMessage;
    this.#clearInProgress();
  }

  setMessage(messageString: string) {
    this.message = messageString;
  }

  setAttempted() {
    this.attempted = true;
  }

  setInprogress() {
    this.error = "";
    this.initial = false;
    this.attempted = true;
    this.inProgress = true;
  }

  #clearInProgress() {
    this.initial = true;
    this.inProgress = false;
  }

  setSuccess() {
    this.initial = false;
    this.inProgress = false;
    this.attempted = false;
    this.success = true;
  }

  #clearSuccess() {
    this.attempted = false;
    this.error = "";
    this.success = false;
    this.initial = true;
  }

  resetForm() {
    this.#clearSuccess();
    this.attempted = false;
  }
}

/**
 * Framework-agnostic async state management for data loading
 * Tracks loading, ready, and error states
 * Use for GET operations
 */
export class AsyncLoadState {
  loading = $state(true);
  ready: boolean = $state(false);
  error: string | undefined = $state("");
  /** Full error details for UI components (popover, report button) */
  errorDetails: ErrorReportParams | undefined = $state(undefined);

  /**
   * Set error state with structured error params.
   * Stores full details in `errorDetails` for UI components (popover, report button).
   * Use helper functions for consistent error categorization:
   * @example
   * // API/network errors
   * state.setError(apiError({ userMessage: "Could not fetch", technicalMessage: response.error, context: "getStories" }))
   * @example
   * // Not found errors
   * state.setError(notFoundError({ userMessage: "Story not found", context: "StoryPage" }))
   * @example
   * // Catch blocks with unknown errors
   * state.setError(unknownError({ error: e, userMessage: "Load failed", context: "MyComponent" }))
   * @see apiError, validationError, notFoundError, boundaryError, unknownError
   */
  setError(error: ErrorReportParams) {
    this.error = error.userMessage;
    this.errorDetails = error;
    this.ready = false;
    this.loading = false;
  }

  appendError(errorMessage: string) {
    this.error = this.error + errorMessage;
    this.loading = false;
    this.ready = false;
  }

  setLoading() {
    this.error = "";
    this.loading = true;
    this.ready = false;
  }

  setReady() {
    this.error = "";
    this.loading = false;
    this.ready = true;
  }

  resetForm() {
    this.setLoading();
  }
}
