import React, { useState } from 'react';
import DailySpark from '../components/DailySpark';
import '../styles/UniverseHome.css';

function UniverseHome({ user, setScreen, setSelectedSubject, onLogout }) {
  const [hoveredSubject, setHoveredSubject] = useState(null);

  const subjects = [
    {
      id: 'physics',
      name: 'Physics',
      emoji: '⚛️',
      color: '#667eea',
      description: 'Master the laws of the universe',
      icon: '🌌',
    },
    {
      id: 'philosophy',
      name: 'Philosophy',
      emoji: '🤔',
      color: '#2E7D32',
      description: 'Explore the big questions',
      icon: '💭',
    },
    {
      id: 'history',
      name: 'History',
      emoji: '📜',
      color: '#F39C12',
      description: 'Understand how we got here',
      icon: '🏛️',
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
        <div className="uh-header-right">
          <span className="uh-user">{user?.name || 'Learner'}</span>
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
          <h2 className="uh-subjects-title">Choose Your Learning Path</h2>
          <div className="uh-subjects-grid">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="uh-subject-card"
                onMouseEnter={() => setHoveredSubject(subject.id)}
                onMouseLeave={() => setHoveredSubject(null)}
                onClick={() => handleSubjectClick(subject.id)}
              >
                <div
                  className="card-header"
                  style={{
                    borderColor: subject.color,
                    background: `${subject.color}08`,
                  }}
                >
                  <span className="card-emoji">{subject.emoji}</span>
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
                  Start Learning →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section className="uh-social-proof">
          <h2 className="uh-section-title">What Others Are Learning</h2>
          <div className="proof-stats">
            <div className="stat">
              <span className="stat-number">5,247</span>
              <span className="stat-label">Students mastered Physics</span>
            </div>
            <div className="stat">
              <span className="stat-number">142K</span>
              <span className="stat-label">Total hours of learning</span>
            </div>
            <div className="stat">
              <span className="stat-number">87%</span>
              <span className="stat-label">Would recommend VELORA</span>
            </div>
          </div>
        </section>

        {/* Trending */}
        <section className="uh-trending">
          <h2 className="uh-section-title">Trending This Week</h2>
          <div className="trending-list">
            <div className="trending-item">
              <span className="trending-icon">🌌</span>
              <div className="trending-content">
                <h4 className="trending-title">Black Holes Masterclass</h4>
                <p className="trending-desc">2,847 students started</p>
              </div>
            </div>
            <div className="trending-item">
              <span className="trending-icon">💭</span>
              <div className="trending-content">
                <h4 className="trending-title">Ancient Philosophy</h4>
                <p className="trending-desc">1,523 students completed</p>
              </div>
            </div>
            <div className="trending-item">
              <span className="trending-icon">📜</span>
              <div className="trending-content">
                <h4 className="trending-title">Renaissance & Art</h4>
                <p className="trending-desc">934 students learning</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UniverseHome;