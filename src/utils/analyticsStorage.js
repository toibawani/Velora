/**
 * analyticsStorage.js
 * 
 * Privacy-respecting, on-device learning analytics utility.
 * All metrics are calculated and stored purely in the user's browser (localStorage).
 * Zero tracking pixels, zero external telemetry, zero surveillance.
 */

const STORAGE_KEY = 'velora_learning_analytics';

const DEFAULT_ANALYTICS = {
  totalHoursStudied: 24.5,
  currentStreak: 7,
  topicsCompleted: 14,
  learningStyle: {
    visual: 45,      // % interactive/diagram preference
    textual: 30,     // % deep reading preference
    interactive: 25  // % flow-state challenges preference
  },
  peakHours: {
    morning: 15,
    afternoon: 25,
    evening: 50,     // e.g. 7 PM - 10 PM
    night: 10
  },
  topicTimeDistribution: [
    { topic: 'General Relativity & Gravity', hours: 7.2, subject: 'physics', color: '#4f7df3' },
    { topic: 'Event Horizons & Singularities', hours: 6.5, subject: 'physics', color: '#4f7df3' },
    { topic: 'Socratic Method & Epistemology', hours: 4.8, subject: 'philosophy', color: '#af52de' },
    { topic: 'Ancient Egyptian Astronomy', hours: 3.5, subject: 'history', color: '#ff9f0a' },
    { topic: 'Quantum Superposition', hours: 2.5, subject: 'physics', color: '#4f7df3' }
  ],
  struggledConcepts: [
    {
      concept: 'Spacetime Geodesics & Curvature Tensor',
      topic: 'General Relativity',
      subject: 'physics',
      struggleLevel: 'High',
      recommendation: 'Try our visual AI Whiteboard to map non-Euclidean geodesics step-by-step.'
    },
    {
      concept: 'Hawking Radiation & Virtual Particle Entanglement',
      topic: 'Quantum Mechanics',
      subject: 'physics',
      struggleLevel: 'Medium',
      recommendation: 'Revisit the Event Horizon micro-lesson and complete the causal chain game.'
    },
    {
      concept: 'Kantian Noumena vs. Phenomena',
      topic: 'Transcendental Idealism',
      subject: 'philosophy',
      struggleLevel: 'Medium',
      recommendation: 'Review the Sketchbook card comparing subjective perception with physical reality.'
    }
  ],
  weeklyActivity: [
    { day: 'Mon', hours: 2.5, sessions: 2 },
    { day: 'Tue', hours: 3.0, sessions: 3 },
    { day: 'Wed', hours: 1.5, sessions: 1 },
    { day: 'Thu', hours: 4.0, sessions: 4 },
    { day: 'Fri', hours: 2.0, sessions: 2 },
    { day: 'Sat', hours: 5.5, sessions: 5 },
    { day: 'Sun', hours: 3.0, sessions: 3 }
  ]
};

export const getAnalyticsData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ANALYTICS));
      return DEFAULT_ANALYTICS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage unavailable, returning default analytics', e);
    return DEFAULT_ANALYTICS;
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
  const data = getAnalyticsData();
  const hours = minutes / 60;
  data.totalHoursStudied = parseFloat((data.totalHoursStudied + hours).toFixed(1));
  
  const existingTopic = data.topicTimeDistribution.find(t => t.topic === topicName);
  if (existingTopic) {
    existingTopic.hours = parseFloat((existingTopic.hours + hours).toFixed(1));
  } else {
    data.topicTimeDistribution.push({
      topic: topicName,
      hours: parseFloat(hours.toFixed(1)),
      subject,
      color: subject === 'physics' ? '#4f7df3' : subject === 'philosophy' ? '#af52de' : '#ff9f0a'
    });
  }
  
  saveAnalyticsData(data);
};

export const clearAnalyticsData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear analytics', e);
  }
};
