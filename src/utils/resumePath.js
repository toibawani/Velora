/**
 * VELORA utility module
 * resumePath
 *
 * "Pick up where you left off": remembers the last lesson opened so the atlas
 * can offer a one-tap resume. Stored as
 * { subject, topicId, topicTitle, openedAt } in localStorage; nothing leaves
 * the device.
 */

export const saveLastLesson = (subject, topicId, topicTitle) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const now = Date.now();
    window.localStorage.setItem(
      'velora_last_lesson',
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
    const raw = window.localStorage.getItem('velora_last_lesson');
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
    window.localStorage.removeItem('velora_last_lesson');
    return true;
  } catch {
    return false;
  }
};

const resumePath = { saveLastLesson, getLastLesson, clearLastLesson };

export default resumePath;
