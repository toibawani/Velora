import { getRevisionSchedule, calculateOverallRetention, markConceptReviewed } from './revisionEngine';

describe('revision engine', () => {
  beforeEach(() => localStorage.clear());

  test('recovers a valid schedule after malformed storage', () => {
    localStorage.setItem('velora_revision_schedule', '{not-json');
    expect(getRevisionSchedule().length).toBeGreaterThan(0);
  });

  test('does not report fake retention for an empty schedule', () => {
    expect(calculateOverallRetention([])).toBe(0);
  });

  test('updates a real concept review', () => {
    const topic = getRevisionSchedule()[0];
    const updated = markConceptReviewed(topic.id);
    expect(updated[0].retentionScore).toBe(topic.retentionScore + 15);
  });
});
