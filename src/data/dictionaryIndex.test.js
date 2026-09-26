import { CURIOUS_TERMS, DICTIONARY_SUBJECTS } from './dictionaryIndex';
import { CURIOUS_TERMS as ORIGINAL } from './curiousDictionaryData';

describe('Curious Dictionary data', () => {
  test('has no duplicate ids', () => {
    const ids = CURIOUS_TERMS.map((t) => t.id);
    expect(ids.length).toBe(new Set(ids).size);
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

  test('every entry is filed under a subject that exists', () => {
    const valid = DICTIONARY_SUBJECTS.map((s) => s.id);
    CURIOUS_TERMS.forEach((term) => expect(valid).toContain(term.subject));
  });

  // A letter that does not match the term silently sends people to the wrong
  // place when they use the A-Z bar, so it is worth failing on. A leading
  // "The" is ignored, because dictionaries file "The Enlightenment" under E.
  test('the A-Z letter matches the first significant letter of the term', () => {
    const firstRealLetter = (t) => t.term.replace(/^The\s+/i, '')[0].toUpperCase();
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

  test('the original entries are all still present', () => {
    ORIGINAL.forEach((t) => expect(CURIOUS_TERMS.some((c) => c.id === t.id)).toBe(true));
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
  // Britannica sits behind a bot challenge that answers 403 to anything that
  // is not a real browser session, which means a broken link there is
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
