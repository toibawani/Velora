import { KEYS, readValue, writeValue, FAILURE } from './storage';

const ONBOARDING_PREFERENCES_KEY = KEYS.ONBOARDING_PREFERENCES;

/**
 * What the learner said about themselves when they set VELORA up.
 *
 * This is a self-report. It is not a reading of how anyone actually studied, so
 * it is returned with the shape that lets the UI say so out loud, rather than
 * being handed to the analytics tiles where a guess would look like a
 * measurement. OnboardingTour writes { domain, style, time } under this key.
 *
 * The setup flow runs once. Before this module grew a setter, that made these
 * three values write-once: the Learn screen said "chosen when you set up VELORA,
 * not measured" and offered no way to change it, so a learner who picked
 * Visual and then found they read better had no route to say so. They are
 * editable on the settings screen, and the card on Learn keeps its wording
 * because what it displays is still a self-report either way.
 */
const STYLE_LABELS = {
  visual: 'Visual',
  textual: 'Textual',
  interactive: 'Interactive',
};

/** The three styles the setup flow offers, in the order it offers them. */
export const STYLE_OPTIONS = Object.entries(STYLE_LABELS).map(([id, label]) => ({ id, label }));

/** What the setup flow offers for a daily intention, in its own words. */
export const TIME_OPTIONS = ['15 minutes', '30 minutes', '1 hour', 'As long as it takes'];

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const getSelfReportedStyle = () => {
  const stored = readValue(ONBOARDING_PREFERENCES_KEY, null);
  if (!isObject(stored)) return null;

  const label = STYLE_LABELS[stored.style];
  return label ? { id: stored.style, label } : null;
};

/**
 * All three stored values, each one dropped if it is not one this app offers.
 *
 * Reading through the allow-lists rather than trusting the stored shape means a
 * hand-edited or half-migrated payload cannot put an unknown domain id or a
 * style that no longer exists into the settings screen as a selected option.
 */
export const getOnboardingPreferences = () => {
  const stored = readValue(ONBOARDING_PREFERENCES_KEY, null);
  const source = isObject(stored) ? stored : {};
  return {
    domain: typeof source.domain === 'string' && source.domain !== '' ? source.domain : null,
    style: STYLE_LABELS[source.style] ? source.style : null,
    time: TIME_OPTIONS.includes(source.time) ? source.time : null,
  };
};

/**
 * Writes one of the three, keeping whatever else is already stored.
 *
 * A field is only changed when a value is passed. Passing null clears it, which
 * is different from passing nothing: "I did not choose this" and "leave what I
 * chose alone" are not the same instruction, and merging on every save is what
 * let a one-field edit wipe the other two.
 *
 * Returns FAILURE.NONE or the reason, so the screen can say the change was not
 * kept rather than showing a saved state for a write that did not land.
 */
export const setOnboardingPreference = (field, value) => {
  if (!['domain', 'style', 'time'].includes(field)) return FAILURE.FAILED;
  // undefined means "not specified", and must leave the stored value alone. It
  // is a different instruction from null, and writing it would store a key with
  // no value, which JSON.stringify then drops - so the field would silently
  // clear instead of staying put.
  if (value === undefined) return FAILURE.NONE;
  if (value !== null) {
    if (field === 'style' && !STYLE_LABELS[value]) return FAILURE.FAILED;
    if (field === 'time' && !TIME_OPTIONS.includes(value)) return FAILURE.FAILED;
    if (field === 'domain' && (typeof value !== 'string' || value === '')) return FAILURE.FAILED;
  }

  const current = getOnboardingPreferences();
  const next = { ...current };
  // Clearing is explicit. An absent field stays exactly as it was.
  if (value === null) delete next[field];
  else next[field] = value;

  return writeValue(ONBOARDING_PREFERENCES_KEY, next);
};

