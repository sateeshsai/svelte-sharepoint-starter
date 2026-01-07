/**
 * SharePoint-integrated async state classes
 * Extends pure utilities with automatic error reporting to SharePoint
 */

import { reportError, type SharePointConfig } from "$lib/common-library/integrations";
import { AsyncLoadState, AsyncSubmitState } from "$lib/common-library/utils/async";
import { getContext } from "svelte";

/**
 * AsyncSubmitState with automatic SharePoint error reporting
 */
export class SharePointAsyncSubmitState extends AsyncSubmitState {
  #config: SharePointConfig | null = null;

  /** Override setError to include SharePoint error reporting */
  override setError(errorMessage: string, context?: string) {
    super.setError(errorMessage);
    // Lazy load config from context on first error
    this.#config = this.#config ?? getContext<SharePointConfig>("sharePointConfig");
    reportError(this.#config, {
      context: context ?? "",
      errorType: "Submit",
      technicalMessage: errorMessage,
      userMessage: errorMessage,
    }).catch(() => {});
  }
}

/**
 * AsyncLoadState with automatic SharePoint error reporting
 */
export class SharePointAsyncLoadState extends AsyncLoadState {
  #config: SharePointConfig;

  constructor() {
    super();
    this.#config = getContext<SharePointConfig>("sharePointConfig");
  }

  /** Override setError to include SharePoint error reporting */
  override setError(errorMessage: string, context?: string) {
    super.setError(errorMessage);
    reportError(this.#config, {
      context: context ?? "",
      errorType: "Load",
      technicalMessage: errorMessage,
      userMessage: errorMessage,
    }).catch(() => {});
  }
}
