import PropTypes from 'prop-types';
import React from 'react';
import { Shield, EyeOff } from 'lucide-react';
import { isOptedIn } from '../utils/siteAnalytics';
import '../styles/Legal.css';

/**
 * Privacy screen.
 *
 * Every sentence here is checked against what the code does. The stored data
 * is localStorage. The only outbound request is the GoatCounter beacon in
 * utils/siteAnalytics.js, which needs both an explicit opt-in and a configured
 * endpoint. This deployment has no endpoint configured, so even the opt-in
 * currently sends nothing.
 */

Privacy.propTypes = { setScreen: PropTypes.shape({ "setScreen": PropTypes.func }) };

function Privacy({ setScreen }) {
  const optedIn = isOptedIn();

  return (
    <div className="legal-screen">
      <nav className="legal-nav">
        <button className="legal-back" onClick={() => setScreen('settings')}>
          Back to Settings
        </button>
      </nav>

      <main className="legal-content">
        <div className="legal-inner">
          <h1>Privacy</h1>
          <p className="legal-date">Last updated: 19 October 2026</p>

          <section className="legal-section">
            <h2>What stays here</h2>
            <p>
              <EyeOff size={14} aria-hidden="true" /> VELORA has no accounts and
              no backend. Your name, your notes, your saved lessons, your
              questions and the minutes recorded against each topic are stored in
              this browser&apos;s localStorage. They are not sent to a server,
              because there is no server to send them to. Clearing site data
              deletes them, and there is no second copy to recover.
            </p>
          </section>

          <section className="legal-section">
            <h2>The one thing that can leave</h2>
            <p>
              <Shield size={14} aria-hidden="true" /> External analytics is a
              single opt-in switch in Settings. It is off by default. A beacon is
              only sent when that switch is on <strong>and</strong> whoever
              deployed this build has configured a GoatCounter address. In this
              deployment the address is blank, so switching it on currently sends
              nothing at all.
            </p>
            <p>When both conditions are met, the app sends:</p>
            <ul>
              <li>which screen you opened, by route name</li>
              <li>which Atlas field or topic you selected, with its title and subject</li>
              <li>which lesson you started or finished, with its title and subject</li>
              <li>the id of a game you completed</li>
              <li>the theme you chose</li>
              <li>an aggregate count of return visits within seven days</li>
            </ul>
            <p>
              There are no cookies, no fingerprinting, no advertising identifier
              and no name attached to any of it. The numbers are aggregated by
              GoatCounter, not by VELORA. Nothing you type is sent: notes,
              questions and explanations stay in this browser, and no event
              carries their text.
            </p>
          </section>

          <section className="legal-section">
            <h2>What the numbers cannot tell anyone</h2>
            <p>Even when analytics is on, it cannot show:</p>
            <ul>
              <li>who you are, or whether two visits belong to the same person</li>
              <li>what you read inside a lesson, or which parts you skipped</li>
              <li>whether you understood a lesson, only that you reached its end</li>
              <li>anything you typed: a name, a note, a question or an explanation</li>
              <li>your location, your device model, or anything that could fingerprint you</li>
              <li>what you do outside this app</li>
            </ul>
            <p>
              It also cannot tell whether you learned anything. Nothing in this
              app measures understanding, and no score here claims to.
            </p>
          </section>

          <section className="legal-section">
            <h2>Control</h2>
            <p>
              External analytics is currently <strong>{optedIn ? 'on' : 'off'}</strong>{' '}
              for this browser. You can change it in Settings. Turning it off
              stops every beacon immediately. Nothing already sent can be linked
              back to this device, because nothing identifying was ever sent.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Privacy;
