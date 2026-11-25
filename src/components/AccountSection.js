import React, { useEffect, useState } from 'react';
import { backendEnabled } from '../backend/supabaseClient';
import { getSessionUser, onAuthChange, sendMagicLink, signOut } from '../backend/api';
import SyncStatus from './SyncStatus';

/**
 * The optional account, in Settings.
 *
 * Three rules shape this component:
 *
 *  1. It is not on the way in. Nothing here is reachable from the cover, the
 *     landing page or setup. A person has to come looking for it.
 *  2. When no backend is configured, the section still renders, because a
 *     Settings page that silently omits a feature is a page that lies by
 *     omission. It says one plain sentence and offers no control.
 *  3. Every failure is a BackendError's message, printed as text. React escapes
 *     it, so an error string from a provider can never become markup, and the
 *     component never prints a raw error object, a status code or a stack.
 *
 * There is no password field anywhere. Signing in is a link sent to an address;
 * the address is the login and is used for nothing else.
 */

const DISABLED_LINE =
  'Accounts are not switched on in this build. Everything here works without one.';

function AccountSection() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(backendEnabled);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!backendEnabled) return undefined;

    let mounted = true;
    getSessionUser()
      .then((sessionUser) => {
        if (mounted) setUser(sessionUser);
      })
      .catch(() => {
        // A session that cannot be read is the same state as no session here.
        // The section is not the place to report a broken auth client; every
        // action below will report its own failure with its own message.
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setChecking(false);
      });

    const unsubscribe = onAuthChange((sessionUser) => {
      if (mounted) {
        setUser(sessionUser);
        // A link just opened: the pending-email notice has done its job.
        setNotice(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleSendLink = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      await sendMagicLink(email);
      setNotice({
        tone: 'info',
        text: `If that address can receive mail, a sign-in link is on its way to ${email.trim()}. Open it on this device to finish signing in.`,
      });
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error && error.message ? error.message : 'That did not work. Try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      await signOut();
      // onAuthChange normally clears this too; doing it here means the screen
      // changes even if the event never arrives.
      setUser(null);
      setNotice({ tone: 'info', text: 'Signed out on this device. Progress stays here.' });
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error && error.message ? error.message : 'That did not work. Try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="st-section" aria-labelledby="st-account">
      <h2 id="st-account">Account</h2>

      {!backendEnabled && <p className="st-section-note">{DISABLED_LINE}</p>}

      {backendEnabled && checking && (
        <p className="st-section-note" role="status">
          Checking whether this browser is signed in.
        </p>
      )}

      {backendEnabled && !checking && user && (
        <>
          <p className="st-section-note">
            Signed in as {user.email || 'this account'}. Progress is copied to it, so another
            device that signs in with the same address sees the same topics. Notes, questions and
            study minutes are not copied.
          </p>
          <button
            type="button"
            className="st-danger"
            onClick={handleSignOut}
            disabled={busy}
          >
            {busy ? 'Signing out' : 'Sign out'}
          </button>
          <SyncStatus />
        </>
      )}

      {backendEnabled && !checking && !user && (
        <>
          <p className="st-section-note">
            Optional. An account copies your progress between devices and lets you submit an
            explanation for review. There is no password: you type an address and open the link it
            sends. Reading, games and simulations work without it.
          </p>
          <form className="st-account-form" onSubmit={handleSendLink}>
            <label className="st-label" htmlFor="st-account-email">
              Email address
            </label>
            <input
              id="st-account-email"
              className="st-account-input"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setNotice(null);
              }}
              placeholder="you@example.com"
              aria-describedby={notice ? 'st-account-notice' : undefined}
            />
            <button type="submit" className="st-primary" disabled={busy}>
              {busy ? 'Sending the link' : 'Send me a sign-in link'}
            </button>
          </form>
        </>
      )}

      {notice && (
        <p
          className="st-notice-quiet"
          id="st-account-notice"
          role={notice.tone === 'error' ? 'alert' : 'status'}
        >
          {notice.text}
        </p>
      )}
    </section>
  );
}

export default AccountSection;
