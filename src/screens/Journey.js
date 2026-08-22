import React, { useState } from 'react';
import '../styles/Journey.css';

function LearningJourney({ setScreen }) {
  const journeyData = [
    {
      date: 'Day 1',
      topic: 'Black Holes Basics',
      icon: '🕳️',
      status: 'completed',
      score: 92,
      time: '45 mins'
    },
    {
      date: 'Day 2',
      topic: 'Event Horizons',
      icon: '🌌',
      status: 'completed',
      score: 88,
      time: '50 mins'
    },
    {
      date: 'Day 3',
      topic: 'Singularities',
      icon: '⭐',
      status: 'completed',
      score: 85,
      time: '55 mins'
    },
    {
      date: 'Day 4',
      topic: 'Relativistic Effects',
      icon: '⚛️',
      status: 'in-progress',
      score: 0,
      time: '20 mins'
    },
    {
      date: 'Day 5',
      topic: 'Hawking Radiation',
      icon: '💫',
      status: 'locked',
      score: 0,
      time: '—'
    },
  ];

  return (
    <div className="journey-page">
      <header className="journey-header">
        <div className="container">
          <h1>🗺️ Your Learning Journey</h1>
          <button className="btn btn-primary" onClick={() => setScreen('dashboard')}>
            ← Back
          </button>
        </div>
      </header>

      <main className="container journey-main">
        <div className="journey-timeline">
          {journeyData.map((item, idx) => (
            <div key={idx} className={`journey-item ${item.status}`}>
              <div className="journey-marker">
                <div className="marker-icon">{item.icon}</div>
                <div className="marker-line"></div>
              </div>

              <div className="journey-content">
                <h3>{item.topic}</h3>
                <p className="date">{item.date}</p>
                
                {item.status === 'completed' && (
                  <div className="journey-stats">
                    <span className="score">✅ Score: {item.score}%</span>
                    <span className="time">⏱️ {item.time}</span>
                  </div>
                )}
                
                {item.status === 'in-progress' && (
                  <div className="progress-mini">
                    <div className="progress-bar-small">
                      <div className="fill" style={{ width: '40%' }}></div>
                    </div>
                    <p>40% complete • Continue →</p>
                  </div>
                )}

                {item.status === 'locked' && (
                  <p className="locked">🔒 Unlock by completing previous topic</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default LearningJourney;