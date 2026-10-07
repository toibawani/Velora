import React, { memo } from 'react';
import PropTypes from 'prop-types'; { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, List } from 'lucide-react';
import ConceptEntry from './ConceptEntry';
import { parseInlineTerms } from './GlossaryTerm';
import '../styles/BlackHoleMastery.css';

/**
 * A level reader: a rail of levels, one level of entries at a time.
 *
 * This used to be BlackHoleMastery and was physics-only. It was extracted so the
 * philosophy material could use it unchanged, which is the actual evidence that
 * the pattern generalises: adding a subject meant adding data files, not writing
 * a second reader. The component does three things and nothing else - choose a
 * level, render it, and let someone get back to where they were.
 *
 * The rail is a rail rather than a scroll for the reason given in the brief:
 * these are thousands of words and people come back to a specific part. It also
 * shows what each level contains before you click it, so someone can jump
 * straight to Level 4 rather than scrolling through three to find out whether
 * Level 4 is what they want.
 *
 * On a narrow screen the rail collapses behind a disclosure. A stack of level
 * buttons above the content would push the first paragraph below the fold on a
 * 375px screen, which on a screen whose whole purpose is reading is the one
 * layout failure that actually matters.
 *
 * Everything subject-specific arrives as a prop: the levels, what the subject is
 * called, the label on the rail, the status vocabulary, and an optional piece of
 * background decoration (the black hole canvas) and an optional per-level footer
 * (the relativity lab link). Nothing about physics is baked in.
 */
function DeepRead({
  levels,
  eyebrow,
  title,
  note,
  railLabel,
  onBack,
  initialLevelId,
  background = null,
  statusLabels,
  levelFooter,
}) {
  const isValidLevel = (id) => levels.some((entry) => entry.id === id);
  const [levelId, setLevelId] = useState(() =>
    initialLevelId && isValidLevel(initialLevelId) ? initialLevelId : levels[0].id
  );
  const [railOpen, setRailOpen] = useState(false);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const collapsedListId = useId();

  const level = levels.find((entry) => entry.id === levelId) || levels[0];
  const levelIndex = levels.indexOf(level);
  // The highest level number, not the count, so "Level 1 of 7" stays right if a
  // subject ever renumbers or skips a level.
  const topNumber = levels[levels.length - 1].number;

  // Move focus to the level heading on every change, for the same reason the
  // router does on a route change: without it a keyboard reader clicks a level
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
    const next = levels[levelIndex + offset];
    if (next) goToLevel(next.id);
  };

  const railItems = levels.map((entry) => (
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
    <div className="deep-read-container">
      {background}

      <div className="bhm-shell">
        <header className="bhm-header">
          <div className="bhm-header-title">
            <p className="bhm-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="bhm-header-note">{note}</p>
          </div>
          <button type="button" className="bhm-back" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </button>
        </header>

        <div className="bhm-body">
          <nav className="bhm-rail" aria-label={railLabel}>
            <ol className="bhm-rail-list">{railItems}</ol>
          </nav>

          <main className="bhm-main" ref={contentRef}>
            <button
              type="button"
              className="bhm-rail-toggle"
              aria-expanded={railOpen}
              aria-controls={collapsedListId}
              onClick={() => setRailOpen((open) => !open)}
            >
              <List size={16} aria-hidden="true" />
              <span>
                Level {level.number}: {level.title}
              </span>
              <ChevronDown size={16} aria-hidden="true" className={railOpen ? 'rotated' : ''} />
            </button>

            {railOpen && (
              <ol className="bhm-rail-list bhm-rail-list-collapsed" id={collapsedListId}>
                {railItems}
              </ol>
            )}

            <article className="bhm-content" key={level.id}>
              <header className="bhm-level-head">
                <p className="bhm-level-eyebrow">
                  Level {level.number} of {topNumber}
                </p>
                {/* tabIndex -1 so it can take focus without becoming a tab stop. */}
                <h2 ref={headingRef} tabIndex={-1} className="bhm-level-title">
                  {level.title}
                </h2>
              </header>

              {level.intro && <p className="bhm-level-intro">{parseInlineTerms(level.intro)}</p>}

              {level.entries?.map((entry) => (
                <ConceptEntry key={entry.id} entry={entry} statusLabels={statusLabels} />
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
                  disabled={levelIndex === levels.length - 1}
                >
                  Next <ArrowRight size={15} aria-hidden="true" />
                </button>
              </nav>

              {levelFooter?.(level)}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DeepRead;
