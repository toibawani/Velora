import React, { useState } from 'react';
import { Check, HardDrive, Monitor, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { FAILURE, describeStorage } from '../utils/storage';
import {
  STYLE_OPTIONS,
  TIME_OPTIONS,
  getOnboardingPreferences,
  setOnboardingPreference,
} from '../utils/onboardingPreferences';
import '../styles/Settings.css';

/**
 * Settings.
 *
 * Three things live here, and the constraint on all of them is that each one
 * must do something real.
 *
 * The theme was already a real tri-state, reachable only from a single control
 * on the atlas. It is here as well, not moved: the atlas keeps its toggle
 * because that is where it has always been, and moving it would have taken away
 * a control rather than added a place.
 *
 * The setup answers - how you said you learn, and how long you said you would
 * spend - were write-once, because the setup flow runs once and nothing else
 * could change them. The card on the Learn screen displayed one of them under
 * the words "chosen when you set up VELORA, not measured", which described the
 * write-once behaviour accurately and left no way to act on it. They are
 * editable here now. The card on Learn keeps its wording: what it shows is
 * still a self-report, whoever typed it and whenever.
 *
 * There is no notifications section with switches in it. Nothing in this app
 * sends a notification, there is no service worker, no push permission and no
 * server to send one from, so a preferences toggle for reminders would be a
 * control wired to nothing. The section says so in a sentence instead of
 * pretending otherwise.
 */

const THEME_CHOICES = [
  { mode: 'light', label: 'Light', Icon: Sun },
  { mode: 'dark', label: 'Dark', Icon: Moon },
  { mode: 'auto', label: 'System', Icon: Monitor },
];

const NOT_SAVED = {
  disabled:
    'This browser is not letting VELORA store anything, so this change is only here for this visit. It will be gone when you close the tab.',
  quota:
    'This browser is out of storage space, so that change was not saved. Anything already written is still there.',
  failed:
    'This browser refused to save that, so the change was not kept. Private browsing and a full storage quota both cause this.',
};

const failureMessage = (result) => NOT_SAVED[result] || NOT_SAVED.failed;

Settings.propTypes = { user: PropTypes.string, setScreen: PropTypes.shape({"setScreen": PropTypes.func}), onForgetProfile: PropTypes.shape({"onForgetProfile": PropTypes.func}) };

function Settings({ user, setScreen, onForgetProfile }) {
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState(() => getOnboardingPreferences());
  const [notice, setNotice] = useState(null);
  const storage = describeStorage();

  /**
   * Write one field and reflect the result, whichever way it went.
   *
   * The screen state only advances when the write landed. If storage is blocked,
   * showing the new value as selected would be showing someone a setting that is
   * not in effect, with the failure message underneath contradicting the control
   * above it.
   */
  const save = (field, value) => {
    const result = setOnboardingPreference(field, value);
    if (result === FAILURE.NONE) {
      setPreferences(getOnboardingPreferences());
      setNotice(null);
      return;
    }
    setNotice(failureMessage(result));
  };

  return (
    <div className="settings-page">
      <header className="st-header">
        <div>
          <p className="st-eyebrow">This device</p>
          <h1>Settings</h1>
        </div>
        <button type="button" className="st-back" onClick={() => setScreen('universe')}>
          Back to the atlas
        </button>
      </header>

      <div className="st-body">
        {!storage.available && (
          <p className="st-storage-warning" role="alert">
            {storage.message}
          </p>
        )}

        {notice && (
          <p className="st-notice" role="alert">
            {notice}
          </p>
        )}

        <section className="st-section" aria-labelledby="st-theme">
          <h2 id="st-theme">Appearance</h2>
          <p className="st-section-note">
            How VELORA looks in this browser. This is the same setting as the control on the atlas:
            changing it here changes it there, and it survives a reload.
          </p>
          <div className="st-choice-row" role="group" aria-label="Theme">
            {THEME_CHOICES.map(({ mode, label, Icon }) => (
              <button
                type="button"
                key={mode}
                className={`st-choice ${theme === mode ? 'selected' : ''}`}
                onClick={() => setTheme(mode)}
                aria-pressed={theme === mode}
              >
                {theme === mode && <Check size={14} aria-hidden="true" />}
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="st-section" aria-labelledby="st-style">
          <h2 id="st-style">How you said you learn</h2>
          <p className="st-section-note">
            These are answers you gave during setup. They are a self-report rather than something
            measured, and nothing in the app infers them. Whichever one is selected here appears on
            the Learn screen in a card marked "you told us", kept deliberately apart from the
            numbers that screen does measure.
          </p>

          <fieldset className="st-fieldset">
            <legend>Learning style</legend>
            <div className="st-choice-row" role="group" aria-label="Learning style">
              {STYLE_OPTIONS.map(({ id, label }) => (
                <button
                  type="button"
                  key={id}
                  className={`st-choice ${preferences.style === id ? 'selected' : ''}`}
                  onClick={() => save('style', id)}
                  aria-pressed={preferences.style === id}
                >
                  {preferences.style === id && <Check size={14} aria-hidden="true" />}
                  {label}
                </button>
              ))}
            </div>
            {preferences.style && (
              <button type="button" className="st-clear" onClick={() => save('style', null)}>
                Clear this answer
              </button>
            )}
          </fieldset>

          <fieldset className="st-fieldset">
            <legend>Time you said you would spend</legend>
            <div className="st-choice-row" role="group" aria-label="Time you said you would spend">
              {TIME_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`st-choice ${preferences.time === option ? 'selected' : ''}`}
                  onClick={() => save('time', option)}
                  aria-pressed={preferences.time === option}
                >
                  {preferences.time === option && <Check size={14} aria-hidden="true" />}
                  {option}
                </button>
              ))}
            </div>
            {preferences.time && (
              <button type="button" className="st-clear" onClick={() => save('time', null)}>
                Clear this answer
              </button>
            )}
          </fieldset>

          <p className="st-section-note">
            Setup also asks which field you want to start in. That one is remembered only to answer
            that first question, so there is nothing to edit for it here.
          </p>
        </section>

        <section className="st-section" aria-labelledby="st-reminders">
          <h2 id="st-reminders">Reminders</h2>
          <p className="st-section-note">
            There are none, and there is no switch to turn off. VELORA has no server, no background
            process and no notification permission, so it cannot reach you once this tab is closed.
            A toggle here would be a control wired to nothing.
          </p>
        </section>

        <section className="st-section" aria-labelledby="st-profile">
          <h2 id="st-profile">Name on this device</h2>
          <p className="st-section-note">
            <User size={14} aria-hidden="true" /> {user?.name || 'No name set'}. A name typed into
            this browser. It is not an account, there is no password, and removing it is not a sign
            out: there is no session to end and no server to tell.
          </p>
          <button type="button" className="st-danger" onClick={onForgetProfile}>
            Remove the name from this device
          </button>
        </section>

        <section className="st-section" aria-labelledby="st-storage">
          <h2 id="st-storage">What is stored</h2>
          <p className="st-section-note">
            <HardDrive size={14} aria-hidden="true" /> Everything here is in this browser: your
            name, these three answers, your questions and notes, your study time and the games you
            have played. None of it is transmitted anywhere, and clearing your browser data deletes
            all of it. There is no second copy, because there is nowhere for one to be.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Settings;
