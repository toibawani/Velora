import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import { trackEvent } from '../utils/analytics';
import { addNote, addQuestion, findTopic, getQuestions, removeQuestion, topicChoices } from '../utils/questionDesk';
import '../styles/Community.css';

/**
 * Question desk.
 *
 * This screen used to be a discussion forum: four threads written by
 * "Scholar_409", "RelativityTutor" and "DialecticMind", carrying 242, 187, 134
 * and 311 votes, stamped "Verified Mentor" and "3h ago", filed into four rooms
 * with 1,240 to 3,420 members and live counters reading "38 active now". None of
 * it existed. Velora has no server, no accounts and no way to know that another
 * person is using it, so every name, vote, badge, member count and "active now"
 * number on that screen was typed out by hand, and the answers on those threads
 * were marked expert-verified by the same hand.
 *
 * What is left is the only conversation this app can honestly host: the one with
 * yourself. Write a question down, keep it, add notes to it as you go, and link
 * it to a lesson that is actually in the curriculum. Entries are stored on this
 * device and come back next time - the old screen accepted what you wrote and
 * discarded it on navigation, while making it look like a public post.
 */

const SUBJECTS = Object.entries(CURRICULUM).map(([id, record]) => ({ id, label: record.name }));

const MIN_QUESTION = 15;

const whenLabel = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'undated';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

function Community({ setScreen, onOpenLesson }) {
  const [questions, setQuestions] = useState(() => getQuestions());
  const [draft, setDraft] = useState('');
  const [draftSubject, setDraftSubject] = useState(SUBJECTS[0].id);
  const [draftTopic, setDraftTopic] = useState('');
  const [notice, setNotice] = useState(null);
  const [noteDrafts, setNoteDrafts] = useState({});

  useEffect(() => {
    trackEvent('screen_view', { screen: 'community' });
  }, []);

  const topicOptions = useMemo(() => topicChoices(draftSubject), [draftSubject]);

  // Choosing a subject invalidates a lesson picked from the previous one.
  useEffect(() => {
    setDraftTopic('');
  }, [draftSubject]);

  const questionTooShort = draft.trim().length > 0 && draft.trim().length < MIN_QUESTION;

  const handleAsk = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (trimmed.length < MIN_QUESTION) {
      setNotice(`Write at least ${MIN_QUESTION} characters - a question worth keeping is usually a sentence.`);
      return;
    }
    setNotice(null);
    setQuestions(addQuestion({ question: trimmed, subject: draftSubject, topicId: draftTopic || null }));
    setDraft('');
    setDraftTopic('');
    trackEvent('question_asked', { subject: draftSubject });
  };

  const handleNote = (questionId) => {
    const text = noteDrafts[questionId] || '';
    if (text.trim() === '') return;
    setQuestions(addNote(questionId, text));
    setNoteDrafts((prev) => ({ ...prev, [questionId]: '' }));
  };

  const handleDelete = (questionId) => {
    setQuestions(removeQuestion(questionId));
  };

  const noteCount = questions.reduce((total, entry) => total + (entry.notes || []).length, 0);

  return (
    <div className="community-page">
      <header className="community-nav-header">
        <div className="comm-header-left">
          <button className="comm-back-btn" onClick={() => setScreen('universe')}>
            ← Back
          </button>
          <div className="comm-header-titles">
            <h1 className="comm-title">Question Desk</h1>
            <p className="comm-subtitle">
              Questions you have written down, and the notes you have added since.
            </p>
          </div>
        </div>
        <span className="comm-device-note">Saved on this device</span>
      </header>

      <main className="community-main-body">
        <section className="ask-question-box">
          <form onSubmit={handleAsk}>
            <div className="ask-header-row">
              <h2 className="ask-heading">Ask yourself something</h2>
              <label className="ask-field-label">
                Subject
                <select
                  className="ask-subject-select"
                  value={draftSubject}
                  onChange={(event) => setDraftSubject(event.target.value)}
                >
                  {SUBJECTS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="ask-field-label">
                Lesson you think might answer it
                <select
                  className="ask-subject-select"
                  value={draftTopic}
                  onChange={(event) => setDraftTopic(event.target.value)}
                >
                  <option value="">Not sure yet</option>
                  {topicOptions.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <textarea
              className="ask-textarea"
              placeholder="What is actually confusing you? Not what you read - what you cannot yet resolve."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
            />

            <div className="ask-footer-row">
              <span className={`char-count-text ${questionTooShort ? 'short' : ''}`}>
                {draft.trim().length === 0
                  ? 'Nothing written yet'
                  : `${draft.trim().length} characters`}
              </span>
              <button type="submit" className="ask-submit-btn" disabled={questionTooShort}>
                Keep this question
              </button>
            </div>
          </form>
        </section>

        {notice && (
          <div className="comm-alert-box">
            <AlertTriangle size={16} aria-hidden="true" />
            <span className="comm-alert-text">{notice}</span>
          </div>
        )}

        <section className="discussion-cards-stack">
          <h2 className="stack-heading">
            {questions.length === 0
              ? 'No questions yet'
              : `${questions.length} question${questions.length === 1 ? '' : 's'} · ${noteCount} note${
                  noteCount === 1 ? '' : 's'
                }`}
          </h2>

          {questions.length === 0 && (
            <p className="stack-empty-text">
              Nothing here is waiting for you. When you write a question it stays: the same list will be
              here tomorrow, on this device, with whatever notes you added.
            </p>
          )}

          {questions.map((entry) => {
            const topic = entry.topicId ? findTopic(entry.subject, entry.topicId) : null;
            return (
              <article className="discussion-card" key={entry.id}>
                <div className="disc-card-top-row">
                  <span className="disc-subject-tag">
                    {CURRICULUM[entry.subject]?.name || entry.subject}
                  </span>
                  <span className="disc-time">{whenLabel(entry.createdAt)}</span>
                </div>

                <h3 className="disc-question">{entry.question}</h3>

                <div className="disc-lesson-row">
                  {topic ? (
                    <>
                      <span className="disc-lesson-hint">
                        <BookOpen size={14} aria-hidden="true" />
                        You pointed at {topic.title}
                      </span>
                      {onOpenLesson && (
                        <button
                          className="disc-lesson-btn"
                          onClick={() => onOpenLesson(entry.subject, topic.id)}
                        >
                          Open that lesson
                          <ArrowRight size={14} aria-hidden="true" />
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="disc-lesson-hint">
                      You have not pointed at a lesson for this one yet.
                    </span>
                  )}
                </div>

                {(entry.notes || []).length > 0 && (
                  <ul className="desk-notes-list">
                    {entry.notes.map((note) => (
                      <li className="desk-note-item" key={note.id}>
                        <span className="note-body">{note.text}</span>
                        <span className="note-time">{whenLabel(note.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="reply-input-row">
                  <input
                    type="text"
                    className="reply-input"
                    placeholder="Add a note - an answer, a half-thought, what you now think the difficulty is"
                    value={noteDrafts[entry.id] || ''}
                    onChange={(event) =>
                      setNoteDrafts((prev) => ({ ...prev, [entry.id]: event.target.value }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleNote(entry.id);
                    }}
                  />
                  <button type="button" className="reply-submit-btn" onClick={() => handleNote(entry.id)}>
                    Add note
                  </button>
                  <button
                    type="button"
                    className="disc-discard-btn"
                    onClick={() => handleDelete(entry.id)}
                    aria-label={`Discard this question`}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    <span className="disc-discard-text">Discard</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default Community;
