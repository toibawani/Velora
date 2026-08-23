import React, { useState } from 'react';
import '../styles/SocialProof.css';

/**
 * SocialProof Component
 * 
 * Demonstrates live global learning momentum, social validation, trending
 * topics, and weekly learner leaderboards without toxic gamification.
 */
function SocialProof({ onSelectTopic }) {
  const [kudosGiven, setKudosGiven] = useState({});

  const trendingTopics = [
    {
      id: 'time-nature',
      title: 'Why Time Exists: Entropy & Gravitational Arrows',
      domain: 'Philosophy & Physics',
      learnersCount: '1,842 learners today',
      icon: '⏳',
      color: '#4f7df3'
    },
    {
      id: 'holographic-universe',
      title: 'The Holographic Principle & AdS/CFT Correspondence',
      domain: 'Theoretical Physics',
      learnersCount: '1,247 mastered this month',
      icon: '🌌',
      color: '#af52de'
    },
    {
      id: 'determinism-free-will',
      title: 'Determinism vs. Free Will in Quantum Mechanics',
      domain: 'Philosophy of Science',
      learnersCount: '928 active discussions',
      icon: '🧠',
      color: '#34c759'
    }
  ];

  const topLearners = [
    { rank: 1, name: 'Elena R.', domain: 'Astrophysics & Cosmology', streak: '24 days', completions: '18 modules' },
    { rank: 2, name: 'Marcus K.', domain: 'Classical & Stoic Philosophy', streak: '19 days', completions: '15 modules' },
    { rank: 3, name: 'Aarav P.', domain: 'Quantum Mechanics & Relativity', streak: '17 days', completions: '14 modules' },
    { rank: 4, name: 'Sophia L.', domain: 'Ancient World History', streak: '14 days', completions: '12 modules' },
    { rank: 5, name: 'Tariq M.', domain: 'Epistemology & Logic', streak: '12 days', completions: '10 modules' }
  ];

  const toggleKudos = (index) => {
    setKudosGiven(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="social-proof-dashboard">
      {/* Live Global Activity Bar */}
      <div className="live-pulse-banner">
        <div className="live-pulse-indicator">
          <span className="pulsing-dot"></span>
          <span className="live-pulse-text">
            <strong>1,247 students</strong> mastered Black Holes & Relativity this month · <strong>340+</strong> studying right now
          </span>
        </div>
      </div>

      <div className="social-proof-grid">
        {/* Trending Explorations */}
        <div className="social-card trending-card">
          <div className="social-card-header">
            <h3 className="social-card-title">🔥 Trending Deep Dives</h3>
            <span className="social-card-badge">Live Community Momentum</span>
          </div>

          <div className="trending-cards-stack">
            {trendingTopics.map((topic) => (
              <div
                key={topic.id}
                className="trending-topic-row"
                onClick={() => onSelectTopic && onSelectTopic(topic.id)}
              >
                <div className="topic-icon-frame" style={{ background: `${topic.color}15`, color: topic.color }}>
                  {topic.icon}
                </div>
                <div className="topic-details">
                  <h4 className="topic-row-title">{topic.title}</h4>
                  <div className="topic-sub-meta">
                    <span className="topic-domain-tag">{topic.domain}</span>
                    <span className="topic-learners-stat">· {topic.learnersCount}</span>
                  </div>
                </div>
                <span className="topic-arrow-cta">→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Spotlight & Top Learners */}
        <div className="social-card leaderboard-card">
          <div className="social-card-header">
            <h3 className="social-card-title">🏆 Weekly Dedicated Learners</h3>
            <span className="social-card-badge">Top Consistency</span>
          </div>

          <div className="leaderboard-list">
            {topLearners.map((learner, idx) => (
              <div key={idx} className="leaderboard-row">
                <div className="learner-rank-col">
                  <span className={`rank-number rank-${learner.rank}`}>#{learner.rank}</span>
                </div>
                <div className="learner-meta-col">
                  <div className="learner-name-line">
                    <span className="learner-name">{learner.name}</span>
                    <span className="learner-streak">🔥 {learner.streak} streak</span>
                  </div>
                  <span className="learner-focus">{learner.domain} · {learner.completions}</span>
                </div>
                <button
                  className={`kudos-btn ${kudosGiven[idx] ? 'kudos-active' : ''}`}
                  onClick={() => toggleKudos(idx)}
                >
                  {kudosGiven[idx] ? '👏 Applauded' : '👏 Kudos'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialProof;
