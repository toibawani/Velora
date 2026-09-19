import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Atom, Brain, Landmark, Sun, Moon, Lightbulb, ArrowRight } from 'lucide-react';
import '../styles/PersonalizedDashboard.css';

function PersonalizedDashboard({ selectedSubject, setSelectedSubject, setScreen, loading = false }) {
  const [recommendations] = useState([
    {
      id: 1,
      icon: Atom,
      title: 'Continue: Quantum Mechanics',
      progress: 65,
      time: '8 min left',
      color: 'var(--color-accent)',
    },
    {
      id: 2,
      icon: Brain,
      title: 'Start: Stoicism & Epistemology',
      progress: 0,
      time: '12 min',
      color: 'var(--color-accent)',
    },
    {
      id: 3,
      icon: Landmark,
      title: 'Review: Renaissance Catalysts',
      progress: 100,
      time: 'Review due tomorrow',
      color: 'var(--color-accent)',
    },
  ]);

  const handleStartLearning = (subject) => {
    setSelectedSubject(subject.id || 'physics');
    setScreen('learn');
  };

  if (loading) {
    return (
      <div className="personalized-dashboard">
        <div className="dashboard-header">
          <div className="skeleton skeleton-title" style={{ width: '220px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '340px' }}></div>
        </div>
        <div className="recommendations-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card skeleton">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="personalized-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Recommended For You</h2>
        <p className="dashboard-subtitle">Calibrated to your retention curves and active pathways</p>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((rec, index) => {
          const RecIcon = rec.icon;
          return (
            <motion.div
              key={rec.id}
              className="recommendation-card"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, delay: index * 0.05, ease: 'easeOut' }}
            >
              <div className="rec-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <RecIcon size={20} strokeWidth={1.5} color="var(--color-accent)" />
              </div>

              <div className="rec-content">
                <h3 className="rec-title">{rec.title}</h3>
                <p className="rec-time">{rec.time}</p>
              </div>

              <div className="rec-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${rec.progress}%`, background: 'var(--color-accent)' }}
                  ></div>
                </div>
                <span className="progress-text">{rec.progress}%</span>
              </div>

              <button
                className="rec-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleStartLearning(rec)}
              >
                <span>Explore</span>
                <ArrowRight size={13} strokeWidth={1.5} />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="learning-style">
        <h3 className="learning-style-title">Your Peak Cognitive Hours</h3>
        <div className="hours-display">
          <div className="hour-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Sun size={16} strokeWidth={1.5} color="var(--color-accent)" />
            <span className="hour-label">Peak: 2:00 PM – 4:00 PM</span>
          </div>
          <div className="hour-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Moon size={16} strokeWidth={1.5} color="var(--color-accent)" />
            <span className="hour-label">Secondary: 7:00 PM – 9:00 PM</span>
          </div>
        </div>
        <p className="learning-tip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lightbulb size={14} strokeWidth={1.5} color="var(--color-accent)" />
          <span>Schedule dense conceptual derivations during peak hours for maximum retention</span>
        </p>
      </div>
    </div>
  );
}

export default PersonalizedDashboard;