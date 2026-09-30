import {
  CURIOUS_TERMS,
  DICTIONARY_SUBJECTS,
  countTermsByLetter,
  countTermsBySubject,
  matchesQuery,
  selectTerms,
} from './index';
import type { DictionaryTerm } from './types';
import { PHYSICS_TERMS } from './physics';
import { CHEMISTRY_TERMS } from './chemistry';
import { BIOLOGY_TERMS } from './biology';
import { PHILOSOPHY_TERMS } from './philosophy';
import { HISTORY_TERMS } from './history';
import { POLITICAL_TERMS } from './political-science';
import { MATH_TERMS } from './mathematics';
import { PSYCHOLOGY_TERMS } from './psychology';
import { ECONOMICS_TERMS } from './economics';

const EVERY_TERM: DictionaryTerm[] = [
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

describe('Curious Dictionary data', () => {
  test('has no duplicate ids', () => {
    const ids = CURIOUS_TERMS.map((t) => t.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  // Merging nine files into one list is where entries go missing. dedupeById is
  // allowed to drop a repeated id, so if this ever fails the merge has quietly
  // swallowed something someone wrote.
  test('the merge drops nothing that is not a duplicate', () => {
    expect(CURIOUS_TERMS.length).toBe(new Set(EVERY_TERM.map((t) => t.id)).size);
    expect(CURIOUS_TERMS.length).toBe(EVERY_TERM.length);
  });

  test('every entry is complete and readable', () => {
    CURIOUS_TERMS.forEach((term) => {
      [term.term, term.tagline, term.explanation, term.example, term.source].forEach(
        (field) => expect(typeof field).toBe('string')
      );
      expect(term.explanation.length).toBeGreaterThan(40);
      expect(term.example.length).toBeGreaterThan(20);
    });
  });

  // The subject and letter fields are checked by the compiler as well, but
  // jest strips types without checking them, so this keeps the guarantee true
  // for anyone who runs the test suite on its own.
  test('every entry is filed under a subject that exists', () => {
    const valid = DICTIONARY_SUBJECTS.map((s) => s.id);
    CURIOUS_TERMS.forEach((term) => expect(valid).toContain(term.subject));
  });

  // A letter that does not match the term silently sends people to the wrong
  // place when they use the A-Z bar, so it is worth failing on. A leading
  // "The" is ignored, because dictionaries file "The Enlightenment" under E.
  test('the A-Z letter matches the first significant letter of the term', () => {
    const firstRealLetter = (t: DictionaryTerm) =>
      t.term.replace(/^The\s+/i, '')[0].toUpperCase();
    const wrong = CURIOUS_TERMS.filter((t) => t.letter !== firstRealLetter(t));
    expect(wrong.map((t) => `${t.id}: ${t.letter} vs ${t.term}`)).toEqual([]);
  });

  test('every source has a link, not just a book title', () => {
    const missing = CURIOUS_TERMS.filter((t) => !t.sourceUrl).map((t) => t.id);
    expect(missing).toEqual([]);
  });

  // A dead or fake link is worse than none: it looks checked and is not.
  test('source links are real absolute URLs', () => {
    const bad = CURIOUS_TERMS.filter(
      (t) => !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\//i.test(t.sourceUrl)
    ).map((t) => t.id);
    expect(bad).toEqual([]);
  });

  test('every subject has enough terms to be worth opening', () => {
    DICTIONARY_SUBJECTS.filter((s) => s.id !== 'all').forEach((s) => {
      const count = CURIOUS_TERMS.filter((t) => t.subject === s.id).length;
      expect({ subject: s.id, count }).toEqual({ subject: s.id, count: expect.any(Number) });
      expect(count).toBeGreaterThanOrEqual(10);
    });
  });
});

describe('Curious Dictionary source links', () => {
  // Britannica sits behind a bot challenge that answers 403 to anything that is
  // not a real browser session, which means a broken link there is
  // indistinguishable from a working one and cannot be verified. A link that
  // cannot be checked is a link that should not ship, so these hosts are
  // blocked rather than merely discouraged.
  const UNVERIFIABLE_HOSTS = ['britannica.com', 'newspapers.com', 'jstor.org'];

  test('no source points at a host that cannot be checked', () => {
    const blocked = CURIOUS_TERMS.filter((t) =>
      UNVERIFIABLE_HOSTS.some((host) => t.sourceUrl.includes(host))
    ).map((t) => `${t.id}: ${t.sourceUrl}`);
    expect(blocked).toEqual([]);
  });
});

describe('search', () => {
  test('an empty or whitespace query matches everything', () => {
    expect(matchesQuery(CURIOUS_TERMS[0], '')).toBe(true);
    expect(matchesQuery(CURIOUS_TERMS[0], '   ')).toBe(true);
    expect(selectTerms().length).toBe(CURIOUS_TERMS.length);
  });

  test('matches are case-insensitive and ignore surrounding spaces', () => {
    const hits = selectTerms({ query: '  MOMENTUM ' });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((t) => matchesQuery(t, 'momentum'))).toBe(true);
  });

  // People search for what a thing is about, not only for its name. 'shadows'
  // is in the explanation of Plato's Cave and nowhere in its title, so it
  // proves the search reaches the body text rather than only the headings.
  test('searches the explanation, not just the term', () => {
    const hits = selectTerms({ query: 'shadows' });
    expect(hits.some((t) => !/shadows/i.test(t.term))).toBe(true);
  });

  test('a query nothing contains returns nothing rather than everything', () => {
    expect(selectTerms({ query: 'zzzqqq-no-such-concept' })).toEqual([]);
  });

  test('results come back alphabetical regardless of how the data is filed', () => {
    const terms = selectTerms();
    const sorted = [...terms].map((t) => t.term).sort((a, b) => a.localeCompare(b));
    expect(terms.map((t) => t.term)).toEqual(sorted);
  });
});

describe('A to Z navigation', () => {
  test('a letter filter returns only entries filed under that letter', () => {
    const hits = selectTerms({ letter: 'E' });
    expect(hits.length).toBeGreaterThan(0);
    hits.forEach((t) => expect(t.letter).toBe('E'));
  });

  test('the counts the bar shows match what clicking that letter produces', () => {
    const present = new Set(CURIOUS_TERMS.map((t) => t.letter));
    present.forEach((letter) => {
      expect(countTermsByLetter(letter)).toBe(selectTerms({ letter }).length);
    });
  });

  test('letter counts respect the subject selected in the rail', () => {
    const physicsLetters = new Set(PHYSICS_TERMS.map((t) => t.letter));
    physicsLetters.forEach((letter) => {
      expect(countTermsByLetter(letter, 'physics')).toBe(
        selectTerms({ letter, subject: 'physics' }).length
      );
    });
    // Narrowing to one subject must never report more than the whole shows,
    // or the bar would offer letters that come back empty.
    physicsLetters.forEach((letter) => {
      expect(countTermsByLetter(letter, 'physics')).toBeLessThanOrEqual(
        countTermsByLetter(letter)
      );
    });
  });

  test('a letter with nothing behind it counts zero, so the bar can grey it out', () => {
    expect(countTermsByLetter('Q', 'economics')).toBe(0);
    expect(selectTerms({ letter: 'Q', subject: 'economics' })).toEqual([]);
  });

  test('subject counts match the list the rail links to', () => {
    DICTIONARY_SUBJECTS.forEach((subject) => {
      expect(countTermsBySubject(subject.id)).toBe(selectTerms({ subject: subject.id }).length);
    });
    expect(countTermsBySubject('all')).toBe(CURIOUS_TERMS.length);
  });

  // Search, subject and letter are meant to stack rather than replace each
  // other, otherwise picking a letter throws away what someone typed.
  test('the three filters compose', () => {
    const combined = selectTerms({ query: 'energy', subject: 'physics', letter: 'C' });
    combined.forEach((t) => {
      expect(t.subject).toBe('physics');
      expect(t.letter).toBe('C');
      expect(matchesQuery(t, 'energy')).toBe(true);
    });
    const superset = selectTerms({ query: 'energy', subject: 'physics' });
    expect(combined.length).toBeLessThanOrEqual(superset.length);
  });
});
