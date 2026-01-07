/** Capitalize first letter of string */
export function capitalizeFirstLetter(string?: string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

/** Remove all non-alphanumeric characters except hyphens, underscores, periods, and spaces */
export function removeSpecialCharacters(string: string) {
  return string.replace(/[^a-zA-Z0-9\-_\. ]/g, "");
}

/** Generate random ID string prefixed with 'id' */
export let randomIdString = () => "id" + Math.random().toString(16).slice(2);

/** Remove all newlines from string */
export function removeNewLinesFromString(str: string) {
  return str.replace(/[\n\r]+/g, "");
}

/** Truncate string to limit and append '...' if exceeded */
export function truncate(input: string, limit: number) {
  if (input.length > limit) {
    return input.substring(0, limit).trim() + "...";
  }
  return input;
}

/** Replace spaces with hyphens and remove special characters (for URL slugs) */
export function removeSpecialCharactersAndReplaceSpaceWithHyphen(string: string) {
  // return string.replace(/[^a-zA-Z0-9-_\.]/g, "");
  return string.replaceAll(" ", "-").replace(/[^a-zA-Z0-9\-_\. ]/g, "");
}

/** Find longest string in array */
export function longestString(arr: string[]) {
  return arr.reduce((a, b) => (a.length < b.length ? b : a), "");
}
