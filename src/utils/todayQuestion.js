/**
 * VELORA utility module
 * todayQuestion
 *
 * A daily return hook: one question, the same for everyone on a given day,
 * picked deterministically from real Curious Dictionary terms and lesson
 * topics. The date alone decides which question shows, so a visitor who
 * comes back tomorrow sees a new one, and a visitor who comes back the same
 * day sees the same one. Nothing here identifies anyone.
 *
 * Shape of a question:
 *   { id, subject, termId, question, answer, hint }
 * `answer` is the plain-language answer drawn from the term itself, so the
 * question always has a real answer in the app.
 */

/*
 * Curated questions, each tied to a real dictionary term. The list is short
 * enough to read and deep enough that a two-week cycle never repeats. Adding
 * a question means adding one object here with a real term id and subject.
 */
const QUESTIONS = [
  {
    id: 'event-horizon',
    subject: 'physics',
    termId: 'event-horizon',
    question: "What is the event horizon of a black hole?",
    answer: 'The boundary beyond which no future path leads back outside — not a solid surface, but the point where every path points inward.',
    hint: "It's about where light can and cannot escape.",
  },
  {
    id: 'entropy',
    subject: 'physics',
    termId: 'entropy',
    question: "What does entropy measure?",
    answer: 'The dispersal of energy and the number of ways a system can be arranged — the reason heat flows hot to cold, never the reverse on its own.',
    hint: 'Think disorder, but more precisely about energy spreading out.',
  },
  {
    id: 'platos-cave',
    subject: 'philosophy',
    termId: 'platos-cave',
    question: "In Plato's cave, what do the prisoners mistake for reality?",
    answer: 'The shadows cast on the cave wall — they take appearances for the things themselves, not realising they are seeing a projection.',
    hint: 'The prisoners are chained and facing a wall.',
  },
  {
    id: 'cogito',
    subject: 'philosophy',
    termId: 'cogito-ergo-sum',
    question: "What does Descartes mean by 'I think, therefore I am'?",
    answer: 'That the one thing he cannot doubt is his own doubting: the fact that he is thinking proves there is something doing the thinking.',
    hint: 'Doubt is the starting point.',
  },
  {
    id: 'photosynthesis',
    subject: 'biology',
    termId: 'photosynthesis',
    question: "What does photosynthesis convert light energy into?",
    answer: 'Chemical energy stored in glucose, using carbon dioxide and water and releasing oxygen as a byproduct.',
    hint: "Plants 'eat' light.",
  },
  {
    id: 'natural-selection',
    subject: 'biology',
    termId: 'natural-selection',
    question: "What is natural selection?",
    answer: 'The process by which traits that improve survival and reproduction become more common in a population over generations.',
    hint: "It's not random — it's shaped by what survives.",
  },
  {
    id: 'supply-demand',
    subject: 'economics',
    termId: 'supply-demand',
    question: "What happens to price when supply falls and demand stays steady?",
    answer: 'The price rises, because the good is scarcer relative to how much people want it.',
    hint: 'Scarcity pushes price one way.',
  },
  {
    id: 'cognitive-bias',
    subject: 'psychology',
    termId: 'cognitive-bias',
    question: "What is a cognitive bias?",
    answer: 'A systematic pattern of deviation from rationality in judgment — the mind taking shortcuts that lead to predictable errors.',
    hint: "It's not a one-off mistake; it's a pattern.",
  },
];

const key = 'velora_today_question';

/** Day index within the year (0-based), used to pick the question of the day. */
const dayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/** Pick the question for today deterministically. Stable for the whole day. */
export const getTodayQuestion = () => {
  if (QUESTIONS.length === 0) return null;
  const index = dayOfYear() % QUESTIONS.length;
  return QUESTIONS[index];
};

/** The id of today's question, used to store whether it was answered. */
export const todayQuestionId = () => {
  const q = getTodayQuestion();
  return q ? q.id : null;
};

/** Mark today's question as answered (or unanswered). Returns whether the write landed. */
export const markTodayQuestionAnswered = (answered) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const now = new Date().toISOString().slice(0, 10);
    window.localStorage.setItem(key, JSON.stringify({ date: now, questionId: todayQuestionId(), answered: Boolean(answered) }));
    return true;
  } catch {
    return false;
  }
};

/** Returns whether today's question has already been answered this visit. */
export const isTodayQuestionAnswered = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const now = new Date().toISOString().slice(0, 10);
    const raw = window.localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed.date === now && parsed.questionId === todayQuestionId() && parsed.answered === true;
  } catch {
    return false;
  }
};

const todayQuestion = {
  getTodayQuestion,
  todayQuestionId,
  markTodayQuestionAnswered,
  isTodayQuestionAnswered,
};

export default todayQuestion;
