import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Link2, Compass, BriefcaseBusiness, CircleHelp, Users, CalendarClock } from 'lucide-react';
import PeerExplanations from './PeerExplanations';
import ConceptMap from './ConceptMap';
import SmartReviewPlanner from './SmartReviewPlanner';
import { trackEvent } from '../utils/analytics';
import { getReviewItems, addReviewItem, removeReviewItem } from '../utils/reviewPlanner';
import { recordStudySession } from '../utils/analyticsStorage';
import { parseInlineTerms } from './GlossaryTerm';

/**
 * LessonReader - full lesson view with peer explanations, concept map,
 * and review scheduling for the current lesson.
 */
import '../styles/LessonReader.css';

LessonReader.propTypes = { topic: PropTypes.string, subject: PropTypes.string, onBack: PropTypes.shape({"onBack": PropTypes.func}), showToast: PropTypes.shape({"showToast": PropTypes.func}) };

function LessonReader({ topic, subject, onBack, showToast }) {
  const [saved, setSaved] = useState(() => topic ? getReviewItems().some((item) => item.id === `${subject}:${topic.id}`) : false);
  const openedAt = useRef(Date.now());
  useEffect(() => {
    openedAt.current = Date.now();
  }, [subject, topic?.id]);
  useEffect(() => () => {
    const minutes = Math.max(1, Math.round((Date.now() - openedAt.current) / 60000));
    if (topic?.title) recordStudySession(topic.title, minutes, subject);
  }, [subject, topic?.title]);
  if (!topic) return null;

  const toggleSaved = () => {
    const nextSaved = !saved;
    if (nextSaved) addReviewItem(topic, subject);
    else removeReviewItem(`${subject}:${topic.id}`);
    setSaved(nextSaved);
    trackEvent('lesson_saved', { subject, topic: topic.id, saved: nextSaved });
    if (showToast) showToast(nextSaved ? 'Lesson saved. Your first review is tomorrow.' : 'Lesson removed from your review list.', 'success');
  };

  return (
    <div className="lesson-reader">
      <header className="lesson-reader-header">
        <button className="learn-back-btn" onClick={onBack}><ArrowLeft size={16} /> Back to path</button>
        <div className="lesson-reader-actions">
          <button className={`lesson-save-btn ${saved ? 'saved' : ''}`} onClick={toggleSaved}>{saved ? 'Saved' : 'Save for review'}</button>
        </div>
      </header>
      <main className="lesson-reader-main">
        <div className="lesson-kicker">{topic.moduleTitle} · {topic.minutes} min read</div>
        <h1>{topic.title}</h1>
        <p className="lesson-kicker-line">{topic.kicker}</p>
        <section className="lesson-story"><span className="lesson-section-label">The idea</span><p>{parseInlineTerms(topic.story)}</p></section>
        <div className="lesson-section-list">
          {topic.sections.map((section, index) => <section className="lesson-block" key={section.heading}><div className="lesson-block-number">{String(index + 1).padStart(2, '0')}</div><div><h2>{section.heading}</h2><p>{parseInlineTerms(section.body)}</p></div></section>)}
        </div>
        <section className="lesson-callout"><div className="lesson-callout-heading"><CircleHelp size={18} /><h2>Where the edge is</h2></div><p>{parseInlineTerms(topic.uncertainty)}</p></section>
        {/* The reading list. A lesson that cannot say what it was checked
            against is asking to be believed, so the sources are part of the
            lesson rather than a footnote nobody opens. Links open in a new tab
            because the reader is in the middle of something. */}
        {topic.sources?.length > 0 && (
          <section className="lesson-section-card lesson-sources">
            <div className="lesson-card-heading"><Link2 size={17} /><h2>Where this came from</h2></div>
            <ul>
              {topic.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="lesson-columns">
          <section className="lesson-list-card"><div className="lesson-card-heading"><Link2 size={17} /><h2>How it connects</h2></div><ul>{topic.connections.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="lesson-list-card"><div className="lesson-card-heading"><BriefcaseBusiness size={17} /><h2>Why it matters</h2></div><p>{parseInlineTerms(topic.career)}</p></section>
        </div>
        <section className="lesson-section-card"><div className="lesson-card-heading"><Compass size={17} /><h2>Map the idea</h2></div><ConceptMap subject={subject} /></section>
        <section className="lesson-section-card"><div className="lesson-card-heading"><Users size={17} /><h2>Compare explanations</h2></div><PeerExplanations topic={topic.title} onNotify={showToast} /></section>
        <section className="lesson-section-card"><div className="lesson-card-heading"><CalendarClock size={17} /><h2>Return to this later</h2></div><SmartReviewPlanner selectedSubject={subject} onNotify={showToast} /></section>
      </main>
    </div>
  );
}

export default LessonReader;
