import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, List, Sparkles } from 'lucide-react';
import ConceptEntry from './ConceptEntry';
import { parseInlineTerms } from './GlossaryTerm';
import RabbitHoleSidebar from './RabbitHoleSidebar';
import '../styles/BlackHoleMastery.css';

/**
 * A level reader: a rail of levels, one level of entries at a time.
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
  onOpenDialogue,
}) {
  const [rabbitHoleOpen, setRabbitHoleOpen] = useState(false);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="rabbit-hole-trigger-btn"
              onClick={() => setRabbitHoleOpen(true)}
              aria-label="Open Rabbit Hole Mode"
            >
              <Sparkles size={14} aria-hidden="true" /> Rabbit Hole
            </button>
            <button type="button" className="bhm-back" onClick={onBack}>
              <ArrowLeft size={16} aria-hidden="true" /> Back
            </button>
          </div>
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
      <RabbitHoleSidebar
        topicId={title ? title.toLowerCase().replace(/\s+/g, '-') : 'black-holes'}
        topicTitle={title}
        subject={eyebrow ? eyebrow.toLowerCase() : 'physics'}
        isOpen={rabbitHoleOpen}
        onClose={() => setRabbitHoleOpen(false)}
        onNavigateFigure={onOpenDialogue}
      />
    </div>
  );
}

export default DeepRead;
