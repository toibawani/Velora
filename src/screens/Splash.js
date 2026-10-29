import React from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, BookOpen } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import { CURIOUS_TERMS } from '../data/dictionary';

import '../styles/Splash.css';

/**
 * Splash — the cover of the book.
 *
 * A cover is not a welcome gate. It is a printed plate: the title, one line
 * about what is inside, a drawing, and the counts. The drawing is drawn here
 * rather than loaded, because the only image this screen needs is a line
 * composition, and a line composition is a few hundred bytes of SVG against a
 * photograph's worth of network.
 *
 * The counts are read from the curriculum and the dictionary themselves, so the
 * cover cannot claim a number the app does not hold.
 */
SplashScreen.propTypes = { setScreen: PropTypes.func };

const curriculumCounts = () => {
  const fields = Object.values(CURRICULUM);
  const modules = fields.flatMap((field) => field.modules || []);
  const topics = modules.flatMap((module) => module.topics || []);
  return { fields: fields.length, disciplines: modules.length, topics: topics.length };
};

/**
 * The plate: nested arches, a disc, a pair of crossed lines and a horizon.
 * Nothing in it refers to a specific subject, which is the point — it is the
 * idea of looking into something, not an illustration of one field.
 */
function CoverPlate() {
  return (
    <svg
      className="splash-plate-art"
      viewBox="0 0 260 340"
      role="img"
      aria-label="A line drawing: nested arches around a disc, crossed by a horizon"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.9">
        {/* Outer arch */}
        <path d="M18 322V168C18 100 68 52 130 52s112 48 112 116v154" />
        {/* Inner arch */}
        <path d="M46 322V172c0-52 38-90 84-90s84 38 84 90v150" />
        {/* Horizon */}
        <path d="M46 236h168" opacity="0.5" />
        {/* Discs */}
        <circle cx="130" cy="188" r="52" />
        <circle cx="130" cy="188" r="30" fill="currentColor" opacity="0.14" />
        <circle cx="130" cy="188" r="30" />
        {/* Crossed rays */}
        <path d="M130 40v-16M130 336v-14M92 188H62M198 188h30" opacity="0.55" />
        <path d="M104 136l-18-18M174 240l18 18M156 136l18-18M86 240l-18 18" opacity="0.35" />
        {/* Foot rule */}
        <path d="M78 306h104" strokeWidth="2.4" />
      </g>
      <g fill="currentColor">
        <circle cx="130" cy="20" r="4" />
        <circle cx="34" cy="236" r="3.4" />
        <circle cx="226" cy="236" r="3.4" />
        <path d="M130 276l7 12h-14z" opacity="0.75" />
      </g>
    </svg>
  );
}

function SplashScreen({ setScreen }) {
  const counts = curriculumCounts();

  return (
    <div className="splash">
      <div className="splash-cover">
        {/*
          The imprint bar, not a second wordmark. The title is set once, at
          display size, in the statement column; repeating it here in 15px caps
          made the cover read as a website header with a logo in it.
        */}
        <header className="splash-topbar vl-settle" style={{ '--i': 0 }}>
          <span className="splash-imprint">First edition</span>
          <span className="splash-edition">No account · no email · no password</span>
        </header>

        <div className="splash-grid">
          <figure className="splash-plate vl-field vl-field--blush vl-settle" style={{ '--i': 1 }}>
            <CoverPlate />
            <figcaption className="splash-plate-caption">
              <span>Fig. 1</span>
              <span>Looking into a subject</span>
            </figcaption>
          </figure>

          <section className="splash-statement vl-settle" style={{ '--i': 2 }}>
            <p className="vl-kicker vl-kicker--rule">A reference book for curious people</p>

            <h1 className="splash-wordmark">VELORA</h1>

            <p className="splash-tagline">
              Learn what stays with you. Lessons, a dictionary and a set of games built around
              understanding rather than recall for its own sake.
            </p>

            <div className="splash-actions">
              <button type="button" className="vl-btn splash-start" onClick={() => setScreen('profile')}>
                Start learning
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button type="button" className="vl-btn vl-btn--quiet" onClick={() => setScreen('landing')}>
                Look around first
              </button>
            </div>

            <p className="splash-footer">
              No account, no email, no password. Everything stays in this browser.
            </p>
          </section>

          <aside className="splash-index vl-field vl-field--butter vl-settle" aria-label="What is inside" style={{ '--i': 3 }}>
            <p className="splash-index-label">
              <BookOpen size={13} aria-hidden="true" /> Inside
            </p>
            <dl className="splash-index-list">
              <div>
                <dt>Fields</dt>
                <dd>{String(counts.fields).padStart(2, '0')}</dd>
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
            <p className="splash-index-note">
              Counted from the curriculum and the dictionary themselves, not written by hand.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
