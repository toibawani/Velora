import React from 'react';
import PropTypes from 'prop-types';

import { ArrowRight } from 'lucide-react';
import { KNOWLEDGE_FIELDS, KNOWLEDGE_STATS } from '../data/knowledgeFields';
import { fieldCoverageByDiscipline } from '../data/atlasResolution';
import { CURIOUS_TERMS } from '../data/dictionary';
import { BLACK_HOLE_LEVELS, TOTAL_ENTRIES } from '../data/blackholes';
import '../styles/LandingPage.css';

/**
 * What a visitor sees behind "Look around first".
 *
 * This screen used to be a marketing page: three testimonials from people who
 * do not exist, a "Join 1,400+ scholars" line, a comparison table, and promises
 * of credentials and debate rooms that were never built. A page that lies about
 * users is worse than no page, so it is an inventory instead — the real counts,
 * the real gaps, and a button into the real app.
 *
 * The numbers are read from the same data modules the app reads, so this page
 * cannot drift from what the app actually contains.
 *
 * The layout is a spread: a statement column against a sage plate carrying the
 * one number that matters, then the inventory as an index, then the fields as
 * ruled rows with a written bar each. A page about what exists should look like
 * a catalogue, not like a sales page.
 */
LandingPage.propTypes = { setScreen: PropTypes.func };

