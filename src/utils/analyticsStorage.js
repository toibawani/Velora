/**
 * analyticsStorage.js
 *
 * Privacy-respecting, on-device learning analytics utility.
 * All metrics are calculated and stored purely in the user's browser (localStorage).
 * Zero tracking pixels, zero external telemetry, zero surveillance.
 */

import { KEYS, readValue, writeValue, removeValue } from './storage';

const STORAGE_KEY = KEYS.LEARNING_ANALYTICS;

const DEFAULT_ANALYTICS = {
  // Minutes are the measurement; hours are what the screens show. Storing only
  // hours, rounded to one decimal place, meant four one-minute sessions added
  // 0.0167 four times, each rounded to 0.0, and the total never moved. An
  // integer count of minutes cannot lose a session that way.
  totalMinutes: 0,
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

/** Hours from minutes, to the one decimal place the screens display. */
export const hoursFromMinutes = (minutes) => Number(((Number(minutes) || 0) / 60).toFixed(1));

/**
 * A stored record with minutes filled in.
 *
 * Data written by an older build has hours only. It is converted once, on read,
 * rather than being thrown away or shown as zero: the sessions it counted really
 * happened, and the count is only lost because the old format could not keep a
 * fraction of an hour.
 */
const withMinutes = (raw) => {
  const totalMinutes = Number.isFinite(raw.totalMinutes)
    ? Math.round(raw.totalMinutes)
    : Math.round((Number(raw.totalHoursStudied) || 0) * 60);

  return {
    ...cloneDefault(),
    ...raw,
    totalMinutes,
    totalHoursStudied: hoursFromMinutes(totalMinutes),
    topicTimeDistribution: (raw.topicTimeDistribution || []).map((topic) => {
      const minutes = Number.isFinite(topic.minutes)
        ? Math.round(topic.minutes)
        : Math.round((Number(topic.hours) || 0) * 60);
      return { ...topic, minutes, hours: hoursFromMinutes(minutes) };
    }),
    weeklyActivity: (raw.weeklyActivity || []).map((day) => {
      const minutes = Number.isFinite(day.minutes)
        ? Math.round(day.minutes)
        : Math.round((Number(day.hours) || 0) * 60);
      return { ...day, minutes, hours: hoursFromMinutes(minutes) };
    }),
  };
};

export const getAnalyticsData = () => {
  const raw = readValue(STORAGE_KEY, null);
  if (!raw) {
    const defaults = cloneDefault();
    writeValue(STORAGE_KEY, defaults);
    return defaults;
  }
  if (!isAnalyticsShape(raw)) {
    // Invalid schema - return defaults and fix storage
    const defaults = cloneDefault();
    writeValue(STORAGE_KEY, defaults);
    return defaults;
  }
  return withMinutes(raw);
};

/** Returns FAILURE.NONE or why the write did not land, so callers can say so. */
export const saveAnalyticsData = (data) => writeValue(STORAGE_KEY, data);

export const recordStudySession = (topicName, minutes, subject = 'physics') => {
  const safeMinutes = Number(minutes);
  if (!topicName || !Number.isFinite(safeMinutes) || safeMinutes <= 0 || safeMinutes > 1440) return false;
  const data = getAnalyticsData();
  const wholeMinutes = Math.round(safeMinutes);
  data.totalMinutes += wholeMinutes;
  data.totalHoursStudied = hoursFromMinutes(data.totalMinutes);

  const existingTopic = data.topicTimeDistribution.find(t => t.topic === topicName);
  const day = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todayActivity = data.weeklyActivity.find((item) => item.day === day);
  if (todayActivity) {
    todayActivity.minutes += wholeMinutes;
    todayActivity.hours = hoursFromMinutes(todayActivity.minutes);
    todayActivity.sessions += 1;
  } else {
    data.weeklyActivity.push({ day, minutes: wholeMinutes, hours: hoursFromMinutes(wholeMinutes), sessions: 1 });
  }
  if (existingTopic) {
    existingTopic.minutes = (existingTopic.minutes || 0) + wholeMinutes;
    existingTopic.hours = hoursFromMinutes(existingTopic.minutes);
  } else {
    // No colour here on purpose. A hex written into localStorage outlives every
    // palette change made in CSS, and the two branches that used to set one
    // resolved to the same blue anyway. Which colour a bar wears is a rendering
    // question, and the renderer answers it from the subject tokens.
    data.topicTimeDistribution.push({
      topic: topicName,
      minutes: wholeMinutes,
      hours: hoursFromMinutes(wholeMinutes),
      subject,
    });
  }

  saveAnalyticsData(data);
  return true;
};

export const clearAnalyticsData = () => {
  removeValue(STORAGE_KEY);
};
