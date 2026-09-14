import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, RotateCcw, Lightbulb } from 'lucide-react';
import '../styles/SmartRevision.css';

function SmartRevision({ selectedSubject }) {
  const [revisions] = useState([
    {
      topic: 'Event Horizon Mechanics',
      nextReview: 'Tomorrow, 2:00 PM',
      difficulty: 'Medium',
      retention: 65,
    },
    {
      topic: 'Gravitational Singularity',
      nextReview: 'In 3 days',
      difficulty: 'Dense',
      retention: 45,
    },
    {
      topic: "Inertial Frames & Conservation Laws",
      nextReview: 'In 7 days',
      difficulty: 'Core',
      retention: 92,
    },
  ]);

  return (
    <div className="smart-revision">
      <div className="revision-header">
        <h2 className="revision-title">Cognitive Spaced Revision</h2>
        <p className="revision-desc">Optimal recall intervals calculated from your active retrieval scores</p>
      </div>

      <div className="revision-list">
        {revisions.map((rev, idx) => (
          <motion.div
            key={idx}
            className="revision-item"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -1 }}
            transition={{ duration: 0.18, delay: idx * 0.04, ease: 'easeOut' }}
          >
            <div className="revision-info">
              <h4 className="revision-topic">{rev.topic}</h4>
              <div className="revision-meta">
                <span className="meta-badge">{rev.difficulty}</span>
                <span className="meta-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} strokeWidth={1.5} color="var(--color-text-muted)" />
                  <span>{rev.nextReview}</span>
                </span>
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
                        ? 'var(--color-accent)'
                        : rev.retention > 60
                        ? 'var(--color-accent)'
                        : 'var(--color-text-muted)',
                  }}
                ></div>
              </div>
              <span className="retention-text">{rev.retention}% estimated recall</span>
            </div>

            <button
              className="revision-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={13} strokeWidth={1.5} />
              <span>Review</span>
            </button>
          </motion.div>
        ))}
      </div>

      <div className="revision-tip">
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={16} strokeWidth={1.5} color="var(--color-accent)" />
          <span><strong>Spaced Repetition:</strong> Timed retrieval strengthening synaptic retention at the inflection point of the Ebbinghaus forgetting curve.</span>
        </p>
      </div>
    </div>
  );
}

export default SmartRevision;
