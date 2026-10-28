/**
 * VELORA utility module
 * resumePath
 *
 * "Pick up where you left off": remembers the last lesson opened, and how far
 * down it got, so the atlas can offer a one-tap resume and the reader can be
 * put back at the paragraph it was on.
 *
 * Stored as { subject, topicId, topicTitle, openedAt, percent, progressAt } on
 * this device and nowhere else. `percent` is optional: a record written before
 * progress was tracked, or a lesson that was only just opened, has no position,
 * and the resume card says so rather than inventing 0%.
 *
 * The key comes from utils/storage.js like every other key, and the payload
 * goes through the registry's writeValue. This module used to spell the raw key
 * and call setItem itself, which meant the registry's list of keys was missing
 * the one the resume card depends on and a refused write looked like a save.
 */

import { KEYS, FAILURE, readValue, removeValue, writeValue } from './storage';

const LAST_LESSON_KEY = KEYS.LAST_LESSON;

/** Below this, the reader has not really started: a resume there is a reload. */
export const RESUME_MIN_PERCENT = 5;

/** Above this, the lesson is effectively read; a resume would go to the end. */
export const RESUME_COMPLETE_PERCENT = 95;

/** A whole number 0–100, or null when the value is not a position at all. */
const normalisePercent = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.min(100, Math.max(0, Math.round(number)));
};

const isLesson = (value) =>
  value !== null &&
  typeof value === 'object' &&
  typeof value.subject === 'string' &&
  typeof value.topicId === 'string' &&
  value.subject !== '' &&
  value.topicId !== '';

export const saveLastLesson = (subject, topicId, topicTitle) => {
  if (!subject || !topicId) return true; // Nothing to remember; not an error.

  // The position belongs to the lesson it was recorded in, so opening a
  // different one starts without a percent rather than carrying the old one
  // into a page it never described.
  const result = writeValue(LAST_LESSON_KEY, {
    subject,
    topicId,
    topicTitle,
    openedAt: Date.now(),
    percent: null,
    progressAt: null,
  });
  return result === FAILURE.NONE;
};

export const getLastLesson = () => {
  const parsed = readValue(LAST_LESSON_KEY, null);
  if (!isLesson(parsed)) return null;
  return {
    ...parsed,
    percent: normalisePercent(parsed.percent),
    progressAt: Number.isFinite(parsed.progressAt) ? parsed.progressAt : null,
  };
};

/**
 * Records how far down the open lesson someone has read.
 *
 * Only the lesson that is actually open can be annotated: a late scroll event
 * from a page someone has already left must not stamp its position onto the
 * next lesson, and the subject/topic check is what prevents that.
 */
export const saveLessonProgress = (subject, topicId, percent) => {
  const current = getLastLesson();
  if (!current || current.subject !== subject || current.topicId !== topicId) return false;

  const position = normalisePercent(percent);
  if (position === null) return false;

  const result = writeValue(LAST_LESSON_KEY, {
    ...current,
    percent: position,
    progressAt: Date.now(),
  });
  return result === FAILURE.NONE;
};

/** How far through a lesson someone got, or null if no position was recorded. */
export const getLessonProgress = (subject, topicId) => {
  const current = getLastLesson();
  if (!current) return null;
  if (subject && current.subject !== subject) return null;
  if (topicId && current.topicId !== topicId) return null;
  return current.percent;
};

/**
 * Whether a recorded position is worth offering as a resume.
 *
 * Five percent is about a paragraph; below that "pick up where you left off"
 * would scroll to where the page already is. Ninety-five is the other end: the
 * lesson has been read, and resuming there would drop the reader at the
 * references rather than at anything left to read.
 */
export const shouldOfferResume = (percent) => {
  const position = normalisePercent(percent);
  if (position === null) return false;
  return position >= RESUME_MIN_PERCENT && position < RESUME_COMPLETE_PERCENT;
};

export const clearLastLesson = () => removeValue(LAST_LESSON_KEY);

const resumePath = {
  saveLastLesson,
  getLastLesson,
  clearLastLesson,
  saveLessonProgress,
  getLessonProgress,
  shouldOfferResume,
};

export default resumePath;
