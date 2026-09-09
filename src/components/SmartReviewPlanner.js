import React, { useState, useEffect } from 'react';
import '../styles/SmartReviewPlanner.css';

function SmartReviewPlanner({ selectedSubject }) {
  const [reviewItems, setReviewItems] = useState(() => {
    const saved = localStorage.getItem('velora_reviews');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            topic: 'Event Horizon',
            subject: 'physics',
            lastReviewed: new Date(Date.now() - 86400000).toISOString(),
            nextReview: new Date(Date.now() + 86400000).toISOString(),
            difficulty: 'medium',
            retention: 65,
          },
          {
            id: 2,
            topic: 'Singularity',
            subject: 'physics',
            lastReviewed: new Date(Date.now() - 172800000).toISOString(),
            nextReview: new Date(Date.now() + 259200000).toISOString(),
            difficulty: 'hard',
            retention: 45,
          },
          {
            id: 3,
            topic: "Newton's Laws",
            subject: 'physics',
            lastReviewed: new Date(Date.now() - 604800000).toISOString(),
            nextReview: new Date(Date.now() + 604800000).toISOString(),
            difficulty: 'easy',
            retention: 92,
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('velora_reviews', JSON.stringify(reviewItems));
  }, [reviewItems]);

  const handleReviewNow = (id) => {
    setReviewItems(
      reviewItems.map((item) =>
        item.id === id
          ? {
              ...item,
              lastReviewed: new Date().toISOString(),
              nextReview: new Date(Date.now() + 7 * 86400000).toISOString(),
              retention: Math.min(item.retention + 10, 100),
            }
          : item
      )
    );
    alert('Great! Review completed. Scheduled for next week.');
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

  return (
    <div className="smart-review-planner">
      <div className="planner-header">
        <h2 className="planner-title">Smart Review Schedule</h2>
        <p className="planner-subtitle">
          Based on spaced repetition for optimal retention
        </p>
      </div>

      <div className="review-list">
        {reviewItems.length === 0 ? (
          <div className="no-reviews">
            <p>No topics to review yet. Start learning to unlock smart reviews!</p>
          </div>
        ) : (
          reviewItems.map((item) => (
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