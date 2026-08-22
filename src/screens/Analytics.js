import React, { useState } from 'react';
import '../styles/Analytics.css';

function Analytics({ setScreen, user }) {
  const [timeRange, setTimeRange] = useState('week');

  // Simulated data - replace with real data from Firebase
  const analyticsData = {
    totalHoursStudied: 24.5,
    currentStreak: 7,
    topicsCompleted: 12,
    weakestTopics: [
      { name: 'Relativity', understanding: 35, needsHelp: true },
      { name: 'Quantum Mechanics', understanding: 42, needsHelp: true },
      { name: 'Black Holes', understanding: 67, needsHelp: false },
    ],
    strengths: [
      { name: 'Classical Mechanics', score: 92 },
      { name: 'Newton\'s Laws', score: 88 },
      { name: 'Energy & Momentum', score: 85 },
    ],
    learningTrend: [
      { day: 'Mon', hours: 2.5, topicsLearned: 1 },
      { day: 'Tue', hours: 3, topicsLearned: 2 },
      { day: 'Wed', hours: 1.5, topicsLearned: 1 },
      { day: 'Thu', hours: 4, topicsLearned: 3 },
      { day: 'Fri', hours: 2, topicsLearned: 1 },
      { day: 'Sat', hours: 5.5, topicsLearned: 4 },
      { day: 'Sun', hours: 3, topicsLearned: 2 },
    ],
    aiInsight: "You're struggling with abstract concepts. Try our visual learning mode for Relativity & Quantum Mechanics. You learn 40% faster with diagrams!",
    recommendedAction: "Focus on Relativity for 30 mins today. You were 80% done.",
  };

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div className="container">
          <h1>📊 Your Learning Analytics</h1>
          <button className="btn btn-primary" onClick={() => setScreen('dashboard')}>
            ← Back
          </button>
        </div>
      </header>

      <main className="container analytics-main">
        {/* AI Insight Card */}
        <div className="ai-insight-card">
          <div className="insight-icon">🤖</div>
          <div className="insight-content">
            <h3>AI Learning Insight</h3>
            <p>{analyticsData.aiInsight}</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Start Visual Learning Mode
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-info">
              <p className="metric-label">Hours Studied This Week</p>
              <p className="metric-value">{analyticsData.totalHoursStudied}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🔥</div>
            <div className="metric-info">
              <p className="metric-label">Current Streak</p>
              <p className="metric-value">{analyticsData.currentStreak} days</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">✅</div>
            <div className="metric-info">
              <p className="metric-label">Topics Mastered</p>
              <p className="metric-value">{analyticsData.topicsCompleted}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-info">
              <p className="metric-label">Learning Speed</p>
              <p className="metric-value">+12% ↑</p>
            </div>
          </div>
        </div>

        {/* Weakest Topics - NEEDS HELP */}
        <div className="weak-topics-section">
          <h2>⚠️ Topics You're Struggling With</h2>
          <p className="section-subtitle">AI recommends focusing on these first</p>
          {analyticsData.weakestTopics.map((topic, idx) => (
            <div key={idx} className="topic-strength-card">
              <div className="topic-info">
                <h4>{topic.name}</h4>
                <p className="understanding-level">Understanding: {topic.understanding}%</p>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${topic.understanding}%`,
                      background: topic.understanding < 50 ? '#E24B4A' : '#FFA500'
                    }}
                  ></div>
                </div>
              </div>
              <button className="btn btn-primary btn-small">
                {topic.needsHelp ? '🆘 Get Help' : '📖 Review'}
              </button>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="strengths-section">
          <h2>⭐ Your Strengths</h2>
          {analyticsData.strengths.map((strength, idx) => (
            <div key={idx} className="strength-card">
              <div className="strength-icon">🏆</div>
              <div className="strength-info">
                <h4>{strength.name}</h4>
                <p>Score: {strength.score}/100</p>
              </div>
              <div className="strength-badge">{strength.score}%</div>
            </div>
          ))}
        </div>

        {/* Learning Trend */}
        <div className="trend-section">
          <h2>📈 Your Learning Trend (This Week)</h2>
          <div className="trend-chart">
            {analyticsData.learningTrend.map((day, idx) => (
              <div key={idx} className="trend-bar">
                <div className="bar-graph">
                  <div 
                    className="bar" 
                    style={{ height: `${(day.hours / 5.5) * 100}%` }}
                  ></div>
                </div>
                <div className="bar-label">
                  <p className="day">{day.day}</p>
                  <p className="hours">{day.hours}h</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Action */}
        <div className="recommendation-card">
          <h3>🎯 Your Personalized Recommendation</h3>
          <p>{analyticsData.recommendedAction}</p>
          <button className="btn btn-primary">Start Now</button>
        </div>
      </main>
    </div>
  );
}

export default Analytics;