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

// Privacy-respecting storage module.
// All data stays on-device.

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
  // Analytics opt-in. VELORA's promise is that nothing leaves your browser, so
  // external (cross-device, aggregate) analytics is opt-in and defaults off.
  ANALYTICS_OPTIN: 'velora_analytics_optin',
  // Return-visit counter for the 7-day aggregate measure. Stored as
  // { firstSeen, lastSeen, returnCount }; never sent as an identity.
  RETURN_VISITS: 'velora_return_visits',
  // Today's question: the question shown today, and whether the visitor has
  // answered it. Stored as { date, questionId, answered }. One question per
  // calendar day, picked deterministically so everyone sees the same one.
  TODAY_QUESTION: 'velora_today_question',
  // Pick up where you left off: the last lesson opened, so the atlas can offer
  // a one-tap resume. Stored as { subject, topicId, topicTitle, openedAt }.
  LAST_LESSON: 'velora_last_lesson',
  // What each game has actually produced on this device: the best round and
  // how many rounds have been played, keyed by game id. The hub used to show
  // nothing about a game until it was open, so the only way to know that
  // Concept Scrabble had never been finished was to open it and look. Stored as
  // { <gameId>: { best, max, plays, at } }.
  GAME_RESULTS: 'velora_game_results',
  // Dictionary entries opened recently, newest first, as ids. The console had
  // no memory of what someone had just read, so going back to an entry that was
  // open a minute ago meant searching for it again.
  RECENT_TERMS: 'velora_recent_terms',
  // Dialogue transcripts are one key per historical figure, e.g.
  // velora_dialogue_socrates. Kept here for the same reason as the others: a
  // prefix spelled in two files is a prefix that drifts.
  DIALOGUE_PREFIX: 'velora_dialogue',
};

/**
 * The prefix every key this app owns starts with.
 *
 * Keys are enumerated by prefix rather than by walking the registry object,
 * because three families (preferences, explanation boards, dialogues) are built
 * at runtime and never appear as literal KEYS values. A backup that walked the
 * object would silently leave them out, which is the one thing a backup must
 * not do.
 */
export const KEY_PREFIX = 'velora_';

export const EXPLANATION_BOARD = (term) => `${KEYS.EXPLANATION_BOARD_PREFIX}${term}`;

/**
 * What each stored family holds, in words.
 *
 * The Settings screen lists what is taking up space, and `velora_pref_sort` is
 * not an answer a person can act on. The labels live here, beside the keys, so
 * a new key without a label is visible in one file rather than showing up as an
 * opaque string on a screen.
 */
const KEY_LABELS = {
  [KEYS.THEME]: 'Chosen theme',
  [KEYS.PREFERENCES]: 'Preferences',
  [KEYS.ONBOARDING_DONE]: 'Setup completed',
  [KEYS.ONBOARDING_PREFERENCES]: 'Setup answers',
  [KEYS.LOCAL_PROFILE]: 'Name on this device',
  [KEYS.QUESTION_DESK]: 'Question desk',
  [KEYS.LEARNING_ANALYTICS]: 'Study time',
  [KEYS.EVENTS]: 'Usage events',
  [KEYS.REVIEWS]: 'Review schedule',
  [KEYS.REVISION_SCHEDULE]: 'Revision schedule',
  [KEYS.PERFORMANCE_LOG]: 'Slow operations log',
  [KEYS.LAST_ERROR]: 'Last error',
  [KEYS.LAST_OPERATION_ERROR]: 'Last failed operation',
  [KEYS.MY_EXPLANATIONS]: 'Your explanations',
  [KEYS.MYTH_STREAK]: 'Myth streak',
  [KEYS.TASKS]: 'Next up list',
  [KEYS.ANALYTICS_OPTIN]: 'Analytics opt-in',
  [KEYS.RETURN_VISITS]: 'Return visits',
  [KEYS.TODAY_QUESTION]: 'Today’s question',
  [KEYS.LAST_LESSON]: 'Last lesson opened',
  [KEYS.GAME_RESULTS]: 'Game results',
  [KEYS.RECENT_TERMS]: 'Recently opened terms',
};

/**
 * A human name for a stored key, falling back to the family it belongs to.
 *
 * The fallback is deliberately not empty: a key added without a label should
 * read as "Saved item (velora_new_thing)" on screen rather than as a blank row,
 * so the gap is obvious without being unreadable.
 */
export const describeStoredKey = (key) => {
  if (typeof key !== 'string') return 'Saved item';
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  if (key.startsWith(KEYS.EXPLANATION_BOARD_PREFIX)) {
    return `Explanation board · ${key.slice(KEYS.EXPLANATION_BOARD_PREFIX.length)}`;
  }
  if (key.startsWith(KEYS.DIALOGUE_PREFIX)) {
    return `Dialogue · ${key.slice(KEYS.DIALOGUE_PREFIX.length)}`;
  }
  if (key.startsWith(KEYS.PREFERENCE_PREFIX)) {
    return `Preference · ${key.slice(KEYS.PREFERENCE_PREFIX.length)}`;
  }
  return `Saved item · ${key.replace(KEY_PREFIX, '')}`;
};

/**
 * Every key in this browser that belongs to VELORA, sorted by name.
 *
 * Only this module spells the prefix, so the filter here and the key names in
 * the registry cannot disagree.
 */
export const listStoredKeys = () => {
  const store = storage();
  if (!store) return [];
  const found = [];
  try {
    for (let index = 0; index < store.length; index += 1) {
      const key = store.key(index);
      if (typeof key === 'string' && key.startsWith(KEY_PREFIX)) found.push(key);
    }
  } catch {
    return found.sort();
  }
  return found.sort();
};

const byteLength = (text) => {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(text).length;
  // Every character counts as two bytes rather than one. An estimate that is
  // too high is safe here; the number is only ever shown next to a quota.
  return text.length * 2;
};

/**
 * How much space this browser is holding on VELORA's behalf.
 *
 * Both the stored characters and the raw bytes are reported because they answer
 * different questions: a person reading the list wants to know which family is
 * large, and a person comparing against a 5 MB quota wants bytes. Storage
 * browsers measure in UTF-16 units, so `bytes` is the figure to compare with
 * the quota and `characters` is the figure that adds up to it exactly.
 */
export const storageUsage = () => {
  const store = storage();
  if (!store) return { available: false, keys: [], totalBytes: 0, totalCharacters: 0 };

  const keys = listStoredKeys().map((key) => {
    let raw = '';
    try {
      raw = store.getItem(key) || '';
    } catch {
      raw = '';
    }
    return { key, characters: raw.length, bytes: byteLength(raw) };
  });

  keys.sort((first, second) => second.bytes - first.bytes || first.key.localeCompare(second.key));
  return {
    available: true,
    keys,
    totalBytes: keys.reduce((sum, entry) => sum + entry.bytes, 0),
    totalCharacters: keys.reduce((sum, entry) => sum + entry.characters, 0),
  };
};

/**
 * Deletes every VELORA key in this browser and reports how many went.
 *
 * Scoped to the prefix on purpose: localStorage is shared with every other app
 * on the origin, and a reset that called clear() would take their data too.
 */
export const clearStoredData = () => {
  const store = storage();
  if (!store) return 0;
  let removed = 0;
  listStoredKeys().forEach((key) => {
    try {
      store.removeItem(key);
      removed += 1;
    } catch {
      // Leave the rest alone rather than abandoning the loop.
    }
  });
  return removed;
};

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
