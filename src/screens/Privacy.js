import PropTypes from 'prop-types';
import React from 'react';
import { Shield, EyeOff } from 'lucide-react';
import { isOptedIn } from '../utils/siteAnalytics';
import '../styles/Settings.css';

/**
 * Privacy screen.
 *
 * Plain-sentence disclosure of the only thing VELORA can send out of this
 * browser: anonymous aggregate usage numbers to an analytics service, and only
 * when the visitor has switched it on in Settings. It is off by default.
 *
 * This screen also states, in plain terms, what the numbers cannot tell us — so
 * the disclosure is honest about its limits, not just its reach.
 */

Privacy.propTypes = { setScreen: PropTypes.shape({ setScreen: PropTypes.func }) };

function Privacy({ setScreen }) {
  const optedIn = isOptedIn();

  return (
    <div className="settings-page">
      <header className="st-header">
        <div>
          <p className="st-eyebrow">This device</p>
          <h1>Privacy</h1>
        </div>
        <button type="button" className="st-back" onClick={() => setScreen('universe')}>
          Back to the atlas
        </button>
      </header>

      <div className="st-body">
        <section className="st-section" aria-labelledby="st-privacy-promise">
          <h2 id="st-privacy-promise">The promise</h2>
          <p className="st-section-note">
            <EyeOff size={14} aria-hidden="true" /> VELORA is a no-account, no-backend app. Your
            name, your notes, your questions and what you read never leave this
            browser. There is no server, no tracking pixel and no advertising
            identifier. Clearing your browser data deletes everything, because
            there is no second copy anywhere.
          </p>
        </section>

        <section className="st-section" aria-labelledby="st-external-analytics">
          <h2 id="st-external-analytics">External analytics</h2>
          <p className="st-section-note">
            <Shield size={14} aria-hidden="true" /> The only thing that can leave this browser is an
            anonymous usage beacon to an analytics service (GoatCounter), and only if you switch it
            on in Settings. It is off by default.
          </p>
          <p className="st-section-note">
            When it is on, VELORA sends: which screens you open, which Atlas topics you open, whether
            you read a lesson to the end, which games you complete, and how often you come back
            within seven days. None of it is tied to you: no cookies, no fingerprinting, no email,
            no name and no identifier. The numbers are aggregated by the service, not by VELORA.
          </p>
          <p className="st-section-note">
            The beacon only fires if an analytics address has been configured by the person who
            deployed VELORA. Until it is, switching the setting on changes nothing — nothing is
            sent anywhere.
          </p>
        </section>

        <section className="st-section" aria-labelledby="st-what-it-cannot-tell">
          <h2 id="st-what-it-cannot-tell">What the numbers cannot tell us</h2>
          <p className="st-section-note">
            Even when analytics is on, there is a lot it cannot measure — and that is by design:
          </p>
          <p className="st-section-note">
            • Who you are, or whether two visits belong to the same person.
          </p>
          <p className="st-section-note">
            • What text you read, highlighted or skipped inside a lesson.
          </p>
          <p className="st-section-note">
            • Whether you understood a lesson, only that you reached its end.
          </p>
          <p className="st-section-note">
            • Anything you type: notes, questions, answers or a name.
          </p>
          <p className="st-section-note">
            • What you do outside this app, or on any other site.
          </p>
          <p className="st-section-note">
            • Your location, device model or anything that could fingerprint you.
          </p>
          <p className="st-section-note">
            If a question matters more than a number, it is not measured here.
          </p>
        </section>

        <section className="st-section" aria-labelledby="st-control">
          <h2 id="st-control">Control</h2>
          <p className="st-section-note">
            Switch external analytics{' '}
            {optedIn ? 'on' : 'off'}{' '}
            in Settings. Turning it off stops every beacon immediately, and nothing already sent can
            be linked back to this device because nothing identifying was ever sent.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
