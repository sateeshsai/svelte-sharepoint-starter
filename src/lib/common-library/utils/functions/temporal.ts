/**
 * Standard date format options: "January 1, 2025"
 * Use with Intl.DateTimeFormat or toLocaleDateString
 */
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

/**
 * Short date format options: "Jan 1, 2025"
 * Use with Intl.DateTimeFormat or toLocaleDateString
 */
export const DATE_OPTIONS_SHORT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
} as const;

/**
 * Format ISO date string to human-readable format
 * @param dateISOString - ISO 8601 date string (e.g., from SharePoint Created/Modified)
 * @param formatType - "short" for abbreviated month, "long" (default) for full month name
 * @returns Formatted date string or empty string if invalid
 * @example formatDate("2025-01-08T10:30:00Z") // "January 8, 2025"
 * @example formatDate("2025-01-08T10:30:00Z", "short") // "Jan 8, 2025"
 */
export function formatDate(dateISOString: string | null, formatType?: "short" | "long") {
  if (!dateISOString) return;
  const date = new Date(dateISOString);
  if (String(date) === "Invalid Date") {
    return "";
  }
  const formattedDateString = date?.toLocaleDateString("en-US", formatType === "short" ? DATE_OPTIONS_SHORT : DATE_OPTIONS);
  return formattedDateString;
}

/**
 * Convert milliseconds to time duration format
 * @param timeInMiliseconds - Duration in milliseconds
 * @param showSeconds - Whether to include seconds in output
 * @returns Formatted time string in HH:MM or HH:MM:SS format
 * @example getHoursMinutesFromMilliSeconds(3665000) // "1:1"
 * @example getHoursMinutesFromMilliSeconds(3665000, true) // "1:1:5"
 */
export function getHoursMinutesFromMilliSeconds(timeInMiliseconds: number, showSeconds?: boolean) {
  const hours = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
  const minutes = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - hours) * 60);
  const seconds = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - hours) * 60 - minutes) * 60);

  return `${hours}:${minutes}${showSeconds ? ":" + seconds : ""}`;
}
