import { getSelfReportedStyle } from './onboardingPreferences';

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
