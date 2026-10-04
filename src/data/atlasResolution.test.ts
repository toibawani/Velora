/**
 * The resolver is the mechanism the whole bug fix rests on, so it is tested
 * against the real Atlas data rather than against hand-written fixtures. A test
 * with invented topics would pass while the actual 573 stayed broken.
 */
import { resolveAtlasTopic, fieldCoverage, slugify } from './atlasResolution';
import { KNOWLEDGE_FIELDS } from './knowledgeFields';

const at = (fieldId: string, topic: string) =>
  resolveAtlasTopic({ fieldId, disciplineId: '', moduleName: '', topic });

describe('slugify', () => {
  test('normalises the punctuation that separates Atlas names from slugs', () => {
    expect(slugify('Stoicism')).toBe('stoicism');
    // A curly apostrophe and a straight one must land in the same place, or
    // "Maxwell's Equations" fails to match on typography alone.
    expect(slugify('Maxwell’s Equations')).toBe(slugify("Maxwell's Equations"));
    expect(slugify('Work, Energy & Power')).toBe('work-energy-and-power');
  });
});

describe('resolveAtlasTopic', () => {
  test('finds a lesson when the Atlas name and the lesson title differ', () => {
    // The Atlas writes 'Stoicism'; the curriculum keys it 'stoicism'. This is
    // the exact class of mismatch that made every tap inert.
    expect(at('philosophy', 'Stoicism')).toEqual({
      kind: 'lesson', subject: 'philosophy', topicId: 'stoicism', title: 'Stoicism', fieldId: 'philosophy',
    });
  });

  test('matches a history topic whether or not the Atlas writes an article', () => {
    // The Atlas lists both 'Renaissance' and 'Industrial Revolution'; the
    // curriculum titles them 'The Renaissance'. Both have to land.
    const topicIdOf = (topic: string) => {
      const resolution = at('history', topic);
      if (resolution.kind !== 'lesson') throw new Error(`expected a lesson for "${topic}", got ${resolution.kind}`);
      return resolution.topicId;
    };
    expect(topicIdOf('Renaissance')).toBe('renaissance');
    expect(topicIdOf('The Renaissance')).toBe('renaissance');
    expect(topicIdOf('Industrial Revolution')).toBe('industrial-revolution');
  });

  test('routes black holes to the deep read, not to a lesson', () => {
    // Deep reads are checked first on purpose: the black hole levels are richer
    // than any single lesson and are the material that actually exists.
    expect(at('science', 'Black Holes').kind).toBe('deep-read');
    expect(at('science', 'General Relativity').kind).toBe('deep-read');
  });

  test('routes the written philosophy topics to the philosophy deep read, on their own level', () => {
    // The generalization of the case above. Adding a second subject is a map entry
    // per topic plus a level id; nothing about how a tap resolves changed.
    const cases: Array<[string, string]> = [
      ['Reality', 'what-is-there'],
      ['Knowledge', 'what-we-can-know'],
      ['Morality', 'what-we-should-do'],
      ['Identity', 'who-we-are'],
      ['Free Will', 'are-we-free'],
    ];
    cases.forEach(([topic, levelId]) => {
      expect(at('philosophy', topic)).toEqual({
        kind: 'deep-read',
        readId: 'philosophy-core',
        levelId,
        title: 'The big questions',
        fieldId: 'philosophy',
      });
    });
  });

  test('leaves an unwritten philosophy topic unwritten rather than sending it to the read', () => {
    // The failure mode this whole design guards against: opening one subject's
    // material for every topic in the field, so the index shows "written" for
    // 88 topics when 10 have entries. 'Being' is listed but not written.
    expect(at('philosophy', 'Being').kind).toBe('unwritten');
    expect(at('philosophy', 'Nietzsche').kind).toBe('unwritten');
  });

  test('reports an unwritten topic as unwritten instead of inventing content', () => {
    expect(at('science', 'Motion')).toEqual({
      kind: 'unwritten', reason: 'no-content-yet', title: 'Motion', fieldId: 'science',
    });
  });

  test('distinguishes a field with no curriculum from a topic with no lesson', () => {
    // These are different failures and the UI says different things about them.
    expect(at('political-science', 'State').kind).toBe('unmapped-field');
    expect(at('geography', 'Monsoons').kind).toBe('unmapped-field');
    expect(at('literature', 'Shakespeare').kind).toBe('unmapped-field');
  });

  test('no topic in the whole atlas resolves to nothing at all', () => {
    // The core guarantee. Before the fix, every one of these taps fell through
    // a hole in the UI; now each one produces a definite, renderable answer.
    const kinds = new Set<string>();
    KNOWLEDGE_FIELDS.forEach((field) => {
      field.disciplines.forEach((discipline) => {
        discipline.modules.forEach((module) => {
          module.topics.forEach((topic) => kinds.add(at(field.id, topic).kind));
        });
      });
    });
    expect(Array.from(kinds).sort()).toEqual(['deep-read', 'lesson', 'unmapped-field', 'unwritten']);
  });
});

describe('fieldCoverage', () => {
  test('counts written and unwritten topics per field', () => {
    const science = KNOWLEDGE_FIELDS.find((field) => field.id === 'science');
    expect(science).toBeDefined();
    const topics = (science as (typeof KNOWLEDGE_FIELDS)[number]).disciplines.flatMap((d) =>
      d.modules.flatMap((m) => m.topics));
    const coverage = fieldCoverage('science', topics);

    expect(coverage.written + coverage.unwritten + coverage.unmapped).toBe(topics.length);
    // Physics has three written entry points: the two lessons that match Atlas
    // topic names, plus black holes as a deep read.
    expect(coverage.written).toBe(3);
    expect(coverage.unmapped).toBe(0);
  });

  test('is honest about how little is written today', () => {
    // A deliberate number, raised in the same commit as the content that earned
    // it. It went from 10 to 18 when the philosophy levels landed: three entry
    // points in Science, four philosophy lessons, six history, and the ten
    // philosophy topics that now resolve to the deep read. If it fails, content
    // was added, which is good news - raise it in the same commit as the content.
    const all: Array<[string, string]> = [];
    KNOWLEDGE_FIELDS.forEach((f) => {
      f.disciplines.forEach((d) => {
        d.modules.forEach((m) => {
          m.topics.forEach((t) => all.push([f.id, t]));
        });
      });
    });
    const written = all.filter(([fieldId, topic]) => {
      const kind = at(fieldId, topic).kind;
      return kind === 'lesson' || kind === 'deep-read';
    }).length;

    expect(written).toBe(18);
    expect(all.length).toBeGreaterThan(500);
  });
});
