import { CURRICULUM } from '../data/curriculum';

const STORAGE_KEY = 'velora_question_desk';

/**
 * The question desk: questions the learner has actually written down, plus the
 * notes they have made against them.
 *
 * The Community screen this replaces took what you typed, filed it under an
 * invented handle ("Scholar_You"), handed it one invented upvote, and threw it
 * away the moment you navigated away. Nothing here is invented: an entry is a
 * question this person asked themselves, stored on this device.
 *
 * Shape stored: [{ id, question, subject, topicId, createdAt, notes: [{ id, text, createdAt }] }]
 */

const isList = (value) => Array.isArray(value);

// Date.now() on its own collides when two entries are created inside the same
// millisecond, which happens as soon as a question and a note are written back
// to back. A shared id then makes removeQuestion delete more than the one it
// was handed and addNote write to both. The counter keeps ids distinct within a
// visit; the timestamp keeps them distinct across reloads.
let sequence = 0;
const nextId = (prefix) => `${prefix}-${Date.now()}-${sequence++}`;

const isValidEntry = (entry) =>
  entry && typeof entry === 'object' && typeof entry.question === 'string' && entry.question.trim() !== '';

export const getQuestions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return isList(parsed) ? parsed.filter(isValidEntry) : [];
  } catch {
    return [];
  }
};

const write = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or blocked. The entry still lives in component state for this
    // visit, which is honest for one sitting, rather than claiming it was kept.
  }
  return entries;
};

export const addQuestion = ({ question, subject, topicId = null }) => {
  const trimmed = String(question || '').trim();
  if (trimmed.length === 0) return getQuestions();

  const entries = getQuestions();
  return write([
    {
      id: nextId('q'),
      question: trimmed,
      subject: CURRICULUM[subject] ? subject : 'physics',
      topicId: typeof topicId === 'string' && topicId !== '' ? topicId : null,
      createdAt: new Date().toISOString(),
      notes: [],
    },
    ...entries,
  ]);
};

export const removeQuestion = (questionId) =>
  write(getQuestions().filter((entry) => entry.id !== questionId));

export const addNote = (questionId, text) => {
  const trimmed = String(text || '').trim();
  if (trimmed === '') return getQuestions();

  return write(
    getQuestions().map((entry) =>
      entry.id === questionId
        ? {
            ...entry,
            notes: [
              ...(isList(entry.notes) ? entry.notes : []),
              { id: nextId('n'), text: trimmed, createdAt: new Date().toISOString() },
            ],
          }
        : entry,
    ),
  );
};

// A question may only point at a lesson the curriculum actually contains; a
// dangling reference would render a lesson title that nothing can open.
export const topicChoices = (subject) =>
  (CURRICULUM[subject]?.modules || []).flatMap((module) =>
    (module.topics || []).map((topic) => ({
      id: topic.id,
      title: topic.title,
      module: module.title,
    })),
  );

export const findTopic = (subject, topicId) =>
  topicChoices(subject).find((topic) => topic.id === topicId) || null;
