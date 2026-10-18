import React from 'react';
import PropTypes from 'prop-types';

import { ArrowRight } from 'lucide-react';
import { KNOWLEDGE_FIELDS, KNOWLEDGE_STATS } from '../data/knowledgeFields';
import { fieldCoverage } from '../data/atlasResolution';
import { CURIOUS_TERMS } from '../data/dictionary';
import { BLACK_HOLE_LEVELS, TOTAL_ENTRIES } from '../data/blackholes';
import '../styles/LandingPage.css';

/**
 * What a visitor sees behind "Look around first".
 *
 * This screen used to be a marketing page: three testimonials from people who
 * do not exist, a "Join 1,400+ scholars" line, a comparison table against
 * Khan Academy, and promises of verifiable credentials and debate rooms that
 * were never built. Every one of those was invented. A page that lies about
 * users is worse than no page, so it is now an inventory instead: the real
 * counts, the real gaps, and a button into the real app.
 *
 * The numbers are read from the same data modules the app reads, so this
 * screen cannot drift from what the app actually contains.
 */
LandingPage.propTypes = { setScreen: PropTypes.shape({ setScreen: PropTypes.func }) };

function LandingPage({ setScreen }) {
  const fields = KNOWLEDGE_FIELDS.map((field) => {
    const topics = field.disciplines.flatMap((discipline) =>
      discipline.modules.flatMap((moduleItem) => moduleItem.topics)
    );
    const coverage = fieldCoverage(field.id, topics);
    return {
      id: field.id,
      label: field.label,
      total: topics.length,
      written: coverage.written,
      unwritten: coverage.unwritten + coverage.unmapped,
    };
  });
  const written = fields.reduce((sum, field) => sum + field.written, 0);
  const unwritten = fields.reduce((sum, field) => sum + field.unwritten, 0);
  const emptyFields = fields.filter((field) => field.written === 0);

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-logo">VELORA</span>
          <div className="landing-nav-cta">
            <button className="lp-cta-btn" onClick={() => setScreen('splash')}>
              Back to the start
            </button>
          </div>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="hero-badge">A look around, before you sign up for anything</span>
          </div>

          <h1 className="hero-headline">
            Look inside
            <br />
            <em className="hero-accent">before you start.</em>
          </h1>

          <p className="hero-subline">
            Velora is a reference book for curious people. Every topic is listed from day one.
            The ones with nothing written behind them say so, in the index, rather than opening
            a half-finished page. There is no server, no account and nothing to install.
          </p>

          <div className="hero-cta-row">
            <button className="hero-primary-cta" onClick={() => setScreen('profile')}>
              Set up this device <ArrowRight size={15} />
            </button>
          </div>
          <p className="landing-fine-print">
            Setting up asks for a display name and stores it in this browser. There is no email,
            no password and no account behind it.
          </p>
        </div>
      </section>

      <section className="landing-section inventory-section" aria-labelledby="inventory-title">
        <div className="section-inner">
          <div className="section-header-asymm">
            <span className="section-label">THE WHOLE INVENTORY</span>
            <h2 id="inventory-title" className="section-heading">
              Here is exactly what is written, and what is not.
            </h2>
          </div>

          <div className="inventory-list">
            <div className="inventory-item">
              <span className="inventory-label">Atlas topics</span>
              <span className="inventory-value">{written} of {KNOWLEDGE_STATS.topics} written</span>
            </div>
            <div className="inventory-item">
              <span className="inventory-label">Dictionary entries</span>
              <span className="inventory-value">{CURIOUS_TERMS.length}</span>
            </div>
            <div className="inventory-item">
              <span className="inventory-label">Black hole levels</span>
              <span className="inventory-value">{BLACK_HOLE_LEVELS.length} levels, {TOTAL_ENTRIES} entries</span>
            </div>
            <div className="inventory-item">
              <span className="inventory-label">Fields with content</span>
              <span className="inventory-value">{fields.filter(f => f.written > 0).length} of {KNOWLEDGE_STATS.fields}</span>
            </div>
          </div>

          <p className="inventory-note">
            {unwritten} topics are listed and marked "not written yet". They are real parts of their fields; the lessons simply do not exist.
          </p>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="coverage-title">
        <div className="section-inner">
          <div className="section-header-asymm">
            <span className="section-label">BY FIELD</span>
            <h2 id="coverage-title" className="section-heading">
              Three fields are written. Three are an outline.
            </h2>
          </div>

          <ul className="landing-coverage-list">
            {fields.map((field) => (
              <li key={field.id}>
                <span className="landing-coverage-name">{field.label}</span>
                <span className="landing-coverage-count">
                  {field.written} of {field.total} written
                </span>
              </li>
            ))}
          </ul>

          <p className="landing-coverage-note">
            {emptyFields.length > 0
              ? `${emptyFields.map((field) => field.label).join(', ')} are listed in full and have no content behind them yet. That is the current state, not a loading screen.`
              : 'Every field has something written behind it.'}
          </p>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="missing-title">
        <div className="section-inner">
          <div className="section-header-asymm">
            <span className="section-label">WHAT IS NOT HERE</span>
            <h2 id="missing-title" className="section-heading">
              The missing pieces are part of the design.
            </h2>
          </div>

          <ul className="landing-missing-list">
            <li>No accounts, no email, no password. A display name is stored in this browser.</li>
            <li>No backend. Progress lives in localStorage and is lost if you clear site data.</li>
            <li>No comments, likes or rankings. There are no other users to show you.</li>
            <li>No certificates and no credentials. Nothing here can be verified by anyone else.</li>
            <li>No lessons in Political Science, Geography or Literature yet. The topics are listed so the gap is visible.</li>
          </ul>
        </div>
      </section>

      <section className="landing-final-cta">
        <div className="final-cta-inner">
          <div className="final-cta-text">
            <h2 className="final-cta-heading">Start with a topic, not a tour.</h2>
            <p className="final-cta-sub">
              The atlas opens on a written lesson, and the index tells you which topics have
              one. Reading it takes a name and nothing else.
            </p>
          </div>
          <div className="final-cta-action">
            <button className="hero-primary-cta large" onClick={() => setScreen('profile')}>
              Set up this device <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="landing-logo small">VELORA</span>
          <span className="footer-tagline">Learning is exploration, not memorization.</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
