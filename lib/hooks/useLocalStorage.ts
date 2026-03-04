'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persisting state to localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('[useLocalStorage] Error reading from localStorage:', error);
    }
    setIsHydrated(true);
  }, [key]);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((previous) => {
      try {
        const valueToStore = value instanceof Function ? value(previous) : value;

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        return valueToStore;
      } catch (error) {
        console.error('[useLocalStorage] Error writing to localStorage:', error);
        return previous;
      }
    });
  }, [key]);

  // Return initial value during SSR, hydrated value after mount
  return [isHydrated ? storedValue : initialValue, setValue];
}

