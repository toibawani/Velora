import React, { useState, useEffect } from 'react';
import '../styles/LearningAnalyticsDash.css';

const DEFAULT_STATS = {
  totalHours: 12.5,
  topicsCompleted: 8,
  retentionScore: 73,
  currentStreak: 7,
  bestLearningTime: '2:00 PM - 4:00 PM',
  strugglingTopics: ['Wave-Particle Duality', 'Quantum Entanglement'],
  weeklyData: [3, 5, 4, 6, 7, 5, 4]
};

const isValidStats = (value) => value && typeof value === 'object' && Array.isArray(value.weeklyData) && value.weeklyData.length === 7 && value.weeklyData.every(Number.isFinite);

function LearningAnalyticsDash() {
  const [stats, setStats] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('velora_analytics') || 'null');
      return isValidStats(saved) ? { ...DEFAULT_STATS, ...saved } : { ...DEFAULT_STATS };
    } catch {
      return { ...DEFAULT_STATS };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('velora_analytics', JSON.stringify(stats));
    } catch {
      // Keep the in-memory dashboard usable when storage is unavailable.
    }
  }, [stats]);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxHours = Math.max(1, ...stats.weeklyData);

  return (
    <div className="analytics-dash">
      <div className="analytics-header">
        <h2 className="analytics-title">Your Learning Analytics</h2>
        <p className="analytics-subtitle">Track your progress and growth</p>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-icon">⏱️</span>
          <span className="stat-label">Total Hours</span>
          <span className="stat-value">{stats.totalHours}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">✓</span>
          <span className="stat-label">Topics Completed</span>
          <span className="stat-value">{stats.topicsCompleted}</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">🧠</span>
          <span className="stat-label">Retention Score</span>
          <span className="stat-value">{stats.retentionScore}%</span>
        </div>

        <div className="stat-box">
          <span className="stat-icon">🔥</span>
          <span className="stat-label">Streak</span>
          <span className="stat-value">{stats.currentStreak} days</span>
        </div>
      </div>

      <div className="weekly-activity">
        <h3 className="activity-title">This Week's Activity</h3>
        <div className="bar-chart">
          {stats.weeklyData.map((hours, idx) => (
            <div key={idx} className="bar-container">
              <div
                className="bar"
                style={{
                  height: `${(hours / maxHours) * 100}%`,
                  background: hours >= 6 ? '#2E7D32' : hours >= 4 ? '#F39C12' : '#E74C3C',
                }}
              ></div>
              <span className="bar-label">{days[idx]}</span>
              <span className="bar-value">{hours}h</span>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-section">
        <h3 className="insights-title">Your Insights</h3>
        <div className="insight-item">
          <span className="insight-icon">💡</span>
          <p className="insight-text">
            You learn best from <strong>{stats.bestLearningTime}</strong>. Schedule tough topics then.
          </p>
        </div>
        <div className="insight-item">
          <span className="insight-icon">⚠️</span>
          <p className="insight-text">
            Struggling with: <strong>{stats.strugglingTopics.join(', ')}</strong>
          </p>
        </div>
        <div className="insight-item">
          <span className="insight-icon">📈</span>
          <p className="insight-text">
            You're in the <strong>top 12%</strong> of learners this month!
          </p>
        </div>
      </div>
    </div>
  );
}

export default LearningAnalyticsDash;