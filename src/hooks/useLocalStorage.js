import { useState } from 'react';

/**
 * A custom hook that provides a stateful value and a function to update it,
 * persistent in window.localStorage.
 *
 * @template T
 * @param {string} key The key to use in localStorage.
 * @param {T | (() => T)} initialValue The initial value to use if no value is stored in localStorage.
 * @returns {[T, import('react').Dispatch<import('react').SetStateAction<T>>]} An array containing the stored value and a function to update it.
 */
export default function useLocalStorage(key, initialValue) {
  // Helper function to check if localStorage is available and working
  const isLocalStorageAvailable = () => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  };

  const hasStorage = isLocalStorageAvailable();

  // Initialize state
  const [storedValue, setStoredValue] = useState(() => {
    // Resolve initialValue if it's a function
    const valueToStore = initialValue instanceof Function ? initialValue() : initialValue;

    if (!hasStorage) {
      return valueToStore;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        // If not in localStorage, store initialValue and return it
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      }

      // Try parsing the stored JSON. If it fails, return the initialValue
      try {
        return JSON.parse(item);
      } catch (parseError) {
        console.error(`Error parsing JSON for key "${key}":`, parseError);
        return valueToStore;
      }
    } catch (error) {
      console.error(`Error reading key "${key}" from localStorage:`, error);
      return valueToStore;
    }
  });

  /**
   * Return a wrapped version of useState's setter function that persists the new value to localStorage.
   * 
   * @param {T | ((prevValue: T) => T)} value The new value or a function that receives the previous value and returns the new value.
   */
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);

      // Save to local storage if available
      if (hasStorage) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting key "${key}" to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
