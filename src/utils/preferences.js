import { safeGet, safeSet, safeRemove } from './storage';

export const getPreference = (key, defaultValue) => {
  return safeGet(`velora_pref_${key}`, defaultValue);
};

export const setPreference = (key, value) => {
  safeSet(`velora_pref_${key}`, value);
};

export const clearPreference = (key) => {
  safeRemove(`velora_pref_${key}`);
};
