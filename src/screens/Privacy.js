import PropTypes from 'prop-types';
import React from 'react';
import { Shield, EyeOff } from 'lucide-react';
import { isOptedIn } from '../utils/siteAnalytics';
import '../styles/Legal.css';

/**
 * Privacy screen.
 *
 * Every sentence here is checked against what the code does. The stored data
 * is localStorage. The only outbound requests are the GoatCounter beacon in
 * utils/siteAnalytics.js, which needs both an explicit opt-in and a configured
 * endpoint, and the progress and explanation calls in src/backend/api.js, which
 * cannot run until someone signs in on purpose. This deployment configures no
 * analytics endpoint, so the beacon cannot fire even when switched on.
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
              <EyeOff size={14} aria-hidden="true" /> Your name, your notes, your
              saved lessons, your questions, your review schedule, your game
              results and the minutes recorded against each topic are stored in
              this browser&apos;s localStorage. They are not uploaded, signed in
              or signed out. Clearing site data deletes them, and the only copy
              is the one in Settings, which you make yourself.
            </p>
          </section>

          <section className="legal-section">
            <h2>What is sent, and only after you sign in</h2>
            <p>
              An account is optional and lives in Settings. Nothing below happens
              until you ask for a sign-in link and open it. Every lesson, game,
              simulation and dictionary entry works without an account.
            </p>
            <p>Once you are signed in, three things can leave this browser:</p>
            <ul>
              <li>
                progress events, as a topic, a kind and a calendar day: that a
                topic&apos;s lesson was read, and on which day. No minutes, no
                scores, no answers, no notes.
              </li>
              <li>
                an explanation you write into the explain-it-back box and then
                submit. It carries the topic it belongs to, so I can review it
                before anyone else can read it. Submitting is its own button.
              </li>
              <li>
                the email address you typed to receive the sign-in link. It is
                the login. It is not used for anything else and there is no
                newsletter.
              </li>
            </ul>
            <p>
              Everything else stays in the browser: notes, questions, study
              minutes, review schedules, game results and the analytics on the
              Learn screen. Signing out stops the sending immediately; the local
              copy is untouched.
            </p>
          </section>

          <section className="legal-section">
            <h2>The one thing that can leave without an account</h2>
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
              GoatCounter, not by VELORA. Notes and questions are never sent: they
              stay in this browser. An explanation is sent only when you press
              submit on one, and only while signed in.
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
