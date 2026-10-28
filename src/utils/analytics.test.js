import { EVENT_RETENTION_DAYS, trackEvent, getAnalytics, clearAnalytics, pruneAnalytics } from './analytics';
import { KEYS } from './storage';

describe('Analytics utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('trackEvent stores events in localStorage', () => {
    trackEvent('page_view', { screen: 'learn' });
    const events = getAnalytics();
    expect(events.length).toBe(1);
    expect(events[0].name).toBe('page_view');
    expect(events[0].screen).toBe('learn');
    expect(events[0].timestamp).toBeDefined();
  });

  test('redacts private fields from tracked events', () => {
    trackEvent('login_attempt', { screen: 'login', email: 'person@example.com', password: 'secret', token: 'abc' });
    const [event] = getAnalytics();
    expect(event.screen).toBe('login');
    expect(event.email).toBeUndefined();
    expect(event.password).toBeUndefined();
    expect(event.token).toBeUndefined();
  });

  test('recovers from malformed analytics storage', () => {
    localStorage.setItem('velora_events', '{not-json');
    expect(getAnalytics()).toEqual([]);
    trackEvent('recovered');
    expect(getAnalytics()[0].name).toBe('recovered');
  });

  test('caps events at 100 to prevent storage bloat', () => {
    for (let i = 0; i < 110; i++) {
      trackEvent('test', { i });
    }
    const events = getAnalytics();
    expect(events.length).toBe(100);
  });

  test('an event past the retention window is not returned', () => {
    const old = new Date(Date.now() - (EVENT_RETENTION_DAYS + 2) * 86400000).toISOString();
    const fresh = new Date().toISOString();
    localStorage.setItem(
      KEYS.EVENTS,
      JSON.stringify({
        v: 1,
        data: [
          { name: 'ancient', timestamp: old },
          { name: 'today', timestamp: fresh },
        ],
      }),
    );

    expect(getAnalytics().map((event) => event.name)).toEqual(['today']);
  });

  test('pruning deletes what reading already ignores', () => {
    const old = new Date(Date.now() - (EVENT_RETENTION_DAYS + 2) * 86400000).toISOString();
    const fresh = new Date().toISOString();
    localStorage.setItem(
      KEYS.EVENTS,
      JSON.stringify({
        v: 1,
        data: [
          { name: 'ancient', timestamp: old },
          { name: 'today', timestamp: fresh },
        ],
      }),
    );

    expect(pruneAnalytics()).toBe(1);
    const stored = JSON.parse(localStorage.getItem(KEYS.EVENTS)).data;
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('today');
  });

  test('pruning an empty log does nothing and says so', () => {
    expect(pruneAnalytics()).toBe(0);
     expect(localStorage.getItem(KEYS.EVENTS)).toBeNull();
  });

  test('an event with no timestamp is kept rather than silently dropped', () => {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify({ v: 1, data: [{ name: 'unreadable' }] }));
    expect(getAnalytics().map((event) => event.name)).toEqual(['unreadable']);
  });

  test('clearAnalytics removes all events', () => {
    trackEvent('event_one');
    trackEvent('event_two');
    clearAnalytics();
    expect(getAnalytics().length).toBe(0);
  });
});
