import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Calendar, BookOpen } from 'lucide-react';
import EmptyState from './EmptyState';
import { getReviewItems } from '../utils/reviewPlanner';
import '../styles/SmartRevision.css';

/**
 * SmartRevision - the lessons this device saved, and when each comes due.
 *
 * It used to render three hard-coded rows ("Event Horizon Mechanics",
 * "Gravitational Singularity", "Inertial Frames") with next-review dates and
 * recall scores of 65, 45 and 92, above the line "Optimal recall intervals
 * calculated from your active retrieval scores". Nothing calculated any of it,
 * and every visitor saw the same three rows on their first visit. The rows are
 * gone; what is shown now is the review schedule the planner actually stored.
 */
SmartRevision.propTypes = { selectedSubject: PropTypes.string };

const dueLabel = (isoDate) => {
  const days = Math.ceil((new Date(isoDate) - Date.now()) / 86400000);
  if (!Number.isFinite(days)) return 'No date stored';
  if (days <= 0) return 'Due now';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
};

function SmartRevision({ selectedSubject }) {
  const [reviews] = useState(getReviewItems);
  const visible = selectedSubject
    ? reviews.filter((item) => item.subject === selectedSubject)
    : reviews;

  return (
    <div data-testid="smart-revision" className="smart-revision">
      <div className="revision-header">
        <h2 className="revision-title">Review schedule</h2>
        <p className="revision-desc">
          Lessons you saved, with the date each one comes due. The list lives in
          this browser. There is no recall score, because nothing here measures
          recall.
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={28} aria-hidden="true" />}
          title="Nothing saved for review"
          description="Open a lesson and choose Save for review. It will appear here the next time you look."
        />
      ) : (
        <div className="revision-list">
          {visible.map((item) => (
            <div key={item.id} className="revision-item">
              <div className="revision-info">
                <h4 className="revision-topic">{item.topic}</h4>
                <div className="revision-meta">
                  <span className="meta-badge">{item.difficulty}</span>
                  <span className="meta-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} strokeWidth={1.5} color="var(--color-text-muted)" />
                    <span>{dueLabel(item.nextReview)}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SmartRevision;
