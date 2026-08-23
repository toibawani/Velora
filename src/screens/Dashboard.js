import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const SUBJECTS = {
  physics: { name: 'Physics', icon: '⚛️', color: 'var(--color-physics)', desc: 'Spacetime, Quantum & Mechanics' },
  chemistry: { name: 'Chemistry', icon: '🧪', color: 'var(--color-chemistry)', desc: 'Bonding, Kinetics & Thermodynamics' },
  biology: { name: 'Biology', icon: '🧬', color: 'var(--color-biology)', desc: 'Genetics, Cellular & Neuroscience' },
  ncert: { name: 'NCERT & Core', icon: '📚', color: 'var(--text-secondary)', desc: 'Structured Syllabus Foundation' },
  philosophy: { name: 'Philosophy', icon: '🏛️', color: 'var(--color-philosophy)', desc: 'Epistemology, Logic & Ethics' },
  mathematics: { name: 'Mathematics', icon: '📐', color: 'var(--color-mathematics)', desc: 'Real Analysis, Proofs & Calculus' },
};

function Dashboard({ user, setScreen, setSelectedSubject, onLogout }) {
  const [currentStreak] = useState(7);
  const [debtBalance, setDebtBalance] = useState(0);
  const [offTokens, setOffTokens] = useState(2);
  const [streakHistory] = useState([
    { day: 'Mon', studied: true },
    { day: 'Tue', studied: true },
    { day: 'Wed', studied: true },
    { day: 'Thu', studied: true },
    { day: 'Fri', studied: true },
    { day: 'Sat', studied: true },
    { day: 'Sun', studied: false },
  ]);
  const [showQuestModal, setShowQuestModal] = useState(false);

  const handleTakeBreak = () => {
    if (offTokens > 0) {
      setOffTokens(offTokens - 1);
    } else {
      setDebtBalance(prev => prev + 15);
    }
  };

  return (
    <div className="dashboard-console">
      {/* Top Navbar */}
      <header className="console-navbar">
        <div className="console-nav-inner">
          <div className="console-brand" onClick={() => setScreen('dashboard')}>
            <div className="brand-badge">V</div>
            <div className="brand-details">
              <span className="brand-name">VELORA</span>
              <span className="brand-sub">Academic Workspace</span>
            </div>
          </div>

          <div className="console-nav-actions">
            <button className="console-action-btn" onClick={() => setScreen('community')} title="Discussions">
              Community
            </button>
            <button className="console-action-btn" onClick={() => setScreen('analytics')} title="Progress Analytics">
              Analytics
            </button>
            <button className="console-logout-btn" onClick={onLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="console-main">
        {/* ========== EXECUTIVE METRICS STRIP ========== */}
        <section className="metrics-strip-section">
          <div className="metrics-hero-card">
            <div className="hero-status-row">
              <div className="streak-indicator">
                <span className="streak-badge-fire">🔥 {currentStreak} Days</span>
                <span className="streak-sub">Consistency Streak</span>
              </div>
              <div className="focus-time-display">
                <span className="focus-val">45 mins</span>
                <span className="focus-sub">Daily Deep Focus</span>
              </div>
            </div>

            <div className="hero-progress-block">
              <div className="hero-progress-labels">
                <span>Daily Curriculum Mastery</span>
                <span>70%</span>
              </div>
              <div className="console-progress-track">
                <div className="console-progress-fill" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

          <div className="quick-metrics-grid">
            <div className="metric-cell">
              <span className="cell-label">Mastery Points</span>
              <span className="cell-value">2,450</span>
              <span className="cell-delta positive">+180 today</span>
            </div>
            <div className="metric-cell">
              <span className="cell-label">Retention Index</span>
              <span className="cell-value">91.4%</span>
              <span className="cell-delta neutral">Top quartile</span>
            </div>
            <div className="metric-cell">
              <span className="cell-label">Global Standing</span>
              <span className="cell-value">#42</span>
              <span className="cell-delta positive">▲ 3 spots</span>
            </div>
          </div>
        </section>

        {/* ========== ACTIVE CHALLENGE & DEBT ECONOMY ========== */}
        <section className="workspace-twin-grid">
          {/* Daily Inquiry Challenge */}
          <div className="console-card challenge-widget">
            <div className="card-header-row">
              <h2 className="card-title">Curriculum Challenge</h2>
              <span className="timer-tag">2h 18m left</span>
            </div>
            <p className="widget-desc">
              <strong>Black Hole Mastery:</strong> Resolve 5 rigorous paradoxes regarding event horizon coordinate transforms and Penrose processes.
            </p>
            <div className="challenge-status-bar">
              <div className="console-progress-track">
                <div className="console-progress-fill" style={{ width: '60%' }}></div>
              </div>
              <span className="status-ratio">3/5 Completed</span>
            </div>
            <button className="console-btn-primary" onClick={() => setShowQuestModal(true)}>
              Continue Assessment →
            </button>
          </div>

          {/* Focus & Rest Discipline System */}
          <div className="console-card economy-widget">
            <div className="card-header-row">
              <h2 className="card-title">Focus & Rest Discipline</h2>
              <span className="status-badge-neutral">System Active</span>
            </div>

            <div className="economy-content-row">
              <div className="tokens-container">
                <span className="section-micro-label">Rest Tokens</span>
                <div className="token-pills-row">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      className={`token-pill ${idx < offTokens ? 'available' : 'spent'}`}
                      onClick={() => idx < offTokens && handleTakeBreak()}
                      title={idx < offTokens ? 'Use rest token' : 'Token spent'}
                    >
                      {idx < offTokens ? 'Token Active' : 'Used'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="debt-indicator-box">
                <span className="section-micro-label">Dopamine Debt</span>
                <span className={`debt-status-value ${debtBalance > 0 ? 'in-debt' : 'balanced'}`}>
                  {debtBalance > 0 ? `${debtBalance} XP Due` : '0 Debt (Optimal)'}
                </span>
              </div>
            </div>

            <div className="week-timeline-strip">
              <span className="section-micro-label">Weekly Activity</span>
              <div className="days-strip">
                {streakHistory.map((d, i) => (
                  <div key={i} className={`day-chip ${d.studied ? 'active' : 'inactive'}`}>
                    <span className="day-name">{d.day}</span>
                    <span className="day-dot"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== CORE SUBJECT CURRICULUM ========== */}
        <section className="curriculum-section">
          <div className="section-heading-row">
            <h2 className="section-title">Core Academic Disciplines</h2>
            <button className="section-link-btn" onClick={() => setScreen('learn')}>
              View All Modules →
            </button>
          </div>

          <div className="subjects-grid-layout">
            {Object.entries(SUBJECTS).map(([key, sub]) => (
              <div
                key={key}
                className="subject-entry-card"
                onClick={() => {
                  setSelectedSubject(key);
                  setScreen('learn');
                }}
              >
                <div className="subject-card-head">
                  <span className="subject-symbol">{sub.icon}</span>
                  <span className="subject-name">{sub.name}</span>
                </div>
                <p className="subject-description">{sub.desc}</p>
                <div className="subject-footer">
                  <span className="launch-text">Launch Syllabus</span>
                  <span className="arrow-icon">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== NAVIGATION MODULES ========== */}
        <section className="explore-modules-section">
          <div className="section-heading-row">
            <h2 className="section-title">Workspace Navigation</h2>
          </div>

          <div className="workspace-nav-grid">
            {[
              { id: 'learn', label: 'Structured Lessons', icon: '📖', sub: 'Chapter index' },
              { id: 'community', label: 'Peer Discussions', icon: '👥', sub: 'Research rooms' },
              { id: 'challenges', label: 'Academic Sprints', icon: '🏆', sub: 'Timed trials' },
              { id: 'analytics', label: 'Progress Metrics', icon: '📊', sub: 'Mastery graphs' },
              { id: 'dictionary', label: 'Concept Lexicon', icon: '📚', sub: 'A-Z definitions' },
              { id: 'doubts', label: 'Inquiry Resolver', icon: '💬', sub: 'Context tutor' },
            ].map(item => (
              <div
                key={item.id}
                className="nav-module-card"
                onClick={() => setScreen(item.id)}
              >
                <span className="module-icon">{item.icon}</span>
                <div className="module-details">
                  <span className="module-title">{item.label}</span>
                  <span className="module-sub">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Quest Modal */}
      {showQuestModal && (
        <div className="console-modal-overlay" onClick={() => setShowQuestModal(false)}>
          <div className="console-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title">Concept Verification: Event Horizon</h3>
              <button className="modal-close-btn" onClick={() => setShowQuestModal(false)}>✕</button>
            </div>
            <p className="modal-prompt">
              Question 3 of 5: Why does gravitational time dilation approach infinity at the Schwarzschild radius for an external stationary observer?
            </p>
            <div className="modal-options-stack">
              <button className="modal-option-btn">
                Because paths in spacetime rotate until the time coordinate aligns asymptotically with null geodesics
              </button>
              <button className="modal-option-btn">
                Because space ceases to exist inside the radius
              </button>
              <button className="modal-option-btn">
                Because electromagnetic waves are accelerated beyond c
              </button>
            </div>
            <button className="console-btn-primary full-width" onClick={() => setShowQuestModal(false)}>
              Submit Formulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;