import React, { useRef, useState } from 'react';
import { ArrowRight, Check, HardDrive } from 'lucide-react';
import '../styles/Auth.css';
import { isValidName, normalizeName, saveProfile } from '../utils/localProfile';

/**
 * LocalProfile — the one way in.
 *
 * There is no server, so this is not Sign in and it is not Create account. It
 * asks for a name to greet you by, and says plainly where that name goes: this
 * device, this browser, nowhere else. The email, phone, username and password
 * fields it replaces were collected, never verified, never sent, and never read
 * by a single line of code in this app.
 */

const SUBJECTS = [
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'history', name: 'History' },
  { id: 'political-science', name: 'Political Science' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'psychology', name: 'Psychology' },
  { id: 'economics', name: 'Economics' },
];

const GOALS = [
  { id: 'curiosity', name: 'Curiosity, for its own sake' },
  { id: 'exam', name: 'Preparing for exams' },
  { id: 'career', name: 'Career development' },
  { id: 'teaching', name: 'Teaching others' },
  { id: 'research', name: 'Academic research' },
];

LocalProfile.propTypes = { setScreen: PropTypes.shape({"setScreen": PropTypes.func}), onStart: PropTypes.shape({"onStart": PropTypes.func}), showToast: PropTypes.shape({"showToast": PropTypes.func}) };

function LocalProfile({ setScreen, onStart, showToast }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [goal, setGoal] = useState('');
  const [storageError, setStorageError] = useState('');
  const headingRef = useRef(null);

  const nameError = touched && !isValidName(name) ? 'Use at least 2 characters' : '';

  const toggleSubject = (id) =>
    setSubjects((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const handleNameStep = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!isValidName(name)) return;
    setName(normalizeName(name));
    setStep(2);
    // Move focus to the new step's heading, as the multi-step Register did.
    window.requestAnimationFrame(() => headingRef.current?.focus());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!isValidName(name)) return;

    const profile = saveProfile(name);
    if (!profile) {
      // Say what happened. The old flow showed a success toast for a write that
      // never landed.
      setStorageError(
        'This browser refused to save your name, so nothing was stored. Private browsing often does this. You can keep learning without a name, or try again outside private mode.'
      );
      setStep(1);
      return;
    }
    onStart(profile);
    if (showToast) showToast(`Welcome, ${profile.name}. Everything here stays on this device.`, 'success');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {step === 1 ? 'What should we call you?' : 'What are you here for?'}
        </h1>
        <p className="auth-subtitle">
          {step === 1
            ? 'A name for this device. No email, no password, no account.'
            : 'Optional. It only shapes what comes first, and it never leaves this device.'}
        </p>

        <form onSubmit={step === 1 ? handleNameStep : handleSubmit} className="auth-form" noValidate>
          {step === 1 ? (
            <div className="form-group">
              <label htmlFor="profile-name">Display name</label>
              <input
                id="profile-name"
                name="name"
                autoComplete="off"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (storageError) setStorageError('');
                }}
                onBlur={() => setTouched(true)}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? 'profile-name-error' : 'profile-name-hint'}
                maxLength={40}
                required
              />
              {nameError ? (
                <span className="auth-field-error" id="profile-name-error">
                  {nameError}
                </span>
              ) : (
                <span className="auth-field-hint" id="profile-name-hint">
                  Shown only on this device. Clearing your browser data removes it.
                </span>
              )}

              {storageError && (
                <span className="auth-field-error" role="alert">
                  {storageError}
                </span>
              )}

              <button type="submit" className="btn btn-primary btn-full">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="step-content" role="group" aria-labelledby="interests-heading">
              <h2 id="interests-heading" ref={headingRef} className="step-heading" tabIndex={-1}>
                Your interests
              </h2>

              <div className="form-group">
                <span className="form-label">Which subjects interest you?</span>
                <div className="subject-selection-grid" role="group" aria-label="Subject selection">
                  {SUBJECTS.map((subject) => (
                    <button
                      key={subject.id}
                      type="button"
                      className={`subject-pill ${subjects.includes(subject.id) ? 'selected' : ''}`}
                      onClick={() => toggleSubject(subject.id)}
                      aria-pressed={subjects.includes(subject.id)}
                    >
                      {subjects.includes(subject.id) && <Check size={14} />}
                      {subject.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <span className="form-label">What brings you here?</span>
                <div className="goal-selection-grid" role="radiogroup" aria-label="Learning goal">
                  {GOALS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`goal-pill ${goal === option.id ? 'selected' : ''}`}
                      onClick={() => setGoal(option.id)}
                      role="radio"
                      aria-checked={goal === option.id}
                    >
                      {goal === option.id && <Check size={14} />}
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="step-actions step-actions--two">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Start learning as {normalizeName(name)} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="auth-local-note">
          <HardDrive size={14} aria-hidden="true" />
          VELORA has no server. Your name, questions, notes and progress are stored in this browser
          and are never transmitted anywhere.
        </p>

        <div className="auth-footer">
          <button type="button" className="auth-back" onClick={() => setScreen('landing')}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocalProfile;
