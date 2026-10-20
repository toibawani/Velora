/**
 * The resolver is the mechanism the whole bug fix rests on, so it is tested
 * against the real Atlas data rather than against hand-written fixtures. A test
 * with invented topics would pass while the actual 573 stayed broken.
 */
import { resolveAtlasTopic, fieldCoverageByDiscipline, slugify } from './atlasResolution';
import { KNOWLEDGE_FIELDS } from './knowledgeFields';

const at = (fieldId: string, topicOrDiscipline: string, maybeTopic?: string) =>
  resolveAtlasTopic({
    fieldId,
    disciplineId: maybeTopic === undefined ? '' : topicOrDiscipline,
    moduleName: '',
    topic: maybeTopic === undefined ? topicOrDiscipline : maybeTopic,
  });

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

  test('routes the written computer science topics to the cs deep read, on their own level', () => {
    // The generalization of the philosophy case above. Eleven Atlas topics, each
    // with the level id of the level that actually carries the entry, so a tap
    // on "Quantum Computing" opens the frontier level rather than the top of
    // the subject. 'P vs NP' and 'The Two Generals Problem' are not Atlas
    // topics and are deliberately not keyed here.
    const cases: Array<[string, string]> = [
      ['Programming', 'the-machine'],
      ['Computer Architecture', 'the-machine'],
      ['Computer Networks', 'the-machine'],
      ['Algorithms & Data Structures', 'fast-and-correct'],
      ['Databases', 'fast-and-correct'],
      ['Distributed Systems', 'many-machines'],
      ['Machine Learning', 'learning-from-data'],
      ['Deep Learning', 'learning-from-data'],
      ['Artificial Intelligence', 'learning-from-data'],
      ['Quantum Computing', 'the-frontier'],
      ['Cybersecurity', 'the-frontier'],
    ];
    cases.forEach(([topic, levelId]) => {
      expect(at('science', topic)).toEqual({
        kind: 'deep-read',
        readId: 'cs-core',
        levelId,
        title: 'Computer science, from the machine up',
        fieldId: 'science',
      });
    });
  });

  test('leaves an unwritten computer science topic unwritten rather than sending it to the read', () => {
    // Same failure mode as the philosophy case: opening one subject's material
    // for every topic in the discipline. 'Cloud Computing' is listed but has no
    // entry, so it stays unwritten rather than opening a level that does not
    // contain it.
    expect(at('science', 'Cloud Computing').kind).toBe('unwritten');
    expect(at('science', 'Robotics').kind).toBe('unwritten');
  });

  test('reports an unwritten topic as unwritten instead of inventing content', () => {
    // 'Quantum Tunneling' sits under Physics > Quantum Physics. This example has
    // had to move four times: Entropy, then Electric Charge, then Mirrors, then
    // Nuclear Physics, each as its lesson landed. Quantum Tunneling still has no
    // lesson, so it is the honest case today.
    expect(at('science', 'Quantum Tunneling')).toEqual({
      kind: 'unwritten', reason: 'no-content-yet', title: 'Quantum Tunneling', fieldId: 'science',
    });
  });

  test('a Classical Mechanics topic with a lesson in the curriculum opens that lesson', () => {
    // 'Motion' was the example of an unwritten topic until the lesson was
    // written. The Atlas topic and the lesson id are matched by slug, so this
    // also checks that the two names still agree.
    expect(at('science', 'Motion')).toEqual({
      kind: 'lesson', subject: 'physics', topicId: 'motion', title: 'Motion', fieldId: 'science',
    });
    expect(at('science', 'Work, Energy & Power')).toEqual({
      kind: 'lesson', subject: 'physics', topicId: 'work-energy-power', title: 'Work, Energy & Power', fieldId: 'science',
    });
  });

  test('a discipline with its own curriculum beats the field it sits in', () => {
    // Science is one Atlas field holding six disciplines. Before the discipline
    // was honoured, every chemistry topic was looked for in the physics
    // curriculum and reported unwritten while the chemistry lesson sat in a
    // separate file that nothing could reach.
    expect(
      resolveAtlasTopic({ fieldId: 'science', disciplineId: 'chemistry', moduleName: 'Physical Chemistry', topic: 'Chemical Bonding' })
    ).toEqual({
      kind: 'lesson', subject: 'chemistry', topicId: 'chemical-bonding', title: 'Chemical Bonding', fieldId: 'science',
    });

    // Biology arrived the same way and is the check that the first fix was
    // general rather than a special case for one discipline: 'DNA' resolves to
    // the biology lesson only because the discipline map says so, and under
    // physics the same name is honestly unwritten.
    expect(
      resolveAtlasTopic({ fieldId: 'science', disciplineId: 'biology', moduleName: 'Molecular Biology', topic: 'DNA' })
    ).toEqual({
      kind: 'lesson', subject: 'biology', topicId: 'dna', title: 'DNA', fieldId: 'science',
    });
    expect(
      resolveAtlasTopic({ fieldId: 'science', disciplineId: 'biology', moduleName: 'Cell Biology', topic: 'Cell Signaling' }).kind
    ).toBe('lesson');
    expect(
      resolveAtlasTopic({ fieldId: 'science', disciplineId: 'physics', moduleName: '', topic: 'DNA' }).kind
    ).toBe('unwritten');

    // The same topic name under the physics discipline stays unwritten. That is
    // what proves the discipline decides the subject rather than the field.
    expect(
      resolveAtlasTopic({ fieldId: 'science', disciplineId: 'physics', moduleName: '', topic: 'Chemical Bonding' }).kind
    ).toBe('unwritten');
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
    const topics = (science as unknown as { disciplines: Array<{ modules: Array<{ topics: string[] }> }> }).disciplines.flatMap((d) =>
      d.modules.flatMap((m) => m.topics));
    const coverage = fieldCoverageByDiscipline(science as never);

    expect(coverage.written + coverage.unwritten + coverage.unmapped).toBe(topics.length);
    // Sixty-four written entry points across the whole science field: ten for
    // classical mechanics, five for Thermodynamics, seven for Electromagnetism,
    // seven for Optics, four for Waves, four for Modern Physics, seven for
    // Chemistry, eight for Biology, one for space science (black holes), and
    // eleven for the computer science deep read. It was twenty-two before
    // Thermodynamics landed, forty-nine before Chemistry and fifty-six before
    // Biology.
    expect(coverage.written).toBe(64);
    expect(coverage.unmapped).toBe(0);
  });

  test('is honest about how little is written today', () => {
    // A deliberate number, raised in the same commit as the content that earned
    // it. It went from 10 to 18 when the philosophy levels landed, and from 18
    // to 30 when the history levels did, and from 30 to 42 when computer
    // science did: eleven CS Atlas topics, plus "Quantum Computing" which the
    // Atlas lists under both physics and computer science and so counts twice.
    // It is now 91, eight higher, because the eight Biology lessons landed.
    // It was 83 after Chemistry, 76 after Modern Physics, 72 after Waves, 68
    // after Optics, 61 after Electromagnetism and 54 after Thermodynamics. If it
    // fails, content was added, which is good news - raise it in the same commit
    // as the content.
    //
    // It is worth being precise about what 91 out of 572 means. It is not
    // "ninety-one topics are done" in any sense a reader would recognise; it
    // is ninety-one topics that open something real, against roughly four
    // hundred and eighty that honestly report themselves as unwritten.
    // Walked discipline by discipline. A flat list of topic names cannot answer
    // this question any more: Science holds six disciplines with different
    // curricula, and guessing one of them is what hid the chemistry lessons.
    const all: Array<[string, string, string]> = [];
    KNOWLEDGE_FIELDS.forEach((f) => {
      f.disciplines.forEach((d) => {
        d.modules.forEach((m) => {
          m.topics.forEach((t) => all.push([f.id, d.id, t]));
        });
      });
    });
    const written = all.filter(([fieldId, disciplineId, topic]) => {
      const kind = at(fieldId, disciplineId, topic).kind;
      return kind === 'lesson' || kind === 'deep-read';
    }).length;

    expect(written).toBe(91);
    expect(all.length).toBeGreaterThan(500);
  });

  test('each subject reports its own written count, so a field cannot drift silently', () => {
    // The single total above says how much of the app is written. It says
    // nothing about whether one subject stopped working while the others
    // carried the number, which is exactly what would have happened if the
    // history deep-read keys had not matched their Atlas topics: twelve entries
    // of real content, a total that looked fine, and a history field whose
    // taps still said "not written yet".
    const perField = KNOWLEDGE_FIELDS.reduce<Record<string, { written: number; total: number }>>((acc, f) => {
      let written = 0;
      let total = 0;
      f.disciplines.forEach((d) => {
        d.modules.forEach((m) => {
          m.topics.forEach((t) => {
            total += 1;
            const kind = at(f.id, d.id, t).kind;
            if (kind === 'lesson' || kind === 'deep-read') written += 1;
          });
        });
      });
      acc[f.id] = { written, total };
      return acc;
    }, {});

    // Measured, not assumed. The first version of this test guessed fifteen for
    // philosophy and eighteen for history on the reasoning that "ten philosophy
    // topics plus some lessons" ought to come to that, and was wrong on both -
    // philosophy is 13 and history is 14. A coverage assertion written from a
    // guess is worse than none, because the guess reads as knowledge.
    //
    // Science is 64: ten classical mechanics, five Thermodynamics lessons,
    // seven Electromagnetism lessons, seven Optics lessons, four Waves lessons,
    // four Modern Physics lessons, seven Chemistry lessons, eight Biology
    // lessons, one space science, eleven computer science.
    expect(perField.science.written).toBe(64);
    expect(perField.philosophy.written).toBe(13);
    // History: two pre-existing lessons, plus the twelve history entries.
    expect(perField.history.written).toBe(14);
    expect(perField.history.total).toBe(78);
    // The three fields with no curriculum must still report as unwritten rather
    // than quietly counting as written, and their totals still have to sum.
    expect(perField['political-science'].written).toBe(0);
    expect(perField.geography.written).toBe(0);
    expect(perField.literature.written).toBe(0);
    // And the parts still have to add up to the whole, which is what catches a
    // field being added to the map but never counted.
    const summed = Object.values(perField).reduce((total, field) => total + field.written, 0);
    expect(summed).toBe(91);
  });
});
