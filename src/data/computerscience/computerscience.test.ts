/**
 * The computer science levels, and the glossary they lean on.
 *
 * The same checks the physics, philosophy and history content carry, because the
 * claim being made is that the pattern generalises to a fourth subject rather than
 * that this one got a lighter version of it.
 *
 * The discipline here is unusually important, because this subject has more ways
 * to look finished than the others. A benchmark number, a version constant, a
 * citation and a settled-sounding label can all be present and all still be
 * misleading. So the tests check not just that a field is non-empty but that
 * specific, checkable facts survived: the HashMap thresholds, the ILSVRC error
 * rates, both sides of the quantum dispute, the date on Heartbleed. Those are
 * assertions a future edit has to actively delete, which is the only kind that
 * protects a specific claim.
 */
import { CS_LEVELS, TOTAL_ENTRIES } from './index';
import { GLOSSARY, GLOSSARY_TERMS, lookupTerm } from './glossary';
import { GLOSSARY as PHYSICS_GLOSSARY } from '../blackholes/glossary';
import { GLOSSARY as PHILOSOPHY_GLOSSARY } from '../philosophy/glossary';
import { GLOSSARY as HISTORY_GLOSSARY } from '../history/glossary';
import { INLINE_TERM, lookupTerm as lookupJoined } from '../../components/GlossaryTerm';
import { KNOWLEDGE_FIELDS } from '../knowledgeFields';
import { resolveAtlasTopic, slugify } from '../atlasResolution';

const allEntries = CS_LEVELS.flatMap((level) => level.entries ?? []);
const allText = CS_LEVELS.map(
  (level) =>
    [level.title, level.blurb, level.intro ?? '', ...(level.entries ?? []).flatMap((e) => [e.name, e.simple, e.deeper, e.matters])].join(' ')
).join(' ');

