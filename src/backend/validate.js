/**
 * Input rules, checked in the page before a request is made.
 *
 * These are not a security control. Anyone can call the API with any body they
 * like; the database's own constraints and Row Level Security are what decides
 * whether a row is written. These exist so an obvious mistake becomes a sentence
 * beside the field instead of a round trip and a generic failure, and so the two
 * sides agree on what "too long" means.
 */

export const EMAIL_MAX = 254;
export const NAME_MIN = 2;
export const NAME_MAX = 30;
export const EXPLANATION_MIN = 20;
export const EXPLANATION_MAX = 600;
export const REASON_MIN = 3;
export const REASON_MAX = 300;

export const validateEmail = (value) =>
  typeof value === 'string' &&
  value.length <= EMAIL_MAX &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const validateDisplayName = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return trimmed.length >= NAME_MIN && trimmed.length <= NAME_MAX;
};

export const validateExplanation = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return trimmed.length >= EXPLANATION_MIN && trimmed.length <= EXPLANATION_MAX;
};

/**
 * A topic id is `subject:topic`, both slugs, or a bare slug for the older
 * single-part ids. The colon is allowed on purpose: `motion` exists in more than
 * one subject, and a shared explanation keyed only by `motion` would show a
 * physics answer under a philosophy topic.
 */
export const validateTopicId = (value) =>
  typeof value === 'string' && /^[a-z0-9][a-z0-9-_:.]{0,119}$/i.test(value);

export const validateReason = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return trimmed.length >= REASON_MIN && trimmed.length <= REASON_MAX;
};
