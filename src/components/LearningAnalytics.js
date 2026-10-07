import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Clock, BookOpen, Waves, Lightbulb } from 'lucide-react';
import { getAnalyticsData } from '../utils/analyticsStorage';
import '../styles/LearningAnalytics.css';

/**
 * Learning Snapshot
 *
 * Two of the four tiles here read zero for every learner who ever opened the
 * app. currentStreak and topicsCompleted are declared in the storage defaults
 * and written by nothing - not a lesson, not a quiz, not a save - so the streak
 * tile showed "0 days" beside a flame, and the topics tile showed "0" beside a
 * checkmark, permanently.
 *
 * A number that cannot move is not a statistic, it is scenery, and it teaches
 * people that numbers on this app are decoration. What remains is computed from
 * the sessions LessonReader records, scoped to the subject someone is standing
 * in - which the component was always given and never used, so three hours of
 * philosophy made the physics snapshot look empty.
 */

const subjectLabel = (id) =>
  id.replace(/-/g, ' ').replace(/^./, (first) => first.toUpperCase());

export function learningSnapshot(analytics, selectedSubject) {
  const subjectKey = selectedSubject || 'physics';
  const inSubject = analytics.topicTimeDistribution.filter(
    (item) => (item.subject || 'physics') === subjectKey
  );
  const hours = parseFloat(inSubject.reduce((total, item) => total + item.hours, 0).toFixed(1));
  const longest = inSubject.reduce(
    (best, item) => (best === null || item.hours > best.hours ? item : best),
    null
  );
  const sessions = analytics.weeklyActivity.reduce((total, day) => total + (day.sessions || 0), 0);

  return { subjectKey, hours, topics: inSubject.length, longest, sessions };
}

function LearningAnalytics({ selectedSubject }) {
  const [data] = useState(() => getAnalyticsData());
  const snapshot = learningSnapshot(data, selectedSubject);
  const label = subjectLabel(snapshot.subjectKey);
  const hasActivity = snapshot.hours > 0;

  return (
    <div className="learning-analytics">
      <h2 className="analytics-title">Learning Snapshot</h2>
      <p className="analytics-scope">{label}, recorded on this device</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">
            <Clock size={18} aria-hidden="true" />
          </span>
          <span className="stat-label">Time in {label}</span>
          <span className="stat-value">
            {hasActivity ? `${snapshot.hours} ${snapshot.hours === 1 ? 'hour' : 'hours'}` : '—'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">
            <BookOpen size={18} aria-hidden="true" />
          </span>
          <span className="stat-label">Topics read</span>
          <span className="stat-value">
            {snapshot.topics > 0 ? snapshot.topics : '—'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">
            <Waves size={18} aria-hidden="true" />
          </span>
          <span className="stat-label">Most time spent on</span>
          <span className="stat-value" title={snapshot.longest ? snapshot.longest.topic : undefined}>
            {snapshot.longest ? `${snapshot.longest.topic} (${snapshot.longest.hours}h)` : '—'}
          </span>
        </div>
      </div>

      <div className="insights-box">
        <h3 className="insights-heading">What this means</h3>
        <div className="insight">
          <Lightbulb size={15} aria-hidden="true" />
          <p>
            {hasActivity
              ? `${snapshot.hours} ${snapshot.hours === 1 ? 'hour' : 'hours'} across ${snapshot.topics} ${snapshot.topics === 1 ? 'topic' : 'topics'}. A pattern needs more than this, so keep reading and the numbers here will start to mean something.`
              : `Nothing has been read in ${label} yet. The counter starts when you close a lesson.`}
          </p>
        </div>
        <div className="insight">
          <Lightbulb size={15} aria-hidden="true" />
          <p>
            {snapshot.sessions > 0
              ? `${snapshot.sessions} ${snapshot.sessions === 1 ? 'session' : 'sessions'} closed on this device across all subjects.`
              : 'No closed sessions yet, which is the same as starting today.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LearningAnalytics;
