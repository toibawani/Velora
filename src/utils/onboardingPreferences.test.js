import {
  getOnboardingPreferences,
  getSelfReportedStyle,
  setOnboardingPreference,
  STYLE_OPTIONS,
  TIME_OPTIONS,
} from './onboardingPreferences';
import { FAILURE, KEYS } from './storage';

describe('self-reported learning style', () => {
  beforeEach(() => localStorage.clear());

  const store = (value) =>
    localStorage.setItem('velora_onboarding_preferences', JSON.stringify(value));

  test('says nothing when the learner never chose a style', () => {
    expect(getSelfReportedStyle()).toBeNull();
  });

  test('names each style the setup flow offers', () => {
    store({ domain: 'physics', style: 'visual', time: '30 minutes' });
    expect(getSelfReportedStyle()).toEqual({ id: 'visual', label: 'Visual' });

    store({ domain: 'physics', style: 'textual', time: '30 minutes' });
    expect(getSelfReportedStyle().label).toBe('Textual');

    store({ domain: 'physics', style: 'interactive', time: '30 minutes' });
    expect(getSelfReportedStyle().label).toBe('Interactive');
  });

  test('refuses a style it does not recognise rather than guessing one', () => {
    store({ domain: 'physics', style: 'telepathic', time: '30 minutes' });
    expect(getSelfReportedStyle()).toBeNull();
  });

  test('survives corrupted storage without inventing a preference', () => {
    localStorage.setItem('velora_onboarding_preferences', '{not-json');
    expect(getSelfReportedStyle()).toBeNull();
  });

  test('ignores a value that is not an object', () => {
    localStorage.setItem('velora_onboarding_preferences', JSON.stringify('visual'));
    expect(getSelfReportedStyle()).toBeNull();
  });
});

/**
 * The answers were write-once, and these cover the setter that changed that.
 * The screen test covers the UI; these cover the storage rules, because both
 * failure modes that matter here are silent: a merge that wipes the fields you
 * did not touch, and a write reported as done that did not land.
 */
describe('editing the onboarding answers', () => {
  beforeEach(() => localStorage.clear());

  const store = (value) =>
    localStorage.setItem('velora_onboarding_preferences', JSON.stringify(value));

  test('changes one answer without disturbing the other two', () => {
    store({ domain: 'physics', style: 'visual', time: '30 minutes' });

    expect(setOnboardingPreference('style', 'textual')).toBe(FAILURE.NONE);

    // The whole point of the setter. A naive write of { style } alone would have
    // answered the write-once problem by throwing away the other two answers.
    expect(getOnboardingPreferences()).toEqual({
      domain: 'physics',
      style: 'textual',
      time: '30 minutes',
    });
  });

  test('clears one answer when asked to, and only that one', () => {
    store({ domain: 'physics', style: 'visual', time: '30 minutes' });

    setOnboardingPreference('time', null);

    expect(getOnboardingPreferences()).toEqual({ domain: 'physics', style: 'visual', time: null });
    // The card on the Learn screen reads this, so a clear here has to be
    // visible there rather than leaving a stale value on screen.
    expect(getSelfReportedStyle()).toEqual({ id: 'visual', label: 'Visual' });
  });

  test('leaves the stored value alone when nothing is passed', () => {
    // undefined means "not specified". It must not clear the field: writing it
    // stores a key with no value, which JSON.stringify drops, so the answer
    // would vanish instead of staying as it was.
    store({ domain: 'physics', style: 'visual', time: '30 minutes' });

    setOnboardingPreference('style', undefined);

    expect(getOnboardingPreferences().style).toBe('visual');
  });

  test('refuses a value this app does not offer', () => {
    store({ style: 'visual' });

    expect(setOnboardingPreference('style', 'telepathic')).toBe(FAILURE.FAILED);
    expect(setOnboardingPreference('time', 'all day every day')).toBe(FAILURE.FAILED);
    expect(setOnboardingPreference('favouriteColour', 'blue')).toBe(FAILURE.FAILED);

    // None of the rejections touched what was stored.
    expect(getOnboardingPreferences().style).toBe('visual');
  });

  test('reports a refused write rather than a save that did not happen', () => {
    store({ style: 'visual' });
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied');
    });

    expect(setOnboardingPreference('style', 'textual')).toBe(FAILURE.FAILED);

    setItem.mockRestore();
  });

  test('reads back nothing rather than guessing when storage is corrupt', () => {
    localStorage.setItem('velora_onboarding_preferences', '{not-json');
    expect(getOnboardingPreferences()).toEqual({ domain: null, style: null, time: null });
  });

  test('drops a stored value the app no longer offers instead of showing it', () => {
    // A style that used to exist, or a hand-edited payload, must not appear
    // here as a selected option that no button can turn off.
    store({ domain: 'physics', style: 'kinesthetic', time: '3 hours' });

    expect(getOnboardingPreferences()).toEqual({ domain: 'physics', style: null, time: null });
  });

  test('the offered options match the ones the setup flow writes', () => {
    // The setup flow has its own hardcoded list. If these drift apart, a learner
    // picks a value on one screen the other cannot represent.
    expect(STYLE_OPTIONS.map((option) => option.id)).toEqual(['visual', 'textual', 'interactive']);
    expect(TIME_OPTIONS).toEqual(['15 minutes', '30 minutes', '1 hour', 'As long as it takes']);
  });

  test('writes through the versioned registry rather than raw localStorage', () => {
    setOnboardingPreference('style', 'visual');
    const payload = JSON.parse(window.localStorage.getItem(KEYS.ONBOARDING_PREFERENCES));
    // Same envelope every other key uses, so a payload from an older build is
    // readable rather than unparseable. The other two fields are written as
    // explicit nulls rather than omitted: a key that is present and null says
    // "asked and unanswered", which is different from a key that is missing.
    expect(payload).toEqual({
      v: 1,
      data: { domain: null, style: 'visual', time: null },
    });
  });
});

