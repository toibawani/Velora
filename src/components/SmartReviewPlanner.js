import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Clock, Timer, Lightbulb } from 'lucide-react';
import {
  REVIEW_LADDER,
  completeReviewItem,
  getReviewItems,
  intervalForStep,
  reviewStatus,
  saveReviewItems,
  snoozeReviewItem,
  stepLabel,
} from '../utils/reviewPlanner';
import '../styles/SmartReviewPlanner.css';

/**
 * SmartReviewPlanner - the review schedule for the lessons someone saved.
 *
 * It shows what is due, what is late and what is still ahead, and it says which
 * step of the ladder each item sits on. The previous version said every review
 * returned in seven days, which was true of the code and wrong about the
 * schedule it should have been keeping; the wording now comes from the same
 * ladder the dates do, so the two cannot drift apart.
 *
 * Nothing here shows a recall percentage. A number that was never measured
 * would be the one thing on the card a reader could not verify.
 */
SmartReviewPlanner.propTypes = {
  selectedSubject: PropTypes.string,
  onNotify: PropTypes.func,
};

function SmartReviewPlanner({ selectedSubject, onNotify }) {
  const [reviewItems, setReviewItems] = useState(getReviewItems);

  useEffect(() => {
    saveReviewItems(reviewItems);
  }, [reviewItems]);

  const visibleItems = selectedSubject
    ? reviewItems.filter((item) => item.subject === selectedSubject)
    : reviewItems;

  const dueItems = visibleItems.filter((item) => reviewStatus(item).days <= 0);
  const laterItems = visibleItems.filter((item) => reviewStatus(item).days > 0);

  const handleReviewNow = (item) => {
    setReviewItems(completeReviewItem(item.id));
    if (onNotify) {
      const gap = intervalForStep(item.reviews + 1);
      onNotify(`Review recorded. The next one is in ${gap} day${gap === 1 ? '' : 's'}.`, 'success');
    }
  };

  const handleSnooze = (item) => {
    setReviewItems(snoozeReviewItem(item.id, 1));
    if (onNotify) onNotify(`"${item.topic}" will come back tomorrow instead.`, 'info');
  };

  const renderRow = (item) => {
    const status = reviewStatus(item);
    const due = status.days <= 0;
    const Icon = status.tone === 'late' || status.tone === 'now' ? AlertCircle : status.tone === 'soon' ? Clock : Timer;

    return (
      <div key={item.id} className={`review-item ${due ? 'is-due' : ''}`}>
        <div className="review-left">
          <h4 className="review-topic">{item.topic}</h4>
          <p className="review-subject">{item.subject.toUpperCase()}</p>
        </div>

        <div className="review-middle">
          <p className={`review-timing tone-${status.tone}`}>
            <Icon size={13} aria-hidden="true" className="review-timing-icon" />
            {status.label}
          </p>
          <p className="review-step">
            {stepLabel(item)} · saved {item.reviews === 0 ? 'once' : `${item.reviews}× reviewed`}
          </p>
        </div>

        <div className="review-actions">
          <button
            type="button"
            className={`review-btn ${due ? 'due' : ''}`}
            onClick={() => handleReviewNow(item)}
            aria-label={`Mark ${item.topic} as reviewed`}
          >
            <Check size={13} aria-hidden="true" /> Review
          </button>
          {due && (
            <button
              type="button"
              className="review-snooze"
              onClick={() => handleSnooze(item)}
              aria-label={`Not today for ${item.topic}`}
            >
              Not today
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div data-testid="smart-review-planner" className="smart-review-planner">
      <div className="planner-header">
        <h2 className="planner-title">Smart Review Schedule</h2>
        <p className="planner-subtitle">
          Lessons you saved, with the next review date stored on this device. The gaps widen with
          every review; they are a fixed ladder, not a prediction.
        </p>
      </div>

      {visibleItems.length === 0 ? (
        <div className="review-list">
          <div className="no-reviews">
            <strong>No saved lessons in this subject yet.</strong>
            <p>Open a lesson and choose “Save for review” to create your first recall step.</p>
          </div>
        </div>
      ) : (
        <div className="review-groups">
          <p className="review-summary" role="status">
            {dueItems.length === 0
              ? 'Nothing is due right now.'
              : `${dueItems.length} due right now.`}
          </p>

          {dueItems.length > 0 && (
            <section className="review-group" aria-label="Due now">
              <h3 className="review-group-title">Due now</h3>
              <div className="review-list">{dueItems.map(renderRow)}</div>
            </section>
          )}

          {laterItems.length > 0 && (
            <section className="review-group" aria-label="Later">
              <h3 className="review-group-title">Later</h3>
              <div className="review-list">{laterItems.map(renderRow)}</div>
            </section>
          )}
        </div>
      )}

      <div className="spaced-repetition-info">
        <h3 className="info-title">What the schedule actually does</h3>
        <div className="schedule-explanation">
          <div className="schedule-item">
            <span className="schedule-num">1</span>
            <span className="schedule-text">Save a lesson for review</span>
          </div>
          <div className="schedule-arrow">→</div>
          <div className="schedule-item">
            <span className="schedule-num">2</span>
            <span className="schedule-text">It comes due the next day</span>
          </div>
          <div className="schedule-arrow">→</div>
          <div className="schedule-item">
            <span className="schedule-num">3</span>
            <span className="schedule-text">
              Press Review, and the gap widens: {REVIEW_LADDER.join(', ')} days
            </span>
          </div>
        </div>
        <p className="info-note">
          <Lightbulb size={15} aria-hidden="true" className="info-note-icon" />
          Nothing here measures how much you remember. The date is a fixed interval, not a
          prediction, and “Not today” moves a review without counting it as done.
        </p>
      </div>
    </div>
  );
}

export default SmartReviewPlanner;
