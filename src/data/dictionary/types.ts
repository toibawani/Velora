/**
 * The shape of one Curious Dictionary entry, and of the subject list the
 * console filters by.
 *
 * The data itself is split one file per subject under src/data/dictionary and
 * merged by index.ts. Everything here exists because at some point a field was
 * spelled differently in two files, or a letter was left lowercase, and nothing
 * noticed until it was on screen.
 */

/** The nine subjects the dictionary files itself under. */
export type DictionarySubjectId =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'philosophy'
  | 'history'
  | 'political-science'
  | 'mathematics'
  | 'psychology'
  | 'economics';

/**
 * A–Z, uppercase only. A union rather than `string` so a lowercase letter, a
 * stray space, or a missing letter in a data file is a compile error instead of
 * a letter pill whose count silently reads zero.
 */
export type DictionaryLetter =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export interface DictionarySubject {
  /**
   * 'all' is the console's "show me everything" filter. It lives in the same
   * list because the rail renders straight off it, but it is not a subject.
   */
  id: DictionarySubjectId | 'all';
  name: string;
}

export interface DictionaryTerm {
  /** Used as the React key and as the in-page anchor. Unique across subjects. */
  id: string;
  term: string;
  subject: DictionarySubjectId;
  /**
   * The letter this entry is filed under, which is not always the first
   * character of the term - "The Enlightenment" belongs under E. There is a
   * test that checks this against the term itself, ignoring a leading "The".
   */
  letter: DictionaryLetter;
  /** One line, in plain language. What the entry is about, not what it means. */
  tagline: string;
  explanation: string;
  example: string;
  /** The work, cited by title and year. */
  source: string;
  /** A real, absolute, https URL someone has opened. */
  sourceUrl: string;
  /**
   * Editorial flag, set on the handful of entries that have actually been read
   * back against the source. Absent means nobody has, which is the honest
   * default for the rest. Setting it to false is how an entry says "known
   * problem, check me before quoting me"; the console renders a caution for
   * those.
   */
  verified?: boolean;
}
