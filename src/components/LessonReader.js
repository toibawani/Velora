import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Link2, Compass, BriefcaseBusiness, CircleHelp, Users, CalendarClock, Sparkles, Zap, Share2, Check } from 'lucide-react';
import PeerExplanations from './PeerExplanations';
import ConceptMap from './ConceptMap';
import SmartReviewPlanner from './SmartReviewPlanner';
import RabbitHoleSidebar from './RabbitHoleSidebar';
import { trackEvent } from '../utils/analytics';
import { trackLessonCompleted } from '../utils/siteAnalytics';
import { copyText, COPY_OK } from '../utils/clipboard';
import { buildLessonShareUrl } from '../utils/shareLinks';
import { getReviewItems, addReviewItem, removeReviewItem } from '../utils/reviewPlanner';
import {
  getLessonProgress,
  saveLessonProgress,
  shouldOfferResume,
} from '../utils/resumePath';
import { recordStudySession } from '../utils/analyticsStorage';
import { parseInlineTerms } from './GlossaryTerm';

/**
 * LessonReader - full lesson view with peer explanations, concept map,
 * review scheduling, and Rabbit Hole cross-discipline exploration.
 */
import '../styles/LessonReader.css';

LessonReader.propTypes = {
  topic: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  subject: PropTypes.string,
  onBack: PropTypes.func,
  showToast: PropTypes.func,
  onOpenDialogue: PropTypes.func,
  onOpenGame: PropTypes.func,
};

