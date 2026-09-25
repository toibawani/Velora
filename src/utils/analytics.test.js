import { trackEvent, getAnalytics, clearAnalytics } from './analytics';

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

  test('clearAnalytics removes all events', () => {
    trackEvent('event_one');
    trackEvent('event_two');
    clearAnalytics();
    expect(getAnalytics().length).toBe(0);
  });
});
