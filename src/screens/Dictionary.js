import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const SUBJECTS = {
  physics: { name: 'Physics', icon: '⚛️', color: '#0C447C' },
  chemistry: { name: 'Chemistry', icon: '🧪', color: '#3B6D11' },
  biology: { name: 'Biology NCERT', icon: '🧬', color: '#853B3B' },
  ncert: { name: 'NCERT Explanations', icon: '📚', color: '#5F5E5A' },
  philosophy: { name: 'Philosophy', icon: '🤔', color: '#534AB7' },
  geopolitics: { name: 'Geopolitics', icon: '🌍', color: '#1D9E75' },
  history: { name: 'World History', icon: '📜', color: '#BA7517' },
};

function Dashboard({ user, setScreen, setSelectedSubject, onLogout }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 42 });
  const [questCompleted, setQuestCompleted] = useState(false);
  const [showQuestModal, setShowQuestModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.minutes === 0) {
          return { hours: prev.hours - 1, minutes: 59 };
        }
        return { ...prev, minutes: prev.minutes - 1 };
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard">
      {/* Sticky Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-top">
            <div className="header-left">
              <h1 className="velora-logo">✨ VELORA</h1>
              <p className="tagline">Master Knowledge, Master Life</p>
            </div>
            <div className="header-right">
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-level">Level 5</span>
              </div>
              <div className="header-buttons">
                <button className="icon-btn" title="Settings">⚙️</button>
                <button className="icon-btn" title="Notifications">🔔</button>
                <button className="btn btn-logout" onClick={onLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          
          {/* ========== SECTION 1: Daily Brain Quest ========== */}
          <section className="daily-quest-section">
            <div className="quest-card premium-gradient">
              <div className="quest-header">
                <div className="quest-title-section">
                  <span className="quest-icon">🧠</span>
                  <div>
                    <h2>Daily Brain Quest</h2>
                    <p className="quest-subtitle">Complete today's challenge for 2x XP!</p>
                  </div>
                </div>
                <div className="quest-timer">
                  <span className="timer-icon">⏱️</span>
                  <span className="timer-text">{timeLeft.hours}h {timeLeft.minutes}m left</span>
                </div>
              </div>

              <div className="quest-content">
                <div className="quest-today">
                  <h3>Today's Challenge</h3>
                  <p className="quest-challenge-text">
                    "Answer 5 questions on Black Holes & earn 100 bonus coins"
                  </p>
                </div>

                <div className="quest-progress">
                  <div className="progress-info">
                    <span>Progress</span>
                    <span className="progress-val">3/5</span>
                  </div>
                  <div className="progress-bar-large">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="quest-rewards">
                  <div className="reward-item">
                    <span className="reward-icon">⭐</span>
                    <span>75 XP</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-icon">💎</span>
                    <span>100 Coins</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-icon">🏆</span>
                    <span>Streak Badge</span>
                  </div>
                </div>

                <button 
                  className="btn btn-quest"
                  onClick={() => setShowQuestModal(true)}
                >
                  Continue Quest →
                </button>
              </div>

              <div className="quest-footer">
                <p>🔥 7-day streak active! Don't break it today</p>
              </div>
            </div>
          </section>

          {/* ========== SECTION 2: Quick Stats ========== */}
          <section className="stats-section">
            <h3 className="section-title">Your Learning Stats</h3>
            <div className="stats-grid">
              <div className="stat-card-premium">
                <div className="stat-icon-bg fire">🔥</div>
                <div className="stat-content">
                  <p className="stat-label">Current Streak</p>
                  <p className="stat-value">7 days</p>
                  <p className="stat-subtitle">+1 more for badge!</p>
                </div>
              </div>

              <div className="stat-card-premium">
                <div className="stat-icon-bg time">⏱️</div>
                <div className="stat-content">
                  <p className="stat-label">Study Time</p>
                  <p className="stat-value">24.5 hrs</p>
                  <p className="stat-subtitle">This week</p>
                </div>
              </div>

              <div className="stat-card-premium">
                <div className="stat-icon-bg check">✅</div>
                <div className="stat-content">
                  <p className="stat-label">Topics Done</p>
                  <p className="stat-value">12</p>
                  <p className="stat-subtitle">Mastered</p>
                </div>
              </div>

              <div className="stat-card-premium">
                <div className="stat-icon-bg trophy">🏆</div>
                <div className="stat-content">
                  <p className="stat-label">Rank Position</p>
                  <p className="stat-value">#45</p>
                  <p className="stat-subtitle">In community</p>
                </div>
              </div>
            </div>
          </section>

          {/* ========== SECTION 3: Continue Learning ========== */}
          <section className="continue-section">
            <h3 className="section-title">Continue Your Journey</h3>
            <div className="continue-cards">
              <div className="continue-card active">
                <div className="card-badge">In Progress</div>
                <h4>Black Holes Deep Dive</h4>
                <p className="course-subtitle">Space Science</p>
                <div className="mini-progress">
                  <div className="mini-bar">
                    <div className="mini-fill" style={{ width: '68%' }}></div>
                  </div>
                  <span className="mini-percent">68%</span>
                </div>
                <button className="btn btn-small" onClick={() => { setSelectedSubject('physics'); setScreen('learn'); }}>
                  Resume →
                </button>
              </div>

              <div className="continue-card">
                <div className="card-badge">Next Up</div>
                <h4>Quantum Mechanics 101</h4>
                <p className="course-subtitle">Modern Physics</p>
                <div className="mini-progress">
                  <div className="mini-bar">
                    <div className="mini-fill" style={{ width: '0%' }}></div>
                  </div>
                  <span className="mini-percent">0%</span>
                </div>
                <button className="btn btn-small" onClick={() => { setSelectedSubject('physics'); setScreen('learn'); }}>
                  Start →
                </button>
              </div>

              <div className="continue-card">
                <div className="card-badge">Weak Area</div>
                <h4>Relativity Theory</h4>
                <p className="course-subtitle">Modern Physics</p>
                <div className="mini-progress weak">
                  <div className="mini-bar">
                    <div className="mini-fill" style={{ width: '35%' }}></div>
                  </div>
                  <span className="mini-percent">35%</span>
                </div>
                <button className="btn btn-small weak" onClick={() => setScreen('analytics')}>
                  Improve →
                </button>
              </div>
            </div>
          </section>

          {/* ========== SECTION 4: Quick Actions ========== */}
          <section className="quick-actions-section">
            <h3 className="section-title">Quick Access</h3>
            <div className="actions-grid">
              <div className="action-card" onClick={() => setScreen('analytics')}>
                <div className="action-icon">📊</div>
                <h4>Analytics</h4>
                <p>Your learning breakdown</p>
              </div>

              <div className="action-card" onClick={() => setScreen('challenges')}>
                <div className="action-icon">🏆</div>
                <h4>Challenges</h4>
                <p>Win rewards & climb ranks</p>
              </div>

              <div className="action-card" onClick={() => setScreen('games')}>
                <div className="action-icon">🎮</div>
                <h4>Games</h4>
                <p>Learn while playing</p>
              </div>

              <div className="action-card" onClick={() => setScreen('dictionary')}>
                <div className="action-icon">📖</div>
                <h4>Dictionary</h4>
                <p>A-Z concept explorer</p>
              </div>

              <div className="action-card" onClick={() => setScreen('doubts')}>
                <div className="action-icon">💬</div>
                <h4>Doubts</h4>
                <p>Ask & earn coins</p>
              </div>

              <div className="action-card" onClick={() => setScreen('journey')}>
                <div className="action-icon">🗺️</div>
                <h4>Journey</h4>
                <p>Your learning path</p>
              </div>

              <div className="action-card" onClick={() => setScreen('glossary')}>
                <div className="action-icon">📚</div>
                <h4>Glossary</h4>
                <p>Quick reference</p>
              </div>

              <div className="action-card" onClick={() => setScreen('community')}>
                <div className="action-icon">👥</div>
                <h4>Community</h4>
                <p>Connect & discuss</p>
              </div>
            </div>
          </section>

          {/* ========== SECTION 5: Today's Achievements ========== */}
          <section className="achievements-section">
            <h3 className="section-title">Achievements Unlocked</h3>
            <div className="achievements-carousel">
              <div className="achievement-badge">
                <span className="badge-icon">🔥</span>
                <p>Week Warrior</p>
              </div>
              <div className="achievement-badge">
                <span className="badge-icon">⭐</span>
                <p>Top Scorer</p>
              </div>
              <div className="achievement-badge">
                <span className="badge-icon">📈</span>
                <p>Growth Master</p>
              </div>
              <div className="achievement-badge locked">
                <span className="badge-icon">🎯</span>
                <p>Locked</p>
              </div>
            </div>
          </section>

          {/* ========== SECTION 6: Subjects Grid ========== */}
          <section className="subjects-section">
            <h3 className="section-title">All Subjects</h3>
            <div className="subjects-grid">
              {Object.entries(SUBJECTS).map(([key, subject]) => (
                <div 
                  key={key} 
                  className="subject-card-modern"
                  onClick={() => {
                    setSelectedSubject(key);
                    setScreen('learn');
                  }}
                  style={{ borderTopColor: subject.color }}
                >
                  <div className="subject-icon-large">{subject.icon}</div>
                  <h4>{subject.name}</h4>
                  <p>Explore topics</p>
                  <div className="subject-arrow">→</div>
                </div>
              ))}
            </div>
          </section>

          {/* ========== SECTION 7: Leaderboard Preview ========== */}
          <section className="leaderboard-preview">
            <h3 className="section-title">🥇 Weekly Leaderboard</h3>
            <div className="leaderboard-mini">
              {[
                { rank: 1, name: 'Arjun_Physics', points: 5420, you: false },
                { rank: 2, name: 'Priya_Scholar', points: 5100, you: false },
                { rank: 3, name: 'You', points: 4850, you: true },
              ].map((entry) => (
                <div key={entry.rank} className={`leaderboard-row ${entry.you ? 'highlight' : ''}`}>
                  <span className="rank-badge">{entry.rank}</span>
                  <span className="name">{entry.name}</span>
                  <span className="points">{entry.points} pts</span>
                </div>
              ))}
            </div>
            <button className="btn btn-view-all" onClick={() => setScreen('challenges')}>
              View Full Leaderboard →
            </button>
          </section>

        </div>
      </main>

      {/* Quest Modal */}
      {showQuestModal && (
        <div className="modal-overlay" onClick={() => setShowQuestModal(false)}>
          <div className="quest-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQuestModal(false)}>✕</button>
            <h2>🧠 Daily Brain Quest</h2>
            <p className="modal-subtitle">Complete 2 more questions to finish today's quest!</p>
            
            <div className="quest-question">
              <h4>Question 3 of 5</h4>
              <p className="question-text">What is an event horizon?</p>
              <div className="quest-options">
                <button className="quest-option">The boundary of a black hole</button>
                <button className="quest-option">A type of star</button>
                <button className="quest-option">A cosmic event</button>
                <button className="quest-option">A time period</button>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;