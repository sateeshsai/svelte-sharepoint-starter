export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

export const DATE_OPTIONS_SHORT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
} as const;

export function formatDate(dateISOString: string | null, formatType?: "short" | "long") {
  if (!dateISOString) return;
  const date = new Date(dateISOString);
  if (String(date) === "Invalid Date") {
    return "";
  }
  const formattedDateString = date?.toLocaleDateString("en-US", formatType === "short" ? DATE_OPTIONS_SHORT : DATE_OPTIONS);
  return formattedDateString;
}

export function getHoursMinutesFromMilliSeconds(timeInMiliseconds: number, showSeconds?: boolean) {
  const hours = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
  const minutes = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - hours) * 60);
  const seconds = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - hours) * 60 - minutes) * 60);

  return `${hours}:${minutes}${showSeconds ? ":" + seconds : ""}`;
}
