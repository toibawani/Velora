/**
 * VELORA utility module
 * reviewPlanner
 *
 * The schedule of lessons someone asked to be reminded of, and when each one
 * comes back.
 *
 * Two things changed here, and both were about the schedule claiming less than
 * it knew while doing less than it could.
 *
 * The old version rescheduled every review at exactly seven days, forever. A
 * lesson saved for the first time came due the next day and then returned on
 * the same seven-day beat whether it had been reviewed four times or forty, so
 * the schedule never spread out. The ladder below is the ordinary
 * spaced-repetition shape - a short first step, then wider - stored as an
 * explicit list so the intervals are readable rather than hidden in a
 * multiplication.
 *
 * The old version also stored `difficulty: 'new'` and never changed it, and a
 * `retention` percentage that nothing measured. Neither is written any more.
 * What is stored is `reviews`: how many times the item has actually been
 * reviewed on this device. That is a count of an event, which is why it is
 * allowed to be stored.
 */
import { KEYS, readValue, writeValue } from './storage';

const STORAGE_KEY = KEYS.REVIEWS;
const DAY = 86400000;

/**
 * Days until the next review, indexed by how many reviews have happened.
 *
 * First save: 1 day. After the first review: 3. Then 7, 16, 35. An item that
 * keeps being reviewed stays on the last step rather than growing without
 * bound, because a page that promised a review in 400 days would be promising
 * something nobody can keep.
 */
export const REVIEW_LADDER = [1, 3, 7, 16, 35];

/** The gap, in days, after `reviews` completed reviews. */
export const intervalForStep = (reviews) => {
  const step = Number.isFinite(reviews) && reviews > 0 ? Math.floor(reviews) : 0;
  return REVIEW_LADDER[Math.min(step, REVIEW_LADDER.length - 1)];
};

const DEFAULT_REVIEW_ITEMS = [];

const isValidItem = (item) =>
  item &&
  typeof item === 'object' &&
  typeof item.id === 'string' &&
  typeof item.topic === 'string' &&
  typeof item.subject === 'string' &&
  !Number.isNaN(Date.parse(item.nextReview));

/**
 * A stored item, with the count of reviews defaulted rather than invented.
 *
 * Items written before the ladder existed have no `reviews` field. They are
 * read as zero, which puts them on the first step - the same day-plus-one
 * schedule they were already on - so an older save is not silently accelerated
 * to a 35-day gap it never earned.
 */
const normalise = (item) => ({
  ...item,
  reviews: Number.isFinite(item.reviews) && item.reviews > 0 ? Math.floor(item.reviews) : 0,
});

/** Soonest first. An overdue item is the one someone needs to see. */
const byNextReview = (first, second) =>
  Date.parse(first.nextReview) - Date.parse(second.nextReview);

export const getReviewItems = () => {
  const parsed = readValue(STORAGE_KEY, null);
  if (!Array.isArray(parsed)) return DEFAULT_REVIEW_ITEMS;
  return parsed.filter(isValidItem).map(normalise).sort(byNextReview);
};

export const saveReviewItems = (items) => writeValue(STORAGE_KEY, items) === 'none';

/**
 * When an item is due, and how overdue it is.
 *
 * Returned as data rather than as a sentence so the two screens that show a
 * date - the planner inside a lesson and the revision card on Insights - can
 * word it for their own layout without each re-deriving the arithmetic. `days`
 * is whole days from now: negative means late, 0 means due today.
 */
export const reviewStatus = (item, now = new Date()) => {
  const next = Date.parse(item?.nextReview);
  if (Number.isNaN(next)) return { days: 0, tone: 'later', label: 'Unscheduled' };

  const days = Math.ceil((next - now.getTime()) / DAY);
  if (days < 0) {
    const late = Math.abs(days);
    return { days, tone: 'late', label: late === 1 ? 'A day late' : `${late} days late` };
  }
  if (days === 0) return { days, tone: 'now', label: 'Due today' };
  if (days === 1) return { days, tone: 'soon', label: 'Tomorrow' };
  return { days, tone: 'later', label: `In ${days} days` };
};

/** Everything due today or already late, soonest first. */
export const getDueItems = (now = new Date()) =>
  getReviewItems().filter((item) => reviewStatus(item, now).days <= 0);

/** How many items the schedule is asking for right now. */
export const getDueCount = (now = new Date()) => getDueItems(now).length;

export const addReviewItem = (topic, subject = 'physics') => {
  const id = `${subject}:${topic.id}`;
  const items = getReviewItems();
  if (items.some((item) => item.id === id)) return items;
  const now = new Date();
  const nextItems = [
    {
      id,
      topic: topic.title,
      subject,
      lastReviewed: now.toISOString(),
      nextReview: new Date(now.getTime() + intervalForStep(0) * DAY).toISOString(),
      reviews: 0,
    },
    ...items,
  ].sort(byNextReview);
  saveReviewItems(nextItems);
  return nextItems;
};

export const removeReviewItem = (id) => {
  const nextItems = getReviewItems().filter((item) => item.id !== id);
  saveReviewItems(nextItems);
  return nextItems;
};

/**
 * Records that a review happened and moves the item one step along the ladder.
 *
 * The next date is measured from now, not from the date it was due: reviewing
 * three days late should not immediately make the item due again.
 */
export const completeReviewItem = (id, now = new Date()) => {
  const nextItems = getReviewItems()
    .map((item) => {
      if (item.id !== id) return item;
      const reviews = item.reviews + 1;
      return {
        ...item,
        reviews,
        lastReviewed: now.toISOString(),
        nextReview: new Date(now.getTime() + intervalForStep(reviews) * DAY).toISOString(),
      };
    })
    .sort(byNextReview);
  saveReviewItems(nextItems);
  return nextItems;
};

/**
 * Pushes an item back by a day without counting it as reviewed.
 *
 * "Not today" is a real answer, and without it the only way to silence a due
 * item was to press Review, which falsely told the schedule the lesson had been
 * recalled. Snoozing changes the date and leaves the count alone.
 */
export const snoozeReviewItem = (id, days = 1, now = new Date()) => {
  const shift = Number.isFinite(days) && days > 0 ? Math.floor(days) : 1;
  const nextItems = getReviewItems()
    .map((item) =>
      item.id === id
        ? { ...item, nextReview: new Date(now.getTime() + shift * DAY).toISOString() }
        : item,
    )
    .sort(byNextReview);
  saveReviewItems(nextItems);
  return nextItems;
};

/** "Step 2 of 5" for an item, used to show where it sits on the ladder. */
export const stepLabel = (item) => {
  const step = Math.min((item?.reviews || 0) + 1, REVIEW_LADDER.length);
  return `Step ${step} of ${REVIEW_LADDER.length}`;
};

export default getReviewItems;
