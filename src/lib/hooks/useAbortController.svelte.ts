import { onDestroy } from "svelte";

/**
 * Manage AbortController lifecycle in Svelte components
 * Automatically aborts pending requests on unmount
 * @returns Object with signal for fetch calls and abort function
 * @example
 * const { signal, abort } = useAbortController();
 * await fetch(url, { signal });
 * // Cleanup happens automatically on unmount
 */
export function useAbortController() {
  const controller = new AbortController();

  onDestroy(() => {
    // Abort all pending requests when component unmounts
    controller.abort();
  });

  return {
    signal: controller.signal,
    abort: () => controller.abort(),
    controller,
  };
}
