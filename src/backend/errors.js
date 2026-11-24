/**
 * The one error shape the UI is allowed to show.
 *
 * Supabase and PostgREST report failures in several different languages: an
 * HTTP status, a Postgres SQLSTATE, a PostgREST code such as PGRST301 and a
 * free-text message. None of that belongs on a screen. Every failure is mapped
 * once, here, to a short sentence and a stable code the calling component can
 * branch on, so the same network failure never reads as two different things in
 * two places.
 */
export class BackendError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'BackendError';
    this.code = code;
  }
}

/**
 * Turn a Supabase error (or a thrown fetch error) into a BackendError.
 *
 * The order matters. A rate limit arrives as an HTTP 429 with a message that
 * may also mention a token, and a duplicate row arrives as 23505 that may also
 * carry a generic message; checking the specific codes first keeps the sentence
 * accurate to what actually happened.
 */
export function mapError(error) {
  if (!error) return null;
  const message = String(error.message || '').toLowerCase();
  const status = Number(error.status || 0);

  if (error.code === 'rate_limited' || message.includes('rate limit') || status === 429) {
    return new BackendError(
      'rate_limited',
      'You have posted a lot in the last hour. Try again later.',
    );
  }
  if (error.code === '23505') {
    return new BackendError('duplicate', 'That is already saved.');
  }
  if (error.code === '23514') {
    return new BackendError(
      'invalid',
      'That text is the wrong length. Check it and try again.',
    );
  }
  if (error.code === '42501') {
    return new BackendError('forbidden', 'You are not allowed to do that.');
  }
  if (
    message.includes('jwt') ||
    error.code === 'PGRST301' ||
    status === 401 ||
    message.includes('session')
  ) {
    return new BackendError('session', 'Your session ended. Sign in again.');
  }
  if (
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('load failed') ||
    (typeof navigator !== 'undefined' && navigator.onLine === false)
  ) {
    return new BackendError(
      'offline',
      'You look offline. Everything is still saved on this device.',
    );
  }
  return new BackendError(
    'unknown',
    'Something went wrong on our side. Try again in a moment.',
  );
}
