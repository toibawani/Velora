import React, { useState } from 'react';
import { getRevisionSchedule, calculateOverallRetention, markConceptReviewed } from '../utils/revisionEngine';
import '../styles/RevisionPlanner.css';

/**
 * RevisionPlanner Component
 * 
 * Implements an intelligent Spaced Repetition Engine powered by learning curve
 * heuristics. Detects topics where the learner hesitated and builds automated,
 * scientifically timed recall sessions.
 */
function RevisionPlanner({ onBack }) {
  const [schedule, setSchedule] = useState(getRevisionSchedule());
  const [activeTab, setActiveTab] = useState('all');
  const [reviewedId, setReviewedId] = useState(null);

  const overallRetention = calculateOverallRetention(schedule);

  const handleReviewNow = (conceptId) => {
    const updated = markConceptReviewed(conceptId);
    setSchedule([...updated]);
    setReviewedId(conceptId);
    setTimeout(() => setReviewedId(null), 3000);
  };

  const filteredItems = activeTab === 'all'
    ? schedule
    : schedule.filter(item => activeTab === 'due' ? item.status === 'due-soon' : item.status === 'optimal');

  return (
    <div className="revision-module-wrapper">
      {/* Header */}
      <header className="revision-nav-bar">
        <button className="revision-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1 className="revision-title">Intelligent Revision Engine</h1>
        <div style={{ width: '60px' }}></div>
      </header>

      <main className="revision-main-content">
        {/* Retention Score Hero Banner */}
        <section className="retention-score-hero">
          <div className="retention-score-circle">
            <span className="retention-pct-large">{overallRetention}%</span>
            <span className="retention-lbl">Global Retention</span>
          </div>

          <div className="retention-summary-copy">
            <h2 className="summary-headline">Memory Consolidation: High</h2>
            <p className="summary-body">
              Your memory decay curve is actively reinforced. Based on your recent flow sessions,
              you have <strong>{schedule.filter(s => s.status === 'due-soon').length} concept(s)</strong> due for rapid active recall.
            </p>
            <div className="smart-prompt-box">
              <span className="prompt-icon">💡</span>
              <p className="prompt-text">
                <em>Personalized Recommendation:</em> You found <strong>'Event Horizon & Escape Velocity'</strong> tricky on your first pass. We recommend a 5-minute recall session <strong>Tuesday at 2:00 PM</strong> during your peak focus window.
              </p>
            </div>
          </div>
        </section>

        {/* Ebbinghaus Forgetting vs. Active Recall Visualization */}
        <section className="retention-chart-card">
          <h3 className="chart-card-title">Cognitive Retention & Spaced Intervals</h3>
          <p className="chart-card-sub">
            Without review, 70% of new physics concepts fade in 48 hours. Each scheduled active recall resets and flattens your forgetting curve.
          </p>

          <div className="curve-svg-container">
            <svg viewBox="0 0 700 200" className="memory-curve-svg">
              {/* Background grid lines */}
              <line x1="60" y1="30" x2="680" y2="30" stroke="#2a2a2a" strokeDasharray="3 3" />
              <line x1="60" y1="90" x2="680" y2="90" stroke="#2a2a2a" strokeDasharray="3 3" />
              <line x1="60" y1="150" x2="680" y2="150" stroke="#2a2a2a" strokeDasharray="3 3" />

              {/* Y-axis labels */}
              <text x="15" y="35" fill="#777" fontSize="12" fontFamily="Inter">100%</text>
              <text x="20" y="95" fill="#777" fontSize="12" fontFamily="Inter">60%</text>
              <text x="25" y="155" fill="#777" fontSize="12" fontFamily="Inter">20%</text>

              {/* Decay Curves */}
              {/* Initial curve (steep drop) */}
              <path d="M 60 40 Q 120 160, 200 160" stroke="#444444" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              {/* Review 1 (Day 1) */}
              <path d="M 120 120 L 120 40 Q 200 120, 280 120" stroke="#4f7df3" strokeWidth="2" fill="none" />
              {/* Review 2 (Day 3) */}
              <path d="M 240 90 L 240 40 Q 340 85, 440 85" stroke="#34c759" strokeWidth="2.5" fill="none" />
              {/* Review 3 (Day 7 -> Permanent) */}
              <path d="M 400 65 L 400 40 Q 550 50, 680 50" stroke="#34c759" strokeWidth="3" fill="none" />

              {/* Data points */}
              <circle cx="60" cy="40" r="5" fill="#ffffff" />
              <circle cx="120" cy="40" r="5" fill="#4f7df3" />
              <circle cx="240" cy="40" r="5" fill="#34c759" />
              <circle cx="400" cy="40" r="5" fill="#34c759" />

              {/* X-axis milestone labels */}
              <text x="60" y="185" fill="#999" fontSize="11" textAnchor="middle">Initial Study</text>
              <text x="120" y="185" fill="#999" fontSize="11" textAnchor="middle">Day 1</text>
              <text x="240" y="185" fill="#999" fontSize="11" textAnchor="middle">Day 3</text>
              <text x="400" y="185" fill="#999" fontSize="11" textAnchor="middle">Day 7</text>
              <text x="600" y="185" fill="#34c759" fontSize="11" textAnchor="middle">Permanent Retention</text>
            </svg>
          </div>
        </section>

        {/* Dynamic Revision Schedule Cards */}
        <section className="scheduled-topics-section">
          <div className="schedule-section-header">
            <h3 className="section-title-sm">Targeted Recall Queue</h3>
            <div className="filter-pill-tabs">
              <button
                className={`filter-pill ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Topics ({schedule.length})
              </button>
              <button
                className={`filter-pill ${activeTab === 'due' ? 'active' : ''}`}
                onClick={() => setActiveTab('due')}
              >
                Due for Review ({schedule.filter(s => s.status === 'due-soon').length})
              </button>
              <button
                className={`filter-pill ${activeTab === 'optimal' ? 'active' : ''}`}
                onClick={() => setActiveTab('optimal')}
              >
                Consolidated
              </button>
            </div>
          </div>

          <div className="schedule-card-list">
            {filteredItems.map((item) => {
              const isDue = item.status === 'due-soon';
              const isJustReviewed = reviewedId === item.id;

              return (
                <div key={item.id} className={`revision-item-card ${isDue ? 'priority-due' : ''}`}>
                  <div className="item-left-col">
                    <div className="item-badge-row">
                      <span className="item-concept-name">{item.concept}</span>
                      <span className={`status-pill ${item.status}`}>
                        {isDue ? '⚡ Due for Recall' : '✓ Consolidated'}
                      </span>
                    </div>
                    <span className="item-domain-sub">{item.domain} · {item.stage}</span>
                    <p className="item-timing-note">
                      Scheduled Window: <strong>{item.nextSession}</strong>
                    </p>
                  </div>

                  <div className="item-right-col">
                    <div className="retention-meter-wrapper">
                      <span className="meter-label">Retention</span>
                      <span className="meter-val">{item.retentionScore}%</span>
                      <div className="meter-track">
                        <div
                          className="meter-fill"
                          style={{
                            width: `${item.retentionScore}%`,
                            background: item.retentionScore >= 85 ? '#34c759' : '#ff9f0a'
                          }}
                        ></div>
                      </div>
                    </div>

                    <button
                      className="review-action-btn"
                      onClick={() => handleReviewNow(item.id)}
                    >
                      {isJustReviewed ? '✓ Reviewed!' : 'Active Recall (3 min) →'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default RevisionPlanner;