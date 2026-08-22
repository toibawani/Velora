import React, { useState } from 'react';
import '../styles/UniverseHome.css';

function UniverseHome({ user, setScreen, setSelectedSubject, onLogout }) {
  const subjects = [
    {
      id: 'physics',
      name: 'Physics',
      emoji: '⚛️',
      color: '#667eea',
      description: 'Master the laws of the universe',
    },
    {
      id: 'philosophy',
      name: 'Philosophy',
      emoji: '🤔',
      color: '#2E7D32',
      description: 'Explore the big questions',
    },
    {
      id: 'history',
      name: 'History',
      emoji: '📜',
      color: '#F39C12',
      description: 'Understand how we got here',
    },
  ];

  return (
    <div className="universe-home">
      {/* Header */}
      <header className="uh-header">
        <div className="uh-header-left">
          <h1 className="uh-title">VELORA</h1>
          <p className="uh-tagline">Your Personal Knowledge Universe</p>
        </div>
        <div className="uh-header-right">
          <span className="uh-user">{user?.name}</span>
          <button className="uh-logout" onClick={onLogout}>Exit</button>
        </div>
      </header>
      import DailySpark from '../components/DailySpark';

// Inside main, before subjects section:
<section className="uh-daily-spark">
  <DailySpark />
</section>

      {/* Main Content */}
      <main className="uh-main">
        {/* Daily Spark */}
        <section className="uh-daily-spark">
          <div className="spark-card">
            <div className="spark-icon">💡</div>
            <div className="spark-content">
              <h3 className="spark-title">Today's Learning Spark</h3>
              <p className="spark-fact">
                Light takes 8 minutes to reach Earth from the Sun. 
                Explore the universe's incredible distances →
              </p>
            </div>
            <button className="spark-btn">Learn More</button>
          </div>
        </section>

        {/* Subject Cards */}
        <section className="uh-subjects">
          <h2 className="uh-subjects-title">Choose Your Path</h2>
          <div className="uh-subjects-grid">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="uh-subject-card"
                onClick={() => {
                  setSelectedSubject(subject.id);
                  setScreen('learn');
                }}
              >
                <div className="card-header" style={{ borderColor: subject.color }}>
                  <span className="card-emoji">{subject.emoji}</span>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{subject.name}</h3>
                  <p className="card-description">{subject.description}</p>
                </div>
                <button className="card-cta">Start Learning →</button>
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
      </main>
    </div>
  );
}

export default UniverseHome;