import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, BookOpen, Check, ListTodo, Trash2, Undo2 } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import {
  MAX_LENGTH,
  MIN_LENGTH,
  addTask,
  clearCompleted,
  completeTask,
  getDoneTasks,
  getLastWriteResult,
  getOpenTasks,
  removeTask,
  reopenTask,
} from '../utils/nextUp';
import { findTopic, topicChoices } from '../utils/questionDesk';
import { FAILURE } from '../utils/storage';
import '../styles/NextUp.css';

/**
 * Next up.
 *
 * A list of things you noticed while reading and want to come back to. "Read
 * up on Hawking radiation", "find where that Nietzsche quote comes from".
 *
 * It is not a todo app and does not pretend to be one. There are no due dates,
 * because a due date on something stored in one browser cannot fire once the
 * tab is closed, and there is no reminder, because there is no service worker
 * and no server to send one from. A list that looked like a todo app and could
 * not do any of the things a todo app does would be worse than a list that says
 * what it is.
 *
 * Items can point at a lesson that exists. Where one is chosen the item can
 * open it, which is the whole reason this list is scoped to learning rather
 * than being a notes app.
 */

const SUBJECTS = Object.entries(CURRICULUM).map(([id, record]) => ({ id, label: record.name }));

const NOT_SAVED = {
  disabled:
    'This browser is not letting VELORA store anything, so that item is only here for this visit. It will be gone when you close the tab.',
  quota:
    'This browser is out of storage space, so that item was not saved. Anything already on the list is still there.',
  failed:
    'This browser refused to save that, so it is not being kept. Private browsing and a full storage quota both cause this.',
};

const whenLabel = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'undated';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

