/**
 * Date formatting utilities
 */

/**
 * Format a date string to a human-readable format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Monday, January 15, 2024")
 */
export const formatEventDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC', // Treat date string as UTC to avoid off-by-one day errors
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date/time string to a localized format
 * @param dateString ISO date string
 * @returns Formatted date/time string
 */
export const formatLastChecked = (dateString: string | null): string => {
  if (!dateString) {
    return 'Never';
  }
  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    console.error('Error formatting last checked date:', error);
    return 'Unknown';
  }
};

/**
 * Check if a date is in the future
 * @param dateString ISO date string
 * @returns true if date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  } catch (error) {
    return false;
  }
};

