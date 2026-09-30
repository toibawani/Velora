import type {
  DictionaryLetter,
  DictionarySubjectId,
  DictionaryTerm,
} from './types';
import { DICTIONARY_SUBJECTS } from './subjects';
import { PHYSICS_TERMS } from './physics';
import { CHEMISTRY_TERMS } from './chemistry';
import { BIOLOGY_TERMS } from './biology';
import { PHILOSOPHY_TERMS } from './philosophy';
import { HISTORY_TERMS } from './history';
import { POLITICAL_TERMS } from './political-science';
import { MATH_TERMS } from './mathematics';
import { PSYCHOLOGY_TERMS } from './psychology';
import { ECONOMICS_TERMS } from './economics';

export type { DictionaryLetter, DictionarySubject, DictionarySubjectId, DictionaryTerm } from './types';
export { DICTIONARY_SUBJECTS };

/**
 * Everything the dictionary holds, in one list.
 *
 * This is the only module the app should import dictionary data from. The
 * per-subject files exist so adding a term means opening a short file, and the
 * grouping is a source-organisation detail that nothing outside here should
 * depend on.
 */
const ALL_TERMS: DictionaryTerm[] = [
  ...PHYSICS_TERMS,
  ...CHEMISTRY_TERMS,
  ...BIOLOGY_TERMS,
  ...PHILOSOPHY_TERMS,
  ...HISTORY_TERMS,
  ...POLITICAL_TERMS,
  ...MATH_TERMS,
  ...PSYCHOLOGY_TERMS,
  ...ECONOMICS_TERMS,
];

/**
 * A duplicate id would give two entries the same React key and the same anchor,
 * so the console would render both and jumping to either would land on the
 * first. The first one wins and the rest are dropped: a list that quietly
 * understates its own size is better than one that renders two cards for one
 * concept.
 */
function dedupeById(terms: DictionaryTerm[]): DictionaryTerm[] {
  const seen = new Set<string>();
  const merged: DictionaryTerm[] = [];
  terms.forEach((term) => {
    if (term && term.id && !seen.has(term.id)) {
      seen.add(term.id);
      merged.push(term);
    }
  });
  return merged;
}

export const CURIOUS_TERMS: DictionaryTerm[] = dedupeById(ALL_TERMS);

/** The filter value the console uses for "every subject". */
export type SubjectFilter = DictionarySubjectId | 'all';

/**
 * What a term has to contain for the search box to show it. The term, the
 * tagline, the explanation, the example, or the subject name - so searching
 * "physics" finds every physics entry rather than nothing.
 */
export function matchesQuery(term: DictionaryTerm, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [term.term, term.tagline, term.explanation, term.example, term.subject].some(
    (field) => field.toLowerCase().includes(needle)
  );
}

export interface TermFilter {
  query?: string;
  subject?: SubjectFilter;
  letter?: DictionaryLetter | 'ALL';
}

/**
 * The list the console renders. Always alphabetical: the entries are not in any
 * meaningful order in the source files, and people scanning A–Z expect that
 * order to be the one thing they do not have to think about.
 */
export function selectTerms({
  query = '',
  subject = 'all',
  letter = 'ALL',
}: TermFilter = {}): DictionaryTerm[] {
  return CURIOUS_TERMS.filter(
    (term) =>
      matchesQuery(term, query) &&
      (subject === 'all' || term.subject === subject) &&
      (letter === 'ALL' || term.letter === letter)
  ).sort((a, b) => a.term.localeCompare(b.term));
}

/** How many entries a subject holds, for the rail's counts. */
export function countTermsBySubject(subject: SubjectFilter): number {
  if (subject === 'all') return CURIOUS_TERMS.length;
  return CURIOUS_TERMS.filter((term) => term.subject === subject).length;
}

/**
 * How many entries sit under a letter, optionally within one subject. The A–Z
 * bar greys out letters with nothing behind them, so it needs a real number
 * rather than an empty list to discover after the click.
 */
export function countTermsByLetter(
  letter: DictionaryLetter,
  subject: SubjectFilter = 'all'
): number {
  return CURIOUS_TERMS.filter(
    (term) => term.letter === letter && (subject === 'all' || term.subject === subject)
  ).length;
}

export default CURIOUS_TERMS;
