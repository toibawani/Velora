import { KEYS, readValue, writeValue, removeValue } from './storage';

// Individual preferences are their own key family: velora_pref_<name>. They are
// namespaced here so the prefix lives in exactly one place.
const preferenceKey = (key) => `${KEYS.PREFERENCE_PREFIX}${key}`;

export const getPreference = (key, defaultValue) => readValue(preferenceKey(key), defaultValue);

export const setPreference = (key, value) => writeValue(preferenceKey(key), value) !== 'failed';

export const clearPreference = (key) => removeValue(preferenceKey(key));
