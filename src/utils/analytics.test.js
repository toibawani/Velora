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
