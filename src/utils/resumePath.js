/**
 * VELORA utility module
 * resumePath
 *
 * "Pick up where you left off": remembers the last lesson opened so the atlas
 * can offer a one-tap resume. Stored as
 * { subject, topicId, topicTitle, openedAt } in localStorage; nothing leaves
 * the device.
 *
 * The key comes from utils/storage.js like every other key. This module used to
 * spell the raw key itself, which meant the registry's list of keys was missing
 * the one the resume card depends on: a rename in storage.js would have
 * silently orphaned every saved lesson.
 */

import { KEYS } from './storage';

const LAST_LESSON_KEY = KEYS.LAST_LESSON;

export const saveLastLesson = (subject, topicId, topicTitle) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const now = Date.now();
    window.localStorage.setItem(
      LAST_LESSON_KEY,
      JSON.stringify({ subject, topicId, topicTitle, openedAt: now }),
    );
    return true;
  } catch {
    return false;
  }
};

export const getLastLesson = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(LAST_LESSON_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.subject || !parsed.topicId) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearLastLesson = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.removeItem(LAST_LESSON_KEY);
    return true;
  } catch {
    return false;
  }
};

const resumePath = { saveLastLesson, getLastLesson, clearLastLesson };

export default resumePath;
