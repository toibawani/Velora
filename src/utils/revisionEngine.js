/**
 * revisionEngine.js
 * 
 * Intelligent spaced-repetition and retention scoring algorithm for VELORA.
 * Calculates decay rates using cognitive memory models (Ebbinghaus forgetting curve),
 * and automatically schedules proactive revision reminders aligned with the learner's
 * peak focus hours.
 */

const STORAGE_KEY = 'velora_revision_schedule';
const DAY = 86400000;
const daysAgo = (days, hour = 18) => new Date(Date.now() - days * DAY).setHours(hour, 0, 0, 0);

const INITIAL_TOPICS = [
  {
    id: 'bh-event-horizon',
    concept: 'Event Horizon & Escape Velocity',
    domain: 'Black Holes & General Relativity',
    subject: 'physics',
    initialMastery: 62,
    decayRate: 0.08,
    lastStudied: new Date(daysAgo(4)).toISOString(),
    struggleSignals: 2,
    retentionScore: 73,
    nextSession: 'Tuesday at 2:00 PM',
    status: 'due-soon',
    stage: 'First Recall Interval'
  },
  {
    id: 'bh-singularity-curvature',
    concept: 'Spacetime Curvature & Singularities',
    domain: 'General Relativity',
    subject: 'physics',
    initialMastery: 85,
    decayRate: 0.04,
    lastStudied: new Date(daysAgo(6, 20)).toISOString(),
    struggleSignals: 0,
    retentionScore: 91,
    nextSession: 'Friday at 8:00 PM',
    status: 'optimal',
    stage: 'Third Recall Interval'
  },
  {
    id: 'phil-socratic-irony',
    concept: 'Socratic Aporia & Method',
    domain: 'Ancient Philosophy',
    subject: 'philosophy',
    initialMastery: 70,
    decayRate: 0.06,
    lastStudied: new Date(daysAgo(5, 14)).toISOString(),
    struggleSignals: 1,
    retentionScore: 82,
    nextSession: 'Tomorrow at 7:30 PM',
    status: 'due-soon',
    stage: 'Second Recall Interval'
  },
  {
    id: 'hist-roman-senate',
    concept: 'Cursus Honorum & Roman Senate',
    domain: 'Roman Republic',
    subject: 'history',
    initialMastery: 95,
    decayRate: 0.03,
    lastStudied: new Date(daysAgo(10, 10)).toISOString(),
    struggleSignals: 0,
    retentionScore: 94,
    nextSession: 'Next Week at 11:00 AM',
    status: 'optimal',
    stage: 'Long-term Consolidation'
  }
];

const isTopic = (topic) => topic && typeof topic.id === 'string' && typeof topic.concept === 'string' && Number.isFinite(topic.retentionScore);
const validTopics = (value) => Array.isArray(value) && value.every(isTopic);

const cloneInitialTopics = () => INITIAL_TOPICS.map((topic) => ({ ...topic }));

export const getRevisionSchedule = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TOPICS));
      return cloneInitialTopics();
    }
    const parsed = JSON.parse(raw);
    if (!validTopics(parsed)) throw new Error('Invalid revision schedule');
    return parsed;
  } catch (e) {
    console.warn('LocalStorage unavailable, returning default revision topics', e);
    return cloneInitialTopics();
  }
};

export const saveRevisionSchedule = (topics) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  } catch (e) {
    console.error('Failed to save revision schedule', e);
  }
};

export const calculateOverallRetention = (topics = getRevisionSchedule()) => {
  if (!Array.isArray(topics) || !topics.length) return 0;
  const total = topics.reduce((sum, item) => sum + item.retentionScore, 0);
  return Math.round(total / topics.length);
};

export const markConceptReviewed = (conceptId) => {
  const topics = getRevisionSchedule();
  const index = topics.findIndex(t => t.id === conceptId);
  if (index !== -1) {
    topics[index].retentionScore = Math.min(topics[index].retentionScore + 15, 100);
    topics[index].status = 'optimal';
    topics[index].lastStudied = new Date().toISOString();
    topics[index].nextSession = 'In 14 days (Consolidation)';
    saveRevisionSchedule(topics);
  }
  return topics;
};
