import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const SUBJECTS = {
  physics: { name: 'Physics', icon: '⚛️', color: '#0C447C', emoji: '🌌' },
  chemistry: { name: 'Chemistry', icon: '🧪', color: '#3B6D11', emoji: '⚗️' },
  biology: { name: 'Biology', icon: '🧬', color: '#853B3B', emoji: '🦠' },
  ncert: { name: 'NCERT', icon: '📚', color: '#5F5E5A', emoji: '📖' },
  philosophy: { name: 'Philosophy', icon: '🤔', color: '#534AB7', emoji: '💭' },
  geopolitics: { name: 'Geopolitics', icon: '🌍', color: '#1D9E75', emoji: '🗺️' },
  history: { name: 'History', icon: '📜', color: '#BA7517', emoji: '🏛️' },
};

function Dashboard({ user, setScreen, setSelectedSubject, onLogout }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 42 });
  const [questCompleted, setQuestCompleted] = useState(false);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [debtBalance, setDebtBalance] = useState(0);
  const [offTokens, setOffTokens] = useState(2);
  const [streakHistory, setStreakHistory] = useState([
    { day: 'Mon', studied: true },
    { day: 'Tue', studied: true },
    { day: 'Wed', studied: true },
    { day: 'Thu', studied: true },
    { day: 'Fri', studied: true },
    { day: 'Sat', studied: false },
    { day: 'Sun', studied: false },
  ]);

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

  const handleTakeBreak = () => {
    if (offTokens > 0) {
      setOffTokens(offTokens - 1);
      playSound('success');
    } else {
      setDebtBalance(debtBalance + 10);
      playSound('debt');
    }
  };

  const playSound = (type) => {
    console.log(`Sound: ${type}`);
  };

  return (
    <div className="dashboard-new">
      {/* Floating Header */}
      <header className="floating-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-badge">V</div>
            <div className="logo-text">
              <h1>VELORA</h1>
              <p>Learn Differently</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-icon-btn" title="Profile">
              👤
            </button>
            <button className="header-icon-btn" title="Notifications">
              🔔
            </button>
            <button className="header-logout-btn" onClick={onLogout}>
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* ========== HERO SECTION ========== */}
        <section className="hero-section">
          <div className="hero-card gradient-hero-1">
            <div className="hero-glow"></div>
            <div className="hero-content">
              <div className="hero-top">
                <div className="streak-badge">
                  <span className="flame">🔥</span>
                  <span className="streak-number">{currentStreak}</span>
                </div>
                <div className="time-display">
                  <span>Today</span>
                  <p>45 mins</p>
                </div>
              </div>
              <h2>Keep the Momentum</h2>
              <p>You're on fire! 2 more days for a special reward</p>
              <div className="progress-bar-hero">
                <div className="progress-fill-hero" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

          <div className="mini-cards">
            <div className="mini-card card-1">
              <span className="mini-icon">⭐</span>
              <p>2,450</p>
              <span className="mini-label">Points</span>
            </div>
            <div className="mini-card card-2">
              <span className="mini-icon">📊</span>
              <p>87%</p>
              <span className="mini-label">Average</span>
            </div>
            <div className="mini-card card-3">
              <span className="mini-icon">🎯</span>
              <p>#42</p>
              <span className="mini-label">Rank</span>
            </div>
          </div>
        </section>

        {/* ========== DAILY CHALLENGE ========== */}
        <section className="challenge-section">
          <div className="section-header">
            <h3>⚡ Challenge of the Day</h3>
            <span className="challenge-timer">2:18:45</span>
          </div>
          <div className="challenge-card-big">
            <div className="challenge-icon-circle">🧠</div>
            <div className="challenge-content">
              <h4>Black Hole Mastery</h4>
              <p>Answer 5 questions about Event Horizons and Singularities</p>
              <div className="challenge-progress">
                <div className="challenge-bar">
                  <div className="challenge-fill" style={{ width: '60%' }}></div>
                </div>
                <span>3/5</span>
              </div>
            </div>
            <button className="challenge-btn">Start →</button>
          </div>
        </section>

        {/* ========== DOPAMINE DEBT SYSTEM ========== */}
        <section className="dopamine-debt-section">
          <h3 className="section-title">📊 Learning Economy</h3>
          <div className="dopamine-debt-widget">
            <div className="debt-display">
              {debtBalance > 0 ? (
                <div className="debt-card danger">
                  <h4>You Owe</h4>
                  <p className="debt-amount">{debtBalance} XP</p>
                  <p className="debt-desc">Complete a hard session to pay it back</p>
                  <button className="btn-pay-debt">💪 Pay Debt</button>
                </div>
              ) : (
                <div className="debt-card success">
                  <h4>Perfect Balance! 🎯</h4>
                  <p className="debt-amount">0 XP Debt</p>
                  <p className="debt-desc">You're on track with your studies</p>
                </div>
              )}
            </div>

            <div className="off-tokens">
              <h4>🎟️ Break Tokens</h4>
              <p className="token-desc">Use to take a day off without breaking your streak</p>
              <div className="tokens-visual">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`token ${idx < offTokens ? 'available' : 'used'}`}
                    onClick={() => idx < offTokens && handleTakeBreak()}
                  >
                    {idx < offTokens ? '✅' : '✕'}
                  </div>
                ))}
              </div>
            </div>

            <div className="streak-visual">
              <h4>Your Week</h4>
              <div className="streak-days">
                {streakHistory.map((day, idx) => (
                  <div key={idx} className={`day-marker ${day.studied ? 'studied' : 'debt'}`}>
                    <span className="day-label">{day.day}</span>
                    <span className="day-indicator">
                      {day.studied ? '🔥' : '⏳'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== CONTINUE LEARNING ========== */}
        <section className="continue-section">
          <div className="section-header">
            <h3>📚 Continue Learning</h3>
            <a href="#" className="see-all">See all</a>
          </div>
          <div className="continue-scroll">
            <div className="continue-item course-1">
              <div className="course-image-1"></div>
              <h4>Black Holes</h4>
              <p>Space Science</p>
              <div className="course-progress">
                <div className="course-bar">
                  <div className="course-fill" style={{ width: '68%' }}></div>
                </div>
                <span>68%</span>
              </div>
            </div>

            <div className="continue-item course-2">
              <div className="course-image-2"></div>
              <h4>Quantum Mechanics</h4>
              <p>Modern Physics</p>
              <div className="course-progress">
                <div className="course-bar">
                  <div className="course-fill" style={{ width: '0%' }}></div>
                </div>
                <span>0%</span>
              </div>
            </div>

            <div className="continue-item course-3">
              <div className="course-image-3"></div>
              <h4>DNA & Genetics</h4>
              <p>Biology</p>
              <div className="course-progress">
                <div className="course-bar">
                  <div className="course-fill" style={{ width: '45%' }}></div>
                </div>
                <span>45%</span>
              </div>
            </div>

            <div className="continue-item course-4">
              <div className="course-image-4"></div>
              <h4>Relativity</h4>
              <p>Physics</p>
              <div className="course-progress">
                <div className="course-bar">
                  <div className="course-fill" style={{ width: '25%' }}></div>
                </div>
                <span>25%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========== EXPLORE EVERYTHING ========== */}
        <section className="explore-section">
          <div className="section-header">
            <h3>🎓 Explore</h3>
          </div>
          <div className="explore-grid">
            <div className="explore-card exp-1" onClick={() => setScreen('learn')}>
              <div className="exp-icon">📖</div>
              <h4>Learn</h4>
              <p>Master concepts</p>
            </div>

            <div className="explore-card exp-2" onClick={() => setScreen('games')}>
              <div className="exp-icon">🎮</div>
              <h4>Games</h4>
              <p>Learn while playing</p>
            </div>

            <div className="explore-card exp-3" onClick={() => setScreen('challenges')}>
              <div className="exp-icon">🏆</div>
              <h4>Challenges</h4>
              <p>Win rewards</p>
            </div>

            <div className="explore-card exp-4" onClick={() => setScreen('analytics')}>
              <div className="exp-icon">📊</div>
              <h4>Analytics</h4>
              <p>Your progress</p>
            </div>

            <div className="explore-card exp-5" onClick={() => setScreen('dictionary')}>
              <div className="exp-icon">📚</div>
              <h4>Dictionary</h4>
              <p>A-Z concepts</p>
            </div>

            <div className="explore-card exp-6" onClick={() => setScreen('doubts')}>
              <div className="exp-icon">💬</div>
              <h4>Doubts</h4>
              <p>Ask & earn</p>
            </div>

            <div className="explore-card exp-7" onClick={() => setScreen('journey')}>
              <div className="exp-icon">🗺️</div>
              <h4>Journey</h4>
              <p>Your path</p>
            </div>

            <div className="explore-card exp-8" onClick={() => setScreen('community')}>
              <div className="exp-icon">👥</div>
              <h4>Community</h4>
              <p>Connect</p>
            </div>
          </div>
        </section>

        {/* ========== SUBJECTS CAROUSEL ========== */}
        <section className="subjects-section">
          <div className="section-header">
            <h3>🌟 All Subjects</h3>
          </div>
          <div className="subjects-carousel">
            {Object.entries(SUBJECTS).map(([key, subject]) => (
              <div
                key={key}
                className="subject-bubble"
                onClick={() => {
                  setSelectedSubject(key);
                  setScreen('learn');
                }}
              >
                <div className="subject-circle" style={{ borderColor: subject.color }}>
                  <span className="subject-emoji">{subject.emoji}</span>
                </div>
                <p>{subject.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== LEADERBOARD PREVIEW ========== */}
        <section className="leaderboard-section">
          <div className="section-header">
            <h3>🥇 Weekly Leaderboard</h3>
            <a href="#" className="see-all">View all</a>
          </div>
          <div className="leaderboard-cards">
            <div className="lb-card lb-1">
              <div className="lb-rank">🥇</div>
              <div className="lb-info">
                <p className="lb-name">Arjun_Physics</p>
                <p className="lb-points">5420 pts</p>
              </div>
            </div>

            <div className="lb-card lb-2">
              <div className="lb-rank">🥈</div>
              <div className="lb-info">
                <p className="lb-name">Priya_Scholar</p>
                <p className="lb-points">5100 pts</p>
              </div>
            </div>

            <div className="lb-card lb-you">
              <div className="lb-rank">👤</div>
              <div className="lb-info">
                <p className="lb-name">You</p>
                <p className="lb-points">4850 pts</p>
              </div>
              <span className="lb-badge">#3</span>
            </div>
          </div>
        </section>

        {/* ========== ACHIEVEMENTS ========== */}
        <section className="achievements-section">
          <div className="section-header">
            <h3>🎁 Rewards Unlocked</h3>
          </div>
          <div className="achievements-row">
            <div className="achievement-item unlocked">
              <span className="achievement-icon">🔥</span>
              <p>Week Warrior</p>
            </div>
            <div className="achievement-item unlocked">
              <span className="achievement-icon">⭐</span>
              <p>Top Scorer</p>
            </div>
            <div className="achievement-item unlocked">
              <span className="achievement-icon">🚀</span>
              <p>Fast Learner</p>
            </div>
            <div className="achievement-item locked">
              <span className="achievement-icon">👑</span>
              <p>Coming Soon</p>
            </div>
          </div>
        </section>

        {/* Footer Spacing */}
        <div style={{ height: '2rem' }}></div>
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

            <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;