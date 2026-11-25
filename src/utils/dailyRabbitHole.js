/**
 * The Daily Rabbit Hole.
 *
 * One question a day, the same question for the whole calendar day, drawn from
 * a real Curious Dictionary entry. Nothing here invents an answer: the
 * explanation the reader compares against is the entry's own explanation, read
 * straight from src/data/dictionary. So the daily question cannot drift from
 * the dictionary it points at, and adding a dictionary entry does not silently
 * create a question with made-up facts.
 *
 * The date alone picks the entry, so:
 *   - the same visitor sees the same question all day,
 *   - the next day is a different one,
 *   - nothing about the visitor is stored to make that work.
 *
 * The notebook is local, through the versioned storage registry, and exports as
 * Markdown. It has a real empty state: no placeholder entries, no sample
 * answer, no invented streak.
 */
import { KEYS, FAILURE, readValue, writeValue } from './storage';
import { CURIOUS_TERMS } from '../data/dictionary';

/**
 * One entry per day, in a fixed order.
 *
 * `termId` must exist in the dictionary; the tests fail if it does not. `read`
 * is optional and points only at content that is known to be written, so the
 * "read the full idea" link never lands on an empty page.
 */
export const DAILY_ENTRIES = [
  {
    id: 'edge-of-a-black-hole',
    termId: 'event-horizon',
    prompt: 'A black hole has no surface. Where does it begin, and what happens to light at that line?',
    lead: 'The edge is not a wall. It is the last place from which turning back is still possible.',
    diagram: 'blackhole',
    notice: 'The grid is spacetime and the dark disc is the horizon. Raise the mass: the horizon grows, and the light paths passing near it bend further from straight.',
    read: { kind: 'deep-read', readId: 'black-holes' },
  },
  {
    id: 'leaving-for-good',
    termId: 'escape-velocity',
    prompt: 'What does it take to leave a planet\u2019s gravity for good?',
    lead: 'Throw something up and it comes back. Throw it fast enough and it never does.',
    diagram: 'orbit',
    notice: 'The path is integrated from the speed you set. At the circular speed it closes into an orbit; past the escape speed it leaves and does not return. The two numbers on screen are sqrt(GM/r) and sqrt(2GM/r).',
    read: { kind: 'deep-read', readId: 'black-holes' },
  },
  {
    id: 'the-broken-egg',
    termId: 'entropy-phys',
    prompt: 'Why does a broken egg never put itself back together?',
    lead: 'Not because the reverse is forbidden. Because there are far more ways to be broken than to be whole.',
    diagram: 'entropy',
    notice: 'Each dot is a molecule and the count is how many sit in each half. Shuffling moves them toward the even split, and the number of arrangements behind that split is larger than any tidy one.',
    read: { kind: 'lesson', subject: 'physics', topicId: 'entropy' },
  },
  {
    id: 'one-electron-two-slits',
    termId: 'double-slit-experiment',
    prompt: 'Fire electrons through two slits one at a time. What appears on the screen behind them?',
    lead: 'Nothing is sent through both slits together, yet the pattern is one only two waves could make.',
    diagram: 'waves',
    notice: 'The bars are the intensity from two coherent sources. Bright bands sit where the two path lengths differ by a whole wavelength; dark bands sit where they differ by half of one.',
    read: { kind: 'lesson', subject: 'physics', topicId: 'interference' },
  },
  {
    id: 'the-cave-wall',
    termId: 'platos-cave',
    prompt: 'What are the prisoners in Plato\u2019s cave actually looking at?',
    lead: 'They have been facing the same wall since birth, and they have names for everything they see on it.',
    diagram: 'cave',
    notice: 'The prisoners see the shadows, the fire is behind them, and the objects are between the fire and the wall. Nothing they can see is the thing itself.',
    read: { kind: 'deep-read', readId: 'philosophy-core' },
  },
];

const TERM_BY_ID = new Map(CURIOUS_TERMS.map((term) => [term.id, term]));

