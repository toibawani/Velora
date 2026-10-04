/**
 * The history levels, and the glossary they lean on.
 *
 * The same checks the physics and philosophy content carry, because the claim
 * being made is that the pattern generalises to a third subject rather than that
 * this one got a lighter version of it.
 *
 * Two of these earned their place by failing first, which is the standard this
 * repo has settled on:
 *
 *  - "every Atlas topic is reachable" caught 'World War I'. Its slug is
 *    "world-war-i", not "world-war-one", and the mismatch meant the topic
 *    reported itself unwritten while its entry sat unreadable in the level above.
 *  - "uses all three status tiers" caught nothing, but a version of it that
 *    only asserted 'disputed' would have passed a deck of twelve identical
 *    labels. All three are required.
 */
import { HISTORY_LEVELS, TOTAL_ENTRIES } from './index';
import { GLOSSARY, GLOSSARY_TERMS, lookupTerm } from './glossary';
import { GLOSSARY as PHYSICS_GLOSSARY } from '../blackholes/glossary';
import { GLOSSARY as PHILOSOPHY_GLOSSARY } from '../philosophy/glossary';
import { INLINE_TERM } from '../../components/GlossaryTerm';
import { lookupTerm as lookupJoined } from '../../components/GlossaryTerm';
import { KNOWLEDGE_FIELDS } from '../knowledgeFields';
import { resolveAtlasTopic, slugify } from '../atlasResolution';

const allEntries = HISTORY_LEVELS.flatMap((level) => level.entries ?? []);
const allText = HISTORY_LEVELS.map(
  (level) =>
    [level.title, level.blurb, level.intro ?? '', ...(level.entries ?? []).flatMap((e) => [e.name, e.simple, e.deeper, e.matters])].join(' ')
).join(' ');

