import React from 'react';
import { getAnalyticsData } from '../utils/analyticsStorage';
import '../styles/LearningAnalytics.css';

function LearningAnalytics({ selectedSubject }) {
  const data = getAnalyticsData();
  const totalHours = data.totalHoursStudied;
  const topicsCompleted = data.topicsCompleted;
  const currentStreak = data.currentStreak;
  const hasActivity = totalHours > 0 || topicsCompleted > 0;
  const strugglingTopics = data.struggledConcepts.map((item) => item.concept);

  return (
    <div className="learning-analytics">
      <h2 className="analytics-title">Your Learning Snapshot</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">⏱️</span>
          <span className="stat-label">Total Time</span>
          <span className="stat-value">{totalHours} hrs</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✓</span>
          <span className="stat-label">Topics Done</span>
          <span className="stat-value">{topicsCompleted}</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🧠</span>
          <span className="stat-label">Retention</span>
          <span className="stat-value">{hasActivity ? 'Building a baseline' : 'Not started'}</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🔥</span>
          <span className="stat-label">Current Streak</span>
          <span className="stat-value">{currentStreak} days</span>
        </div>
      </div>

      <div className="insights-box">
        <h3 className="insights-heading">Smart Insights</h3>
        <div className="insight">
          <p>💡 {hasActivity ? 'Your learning pattern is still forming. Keep returning to the questions that stay with you.' : 'Read a lesson, then return for a review. Your pattern will appear here.'}</p>
        </div>
        <div className="insight">
          <p>⚠️ Struggling with: <strong>{strugglingTopics.length ? strugglingTopics.join(', ') : 'No struggling topics recorded yet.'}</strong></p>
        </div>
        <div className="insight">
          <p>📈 {hasActivity ? 'Keep reviewing to turn a first session into a durable understanding.' : 'Your first real learning session is the baseline.'}</p>
        </div>
      </div>
    </div>
  );
}

export default LearningAnalytics;