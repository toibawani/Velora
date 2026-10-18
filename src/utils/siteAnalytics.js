/**
 * VELORA utility module
 * siteAnalytics
 *
 * Privacy-respecting, cookieless, aggregate-only site analytics.
 *
 * The promise of VELORA is "nothing leaves your browser." Sending even an
 * anonymised page view to a third party breaks that promise for the visitor
 * who has not agreed to it, so every beacon in this module is gated on an
 * explicit opt-in, and the opt-in defaults to off. When it is off, nothing is
 * sent, nothing is read from the network, and this module is a no-op.
 *
 * What is sent (only when opted in):
 *   - page views (path and title, no personal data)
 *   - which Atlas topics open (topic and subject, not who opened them)
 *   - whether a lesson is read to the end (scroll depth, not what was read)
 *   - game completions (game id only)
 *   - return visits within 7 days (an aggregate count from a localStorage
 *     counter; never sent as, or with, an identity)
 *
 * No cookies are set, no fingerprinting is used, and no identifier is shared.
 * Events are aggregated by the analytics provider (GoatCounter), not by us.
 *
 * Configuration: set GOATCOUNTER_CODE to your GoatCounter subdomain (the part
 * before .goatcounter.com). Until it is set, track() is a deliberate no-op, so
 * deploying this code sends nothing anywhere.
 */

/*
 * The operator plugs their GoatCounter subdomain here (the part before
 * .goatcounter.com) to actually send beacons. Left blank, nothing is sent
 * anywhere — which is the safe default for a no-account, no-backend app that
 * promises nothing leaves your browser.
 */
let GOATCOUNTER_CODE = '';

/** Configure the GoatCounter subdomain. No-op network call until this is set. */
export const setGoatCounterCode = (code) => {
  GOATCOUNTER_CODE = String(code || '');
};

const beaconUrl = (path, title, eventName) => {
  if (!GOATCOUNTER_CODE) return null;
  const url = new URL(`https://${GOATCOUNTER_CODE}.goatcounter.com/count`);
  url.searchParams.set('p', path);
  if (title) url.searchParams.set('t', title.slice(0, 200));
  if (eventName) url.searchParams.set('e', eventName.slice(0, 80));
  return url.toString();
};

// sendBeacon is cookieless and does not delay navigation. Fetch with keepalive
// is the fallback, then a 1x1 image beacon for older browsers.
const sendBeacon = (url) => {
  if (!url) return false;
  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      return navigator.sendBeacon(url);
    }
  } catch {
    // fall through to fetch
  }
  try {
    if (typeof fetch !== 'undefined') {
      fetch(url, { keepalive: true, method: 'GET' });
      return true;
    }
  } catch {
    // fall through
  }
  try {
    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.src = url;
      return true;
    }
  } catch {
    // ignore
  }
  return false;
};

const readJson = (key, fallback) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/** Returns true only when the visitor has explicitly opted in to external analytics. */
export const isOptedIn = () => readJson('velora_analytics_optin', false) === true;

/** Opts the visitor in or out of external analytics. Returns whether the write landed. */
export const setOptedIn = (enabled) => writeJson('velora_analytics_optin', Boolean(enabled));

/** Track an aggregate event. No-op when not opted in or when no endpoint is configured. */
export const trackEvent = (eventName, data = {}) => {
  if (!isOptedIn()) return false;
  const url = beaconUrl(data.path || '', data.title, eventName);
  if (!url) return false;
  // Append any extra aggregate fields (never an identity). path and title are
  // handled by beaconUrl; everything else is an optional measure.
  const u = new URL(url);
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'path' || key === 'title') return;
    if (value === undefined || value === null) return;
    u.searchParams.set(key, String(value));
  });
  return sendBeacon(u.toString());
};

/** Track a page view. Called on each screen change. */
export const trackPageView = (path, title) =>
  trackEvent('page_view', { path, title });

/** Track that an Atlas topic was opened (topic and subject only). */
export const trackTopicOpened = (topic, subject) =>
  trackEvent('atlas_topic_opened', { topic, subject });

/** Track that a lesson was read to the end. */
export const trackLessonCompleted = (lesson, subject) =>
  trackEvent('lesson_completed', { lesson, subject });

/** Track that a game was completed. */
export const trackGameCompleted = (game) =>
  trackEvent('game_completed', { game });

/**
 * Return visits within 7 days, measured with a localStorage counter and never
 * sent as an identity. Returns the current aggregate return count.
 *
 * On each visit: if the last visit was within seven days, this visit is a
 * return visit and the aggregate count rises by one. lastSeen is always
 * refreshed. A device seen once and never again contributes zero returns.
 */
export const recordReturnVisit = () => {
  const now = Date.now();
  const stored = readJson('velora_return_visits', null);
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  let firstSeen = now;
  let lastSeen = now;
  let returnCount = 0;
  let hadPreviousVisit = false;

  if (stored && typeof stored === 'object') {
    hadPreviousVisit = true;
    firstSeen = typeof stored.firstSeen === 'number' ? stored.firstSeen : now;
    lastSeen = typeof stored.lastSeen === 'number' ? stored.lastSeen : now;
    returnCount = typeof stored.returnCount === 'number' ? stored.returnCount : 0;
  }

  // A brand-new device is not a "return". Only count this visit when we have
  // seen this device before and the last look was within seven days.
  let justReturned = false;
  if (hadPreviousVisit && now - lastSeen < sevenDays) {
    returnCount += 1;
    justReturned = true;
  }

  const payload = { firstSeen, lastSeen: now, returnCount };
  writeJson('velora_return_visits', payload);

  // Only report a return when one actually happened; a first visit is not a
  // return visit and produces no beacon at all.
  if (isOptedIn() && justReturned) {
    trackEvent('return_visit', { returnCount });
  }

  return returnCount;
};

const siteAnalytics = {
  isOptedIn,
  setOptedIn,
  trackEvent,
  trackPageView,
  trackTopicOpened,
  trackLessonCompleted,
  trackGameCompleted,
  recordReturnVisit,
};

export default siteAnalytics;
