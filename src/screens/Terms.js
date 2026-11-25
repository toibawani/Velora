import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Legal.css';

/**
 * Terms screen.
 *
 * Short on purpose. There is no payment, no service level and no company behind
 * this, so most of a standard terms document would describe obligations that do
 * not exist here. Each section below names something the code actually does.
 */

TermsScreen.propTypes = { setScreen: PropTypes.shape({ "setScreen": PropTypes.func }) };

function TermsScreen({ setScreen }) {
  return (
    <div className="legal-screen">
      <nav className="legal-nav">
        <button className="legal-back" onClick={() => setScreen('settings')}>
          Back to Settings
        </button>
      </nav>

      <main className="legal-content">
        <div className="legal-inner">
          <h1>Terms of Service</h1>
          <p className="legal-date">Last updated: 19 October 2026</p>

          <section className="legal-section">
            <h2>What you are using</h2>
            <p>
              VELORA is a free reference book that runs in your browser. The
              lessons, Atlas entries and dictionary definitions are written for
              this project. The source code is under the MIT licence in the
              repository&apos;s LICENSE file, which means you may reuse the code
              under those terms. The written content is not covered by that
              licence.
            </p>
          </section>

          <section className="legal-section">
            <h2>No account needed</h2>
            <p>
              Every lesson, game and simulation works without an account, and
              nothing is asked for on the way in beyond a display name that stays
              in this browser. An account is optional and lives in Settings. You
              sign in with a link sent to an email address, and that address is
              used for the link and nothing else. Signing in copies progress
              between your devices; it does not upload your notes, questions or
              study minutes.
            </p>
            <p>
              Signed out, everything you write is stored in this
              browser&apos;s localStorage. Clearing site data deletes it,
              switching browsers leaves it behind, and no one, including the
              author, can recover it.
            </p>
          </section>

          <section className="legal-section">
            <h2>Explanations you submit</h2>
            <p>
              If you submit an explanation, it is reviewed before it can appear
              to anyone else. I may publish it, edit nothing in it but reject it,
              or remove it later. Do not submit anything you would not want read
              by a stranger, and do not include personal details. Anyone can
              report a published explanation, and reports are reviewed the same
              way. Submitting is rate limited so one account cannot fill the
              queue.
            </p>
          </section>

          <section className="legal-section">
            <h2>Optional analytics</h2>
            <p>
              A second outbound path is possible: the anonymous usage beacon
              described on the Privacy page. It is off unless you switch it on,
              and it also needs an endpoint configured by whoever deployed this
              build. In this deployment no endpoint is configured, so nothing is
              sent even when the switch is on.
            </p>
          </section>

          <section className="legal-section">
            <h2>What this is not</h2>
            <p>
              VELORA is not a school, a course or a tutoring service. Finishing a
              lesson grants no certificate, no credential and no academic credit.
              The writing is for information and study, not professional advice
              in law, medicine, finance or any other field.
            </p>
          </section>

          <section className="legal-section">
            <h2>Accuracy</h2>
            <p>
              The material is written by one person and cites sources where a
              claim depends on one, especially in the dictionary. It can still be
              wrong or out of date, and scientific and historical understanding
              changes. Check anything important against a primary or authoritative
              source. If you find an error, open an issue on the repository.
            </p>
          </section>

          <section className="legal-section">
            <h2>Cost, warranty and loss</h2>
            <p>
              VELORA is free and has no uptime promise. It is provided as it is,
              without a warranty that it will be available, complete or correct.
              If the app is wrong, or if clearing your browser loses your notes
              and progress, the author is not liable for what follows. Keep a copy
              of anything you cannot afford to lose.
            </p>
          </section>

          <section className="legal-section">
            <h2>Changes</h2>
            <p>
              These terms can change when the app changes. The date at the top of
              this page is the date of the current version. Continuing to use the
              app after a change means the new text applies.
            </p>
          </section>

          <section className="legal-section">
            <h2>Contact</h2>
            <p>
              Questions and corrections go to the issue tracker at{' '}
              <a href="https://github.com/toibawani/Velora/issues">
                github.com/toibawani/Velora/issues
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default TermsScreen;
