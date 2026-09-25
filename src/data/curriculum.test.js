import { CURRICULUM, getTopic } from './curriculum';

describe('VELORA curriculum', () => {
  test('contains the core subjects and requested topics', () => {
    expect(Object.keys(CURRICULUM)).toEqual(['physics', 'philosophy', 'history']);
    expect(getTopic('physics', 'black-holes').title).toBe('Black Holes');
    expect(getTopic('philosophy', 'stoicism').title).toBe('Stoicism');
    expect(getTopic('history', 'renaissance').title).toBe('The Renaissance');
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
