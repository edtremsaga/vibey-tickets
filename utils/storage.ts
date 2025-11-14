import { EventWatch } from '../types';

const STORAGE_KEY = 'ticketWatches';

/**
 * Load watches from localStorage
 * @returns Array of EventWatch objects, or empty array if none exist or on error
 */
export const loadWatchesFromStorage = (): EventWatch[] => {
  try {
    const savedWatches = localStorage.getItem(STORAGE_KEY);
    if (!savedWatches) {
      return [];
    }
    const parsed = JSON.parse(savedWatches);
    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      console.warn('Invalid data format in localStorage, resetting...');
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load watches from localStorage:', error);
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (clearError) {
      console.error('Failed to clear corrupted localStorage:', clearError);
    }
    return [];
  }
};

/**
 * Save watches to localStorage
 * @param watches Array of EventWatch objects to save
 * @returns true if successful, false otherwise
 */
export const saveWatchesToStorage = (watches: EventWatch[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watches));
    return true;
  } catch (error) {
    console.error('Failed to save watches to localStorage:', error);
    // Check if it's a quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Consider using IndexedDB for larger datasets.');
    }
    return false;
  }
};

/**
 * Clear all watches from localStorage
 */
export const clearWatchesFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear watches from localStorage:', error);
  }
};