function NextUp({ setScreen, onOpenLesson }) {
  const [open, setOpen] = useState(() => getOpenTasks());
  const [done, setDone] = useState(() => getDoneTasks());
  const [draft, setDraft] = useState('');
  const [draftSubject, setDraftSubject] = useState(SUBJECTS[0].id);
  const [draftTopic, setDraftTopic] = useState('');
  const [notice, setNotice] = useState(null);

  const trimmed = draft.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_LENGTH;
  const tooLong = trimmed.length > MAX_LENGTH;
  const canAdd = trimmed.length >= MIN_LENGTH && !tooLong;

  const topicOptions = topicChoices(draftSubject);

  /** Re-read from storage after every write, so the list cannot drift from it. */
  const refresh = () => {
    setOpen(getOpenTasks());
    setDone(getDoneTasks());
  };

  const handleAdd = (event) => {
    event.preventDefault();
    if (!canAdd) return;

    const { result } = addTask({ text: draft, subject: draftSubject, topicId: draftTopic || null });
    refresh();

    if (result === FAILURE.NONE) {
      setDraft('');
      setNotice(null);
      return;
    }
    setNotice(NOT_SAVED[result] || NOT_SAVED.failed);
  };

  const handleComplete = (id) => {
    completeTask(id);
    refresh();
    reportWrite();
  };

  const handleReopen = (id) => {
    reopenTask(id);
    refresh();
    reportWrite();
  };

  const handleRemove = (id) => {
    removeTask(id);
    refresh();
    reportWrite();
  };

  const handleClearCompleted = () => {
    clearCompleted();
    refresh();
    reportWrite();
  };

  /** Says so when a write did not land, rather than the item just vanishing. */
  const reportWrite = () => {
    const result = getLastWriteResult();
    setNotice(result === FAILURE.NONE ? null : NOT_SAVED[result] || NOT_SAVED.failed);
  };

  const renderItem = (item) => {
    const topic = item.topicId ? findTopic(item.subject, item.topicId) : null;
    return (
      <li key={item.id} className={`nu-item ${item.done ? 'done' : ''}`}>
        <div className="nu-item-main">
          <p className="nu-item-text">{item.text}</p>
          <div className="nu-item-meta">
            <span>{whenLabel(item.createdAt)}</span>
            {item.subject && <span>{CURRICULUM[item.subject]?.name || item.subject}</span>}
            {topic && <span className="nu-topic">pointed at {topic.title}</span>}
          </div>
          {topic && onOpenLesson && !item.done && (
            <button type="button" className="nu-open-lesson" onClick={() => onOpenLesson(item.subject, topic.id)}>
              <BookOpen size={14} aria-hidden="true" /> Open that lesson
            </button>
          )}
        </div>
        <div className="nu-item-actions">
          {item.done ? (
            <button
              type="button"
              className="nu-action"
              onClick={() => handleReopen(item.id)}
              aria-label={`Move "${item.text}" back to the list`}
            >
              <Undo2 size={15} aria-hidden="true" /> Reopen
            </button>
          ) : (
            <button
              type="button"
              className="nu-action"
              onClick={() => handleComplete(item.id)}
              aria-label={`Mark "${item.text}" as done`}
            >
              <Check size={15} aria-hidden="true" /> Done
            </button>
          )}
          <button
            type="button"
            className="nu-action nu-action-remove"
            onClick={() => handleRemove(item.id)}
            aria-label={`Delete "${item.text}"`}
          >
            <Trash2 size={15} aria-hidden="true" /> Delete
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className="nextup-page">
      <header className="nu-header">
        <div>
          <p className="nu-eyebrow">Things to come back to</p>
          <h1>Next up</h1>
        </div>
        <button type="button" className="nu-back" onClick={() => setScreen('universe')}>
          Back to the atlas
        </button>
      </header>

      <div className="nu-body">
        <p className="nu-intro">
          A short list of things you noticed while reading and wanted more of. An item here is
          something you understood well enough to park, which is a different act from writing down a
          question you could not resolve; those go on the <strong>question desk</strong>.
        </p>
        <p className="nu-intro nu-intro-quiet">
          There are no due dates and no reminders here, and that is deliberate. Everything here is
          in this browser, so nothing can reach you once the tab is closed.
        </p>

        <form className="nu-form" onSubmit={handleAdd}>
          <label className="nu-label" htmlFor="nu-text">
            What do you want to come back to?
          </label>
          <textarea
            id="nu-text"
            className="nu-textarea"
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Look into Hawking radiation properly. Find the primary source for that Nietzsche line."
          />

          <div className="nu-form-row">
            <label className="nu-select-label" htmlFor="nu-subject">
              Field
              <select
                id="nu-subject"
                className="nu-select"
                value={draftSubject}
                onChange={(event) => {
                  setDraftSubject(event.target.value);
                  // The topic list is per field, so the previous choice cannot
                  // survive. Leaving it set would store a topic id that does not
                  // exist under the field now chosen, and the item would then
                  // point at a lesson that cannot be opened.
                  setDraftTopic('');
                }}
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="nu-select-label" htmlFor="nu-topic">
              Related lesson, if any
              <select
                id="nu-topic"
                className="nu-select"
                value={draftTopic}
                onChange={(event) => setDraftTopic(event.target.value)}
              >
                <option value="">No particular lesson</option>
                {topicOptions.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="nu-form-footer">
            <span className={`nu-count ${tooShort || tooLong ? 'bad' : ''}`}>
              {trimmed.length === 0
                ? 'Nothing written yet'
                : tooLong
                ? `Too long: ${trimmed.length} of ${MAX_LENGTH} characters`
                : tooShort
                ? `At least ${MIN_LENGTH} characters`
                : `${trimmed.length} characters`}
            </span>
            <button type="submit" className="nu-add" disabled={!canAdd}>
              Add it
            </button>
          </div>
        </form>

        {notice && (
          <p className="nu-alert" role="alert">
            <AlertTriangle size={16} aria-hidden="true" /> {notice}
          </p>
        )}

        <section className="nu-section" aria-labelledby="nu-open">
          <h2 id="nu-open">{open.length === 0 ? 'Nothing waiting' : `${open.length} waiting`}</h2>
          {open.length === 0 ? (
            <p className="nu-empty">
              <ListTodo size={16} aria-hidden="true" /> The list is empty, which is the honest state
              for someone who has not written anything down. When you add something it stays here, on
              this device, until you delete it.
            </p>
          ) : (
            <ul className="nu-list">{open.map(renderItem)}</ul>
          )}
        </section>

        {done.length > 0 && (
          <section className="nu-section" aria-labelledby="nu-done">
            <h2 id="nu-done">Done, {done.length}</h2>
            <ul className="nu-list">{done.map(renderItem)}</ul>
            <button type="button" className="nu-clear" onClick={handleClearCompleted}>
              Remove the {done.length} done item{done.length === 1 ? '' : 's'}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default NextUp;

