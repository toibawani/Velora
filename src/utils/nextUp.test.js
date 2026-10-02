import {
  addTask,
  clearCompleted,
  completeTask,
  getDoneTasks,
  getLastWriteResult,
  getOpenTasks,
  getTasks,
  MAX_LENGTH,
  MIN_LENGTH,
  removeTask,
  reopenTask,
} from './nextUp';
import { FAILURE, KEYS, readValue } from './storage';

beforeEach(() => {
  localStorage.clear();
});

const stored = () => readValue(KEYS.TASKS, null);

describe('next up', () => {
  test('starts empty rather than inventing something to show', () => {
    expect(getTasks()).toEqual([]);
    expect(getOpenTasks()).toEqual([]);
  });

  test('adds an item and stores it through the versioned registry', () => {
    const { result } = addTask({ text: 'Look into Hawking radiation properly' });

    expect(result).toBe(FAILURE.NONE);
    const list = getTasks();
    expect(list).toHaveLength(1);
    expect(list[0].text).toBe('Look into Hawking radiation properly');
    // Same envelope every other key uses, so a payload from an older build is
    // readable rather than unparseable.
    expect(stored()).toEqual([
      {
        id: expect.any(String),
        text: 'Look into Hawking radiation properly',
        subject: null,
        topicId: null,
        done: false,
        createdAt: expect.any(String),
        doneAt: null,
      },
    ]);
  });

  test('refuses an item too short to mean anything', () => {
    const { result, tasks } = addTask({ text: '  a  ' });
    expect(result).toBe(FAILURE.FAILED);
    expect(tasks).toEqual([]);
    expect(getTasks()).toEqual([]);
  });

  test('refuses an over-long item rather than filling the quota', () => {
    const { result } = addTask({ text: 'x'.repeat(MAX_LENGTH + 1) });
    expect(result).toBe(FAILURE.FAILED);
    expect(getTasks()).toEqual([]);
  });

  test('accepts an item at exactly the limits', () => {
    expect(addTask({ text: 'abc' }).result).toBe(FAILURE.NONE);
    expect(addTask({ text: 'x'.repeat(MAX_LENGTH) }).result).toBe(FAILURE.NONE);
  });

  test('gives two items added together distinct ids', () => {
    // Date.now() alone collides when two land in the same millisecond, which is
    // what happens when they are typed back to back. A shared id would make
    // removeTask delete both.
    const first = addTask({ text: 'First thing to look at' }).tasks[0];
    const second = addTask({ text: 'Second thing to look at' }).tasks[0];
    expect(first.id).not.toBe(second.id);

    removeTask(first.id);
    expect(getTasks()).toHaveLength(1);
    expect(getTasks()[0].id).toBe(second.id);
  });

  test('moving an item to done records when, and reopening clears it', () => {
    const { id } = addTask({ text: 'Find that primary source' }).tasks[0];

    completeTask(id);
    const [done] = getDoneTasks();
    expect(done.done).toBe(true);
    expect(done.doneAt).toEqual(expect.any(String));

    reopenTask(id);
    expect(getOpenTasks()).toHaveLength(1);
    // Left set, a reopened item would claim to have been finished at a time it
    // was not.
    expect(getTasks()[0].doneAt).toBeNull();
  });

  test('open items come before done ones', () => {
    const a = addTask({ text: 'Already handled this one' }).tasks[0];
    const b = addTask({ text: 'Still want to look at' }).tasks[0];
    completeTask(a.id);

    expect(getOpenTasks().map((item) => item.id)).toEqual([b.id]);
    expect(getDoneTasks().map((item) => item.id)).toEqual([a.id]);
  });

  test('removing one item leaves the others alone', () => {
    const a = addTask({ text: 'First one to remove' }).tasks[0];
    const b = addTask({ text: 'Second one to keep' }).tasks[0];

    removeTask(a.id);

    expect(getTasks().map((item) => item.id)).toEqual([b.id]);
  });

  test('clearing the done items leaves the open ones alone', () => {
    const a = addTask({ text: 'Finished and cleared away' }).tasks[0];
    const b = addTask({ text: 'Still open and kept' }).tasks[0];
    completeTask(a.id);

    clearCompleted();

    expect(getTasks().map((item) => item.id)).toEqual([b.id]);
  });

  test('reports a refused write instead of returning a list as if it saved', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied');
    });

    const { result } = addTask({ text: 'This will not be stored' });

    // The whole reason the result is returned. A caller that ignored it would
    // show the item and imply it was kept.
    expect(result).toBe(FAILURE.FAILED);
    expect(getLastWriteResult()).toBe(FAILURE.FAILED);
    setItem.mockRestore();
  });

  test('reports quota exhaustion rather than a generic failure', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });

    expect(addTask({ text: 'Too much for this browser' }).result).toBe(FAILURE.QUOTA);
    setItem.mockRestore();
  });

  test('reports a successful write, so the screen can clear a stale warning', () => {
    addTask({ text: 'A thing worth storing' });
    expect(getLastWriteResult()).toBe(FAILURE.NONE);
  });

  test('drops a malformed stored row rather than rendering it', () => {
    localStorage.setItem(
      KEYS.TASKS,
      JSON.stringify({ v: 1, data: [{ id: 'ok', text: 'A real stored item' }, { id: 'bad' }, null, 'nope'] })
    );

    // One good row survives. A blank or malformed one is not rendered as an
    // empty card, which is how a list ends up showing four items with two of
    // them invisible.
    expect(getTasks()).toHaveLength(1);
    expect(getTasks()[0].text).toBe('A real stored item');
  });

  test('reads nothing rather than throwing when storage is corrupt', () => {
    localStorage.setItem(KEYS.TASKS, '{not json at all');
    expect(getTasks()).toEqual([]);
    expect(getOpenTasks()).toEqual([]);
  });

  test('survives a storage write of a non-array', () => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify({ v: 1, data: { nope: true } }));
    expect(getTasks()).toEqual([]);
  });
});
