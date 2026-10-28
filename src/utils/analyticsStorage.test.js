import { getAnalyticsData, hoursFromMinutes, recordStudySession } from './analyticsStorage';
import { safeSet } from './storage';

describe('analytics storage', () => {
  beforeEach(() => localStorage.clear());

  test('returns a complete shape when storage is empty', () => {
    const data = getAnalyticsData();
    expect(Array.isArray(data.topicTimeDistribution)).toBe(true);
    expect(Array.isArray(data.weeklyActivity)).toBe(true);
  });

  test('recovers when the stored schema is invalid', () => {
    safeSet('velora_learning_analytics', { totalHoursStudied: 2 });
    expect(getAnalyticsData().totalHoursStudied).toBe(0);
  });

  test('recovers when storage contains corrupted JSON', () => {
    localStorage.setItem('velora_learning_analytics', '{not-json');
    const data = getAnalyticsData();
    expect(data.totalHoursStudied).toBe(0);
    expect(Array.isArray(data.topicTimeDistribution)).toBe(true);
  });

  test('does not expose recovery details in analytics storage', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem('velora_learning_analytics', '{not-json');
    getAnalyticsData();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('accumulates repeated sessions on the same day', () => {
    recordStudySession('Stoicism', 15, 'philosophy');
    recordStudySession('Stoicism', 15, 'philosophy');
    const activity = getAnalyticsData().weeklyActivity.find((item) => item.day === new Date().toLocaleDateString('en-US', { weekday: 'short' }));
    expect(activity.sessions).toBe(2);
    expect(activity.hours).toBe(0.5);
  });

  test('short sessions accumulate instead of rounding away to nothing', () => {
    // One minute is 0.0167 hours; four of them stored as rounded hours would be
    // 0.0 four times over and the total would never move.
    for (let i = 0; i < 4; i += 1) recordStudySession('Entropy', 1, 'physics');

    const data = getAnalyticsData();
    expect(data.totalMinutes).toBe(4);
    expect(data.totalHoursStudied).toBe(0.1);

    const topic = data.topicTimeDistribution.find((item) => item.topic === 'Entropy');
    expect(topic.minutes).toBe(4);
    expect(topic.hours).toBe(0.1);
  });

  test('a record written with hours only is converted rather than lost', () => {
    localStorage.setItem(
      'velora_learning_analytics',
      JSON.stringify({
        v: 1,
        data: {
          totalHoursStudied: 1.5,
          topicTimeDistribution: [{ topic: 'Optics', hours: 0.5, subject: 'physics' }],
          weeklyActivity: [{ day: 'Mon', hours: 1.5, sessions: 2 }],
        },
      }),
    );

    const data = getAnalyticsData();
    expect(data.totalMinutes).toBe(90);
    expect(data.topicTimeDistribution[0]).toMatchObject({ minutes: 30, hours: 0.5 });
    expect(data.weeklyActivity[0]).toMatchObject({ minutes: 90, hours: 1.5 });
  });

  test('hours from minutes keeps the one decimal the screens show', () => {
    expect(hoursFromMinutes(0)).toBe(0);
    expect(hoursFromMinutes(4)).toBe(0.1);
    expect(hoursFromMinutes(30)).toBe(0.5);
    expect(hoursFromMinutes(90)).toBe(1.5);
  });

  test('records only valid study sessions', () => {
    expect(recordStudySession('Stoicism', 0)).toBe(false);
    expect(recordStudySession('Stoicism', 2000)).toBe(false);
    expect(recordStudySession('Stoicism', 15, 'philosophy')).toBe(true);
    expect(getAnalyticsData().topicTimeDistribution.some((item) => item.topic === 'Stoicism')).toBe(true);
  });

  // A colour written here would be a hex that survives every later change to
  // the palette, because localStorage does not re-read the stylesheet.
  test('records what was studied and leaves the colour to the stylesheet', () => {
    recordStudySession('Bayesian Updating', 30, 'philosophy');
    const entry = getAnalyticsData().topicTimeDistribution.find((item) => item.topic === 'Bayesian Updating');
    expect(entry.subject).toBe('philosophy');
    expect(entry.hours).toBe(0.5);
    expect(entry.color).toBeUndefined();
  });
});
