import React, { useState } from 'react';
import DailySpark from '../components/DailySpark';
import SocialProof from '../components/SocialProof';
import ReferralModal from '../components/ReferralModal';
import '../styles/UniverseHome.css';

/**
 * UniverseHome Screen
 * 
 * Central dashboard designed with Apple/Notion clarity. Focuses on personal
 * learning momentum, quick domain entry, and live community activity.
 */
function UniverseHome({ user, setScreen, setSelectedSubject, onLogout }) {
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [showReferral, setShowReferral] = useState(false);

  const subjects = [
    {
      id: 'physics',
      name: 'Physics',
      emoji: '⚛️',
      color: '#4f7df3',
      description: 'Master the fundamental laws governing spacetime, relativity, and quantum systems',
      icon: '🌌',
      progress: '65% complete'
    },
    {
      id: 'philosophy',
      name: 'Philosophy',
      emoji: '🤔',
      color: '#af52de',
      description: 'Explore epistemology, ethical frameworks, and the philosophy of science',
      icon: '💭',
      progress: '45% complete'
    },
    {
      id: 'history',
      name: 'History',
      emoji: '📜',
      color: '#ff9f0a',
      description: 'Understand the civilizational catalysts and scientific revivals shaping humanity',
      icon: '🏛️',
      progress: '80% complete'
    },
  ];

  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    setScreen('learn');
  };

  return (
    <div className="universe-home">
      {/* Header */}
      <header className="uh-header">
        <div className="uh-header-left">
          <h1 className="uh-title">VELORA</h1>
          <p className="uh-tagline">Your Personal Knowledge Universe</p>
        </div>

        {/* Quick Nav Bar */}
        <nav className="uh-nav-links">
          <button className="uh-nav-item active" onClick={() => setScreen('universe')}>
            Home
          </button>
          <button className="uh-nav-item" onClick={() => { setSelectedSubject('physics'); setScreen('learn'); }}>
            Learn
          </button>
          <button className="uh-nav-item" onClick={() => setScreen('games')}>
            Flow Games
          </button>
          <button className="uh-nav-item" onClick={() => setScreen('analytics')}>
            Analytics
          </button>
          <button className="uh-nav-item" onClick={() => setScreen('community')}>
            Community
          </button>
          <button className="uh-nav-item" onClick={() => setScreen('challenges')}>
            Challenges
          </button>
        </nav>

        <div className="uh-header-right">
          <button className="uh-invite-btn" onClick={() => setShowReferral(true)}>
            🎁 Invite a Friend
          </button>
          <span className="uh-user">{user?.name || 'Explorer'}</span>
          <button className="uh-logout" onClick={onLogout}>
            Exit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="uh-main">
        {/* Daily Spark */}
        <section className="uh-daily-spark">
          <DailySpark />
        </section>

        {/* Subject Cards */}
        <section className="uh-subjects">
          <div className="section-header-row">
            <div>
              <h2 className="uh-subjects-title">Choose Your Domain</h2>
              <p className="uh-subjects-subtitle">
                Select a pathway to explore interactive canvases, deep curriculum, and flow challenges.
              </p>
            </div>
          </div>

          <div className="uh-subjects-grid">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="uh-subject-card"
                onMouseEnter={() => setHoveredSubject(subject.id)}
                onMouseLeave={() => setHoveredSubject(null)}
                onClick={() => handleSubjectClick(subject.id)}
                style={{
                  borderColor: hoveredSubject === subject.id ? subject.color : undefined
                }}
              >
                <div
                  className="card-header"
                  style={{
                    borderColor: subject.color,
                    background: `${subject.color}10`,
                  }}
                >
                  <span className="card-emoji">{subject.emoji}</span>
                  <span className="card-progress-tag" style={{ color: subject.color }}>
                    {subject.progress}
                  </span>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{subject.name}</h3>
                  <p className="card-description">{subject.description}</p>
                </div>
                <button
                  className="card-cta"
                  style={{
                    background: subject.color,
                  }}
                >
                  Explore Domain →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Live Social Proof & Activity Dashboard */}
        <section className="uh-social-section">
          <h2 className="uh-section-title">Community & Momentum</h2>
          <SocialProof onSelectTopic={() => { setSelectedSubject('physics'); setScreen('learn'); }} />
        </section>
      </main>

      {/* Referral Modal */}
      <ReferralModal
        isOpen={showReferral}
        onClose={() => setShowReferral(false)}
        userName={user?.name}
      />
    </div>
  );
}

export default UniverseHome;