import { CURRICULUM, getTopic } from './curriculum';

describe('VELORA curriculum', () => {
  test('contains the core subjects and requested topics', () => {
    expect(Object.keys(CURRICULUM)).toEqual(['physics', 'philosophy', 'history', 'chemistry', 'biology']);
    expect(getTopic('physics', 'black-holes').title).toBe('Black Holes');
    expect(getTopic('philosophy', 'stoicism').title).toBe('Stoicism');
    expect(getTopic('history', 'renaissance').title).toBe('The Renaissance');
    expect(getTopic('chemistry', 'chemical-bonding').title).toBe('Chemical Bonding');
    expect(getTopic('biology', 'dna').title).toBe('DNA');
    expect(getTopic('biology', 'protein-synthesis').title).toBe('Protein Synthesis');
  });

  // A lesson that cannot say what it was checked against is asking to be
  // believed. Every entry here names at least one work a reader can go and
  // read, and the link is required rather than the citation alone, because a
  // citation without a link is how a source becomes a decoration.
  // A curriculum file lists two kinds of topic: lessons that are written, and
  // titles that are planned. Only the first kind can carry a reading list or
  // teaching sections, and the tests below check each kind against its own
  // contract. Treating a planned title as a lesson is the bug that made the
  // Atlas open a reader with no sections and crash.
  const allTopics = () => Object.values(CURRICULUM).flatMap((subject) =>
    subject.modules.flatMap((module) => module.topics.map((topic) => ({ topic, module })))
  );
  const isWritten = ({ topic }) => Array.isArray(topic.sections) && topic.sections.length > 0;

  test('every written topic names the works its content was checked against', () => {
    allTopics().filter(isWritten).forEach(({ topic }) => {
      expect(Array.isArray(topic.sources)).toBe(true);
      expect(topic.sources.length).toBeGreaterThan(0);
      topic.sources.forEach((source) => {
        expect(source.label.length).toBeGreaterThan(8);
        expect(source.url).toMatch(/^https:\/\//);
      });
    });
  });

  test('every written topic has teaching sections and an uncertainty note', () => {
    allTopics().filter(isWritten).forEach(({ topic }) => {
      expect(topic.story.length).toBeGreaterThan(40);
      expect(topic.sections.length).toBeGreaterThanOrEqual(3);
      expect(topic.uncertainty.length).toBeGreaterThan(20);
      expect(topic.career.length).toBeGreaterThan(20);
    });
  });

  test('a planned topic is a name and nothing that looks like finished content', () => {
    const planned = allTopics().filter((entry) => !isWritten(entry));
    expect(planned.length).toBeGreaterThan(0);
    planned.forEach(({ topic }) => {
      expect(topic.title.length).toBeGreaterThan(2);
      expect(topic.story).toBeUndefined();
      expect(topic.sections).toBeUndefined();
      expect(topic.sources).toBeUndefined();
      expect(topic.uncertainty).toBeUndefined();
    });
  });
});
