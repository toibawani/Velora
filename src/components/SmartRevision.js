import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Calendar, BookOpen } from 'lucide-react';
import EmptyState from './EmptyState';
import { getReviewItems, reviewStatus, stepLabel } from '../utils/reviewPlanner';
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
 *
 * The date wording comes from `reviewStatus`, the same function the planner
 * uses, so the two lists cannot describe the same item differently. The badge
 * shows the ladder step rather than the old `difficulty: 'new'` field, which
 * nothing ever updated and which is no longer written at all - it would have
 * rendered an empty chip on every row.
 */
SmartRevision.propTypes = { selectedSubject: PropTypes.string };

function SmartRevision({ selectedSubject }) {
  const [reviews] = useState(getReviewItems);
  const visible = selectedSubject
    ? reviews.filter((item) => item.subject === selectedSubject)
    : reviews;
  const dueCount = visible.filter((item) => reviewStatus(item).days <= 0).length;

  return (
    <div data-testid="smart-revision" className="smart-revision">
      <div className="revision-header">
        <h2 className="revision-title">Review schedule</h2>
        <p className="revision-desc">
          Lessons you saved, with the date each one comes due. The list lives in this browser. There
          is no recall score, because nothing here measures recall.
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
          <p className="revision-count" role="status">
            {dueCount === 0
              ? `${visible.length} saved, none due right now`
              : `${dueCount} of ${visible.length} due now`}
          </p>
          {visible.map((item) => {
            const status = reviewStatus(item);
            return (
              <div key={item.id} className={`revision-item ${status.days <= 0 ? 'is-due' : ''}`}>
                <div className="revision-info">
                  <h4 className="revision-topic">{item.topic}</h4>
                  <div className="revision-meta">
                    <span className="meta-badge">{stepLabel(item)}</span>
                    <span className="meta-time">
                      <Calendar size={13} strokeWidth={1.5} aria-hidden="true" />
                      <span>{status.label}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SmartRevision;
