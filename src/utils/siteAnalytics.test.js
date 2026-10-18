/**
 * VELORA utility module test
 * siteAnalytics
 *
 * These tests exist to show the module can fail: opting out must silence every
 * beacon, opting in must send the right aggregate payload, and the return-visit
 * counter must not invent returns. If the behaviour changes, the test fails.
 */

import {
  isOptedIn,
  setOptedIn,
  setGoatCounterCode,
  trackEvent,
  trackPageView,
  trackTopicOpened,
  trackLessonCompleted,
  trackGameCompleted,
  recordReturnVisit,
} from './siteAnalytics';

const originalSendBeacon = navigator.sendBeacon;
const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  // No code is configured by default: nothing is sent anywhere.
  setGoatCounterCode('');
});

afterAll(() => {
  navigator.sendBeacon = originalSendBeacon;
  global.fetch = originalFetch;
});

const captured = [];
const installBeaconSpy = () => {
  captured.length = 0;
  navigator.sendBeacon = jest.fn((url) => {
    captured.push(url);
    return true;
  });
  global.fetch = jest.fn();
};

describe('siteAnalytics respects the opt-in promise', () => {
  test('sends no beacon when not opted in', () => {
    installBeaconSpy();
    trackEvent('page_view', { path: '/learn', title: 'Learn' });
    expect(captured).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('setOptedIn(false) silences beacons even after opting in', () => {
    installBeaconSpy();
    setGoatCounterCode('velora-test');
    setOptedIn(true);
    expect(isOptedIn()).toBe(true);
    setOptedIn(false);
    trackPageView('/learn/physics', 'Black Holes');
    expect(captured).toEqual([]);
  });

  test('sends a cookieless beacon when opted in', () => {
    installBeaconSpy();
    setGoatCounterCode('velora-test');
    setOptedIn(true);
    trackPageView('/learn/physics', 'Black Holes');
    expect(captured.length).toBe(1);
    const url = captured[0];
    expect(url).toContain('velora-test.goatcounter.com/count');
    expect(url).toContain('p=%2Flearn%2Fphysics');
    expect(url).toContain('t=Black+Holes');
    expect(url).toContain('e=page_view');
    expect(url).not.toContain('email');
    expect(url).not.toContain('token');
  });

  test('trackTopicOpened, trackLessonCompleted and trackGameCompleted send aggregate events', () => {
    installBeaconSpy();
    setGoatCounterCode('velora-test');
    setOptedIn(true);
    trackTopicOpened('Reality', 'philosophy');
    trackLessonCompleted('The event horizon', 'physics');
    trackGameCompleted('Concept Check');
    expect(captured.length).toBe(3);
    expect(captured[0]).toContain('e=atlas_topic_opened');
    expect(captured[1]).toContain('e=lesson_completed');
    expect(captured[2]).toContain('e=game_completed');
    // No identity fields anywhere.
    captured.forEach((url) => {
      expect(url).not.toMatch(/user|id=|email|name=/i);
    });
  });

  test('sends nothing when no GoatCounter code is configured', () => {
    installBeaconSpy();
    setOptedIn(true);
    trackPageView('/learn', 'Learn');
    expect(captured).toEqual([]);
  });
});

describe('recordReturnVisit', () => {
  test('counts a visit within seven days as a return', () => {
    installBeaconSpy();
    setGoatCounterCode('velora-test');
    setOptedIn(true);
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const lastWeek = Date.now() - sevenDays / 2;
    // Pretend this device was seen last week.
    localStorage.setItem(
      'velora_return_visits',
      JSON.stringify({ firstSeen: lastWeek, lastSeen: lastWeek, returnCount: 0 }),
    );
    const count = recordReturnVisit();
    expect(count).toBe(1);
    const stored = JSON.parse(localStorage.getItem('velora_return_visits'));
    expect(stored.returnCount).toBe(1);
    // The beacon carries an aggregate count, not an identity.
    expect(captured.some((url) => url.includes('e=return_visit'))).toBe(true);
    expect(captured.some((url) => url.includes('returnCount=1'))).toBe(true);
  });

  test('does not increment when the last visit was more than seven days ago', () => {
    installBeaconSpy();
    const overSevenDays = 8 * 24 * 60 * 60 * 1000 + 1000;
    localStorage.setItem(
      'velora_return_visits',
      JSON.stringify({
        firstSeen: Date.now() - overSevenDays,
        lastSeen: Date.now() - overSevenDays,
        returnCount: 2,
      }),
    );
    const count = recordReturnVisit();
    // The counter keeps its accumulated value; this visit is not a return.
    expect(count).toBe(2);
    expect(captured).toEqual([]);
  });

  test('first ever visit records zero returns and sends no return_visit beacon', () => {
    installBeaconSpy();
    setGoatCounterCode('velora-test');
    setOptedIn(true);
    const count = recordReturnVisit();
    expect(count).toBe(0);
    expect(captured).toEqual([]);
  });
});