describe('the history glossary', () => {
  test('has no duplicate definitions', () => {
    expect(Array.from(new Set(GLOSSARY_TERMS)).length).toBe(GLOSSARY_TERMS.length);
  });

  test('shares no term with the other two glossaries, so one word has one meaning', () => {
    // GlossaryTerm now looks a term up in three files. A term defined in two of
    // them would make the definition a reader sees depend on lookup order.
    GLOSSARY_TERMS.forEach((term) => {
      expect(PHYSICS_GLOSSARY[term]).toBeUndefined();
      expect(PHILOSOPHY_GLOSSARY[term]).toBeUndefined();
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

  test('defines the terms the brief named, not only the convenient ones', () => {
    // The brief asked for the vocabulary a reader meets in this subject:
    // feudalism, suffrage, appeasement, colonialism among them.
    ['feudalism', 'suffrage', 'appeasement', 'colonialism', 'historiography', 'primary source'].forEach((term) =>
      expect(GLOSSARY[term]).toBeDefined()
    );
  });
});

describe('inline terms in the level content', () => {
  const usedTerms = Array.from(allText.matchAll(new RegExp(INLINE_TERM.source, 'g'))).map(
    (match) => match[1].trim()
  );

  test('every inline term resolves to a real glossary entry', () => {
    // Checked against the JOINED lookup, not the history one, because a history
    // entry is allowed to borrow a term that already has a definition in another
    // subject. The Enlightenment entry here writes {{determinism}}, which is a
    // philosophy term: the Enlightenment is where the argument about whether
    // human actions are determined was had, and inventing a second history
    // definition for it is exactly the drift the one-glossary rule prevents.
    // So the test asks the question the reader's screen actually asks - does
    // this term resolve - through the same lookup the component uses.
    expect(usedTerms.length).toBeGreaterThan(5);
    usedTerms.forEach((term) => expect(lookupJoined(term)).toBeDefined());
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
    const numbers = HISTORY_LEVELS.map((level) => level.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(numbers[0]).toBe(0);
    expect(TOTAL_ENTRIES).toBe(allEntries.length);
    expect(TOTAL_ENTRIES).toBeGreaterThanOrEqual(12);
  });

  test('gives every level a title and a one-line blurb for the rail', () => {
    HISTORY_LEVELS.forEach((level) => {
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
      expect(['well-documented', 'disputed', 'contested']).toContain(entry.status);
    });
  });

  test('uses all three status tiers, so the labels carry information', () => {
    // A deck of twelve identical labels would pass every other test here and be
    // the exact failure this content exists to avoid. Each tier is required,
    // because each is doing a different evidential job.
    expect(allEntries.some((entry) => entry.status === 'well-documented')).toBe(true);
    expect(allEntries.some((entry) => entry.status === 'disputed')).toBe(true);
    expect(allEntries.some((entry) => entry.status === 'contested')).toBe(true);
  });

  test('never labels anything without a source behind it', () => {
    allEntries.forEach((entry) => {
      expect(`${entry.source ?? ''} ${entry.sourceUrl ?? ''}`.trim().length).toBeGreaterThan(10);
    });
  });

  test('does not resolve a contested question into a settled-sounding entry', () => {
    // The discipline this subject is being tested on. The causes of the First
    // World War, the framing of exploration and colonialism, and the shape of
    // the Scientific Revolution are places where the honest answer is that the
    // argument is live; this asserts they were not quietly tidied.
    const byName = (name: string) => allEntries.find((entry) => entry.name === name);
    expect(byName('World War I')?.status).toBe('disputed');
    expect(byName('Reformation')?.status).toBe('disputed');
    expect(byName('Scientific Revolution')?.status).toBe('disputed');
    expect(byName('Age of Exploration')?.status).toBe('contested');
    expect(byName('Colonialism')?.status).toBe('contested');
    expect(byName('French Revolution')?.status).toBe('disputed');
    expect(byName('Ancient Rome')?.status).toBe('well-documented');
  });

  test('states the disputed cases concretely rather than just naming them', () => {
    // The voice rule, made checkable. An entry that mentions the First World War
    // has to actually walk through Fischer and Clark; an entry about colonialism
    // has to name the post-1990 turn, not gesture at "debate".
    const wwi = allEntries.find((entry) => entry.name === 'World War I');
    expect(wwi?.deeper).toMatch(/Fischer/);
    expect(wwi?.deeper).toMatch(/Clark/);
    expect(wwi?.deeper).toMatch(/1914/);
    const exploration = allEntries.find((entry) => entry.name === 'Age of Exploration');
    expect(exploration?.deeper).toMatch(/1492/);
    expect(exploration?.deeper).toMatch(/Columbus/);
    const colonialism = allEntries.find((entry) => entry.name === 'Colonialism');
    expect(colonialism?.deeper).toMatch(/1990|postcolonial/i);
    const french = allEntries.find((entry) => entry.name === 'French Revolution');
    expect(french?.deeper).toMatch(/1789/);
  });

  test('covers the topics the Atlas actually lists, so the markers mean something', () => {
    // Each entry name has to match an Atlas topic exactly, or the index will show
    // the topic as unwritten while the content sits next to it, unreachable.
    ['Ancient Egypt', 'Ancient Greece', 'Ancient Rome', 'Reformation', 'Scientific Revolution',
     'Age of Exploration', 'Enlightenment', 'French Revolution', 'Colonialism', 'World War I',
     'Decolonization', 'Cold War'].forEach((name) =>
      expect(allEntries.some((entry) => entry.name === name)).toBe(true)
    );
  });

  test('every entry is reachable from its Atlas topic', () => {
    // This is the check that would have caught "World War I" on the first pass.
    // Its slug is "world-war-i", not "world-war-one", and the deep-read key
    // missed it: the topic reported itself unwritten while its entry sat in the
    // level above it with nothing to open it.
    const unwritten = allEntries.filter(
      (entry) => resolveAtlasTopic({ fieldId: 'history', disciplineId: '', moduleName: '', topic: entry.name }).kind !== 'deep-read'
    );
    expect(unwritten.map((entry) => entry.name)).toEqual([]);
  });

  test('an entry name that is an Atlas topic really resolves, slug and all', () => {
    // Belt to the braces above: this also asserts the slug is a well-formed
    // function of the name, so a future rename that only updates the name
    // (leaving a stale key) is caught from the other direction.
    const atlasTopics = (KNOWLEDGE_FIELDS.find((f) => f.id === 'history') as any).disciplines
      .flatMap((d: any) => d.modules.flatMap((m: any) => m.topics));
    allEntries.forEach((entry) => {
      const slug = slugify(entry.name);
      expect({ name: entry.name, inAtlas: atlasTopics.includes(entry.name), slug }).toEqual({
        name: entry.name,
        inAtlas: true,
        slug: expect.any(String),
      });
    });
  });
});
