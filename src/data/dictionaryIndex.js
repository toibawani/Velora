/**
 * Single place the app imports dictionary terms from.
 *
 * The entries live in four files purely so each one stays readable. Anything
 * that consumes the dictionary should import CURIOUS_TERMS from here rather
 * than from the individual files, so the merge happens exactly once.
 */

import { CURIOUS_TERMS as ORIGINAL_TERMS, DICTIONARY_SUBJECTS } from './curiousDictionaryData';
import { PHYSICS_TERMS, CHEMISTRY_TERMS, CHEMISTRY_TERMS_MORE, BIOLOGY_TERMS } from './dictTermsNatural';
import { PHILOSOPHY_TERMS, POLITICAL_TERMS, HISTORY_TERMS } from './dictTermsHumanities';
import { MATH_TERMS, PSYCHOLOGY_TERMS, ECONOMICS_TERMS } from './dictTermsSocial';

export { DICTIONARY_SUBJECTS };

const ALL_GROUPS = [
  ORIGINAL_TERMS,
  PHYSICS_TERMS,
  CHEMISTRY_TERMS,
  CHEMISTRY_TERMS_MORE,
  BIOLOGY_TERMS,
  PHILOSOPHY_TERMS,
  POLITICAL_TERMS,
  HISTORY_TERMS,
  MATH_TERMS,
  PSYCHOLOGY_TERMS,
  ECONOMICS_TERMS,
];

/**
 * Duplicate ids would make React keys collide and would mean two entries
 * fighting over one anchor, so the first one wins and the rest are dropped
 * rather than shipping a list that lies about its own size.
 */
const dedupeById = (groups) => {
  const seen = new Set();
  const merged = [];
  groups.forEach((group) => {
    group.forEach((term) => {
      if (term && term.id && !seen.has(term.id)) {
        seen.add(term.id);
        merged.push(term);
      }
    });
  });
  return merged;
};

export const CURIOUS_TERMS = dedupeById(ALL_GROUPS);

export default CURIOUS_TERMS;
