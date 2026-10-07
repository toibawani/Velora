/**
 * Every localStorage key VELORA uses, in one place.
 *
 * There were 17 of these, each managed separately by whichever module happened
 * to need it, with no schema and no version. That is how a payload written by
 * last month's code becomes unparseable with nothing to migrate it and no way
 * to tell "corrupt" from "written by an older version".
 *
 * Rules for this module:
 *  - No raw 'velora_*' string appears anywhere else in src/. Add a key here.
 *  - Payloads are wrapped: { v: <version>, data: <payload> }. Anything not
 *    wrapped is read as version 0 and handed to that key's migration.
 *  - Writes report whether they landed. Callers must surface a failure rather
 *    than implying data was saved.
 */

export const KEYS = {
  THEME: 'velora_theme_preference',
  PREFERENCES: 'velora_preferences',
  ONBOARDING_DONE: 'velora_onboarding_done',
  ONBOARDING_PREFERENCES: 'velora_onboarding_preferences',
  LOCAL_PROFILE: 'velora_local_profile',
  QUESTION_DESK: 'velora_question_desk',
  LEARNING_ANALYTICS: 'velora_learning_analytics',
  EVENTS: 'velora_events',
  REVIEWS: 'velora_reviews',
  REVISION_SCHEDULE: 'velora_revision_schedule',
  PERFORMANCE_LOG: 'velora_performance_log',
  LAST_ERROR: 'velora_last_error',
  LAST_OPERATION_ERROR: 'velora_last_operation_error',
  MY_EXPLANATIONS: 'velora_my_explanations',
  MYTH_STREAK: 'velora_myth_streak',
  // Next up. A personal list of things to come back to, scoped to learning.
  TASKS: 'velora_next_up',
  // Individual preferences are their own key family: velora_pref_<name>.
  PREFERENCE_PREFIX: 'velora_pref_',
  // Explanation boards are keyed per term, e.g. velora_explanations_momentum.
  EXPLANATION_BOARD_PREFIX: 'velora_explanations_',
};

export const EXPLANATION_BOARD = (term) => `${KEYS.EXPLANATION_BOARD_PREFIX}${term}`;

/** The version written by this build. A key with no migrations uses 1. */
export const CURRENT_VERSION = 1;

/**
 * Migrations from older versions, per key. Each entry maps a stored version
 * number to a function producing the payload for the next version.
 *
 * Version 0 means "written before any of this existed", i.e. a bare value with
 * no envelope. Those already hold usable data, so the default migration
 * identity-transforms them rather than discarding a learner's work.
 *
 * When a payload's shape changes incompatibly, add its migration here and
 * bump CURRENT_VERSION. That is the whole point: the change becomes a line in
 * this file instead of a bug report.
 */
export const MIGRATIONS = {
  // Key: { fromVersion: (data) => data }
};

const migrate = (key, version, data) => {
  let current = data;
  let v = version;
  while (v < CURRENT_VERSION) {
    const step = (MIGRATIONS[key] || {})[v];
    current = typeof step === 'function' ? step(current) : current;
    v += 1;
  }
  return current;
};

const storage = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    // Accessing localStorage throws outright when storage is disabled by policy.
    return null;
  }
};

/** Why a write did not land. 'none' means it did. */
export const FAILURE = {
  NONE: 'none',
  DISABLED: 'disabled',
  QUOTA: 'quota',
  FAILED: 'failed',
};

export const isAvailable = () => storage() !== null;

/**
 * Reads a key, migrating it if needed. Never throws: a malformed value reads as
 * the fallback, which is the behaviour every call site in this app already
 * depended on from safeGet.
 */
export const readValue = (key, fallback = null) => {
  const store = storage();
  if (!store) return fallback;
  let raw;
  try {
    raw = store.getItem(key);
  } catch {
    return fallback;
  }
  if (raw === null || raw === undefined) return fallback;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // A value that is not JSON at all is a legacy plain string. Pass it
    // through: the old safeGet did, and code depends on it.
    return raw;
  }

  if (parsed && typeof parsed === 'object' && typeof parsed.v === 'number' && 'data' in parsed) {
    return migrate(key, parsed.v, parsed.data);
  }
  return migrate(key, 0, parsed);
};

/** Writes a wrapped, versioned payload. Returns FAILURE.NONE or the reason. */
export const writeValue = (key, data) => {
  const store = storage();
  if (!store) return FAILURE.DISABLED;
  try {
    store.setItem(key, JSON.stringify({ v: CURRENT_VERSION, data }));
    return FAILURE.NONE;
  } catch (err) {
    if (err && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED' || err.code === 22)) {
      return FAILURE.QUOTA;
    }
    return FAILURE.FAILED;
  }
};

export const removeValue = (key) => {
  const store = storage();
  if (!store) return false;
  try {
    store.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

/**
 * A single place to ask "can this device keep what we just wrote?".
 *
 * The UI uses this to say plainly that a save did not happen, rather than
 * claiming the data is safe when it is not.
 */
export const describeStorage = () => {
  if (!isAvailable()) {
    return {
      available: false,
      message: 'This browser is not letting VELORA store anything. Progress will be lost when you close the tab.',
    };
  }
  try {
    const probeKey = '__velora_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return { available: true, message: null };
  } catch {
    return {
      available: false,
      message: 'This browser refused a storage write. Progress will be lost when you close the tab.',
    };
  }
};

/**
 * Legacy wrappers, kept so existing call sites and their tests keep working.
 * New code should use readValue/writeValue with a KEYS constant, because those
 * carry the version envelope and report write failures.
 *
 * safeGet still warns on a read failure, which readValue deliberately does not:
 * analytics.test.js asserts no warning is emitted while recovering from
 * corrupted storage.
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
