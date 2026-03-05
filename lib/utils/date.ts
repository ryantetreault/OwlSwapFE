/**
 * Date utility functions for handling different date formats required by the backend.
 *
 * IMPORTANT: The backend expects two different date formats:
 * - releaseDate: YYYY-MM-DD (with dashes)
 * - deadline (for Request items): YYYY/MM/DD (with slashes)
 */

/**
 * Format a Date object for the releaseDate field (YYYY-MM-DD with dashes).
 * Used for all item types.
 *
 * @param date - The Date object to format
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * formatReleaseDate(new Date('2024-03-15')) // Returns: "2024-03-15"
 */
export function formatReleaseDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Convert an HTML date input value (YYYY-MM-DD) to backend deadline format (YYYY/MM/DD with slashes).
 * Used specifically for Request items' deadline field.
 *
 * @param inputValue - Date string from HTML input in YYYY-MM-DD format
 * @returns Date string in YYYY/MM/DD format for backend
 *
 * @example
 * parseDeadlineForBackend("2024-03-15") // Returns: "2024/03/15"
 */
export function parseDeadlineForBackend(inputValue: string): string {
  return inputValue.replace(/-/g, '/');
}

/**
 * Convert backend deadline format (YYYY/MM/DD) to HTML date input format (YYYY-MM-DD).
 * Used when loading existing Request items for editing.
 *
 * @param backendValue - Date string from backend in YYYY/MM/DD format
 * @returns Date string in YYYY-MM-DD format for HTML input
 *
 * @example
 * parseDeadlineFromBackend("2024/03/15") // Returns: "2024-03-15"
 */
export function parseDeadlineFromBackend(backendValue: string): string {
  return backendValue.replace(/\//g, '-');
}
