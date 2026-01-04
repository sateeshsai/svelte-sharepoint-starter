// @ts-nocheck

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
