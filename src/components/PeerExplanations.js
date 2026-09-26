import React, { useState, useEffect, useRef } from 'react';
import EmptyState from './EmptyState';
import { sanitizeText } from '../utils/sanitize';
import { safeGet, safeSet } from '../utils/storage';
import '../styles/PeerExplanations.css';

const DEFAULT_EXPLANATIONS = [
  { id: 1, text: 'Imagine spacetime as a rubber sheet. Heavy objects bend it, creating gravity. Nothing can escape once it bends too much.', votes: { clear: 24, funny: 3, mindBending: 8 }, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, text: 'A black hole is where physics breaks. Time stops, space folds, and light gives up. It is the universe saying “I don’t know.”', votes: { clear: 12, funny: 42, mindBending: 18 }, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, text: 'Think of it as an infinite trap. You can look in but never get out. Not even light escapes.', votes: { clear: 31, funny: 2, mindBending: 5 }, timestamp: new Date(Date.now() - 86400000).toISOString() }
];

const storageKey = (topic) => `velora_explanations_${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const VOTE_TYPES = ['clear', 'funny', 'mindBending'];

/**
 * Stored explanations arrive from a previous version of this app, from a
 * half-finished write, or from someone poking at devtools. The old check only
 * asked whether `votes` was truthy, so `votes: {}` and `votes: "yes"` both
 * passed, and then every counter rendered NaN and the sort comparator returned
 * NaN, which left the list in whatever order it started in.
 */
const isValidVotes = (votes) =>
  votes &&
  typeof votes === 'object' &&
  !Array.isArray(votes) &&
  VOTE_TYPES.every((type) => Number.isFinite(votes[type]) && votes[type] >= 0);

const isValidExplanation = (item) =>
  item &&
  typeof item.text === 'string' &&
  item.text.trim().length > 0 &&
  item.text.length <= 400 &&
  isValidVotes(item.votes) &&
  (item.id === undefined || typeof item.id === 'string' || typeof item.id === 'number') &&
  (item.timestamp === undefined || typeof item.timestamp === 'string');

/** Drop anything malformed rather than letting one bad row poison the list. */
const readExplanations = (stored) =>
  Array.isArray(stored) ? stored.filter(isValidExplanation) : null;

function PeerExplanations({ topic, onNotify }) {
  const [explanations, setExplanations] = useState(() => {
    const saved = readExplanations(safeGet(storageKey(topic), null));
    if (saved && saved.length) {
      return saved.map((item) => ({
        ...item,
        votes: { ...Object.fromEntries(VOTE_TYPES.map((type) => [type, item.votes[type]])) },
        text: sanitizeText(item.text),
        // Rows written before this screen kept no timestamp. Falling back to
        // now is better than letting an Invalid Date reach the formatter,
        // which used to render the literal string "NaNd ago".
        timestamp: Number.isFinite(Date.parse(item.timestamp)) ? item.timestamp : new Date().toISOString(),
      }));
    }
    return DEFAULT_EXPLANATIONS;
  });

  const [newExplanation, setNewExplanation] = useState('');
  const [inputError, setInputError] = useState('');
  const [userVotes, setUserVotes] = useState({});
  const submittingRef = useRef(false);

  useEffect(() => {
    safeSet(storageKey(topic), explanations);
  }, [explanations, topic]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Someone mashing the button, or a form submitted twice by a stuck enter
    // key, should not produce two identical posts.
    if (submittingRef.current) return;
    const rawText = newExplanation.trim();
    const text = sanitizeText(rawText);
    if (text.length < 10) {
      setInputError('Add a little more detail so another learner can follow your thinking.');
      submittingRef.current = false;
      return;
    }
    if (text.length > 200) {
      setInputError('Keep your explanation to 200 characters or fewer.');
      submittingRef.current = false;
      return;
    }

    const explanation = { id: Date.now(), text, votes: { clear: 0, funny: 0, mindBending: 0 }, timestamp: new Date().toISOString() };
    submittingRef.current = true;
    setExplanations((current) => [explanation, ...current]);
    setNewExplanation('');
    setInputError('');
    if (onNotify) onNotify('Your explanation is now part of the conversation.', 'success');
  };

  const handleVote = (id, voteType) => {
    if (!VOTE_TYPES.includes(voteType)) return;
    const key = `${id}-${voteType}`;
    if (userVotes[key]) {
      if (onNotify) onNotify('You have already voted on this explanation.', 'info');
      return;
    }

    // Functional update, so two quick clicks cannot both read the same list and
    // one of the votes goes missing.
    setExplanations((current) =>
      current.map((exp) =>
        exp.id === id
          ? { ...exp, votes: { ...exp.votes, [voteType]: (exp.votes[voteType] || 0) + 1 } }
          : exp
      )
    );

    setUserVotes((current) => ({ ...current, [key]: true }));
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
    (a, b) => (b.votes.clear + b.votes.mindBending) - (a.votes.clear + a.votes.mindBending)
  );

  return (
    <div className="peer-explanations">
      <div className="explanations-header">
        <h2 className="explanations-title">How Others Explain This</h2>
        <p className="explanations-subtitle">
          Kept in this browser for now. Sharing them between people needs a server
          and someone to read them first.
        </p>
      </div>

      <form id="peer-explanation-form" className="explanation-input-box" onSubmit={handleSubmit}>
        <textarea
          className="explanation-input"
          placeholder="Explain this concept in 1-2 sentences. Be clear, be creative!"
          value={newExplanation}
          onChange={(e) => {
            setNewExplanation(e.target.value);
            setInputError('');
            submittingRef.current = false;
          }}
          maxLength={200}
          aria-invalid={Boolean(inputError)}
          aria-describedby={inputError ? 'peer-explanation-error' : undefined}
        />
        {inputError && <p className="explanation-error" id="peer-explanation-error" role="alert">{inputError}</p>}
        <div className="input-footer">
          <span className="char-count">{newExplanation.length}/200</span>
          <button className="submit-btn" type="submit">
            Share Anonymously →
          </button>
        </div>
      </form>

      {sortedExplanations.length === 0 ? (
        <EmptyState
          icon="💡"
          title="No peer explanations yet"
          description="Be the first to explain this concept in simple words for your peers."
          actionText="Write First Explanation"
          action={() => {
            const input = document.querySelector('.explanation-input');
            if (input) input.focus();
          }}
        />
      ) : (
        <div className="explanations-list">
          {sortedExplanations.map((exp) => (
            <div key={exp.id} className="explanation-card">
              <p className="explanation-text">"{exp.text}"</p>

              <div className="explanation-footer">
                <span className="time-ago">{getTimeAgo(exp.timestamp)}</span>

                <div className="vote-buttons">
                  <button
                    className={`vote-btn clear ${userVotes[`${exp.id}-clear`] ? 'voted' : ''}`}
                    onClick={() => handleVote(exp.id, 'clear')}
                     disabled={Boolean(userVotes[`${exp.id}-clear`])}
                     aria-label="Vote clear"
                  >
                    <span className="vote-icon">🎯</span>
                    <span className="vote-count">{exp.votes.clear}</span>
                  </button>

                  <button
                    className={`vote-btn funny ${userVotes[`${exp.id}-funny`] ? 'voted' : ''}`}
                    onClick={() => handleVote(exp.id, 'funny')}
                     disabled={Boolean(userVotes[`${exp.id}-funny`])}
                     aria-label="Vote funny"
                  >
                    <span className="vote-icon">😄</span>
                    <span className="vote-count">{exp.votes.funny}</span>
                  </button>

                  <button
                    className={`vote-btn mindBending ${userVotes[`${exp.id}-mindBending`] ? 'voted' : ''}`}
                    onClick={() => handleVote(exp.id, 'mindBending')}
                     disabled={Boolean(userVotes[`${exp.id}-mindBending`])}
                     aria-label="Vote mind-bending"
                  >
                    <span className="vote-icon">🤯</span>
                    <span className="vote-count">{exp.votes.mindBending}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PeerExplanations;