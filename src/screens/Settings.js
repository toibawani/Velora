import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Check, Download, HardDrive, Monitor, Moon, Sun, Upload, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { FAILURE, describeStorage, describeStoredKey, storageUsage } from '../utils/storage';
import { formatBytes } from '../utils/format';
import {
  IMPORT_MODE,
  buildBackup,
  describeBackup,
  describeImport,
  explainParseFailure,
  importBackup,
  parseBackup,
  serialiseBackup,
} from '../utils/backup';
import { backupFileName, downloadText } from '../utils/download';
import {
  STYLE_OPTIONS,
  TIME_OPTIONS,
  getOnboardingPreferences,
  setOnboardingPreference,
} from '../utils/onboardingPreferences';
import { isOptedIn, setOptedIn } from '../utils/siteAnalytics';
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
  const usage = storageUsage();
  const [analyticsOn, setAnalyticsOn] = useState(isOptedIn());
  const [exportNotice, setExportNotice] = useState(null);
  const [importMode, setImportMode] = useState(IMPORT_MODE.MERGE);
  const [pendingImport, setPendingImport] = useState(null);
  const [importNotice, setImportNotice] = useState(null);
  const [confirmingReplace, setConfirmingReplace] = useState(false);
  const fileInput = useRef(null);

  /**
   * Writes every stored key to a file the browser downloads.
   *
   * The wording says the file was prepared rather than saved: nothing in the
   * page can see whether the download finished, and a browser that blocks
   * downloads is a real case on a shared school machine.
   */
  const exportData = () => {
    const backup = buildBackup();
    const started = downloadText(backupFileName(), serialiseBackup(backup));
    setExportNotice(
      started
        ? `Prepared a file with ${describeBackup(backup)}. Check your downloads folder; nothing was uploaded anywhere.`
        : 'This browser would not start a download. Everything is still here, so nothing was lost.',
    );
  };

  const saveAnalytics = (enabled) => {
    const ok = setOptedIn(enabled);
    if (!ok) {
      setNotice(
        'That change was not saved. Private browsing or a full storage quota can block it, so the setting stays as it was for this visit.',
      );
      return;
    }
    setAnalyticsOn(enabled);
    setNotice(null);
  };

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

  /**
   * Reads a chosen file and parses it, without writing anything yet.
   *
   * Restoring on file selection would mean the contents of a file nobody has
   * confirmed overwrote a question written this morning. The file is held here
   * until the person presses restore, and the page can say what is in it first.
   */
  const chooseFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseBackup(String(reader.result || ''));
      if (!parsed.ok) {
        setPendingImport(null);
        setImportNotice(explainParseFailure(parsed.reason));
        return;
      }
      setPendingImport({ backup: parsed.backup, fileName: file.name, dropped: parsed.dropped });
      setImportNotice(null);
      setConfirmingReplace(false);
    };
    reader.onerror = () => {
      setPendingImport(null);
      setImportNotice('That file could not be read. Try choosing it again.');
    };
    reader.readAsText(file);
  };

  const restore = () => {
    if (!pendingImport) return;

    // Replace can delete data the file does not contain, so it takes a second
    // press. Merge does not, and stays a single press.
    if (importMode === IMPORT_MODE.REPLACE && !confirmingReplace) {
      setConfirmingReplace(true);
      setImportNotice(
        'Restoring in replace mode deletes everything on this device that the file does not contain, including anything written since the export. Press again to do that.',
      );
      return;
    }

    const result = importBackup(pendingImport.backup, { mode: importMode });
    setImportNotice(describeImport(result));
    setPendingImport(null);
    setConfirmingReplace(false);

    // The rest of this page was read from storage when it rendered, so two
    // controls would otherwise keep showing the values from before the restore.
    setPreferences(getOnboardingPreferences());
    setAnalyticsOn(isOptedIn());
    if (fileInput.current) fileInput.current.value = '';
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

          {usage.available && usage.keys.length > 0 && (
            <div className="st-usage">
              <p className="st-usage-total" role="status">
                {formatBytes(usage.totalBytes)} across {usage.keys.length}{' '}
                {usage.keys.length === 1 ? 'saved item' : 'saved items'} in this browser.
              </p>
              <ul className="st-usage-list" aria-label="Largest saved items">
                {usage.keys.slice(0, 6).map((entry) => (
                  <li key={entry.key} className="st-usage-row">
                    <span className="st-usage-name">{describeStoredKey(entry.key)}</span>
                    <span className="st-usage-size">{formatBytes(entry.bytes)}</span>
                  </li>
                ))}
              </ul>
              {usage.keys.length > 6 && (
                <p className="st-usage-note">
                  and {usage.keys.length - 6} smaller {usage.keys.length - 6 === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
          )}
        </section>

        <section className="st-section" aria-labelledby="st-data">
          <h2 id="st-data">Take your data with you</h2>
          <p className="st-section-note">
            <Download size={14} aria-hidden="true" /> Because everything lives in this browser and
            there is no account, a new laptop or a cleared cache takes all of it. Export writes one
            JSON file you keep yourself: your name, your questions, your saved lessons, your games
            and these settings. It is built in the page and handed to your downloads folder, so
            nothing is uploaded to do it.
          </p>
          <button type="button" className="st-primary" onClick={exportData}>
            <Download size={14} aria-hidden="true" /> Export everything as JSON
          </button>
          {exportNotice && (
            <p className="st-notice-quiet" role="status">
              {exportNotice}
            </p>
          )}

          <div className="st-import">
            <label className="st-label" htmlFor="st-import-file">
              Restore from a backup file
            </label>
            <input
              id="st-import-file"
              ref={fileInput}
              type="file"
              className="st-file-input"
              accept="application/json,.json"
              onChange={chooseFile}
            />

            {pendingImport && (
              <div className="st-import-preview" role="group" aria-label="Chosen backup">
                <p className="st-import-line">
                  <Upload size={14} aria-hidden="true" /> {pendingImport.fileName} ·{' '}
                  {describeBackup(pendingImport.backup)}
                  {pendingImport.backup.exportedAt &&
                    ` · exported ${new Date(pendingImport.backup.exportedAt).toLocaleDateString()}`}
                  {pendingImport.dropped > 0 && ` · ${pendingImport.dropped} unreadable entries ignored`}
                </p>

                <div className="st-choice-row" role="group" aria-label="How to restore">
                  <button
                    type="button"
                    className={`st-choice ${importMode === IMPORT_MODE.MERGE ? 'selected' : ''}`}
                    onClick={() => {
                      setImportMode(IMPORT_MODE.MERGE);
                      setConfirmingReplace(false);
                      setImportNotice(null);
                    }}
                    aria-pressed={importMode === IMPORT_MODE.MERGE}
                  >
                    {importMode === IMPORT_MODE.MERGE && <Check size={14} aria-hidden="true" />}
                    Add what is in the file
                  </button>
                  <button
                    type="button"
                    className={`st-choice ${importMode === IMPORT_MODE.REPLACE ? 'selected' : ''}`}
                    onClick={() => {
                      setImportMode(IMPORT_MODE.REPLACE);
                      setConfirmingReplace(false);
                      setImportNotice(null);
                    }}
                    aria-pressed={importMode === IMPORT_MODE.REPLACE}
                  >
                    {importMode === IMPORT_MODE.REPLACE && <Check size={14} aria-hidden="true" />}
                    Replace everything here
                  </button>
                </div>

                <button
                  type="button"
                  className={confirmingReplace ? 'st-danger' : 'st-primary'}
                  onClick={restore}
                >
                  {confirmingReplace ? 'Replace everything now' : 'Restore this file'}
                </button>
              </div>
            )}

            {importNotice && (
              <p className="st-notice-quiet" role="status">
                {importNotice}
              </p>
            )}
          </div>
        </section>

        <section className="st-section" aria-labelledby="st-analytics">
          <h2 id="st-analytics">External analytics</h2>
          <p className="st-section-note">
            <Monitor size={14} aria-hidden="true" /> VELORA can send anonymous usage numbers to an
            analytics service (page views, which Atlas topics open, which lesson titles start or
            finish, game completions, the theme you chose and how often people come back within
            seven days). It cannot tell who you are: there are no cookies, no fingerprinting, no
            email, no name, no identifier, and no text you type. Nothing is sent at all unless you
            switch it on, and it is off by default. The full
            disclosure, including what the numbers cannot tell us, is on the{' '}
            <button type="button" className="st-link" onClick={() => setScreen('privacy')}>
              Privacy page
            </button>
            . The terms governing your use of VELORA are on the{' '}
            <button type="button" className="st-link" onClick={() => setScreen('terms')}>
              Terms of Service page
            </button>
            .
          </p>
          <div className="st-choice-row" role="group" aria-label="External analytics">
            <button
              type="button"
              className={`st-choice ${analyticsOn ? 'selected' : ''}`}
              onClick={() => saveAnalytics(!analyticsOn)}
              aria-pressed={analyticsOn}
            >
              {analyticsOn && <Check size={14} aria-hidden="true" />}
              {analyticsOn
                ? 'Sending anonymous usage data (on)'
                : 'Sending anonymous usage data (off)'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
