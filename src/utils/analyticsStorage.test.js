import { getAnalyticsData, recordStudySession } from './analyticsStorage';

describe('analytics storage', () => {
  beforeEach(() => localStorage.clear());

  test('returns a complete shape when storage is empty', () => {
    const data = getAnalyticsData();
    expect(Array.isArray(data.topicTimeDistribution)).toBe(true);
    expect(Array.isArray(data.weeklyActivity)).toBe(true);
  });

  test('recovers when the stored schema is invalid', () => {
    localStorage.setItem('velora_learning_analytics', JSON.stringify({ totalHoursStudied: 2 }));
    expect(getAnalyticsData().totalHoursStudied).toBe(0);
  });

  test('accumulates repeated sessions on the same day', () => {
    recordStudySession('Stoicism', 15, 'philosophy');
    recordStudySession('Stoicism', 15, 'philosophy');
    const activity = getAnalyticsData().weeklyActivity.find((item) => item.day === new Date().toLocaleDateString('en-US', { weekday: 'short' }));
    expect(activity.sessions).toBe(2);
    expect(activity.hours).toBe(0.5);
  });

  test('records only valid study sessions', () => {
    expect(recordStudySession('Stoicism', 0)).toBe(false);
    expect(recordStudySession('Stoicism', 2000)).toBe(false);
    expect(recordStudySession('Stoicism', 15, 'philosophy')).toBe(true);
    expect(getAnalyticsData().topicTimeDistribution.some((item) => item.topic === 'Stoicism')).toBe(true);
  });
});
