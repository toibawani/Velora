/**
 * VELORA utility module test
 * resumePath
 *
 * Proves the last lesson is stored, read back, and cleared. If the resume
 * path stops remembering, this test fails.
 */

import { saveLastLesson, getLastLesson, clearLastLesson } from './resumePath';

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

  test('silently returns null when storage is unavailable', () => {
    const store = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: undefined, writable: true });
    expect(saveLastLesson('physics', 'black-holes', 'Black Holes')).toBe(false);
    expect(getLastLesson()).toBeNull();
    expect(clearLastLesson()).toBe(false);
    window.localStorage = store;
  });
});
