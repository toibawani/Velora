import { getQuestions, addQuestion, addNote, removeQuestion, topicChoices, findTopic } from './questionDesk';
import { CURRICULUM } from '../data/curriculum';

describe('question desk', () => {
  beforeEach(() => localStorage.clear());

  test('starts empty when nothing has been written', () => {
    expect(getQuestions()).toEqual([]);
  });

  test('keeps a question and returns the whole list', () => {
    const after = addQuestion({ question: 'Why does the horizon trap light past the limit?', subject: 'physics' });

    expect(after).toHaveLength(1);
    expect(after[0].question).toBe('Why does the horizon trap light past the limit?');
    expect(after[0].subject).toBe('physics');
    expect(after[0].notes).toEqual([]);
    expect(getQuestions()).toHaveLength(1);
  });

  test('refuses a question that is only whitespace', () => {
    addQuestion({ question: '   ', subject: 'physics' });
    expect(getQuestions()).toEqual([]);
  });

  test('files an unknown subject under physics and drops a dangling lesson id', () => {
    const [entry] = addQuestion({ question: 'A question long enough to keep around.', subject: 'astrology', topicId: '' });

    expect(entry.subject).toBe('physics');
    expect(entry.topicId).toBeNull();
  });

  test('adds a note to one entry and leaves the others alone', () => {
    addQuestion({ question: 'First question, worth keeping.', subject: 'physics' });
    const [second] = addQuestion({ question: 'Second question, worth keeping.', subject: 'history' });
    const [first] = getQuestions().filter((q) => q.subject === 'physics');

    const after = addNote(first.id, 'The answer is coordinate freedom.');

    const noted = after.find((q) => q.id === first.id);
    const untouched = after.find((q) => q.id === second.id);
    expect(noted.notes).toHaveLength(1);
    expect(noted.notes[0].text).toBe('The answer is coordinate freedom.');
    expect(untouched.notes).toEqual([]);
  });

  test('ignores an empty note', () => {
    const [entry] = addQuestion({ question: 'A question long enough to keep around.', subject: 'physics' });
    addNote(entry.id, '   ');
    expect(getQuestions()[0].notes).toEqual([]);
  });

  test('discards only the question it was handed', () => {
    const [first] = addQuestion({ question: 'First question, worth keeping.', subject: 'physics' });
    addQuestion({ question: 'Second question, worth keeping.', subject: 'physics' });

    const after = removeQuestion(first.id);

    expect(after).toHaveLength(1);
    expect(after[0].id).not.toBe(first.id);
  });

  test('recovers an empty list from corrupted storage', () => {
    localStorage.setItem('velora_question_desk', '{not-json');
    expect(getQuestions()).toEqual([]);
  });

  test('only offers lessons the curriculum actually teaches', () => {
    const choices = topicChoices('physics');
    const ids = choices.map((topic) => topic.id);

    expect(choices.length).toBeGreaterThan(0);
    CURRICULUM.physics.modules.forEach((module) => {
      module.topics.forEach((topic) => expect(ids).toContain(topic.id));
    });
  });

  test('resolves a real lesson and refuses an invented one', () => {
    const real = topicChoices('physics')[0];

    expect(findTopic('physics', real.id).title).toBe(real.title);
    expect(findTopic('physics', 'no-such-topic')).toBeNull();
  });
});
