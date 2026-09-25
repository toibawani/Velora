import React, { useState, useEffect } from 'react';
import { getAnalyticsData } from '../utils/analyticsStorage';
import { trackEvent } from '../utils/analytics';
import '../styles/Analytics.css';

/**
 * Analytics Screen
 * 
 * Provides transparent, privacy-respecting insights into learning patterns,
 * time allocation, struggled concepts, cognitive learning style preferences,
 * and peak focus hours.
 */
function Analytics({ setScreen, user }) {
  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const hasActivity = analytics.totalHoursStudied > 0 || analytics.topicTimeDistribution.length > 0;
  const domainCount = new Set(analytics.topicTimeDistribution.map((item) => item.subject)).size;

  useEffect(() => {
    trackEvent('screen_view', { screen: 'analytics' });
    setAnalytics(getAnalyticsData());
  }, []);

  return (
    <div className="analytics-page-root">
      {/* Navigation Header */}
      <header className="analytics-top-nav">
        <button className="analytics-back-btn" onClick={() => setScreen('universe')}>
          ← Return to Universe
        </button>
        <h1 className="analytics-brand-title">Personal Learning Analytics</h1>
        <div className="analytics-privacy-badge">
          <span className="shield-icon">🛡️</span>
          <span>100% On-Device & Private</span>
        </div>
      </header>

      <main className="analytics-main-container">
        {/* Welcome & Overview Header */}
        <section className="analytics-hero-section">
          <div className="hero-text-col">
            <h2 className="analytics-greeting">Cognitive Insights for {user?.name || 'Explorer'}</h2>
            <p className="analytics-lead">
              Understand how your brain retains complex subjects and optimize your study cadence.
            </p>
          </div>
          <div className="analytics-scope-note">All activity is stored locally on this device.</div>
        </section>

        {/* Primary Metrics Grid */}
        <section className="analytics-metrics-grid">
          <div className="metric-box">
            <span className="metric-caption">Total Focused Hours</span>
            <div className="metric-num-row">
              <span className="metric-big-num">{analytics.totalHoursStudied}</span>
              <span className="metric-unit">hrs</span>
            </div>
            <span className="metric-subtext">{hasActivity ? `Across ${domainCount || 1} learning domain${domainCount === 1 ? '' : 's'}` : 'No sessions recorded yet'}</span>
          </div>

          <div className="metric-box">
            <span className="metric-caption">Active Learning Streak</span>
            <div className="metric-num-row">
              <span className="metric-big-num">{analytics.currentStreak}</span>
              <span className="metric-unit">days</span>
            </div>
            <span className="metric-subtext">{hasActivity ? 'Recorded from local activity' : 'Record a session to begin'}</span>
          </div>

          <div className="metric-box">
            <span className="metric-caption">Mastered Modules</span>
            <div className="metric-num-row">
              <span className="metric-big-num">{analytics.topicsCompleted}</span>
              <span className="metric-unit">topics</span>
            </div>
            <span className="metric-subtext">Verified with flow quizzes</span>
          </div>

          <div className="metric-box">
            <span className="metric-caption">Cognitive Velocity</span>
            <div className="metric-num-row">
              <span className="metric-big-num">{hasActivity ? 'Baseline' : '—'}</span>
            </div>
            <span className="metric-subtext">{hasActivity ? 'A baseline for future comparisons' : 'No comparison yet'}</span>
          </div>
        </section>

        {/* Two-Column Deep Insights Layout */}
        <div className="analytics-split-layout">
          {/* Left Column: Learning Style & Peak Hours */}
          <div className="analytics-col">
            {/* Learning Style Preference */}
            <div className="analytics-card">
              <h3 className="card-heading">Cognitive Learning Style</h3>
              <p className="card-subhead">
                Based on your interaction with interactive canvases, deep readings, and flow challenges.
              </p>

              <div className="style-bars-list">
                <div className="style-item">
                  <div className="style-header-row">
                    <span className="style-name">🎨 Visual & Spatial (Canvas, SVG diagrams)</span>
                    <span className="style-pct">{analytics.learningStyle.visual}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${analytics.learningStyle.visual}%`, background: '#2563EB' }}></div>
                  </div>
                </div>

                <div className="style-item">
                  <div className="style-header-row">
                    <span className="style-name">📖 Textual & Conceptual (Articles, Notes)</span>
                    <span className="style-pct">{analytics.learningStyle.textual}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${analytics.learningStyle.textual}%`, background: '#2563EB' }}></div>
                  </div>
                </div>

                <div className="style-item">
                  <div className="style-header-row">
                    <span className="style-name">⚡ Flow-State & Interactive (Scrabble, Chains)</span>
                    <span className="style-pct">{analytics.learningStyle.interactive}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${analytics.learningStyle.interactive}%`, background: '#ff9f0a' }}></div>
                  </div>
                </div>
              </div>

              <div className="recommendation-pill">
                {hasActivity ? <>💡 <strong>Pattern forming:</strong> Keep exploring and revisit this page after a few real sessions.</> : <>💡 <strong>Start with one question:</strong> Read a lesson, then let your activity build the first baseline.</>}
              </div>
            </div>

            {/* Peak Focus Hours */}
            <div className="analytics-card">
              <h3 className="card-heading">Peak Focus Hours</h3>
              <p className="card-subhead">
                When your cognitive retention and session length are at their highest.
              </p>

              <div className="peak-hours-grid">
                <div className="peak-hour-box">
                  <span className="peak-label">Morning</span>
                  <span className="peak-time">6 AM – 12 PM</span>
                  <span className="peak-pct">{analytics.peakHours.morning}%</span>
                </div>
                <div className="peak-hour-box">
                  <span className="peak-label">Afternoon</span>
                  <span className="peak-time">12 PM – 5 PM</span>
                  <span className="peak-pct">{analytics.peakHours.afternoon}%</span>
                </div>
                <div className="peak-hour-box highlight">
                  <span className="peak-label">Evening (Peak)</span>
                  <span className="peak-time">7 PM – 10 PM</span>
                  <span className="peak-pct">{analytics.peakHours.evening}%</span>
                </div>
                <div className="peak-hour-box">
                  <span className="peak-label">Late Night</span>
                  <span className="peak-time">10 PM – 2 AM</span>
                  <span className="peak-pct">{analytics.peakHours.night}%</span>
                </div>
              </div>

              <p className="peak-tip">
                {hasActivity ? <>🕒 <strong>Pattern forming:</strong> Your best learning time will appear after more sessions.</> : <>🕒 <strong>No best time yet:</strong> Your activity is still too small to identify a pattern.</>}
              </p>
            </div>
          </div>

          {/* Right Column: Time Distribution & Concepts Needing Revision */}
          <div className="analytics-col">
            {/* Time Distribution per Subject/Topic */}
            <div className="analytics-card">
              <h3 className="card-heading">Time Invested per Domain</h3>
              <p className="card-subhead">Total dedicated study distribution across topics.</p>

              <div className="topic-dist-list">
                {analytics.topicTimeDistribution.length === 0 ? <p className="analytics-empty-note">No topic distribution yet. Open a lesson to start building it.</p> : analytics.topicTimeDistribution.map((item, idx) => (
                  <div key={idx} className="topic-dist-item">
                    <div className="dist-title-row">
                      <span className="dist-topic-name">{item.topic}</span>
                      <span className="dist-hours">{item.hours} hrs</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.min((item.hours / 8) * 100, 100)}%`,
                          background: item.color || '#2563EB'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Struggled Concepts & Smart Recommendations */}
            <div className="analytics-card">
              <h3 className="card-heading">Concepts Targeted for Reinforcement</h3>
              <p className="card-subhead">
                Identified automatically from pauses, repeated attempts, or self-reported reflections.
              </p>

              <div className="struggle-items-list">
                {analytics.struggledConcepts.length === 0 ? <p className="analytics-empty-note">No reinforcement notes yet. That is a good baseline, not a failure.</p> : analytics.struggledConcepts.map((item, idx) => (
                  <div key={idx} className="struggle-card-item">
                    <div className="struggle-badge-row">
                      <span className="struggle-concept-title">{item.concept}</span>
                      <span className={`struggle-level-tag ${item.struggleLevel.toLowerCase()}`}>
                        {item.struggleLevel} Priority
                      </span>
                    </div>
                    <span className="struggle-topic-meta">Domain: {item.topic}</span>
                    <p className="struggle-remedy-text">
                      🎯 {item.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Analytics;