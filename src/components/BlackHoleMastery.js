import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, List } from 'lucide-react';
import BlackHoleCanvas from './BlackHoleCanvas';
import ConceptEntry from './ConceptEntry';
import { parseInlineTerms } from './GlossaryTerm';
import { BLACK_HOLE_LEVELS, TOTAL_ENTRIES } from '../data/blackholes';
import '../styles/BlackHoleMastery.css';

/**
 * Black holes, in ten levels.
 *
 * This used to be a screen of freeform heading-and-text pairs whose "chapters"
 * were not about black holes: the first was "What is Space?" and the third was
 * "Einstein's Gravity". The content now lives in src/data/blackholes, one file
 * per level, and this component does three things only: choose a level, render
 * it, and let someone get back to where they were.
 *
 * The rail is a rail rather than a scroll for the reason given in the brief:
 * this is several thousand words and people come back to a specific part. It
 * also shows what each level contains before you click it, so someone can jump
 * straight to Level 4 rather than scrolling through three to find out whether
 * Level 4 is what they want.
 *
 * On a narrow screen the rail collapses behind a disclosure. Eleven stacked
 * level buttons above the content would push the first paragraph below the fold
 * on a 375px screen, which on a screen whose whole purpose is reading is the
 * one layout failure that actually matters.
 */
function BlackHoleMastery({ onBack, onOpenLab }) {
  const [levelId, setLevelId] = useState(BLACK_HOLE_LEVELS[0].id);
  const [railOpen, setRailOpen] = useState(false);
  const contentRef = useRef(null);
  const headingRef = useRef(null);

  const level = BLACK_HOLE_LEVELS.find((entry) => entry.id === levelId) || BLACK_HOLE_LEVELS[0];
  const levelIndex = BLACK_HOLE_LEVELS.indexOf(level);

  // Move focus to the level heading on every change, for the same reason the
  // router does on a route change: without it a keyboard reader clicks "Level 6"
  // and focus stays up in the rail, so the next Tab walks the rail again rather
  // than entering the text they asked for.
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [levelId]);

  const goToLevel = (id) => {
    setLevelId(id);
    setRailOpen(false);
  };

  const step = (offset) => {
    const next = BLACK_HOLE_LEVELS[levelIndex + offset];
    if (next) goToLevel(next.id);
  };

  const railItems = BLACK_HOLE_LEVELS.map((entry) => (
    <li key={entry.id}>
      <button
        type="button"
        className={`bhm-rail-item ${entry.id === level.id ? 'current' : ''}`}
        onClick={() => goToLevel(entry.id)}
        aria-current={entry.id === level.id ? 'true' : undefined}
      >
        <span className="bhm-rail-number">{entry.number}</span>
        <span className="bhm-rail-text">
          <strong>{entry.title}</strong>
          <small>{entry.blurb}</small>
        </span>
      </button>
    </li>
  ));

  return (
    <div className="black-hole-mastery-container">
      <BlackHoleCanvas />

      <div className="bhm-shell">
        <header className="bhm-header">
          <div className="bhm-header-title">
            <p className="bhm-eyebrow">Physics</p>
            <h1>Black holes</h1>
            <p className="bhm-header-note">
              {BLACK_HOLE_LEVELS.length} levels, {TOTAL_ENTRIES} entries. Any dotted word can be
              defined where it appears, without leaving the page.
            </p>
          </div>
          <button type="button" className="bhm-back" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </button>
        </header>

        <div className="bhm-body">
          <nav className="bhm-rail" aria-label="Black hole levels">
            <ol className="bhm-rail-list">{railItems}</ol>
          </nav>

          <main className="bhm-main" ref={contentRef}>
            <button
              type="button"
              className="bhm-rail-toggle"
              aria-expanded={railOpen}
              aria-controls="bhm-level-list"
              onClick={() => setRailOpen((open) => !open)}
            >
              <List size={16} aria-hidden="true" />
              <span>
                Level {level.number}: {level.title}
              </span>
              <ChevronDown size={16} aria-hidden="true" className={railOpen ? 'rotated' : ''} />
            </button>

            {railOpen && (
              <ol className="bhm-rail-list bhm-rail-list-collapsed" id="bhm-level-list">
                {railItems}
              </ol>
            )}

            <article className="bhm-content" key={level.id}>
              <header className="bhm-level-head">
                <p className="bhm-level-eyebrow">
                  Level {level.number} of {BLACK_HOLE_LEVELS.length - 1}
                </p>
                {/* tabIndex -1 so it can take focus without becoming a tab stop. */}
                <h2 ref={headingRef} tabIndex={-1} className="bhm-level-title">
                  {level.title}
                </h2>
              </header>

              {level.intro && <p className="bhm-level-intro">{parseInlineTerms(level.intro)}</p>}

              {level.entries?.map((entry) => (
                <ConceptEntry key={entry.id} entry={entry} />
              ))}

              <nav className="bhm-pager" aria-label="Level navigation">
                <button
                  type="button"
                  className="bhm-pager-btn"
                  onClick={() => step(-1)}
                  disabled={levelIndex === 0}
                >
                  <ArrowLeft size={15} aria-hidden="true" /> Previous
                </button>
                <button
                  type="button"
                  className="bhm-pager-btn"
                  onClick={() => step(1)}
                  disabled={levelIndex === BLACK_HOLE_LEVELS.length - 1}
                >
                  Next <ArrowRight size={15} aria-hidden="true" />
                </button>
              </nav>

              {onOpenLab && level.number === 1 && (
                <button type="button" className="bhm-lab-link" onClick={onOpenLab}>
                  Try it: the relativity lab
                </button>
              )}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}

export default BlackHoleMastery;

