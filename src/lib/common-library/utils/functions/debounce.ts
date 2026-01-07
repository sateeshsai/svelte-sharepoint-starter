// @ts-nocheck

/**
 * Delay function execution until after wait time has elapsed since last call
 * Useful for search inputs, window resize handlers, etc.
 * @param callback - Function to debounce
 * @param wait - Delay in milliseconds
 */
export const debounce = (callback, wait) => {
  console.log("debounce fn");
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
