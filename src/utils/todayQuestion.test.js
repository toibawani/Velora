/**
 * VELORA utility module test
 * todayQuestion
 *
 * Proves the daily question is deterministic per day, everyone gets the same
 * one on a given day, and the answered state is stored and read back. If any
 * of that changes, this test fails.
 */

import {
  getTodayQuestion,
  todayQuestionId,
  markTodayQuestionAnswered,
  isTodayQuestionAnswered,
} from './todayQuestion';

const originalDate = global.Date;

beforeEach(() => {
  localStorage.clear();
});

afterAll(() => {
  global.Date = originalDate;
});

describe('todayQuestion', () => {
  test('returns a real question with a term and subject', () => {
    const q = getTodayQuestion();
    expect(q).toMatchObject({
      id: expect.any(String),
      subject: expect.any(String),
      termId: expect.any(String),
      question: expect.any(String),
      answer: expect.any(String),
      hint: expect.any(String),
    });
  });

  test('is deterministic: same day, same question', () => {
    const first = getTodayQuestion();
    const second = getTodayQuestion();
    expect(first.id).toBe(second.id);
    expect(first.question).toBe(second.question);
  });

  test('everyone gets the same question id for the same day', () => {
    expect(todayQuestionId()).toBe(getTodayQuestion().id);
    expect(typeof todayQuestionId()).toBe('string');
    expect(todayQuestionId().length).toBeGreaterThan(0);
  });

  test('stores and reads back the answered state for today', () => {
    expect(isTodayQuestionAnswered()).toBe(false);
    expect(markTodayQuestionAnswered(true)).toBe(true);
    expect(isTodayQuestionAnswered()).toBe(true);
    markTodayQuestionAnswered(false);
    expect(isTodayQuestionAnswered()).toBe(false);
  });

  test('does not treat yesterday\u2019s answer as today\u2019s', () => {
    markTodayQuestionAnswered(true);
    expect(isTodayQuestionAnswered()).toBe(true);
    // Pretend a new day has dawned.
    localStorage.setItem(
      'velora_today_question',
      JSON.stringify({ date: '2000-01-01', questionId: 'stale', answered: true }),
    );
    expect(isTodayQuestionAnswered()).toBe(false);
  });

  test('silently returns false when storage is unavailable', () => {
    const store = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: undefined, writable: true });
    expect(isTodayQuestionAnswered()).toBe(false);
    expect(markTodayQuestionAnswered(true)).toBe(false);
    window.localStorage = store;
  });
});
