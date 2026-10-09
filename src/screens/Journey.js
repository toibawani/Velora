import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Clock, Compass } from 'lucide-react';
import { getAnalyticsData } from '../utils/analyticsStorage';
import EmptyState from '../components/EmptyState';
import '../styles/Journey.css';

/**
 * Learning Journey
 *
 * The screen used to show five milestones - relativistic spacetime, event
 * horizons, hawking radiation - with mastery scores of 94, 88 and 92 and
 * focus times beside them. Nothing on the device produced any of it. Every
 * learner saw the same five achievements, including the one who arrived a
 * minute ago, so the screen taught people that a progress bar here describes
 * a character rather than them.
 *
 * What is real: LessonReader records a study session when a lesson closes,
 * so the timeline below is made of minutes actually spent. An empty timeline
 * is the honest state for someone who has not read anything yet, and it says
 * so rather than filling itself in.
 *
 * What is deliberately absent: mastery scores, and locked units with a
 * prerequisite rule behind them. Neither is recorded anywhere, and a lock
 * that no curriculum has decided to place is not a constraint, it is a
 * decoration shaped like one.
 */

// Ordered by where the time went, not as a ranking. The largest session is at
// the top because that is the question someone asks this screen: what have I
// actually spent time on.
const journeyEntries = (analytics) =>
  [...analytics.topicTimeDistribution].sort((a, b) => b.hours - a.hours);

const pluralise = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

// The distribution accumulates hours per topic rather than counting sessions,
// but each session was also tallied by day. Both are stored, so the total is a
// sum rather than a guess.
const sessionsRecorded = (analytics) =>
  analytics.weeklyActivity.reduce((total, day) => total + (day.sessions || 0), 0);

LearningJourney.propTypes = { setScreen: PropTypes.shape({"setScreen": PropTypes.func}) };

function LearningJourney({ setScreen }) {
  const [analytics] = useState(() => getAnalyticsData());
  const entries = journeyEntries(analytics);

  return (
    <div className="journey-console">
      <header className="journey-navbar">
        <div className="journey-nav-left">
          <button className="journey-back-btn" onClick={() => setScreen('universe')}>
            ← Return to Universe
          </button>
          <div className="journey-title-col">
            <h1 className="journey-title">Learning Journey</h1>
            <span className="journey-sub">Sessions this device has recorded</span>
          </div>
        </div>
      </header>

      <main className="journey-main-layout">
        {entries.length === 0 ? (
          <EmptyState
            icon={<Compass size={28} />}
            title="Nothing recorded yet"
            description="An entry is written here when you close a lesson. Read something and the first one appears - time spent, not time claimed."
            actionText="Go to Learn"
            onAction={() => setScreen('learn')}
          />
        ) : (
          <>
            <section className="journey-summary" aria-label="Recorded totals">
              <span className="journey-summary-item">
                <Clock size={15} aria-hidden="true" />
                {pluralise(analytics.totalHoursStudied, 'hour')} recorded
              </span>
              <span className="journey-summary-item">
                {pluralise(entries.length, 'topic')} touched
              </span>
              <span className="journey-summary-item">
                {pluralise(sessionsRecorded(analytics), 'session')} logged
              </span>
            </section>

            <div className="journey-timeline-feed">
              {entries.map((item) => (
                <div key={item.topic} className="journey-feed-item">
                  <div className="journey-node-marker" aria-hidden="true">
                    <Clock size={16} />
                  </div>

                  <div className="journey-entry-card">
                    {item.subject ? (
                      <div className="entry-head">
                        <span className="milestone-day-tag">{item.subject}</span>
                      </div>
                    ) : null}

                    <h3 className="milestone-topic-title">{item.topic}</h3>

                    <div className="milestone-stats-row">
                      <span className="time-stat">
                        {pluralise(item.hours, 'hour')} recorded
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default LearningJourney;
