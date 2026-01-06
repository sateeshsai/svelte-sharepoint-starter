import { reportError } from "$lib/common-library/integrations/error-handling/report-error";
import type { SharePointConfig } from "$lib/common-library/integrations/sharepoint-rest-api/config";
import { getContext } from "svelte";

export class AsyncSubmitState {
  #config: SharePointConfig;
  initial = $state(true);
  attempted = $state(false);
  inProgress = $state(false);
  success = $state(false);
  error: string | undefined = $state("");
  message = $state("");

  constructor() {
    this.#config = getContext<SharePointConfig>("sharePointConfig");
  }

  setError = (errorMessage: string, context?: string) => {
    this.error = errorMessage;
    this.attempted = true;
    this.#clearInProgress();
    reportError(this.#config, {
      context: context ?? "",
      errorType: "Submit",
      technicalMessage: errorMessage,
      userMessage: errorMessage,
    }).catch(() => {});
  };

  appendError = (errorMessage: string) => {
    this.error = this.error + errorMessage;
    this.#clearInProgress();
  };

  setMessage = (messageString: string) => {
    this.message = messageString;
  };

  setAttempted = () => {
    this.attempted = true;
  };

  setInprogress = () => {
    this.error = "";
    this.initial = false;
    this.attempted = true;
    this.inProgress = true;
  };

  #clearInProgress = () => {
    this.initial = true;
    this.inProgress = false;
  };

  setSuccess = () => {
    this.initial = false;
    this.inProgress = false;
    this.attempted = false;
    this.success = true;
  };

  #clearSuccess = () => {
    this.attempted = false;
    this.error = "";
    this.success = false;
    this.initial = true;
  };

  resetForm = () => {
    this.#clearSuccess();
    this.attempted = false;
  };
}

export class AsyncLoadState {
  #config: SharePointConfig;
  loading = $state(true);
  ready: boolean = $state(false);
  error: string | undefined = $state("");

  constructor() {
    this.#config = getContext<SharePointConfig>("sharePointConfig");
  }

  setError = (errorMessage: string, context?: string) => {
    this.error = errorMessage;
    this.ready = false;
    this.loading = false;
    reportError(this.#config, {
      context: context ?? "",
      errorType: "Load",
      technicalMessage: errorMessage,
      userMessage: errorMessage,
    }).catch(() => {});
  };

  appendError = (errorMessage: string) => {
    this.error = this.error + errorMessage;
    this.loading = false;
    this.ready = false;
  };

  setLoading = () => {
    this.error = "";
    this.loading = true;
    this.ready = false;
  };

  setReady = () => {
    this.error = "";
    this.loading = false;
    this.ready = true;
  };

  resetForm = () => {
    this.setLoading();
  };
}
