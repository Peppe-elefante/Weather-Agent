/**
 * Formats the current date as a human-readable string
 * @returns A formatted date string in the format: "Weekday, Month Day, Year"
 * @example "Saturday, November 30, 2025"
 */
export const getCurrentDateString = (): string => {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
