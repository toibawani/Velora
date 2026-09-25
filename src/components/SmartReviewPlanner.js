import React, { useState, useEffect } from 'react';
import { getReviewItems, saveReviewItems, completeReviewItem } from '../utils/reviewPlanner';
import '../styles/SmartReviewPlanner.css';

function SmartReviewPlanner({ selectedSubject, onNotify }) {
  const [reviewItems, setReviewItems] = useState(getReviewItems);

  useEffect(() => {
    saveReviewItems(reviewItems);
  }, [reviewItems]);

  const handleReviewNow = (id) => {
    setReviewItems(completeReviewItem(id));
    if (onNotify) onNotify('Review recorded. Your next recall is in 7 days.', 'success');
  };

  const getDaysUntilReview = (nextReviewDate) => {
    const now = new Date();
    const next = new Date(nextReviewDate);
    const days = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getRetentionColor = (retention) => {
    if (retention >= 80) return '#2E7D32';
    if (retention >= 60) return '#F39C12';
    return '#E74C3C';
  };

  const getReviewStatus = (nextReviewDate) => {
    const days = getDaysUntilReview(nextReviewDate);
    if (days <= 0) return '🔴 Review Now';
    if (days <= 1) return '🟡 Tomorrow';
    return `⏱️ In ${days} days`;
  };

  const visibleItems = selectedSubject ? reviewItems.filter((item) => item.subject === selectedSubject) : reviewItems;

  return (
    <div className="smart-review-planner">
      <div className="planner-header">
        <h2 className="planner-title">Smart Review Schedule</h2>
        <p className="planner-subtitle">
          Based on spaced repetition for optimal retention
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
                <div className="retention-display">
                  <div className="retention-bar">
                    <div
                      className="retention-fill"
                      style={{
                        width: `${item.retention}%`,
                        background: getRetentionColor(item.retention),
                      }}
                    ></div>
                  </div>
                  <span
                    className="retention-label"
                    style={{ color: getRetentionColor(item.retention) }}
                  >
                    {item.retention}% retained
                  </span>
                </div>

                <p className="review-timing">{getReviewStatus(item.nextReview)}</p>
              </div>

              <button
                className="review-btn"
                onClick={() => handleReviewNow(item.id)}
                style={{
                  background: getDaysUntilReview(item.nextReview) <= 0 ? '#E74C3C' : '#667eea',
                }}
              >
                Review
              </button>
            </div>
          ))
        )}
      </div>

      <div className="spaced-repetition-info">
        <h3 className="info-title">How Spaced Repetition Works</h3>
        <div className="schedule-explanation">
          <div className="schedule-item">
            <span className="schedule-num">1</span>
            <span className="schedule-text">Learn a topic</span>
          </div>
          <div className="schedule-arrow">→</div>
          <div className="schedule-item">
            <span className="schedule-num">2</span>
            <span className="schedule-text">Review after 1 day</span>
          </div>
          <div className="schedule-arrow">→</div>
          <div className="schedule-item">
            <span className="schedule-num">3</span>
            <span className="schedule-text">Review after 3 days</span>
          </div>
          <div className="schedule-arrow">→</div>
          <div className="schedule-item">
            <span className="schedule-num">4</span>
            <span className="schedule-text">Review after 7 days</span>
          </div>
        </div>
        <p className="info-note">
          💡 This science-backed method is 3x more effective than cramming!
        </p>
      </div>
    </div>
  );
}

export default SmartReviewPlanner;