/**
 * analyticsStorage.js
 * 
 * Privacy-respecting, on-device learning analytics utility.
 * All metrics are calculated and stored purely in the user's browser (localStorage).
 * Zero tracking pixels, zero external telemetry, zero surveillance.
 */

const STORAGE_KEY = 'velora_learning_analytics';

const DEFAULT_ANALYTICS = {
  totalHoursStudied: 0,
  currentStreak: 0,
  topicsCompleted: 0,
  learningStyle: {
    visual: 0,      // % interactive/diagram preference
    textual: 0,     // % deep reading preference
    interactive: 0  // % flow-state challenges preference
  },
  peakHours: {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  },
  topicTimeDistribution: [],
  struggledConcepts: [],
  weeklyActivity: []
};

const cloneDefault = () => JSON.parse(JSON.stringify(DEFAULT_ANALYTICS));

const isAnalyticsShape = (value) => value && typeof value === 'object' && Array.isArray(value.topicTimeDistribution) && Array.isArray(value.weeklyActivity);

export const getAnalyticsData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaults = cloneDefault();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw);
    if (!isAnalyticsShape(parsed)) throw new Error('Invalid analytics schema');
    return { ...cloneDefault(), ...parsed };
  } catch (e) {
    return cloneDefault();
  }
};

export const saveAnalyticsData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save analytics', e);
  }
};

export const recordStudySession = (topicName, minutes, subject = 'physics') => {
  const safeMinutes = Number(minutes);
  if (!topicName || !Number.isFinite(safeMinutes) || safeMinutes <= 0 || safeMinutes > 1440) return false;
  const data = getAnalyticsData();
  const hours = safeMinutes / 60;
  data.totalHoursStudied = parseFloat((data.totalHoursStudied + hours).toFixed(1));
  
  const existingTopic = data.topicTimeDistribution.find(t => t.topic === topicName);
  const day = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todayActivity = data.weeklyActivity.find((item) => item.day === day);
  if (todayActivity) {
    todayActivity.hours = parseFloat((todayActivity.hours + hours).toFixed(2));
    todayActivity.sessions += 1;
  } else {
    data.weeklyActivity.push({ day, hours: parseFloat(hours.toFixed(2)), sessions: 1 });
  }
  if (existingTopic) {
    existingTopic.hours = parseFloat((existingTopic.hours + hours).toFixed(1));
  } else {
    data.topicTimeDistribution.push({
      topic: topicName,
      hours: parseFloat(hours.toFixed(1)),
      subject,
      color: subject === 'physics' ? '#2563EB' : subject === 'philosophy' ? '#2563EB' : '#ff9f0a'
    });
  }
  
  saveAnalyticsData(data);
  return true;
};

export const clearAnalyticsData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear analytics', e);
  }
};
