import React, { useState } from 'react';
import '../styles/SmartRevision.css';

function SmartRevision({ selectedSubject }) {
  const [revisions] = useState([
    {
      topic: 'Event Horizon',
      nextReview: 'Tomorrow, 2:00 PM',
      difficulty: 'Medium',
      retention: 65,
    },
    {
      topic: 'Singularity',
      nextReview: 'In 3 days',
      difficulty: 'Hard',
      retention: 45,
    },
    {
      topic: "Newton's Laws",
      nextReview: 'In 7 days',
      difficulty: 'Easy',
      retention: 92,
    },
  ]);

  return (
    <div className="smart-revision">
      <div className="revision-header">
        <h2 className="revision-title">Intelligent Revision Plan</h2>
        <p className="revision-desc">AI schedules reviews at optimal times for your brain</p>
      </div>

      <div className="revision-list">
        {revisions.map((rev, idx) => (
          <div key={idx} className="revision-item">
            <div className="revision-info">
              <h4 className="revision-topic">{rev.topic}</h4>
              <div className="revision-meta">
                <span className="meta-badge">{rev.difficulty}</span>
                <span className="meta-time">📅 {rev.nextReview}</span>
              </div>
            </div>

            <div className="revision-retention">
              <div className="retention-bar">
                <div
                  className="retention-fill"
                  style={{
                    width: `${rev.retention}%`,
                    background:
                      rev.retention > 80
                        ? '#2E7D32'
                        : rev.retention > 60
                        ? '#F39C12'
                        : '#E74C3C',
                  }}
                ></div>
              </div>
              <span className="retention-text">{rev.retention}% retained</span>
            </div>

            <button className="revision-btn">Review Now</button>
          </div>
        ))}
      </div>

      <div className="revision-tip">
        <p>
          💡 <strong>Spaced Repetition:</strong> Reviewing at the right moment strengthens long-term memory. Trust the schedule.
        </p>
      </div>
    </div>
  );
}

export default SmartRevision;
