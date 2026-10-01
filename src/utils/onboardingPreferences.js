import { KEYS, readValue } from './storage';

const ONBOARDING_PREFERENCES_KEY = KEYS.ONBOARDING_PREFERENCES;

/**
 * What the learner said about themselves when they set VELORA up.
 *
 * This is a self-report. It is not a reading of how anyone actually studied, so
 * it is returned with the shape that lets the UI say so out loud, rather than
 * being handed to the analytics tiles where a guess would look like a
 * measurement. OnboardingTour writes { domain, style, time } under this key.
 */
const STYLE_LABELS = {
  visual: 'Visual',
  textual: 'Textual',
  interactive: 'Interactive',
};

export const getSelfReportedStyle = () => {
  const stored = readValue(ONBOARDING_PREFERENCES_KEY, null);
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return null;

  const label = STYLE_LABELS[stored.style];
  return label ? { id: stored.style, label } : null;
};