/** The dictionary entry behind an id, or undefined when it has been renamed. */
export const termFor = (termId) => TERM_BY_ID.get(termId);

/**
 * A stable integer for a local calendar date.
 *
 * Built from UTC midnight of the local year/month/day so the number does not
 * jump by one when the clocks change. Using `new Date() - new Date(2020,0,1)`
 * would give a 23- or 25-hour day twice a year and repeat or skip a question.
 */
export const dayNumber = (date = new Date()) => {
  const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(utcMidnight / 86400000);
};

/** The date a notebook entry belongs to, as YYYY-MM-DD in local time. */
export const dateKey = (date = new Date()) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

/**
 * Today's entry: deterministic, stable for the whole day, with its dictionary
 * term attached. Returns null only if the data itself is broken, which the
 * tests rule out at build time.
 */
export const getDailyRabbitHole = (date = new Date()) => {
  if (DAILY_ENTRIES.length === 0) return null;
  const entry = DAILY_ENTRIES[((dayNumber(date) % DAILY_ENTRIES.length) + DAILY_ENTRIES.length) % DAILY_ENTRIES.length];
  const term = termFor(entry.termId);
  if (!term) return null;
  return { ...entry, term, date: dateKey(date) };
};

/** Read the notebook, newest first. Never throws; a broken payload is empty. */
export const readNotebook = () => {
  const stored = readValue(KEYS.RABBIT_HOLE_NOTEBOOK, []);
  if (!Array.isArray(stored)) return [];
  return stored
    .filter((item) => item && typeof item.text === 'string' && typeof item.date === 'string')
    .slice()
    .sort((first, second) => (first.date < second.date ? 1 : first.date > second.date ? -1 : 0));
};

/**
 * Save an answer for a day, replacing an earlier answer for the same day.
 *
 * One answer per day, editable, because a second entry for the same question
 * would read as two different attempts rather than a correction. Returns the
 * storage failure code so the UI can say a save did not land instead of
 * claiming it did.
 */
export const saveAnswer = ({ date, entryId, prompt, termId, text }) => {
  const trimmed = String(text || '').trim();
  if (!trimmed || !date || !entryId) return FAILURE.FAILED;

  const existing = readValue(KEYS.RABBIT_HOLE_NOTEBOOK, []);
  const list = Array.isArray(existing) ? existing.filter((item) => item && item.date !== date) : [];
  const entry = {
    date,
    entryId,
    prompt: String(prompt || ''),
    termId: String(termId || ''),
    text: trimmed,
    savedAt: new Date().toISOString(),
  };
  const result = writeValue(KEYS.RABBIT_HOLE_NOTEBOOK, [...list, entry]);
  return result;
};

export const removeAnswer = (date) => {
  const existing = readValue(KEYS.RABBIT_HOLE_NOTEBOOK, []);
  const list = Array.isArray(existing) ? existing.filter((item) => item && item.date !== date) : [];
  return writeValue(KEYS.RABBIT_HOLE_NOTEBOOK, list);
};

/** The answer already saved for a given day, or null. */
export const answerFor = (date) =>
  readNotebook().find((item) => item.date === date) || null;

/**
 * The whole notebook as one Markdown document.
 *
 * The prompt and the dictionary answer are included with each entry, because a
 * note that says only "because the horizon is a one-way surface" is unreadable
 * a month later when the question is gone.
 */
export const notebookMarkdown = (entries = readNotebook()) => {
  if (entries.length === 0) {
    return '# Velora notebook\n\nNo answers saved yet.\n';
  }
  const lines = ['# Velora notebook', ''];
  entries.forEach((entry) => {
    const term = termFor(entry.termId);
    lines.push(`## ${entry.date}${term ? ` - ${term.term}` : ''}`);
    lines.push('');
    lines.push(`**Question.** ${entry.prompt}`);
    lines.push('');
    lines.push(entry.text);
    lines.push('');
    if (term) {
      lines.push(`*The dictionary says:* ${term.explanation}`);
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  });
  return lines.join('\n');
};

export const NOTEBOOK_FILENAME = 'velora-notebook.md';
