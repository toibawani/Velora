/**
 * VELORA utility module
 * analytics
 */
import { KEYS, readValue, writeValue, removeValue } from './storage';

const EVENTS_KEY = KEYS.EVENTS;
const MAX_EVENTS = 100;

/**
 * How long an event is worth keeping.
 *
 * The count cap alone meant a hundred events sat in storage forever: someone
 * who used the app twice last spring still carried those events a year later,
 * and nothing on any screen could read them. Thirty days is longer than any of
 * the six-week views look at and short enough that "what is stored" stays
 * small.
 */
export const EVENT_RETENTION_DAYS = 30;
const RETENTION_MS = EVENT_RETENTION_DAYS * 86400000;
const PRIVATE_KEYS = /^(email|password|token|secret|authorization)$/i;

const sanitizeData = (data) => Object.fromEntries(Object.entries(data).filter(([key]) => !PRIVATE_KEYS.test(key)).map(([key, value]) => [key, ['string', 'number', 'boolean'].includes(typeof value) ? value : String(value)]));

/**
 * Stored events that are still inside the retention window.
 *
 * An event with no parseable timestamp is kept: it was written by this app, so
 * dropping it would be losing something real over a formatting problem.
 */
const readEvents = (now = Date.now()) => {
  const parsed = readValue(EVENTS_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((event) => {
    if (!event || typeof event !== 'object') return false;
    const at = Date.parse(event.timestamp);
    return Number.isNaN(at) || now - at <= RETENTION_MS;
  });
};

export const trackEvent = (eventName, data = {}) => {
  const event = {
    name: typeof eventName === 'string' && eventName.trim() ? eventName.trim().slice(0, 80) : 'unknown_event',
    timestamp: new Date().toISOString(),
    ...sanitizeData(data),
  };

  const events = readEvents();
  events.push(event);
  writeValue(EVENTS_KEY, events.slice(-MAX_EVENTS));
};

export const getAnalytics = () => readEvents();

/**
 * Drops expired events from storage.
 *
 * Reading already ignores them, but ignoring is not forgetting: without this the
 * payload keeps growing to the count cap with events no screen will show again.
 * Returns how many were removed.
 */
export const pruneAnalytics = (now = Date.now()) => {
  const stored = readValue(EVENTS_KEY, []);
  if (!Array.isArray(stored)) return 0;
  const kept = readEvents(now);
  const removed = stored.length - kept.length;
  if (removed > 0) writeValue(EVENTS_KEY, kept);
  return removed;
};

export const clearAnalytics = () => {
  removeValue(EVENTS_KEY);
};
