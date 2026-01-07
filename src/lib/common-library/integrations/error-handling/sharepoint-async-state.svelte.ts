/**
 * SharePoint-integrated async state classes
 * Extends pure utilities with error reporting to SharePoint
 */

import { reportError, type SharePointConfig } from "$lib/common-library/integrations";
import { AsyncLoadState, AsyncSubmitState } from "$lib/common-library/utils/async";
import { SHAREPOINT_CONFIG } from "$lib/env/sharepoint-config";
import { getContext } from "svelte";

/**
 * AsyncSubmitState with integrated SharePoint error reporting
 * Automatically reports errors to SharePoint ErrorReports list
 */
export class SharePointAsyncSubmitState extends AsyncSubmitState {
  /**
   * Override setError to include SharePoint error reporting
   */
  override setError(errorMessage: string, context?: string) {
    super.setError(errorMessage);
    reportError(SHAREPOINT_CONFIG, {
      context: context ?? "",
      errorType: "Submit",
      technicalMessage: errorMessage,
      userMessage: errorMessage,
    }).catch(() => {});
  }
}

/**
 * AsyncLoadState with integrated SharePoint error reporting
 * Automatically reports errors to SharePoint ErrorReports list
 */
export class SharePointAsyncLoadState extends AsyncLoadState {
  #config: SharePointConfig;

  constructor() {
    super();
    this.#config = getContext<SharePointConfig>("sharePointConfig");
  }

  /**
   * Override setError to include SharePoint error reporting
   */
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
