import React from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, BookOpen } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import { CURIOUS_TERMS } from '../data/dictionary';

import '../styles/Splash.css';

/**
 * Splash — the first screen anyone sees.
 *
 * It used to be a 400px centred stack: a 52px wordmark, a paragraph, and two
 * full-width buttons, which is the shape of a startup welcome gate rather than
 * the cover of a reference book. Everything about the product was described in
 * prose and nothing about it was shown.
 *
 * What is shown now is what is inside, counted from the same data the rest of
 * the app reads: the five fields of the curriculum, how many disciplines and
 * topics they hold, and how many dictionary entries there are to look up. The
 * actions stay where they are - start, or look around first - but they sit in a
 * row at the size of a decision rather than stacked at the size of a banner.
 */
SplashScreen.propTypes = { setScreen: PropTypes.shape({ setScreen: PropTypes.func }) };

const curriculumCounts = () => {
  const fields = Object.values(CURRICULUM);
  const modules = fields.flatMap((field) => field.modules || []);
  const topics = modules.flatMap((module) => module.topics || []);
  return { fields: fields.length, disciplines: modules.length, topics: topics.length };
};

function SplashScreen({ setScreen }) {
  const counts = curriculumCounts();

  return (
    <div className="splash">
      <main className="splash-panel">
        <div className="splash-copy">
          <p className="splash-eyebrow">A reference book for curious people</p>

          <h1 className="splash-wordmark">VELORA</h1>

          <p className="splash-tagline">
            Learn what stays with you. Lessons, a dictionary and a set of games built around
            understanding rather than recall for its own sake.
          </p>

          <div className="splash-actions">
            <button
              type="button"
              className="splash-btn splash-btn-primary"
              onClick={() => setScreen('profile')}
            >
              Start learning
              <ArrowRight size={15} aria-hidden="true" />
            </button>
            {/* Someone who wants a look before committing to a form should get one. */}
            <button type="button" className="splash-browse" onClick={() => setScreen('landing')}>
              Look around first
            </button>
          </div>

          <p className="splash-footer">
            No account, no email, no password. Everything stays in this browser.
          </p>
        </div>

        <aside className="splash-contents" aria-label="What is inside">
          <p className="splash-contents-label">
            <BookOpen size={13} aria-hidden="true" /> Inside
          </p>
          <dl className="splash-contents-list">
            <div>
              <dt>Fields</dt>
              <dd>{counts.fields}</dd>
            </div>
            <div>
              <dt>Disciplines</dt>
              <dd>{counts.disciplines}</dd>
            </div>
            <div>
              <dt>Lesson topics</dt>
              <dd>{counts.topics}</dd>
            </div>
            <div>
              <dt>Dictionary entries</dt>
              <dd>{CURIOUS_TERMS.length}</dd>
            </div>
          </dl>
          <p className="splash-contents-note">
            Counted from the curriculum and the dictionary themselves, not written by hand.
          </p>
        </aside>
      </main>
    </div>
  );
}

export default SplashScreen;