function LessonReader({ topic, subject, onBack, showToast, onOpenDialogue, onOpenGame }) {
  const [saved, setSaved] = useState(() => topic ? getReviewItems().some((item) => item.id === `${subject}:${topic.id}`) : false);
  const [rabbitHoleOpen, setRabbitHoleOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  // How far through this lesson the reader got last time, when that is worth
  // offering. A lesson reopened at its first heading when someone was two
  // thirds down it is the reason this exists.
  const [resumeAt, setResumeAt] = useState(null);
  // The newest position seen, so a close can save without waiting for the next
  // throttled write.
  const lastPercent = useRef(null);
  const lastSavedPercent = useRef(null);
  const lastSavedAt = useRef(0);
  const openedAt = useRef(Date.now());
  const mainRef = useRef(null);
  const copyResetTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyResetTimer.current), []);
  useEffect(() => {
    openedAt.current = Date.now();
    setCompleted(false);

    const stored = topic ? getLessonProgress(subject, topic.id) : null;
    lastPercent.current = stored;
    lastSavedPercent.current = stored;
    setResumeAt(shouldOfferResume(stored) ? stored : null);
    // A different lesson starts at the top. Restoring the previous page's
    // offset would open the new one somewhere in the middle.
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [subject, topic?.id]);
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = main;

      // Where the reader is, as a share of what there is to scroll. Guarded
      // because a page shorter than its viewport has nothing to divide by.
      const scrollable = scrollHeight - clientHeight;
      if (scrollable > 0) {
        const percent = Math.round((scrollTop / scrollable) * 100);
        lastPercent.current = percent;
        const now = Date.now();
        // Throttled: one write per half second of scrolling is plenty for a
        // position that only matters when the page is closed.
        if (now - lastSavedAt.current > 500 && percent !== lastSavedPercent.current) {
          lastSavedAt.current = now;
          lastSavedPercent.current = percent;
          saveLessonProgress(subject, topic?.id, percent);
        }
      }

      if (completed) return;
      const scrolledToEnd = scrollHeight - scrollTop - clientHeight < 120;
      if (!scrolledToEnd) return;
      setCompleted(true);
      trackLessonCompleted(topic.title, subject);
    };
    main.addEventListener('scroll', onScroll, { passive: true });
    return () => main.removeEventListener('scroll', onScroll);
  }, [subject, topic?.title, completed]);
  useEffect(() => () => {
    const minutes = Math.max(1, Math.round((Date.now() - openedAt.current) / 60000));
    if (topic?.title) recordStudySession(topic.title, minutes, subject);
    // One last write on the way out, so closing the tab mid-read does not lose
    // the position to the throttle.
    if (topic?.id && lastPercent.current !== null) {
      saveLessonProgress(subject, topic.id, lastPercent.current);
    }
  }, [subject, topic?.title, topic?.id]);
  if (!topic) return null;

  // The Black Holes lesson's related game is the Relativity Lab, which lets a
  // reader play with event horizons right after reading about them.
  const relatedGame = subject === 'physics' && topic?.id === 'black-holes'
    ? { id: 'relativity', name: 'Relativity Lab', tab: 'classic' }
    : null;

  // Copy a clean, shareable link to this lesson. It resolves to the lesson for
  // anyone who has already set VELORA up on this device.
  const shareLesson = async () => {
    const url = buildLessonShareUrl(subject, topic.id);
    const result = await copyText(url);
    if (result === COPY_OK) {
      setCopiedLink(true);
      clearTimeout(copyResetTimer.current);
      copyResetTimer.current = setTimeout(() => setCopiedLink(false), 2500);
      if (showToast) showToast('Link to this lesson copied.', 'success');
    } else if (showToast) {
      showToast(
        'The browser would not let this page use the clipboard. Copy the address bar instead.',
        'info',
      );
    }
  };

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
          <button
            type="button"
            className="rabbit-hole-trigger-btn"
            onClick={() => setRabbitHoleOpen(true)}
            aria-label="Open Rabbit Hole Mode"
          >
            <Sparkles size={14} aria-hidden="true" /> Rabbit Hole
          </button>
          <button className={`lesson-save-btn ${saved ? 'saved' : ''}`} onClick={toggleSaved}>{saved ? 'Saved' : 'Save for review'}</button>
          <button
            type="button"
            className={`lesson-share-btn ${copiedLink ? 'copied' : ''}`}
            onClick={shareLesson}
            aria-label="Copy a link to this lesson"
          >
            {copiedLink ? <Check size={14} aria-hidden="true" /> : <Share2 size={14} aria-hidden="true" />}
            {copiedLink ? 'Link copied' : 'Share'}
          </button>
        </div>
      </header>
      <main className="lesson-reader-main" ref={mainRef}>
        {resumeAt !== null && (
          <div className="lesson-resume" role="status" data-testid="lesson-resume">
            <p className="lesson-resume-text">
              You were {resumeAt}% through this lesson last time.
            </p>
            <div className="lesson-resume-actions">
              <button
                type="button"
                className="lesson-resume-jump"
                onClick={() => {
                  const main = mainRef.current;
                  if (main) {
                    const scrollable = main.scrollHeight - main.clientHeight;
                    if (scrollable > 0) main.scrollTop = Math.round((resumeAt / 100) * scrollable);
                  }
                  setResumeAt(null);
                }}
              >
                Jump back to {resumeAt}%
              </button>
              <button
                type="button"
                className="lesson-resume-start"
                onClick={() => {
                  // Choosing the top is a position too: without recording it,
                  // the old percent would come back the next time the lesson
                  // opened.
                  if (mainRef.current) mainRef.current.scrollTop = 0;
                  lastPercent.current = 0;
                  lastSavedPercent.current = 0;
                  saveLessonProgress(subject, topic.id, 0);
                  setResumeAt(null);
                }}
              >
                Start from the top
              </button>
            </div>
          </div>
        )}
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
        {relatedGame && onOpenGame && (
          <section className="lesson-section-card lesson-related-game">
            <div className="lesson-card-heading"><Zap size={17} /><h2>Keep going with a game</h2></div>
            <p>{`Play with ${relatedGame.name.toLowerCase()}. Event horizons, time dilation and length contraction. Straight from the lesson you just read.`}</p>
            <button
              type="button"
              className="lesson-related-game-btn"
              onClick={() => onOpenGame(relatedGame.id, relatedGame.tab)}
            >
              Open {relatedGame.name} <ArrowRight size={14} />
            </button>
          </section>
        )}
      </main>
      <RabbitHoleSidebar
        topicId={topic.id}
        topicTitle={topic.title}
        subject={subject}
        isOpen={rabbitHoleOpen}
        onClose={() => setRabbitHoleOpen(false)}
        onNavigateFigure={onOpenDialogue}
      />
    </div>
  );
}

export default LessonReader;
