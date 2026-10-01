import React from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { getSelfReportedStyle } from '../utils/onboardingPreferences';
import '../styles/SelfReportedStyle.css';

/**
 * The one line about the learner that is not measured.
 *
 * It lives in its own card, with its own label style, deliberately apart from
 * the Learning Snapshot: that panel counts minutes the reader recorded, and a
 * number that came from a question at setup must never sit in the same frame as
 * a number that came from a stopwatch.
 */
function SelfReportedStyle() {
  const style = getSelfReportedStyle();
  if (!style) return null;

  return (
    <section className="learn-section">
      <aside className="self-reported-style" aria-label="Self-reported learning style">
        <span className="self-reported-tag">
          <MessageSquareQuote size={13} aria-hidden="true" />
          You told us
        </span>
        <span className="self-reported-value">{style.label}</span>
        <p className="self-reported-note">
          Chosen when you set up VELORA, not measured. This card is a preference; the
          Learning Snapshot below is the reading.
        </p>
      </aside>
    </section>
  );
}

export default SelfReportedStyle;
