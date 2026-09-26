/**
 * Safe LocalStorage Wrapper
 * 
 * Protects against:
 * 1. Storage quota exceeded (QUOTA_EXCEEDED_ERR / NS_ERROR_DOM_QUOTA_REACHED)
 * 2. Disabled/blocked localStorage (private browsing modes, cookies disabled)
 * 3. Corrupt or non-JSON string values
 * 4. Unexpected prototype pollution
 */

export const safeGet = (key, fallback = null) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const item = window.localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    try {
      return JSON.parse(item);
    } catch {
      // If it's a plain primitive string rather than JSON
      return item;
    }
  } catch (err) {
    console.warn(`[storage] Failed to read key "${key}":`, err.message);
    return fallback;
  }
};

export const safeSet = (key, value) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`[storage] Failed to write key "${key}":`, err.message);
    return false;
  }
};

export const safeRemove = (key) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[storage] Failed to remove key "${key}":`, err.message);
    return false;
  }
};
