import React, { useState } from 'react';
import '../styles/LearningAnalytics.css';

function LearningAnalytics({ selectedSubject }) {
  const [stats] = useState({
    totalHours: 12.5,
    topicsCompleted: 8,
    retentionScore: 73,
    currentStreak: 7,
    bestLearningTime: '2:00 PM - 4:00 PM',
    strugglingTopics: ['Wave-Particle Duality', 'Quantum Entanglement'],
  });

  return (
    <div className="learning-analytics">
      <h2 className="analytics-title">Your Learning Snapshot</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">⏱️</span>
          <span className="stat-label">Total Time</span>
          <span className="stat-value">{stats.totalHours} hrs</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✓</span>
          <span className="stat-label">Topics Done</span>
          <span className="stat-value">{stats.topicsCompleted}</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🧠</span>
          <span className="stat-label">Retention</span>
          <span className="stat-value">{stats.retentionScore}%</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🔥</span>
          <span className="stat-label">Current Streak</span>
          <span className="stat-value">{stats.currentStreak} days</span>
        </div>
      </div>

      <div className="insights-box">
        <h3 className="insights-heading">Smart Insights</h3>
        <div className="insight">
          <p>💡 You learn best from <strong>{stats.bestLearningTime}</strong>. Schedule tough topics then.</p>
        </div>
        <div className="insight">
          <p>⚠️ You're struggling with: <strong>{stats.strugglingTopics.join(', ')}</strong></p>
        </div>
        <div className="insight">
          <p>📈 You're in the top 12% of learners this month!</p>
        </div>
      </div>
    </div>
  );
}

export default LearningAnalytics;