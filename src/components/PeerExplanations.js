import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb } from 'lucide-react';
import EmptyState from './EmptyState';
import { sanitizeText } from '../utils/sanitize';
import { EXPLANATION_BOARD, readValue, writeValue } from '../utils/storage';
import '../styles/PeerExplanations.css';

/**
 * An explanation board that only ever holds what this browser wrote.
 *
 * It used to ship three explanations with vote counts of 24, 12, 31 and 42,
 * attributed to nobody. There is no server and no second reader, so every one
 * of those numbers was invented, and the board opened on a conversation that
 * had not happened. It now starts empty and says where what you write goes.
 */
const storageKey = (topic) => EXPLANATION_BOARD(topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

/**
 * Stored explanations arrive from a previous version of this app, from a
 * half-finished write, or from someone poking at devtools. Keep the rows that
 * have text and drop the rest rather than letting one bad row break the list.
 */
const isValidExplanation = (item) =>
  item &&
  typeof item.text === 'string' &&
  item.text.trim().length > 0 &&
  item.text.length <= 400 &&
  (item.id === undefined || typeof item.id === 'string' || typeof item.id === 'number') &&
  (item.timestamp === undefined || typeof item.timestamp === 'string');

const readExplanations = (stored) =>
  Array.isArray(stored)
    ? stored.filter(isValidExplanation).map((item) => ({
        ...item,
        text: sanitizeText(item.text),
        // Rows written before this screen kept no timestamp. Falling back to
        // now is better than letting an Invalid Date reach the formatter,
        // which used to render the literal string "NaNd ago".
        timestamp: Number.isFinite(Date.parse(item.timestamp)) ? item.timestamp : new Date().toISOString(),
      }))
    : [];

PeerExplanations.propTypes = { topic: PropTypes.string, onNotify: PropTypes.shape({ "onNotify": PropTypes.func }) };

function PeerExplanations({ topic, onNotify }) {
  const [explanations, setExplanations] = useState(() => readExplanations(readValue(storageKey(topic), null)));
  const [newExplanation, setNewExplanation] = useState('');
  const [inputError, setInputError] = useState('');
  const submittingRef = useRef(false);

  useEffect(() => {
    writeValue(storageKey(topic), explanations);
  }, [explanations, topic]);

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
    if (text.length > 200) {
      setInputError('Keep your explanation to 200 characters or fewer.');
      submittingRef.current = false;
      return;
    }

    const explanation = { id: Date.now(), text, timestamp: new Date().toISOString() };
    submittingRef.current = true;
    setExplanations((current) => [explanation, ...current]);
    setNewExplanation('');
    setInputError('');
    if (onNotify) onNotify('Saved on this device. There is no server, so nobody else can read it.', 'success');
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
    (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)
  );

  return (
    <div data-testid="peer-explanations" className="peer-explanations">
      <div className="explanations-header">
        <h2 className="explanations-title">Your explanations</h2>
        <p className="explanations-subtitle">
          This board is stored in this browser. Nobody else can see it, because
          there is no server and no other people here. It is a place to work out
          how you would say a thing, not a feed.
        </p>
      </div>

      <form id="peer-explanation-form" className="explanation-input-box" onSubmit={handleSubmit}>
        <textarea
          className="explanation-input"
          placeholder="Explain this concept in 1-2 sentences, in your own words."
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
            Save this explanation
          </button>
        </div>
      </form>

      {sortedExplanations.length === 0 ? (
        <EmptyState
          icon={<Lightbulb size={28} aria-hidden="true" />}
          title="Nothing written yet"
          description="Write the first explanation of this concept. It stays on this device."
          actionText="Write an explanation"
          action={() => {
            const input = document.querySelector('.explanation-input');
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
    </div>
  );
}

export default PeerExplanations;
