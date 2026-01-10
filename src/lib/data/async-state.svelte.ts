/**
 * App-specific async state classes with automatic error reporting
 *
 * Extends common-library's pure async utilities with SharePoint error reporting.
 * Customize this file for project-specific error handling behavior.
 */

import { reportError, type SharePointConfig, type ErrorReportParams } from "$lib/common-library/integrations";
import { BaseAsyncLoadState, BaseAsyncSubmitState, ASYNC_STATE_CONTEXT_KEY, type AsyncStateFactory } from "$lib/common-library/utils/async";
import { getContext, setContext } from "svelte";

/**
 * AsyncSubmitState with automatic SharePoint error reporting.
 * Use for POST/PUT/DELETE operations.
 */
export class AsyncSubmitState extends BaseAsyncSubmitState {
  #config: SharePointConfig | null = null;

  override setError(error: ErrorReportParams) {
    const params = { errorType: "Submit" as const, ...error };
    super.setError(params);
    // Lazy load config from context on first error
    this.#config = this.#config ?? getContext<SharePointConfig>("sharePointConfig");
    reportError(this.#config, params).catch(() => {});
  }
}

/**
 * AsyncLoadState with automatic SharePoint error reporting.
 * Use for GET operations.
 */
export class AsyncLoadState extends BaseAsyncLoadState {
  #config: SharePointConfig;

  constructor() {
    super();
    this.#config = getContext<SharePointConfig>("sharePointConfig");
  }

  override setError(error: ErrorReportParams) {
    const params = { errorType: "Load" as const, ...error };
    super.setError(params);
    reportError(this.#config, params).catch(() => {});
  }
}

// ============================================================================
// Factory functions - use these in components
// ============================================================================

/** Create a new AsyncLoadState instance (GET operations) */
export function createLoadState(): AsyncLoadState {
  return new AsyncLoadState();
}

/** Create a new AsyncSubmitState instance (POST/PUT/DELETE operations) */
export function createSubmitState(): AsyncSubmitState {
  return new AsyncSubmitState();
}

/**
 * Initialize async state factory context. Call once in App.svelte.
 * Provides common-library components access to app-specific async state classes.
 */
export function initAsyncStateContext(): void {
  setContext<AsyncStateFactory>(ASYNC_STATE_CONTEXT_KEY, {
    createLoadState: () => new AsyncLoadState(),
    createSubmitState: () => new AsyncSubmitState(),
  });
}
