import { onDestroy } from "svelte";

/**
 * Svelte hook for managing AbortController lifecycle
 * Automatically aborts pending requests on component unmount
 *
 * @returns Object with signal for fetch calls and abort function
 *
 * @example
 * const { signal, abort } = useAbortController();
 *
 * // Use signal in fetch calls
 * const response = await fetch(url, { signal });
 *
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
