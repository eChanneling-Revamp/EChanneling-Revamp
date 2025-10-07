/**
 * Date manipulation utilities
 * Handles date formatting, timezone conversion, and date calculations
 */

import { DATE_FORMATS, TIMEZONE } from '@/config/constants';

/**
 * Format date for display
 * @param date - Date to format
 * @param format - Format type
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: keyof typeof DATE_FORMATS = 'DISPLAY'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  switch (format) {
    case 'DISPLAY':
      return `${day}/${month}/${year}`;
    case 'API':
      return `${year}-${month}-${day}`;
    case 'DATETIME':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'TIME':
      return `${hours}:${minutes}`;
    default:
      return dateObj.toLocaleDateString();
  }
}

/**
 * Format date for API (ISO format)
 * @param date - Date to format
 * @returns ISO date string
 */
export function formatDateForAPI(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}

/**
 * Parse date from various formats
 * @param dateString - Date string to parse
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // Try parsing as ISO string first
  let date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Try parsing DD/MM/YYYY format
  const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try parsing YYYY-MM-DD format
  const yyyymmddMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (yyyymmddMatch) {
    const [, year, month, day] = yyyymmddMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

/**
 * Get start of day
 * @param date - Date to get start of day for
 * @returns Date object at start of day
 */
export function getStartOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Get end of day
 * @param date - Date to get end of day for
 * @returns Date object at end of day
 */
export function getEndOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}

/**
 * Add days to date
 * @param date - Base date
 * @param days - Number of days to add (can be negative)
 * @returns New date object
 */
export function addDays(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
}

/**
 * Add months to date
 * @param date - Base date
 * @param months - Number of months to add (can be negative)
 * @returns New date object
 */
export function addMonths(date: Date | string, months: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setMonth(dateObj.getMonth() + months);
  return dateObj;
}

/**
 * Add years to date
 * @param date - Base date
 * @param years - Number of years to add (can be negative)
 * @returns New date object
 */
export function addYears(date: Date | string, years: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setFullYear(dateObj.getFullYear() + years);
  return dateObj;
}

/**
 * Get difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : new Date(date1);
  const d2 = typeof date2 === 'string' ? new Date(date2) : new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is today
 * @param date - Date to check
 * @returns Boolean indicating if date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
}

/**
 * Check if date is yesterday
 * @param date - Date to check
 * @returns Boolean indicating if date is yesterday
 */
export function isYesterday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const yesterday = addDays(new Date(), -1);
  return dateObj.toDateString() === yesterday.toDateString();
}

/**
 * Check if date is tomorrow
 * @param date - Date to check
 * @returns Boolean indicating if date is tomorrow
 */
export function isTomorrow(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const tomorrow = addDays(new Date(), 1);
  return dateObj.toDateString() === tomorrow.toDateString();
}

/**
 * Check if date is in the past
 * @param date - Date to check
 * @returns Boolean indicating if date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  return dateObj < new Date();
}

/**
 * Check if date is in the future
 * @param date - Date to check
 * @returns Boolean indicating if date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  return dateObj > new Date();
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to get relative time for
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (Math.abs(diffSeconds) < 60) {
    return diffSeconds < 0 ? `${Math.abs(diffSeconds)} seconds ago` : `in ${diffSeconds} seconds`;
  } else if (Math.abs(diffMinutes) < 60) {
    return diffMinutes < 0 ? `${Math.abs(diffMinutes)} minutes ago` : `in ${diffMinutes} minutes`;
  } else if (Math.abs(diffHours) < 24) {
    return diffHours < 0 ? `${Math.abs(diffHours)} hours ago` : `in ${diffHours} hours`;
  } else if (Math.abs(diffDays) < 30) {
    return diffDays < 0 ? `${Math.abs(diffDays)} days ago` : `in ${diffDays} days`;
  } else {
    return formatDate(dateObj);
  }
}

/**
 * Get age from birth date
 * @param birthDate - Birth date
 * @returns Age in years
 */
export function getAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get start of week (Monday)
 * @param date - Date to get start of week for
 * @returns Date object at start of week
 */
export function getStartOfWeek(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const startOfWeek = new Date(dateObj.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

/**
 * Get end of week (Sunday)
 * @param date - Date to get end of week for
 * @returns Date object at end of week
 */
export function getEndOfWeek(date: Date | string): Date {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = addDays(startOfWeek, 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

/**
 * Get start of month
 * @param date - Date to get start of month for
 * @returns Date object at start of month
 */
export function getStartOfMonth(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  return startOfMonth;
}

/**
 * Get end of month
 * @param date - Date to get end of month for
 * @returns Date object at end of month
 */
export function getEndOfMonth(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const endOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  return endOfMonth;
}

/**
 * Get start of year
 * @param date - Date to get start of year for
 * @returns Date object at start of year
 */
export function getStartOfYear(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  return startOfYear;
}

/**
 * Get end of year
 * @param date - Date to get end of year for
 * @returns Date object at end of year
 */
export function getEndOfYear(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  const endOfYear = new Date(dateObj.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);
  return endOfYear;
}

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Boolean indicating if dates are the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : new Date(date1);
  const d2 = typeof date2 === 'string' ? new Date(date2) : new Date(date2);
  return d1.toDateString() === d2.toDateString();
}

/**
 * Get business days between two dates (excluding weekends)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of business days
 */
export function getBusinessDays(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? new Date(endDate) : new Date(endDate);
  
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Convert timezone
 * @param date - Date to convert
 * @param timezone - Target timezone
 * @returns Date in target timezone
 */
export function convertTimezone(date: Date | string, timezone: string = TIMEZONE.DEFAULT): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  return new Date(dateObj.toLocaleString('en-US', { timeZone: timezone }));
}
