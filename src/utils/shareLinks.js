/**
 * VELORA utility module
 * shareLinks
 *
 * Clean, shareable deep links for a lesson or a dictionary entry, plus the
 * parser that turns a link back into a destination when the app loads.
 *
 * VELORA is a client-side SPA with no server routing, so a share link carries
 * its target in the URL hash rather than in a path the server would resolve.
 * The format is `#/lesson/{subject}/{topicId}` and `#/term/{termId}`. A hash is
 * used (not a path) because the app is served as one static file from a subpath
 * and a server cannot rewrite paths it does not own.
 *
 * A shared link cannot bypass the first-run setup: the app is account-free and
 * on-device, so a new visitor still names this device before anything opens. A
 * visitor who has already set up VELORA is taken straight to the linked content.
 */

/** Build a shareable absolute URL for a lesson. */
export const buildLessonShareUrl = (subject, topicId) =>
  shareOrigin() + `#/lesson/${encodeURIComponent(subject)}/${encodeURIComponent(topicId)}`;

/** Build a shareable absolute URL for a dictionary entry. */
export const buildTermShareUrl = (termId) =>
  shareOrigin() + `#/term/${encodeURIComponent(termId)}`;

/**
 * The origin a link is built from.
 *
 * location.origin alone is wrong when the app is hosted under a subpath (for
 * example GitHub Pages at /Velora), because it drops the base and the link
 * would resolve to the host root. The pathname is the deployed base, trimmed of
 * any trailing file, and the hash is not part of the base.
 */
function shareOrigin() {
  if (typeof window === 'undefined') return '';
  const { origin, pathname } = window.location;
  // Strip a trailing index.html if present; keep the directory base.
  const base = pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
  return `${origin}${base}`;
}

/**
 * Parse a URL hash into a destination, or null if it names nothing shareable.
 *
 * Recognised forms:
 *   #/lesson/physics/black-holes  -> { kind: 'lesson', subject, topicId }
 *   #/term/event-horizon          -> { kind: 'term', termId }
 * Anything else is treated as "no share link" and the app opens normally.
 */
export const parseShareHash = (hash) => {
  if (typeof hash !== 'string') return null;
  const clean = hash.replace(/^#\/?/, '');
  if (clean === '') return null;

  const parts = clean.split('/').map(decodeURIComponent);

  if (parts[0] === 'lesson' && parts[1] && parts[2]) {
    return { kind: 'lesson', subject: parts[1], topicId: parts[2] };
  }
  if (parts[0] === 'term' && parts[1]) {
    return { kind: 'term', termId: parts[1] };
  }
  return null;
};

/** Read and parse the current URL hash. Returns a destination or null. */
export const currentShareDestination = () =>
  typeof window === 'undefined' ? null : parseShareHash(window.location.hash);

const shareLinks = {
  buildLessonShareUrl,
  buildTermShareUrl,
  parseShareHash,
  currentShareDestination,
};

export default shareLinks;
