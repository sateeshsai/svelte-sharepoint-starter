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
