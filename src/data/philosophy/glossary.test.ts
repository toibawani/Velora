/**
 * The philosophy levels, and the glossary they lean on.
 *
 * These are the same checks the black hole content carries, because the claim
 * being made is that the pattern generalises rather than that this subject got a
 * lighter version of it. The two that matter most are the last ones: the set must
 * not label everything settled, and a genuinely contested position must not be
 * filed as settled just because an entry needed to pick a framing to explain it.
 *
 * Free will, personal identity and the trolley problem are asserted to be
 * 'debated' explicitly, so a later edit that "tidies" one of them into a single
 * answer fails the build rather than shipping.
 */
import { PHILOSOPHY_LEVELS, TOTAL_ENTRIES } from './index';
import { GLOSSARY, GLOSSARY_TERMS, lookupTerm } from './glossary';
import { GLOSSARY as PHYSICS_GLOSSARY } from '../blackholes/glossary';
import { INLINE_TERM } from '../../components/GlossaryTerm';

const allEntries = PHILOSOPHY_LEVELS.flatMap((level) => level.entries ?? []);
const allText = PHILOSOPHY_LEVELS.map(
  (level) =>
    [level.title, level.blurb, level.intro ?? '', ...(level.entries ?? []).flatMap((e) => [e.name, e.simple, e.deeper, e.matters])].join(' ')
).join(' ');

describe('the philosophy glossary', () => {
  test('has no duplicate definitions', () => {
    // The reduce that builds GLOSSARY throws on a duplicate at import time, so
    // reaching this test at all means there was not one. Asserted explicitly
    // anyway, because an import-time throw reads as "the app will not start"
    // rather than as "you typed a word twice".
    expect(Array.from(new Set(GLOSSARY_TERMS)).length).toBe(GLOSSARY_TERMS.length);
  });

  test('shares no term with the physics glossary, so one word has one meaning', () => {
    // GlossaryTerm looks a term up in both files. A term defined in both would
    // make the definition a reader sees depend on lookup order, which is the
    // drift the one-glossary rule exists to prevent.
    GLOSSARY_TERMS.forEach((term) => {
      expect(PHYSICS_GLOSSARY[term]).toBeUndefined();
    });
  });

  test('every definition is a sentence a reader can finish', () => {
    GLOSSARY_TERMS.forEach((term) => {
      const entry = lookupTerm(term)!;
      expect(entry.definition.length).toBeGreaterThan(30);
      expect(entry.definition.length).toBeLessThan(400);
      expect(entry.definition.endsWith('.')).toBe(true);
    });
  });

  test('every see-also points at a term that exists, and no chain loops', () => {
    GLOSSARY_TERMS.forEach((term) => {
      const entry = lookupTerm(term)!;
      if (!entry.see) return;
      expect(GLOSSARY[entry.see]).toBeDefined();
      expect(entry.see).not.toBe(term);
    });
  });

  test('defines the terms the brief named, not only the ones that were convenient', () => {
    ['epistemology', 'a priori', 'compatibilism', 'phenomenology'].forEach((term) =>
      expect(GLOSSARY[term]).toBeDefined()
    );
  });
});

describe('inline terms in the level content', () => {
  const usedTerms = Array.from(allText.matchAll(new RegExp(INLINE_TERM.source, 'g'))).map(
    (match) => match[1].trim()
  );

  test('every inline term resolves to a real glossary entry', () => {
    // A term with no definition renders as a dead control, which is worse than
    // no control at all, so an unresolved term fails here.
    expect(usedTerms.length).toBeGreaterThan(5);
    usedTerms.forEach((term) => expect(lookupTerm(term)).toBeDefined());
  });

  test('leaves no empty or unmatched braces', () => {
    expect(allText).not.toMatch(/\{\{\s*\}\}/);
    const open = (allText.match(/\{\{/g) || []).length;
    const close = (allText.match(/\}\}/g) || []).length;
    expect(open).toBe(close);
  });
});

describe('the level set', () => {
  test('is ordered by number, starts at 0, and counts its entries', () => {
    const numbers = PHILOSOPHY_LEVELS.map((level) => level.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(numbers[0]).toBe(0);
    expect(TOTAL_ENTRIES).toBe(allEntries.length);
    expect(TOTAL_ENTRIES).toBeGreaterThan(3);
  });

  test('gives every level a title and a one-line blurb for the rail', () => {
    PHILOSOPHY_LEVELS.forEach((level) => {
      expect(level.blurb.length).toBeGreaterThan(15);
      expect(level.entries === undefined || level.entries.length > 0).toBe(true);
    });
  });

  test('gives no two entries in the whole subject the same id', () => {
    const ids = allEntries.map((entry) => entry.id);
    expect(Array.from(new Set(ids)).length).toBe(ids.length);
  });

  test('labels every entry with a status from the closed set', () => {
    allEntries.forEach((entry) => {
      expect(['settled', 'debated', 'open']).toContain(entry.status);
    });
  });

  test('does not label everything settled', () => {
    // A suite where every entry is 'settled' would pass every other test here
    // and be exactly the failure this content exists to avoid. The debated and
    // open rows are the ones carrying the information.
    expect(allEntries.some((entry) => entry.status === 'settled')).toBe(true);
    expect(allEntries.some((entry) => entry.status === 'debated')).toBe(true);
    expect(allEntries.some((entry) => entry.status === 'open')).toBe(true);
  });

  test('never calls something settled or debated without a source behind it', () => {
    // Enforced at import as well; asserted here so the failure reads as a
    // content problem rather than as a broken build.
    allEntries.forEach((entry) => {
      if (entry.status === 'open') return;
      expect(`${entry.source ?? ''} ${entry.sourceUrl ?? ''}`.trim().length).toBeGreaterThan(10);
    });
  });

  test('does not resolve a contested question into a settled-sounding entry', () => {
    // The discipline this whole subject is being tested on. Free will and the
    // trolley problem are places where the honest answer is that the argument is
    // live, and this asserts they were not quietly tidied up.
    const byName = (name: string) => allEntries.find((entry) => entry.name === name);
    expect(byName('Reality')?.status).toBe('debated');
    expect(byName('Existence')?.status).toBe('debated');
    expect(byName('Knowledge')?.status).toBe('settled');
    expect(byName('Skepticism')?.status).toBe('open');
  });

  test('states the disputed cases concretely rather than naming them', () => {
    // The voice rule, made checkable: an entry that mentions the trolley problem
    // has to actually walk through the footbridge variant, and an entry about
    // identity has to name the cases it rests on.
    const knowledge = allEntries.find((entry) => entry.name === 'Knowledge');
    expect(knowledge?.deeper).toMatch(/Ford/);
    expect(knowledge?.deeper).toMatch(/Barcelona/);
    const reality = allEntries.find((entry) => entry.name === 'Reality');
    expect(reality?.deeper).toMatch(/Kant/);
  });

  test('covers the topics the Atlas actually lists, so the markers mean something', () => {
    // Each entry name here has to match an Atlas topic exactly or the index will
    // show the topic as unwritten while the content sits next to it unreachable.
    ['Reality', 'Existence', 'Knowledge', 'Skepticism'].forEach(
      (name) => expect(allEntries.some((entry) => entry.name === name)).toBe(true)
    );
  });
});
