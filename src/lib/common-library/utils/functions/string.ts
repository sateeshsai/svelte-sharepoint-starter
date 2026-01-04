export function capitalizeFirstLetter(string?: string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

export function removeSpecialCharacters(string: string) {
  return string.replace(/[^a-zA-Z0-9\-_\. ]/g, "");
}

export let randomIdString = () => "id" + Math.random().toString(16).slice(2);

export function removeNewLinesFromString(str: string) {
  return str.replace(/[\n\r]+/g, "");
}

export function truncate(input: string, limit: number) {
  if (input.length > limit) {
    return input.substring(0, limit).trim() + "...";
  }
  return input;
}

export function removeSpecialCharactersAndReplaceSpaceWithHyphen(string: string) {
  // return string.replace(/[^a-zA-Z0-9-_\.]/g, "");
  return string.replaceAll(" ", "-").replace(/[^a-zA-Z0-9\-_\. ]/g, "");
}

export function longestString(arr: string[]) {
  return arr.reduce((a, b) => (a.length < b.length ? b : a), "");
}
