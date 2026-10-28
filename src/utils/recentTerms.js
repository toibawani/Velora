/**
 * VELORA utility module
 * recentTerms
 *
 * The dictionary entries opened most recently on this device.
 *
 * The console kept nothing between visits. Someone reading three entries that
 * cross-reference each other, who then followed a fourth and wanted the second
 * one back, had to remember its name and search for it. This is the smallest
 * thing that fixes that: a list of ids, newest first.
 *
 * Ids rather than copies of the entries. The entry is the source of truth and
 * lives in the data module; storing a title here would mean a renamed term
 * showing its old name in this strip, and a deleted one showing at all.
 */
import { KEYS, readValue, writeValue, removeValue } from './storage';

/** How many entries the strip can hold. Six is one glance, not a scroll. */
export const MAX_RECENT_TERMS = 6;

const isIdList = (value) =>
  Array.isArray(value) && value.every((id) => typeof id === 'string' && id !== '');

/** Recent entry ids, newest first. Anything malformed is dropped. */
export function getRecentTermIds() {
  const stored = readValue(KEYS.RECENT_TERMS, []);
  if (!isIdList(stored)) return [];
  // Duplicates would come from an older build or a hand-edited value, and they
  // would render the same chip twice.
  return stored.slice(0, MAX_RECENT_TERMS).filter((id, index) => stored.indexOf(id) === index);
}

/**
 * Puts an id at the front of the list.
 *
 * Re-opening an entry moves it to the front rather than adding a second copy,
 * which is what makes the strip an order of use rather than a log. Returns the
 * new list so a caller can render it without reading storage again.
 */
export function rememberTerm(termId) {
  if (typeof termId !== 'string' || termId.trim() === '') return getRecentTermIds();

  const next = [termId, ...getRecentTermIds().filter((id) => id !== termId)].slice(
    0,
    MAX_RECENT_TERMS,
  );
  writeValue(KEYS.RECENT_TERMS, next);
  return next;
}

/** Forgets the whole strip. Not exposed in the UI yet; used by tests and resets. */
export const forgetRecentTerms = () => removeValue(KEYS.RECENT_TERMS);

/**
 * The stored ids resolved against the entries that exist now.
 *
 * An id that no longer names an entry - a term renamed, merged or removed since
 * the visit - is skipped. The alternative is a chip that opens nothing.
 */
export function resolveRecentTerms(terms) {
  if (!Array.isArray(terms)) return [];
  const byId = new Map(terms.map((term) => [term.id, term]));
  return getRecentTermIds()
    .map((id) => byId.get(id))
    .filter(Boolean);
}

export default getRecentTermIds;
