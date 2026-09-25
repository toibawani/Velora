const STORAGE_KEY = 'velora_reviews';
const DAY = 86400000;

const DEFAULT_REVIEW_ITEMS = [];

const isValidItem = (item) => item && typeof item.id === 'string' && typeof item.topic === 'string' && typeof item.subject === 'string' && !Number.isNaN(Date.parse(item.nextReview));

export const getReviewItems = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(parsed)) return parsed.filter(isValidItem).map((item) => ({ ...item, retention: Math.max(0, Math.min(100, Number(item.retention) || 0)) }));
  } catch {
    // A damaged local cache should never prevent a learner from opening a lesson.
  }
  return DEFAULT_REVIEW_ITEMS;
};

export const saveReviewItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
};

export const addReviewItem = (topic, subject = 'physics') => {
  const id = `${subject}:${topic.id}`;
  const items = getReviewItems();
  if (items.some((item) => item.id === id)) return items;
  const now = new Date();
  const nextItems = [{ id, topic: topic.title, subject, lastReviewed: now.toISOString(), nextReview: new Date(now.getTime() + DAY).toISOString(), difficulty: 'new', retention: 72 }, ...items];
  saveReviewItems(nextItems);
  return nextItems;
};

export const removeReviewItem = (id) => {
  const nextItems = getReviewItems().filter((item) => item.id !== id);
  saveReviewItems(nextItems);
  return nextItems;
};

export const completeReviewItem = (id) => {
  const nextItems = getReviewItems().map((item) => item.id === id ? { ...item, lastReviewed: new Date().toISOString(), nextReview: new Date(Date.now() + 7 * DAY).toISOString(), retention: Math.min(100, (Number(item.retention) || 0) + 10) } : item);
  saveReviewItems(nextItems);
  return nextItems;
};
