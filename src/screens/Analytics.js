import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Shield, Lightbulb, Target } from 'lucide-react';
import { getAnalyticsData } from '../utils/analyticsStorage';
import { trackEvent } from '../utils/analytics';
import '../styles/Analytics.css';

/**
 * Analytics Screen
 *
 * Shows the time this device actually recorded, per topic. It deliberately does
 * not claim to measure focus, learning style or mastery: those panels used to
 * exist and were built from numbers nothing produced.
 */
/**
 * A bar's colour is asked of the subject rather than carried in from the record:
 * a hex written into localStorage outlives every palette change made in CSS, so
 * a learner who arrived before the current tokens would still be looking at the
 * colour from the day they signed up.
 */
export const barColor = (subject) =>
  subject ? `var(--subject-${subject}, var(--accent-primary))` : 'var(--accent-primary)';

Analytics.propTypes = { setScreen: PropTypes.shape({"setScreen": PropTypes.func}), user: PropTypes.string };

function Analytics({ setScreen, user }) {
  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const hasActivity = analytics.totalHoursStudied > 0 || analytics.topicTimeDistribution.length > 0;
  const domainCount = new Set(analytics.topicTimeDistribution.map((item) => item.subject)).size;
  const activeDays = analytics.weeklyActivity.filter((day) => (day.sessions || 0) > 0).length;
  // Sessions are stored per day, so the count is a sum rather than a field.
  const sessionTotal = analytics.weeklyActivity.reduce((total, day) => total + (day.sessions || 0), 0);

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
          <Shield size={14} aria-hidden="true" />
          <span>Stored on this device</span>
        </div>
      </header>

      <main className="analytics-main-container">
        {/* Welcome & Overview Header */}
        <section className="analytics-hero-section">
          <div className="hero-text-col">
            <h2 className="analytics-greeting">Recorded activity for {user?.name || 'Explorer'}</h2>
            <p className="analytics-lead">
              Time this device recorded, and what it went on. Nothing here
              measures understanding, so no number claims to.
            </p>
          </div>
          <div className="analytics-scope-note">All activity is stored locally on this device.</div>
        </section>

        {/* Primary Metrics Grid */}
        <section className="analytics-metrics-grid">
          <div className="metric-box">
            <span className="metric-caption">Hours recorded</span>
            <div className="metric-num-row">
              <span className="metric-big-num">{analytics.totalHoursStudied}</span>
              <span className="metric-unit">hrs</span>
            </div>
            <span className="metric-subtext">{hasActivity ? `Time between opening and closing a lesson, across ${domainCount || 1} domain${domainCount === 1 ? '' : 's'}` : 'No sessions recorded yet'}</span>
          </div>

          <div className="metric-box">
            <span className="metric-caption">Sessions Logged</span>
            <div className="metric-num-row">
              <span className="metric-big-num">{sessionTotal}</span>
              <span className="metric-unit">closed</span>
            </div>
            <span className="metric-subtext">Counted when a lesson closes</span>
          </div>

          <div className="metric-box">
            <span className="metric-caption">Topics Touched</span>
            <div className="metric-num-row">
              <span className="metric-big-num">{analytics.topicTimeDistribution.length}</span>
              <span className="metric-unit">topics</span>
            </div>
            <span className="metric-subtext">Only topics with minutes against them</span>
          </div>

          <div className="metric-box">
            <span className="metric-caption">Days active</span>
            <div className="metric-num-row">
              <span className="metric-big-num">{activeDays}</span>
              <span className="metric-unit">days</span>
            </div>
            <span className="metric-subtext">Days this week with at least one closed session</span>
          </div>
        </section>

        {/* Two-Column Deep Insights Layout */}
        <div className="analytics-split-layout">
          {/* Left Column: Learning Style & Peak Hours */}
          <div className="analytics-col">
            {/* A panel for the things this app cannot work out, because the
                alternative was two bars pinned at zero percent under headings
                that claimed they had been measured from behaviour. */}
            <div className="analytics-card">
              <h3 className="card-heading">Not Measured Yet</h3>
              <p className="card-subhead">
                Two panels used to sit here: a cognitive learning style, and a peak
                focus window with one box labelled &ldquo;Evening (Peak)&rdquo; while
                reading zero percent.
              </p>

              <ul className="unmeasured-list">
                <li>
                  <span className="unmeasured-name">Learning style</span>
                  <span className="unmeasured-reason">
                    Nothing records which surface a lesson was read on, so there is no
                    canvas-versus-article split to average into a preference.
                  </span>
                </li>
                <li>
                  <span className="unmeasured-name">Best time of day</span>
                  <span className="unmeasured-reason">
                    Sessions are stored by day, not by hour. There is no clock reading
                    to put into a bar.
                  </span>
                </li>
                <li>
                  <span className="unmeasured-name">Topics mastered</span>
                  <span className="unmeasured-reason">
                    Mastery needs a result, and closing a lesson is the only thing the
                    app records today.
                  </span>
                </li>
              </ul>

              <div className="recommendation-pill">
                <Lightbulb size={14} aria-hidden="true" />
                <span>
                  Each of these needs a recorder before it can hold a number. Until one
                  exists, the four tiles above are what is real: hours, sessions, and the
                  topics with minutes against them.
                </span>
              </div>
            </div>
          </div>


          {/* Right Column: Time Distribution & Concepts Needing Revision */}
          <div className="analytics-col">
            {/* Time Distribution per Subject/Topic */}
            <div className="analytics-card">
              <h3 className="card-heading">Time Invested per Domain</h3>
              <p className="card-subhead">Total dedicated study distribution across topics.</p>

              <div className="topic-dist-list">
                {analytics.topicTimeDistribution.length === 0 ? <p className="analytics-empty-note">No topic distribution yet. Open a lesson to start building it.</p> : analytics.topicTimeDistribution.map((item) => (
                  <div key={item.topic} className="topic-dist-item">
                    <div className="dist-title-row">
                      <span className="dist-topic-name">{item.topic}</span>
                      <span className="dist-hours">{item.hours} hrs</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.min((item.hours / 8) * 100, 100)}%`,
                          background: barColor(item.subject)
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
                Nothing writes to this list yet, so it is empty for everyone. It is
                where a concept would be held for review once something records that
                you asked to come back to it.
              </p>

              <div className="struggle-items-list">
                {analytics.struggledConcepts.length === 0 ? <p className="analytics-empty-note">No reinforcement notes yet. That is a good baseline, not a failure.</p> : analytics.struggledConcepts.map((item) => (
                  <div key={`${item.concept}-${item.topic}`} className="struggle-card-item">
                    <div className="struggle-badge-row">
                      <span className="struggle-concept-title">{item.concept}</span>
                      <span className={`struggle-level-tag ${item.struggleLevel.toLowerCase()}`}>
                        {item.struggleLevel} Priority
                      </span>
                    </div>
                    <span className="struggle-topic-meta">Domain: {item.topic}</span>
                    <p className="struggle-remedy-text">
                      <Target size={14} aria-hidden="true" />
                      <span>{item.recommendation}</span>
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