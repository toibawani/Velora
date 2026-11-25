import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Check, Circle } from 'lucide-react';
import { getAnalytics } from '../utils/analytics';
import { getAnalyticsData } from '../utils/analyticsStorage';
import '../styles/MasteryPath.css';

/**
 * Progress for one subject, read from what this browser actually recorded.
 *
 * The previous version of this panel hardcoded `completed: true` on four
 * lessons, invented a "30 Days Cadence", invented an "8 min" reading time, and
 * told every visitor "2 of 5 core modules verified (40%)" before they had read
 * anything. Two of its five buttons had no click handler at all. A progress
 * panel that cannot be wrong about you is not progress; it is a screenshot.
 *
 * So there is no lesson list written here any more. The topics come from the
 * subject record the curriculum already holds, and a topic counts as read only
 * when this browser recorded one of two real things:
 *
 *  - a `lesson_completed` event, written by LessonReader when a topic is read
 *    to the end (`trackLessonCompleted(topic.title, subject)`), or
 *  - minutes in `topicTimeDistribution`, written by `recordStudySession`.
 *
 * A clean profile therefore reads "0 of N topics read (0%)", which is the
 * truth, and a completed topic is one somebody actually finished.
 */

/** Titles this browser has a record of reading, lowercased for comparison. */
const readTopics = () => {
  const names = new Set();

  const analytics = getAnalyticsData();
  (analytics.topicTimeDistribution || []).forEach((entry) => {
    if (entry && typeof entry.topic === 'string' && entry.topic.trim()) {
      names.add(entry.topic.trim().toLowerCase());
    }
  });

  getAnalytics().forEach((event) => {
    if (event && event.name === 'lesson_completed' && typeof event.lesson === 'string') {
      names.add(event.lesson.trim().toLowerCase());
    }
  });

  return names;
};

const topicTitle = (topic) => {
  if (typeof topic === 'string') return topic;
  if (topic && typeof topic.title === 'string') return topic.title;
  if (topic && typeof topic.name === 'string') return topic.name;
  return '';
};

function MasteryPath({ subject, selectedSubject }) {
  const read = useMemo(readTopics, []);

  // The subject record is the only source of topics. Without it there is
  // nothing honest to draw, so the panel stays off the page.
  if (!subject) return null;

  const modules = Array.isArray(subject.modules) ? subject.modules : [];
  const topics = modules.flatMap((module) =>
    (module.topics || []).map((topic) => ({
      module: module.name,
      title: topicTitle(topic),
    }))
  ).filter((topic) => topic.title);

  const done = topics.filter((topic) => read.has(topic.title.toLowerCase())).length;
  const percentage = topics.length ? Math.round((done / topics.length) * 100) : 0;

  return (
    <div data-testid="mastery-path" className="mastery-path-card">
      <div className="path-header">
        <div className="path-title-col">
          <span className="path-overline">Recorded progress</span>
          <h2 className="path-title">{subject.name || selectedSubject || 'This subject'}</h2>
        </div>
      </div>

      {topics.length === 0 ? (
        <p className="path-progress-text">
          No topics are listed for this subject yet, so there is no progress to show.
        </p>
      ) : (
        <>
          <div className="path-progress">
            <div className="path-progress-bar">
              <div className="path-progress-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="path-progress-text">
              {done} of {topics.length} topics read ({percentage}%). Counted from lessons this
              browser recorded you finishing, nothing else.
            </p>
          </div>

          <div className="path-lessons">
            {topics.map((topic) => {
              const isRead = read.has(topic.title.toLowerCase());
              return (
                <div key={`${topic.module}:${topic.title}`} className={`lesson-row-item ${isRead ? 'completed' : ''}`}>
                  <div className="lesson-check-indicator">
                    {isRead ? <Check size={13} aria-hidden="true" /> : <Circle size={9} aria-hidden="true" />}
                  </div>
                  <div className="lesson-info">
                    <h4 className="lesson-title">{topic.title}</h4>
                    <span className="lesson-time">{topic.module}</span>
                  </div>
                  <span className={`lesson-status ${isRead ? 'is-read' : ''}`}>
                    {isRead ? 'read' : 'not read'}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

MasteryPath.propTypes = {
  subject: PropTypes.shape({
    name: PropTypes.string,
    modules: PropTypes.array,
  }),
  selectedSubject: PropTypes.string,
};

export default MasteryPath;
