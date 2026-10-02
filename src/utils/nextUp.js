import { KEYS, readValue, writeValue, FAILURE } from './storage';

/**
 * Next up: a short list of things to come back to.
 *
 * This is scoped to learning on purpose. A general todo app would take due
 * dates, priorities, subtasks, projects, recurring items and reminders, and
 * every one of those needs a backend to be worth anything: a due date on
 * something in one browser cannot fire while the tab is closed, and a
 * "remind me" button would be a control wired to nothing. So this holds one
 * thing: something you noticed while reading and want to look at again. "Read
 * up on Hawking radiation", "find the primary source for that Nietzsche
 * quote".
 *
 * It sits next to the question desk rather than replacing it, and the
 * difference is worth being clear about. A question is something you do not
 * understand and have written down to think about. An item here is something
 * you understood well enough to want more of, and have parked. They are
 * different acts, so they are different lists.
 *
 * Stored shape: [{ id, text, subject, topicId, done, createdAt, doneAt }]
 * where subject and topicId are optional and may be null.
 */

const STORAGE_KEY = KEYS.TASKS;

/** How long a note may be. Long enough for a sentence, short enough to read. */
const MAX_LENGTH = 200;
const MIN_LENGTH = 3;

// Date.now() alone collides when two items are created in the same
// millisecond, which happens as soon as two are typed back to back and a
// shared id would make removeItem delete more than the one it was handed.
let sequence = 0;
const nextId = () => `t-${Date.now()}-${sequence++}`;

const isList = (value) => Array.isArray(value);

const isValidItem = (item) =>
  item &&
  typeof item === 'object' &&
  typeof item.text === 'string' &&
  item.text.trim().length >= MIN_LENGTH &&
  item.text.length <= MAX_LENGTH;

/** Drops anything malformed rather than letting one bad row render. */
const validItems = (value) => (isList(value) ? value.filter(isValidItem) : []);

export const getTasks = () => validItems(readValue(STORAGE_KEY, []));

/** Open items first, then done ones, each group oldest first. */
const byUrgency = (first, second) => {
  if (first.done !== second.done) return first.done ? 1 : -1;
  return String(first.createdAt).localeCompare(String(second.createdAt));
};

export const getOpenTasks = () => getTasks().filter((item) => !item.done).sort(byUrgency);
export const getDoneTasks = () => getTasks().filter((item) => item.done).sort(byUrgency);

/** FAILURE.NONE, or why the last write did not land. The UI reads this. */
let lastWriteResult = FAILURE.NONE;

export const getLastWriteResult = () => lastWriteResult;

const write = (items) => {
  // Storage full or blocked. The list still lives in component state for this
  // visit, which is honest for one sitting, rather than claiming it was kept.
  // Recording the reason is what lets the screen say so out loud.
  lastWriteResult = writeValue(STORAGE_KEY, items);
  return items;
};

/**
 * Adds an item, and reports whether the write landed.
 *
 * The text is trimmed and length-checked here rather than only in the form, so
 * a blank row cannot be stored by any caller, and an over-long one is rejected
 * before it takes up space in a browser that may already be near its quota.
 */
export const addTask = ({ text, subject = null, topicId = null }) => {
  const trimmed = String(text || '').trim();
  // Both limits, not just the minimum. The validator above drops anything over
  // MAX_LENGTH, so storing one and then reading it back would mean an item the
  // screen had just added silently disappears on the next render - the write
  // reports success and the list comes back without it.
  if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
    return { tasks: getTasks(), result: FAILURE.FAILED };
  }

  const tasks = [
    {
      id: nextId(),
      text: trimmed,
      subject: typeof subject === 'string' && subject !== '' ? subject : null,
      topicId: typeof topicId === 'string' && topicId !== '' ? topicId : null,
      done: false,
      createdAt: new Date().toISOString(),
      doneAt: null,
    },
    ...getTasks(),
  ];

  return { tasks: write(tasks), result: lastWriteResult };
};

const setDone = (taskId, done) => {
  const tasks = getTasks().map((item) =>
    item.id === taskId
      ? { ...item, done, doneAt: done ? new Date().toISOString() : null }
      : item
  );
  return write(tasks);
};

export const completeTask = (taskId) => setDone(taskId, true);
export const reopenTask = (taskId) => setDone(taskId, false);

export const removeTask = (taskId) => write(getTasks().filter((item) => item.id !== taskId));

/** Removes everything. Separate from removeTask so the screen can say so. */
export const clearCompleted = () => write(getTasks().filter((item) => !item.done));

export { MAX_LENGTH, MIN_LENGTH };
