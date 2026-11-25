import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';
import EmptyState from './EmptyState';
import { sanitizeText } from '../utils/sanitize';
import { EXPLANATION_BOARD, readValue, writeValue } from '../utils/storage';
import { backendEnabled } from '../backend/supabaseClient';
import {
  fetchApprovedExplanations,
  reportExplanation,
  submitExplanation,
} from '../backend/api';
import { useSessionUser } from '../backend/useSession';

/**
 * Explain it back, then read how someone else put it.
 *
 * Two boards live here and they are not the same thing:
 *
 *  - Your answer, stored in this browser and readable only by you. It works
 *    signed out, offline and with analytics switched off.
 *  - Reviewed explanations for this topic, read from the account, which anyone
 *    can read and which never contains anything unreviewed. A submitted answer
 *    goes into a queue: the UI says so in those words, and nothing you write
 *    appears in the reviewed list until it has been approved.
 *
 * Everything here is text. Individual answers arrive as strings from the
 * database, are rendered as children (so React escapes them) and are never put
 * through an HTML path.
 *
 * It used to ship three explanations with vote counts of 24, 12, 31 and 42,
 * attributed to nobody. No one had said any of it and no one had voted, so every
 * number was invented. Those rows and the vote controls are gone.
 */
const storageKey = (topic) => EXPLANATION_BOARD(String(topic || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'));

/** The server's floor, which is stricter than the local one. */
const REVIEW_MIN = 20;
const REVIEW_MAX = 600;

/**
 * Stored explanations arrive from a previous version of this app, from a
 * half-finished write, or from someone poking at devtools. Keep the rows that
 * have text and drop the rest rather than letting one bad row break the list.
 */
const isValidExplanation = (item) =>
  item &&
  typeof item.text === 'string' &&
  item.text.trim().length > 0 &&
  item.text.length <= REVIEW_MAX &&
  (item.id === undefined || typeof item.id === 'string' || typeof item.id === 'number') &&
  (item.timestamp === undefined || typeof item.timestamp === 'string');

const readExplanations = (stored) =>
  Array.isArray(stored)
    ? stored.filter(isValidExplanation).map((item) => ({
        ...item,
        text: sanitizeText(item.text),
        // Rows written before this screen kept no timestamp. Falling back to
        // now is better than letting an Invalid Date reach the formatter.
        timestamp: Number.isFinite(Date.parse(item.timestamp)) ? item.timestamp : new Date().toISOString(),
      }))
    : [];

PeerExplanations.propTypes = {
  topic: PropTypes.string,
  topicId: PropTypes.string,
  onNotify: PropTypes.shape({ onNotify: PropTypes.func }),
};

function PeerExplanations({ topic, topicId, onNotify }) {
  const { user, ready } = useSessionUser();
  const [explanations, setExplanations] = useState(() => readExplanations(readValue(storageKey(topic), null)));
  const [newExplanation, setNewExplanation] = useState('');
  const [inputError, setInputError] = useState('');
  const submittingRef = useRef(false);

  // The reviewed list.
  const [approved, setApproved] = useState([]);
  const [approvedState, setApprovedState] = useState('idle');
  const [approvedError, setApprovedError] = useState(null);

  // Submitting one of your own.
  const [reviewNotice, setReviewNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reporting one that is already published.
  const [reportingId, setReportingId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportNotice, setReportNotice] = useState(null);

  useEffect(() => {
    writeValue(storageKey(topic), explanations);
  }, [explanations, topic]);

  const loadApproved = () => {
    if (!backendEnabled || !topicId) return () => {};
    let live = true;
    setApprovedState('loading');
    setApprovedError(null);
    fetchApprovedExplanations(topicId)
      .then((rows) => {
        if (!live) return;
        setApproved(rows.filter((row) => row && typeof row.body === 'string'));
        setApprovedState('ready');
      })
      .catch((error) => {
        if (!live) return;
        setApproved([]);
        setApprovedError((error && error.message) || 'That did not load. Try again in a moment.');
        setApprovedState('error');
      });
    return () => {
      live = false;
    };
  };

  useEffect(loadApproved, [topicId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Someone mashing the button, or a form submitted twice by a stuck enter
    // key, should not produce two identical entries.
    if (submittingRef.current) return;
    const rawText = newExplanation.trim();
    const text = sanitizeText(rawText);
    if (text.length < 10) {
      setInputError('Add a little more detail so the next read of it makes sense.');
      submittingRef.current = false;
      return;
    }
    if (text.length > REVIEW_MAX) {
      setInputError(`Keep your explanation to ${REVIEW_MAX} characters or fewer.`);
      submittingRef.current = false;
      return;
    }

    const explanation = { id: Date.now(), text, timestamp: new Date().toISOString() };
    submittingRef.current = true;
    setExplanations((current) => [explanation, ...current]);
    setNewExplanation('');
    setInputError('');
    setReviewNotice(null);
    if (onNotify) onNotify('Saved on this device. Nobody else can read it.', 'success');
  };

  const submitForReview = async () => {
    if (!user || submitting) return;
    const text = newExplanation.trim() || (explanations[0] && explanations[0].text) || '';
    if (text.length < REVIEW_MIN) {
      setReviewNotice({
        tone: 'error',
        text: `For review, write at least ${REVIEW_MIN} characters so it can be read on its own.`,
      });
      return;
    }
    setSubmitting(true);
    setReviewNotice(null);
    try {
      await submitExplanation(topicId, text);
      setReviewNotice({
        tone: 'info',
        text: 'Pending review. It is queued, and nobody else can see it until it has been read and approved.',
      });
    } catch (error) {
      setReviewNotice({
        tone: 'error',
        text: (error && error.message) || 'That did not send. Your answer is still saved here.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sendReport = async (explanationId) => {
    setReportNotice(null);
    try {
      await reportExplanation(explanationId, reportReason);
      setReportNotice({
        tone: 'info',
        text: 'Thanks. That report is queued for review.',
        forId: explanationId,
      });
      setReportingId(null);
      setReportReason('');
    } catch (error) {
      setReportNotice({
        tone: 'error',
        text: (error && error.message) || 'That did not send. Try again in a moment.',
        forId: explanationId,
      });
    }
  };

  const getTimeAgo = (timestamp) => {
    const diff = Date.now() - Date.parse(timestamp);
    // A missing or unparseable date is not worth a crash or a "NaNd ago".
    if (!Number.isFinite(diff)) return 'recently';
    if (diff < 0) return 'just now';

    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const sortedExplanations = [...explanations].sort(
    (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
  );

  const canReview = Boolean(user) && ready;

  return (
    <div data-testid="peer-explanations" className="peer-explanations">
      <div className="explanations-header">
        <h2 className="explanations-title">Your explanations</h2>
        <p className="explanations-subtitle">
          This board is stored in this browser. Nobody else can see it. It is a place to work out how
          you would say a thing, not a feed.
        </p>
      </div>

      <form id="peer-explanation-form" className="explanation-input-box" onSubmit={handleSubmit}>
        <label className="explanation-label" htmlFor="peer-explanation-input">
          Explain this in your own words
        </label>
        <textarea
          id="peer-explanation-input"
          className="explanation-input"
          placeholder="Explain this concept in 1-2 sentences, in your own words."
          value={newExplanation}
          onChange={(event) => {
            setNewExplanation(event.target.value);
            setInputError('');
            setReviewNotice(null);
            submittingRef.current = false;
          }}
          maxLength={REVIEW_MAX}
          aria-invalid={Boolean(inputError)}
          aria-describedby={inputError ? 'peer-explanation-error' : undefined}
        />
        {inputError && (
          <p className="explanation-error" id="peer-explanation-error" role="alert">
            {inputError}
          </p>
        )}
        <div className="input-footer">
          <span className="char-count">
            {newExplanation.length}/{REVIEW_MAX}
          </span>
          <button className="submit-btn" type="submit">
            Save this explanation
          </button>
          {canReview && (
            <button
              className="submit-btn submit-btn--review"
              type="button"
              onClick={submitForReview}
              disabled={submitting}
            >
              {submitting ? 'Sending for review' : 'Submit for review'}
            </button>
          )}
        </div>
      </form>

      {reviewNotice && (
        <p
          className="explanation-error"
          role={reviewNotice.tone === 'error' ? 'alert' : 'status'}
        >
          {reviewNotice.text}
        </p>
      )}

      {backendEnabled && ready && !user && (
        <p className="explanations-note">
          Sign in from Settings to submit an answer for review. Until then, everything you write here
          stays on this device.
        </p>
      )}

      {sortedExplanations.length === 0 ? (
        <EmptyState
          icon={<Lightbulb size={28} aria-hidden="true" />}
          title="Nothing written yet"
          description="Write the first explanation of this concept. It stays on this device."
          actionText="Write an explanation"
          action={() => {
            const input = document.getElementById('peer-explanation-input');
            if (input) input.focus();
          }}
        />
      ) : (
        <div className="explanations-list">
          {sortedExplanations.map((exp) => (
            <div key={exp.id} className="explanation-card">
              <p className="explanation-text">&quot;{exp.text}&quot;</p>
              <div className="explanation-footer">
                <span className="time-ago">{getTimeAgo(exp.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {backendEnabled && (
        <section className="approved-explanations" aria-labelledby="approved-title">
          <h3 id="approved-title" className="explanations-title explanations-title--small">
            {/* The only number on this screen, and it is counted from the rows
                that actually arrived. Nothing is estimated or stored. */}
            {approvedState === 'ready' && approved.length > 0
              ? `Reviewed explanations (${approved.length})`
              : 'Reviewed explanations'}
          </h3>

          {approvedState === 'loading' && (
            <p className="explanations-note" role="status">
              Loading reviewed explanations.
            </p>
          )}

          {approvedState === 'error' && (
            <div className="explanations-note">
              <p role="alert">
                <AlertTriangle size={14} aria-hidden="true" /> {approvedError}
              </p>
              <button type="button" className="submit-btn" onClick={loadApproved}>
                Try again
              </button>
            </div>
          )}

          {approvedState === 'ready' && approved.length === 0 && (
            <p className="explanations-note">No explanations yet</p>
          )}

          {approvedState === 'ready' && approved.length > 0 && (
            <ul className="approved-list">
              {approved.map((row) => (
                <li key={row.id} className="approved-row">
                  <p className="explanation-text">{row.body}</p>
                  <p className="explanations-note explanations-note--quiet">
                    Reviewed. Written by another reader.
                  </p>

                  {reportingId === row.id ? (
                    <div className="report-form">
                      <label className="explanation-label" htmlFor={`report-reason-${row.id}`}>
                        Why report this?
                      </label>
                      <input
                        id={`report-reason-${row.id}`}
                        className="report-input"
                        value={reportReason}
                        onChange={(event) => setReportReason(event.target.value)}
                        placeholder="Wrong, off topic, or unkind"
                      />
                      <button
                        type="button"
                        className="submit-btn"
                        onClick={() => sendReport(row.id)}
                      >
                        Send report
                      </button>
                      <button
                        type="button"
                        className="st-clear"
                        onClick={() => {
                          setReportingId(null);
                          setReportReason('');
                          setReportNotice(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="st-clear"
                      onClick={() => {
                        setReportingId(row.id);
                        setReportNotice(null);
                      }}
                    >
                      Report
                    </button>
                  )}

                  {reportNotice && reportNotice.forId === row.id && (
                    <p
                      className="explanations-note"
                      role={reportNotice.tone === 'error' ? 'alert' : 'status'}
                    >
                      {reportNotice.text}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

export default PeerExplanations;
