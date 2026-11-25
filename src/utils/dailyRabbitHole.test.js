import { KEYS } from './storage';
import {
  DAILY_ENTRIES,
  getDailyRabbitHole,
  dateKey,
  dayNumber,
  readNotebook,
  saveAnswer,
  removeAnswer,
  answerFor,
  notebookMarkdown,
  termFor,
} from './dailyRabbitHole';

/**
 * The daily feature is content plus a promise: same question all day, new one
 * tomorrow, nothing invented, nothing lost without saying so. Each test below
 * is one of those promises.
 */
describe('the daily question', () => {
  test('every entry points at a real dictionary term', () => {
    DAILY_ENTRIES.forEach((entry) => {
      const term = termFor(entry.termId);
      expect({ id: entry.id, found: Boolean(term) }).toEqual({ id: entry.id, found: true });
      expect(term.explanation.length).toBeGreaterThan(80);
      expect(entry.prompt.endsWith('?')).toBe(true);
      expect(entry.lead.length).toBeGreaterThan(20);
      expect(entry.notice.length).toBeGreaterThan(40);
    });
  });

  test('the same day gives the same question', () => {
    const morning = new Date(2026, 10, 25, 7, 30);
    const evening = new Date(2026, 10, 25, 23, 59);
    expect(getDailyRabbitHole(morning).id).toBe(getDailyRabbitHole(evening).id);
  });

  test('tomorrow gives a different question', () => {
    const today = new Date(2026, 10, 25);
    const tomorrow = new Date(2026, 10, 26);
    expect(getDailyRabbitHole(today).id).not.toBe(getDailyRabbitHole(tomorrow).id);
  });

  test('the day number does not skip or repeat across a clock change', () => {
    // Late March and late October are when most clocks change. Whatever the
    // local offset does, consecutive local days must differ by exactly one.
    const spring = new Date(2026, 2, 29);
    const next = new Date(2026, 2, 30);
    expect(dayNumber(next) - dayNumber(spring)).toBe(1);
    const autumn = new Date(2026, 9, 25);
    const afterAutumn = new Date(2026, 9, 26);
    expect(dayNumber(afterAutumn) - dayNumber(autumn)).toBe(1);
  });

  test('the round trip covers every entry once', () => {
    const start = new Date(2026, 0, 1);
    const seen = new Set();
    for (let index = 0; index < DAILY_ENTRIES.length; index += 1) {
      const day = new Date(start.getTime());
      day.setDate(start.getDate() + index);
      seen.add(getDailyRabbitHole(day).id);
    }
    expect(seen.size).toBe(DAILY_ENTRIES.length);
  });

  test('carries the dictionary term and the local date', () => {
    const day = new Date(2026, 10, 25);
    const daily = getDailyRabbitHole(day);
    expect(daily.date).toBe('2026-11-25');
    expect(daily.term.id).toBe(daily.termId);
    expect(daily.term.explanation).toBeTruthy();
  });
});

describe('the notebook', () => {
  beforeEach(() => localStorage.clear());

  test('starts empty and says so in Markdown', () => {
    expect(readNotebook()).toEqual([]);
    expect(notebookMarkdown([])).toContain('No answers saved yet.');
  });

  test('saves one answer per day and returns it newest first', () => {
    expect(saveAnswer({
      date: '2026-11-24', entryId: 'a', prompt: 'First?', termId: 'event-horizon', text: '  in my words  ',
    })).toBe('none');
    saveAnswer({
      date: '2026-11-25', entryId: 'b', prompt: 'Second?', termId: 'entropy-phys', text: 'second answer',
    });

    const notebook = readNotebook();
    expect(notebook).toHaveLength(2);
    expect(notebook[0].date).toBe('2026-11-25');
    expect(notebook[1].text).toBe('in my words');
  });

  test('a second answer for the same day replaces the first', () => {
    saveAnswer({ date: '2026-11-25', entryId: 'a', prompt: 'Q?', termId: 'event-horizon', text: 'first try' });
    saveAnswer({ date: '2026-11-25', entryId: 'a', prompt: 'Q?', termId: 'event-horizon', text: 'corrected' });

    const notebook = readNotebook();
    expect(notebook).toHaveLength(1);
    expect(notebook[0].text).toBe('corrected');
  });

  test('refuses an empty answer rather than saving a blank entry', () => {
    expect(saveAnswer({ date: '2026-11-25', entryId: 'a', prompt: 'Q?', termId: 'x', text: '   ' })).toBe('failed');
    expect(readNotebook()).toEqual([]);
  });

  test('finds the answer for one day and can delete it', () => {
    saveAnswer({ date: dateKey(), entryId: 'a', prompt: 'Q?', termId: 'event-horizon', text: 'mine' });
    expect(answerFor(dateKey()).text).toBe('mine');

    removeAnswer(dateKey());
    expect(answerFor(dateKey())).toBeNull();
  });

  test('Markdown carries the question, the answer and the dictionary text', () => {
    saveAnswer({
      date: '2026-11-25',
      entryId: 'edge-of-a-black-hole',
      prompt: 'Where does it begin?',
      termId: 'event-horizon',
      text: 'At the last line you could still turn back.',
    });
    const markdown = notebookMarkdown();
    expect(markdown).toContain('# Velora notebook');
    expect(markdown).toContain('## 2026-11-25 - Event Horizon');
    expect(markdown).toContain('**Question.** Where does it begin?');
    expect(markdown).toContain('At the last line you could still turn back.');
    expect(markdown).toContain('*The dictionary says:*');
  });

  test('writes through the versioned registry, not a raw key', () => {
    saveAnswer({ date: '2026-11-25', entryId: 'a', prompt: 'Q?', termId: 'event-horizon', text: 'answer' });
    const raw = localStorage.getItem(KEYS.RABBIT_HOLE_NOTEBOOK);
    expect(JSON.parse(raw)).toHaveProperty('v', 1);
  });

  test('a corrupted notebook reads as empty instead of crashing the screen', () => {
    localStorage.setItem(KEYS.RABBIT_HOLE_NOTEBOOK, '{"v":1,"data":"not a list"}');
    expect(readNotebook()).toEqual([]);
  });
});
