import { getReviewItems, saveReviewItems, addReviewItem, removeReviewItem, completeReviewItem } from './reviewPlanner';

describe('review planner storage', () => {
  beforeEach(() => localStorage.clear());

  test('recovers an empty schedule when stored JSON is invalid', () => {
    localStorage.setItem('velora_reviews', '{not-json');
    expect(getReviewItems()).toEqual([]);
  });

  test('adds, completes, and removes a saved lesson', () => {
    saveReviewItems([]);
    const topic = { id: 'stoicism', title: 'Stoicism' };
    const added = addReviewItem(topic, 'philosophy');
    expect(added).toHaveLength(1);
    expect(added[0].id).toBe('philosophy:stoicism');

    const completed = completeReviewItem(added[0].id);
    expect(completed[0].retention).toBe(82);
    expect(new Date(completed[0].nextReview).getTime()).toBeGreaterThan(Date.now());

    expect(removeReviewItem(added[0].id)).toHaveLength(0);
  });
});
