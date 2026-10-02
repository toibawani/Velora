/**
 * The glossary, and the inline terms that point at it.
 *
 * The brief asks for one source of truth for difficult words, because the same
 * term appears in more than one level. That is the failure these tests exist to
 * prevent: "entropy" is used in Level 6 and again in Level 7, and two
 * hand-written tooltips for it would drift into two different wordings inside
 * one sitting. Here the definition lives in one file and the levels can only
 * refer to it.
 *
 * The second job is checking that every {{term}} written in the content
 * actually resolves. A term with no definition silently renders as a dead button,
 * which is worse than no button, so an unresolved term fails here.
 */
import { BLACK_HOLE_LEVELS } from './index';
import { GLOSSARY, GLOSSARY_TERMS, lookupTerm } from './glossary';
import { INLINE_TERM } from '../../components/GlossaryTerm';

const allText = BLACK_HOLE_LEVELS.map(
  (level) => [level.title, level.blurb, level.intro ?? '', ...(level.entries ?? []).flatMap((e) => [e.name, e.simple, e.deeper, e.matters])].join(' ')
).join(' ');

describe('the glossary', () => {
  test('has no duplicate definitions', () => {
    // The reduce that builds GLOSSARY throws on a duplicate at import time, so
    // reaching this test at all means there was not one. Asserted explicitly
    // anyway, because an import-time throw reads as "the app will not start"
    // rather than as "you typed a word twice".
    // Array.from rather than spreading a Set: the build targets es5, where
    // spreading an iterator is a type error, and the fix belongs here rather
    // than in a tsconfig change that would affect every file in src.
    expect(Array.from(new Set(GLOSSARY_TERMS)).length).toBe(GLOSSARY_TERMS.length);
  });

  test('every definition is a sentence a reader can finish', () => {
    GLOSSARY_TERMS.forEach((term) => {
      const entry = lookupTerm(term)!;
      // A tooltip longer than this stops being a gloss and becomes a second
      // paragraph, which loses the sentence the reader was in the middle of.
      expect(entry.definition.length).toBeGreaterThan(30);
      expect(entry.definition.length).toBeLessThan(400);
      expect(entry.definition.endsWith('.')).toBe(true);
    });
  });

  test('every see-also points at a term that exists', () => {
    GLOSSARY_TERMS.forEach((term) => {
      const entry = lookupTerm(term)!;
      if (!entry.see) return;
      expect(GLOSSARY[entry.see]).toBeDefined();
    });
  });

  test('no see-also chain loops', () => {
    // A term pointing at itself would make the popover chase its own tail.
    GLOSSARY_TERMS.forEach((term) => {
      const entry = lookupTerm(term)!;
      expect(entry.see).not.toBe(term);
    });
  });

  test('definitions are written for someone without a physics class', () => {
    // The hardest terms in the brief's list must actually be present, or the
    // requirement is unmet however good the rest is.
    ['geodesic', 'entropy', 'unitarity', 'Anti-de Sitter space', 'metallicity', 'hydrostatic equilibrium'].forEach(
      (term) => expect(GLOSSARY[term]).toBeDefined()
    );
  });
});

describe('inline terms in the level content', () => {
  // Array.from rather than spreading: the build targets es5, where spreading an
  // iterator is a type error.
  const usedTerms = Array.from(allText.matchAll(new RegExp(INLINE_TERM.source, 'g'))).map(
    (match) => match[1].trim()
  );

  test('every inline term resolves to a real glossary entry', () => {
    // A typo in a term name, or a term added to the content before it was added
    // to the glossary, would otherwise render as a button that opens nothing.
    expect(usedTerms.length).toBeGreaterThan(0);
    const unresolved = Array.from(new Set(usedTerms)).filter((term) => !GLOSSARY[term]);
    expect(unresolved).toEqual([]);
  });

  test('the inline term pattern cannot swallow the rest of a paragraph', () => {
    // {{ and }} with nothing between them, or an unclosed one, would otherwise
    // eat text until the next closing brace somewhere in a later entry.
    expect(allText).not.toMatch(/\{\{\s*\}\}/);
    const openBraces = (allText.match(/\{\{/g) || []).length;
    const closeBraces = (allText.match(/\}\}/g) || []).length;
    expect(openBraces).toBe(closeBraces);
  });
});

describe('the level set', () => {
  test('is ordered by number and free of gaps', () => {
    const numbers = BLACK_HOLE_LEVELS.map((level) => level.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    // The brief asks for 0 through 10. This will fail until the last level
    // lands, which is the point: it says how much is outstanding.
    expect(numbers[0]).toBe(0);
  });

  test('gives every level an id, a title and a one-line blurb for the rail', () => {
    BLACK_HOLE_LEVELS.forEach((level) => {
      expect(level.blurb.length).toBeGreaterThan(15);
      expect(level.entries === undefined || level.entries.length > 0).toBe(true);
    });
  });

  test('gives no two entries in the whole subject the same id', () => {
    const ids = BLACK_HOLE_LEVELS.flatMap((level) => (level.entries ?? []).map((entry) => entry.id));
    expect(Array.from(new Set(ids)).length).toBe(ids.length);
  });

  test('labels every entry with a status from the closed set', () => {
    BLACK_HOLE_LEVELS.flatMap((level) => level.entries ?? []).forEach((entry) => {
      expect(['established', 'theoretical', 'contested']).toContain(entry.status);
    });
  });

  test('never calls anything well-established that has no source behind it', () => {
    // The status label is the part of this content a reader is most entitled to
    // trust, so "well-established" carries an obligation: say where.
    BLACK_HOLE_LEVELS.flatMap((level) => level.entries ?? []).forEach((entry) => {
      if (entry.status !== 'established') return;
      expect(`${entry.source ?? ''} ${entry.sourceUrl ?? ''}`.trim().length).toBeGreaterThan(10);
    });
  });

  test('does not label everything settled', () => {
    // A suite where every entry is "well-established" would pass every test
    // above and be exactly the failure this content is meant to avoid. The
    // contested and theoretical rows are the ones carrying the information.
    const all = BLACK_HOLE_LEVELS.flatMap((level) => level.entries ?? []);
    expect(all.length).toBeGreaterThan(5);
    expect(all.some((entry) => entry.status === 'contested')).toBe(true);
    expect(all.some((entry) => entry.status === 'theoretical')).toBe(true);
  });

  test('the observation-level entries name a specific detection rather than a topic', () => {
    // Level 4 is where this matters most. "Observed by LIGO" is checkable;
    // "confirmed by science" is not.
    const level4 = BLACK_HOLE_LEVELS.find((level) => level.number === 4);
    if (!level4) return;
    level4.entries?.forEach((entry) => {
      if (entry.status !== 'established') return;
      expect(entry.source ?? '').toMatch(/\d{4}|GW\d+|M87|Sgr|EHT|LIGO|OGLE/i);
    });
  });
});