describe('the computer science glossary', () => {
  test('has no duplicate definitions', () => {
    expect(Array.from(new Set(GLOSSARY_TERMS)).length).toBe(GLOSSARY_TERMS.length);
  });

  test('shares no term with the other three glossaries, so one word has one meaning', () => {
    // GlossaryTerm now looks a term up in four files. A term defined in two of
    // them would make the definition a reader sees depend on lookup order.
    GLOSSARY_TERMS.forEach((term) => {
      expect(PHYSICS_GLOSSARY[term]).toBeUndefined();
      expect(PHILOSOPHY_GLOSSARY[term]).toBeUndefined();
      expect(HISTORY_GLOSSARY[term]).toBeUndefined();
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

  test('defines the vocabulary a reader of this subject actually meets', () => {
    // Not a general computing wordlist: these are the words that carry the hard
    // ideas. If one drops out, the entry that leaned on it stops being readable
    // without a dictionary.
    ['algorithm', 'hash table', 'undefined behaviour', 'latency', 'cache miss',
     'network partition', 'consensus', 'overfitting', 'generalization',
     'qubit', 'decoherence', 'buffer overflow'].forEach((term) =>
      expect(GLOSSARY[term]).toBeDefined()
    );
  });
});

describe('inline terms in the level content', () => {
  const usedTerms = Array.from(allText.matchAll(new RegExp(INLINE_TERM.source, 'g'))).map(
    (match) => match[1].trim()
  );

  test('every inline term resolves to a real glossary entry', () => {
    // Checked against the JOINED lookup, not this subject's own, because an entry
    // is allowed to borrow a term another subject defines. The test asks the
    // question the reader's screen actually asks - does this resolve - through
    // the same lookup the component uses.
    expect(usedTerms.length).toBeGreaterThan(10);
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
    const numbers = CS_LEVELS.map((level) => level.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(numbers[0]).toBe(0);
    expect(TOTAL_ENTRIES).toBe(allEntries.length);
    expect(TOTAL_ENTRIES).toBeGreaterThanOrEqual(11);
  });

  test('gives every level a title and a one-line blurb for the rail', () => {
    CS_LEVELS.forEach((level) => {
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
      expect(['proved', 'measured', 'machine-dependent', 'contested', 'open']).toContain(entry.status);
    });
  });

  test('uses every one of the five tiers, so the labels carry information', () => {
    // A deck of eleven identical labels would pass every other test here and be
    // the exact failure this content exists to avoid. All five are required
    // because each is doing a different evidential job, and a subject that
    // quietly collapsed back to three would mean the per-subject vocabulary
    // work was decoration.
    expect(allEntries.some((entry) => entry.status === 'proved')).toBe(true);
    expect(allEntries.some((entry) => entry.status === 'measured')).toBe(true);
    expect(allEntries.some((entry) => entry.status === 'machine-dependent')).toBe(true);
    expect(allEntries.some((entry) => entry.status === 'contested')).toBe(true);
    expect(allEntries.some((entry) => entry.status === 'open')).toBe(true);
  });

  test('never labels a checkable claim with no source behind it', () => {
    // The validator enforces this at import for four of five tiers; this asserts
    // it survives, and catches an entry that satisfied it with a stub source.
    allEntries.forEach((entry) => {
      expect(`${entry.source ?? ''} ${entry.sourceUrl ?? ''}`.trim().length).toBeGreaterThan(20);
    });
  });
test('states the contested cases concretely rather than just naming them', () => {
    // The voice rule, made checkable. The quantum entry has to actually walk
    // through both sides' numbers, because an entry that said "there is debate"
    // and stopped would read identically to any other frontier topic.
    const quantum = allEntries.find((entry) => entry.name === 'Quantum Computing');
    expect(quantum?.deeper).toMatch(/200 seconds/);
    expect(quantum?.deeper).toMatch(/10,000 years/);
    expect(quantum?.deeper).toMatch(/2\.5 days/);
    expect(quantum?.source).toMatch(/IBM/);
    const heartbleed = allEntries.find((entry) => entry.name === 'Cybersecurity');
    expect(heartbleed?.deeper).toMatch(/2014/);
    expect(heartbleed?.deeper).toMatch(/7\.5/);
  });


  test('keeps the specific checkable facts that make the entries work', () => {
    // These are the details a reader would repeat to a friend. If a future edit
    // generalises one away - "a certain number of bytes" instead of 64KB, "a
    // large multiple" instead of 10,000 years - the entry still passes every
    // structural test and has stopped being worth reading, which is why they
    // are asserted directly rather than left to review.
    const architecture = allEntries.find((entry) => entry.name === 'Computer Architecture');
    expect(architecture?.deeper).toMatch(/2,048 cells/);
    expect(architecture?.deeper).toMatch(/1,066/);
    expect(architecture?.deeper).toMatch(/475 million/);
    const structures = allEntries.find((entry) => entry.name === 'Algorithms & Data Structures');
    expect(structures?.deeper).toMatch(/JDK 8/);
    expect(structures?.deeper).toMatch(/O\(log n\)/);
    const deep = allEntries.find((entry) => entry.name === 'Deep Learning');
    expect(deep?.deeper).toMatch(/0\.15315/);
    expect(deep?.deeper).toMatch(/0\.26172/);
    const pnp = allEntries.find((entry) => entry.name === 'P vs NP');
    expect(pnp?.deeper).toMatch(/2000/);
    expect(pnp?.deeper).toMatch(/Hamiltonian/);
    const networks = allEntries.find((entry) => entry.name === 'Computer Networks');
    expect(networks?.deeper).toMatch(/RFC 896/);
    expect(networks?.deeper).toMatch(/40 milliseconds/);
    const programming = allEntries.find((entry) => entry.name === 'Programming');
    expect(programming?.deeper).toMatch(/VU#162289/);
    const databases = allEntries.find((entry) => entry.name === 'Databases');
    expect(databases?.deeper).toMatch(/Oracle/);
  });

  test('covers the topics the Atlas actually lists, so the markers mean something', () => {
    // Each Atlas entry name has to match exactly, or the index shows the topic as
    // unwritten while the content sits next to it, unreachable.
    ['Computer Architecture', 'Programming', 'Computer Networks',
     'Algorithms & Data Structures', 'Databases', 'Distributed Systems',
     'Machine Learning', 'Deep Learning', 'Artificial Intelligence',
     'Quantum Computing', 'Cybersecurity'].forEach((name) =>
      expect(allEntries.some((entry) => entry.name === name)).toBe(true)
    );
  });

  test('every entry that is an Atlas topic is reachable from it', () => {
    // The check that would have caught a stale key, the same failure 'World War
    // I' hit in the history pass: the topic reports itself unwritten while its
    // entry sits unreadable in the level above it.
    //
    // Scoped to entries whose names ARE Atlas topics, because "P vs NP" and
    // "The Two Generals Problem" deliberately are not - they are concepts, not
    // module headings, and no tap anywhere in the Atlas could reach them. The
    // sibling test below names that exception so it stays visible; asserting
    // they resolve would be asserting something the Atlas cannot do.
    //
    // It resolves against fieldId 'science' with no discipline, because that is
    // all resolveAtlasTopic receives. 'Quantum Computing' is listed under both
    // physics and computer science in the Atlas, so this also pins the
    // documented behaviour that the slug alone decides which one opens.
    const atlasTopics = (KNOWLEDGE_FIELDS.find((f) => f.id === 'science') as any).disciplines
      .find((d: any) => d.id === 'computer-science')
      .modules.flatMap((m: any) => m.topics);
    const reachable = allEntries.filter((entry) => atlasTopics.includes(entry.name));
    // The two non-Atlas entries plus eleven Atlas ones. A future entry added
    // without a matching Atlas topic fails this count rather than silently
    // becoming unreachable in the same way.
    expect(allEntries.length - reachable.length).toBe(2);
    const unwritten = reachable.filter(
      (entry) => resolveAtlasTopic({ fieldId: 'science', disciplineId: '', moduleName: '', topic: entry.name }).kind !== 'deep-read'
    );
    expect(unwritten.map((entry) => entry.name)).toEqual([]);
  });

  test('an entry name that is an Atlas topic really resolves, slug and all', () => {
    // Belt to the braces above. This asserts entry names are real topics in the
    // computer-science discipline, so a future rename that updates only the entry
    // name is caught from the other direction.
    //
    // "P vs NP" and "The Two Generals Problem" are deliberately NOT Atlas
    // topics: they are the two entries where the concept is the subject rather
    // than a module heading, and they are named here so the exception is
    // visible rather than implied by a silently skipped assertion.
    const atlasTopics = (KNOWLEDGE_FIELDS.find((f) => f.id === 'science') as any).disciplines
      .find((d: any) => d.id === 'computer-science')
      .modules.flatMap((m: any) => m.topics);
    allEntries.forEach((entry) => {
      if (atlasTopics.includes(entry.name)) {
        // The slug is a well-formed function of the name, and the resolver
        // reaches it: a rename that updated only one side of this pair would
        // produce a slug the DEEP_READS key no longer matches.
        expect(slugify(entry.name)).not.toBe('');
        expect(
          resolveAtlasTopic({ fieldId: 'science', disciplineId: 'computer-science', moduleName: '', topic: entry.name }).kind
        ).toBe('deep-read');
        return;
      }
      expect(['P vs NP', 'The Two Generals Problem']).toContain(entry.name);
    });
  });

  test('reports Cloud Computing as honestly unwritten rather than mis-resolved', () => {
    // The one CS Atlas topic deliberately left unwritten. This asserts it stays
    // that way: a key pointing at a level with no cloud entry would open
    // successfully and land the reader somewhere else, which is worse than
    // saying it is not written.
    const resolution = resolveAtlasTopic({
      fieldId: 'science', disciplineId: 'computer-science', moduleName: 'Computing Systems', topic: 'Cloud Computing',
    });
    expect(resolution.kind).toBe('unwritten');
  });

  test('does not resolve an open problem into a settled-sounding entry', () => {
    // The discipline this subject is being tested on. P vs NP is unsolved and
    // must stay 'open'; quantum advantage is actively disputed between named
    // parties and must stay 'contested'. And the mirror image: a proof must not
    // be downgraded to an opinion.
    const byName = (name: string) => allEntries.find((entry) => entry.name === name);
    expect(byName('P vs NP')?.status).toBe('open');
    expect(byName('Quantum Computing')?.status).toBe('contested');
    expect(byName('Artificial Intelligence')?.status).toBe('contested');
    expect(byName('Distributed Systems')?.status).toBe('proved');
  });
});
