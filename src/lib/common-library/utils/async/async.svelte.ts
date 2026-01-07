/**
 * Pure async state management utility - framework and integration agnostic
 * No dependencies on SharePoint or error reporting
 */

export class AsyncSubmitState {
  initial = $state(true);
  attempted = $state(false);
  inProgress = $state(false);
  success = $state(false);
  error: string | undefined = $state("");
  message = $state("");

  setError(errorMessage: string) {
    this.error = errorMessage;
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

export class AsyncLoadState {
  loading = $state(true);
  ready: boolean = $state(false);
  error: string | undefined = $state("");

  setError(errorMessage: string) {
    this.error = errorMessage;
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
