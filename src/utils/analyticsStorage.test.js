import { getAnalyticsData } from './analyticsStorage';

describe('analytics storage', () => {
  beforeEach(() => localStorage.clear());

  test('returns a complete shape when storage is empty', () => {
    const data = getAnalyticsData();
    expect(Array.isArray(data.topicTimeDistribution)).toBe(true);
    expect(Array.isArray(data.weeklyActivity)).toBe(true);
  });

  test('recovers when the stored schema is invalid', () => {
    localStorage.setItem('velora_learning_analytics', JSON.stringify({ totalHoursStudied: 2 }));
    expect(getAnalyticsData().totalHoursStudied).toBe(24.5);
  });
});
