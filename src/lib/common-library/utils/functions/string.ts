/**
 * Capitalize the first letter of a string
 * @param string - The string to capitalize
 * @returns The string with first letter capitalized, or undefined if input is undefined
 * @example capitalizeFirstLetter("hello") // "Hello"
 */
export function capitalizeFirstLetter(string?: string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

/**
 * Remove special characters, preserving alphanumeric, hyphens, underscores, periods, and spaces
 * Useful for sanitizing user input or creating safe filenames
 * @param string - The string to sanitize
 * @returns String with only allowed characters
 * @example removeSpecialCharacters("Hello@World!") // "HelloWorld"
 */
export function removeSpecialCharacters(string: string) {
  return string.replace(/[^a-zA-Z0-9\-_\. ]/g, "");
}

/**
 * Generate a random unique ID string
 * Prefixed with 'id' for valid HTML element IDs
 * @returns Random ID like "id9a7f3b2c1d"
 */
export let randomIdString = () => "id" + Math.random().toString(16).slice(2);

/**
 * Remove all newline characters (\n, \r) from a string
 * Useful for cleaning multi-line text into single line
 * @param str - The string to process
 * @returns String with newlines removed
 */
export function removeNewLinesFromString(str: string) {
  return str.replace(/[\n\r]+/g, "");
}

/**
 * Truncate string to specified length and append ellipsis if exceeded
 * @param input - The string to truncate
 * @param limit - Maximum character length
 * @returns Truncated string with '...' if over limit, original string otherwise
 * @example truncate("Long text here", 8) // "Long tex..."
 */
export function truncate(input: string, limit: number) {
  if (input.length > limit) {
    return input.substring(0, limit).trim() + "...";
  }
  return input;
}

/**
 * Convert string to URL-safe slug format
 * Replaces spaces with hyphens and removes special characters
 * @param string - The string to slugify
 * @returns URL-safe slug string
 * @example removeSpecialCharactersAndReplaceSpaceWithHyphen("Hello World!") // "Hello-World"
 */
export function removeSpecialCharactersAndReplaceSpaceWithHyphen(string: string) {
  // return string.replace(/[^a-zA-Z0-9-_\.]/g, "");
  return string.replaceAll(" ", "-").replace(/[^a-zA-Z0-9\-_\. ]/g, "");
}

/**
 * Find the longest string in an array
 * @param arr - Array of strings to compare
 * @returns The longest string from the array
 * @example longestString(["hi", "hello", "hey"]) // "hello"
 */
export function longestString(arr: string[]) {
  return arr.reduce((a, b) => (a.length < b.length ? b : a), "");
}
