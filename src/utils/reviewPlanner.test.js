import {
  REVIEW_LADDER,
  getReviewItems,
  saveReviewItems,
  addReviewItem,
  removeReviewItem,
  completeReviewItem,
  snoozeReviewItem,
  intervalForStep,
  reviewStatus,
  getDueItems,
  getDueCount,
  stepLabel,
} from './reviewPlanner';

const DAY = 86400000;
const topic = { id: 'stoicism', title: 'Stoicism' };
const daysFromNow = (iso) => Math.round((Date.parse(iso) - Date.now()) / DAY);

describe('review planner storage', () => {
  beforeEach(() => localStorage.clear());

  test('recovers an empty schedule when stored JSON is invalid', () => {
    localStorage.setItem('velora_reviews', '{not-json');
    expect(getReviewItems()).toEqual([]);
  });

  test('adds, completes, and removes a saved lesson', () => {
    saveReviewItems([]);
    const added = addReviewItem(topic, 'philosophy');
    expect(added).toHaveLength(1);
    expect(added[0].id).toBe('philosophy:stoicism');

    const completed = completeReviewItem(added[0].id);
    expect(completed[0].retention).toBeUndefined();
    expect(new Date(completed[0].nextReview).getTime()).toBeGreaterThan(Date.now());

    expect(removeReviewItem(added[0].id)).toHaveLength(0);
  });

  test('no longer stores a difficulty or a retention figure nothing measured', () => {
    const [item] = addReviewItem(topic, 'philosophy');
    expect(item.difficulty).toBeUndefined();
    expect(item.retention).toBeUndefined();
    expect(item.reviews).toBe(0);
  });
});

describe('the review ladder', () => {
  beforeEach(() => localStorage.clear());

  test('widens the gap with every review instead of returning in a flat week', () => {
    addReviewItem(topic, 'philosophy');
    const id = 'philosophy:stoicism';

    const gaps = [];
    for (let i = 0; i < REVIEW_LADDER.length; i += 1) {
      const [item] = completeReviewItem(id);
      gaps.push(daysFromNow(item.nextReview));
    }

    expect(gaps).toEqual(REVIEW_LADDER.slice(1).concat(REVIEW_LADDER[REVIEW_LADDER.length - 1]));
    // The old behaviour was seven days every time; the ladder has to leave it.
    expect(new Set(gaps).size).toBeGreaterThan(1);
  });

  test('keeps the longest interval rather than growing without bound', () => {
    expect(intervalForStep(99)).toBe(REVIEW_LADDER[REVIEW_LADDER.length - 1]);
  });

  test('counts the reviews a lesson has actually had', () => {
    addReviewItem(topic, 'philosophy');
    completeReviewItem('philosophy:stoicism');
    const [item] = completeReviewItem('philosophy:stoicism');
    expect(item.reviews).toBe(2);
    expect(getReviewItems()[0].reviews).toBe(2);
  });

  test('reads a pre-ladder item as never reviewed, keeping its own date', () => {
    const legacyDate = new Date(Date.now() + 2 * DAY).toISOString();
    localStorage.setItem(
      'velora_reviews',
      JSON.stringify([
        { id: 'philosophy:stoicism', topic: 'Stoicism', subject: 'philosophy', nextReview: legacyDate, difficulty: 'new' },
      ]),
    );

    const [item] = getReviewItems();
    expect(item.reviews).toBe(0);
    expect(item.nextReview).toBe(legacyDate);
    expect(item.difficulty).toBe('new');
  });

  test('names the step an item is on', () => {
    expect(stepLabel({ reviews: 0 })).toBe(`Step 1 of ${REVIEW_LADDER.length}`);
    expect(stepLabel({ reviews: 3 })).toBe(`Step 4 of ${REVIEW_LADDER.length}`);
    expect(stepLabel({ reviews: 40 })).toBe(`Step ${REVIEW_LADDER.length} of ${REVIEW_LADDER.length}`);
  });
});

describe('when a review is due', () => {
  beforeEach(() => localStorage.clear());

  const withDue = (offsetDays, reviews = 0) => {
    localStorage.setItem(
      'velora_reviews',
      JSON.stringify([
        {
          id: 'philosophy:stoicism',
          topic: 'Stoicism',
          subject: 'philosophy',
          reviews,
          nextReview: new Date(Date.now() + offsetDays * DAY).toISOString(),
        },
      ]),
    );
  };

  test('counts an item due today and one that is late, but not tomorrow’s', () => {
    withDue(0);
    expect(getDueCount()).toBe(1);

    withDue(-5);
    expect(getDueCount()).toBe(1);

    withDue(3);
    expect(getDueCount()).toBe(0);
    expect(getDueItems()).toEqual([]);
  });

  test('reports lateness rather than a negative countdown', () => {
    expect(reviewStatus({ nextReview: new Date(Date.now() - 2 * DAY).toISOString() })).toEqual({
      days: -2,
      tone: 'late',
      label: '2 days late',
    });
    expect(reviewStatus({ nextReview: new Date().toISOString() }).label).toBe('Due today');
    expect(reviewStatus({ nextReview: new Date(Date.now() + DAY).toISOString() }).label).toBe('Tomorrow');
  });

  test('sorts the soonest review first, however it was saved', () => {
    localStorage.setItem(
      'velora_reviews',
      JSON.stringify([
        { id: 'a:a', topic: 'A', subject: 'a', nextReview: new Date(Date.now() + 9 * DAY).toISOString() },
        { id: 'b:b', topic: 'B', subject: 'b', nextReview: new Date(Date.now() + DAY).toISOString() },
      ]),
    );
    expect(getReviewItems().map((item) => item.id)).toEqual(['b:b', 'a:a']);
  });

  test('snoozing moves the date without claiming a review happened', () => {
    withDue(0, 1);
    const [item] = snoozeReviewItem('philosophy:stoicism', 2);
    expect(daysFromNow(item.nextReview)).toBe(2);
    expect(item.reviews).toBe(1);
    expect(getDueCount()).toBe(0);
  });

  test('snoozing a missing item changes nothing', () => {
    withDue(0);
    const items = snoozeReviewItem('philosophy:not-real');
    expect(items).toHaveLength(1);
    expect(getDueCount()).toBe(1);
  });
});
