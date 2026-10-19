import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Timer, Lightbulb } from 'lucide-react';
import { getReviewItems, saveReviewItems, completeReviewItem } from '../utils/reviewPlanner';
import '../styles/SmartReviewPlanner.css';

/**
 * SmartReviewPlanner - spaced-repetition planner: due-today queue, overdue
 * flags, and complete/dismiss actions per review item.
 */
SmartReviewPlanner.propTypes = { selectedSubject: PropTypes.shape({"selectedSubject": PropTypes.func}), onNotify: PropTypes.shape({"onNotify": PropTypes.func}) };

function SmartReviewPlanner({ selectedSubject, onNotify }) {
  const [reviewItems, setReviewItems] = useState(getReviewItems);

  useEffect(() => {
    saveReviewItems(reviewItems);
  }, [reviewItems]);

  const handleReviewNow = (id) => {
    setReviewItems(completeReviewItem(id));
    if (onNotify) onNotify('Review recorded. The next one is scheduled in 7 days.', 'success');
  };

  const getDaysUntilReview = (nextReviewDate) => {
    const now = new Date();
    const next = new Date(nextReviewDate);
    const days = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Returns the urgency and its wording, so the icon can be chosen from data
  // rather than encoded into a string that carried the emoji with it.
  const getReviewStatus = (nextReviewDate) => {
    const days = getDaysUntilReview(nextReviewDate);
    if (days <= 0) return { tone: 'now', label: 'Review Now' };
    if (days <= 1) return { tone: 'soon', label: 'Tomorrow' };
    return { tone: 'later', label: `In ${days} days` };
  };

  const renderReviewStatus = (nextReviewDate) => {
    const { tone, label } = getReviewStatus(nextReviewDate);
    const Icon = tone === 'now' ? AlertCircle : tone === 'soon' ? Clock : Timer;
    return (
      <>
        <Icon size={13} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 5 }} />
        {label}
      </>
    );
  };

  const visibleItems = selectedSubject ? reviewItems.filter((item) => item.subject === selectedSubject) : reviewItems;

  return (
    <div data-testid="smart-review-planner" className="smart-review-planner">
      <div className="planner-header">
        <h2 className="planner-title">Smart Review Schedule</h2>
        <p className="planner-subtitle">
          Lessons you saved, with the next review date stored on this device.
          The intervals are fixed, not measured.
        </p>
      </div>

      <div className="review-list">
        {visibleItems.length === 0 ? (
          <div className="no-reviews">
            <strong>No saved lessons in this subject yet.</strong>
            <p>Open a lesson and choose “Save for review” to create your first recall step.</p>
          </div>
        ) : (
          visibleItems.map((item) => (
            <div key={item.id} className="review-item">
              <div className="review-left">
                <h4 className="review-topic">{item.topic}</h4>
                <p className="review-subject">{item.subject.toUpperCase()}</p>
              </div>

              <div className="review-middle">
                <p className="review-timing">{renderReviewStatus(item.nextReview)}</p>
              </div>

              <button
                className="review-btn"
                onClick={() => handleReviewNow(item.id)}
                style={{
                  background: getDaysUntilReview(item.nextReview) <= 0 ? 'var(--color-error)' : 'var(--color-info)',
                }}
              >
                Review
              </button>
            </div>
          ))
        )}
      </div>

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
            <span className="schedule-text">Press Review, and it returns in 7 days</span>
          </div>
        </div>
        <p className="info-note">
          <Lightbulb size={15} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Nothing here measures how much you remember. The date is a fixed interval, not a prediction.
        </p>
      </div>
    </div>
  );
}

export default SmartReviewPlanner;