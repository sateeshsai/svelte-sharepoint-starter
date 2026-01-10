/**
 * Pure Utility Functions
 *
 * Framework-agnostic helper functions for common operations.
 * Import specific functions or the whole module:
 *
 * @example
 * import { debounce, formatDate } from "$lib/common-library/utils/functions";
 * import { capitalizeFirstLetter, truncate } from "$lib/common-library/utils/functions";
 */

// String utilities
export { capitalizeFirstLetter, removeSpecialCharacters, randomIdString, removeNewLinesFromString, truncate, removeSpecialCharactersAndReplaceSpaceWithHyphen, longestString } from "./string";

// File utilities
export { fileToArrayBuffer, dataUriToFile } from "./file";

// Number utilities
export { randomInt, percentage } from "./number";

// Temporal/Date utilities
export { DATE_OPTIONS, DATE_OPTIONS_SHORT, formatDate, getHoursMinutesFromMilliSeconds } from "./temporal";

// Timing utilities
export { debounce } from "./debounce";

// Typed native object helpers
export { getObjectKeys, getObjectEntries } from "./native-typed";

// Svelte state utilities
export { convertToState } from "./proxy.svelte";
