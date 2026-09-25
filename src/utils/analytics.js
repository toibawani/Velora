const EVENTS_KEY = 'velora_events';
const MAX_EVENTS = 100;
const PRIVATE_KEYS = /^(email|password|token|secret|authorization)$/i;

const sanitizeData = (data) => Object.fromEntries(Object.entries(data).filter(([key]) => !PRIVATE_KEYS.test(key)).map(([key, value]) => [key, ['string', 'number', 'boolean'].includes(typeof value) ? value : String(value)]));

const readEvents = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const trackEvent = (eventName, data = {}) => {
  const event = {
    name: typeof eventName === 'string' && eventName.trim() ? eventName.trim().slice(0, 80) : 'unknown_event',
    timestamp: new Date().toISOString(),
    ...sanitizeData(data),
  };

  try {
    const events = readEvents();
    events.push(event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // Analytics must never interrupt a learner.
  }
};

export const getAnalytics = () => readEvents();

export const clearAnalytics = () => {
  try {
    localStorage.removeItem(EVENTS_KEY);
  } catch {
    // Clearing analytics is best effort.
  }
};
