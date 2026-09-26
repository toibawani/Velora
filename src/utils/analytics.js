import { safeGet, safeSet, safeRemove } from './storage';

const EVENTS_KEY = 'velora_events';
const MAX_EVENTS = 100;
const PRIVATE_KEYS = /^(email|password|token|secret|authorization)$/i;

const sanitizeData = (data) => Object.fromEntries(Object.entries(data).filter(([key]) => !PRIVATE_KEYS.test(key)).map(([key, value]) => [key, ['string', 'number', 'boolean'].includes(typeof value) ? value : String(value)]));

const readEvents = () => {
  const parsed = safeGet(EVENTS_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
};

export const trackEvent = (eventName, data = {}) => {
  const event = {
    name: typeof eventName === 'string' && eventName.trim() ? eventName.trim().slice(0, 80) : 'unknown_event',
    timestamp: new Date().toISOString(),
    ...sanitizeData(data),
  };

  const events = readEvents();
  events.push(event);
  safeSet(EVENTS_KEY, events.slice(-MAX_EVENTS));
};

export const getAnalytics = () => readEvents();

export const clearAnalytics = () => {
  safeRemove(EVENTS_KEY);
};
