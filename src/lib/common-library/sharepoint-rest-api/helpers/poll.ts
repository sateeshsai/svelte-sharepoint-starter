import type { Sharepoint_Error_Formatted } from "../types";

/**
 * Polls a function at regular intervals, ensuring the function completes
 * before the next poll is scheduled.
 *
 * @param fn - The async function to poll
 * @param intervalMs - The interval in milliseconds between polls
 * @param onSuccess - Optional callback when the function succeeds
 * @param onError - Optional callback when the function throws an error
 * @returns A function to stop polling
 *
 * @example
 * const stopPolling = poll(
 *   () => getListItems({ listName: 'Items', dataToReturnInLocalMode: { value: [] } }),
 *   5000,
 *   (data) => console.log('Success:', data),
 *   (error) => console.error('Error:', error)
 * );
 *
 * // Later, stop polling
 * stopPolling();
 */

export function poll<T>(fn: () => Promise<T>, intervalMs: number, onSuccess?: (data: T) => void, onError?: (error: unknown) => void): () => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isPolling = true;

  const executePoll = async () => {
    console.log("Poll");
    if (!isPolling) return;

    try {
      const result = await fn();
      onSuccess?.(result);
    } catch (error) {
      onError?.(error);
    }

    if (isPolling) {
      timeoutId = setTimeout(executePoll, intervalMs);
    }
  };

  // Start the polling immediately
  executePoll();

  // Return a function to stop polling
  return () => {
    isPolling = false;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
}

/**
 * Specialized poll function for getListItems that handles success/error responses
 *
 * @param getListItemsFn - Function that calls getListItems
 * @param intervalMs - The interval in milliseconds between polls
 * @param onSuccess - Callback when data is successfully fetched
 * @param onError - Callback when an error response is received
 * @returns A function to stop polling
 *
 * @example
 * const stopPolling = pollListItems(
 *   () => getListItems({
 *     listName: 'Stories',
 *     dataToReturnInLocalMode: { value: [] }
 *   }),
 *   3000,
 *   (data) => console.log('Items:', data.value),
 *   (error) => console.error('Error:', error)
 * );
 */
export function pollListItems<T extends { value: Record<string, any> }>(
  getListItemsFn: () => Promise<T | Sharepoint_Error_Formatted>,
  intervalMs: number,
  onSuccess?: (data: T) => void,
  onError?: (errorMessage: string) => void
): () => void {
  return poll(
    async () => {
      const result = await getListItemsFn();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    intervalMs,
    onSuccess,
    (error) => {
      onError?.(error instanceof Error ? error.message : String(error));
    }
  );
}
