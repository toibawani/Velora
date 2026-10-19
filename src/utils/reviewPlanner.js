/**
 * VELORA utility module
 * reviewPlanner
 */
import { KEYS, readValue, writeValue } from './storage';

const STORAGE_KEY = KEYS.REVIEWS;
const DAY = 86400000;

const DEFAULT_REVIEW_ITEMS = [];

const isValidItem = (item) => item && typeof item.id === 'string' && typeof item.topic === 'string' && typeof item.subject === 'string' && !Number.isNaN(Date.parse(item.nextReview));

// No retention percentage is stored or returned. A previous version wrote a
// starting value of 72 and added 10 on every "review", which produced a number
// nothing had measured and then displayed it as "% retained". The schedule is
// real (a saved lesson and a date); the recall estimate was decoration.
export const getReviewItems = () => {
  const parsed = readValue(STORAGE_KEY, null);
  if (Array.isArray(parsed)) return parsed.filter(isValidItem);
  return DEFAULT_REVIEW_ITEMS;
};

export const saveReviewItems = (items) => {
  return writeValue(STORAGE_KEY, items) === 'none';
};

export const addReviewItem = (topic, subject = 'physics') => {
  const id = `${subject}:${topic.id}`;
  const items = getReviewItems();
  if (items.some((item) => item.id === id)) return items;
  const now = new Date();
  const nextItems = [{ id, topic: topic.title, subject, lastReviewed: now.toISOString(), nextReview: new Date(now.getTime() + DAY).toISOString(), difficulty: 'new' }, ...items];
  saveReviewItems(nextItems);
  return nextItems;
};

export const removeReviewItem = (id) => {
  const nextItems = getReviewItems().filter((item) => item.id !== id);
  saveReviewItems(nextItems);
  return nextItems;
};

export const completeReviewItem = (id) => {
  const nextItems = getReviewItems().map((item) => item.id === id ? { ...item, lastReviewed: new Date().toISOString(), nextReview: new Date(Date.now() + 7 * DAY).toISOString() } : item);
  saveReviewItems(nextItems);
  return nextItems;
};
