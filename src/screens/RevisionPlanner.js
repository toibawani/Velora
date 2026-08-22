import React, { useState } from 'react';
import '../styles/Components.css';

function RevisionPlanner({ topic, subject, onBack }) {
  const [schedule, setSchedule] = useState([
    { day: 1, date: 'Today', status: 'completed', type: 'Initial Learning' },
    { day: 3, date: 'Dec 24', status: 'pending', type: 'First Revision' },
    { day: 7, date: 'Dec 28', status: 'pending', type: 'Second Revision' },
    { day: 21, date: 'Jan 11', status: 'pending', type: 'Third Revision' },
  ]);

  return (
    <div className="learn-container">
      <div className="learn-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>🔄 Revision Schedule</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="revision-container">
        <div className="spaced-repetition-info">
          <h2>Spaced Repetition Plan</h2>
          <p>
            Research shows that revisiting material at optimal intervals maximizes
            retention. We'll remind you automatically!
          </p>
        </div>

        <div className="revision-timeline">
          {schedule.map((item, idx) => (
            <div key={idx} className={`timeline-item ${item.status}`}>
              <div className="timeline-marker">
                {item.status === 'completed' && '✅'}
                {item.status === 'pending' && '⭕'}
              </div>
              <div className="timeline-content">
                <h4>{item.type}</h4>
                <p>{item.date}</p>
              </div>
              <div className="timeline-action">
                {item.status === 'pending' && (
                  <button className="btn-schedule">Set Reminder</button>
                )}
                {item.status === 'completed' && (
                  <span className="completed-badge">Done!</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="retention-graph">
          <h3>Your Learning Curve</h3>
          <svg viewBox="0 0 400 200" className="curve-svg">
            <path
              d="M 20 150 Q 100 80, 150 120 T 300 60"
              stroke="#667eea"
              strokeWidth="3"
              fill="none"
            />
            <circle cx="20" cy="150" r="4" fill="#667eea" />
            <circle cx="100" cy="80" r="4" fill="#667eea" />
            <circle cx="150" cy="120" r="4" fill="#667eea" />
            <circle cx="300" cy="60" r="4" fill="#667eea" />
          </svg>
          <p className="graph-label">
            Each revision increases retention. Your memory gets stronger! 🧠
          </p>
        </div>
      </div>
    </div>
  );
}

export default RevisionPlanner;