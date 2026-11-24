import { CURRICULUM } from '../data/curriculum';
import { KEYS, FAILURE, readValue, writeValue } from '../utils/storage';
import { getAnalytics } from '../utils/analytics';
import { backendEnabled } from './supabaseClient';
import { getSessionUser, fetchProgress, onAuthChange, pushProgress } from './api';
import { dedupe, mergeEvents, missingOnServer } from './merge';

/**
 * Progress: local first, the server second.
 *
 * The order is the point. A lesson read is written to this browser before
 * anything is attempted over the network, so closing the tab mid-request, a
 * dead battery or a plane cannot lose it. The server is a copy that gets
 * reconciled when it can, not the place the record lives.
 *
 * The unit is { topic_id, kind, day }:
 *  - topic_id is `subject:topic-slug`, so `motion` in philosophy and `motion` in
 *    physics are different rows. It is derived from the curriculum by slug, not
 *    by title, because a title is a display string and gets edited.
 *  - kind is `lesson_read` for a lesson read to the end. It is the only kind this
 *    build writes; the database decides what it will accept.
 *  - day is the local calendar day, YYYY-MM-DD. Two reads on the same day are
 *    one row, which is what makes the merge a set union.
 *
 * What is deliberately not here: study minutes. `topicTimeDistribution` has a
 * topic, minutes and a subject but no date, so there is no honest `day` to send
 * and no honest way to place it on a second device. Fabricating today's date for
 * a session from three weeks ago would be worse than not syncing it.
 */

export const SYNC_STATUS = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  SYNCED: 'synced',
  OFFLINE: 'offline',
  FAILED: 'failed',
};

/** How long to wait before trying again, in order, then the last value forever. */
export const RETRY_DELAYS_MS = [2000, 5000, 15000, 60000];

const listeners = new Set();
let state = {
  status: SYNC_STATUS.IDLE,
  pending: 0,
  error: null,
  lastSyncedAt: null,
  signedIn: false,
};

const setState = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener(state));
};

export const getSyncState = () => state;

/** Subscribe to status changes. Calls back immediately with the current state. */
export const subscribe = (listener) => {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
};

/* ------------------------------------------------------------------ ids --- */

const titleIndex = (() => {
  const index = new Map();
  Object.entries(CURRICULUM).forEach(([subject, record]) => {
    (record.modules || []).forEach((module) => {
      (module.topics || []).forEach((topic) => {
        if (topic && topic.id) index.set(`${subject}:${String(topic.title).trim().toLowerCase()}`, `${subject}:${topic.id}`);
      });
    });
  });
  return index;
})();

/** `physics:motion`. The stable id, built from the slug rather than the title. */
export const topicIdFor = (subject, topicSlug) =>
  subject && topicSlug ? `${subject}:${topicSlug}` : null;

/**
 * The id for a lesson known only by its title, which is how the local event log
 * recorded it. Returns null for anything not in the curriculum (a black hole
 * level, a deep read), because inventing an id for those would put a row on the
 * server that no screen can ever resolve.
 */
export const resolveTopicId = (subject, title) => {
  if (!subject || typeof title !== 'string') return null;
  return titleIndex.get(`${subject}:${title.trim().toLowerCase()}`) || null;
};

