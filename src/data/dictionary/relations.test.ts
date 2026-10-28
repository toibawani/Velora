import { distinctiveWords, relationScore, relatedTerms } from './relations';
import { CURIOUS_TERMS } from './index';
import type { DictionaryTerm } from './types';

const make = (over: Partial<DictionaryTerm>): DictionaryTerm =>
  ({
    id: 'x',
    term: 'Term',
    subject: 'physics',
    letter: 'T',
    tagline: '',
    explanation: '',
    example: '',
    source: '',
    sourceUrl: '',
    ...over,
  } as DictionaryTerm);

describe('distinctiveWords', () => {
  test('keeps words long enough to mean something', () => {
    const words = distinctiveWords('Energy is the capacity to do work');
    expect(words.has('energy')).toBe(true);
    expect(words.has('capacity')).toBe(true);
    // Too short to carry an idea on its own.
    expect(words.has('the')).toBe(false);
    expect(words.has('work')).toBe(false);
  });

  test('drops the words every entry has', () => {
    const words = distinctiveWords('which because their through about');
    expect(words.size).toBe(0);
  });

  test('counts a repeated word once', () => {
    expect(distinctiveWords('entropy entropy entropy').size).toBe(1);
  });

  test('survives missing text', () => {
    expect(distinctiveWords(undefined as unknown as string).size).toBe(0);
  });
});

describe('relationScore', () => {
  test('an entry is not related to itself', () => {
    const term = make({ term: 'Entropy' });
    expect(relationScore(term, term)).toBe(0);
  });

  test('a shared term weighs more than a shared sentence', () => {
    const base = make({ id: 'a', term: 'Angular Momentum' });
    const sharesTerm = make({ id: 'b', term: 'Conservation of Angular Momentum' });
    const sharesProse = make({
      id: 'c',
      term: 'Torque',
      explanation: 'Angular momentum changes when a torque acts.',
    });

    expect(relationScore(base, sharesTerm)).toBeGreaterThan(relationScore(base, sharesProse));
  });

  test('one shared word in the prose is not a connection', () => {
    const a = make({ id: 'a', term: 'Supply and Demand', explanation: 'Price settles where they meet.' });
    const b = make({ id: 'b', term: 'Function', subject: 'mathematics', explanation: 'A rule that maps one price to one value.' });

    // "price" is the only overlap, which paired two unrelated entries before
    // the shared-word bar was raised.
    expect(relationScore(a, b)).toBe(0);
  });

  test('nothing in common scores nothing', () => {
    const a = make({ id: 'a', term: 'Entropy', explanation: 'Heat death of the universe.' });
    const b = make({ id: 'b', term: 'Republic', subject: 'political-science', explanation: 'Rule by elected representatives.' });
    expect(relationScore(a, b)).toBe(0);
  });
});

describe('relatedTerms', () => {
  const all = [
    make({ id: 'a', term: 'Angular Momentum', explanation: 'Angular momentum is conserved.' }),
    make({ id: 'b', term: 'Torque', explanation: 'Torque changes angular momentum.' }),
    make({ id: 'c', term: 'Republic', subject: 'political-science', explanation: 'Rule by representatives.' }),
    make({ id: 'd', term: 'Entropy', explanation: 'Disorder increases.' }),
  ];

  test('offers a connection and leaves out the entry with none', () => {
    const ids = relatedTerms(all[0], all).map((term) => term.id);
    expect(ids).toContain('b');
    expect(ids).not.toContain('c');
    expect(ids).not.toContain('d');
  });

  test('never offers the entry itself', () => {
    const ids = relatedTerms(all[0], all).map((term) => term.id);
    expect(ids).not.toContain('a');
  });

  test('respects the limit', () => {
    expect(relatedTerms(all[0], all, 1)).toHaveLength(1);
  });

  test('is stable: the same input gives the same order', () => {
    const once = relatedTerms(all[0], all).map((term) => term.term);
    const twice = relatedTerms(all[0], [...all].reverse()).map((term) => term.term);
    expect(twice).toEqual(once);
  });

  test('finds something for most real entries, and never invents one', () => {
    // A heuristic that returns nothing for every entry would be invisible; one
    // that returns something for every entry would be noise. This pins both
    // ends against the real dictionary.
    // Most entries should offer something, since a row that is empty on almost
    // every entry is not a feature. It does not have to be all of them: an
    // entry genuinely about something no other entry mentions has no honest
    // neighbour, and padding the row would be worse than leaving it out.
    const withRelations = CURIOUS_TERMS.filter((term) => relatedTerms(term, CURIOUS_TERMS).length > 0);
    expect(withRelations.length).toBeGreaterThanOrEqual(Math.floor(CURIOUS_TERMS.length * 0.8));

    relatedTerms(CURIOUS_TERMS[0], CURIOUS_TERMS).forEach((suggestion) => {
      expect(suggestion.id).not.toBe(CURIOUS_TERMS[0].id);
      expect(relationScore(CURIOUS_TERMS[0], suggestion)).toBeGreaterThan(0);
    });
  });
});
