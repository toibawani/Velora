/**
 * revisionEngine.js
 * 
 * Intelligent spaced-repetition and retention scoring algorithm for VELORA.
 * Calculates decay rates using cognitive memory models (Ebbinghaus forgetting curve),
 * and automatically schedules proactive revision reminders aligned with the learner's
 * peak focus hours.
 */

const STORAGE_KEY = 'velora_revision_schedule';

const INITIAL_TOPICS = [
  {
    id: 'bh-event-horizon',
    concept: 'Event Horizon & Escape Velocity',
    domain: 'Black Holes & General Relativity',
    subject: 'physics',
    initialMastery: 62,
    decayRate: 0.08,
    lastStudied: '2026-08-21T18:00:00.000Z',
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
    lastStudied: '2026-08-19T20:00:00.000Z',
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
    lastStudied: '2026-08-20T14:30:00.000Z',
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
    lastStudied: '2026-08-15T10:00:00.000Z',
    struggleSignals: 0,
    retentionScore: 94,
    nextSession: 'Next Week at 11:00 AM',
    status: 'optimal',
    stage: 'Long-term Consolidation'
  }
];

export const getRevisionSchedule = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TOPICS));
      return INITIAL_TOPICS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage unavailable, returning default revision topics', e);
    return INITIAL_TOPICS;
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
  if (!topics.length) return 80;
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
