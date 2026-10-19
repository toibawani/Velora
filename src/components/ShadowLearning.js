import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ArrowLeft, NotebookPen, Check, GraduationCap } from 'lucide-react';
import { KEYS, readValue, writeValue } from '../utils/storage';
import { sanitizeText } from '../utils/sanitize';
import '../styles/ShadowLearning.css';

/**
 * ShadowLearning - write an explanation of a concept in your own words.
 *
 * This screen used to open on three notes from "Anonymous #42", "#15" and "#7",
 * with vote counts of 145, 89, 234 and a "Most Helpful" badge. Nobody wrote
 * them, nobody voted on them, and the submit button said the note was "part of
 * the community conversation" although it never left the component's state.
 *
 * What is real is the exercise: writing the explanation is the part that makes
 * you notice what you do not understand. So the invented board is gone and the
 * saved notes are the ones this browser actually wrote.
 */
ShadowLearning.propTypes = {
  topic: PropTypes.shape({ name: PropTypes.string }),
  onBack: PropTypes.func,
  onNotify: PropTypes.func,
};

function readMine(term) {
  const stored = readValue(KEYS.MY_EXPLANATIONS, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (note) => note && typeof note.text === 'string' && note.term === term
  );
}

function ShadowLearning({ topic, onBack, onNotify }) {
  const term = topic?.name || 'this topic';
  const [myNote, setMyNote] = useState('');
  const [saved, setSaved] = useState(() => readMine(term));
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitNote = () => {
    const text = sanitizeText(myNote.trim());
    if (text.length < 20) {
      if (onNotify) onNotify('Write at least 20 characters so the idea is actually explained.', 'error');
      return;
    }

    const entry = { term, text, date: new Date().toLocaleDateString() };
    const stored = readValue(KEYS.MY_EXPLANATIONS, []);
    const list = Array.isArray(stored) ? stored : [];
    writeValue(KEYS.MY_EXPLANATIONS, [entry, ...list].slice(0, 10));

    setSaved((current) => [entry, ...current]);
    setMyNote('');
    setSubmitted(true);
    if (onNotify) onNotify('Saved on this device. Nothing was sent anywhere.', 'success');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div data-testid="shadow-learning" className="shadow-learning-container">
      {onBack && (
        <button type="button" className="learn-back-btn" onClick={onBack}>
          <ArrowLeft size={15} aria-hidden="true" /> Back
        </button>
      )}

      <h2>
        <NotebookPen size={20} aria-hidden="true" style={{ verticalAlign: '-4px', marginRight: 8 }} />
        Explain it back: {term}
      </h2>

      <div className="my-note-section">
        <h3>Your turn to teach</h3>
        <p className="challenge">
          Explain <strong>{term}</strong> in one sentence to someone who has never
          met the idea. If you cannot do it in one sentence, that is the part to
          go back and read.
        </p>
        <textarea
          placeholder="Write it the way you would say it out loud."
          value={myNote}
          onChange={(e) => setMyNote(e.target.value)}
          className="note-input-shadow"
          maxLength="280"
          aria-label={`Your explanation of ${term}`}
        />
        <div className="note-meta">
          <span className="char-count">{myNote.length}/280</span>
          <button
            className={`btn-submit-note ${submitted ? 'submitted' : ''}`}
            onClick={handleSubmitNote}
          >
            {submitted ? (
              <>
                <Check size={15} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />
                Saved
              </>
            ) : (
              <>
                <NotebookPen size={15} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />
                Save this explanation
              </>
            )}
          </button>
        </div>
      </div>

      <div className="community-notes">
        <h3>
          <GraduationCap size={18} aria-hidden="true" style={{ verticalAlign: '-3px', marginRight: 6 }} />
          What you have written on this device
        </h3>

        {saved.length === 0 ? (
          <p className="challenge">
            Nothing saved for this topic yet. The first one you write will appear here.
          </p>
        ) : (
          <div className="notes-list">
            {saved.map((note, idx) => (
              <div key={`${note.date}-${idx}`} className="note-item">
                <p className="note-text">&quot;{note.text}&quot;</p>
                <span className="note-date">{note.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shadow-note">
        <p>
          <strong>There is no community here.</strong> VELORA has no server, so
          these notes are not shared and nobody can reply to them. They are a
          record of how you explained something today, which is useful the next
          time you try.
        </p>
      </div>
    </div>
  );
}

export default ShadowLearning;
