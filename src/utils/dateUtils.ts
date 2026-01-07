import { parse } from 'date-fns';

/**
 * Parses month string like "Jan 2024" into a Date object (set to the 1st of that month).
 * @param monthString The month string (e.g., "Jan 2024").
 * @returns A Date object representing the first day of that month.
 */
export const parseMonthString = (monthString: string): Date => {
  // Use 'MMM yyyy' format for parsing
  return parse(monthString, 'MMM yyyy', new Date());
};

/**
 * Checks if a month string falls within a given month string range.
 * @param monthString The month string (e.g., "Jan 2024").
 * @param startMonthString The start month string (inclusive).
 * @param endMonthString The end month string (inclusive).
 * @param allMonths Sorted array of all unique month strings available in the data.
 * @returns True if the month falls within the range, false otherwise.
 */
export const isMonthStringWithinRange = (
  monthString: string,
  startMonthString: string | undefined,
  endMonthString: string | undefined,
  allMonths: string[]
): boolean => {
  if (!startMonthString && !endMonthString) return true;

  const monthIndex = allMonths.indexOf(monthString);
  if (monthIndex === -1) return false; // Should not happen if data is consistent

  const startIndex = startMonthString ? allMonths.indexOf(startMonthString) : 0;
  const endIndex = endMonthString ? allMonths.indexOf(endMonthString) : allMonths.length - 1;

  // Ensure start is before or equal to end
  const effectiveStartIndex = Math.min(startIndex, endIndex);
  const effectiveEndIndex = Math.max(startIndex, endIndex);

  return monthIndex >= effectiveStartIndex && monthIndex <= effectiveEndIndex;
};