/** The local calendar day of an instant, as YYYY-MM-DD. Not UTC: "today" is local. */
export const localDay = (value = Date.now()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

/* ---------------------------------------------------------- local store --- */

export const readLocalEvents = () => {
  const stored = readValue(KEYS.PROGRESS_EVENTS, []);
  return Array.isArray(stored) ? dedupe(stored) : [];
};

const writeLocalEvents = (events) => writeValue(KEYS.PROGRESS_EVENTS, dedupe(events));

/**
 * Every dated progress event this browser can prove.
 *
 * Two sources: the dedicated progress key, and the older usage log, where a
 * finished lesson was recorded as `lesson_completed` with a title and subject.
 * The usage log is read through the registry like everything else, and the title
 * is resolved to a slug id here rather than uploaded as free text.
 */
export const collectLocalProgress = () => {
  const fromLog = getAnalytics()
    .filter((event) => event && event.name === 'lesson_completed' && typeof event.lesson === 'string')
    .map((event) => {
      const topicId = resolveTopicId(event.subject, event.lesson);
      const day = localDay(event.timestamp);
      if (!topicId || !day) return null;
      return { topic_id: topicId, kind: 'lesson_read', day };
    })
    .filter(Boolean);

  return dedupe([...readLocalEvents(), ...fromLog]);
};

/**
 * Writes one progress event locally, then tries to copy it. Returns whether the
 * local write landed; a failed push is a state on the sync indicator, never an
 * exception in the render path of a lesson.
 */
export const recordProgressEvent = ({ subject, topicId, kind = 'lesson_read', day }) => {
  const id = topicId && topicId.includes(':') ? topicId : topicIdFor(subject, topicId);
  const eventDay = day || localDay();
  if (!id || !eventDay) return false;

  const next = dedupe([...readLocalEvents(), { topic_id: id, kind, day: eventDay }]);
  const result = writeLocalEvents(next);
  if (result !== FAILURE.NONE) return false;

  if (backendEnabled && state.signedIn) {
    // A push is a copy, so it is allowed to be slow and is never awaited by the
    // reader. The retry ladder picks it up if it fails.
    syncNow().then(maybeRetry).catch(() => {});
  }
  return true;
};

/* ----------------------------------------------------------------- sync --- */

let inFlight = null;
let retryAttempt = 0;
let retryTimer = null;

const clearRetry = () => {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
};

const maybeRetry = () => {
  if (!backendEnabled || !state.signedIn) return;
  const retryable = state.status === SYNC_STATUS.FAILED || state.status === SYNC_STATUS.OFFLINE;
  if (!retryable) {
    retryAttempt = 0;
    clearRetry();
    return;
  }
  clearRetry();
  const delay = RETRY_DELAYS_MS[Math.min(retryAttempt, RETRY_DELAYS_MS.length - 1)];
  retryAttempt += 1;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    syncNow().then(maybeRetry).catch(() => {});
  }, delay);
};

/**
 * Reconcile this browser with the account.
 *
 * fetch, union, write the union here, push only what the server is missing.
 * `synced` is set in exactly one place: after `pushProgress` resolves. A failed
 * fetch, a failed push and an exception all leave the status as failed or
 * offline, which is why the indicator cannot claim something it did not do.
 */
export function syncNow() {
  if (!backendEnabled) return Promise.resolve(state);
  if (inFlight) return inFlight;

  inFlight = (async () => {
    setState({ status: SYNC_STATUS.SYNCING, error: null });
    try {
      const remote = await fetchProgress();
      const merged = mergeEvents(collectLocalProgress(), remote);
      writeLocalEvents(merged);
      const missing = missingOnServer(merged, remote);
      setState({ pending: missing.length });
      await pushProgress(missing);
      setState({
        status: SYNC_STATUS.SYNCED,
        pending: 0,
        error: null,
        lastSyncedAt: Date.now(),
      });
    } catch (error) {
      const offline = error && error.code === 'offline';
      setState({
        status: offline ? SYNC_STATUS.OFFLINE : SYNC_STATUS.FAILED,
        error: (error && error.message) || 'That did not work. Try again.',
      });
    } finally {
      inFlight = null;
    }
    return state;
  })();

  return inFlight;
}

/** The button beside a failed state. Resets the ladder so a press retries at once. */
export const retryNow = () => {
  retryAttempt = 0;
  clearRetry();
  return syncNow().then(maybeRetry);
};

let teardown = null;

/**
 * Start watching for a session. Called once from App. Safe to call twice: the
 * second call tears down the first.
 */
export function initSync() {
  if (!backendEnabled) return () => {};
  if (teardown) teardown();

  const unsubscribe = onAuthChange((user) => {
    setState({ signedIn: Boolean(user) });
    if (user) {
      retryAttempt = 0;
      syncNow().then(maybeRetry).catch(() => {});
    } else {
      clearRetry();
      setState({ status: SYNC_STATUS.IDLE, pending: 0, error: null });
    }
  });

  const handleOnline = () => {
    if (state.signedIn) retryNow();
  };
  if (typeof window !== 'undefined') window.addEventListener('online', handleOnline);

  // A link just opened, or this is a returning signed-in visitor: neither fires
  // an auth callback reliably in every browser, so read the session once.
  getSessionUser()
    .then((user) => {
      setState({ signedIn: Boolean(user) });
      if (user) syncNow().then(maybeRetry).catch(() => {});
    })
    .catch(() => {});

  teardown = () => {
    unsubscribe();
    clearRetry();
    if (typeof window !== 'undefined') window.removeEventListener('online', handleOnline);
    teardown = null;
  };
  return teardown;
}

/** Stops the watcher and any pending retry. Used by tests and by nothing else. */
export function stopSync() {
  if (teardown) teardown();
  clearRetry();
  inFlight = null;
}
