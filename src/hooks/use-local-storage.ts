/**
 * useLocalStorage Hook
 * Custom hook to synchronize state with localStorage using debounced writes
 * Optimized version that prevents excessive localStorage writes
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { debouncedSetItem, getItem } from '@/services/storage-service';

/**
 * Custom hook for persisting state to localStorage with debouncing
 *
 * @param key - LocalStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @param debounceDelay - Debounce delay in milliseconds (default: 500ms)
 * @returns Tuple of [value, setValue] similar to useState
 *
 * @example
 * const [collections, setCollections] = useLocalStorage('collections', []);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceDelay: number = 500
): [T, (value: T | ((val: T) => T)) => void] {

  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const value = getItem<T>(key, initialValue);
      setStoredValue(value);
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      setStoredValue(initialValue);
    } finally {
      setIsInitialized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Save to localStorage with debouncing (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      debouncedSetItem(key, storedValue, debounceDelay);
    }
  }, [key, storedValue, isInitialized, debounceDelay]);

  /**
   * Updates the stored value
   * Supports both direct values and updater functions
   */
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prevValue => {
      const valueToStore = value instanceof Function ? value(prevValue) : value;
      return valueToStore;
    });
  }, []);

  return [storedValue, setValue];
}
