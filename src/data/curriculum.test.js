import { CURRICULUM, getTopic } from './curriculum';

describe('VELORA curriculum', () => {
  test('contains the core subjects and requested topics', () => {
    expect(Object.keys(CURRICULUM)).toEqual(['physics', 'philosophy', 'history']);
    expect(getTopic('physics', 'black-holes').title).toBe('Black Holes');
    expect(getTopic('philosophy', 'stoicism').title).toBe('Stoicism');
    expect(getTopic('history', 'renaissance').title).toBe('The Renaissance');
  });

  // A lesson that cannot say what it was checked against is asking to be
  // believed. Every entry here names at least one work a reader can go and
  // read, and the link is required rather than the citation alone, because a
  // citation without a link is how a source becomes a decoration.
  test('every topic names the works its content was checked against', () => {
    Object.values(CURRICULUM).forEach((subject) => {
      subject.modules.forEach((module) => module.topics.forEach((topic) => {
        expect(Array.isArray(topic.sources)).toBe(true);
        expect(topic.sources.length).toBeGreaterThan(0);
        topic.sources.forEach((source) => {
          expect(source.label.length).toBeGreaterThan(8);
          expect(source.url).toMatch(/^https:\/\//);
        });
      }));
    });
  });

  test('every topic has teaching sections and an uncertainty note', () => {
    Object.values(CURRICULUM).forEach((subject) => {
      subject.modules.forEach((module) => module.topics.forEach((topic) => {
        expect(topic.story.length).toBeGreaterThan(40);
        expect(topic.sections.length).toBeGreaterThanOrEqual(3);
        expect(topic.uncertainty.length).toBeGreaterThan(20);
        expect(topic.career.length).toBeGreaterThan(20);
      }));
    });
  });
});
