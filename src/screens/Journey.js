import React from 'react';
import '../styles/Journey.css';

/**
 * Learning Journey & Epistemic Milestones
 * 
 * High-contrast roadmap tracking daily deep focus sessions,
 * mastery scores, and locked prerequisite units.
 */

const JOURNEY_DATA = [
  {
    day: 'Milestone 01',
    topic: 'Relativistic Spacetime & Minkowski Metric',
    icon: '🕳️',
    status: 'completed',
    score: 94,
    time: '45 mins focus'
  },
  {
    day: 'Milestone 02',
    topic: 'Event Horizons & Null Geodesics',
    icon: '🌌',
    status: 'completed',
    score: 88,
    time: '50 mins focus'
  },
  {
    day: 'Milestone 03',
    topic: 'Coordinate vs. Physical Singularities',
    icon: '⭐',
    status: 'completed',
    score: 92,
    time: '55 mins focus'
  },
  {
    day: 'Milestone 04',
    topic: 'Frame Dragging & Ergosphere Mechanics',
    icon: '⚛️',
    status: 'in-progress',
    score: 65,
    time: '30 mins remaining'
  },
  {
    day: 'Milestone 05',
    topic: 'Hawking Radiation & Black Hole Thermodynamics',
    icon: '💫',
    status: 'locked',
    score: 0,
    time: 'Prerequisite Locked'
  },
];

function LearningJourney({ setScreen }) {
  return (
    <div className="journey-console">
      {/* Top Navbar */}
      <header className="journey-navbar">
        <div className="journey-nav-left">
          <button className="journey-back-btn" onClick={() => setScreen('dashboard')}>
            ← Return to Dashboard
          </button>
          <div className="journey-title-col">
            <h1 className="journey-title">Epistemic Learning Journey</h1>
            <span className="journey-sub">Cumulative milestone progress & mastery verification</span>
          </div>
        </div>
      </header>

      <main className="journey-main-layout">
        <div className="journey-timeline-feed">
          {JOURNEY_DATA.map((item, idx) => (
            <div key={idx} className={`journey-feed-item ${item.status}`}>
              <div className="journey-node-marker">
                <span className="marker-icon-symbol">{item.icon}</span>
              </div>

              <div className="journey-entry-card">
                <div className="entry-head">
                  <span className="milestone-day-tag">{item.day}</span>
                  <span className={`status-badge-tag ${item.status}`}>
                    {item.status === 'completed' ? '✓ Mastered' : item.status === 'in-progress' ? '● In Progress' : '🔒 Locked'}
                  </span>
                </div>

                <h3 className="milestone-topic-title">{item.topic}</h3>
                
                {item.status === 'completed' && (
                  <div className="milestone-stats-row">
                    <span className="score-stat">Mastery: {item.score}%</span>
                    <span className="time-stat">⏱️ {item.time}</span>
                  </div>
                )}
                
                {item.status === 'in-progress' && (
                  <div className="milestone-progress-block">
                    <div className="progress-mini-track">
                      <div className="progress-mini-fill" style={{ width: `${item.score}%` }}></div>
                    </div>
                    <span className="progress-mini-label">{item.score}% complete • Resume Module →</span>
                  </div>
                )}

                {item.status === 'locked' && (
                  <p className="locked-helper-text">Requires completion of Milestone 04 verification quiz.</p>
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