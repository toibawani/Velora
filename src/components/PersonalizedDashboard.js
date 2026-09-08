import React, { useState, useEffect } from 'react';
import '../styles/PersonalizedDashboard.css';

function PersonalizedDashboard({ selectedSubject, setSelectedSubject, setScreen }) {
  const [recommendations] = useState([
    {
      id: 1,
      icon: '⚛️',
      title: 'Continue: Quantum Mechanics',
      progress: 65,
      time: '8 min left',
      color: '#667eea',
    },
    {
      id: 2,
      icon: '💭',
      title: 'Start: Stoicism Basics',
      progress: 0,
      time: '12 min',
      color: '#2E7D32',
    },
    {
      id: 3,
      icon: '📜',
      title: 'Review: Renaissance Art',
      progress: 100,
      time: 'Review due tomorrow',
      color: '#F39C12',
    },
  ]);

  const handleStartLearning = (subject) => {
    setSelectedSubject(subject.id || 'physics');
    setScreen('learn');
  };

  return (
    <div className="personalized-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Recommended For You</h2>
        <p className="dashboard-subtitle">Based on your learning style and progress</p>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((rec) => (
          <div key={rec.id} className="recommendation-card">
            <div className="rec-icon">{rec.icon}</div>

            <div className="rec-content">
              <h3 className="rec-title">{rec.title}</h3>
              <p className="rec-time">{rec.time}</p>
            </div>

            <div className="rec-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${rec.progress}%`, background: rec.color }}
                ></div>
              </div>
              <span className="progress-text">{rec.progress}%</span>
            </div>

            <button
              className="rec-btn"
              style={{ borderColor: rec.color }}
              onClick={() => handleStartLearning(rec)}
            >
              Start →
            </button>
          </div>
        ))}
      </div>

      <div className="learning-style">
        <h3 className="learning-style-title">Your Peak Learning Hours</h3>
        <div className="hours-display">
          <div className="hour-card">
            <span className="hour-emoji">☀️</span>
            <span className="hour-label">Best: 2:00 PM - 4:00 PM</span>
          </div>
          <div className="hour-card">
            <span className="hour-emoji">🌙</span>
            <span className="hour-label">Good: 7:00 PM - 9:00 PM</span>
          </div>
        </div>
        <p className="learning-tip">💡 Schedule tough topics during peak hours for better retention</p>
      </div>
    </div>
  );
}

export default PersonalizedDashboard;