function LandingPage({ setScreen }) {
  const fields = KNOWLEDGE_FIELDS.map((field) => {
    const topics = field.disciplines.flatMap((discipline) =>
      discipline.modules.flatMap((moduleItem) => moduleItem.topics)
    );
    const coverage = fieldCoverageByDiscipline(field);
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
  const writtenShare = Math.round((written / Math.max(KNOWLEDGE_STATS.topics, 1)) * 100);

  return (
    <div className="landing-page">
      <header className="lp-masthead">
        <span className="lp-wordmark">VELORA</span>
        <p className="lp-masthead-note">The inventory, before you commit to anything</p>
        <button type="button" className="vl-textlink" onClick={() => setScreen('splash')}>
          Back to the cover
        </button>
      </header>

      <section className="lp-hero" aria-labelledby="lp-hero-title">
        <div className="lp-hero-copy vl-settle" style={{ '--i': 0 }}>
          <p className="vl-kicker vl-kicker--rule">A look around, before you start</p>
          <h1 id="lp-hero-title" className="lp-hero-title">
            Look inside
            <br />
            <em>before you start.</em>
          </h1>
          <p className="lp-hero-lede">
            Velora is a reference book for curious people. Every topic is listed from day one.
            The ones with nothing written behind them say so, in the index, rather than opening
            a half-finished page. There is no server, no account and nothing to install.
          </p>
          <div className="lp-hero-actions">
            <button type="button" className="vl-btn" onClick={() => setScreen('profile')}>
              Set up this device <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="lp-fine-print">
            Setting up asks for a display name and stores it in this browser. There is no email,
            no password and no account behind it.
          </p>
        </div>

        <figure className="lp-hero-plate vl-field vl-field--sage vl-settle" style={{ '--i': 1 }}>
          <p className="lp-plate-label">Written so far</p>
          <p className="lp-plate-number">{written}</p>
          <p className="lp-plate-caption">
            of {KNOWLEDGE_STATS.topics} topics listed across {KNOWLEDGE_STATS.fields} fields
          </p>
          <div className="lp-plate-meter" aria-hidden="true">
            <span style={{ width: `${writtenShare}%` }} />
          </div>
          <p className="lp-plate-foot">
            {unwritten} topics are listed and marked “not written yet”.
          </p>
        </figure>
      </section>

      <section className="lp-inventory" aria-labelledby="inventory-title">
        <div className="lp-section-head">
          <div>
            <span className="vl-kicker vl-kicker--rule">01 — The whole inventory</span>
            <h2 id="inventory-title" className="vl-heading">
              Here is exactly what is written, and what is not.
            </h2>
          </div>
        </div>

        <dl className="lp-inventory-list">
          <div>
            <dt>Atlas topics</dt>
            <dd>
              <strong>{written}</strong> of {KNOWLEDGE_STATS.topics} written
            </dd>
          </div>
          <div>
            <dt>Dictionary entries</dt>
            <dd>
              <strong>{CURIOUS_TERMS.length}</strong> defined
            </dd>
          </div>
          <div>
            <dt>Black hole levels</dt>
            <dd>
              <strong>{BLACK_HOLE_LEVELS.length}</strong> levels, {TOTAL_ENTRIES} entries
            </dd>
          </div>
          <div>
            <dt>Fields with content</dt>
            <dd>
              <strong>{fields.filter((field) => field.written > 0).length}</strong> of{' '}
              {KNOWLEDGE_STATS.fields}
            </dd>
          </div>
        </dl>
      </section>

      <section className="lp-fields" aria-labelledby="coverage-title">
        <div className="lp-section-head">
          <div>
            <span className="vl-kicker vl-kicker--rule">02 — By field</span>
            <h2 id="coverage-title" className="vl-heading">
              Three fields are written. Three are an outline.
            </h2>
          </div>
        </div>

        <ul className="lp-field-list">
          {fields.map((field, index) => {
            const share = Math.round((field.written / Math.max(field.total, 1)) * 100);
            return (
              <li key={field.id} className="lp-field-row">
                <span className="vl-numeral">{String(index + 1).padStart(2, '0')}</span>
                <span className="lp-field-name">{field.label}</span>
                <span className="lp-field-bar" aria-hidden="true">
                  <span style={{ width: `${share}%` }} />
                </span>
                <span className="lp-field-count">
                  <strong>{field.written}</strong> / {field.total}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="lp-field-note">
          {emptyFields.length > 0
            ? `${emptyFields.map((field) => field.label).join(', ')} are listed in full and have no content behind them yet. That is the current state, not a loading screen.`
            : 'Every field has something written behind it.'}
        </p>
      </section>

      <section className="lp-missing vl-field vl-field--ink" aria-labelledby="missing-title">
        <div className="lp-missing-head">
          <span className="vl-kicker vl-kicker--rule">03 — What is not here</span>
          <h2 id="missing-title" className="lp-missing-title">
            The missing pieces are <em>part of the design.</em>
          </h2>
        </div>
        <ul className="lp-missing-list">
          <li>
            <span>No accounts, no email, no password. A display name is stored in this
            browser.</span>
          </li>
          <li>
            <span>No backend. Progress lives in localStorage and is lost if you clear site
            data.</span>
          </li>
          <li>
            <span>No comments, likes or rankings. There are no other users to show you.</span>
          </li>
          <li>
            <span>No certificates and no credentials. Nothing here can be verified by anyone
            else.</span>
          </li>
          <li>
            <span>No lessons in Political Science, Geography or Literature yet. The topics are
            listed so the gap is visible.</span>
          </li>
        </ul>
      </section>

      <section className="lp-final vl-field vl-field--clay" aria-labelledby="lp-final-title">
        <div className="lp-final-text">
          <span className="vl-kicker vl-kicker--rule">04 — Begin</span>
          <h2 id="lp-final-title" className="lp-final-title">
            Start with a topic, <em>not a tour.</em>
          </h2>
          <p className="lp-final-sub">
            The atlas opens on a written lesson, and the index tells you which topics have one.
            Reading it takes a name and nothing else.
          </p>
        </div>
        <button type="button" className="vl-btn lp-final-cta" onClick={() => setScreen('profile')}>
          Set up this device <ArrowRight size={16} aria-hidden="true" />
        </button>
      </section>

      <footer className="lp-footer">
        <span className="lp-wordmark lp-wordmark--small">VELORA</span>
        <p>Learning is exploration, not memorization.</p>
        <div className="lp-footer-links">
          <button type="button" className="vl-textlink" onClick={() => setScreen('terms')}>
            Terms of Service
          </button>
          <button type="button" className="vl-textlink" onClick={() => setScreen('privacy')}>
            Privacy
          </button>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
