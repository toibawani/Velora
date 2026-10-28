/**
 * VELORA utility module test
 * resumePath
 *
 * Proves the last lesson is stored, read back, and cleared, and that a reading
 * position belongs to the lesson it was recorded in. If the resume path stops
 * remembering, this test fails.
 */

import {
  RESUME_COMPLETE_PERCENT,
  RESUME_MIN_PERCENT,
  saveLastLesson,
  getLastLesson,
  clearLastLesson,
  saveLessonProgress,
  getLessonProgress,
  shouldOfferResume,
} from './resumePath';
import { KEYS } from './storage';

beforeEach(() => {
  localStorage.clear();
});

describe('resumePath', () => {
  test('starts with nothing to resume', () => {
    expect(getLastLesson()).toBeNull();
  });

  test('saves and reads back the last lesson', () => {
    expect(saveLastLesson('physics', 'black-holes', 'Black Holes')).toBe(true);
    const lesson = getLastLesson();
    expect(lesson).toMatchObject({
      subject: 'physics',
      topicId: 'black-holes',
      topicTitle: 'Black Holes',
    });
    expect(typeof lesson.openedAt).toBe('number');
  });

  test('goes through the versioned registry rather than a bare key', () => {
    saveLastLesson('physics', 'black-holes', 'Black Holes');
    const raw = JSON.parse(window.localStorage.getItem(KEYS.LAST_LESSON));
    expect(raw.v).toBe(1);
    expect(raw.data.topicId).toBe('black-holes');
  });

  test('overwrites the previous lesson with the newest', () => {
    saveLastLesson('physics', 'black-holes', 'Black Holes');
    saveLastLesson('philosophy', 'platos-cave', "Plato's Cave");
    expect(getLastLesson().topicId).toBe('platos-cave');
    expect(getLastLesson().subject).toBe('philosophy');
  });

  test('clears the saved lesson', () => {
    saveLastLesson('physics', 'black-holes', 'Black Holes');
    expect(getLastLesson()).not.toBeNull();
    expect(clearLastLesson()).toBe(true);
    expect(getLastLesson()).toBeNull();
  });

  test('rejects incomplete lessons', () => {
    expect(saveLastLesson('physics', '', 'Black Holes')).toBe(true);
    expect(getLastLesson()).toBeNull();
  });

  test('reads a record written before progress was tracked', () => {
    window.localStorage.setItem(
      KEYS.LAST_LESSON,
      JSON.stringify({ subject: 'physics', topicId: 'black-holes', topicTitle: 'Black Holes', openedAt: 1 }),
    );
    const lesson = getLastLesson();
    expect(lesson).toMatchObject({ topicId: 'black-holes', percent: null });
  });

  test('silently returns null when storage is unavailable', () => {
    const store = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: undefined, writable: true });
    expect(saveLastLesson('physics', 'black-holes', 'Black Holes')).toBe(false);
    expect(getLastLesson()).toBeNull();
    expect(clearLastLesson()).toBe(false);
    window.localStorage = store;
  });
});

describe('reading position', () => {
  beforeEach(() => {
    localStorage.clear();
    saveLastLesson('physics', 'black-holes', 'Black Holes');
  });

  test('a newly opened lesson has no position to resume', () => {
    expect(getLessonProgress('physics', 'black-holes')).toBeNull();
  });

  test('records a position for the lesson that is open', () => {
    expect(saveLessonProgress('physics', 'black-holes', 42)).toBe(true);
    expect(getLessonProgress('physics', 'black-holes')).toBe(42);
  });

  test('will not stamp a position onto a different lesson', () => {
    // A scroll event arriving after the reader has moved on belongs to the page
    // it came from, not to the one now open.
    expect(saveLessonProgress('philosophy', 'platos-cave', 80)).toBe(false);
    expect(getLessonProgress('physics', 'black-holes')).toBeNull();
  });

  test('rounds and clamps a position rather than storing nonsense', () => {
    saveLessonProgress('physics', 'black-holes', 41.6);
    expect(getLessonProgress('physics', 'black-holes')).toBe(42);

    saveLessonProgress('physics', 'black-holes', 120);
    expect(getLessonProgress('physics', 'black-holes')).toBe(100);

    saveLessonProgress('physics', 'black-holes', -20);
    expect(getLessonProgress('physics', 'black-holes')).toBe(0);
  });

  test('refuses a position that is not a number', () => {
    expect(saveLessonProgress('physics', 'black-holes', 'halfway')).toBe(false);
    expect(getLessonProgress('physics', 'black-holes')).toBeNull();
  });

  test('a 0% position is a real position, not an absence', () => {
    saveLessonProgress('physics', 'black-holes', 0);
    expect(getLessonProgress('physics', 'black-holes')).toBe(0);
  });

  test('only offers to resume between a paragraph in and almost finished', () => {
    expect(shouldOfferResume(null)).toBe(false);
    expect(shouldOfferResume(0)).toBe(false);
    expect(shouldOfferResume(RESUME_MIN_PERCENT - 1)).toBe(false);
    expect(shouldOfferResume(RESUME_MIN_PERCENT)).toBe(true);
    expect(shouldOfferResume(50)).toBe(true);
    expect(shouldOfferResume(RESUME_COMPLETE_PERCENT - 1)).toBe(true);
    expect(shouldOfferResume(RESUME_COMPLETE_PERCENT)).toBe(false);
    expect(shouldOfferResume(100)).toBe(false);
  });

  test('the progress is scoped to the lesson it names', () => {
    saveLessonProgress('physics', 'black-holes', 60);
    expect(getLessonProgress('philosophy', 'platos-cave')).toBeNull();
    expect(getLessonProgress()).toBe(60);
  });
});
