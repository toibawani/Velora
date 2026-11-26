/**
 * GlossaryTerm - inline glossary term with tap-to-reveal definition.
 * Terms are looked up from subject glossary data (blackholes, philosophy, history).
 */
import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { lookupTerm as lookupPhysicsTerm } from '../data/blackholes/glossary';
import { lookupTerm as lookupPhilosophyTerm } from '../data/philosophy/glossary';
import { lookupTerm as lookupHistoryTerm } from '../data/history/glossary';
import { lookupTerm as lookupCsTerm } from '../data/computerscience/glossary';
import '../styles/GlossaryTerm.css';

/**
 * The one lookup every inline definition goes through.
 *
 * Four subjects have difficult words and there is one term system, so this is
 * the join between them rather than a <GlossaryTerm> per subject. The glossaries
 * stay separate files (each has its own duplicate guard and its own tests) and
 * this function is the single place they are read together, which keeps "one
 * word, one meaning" checkable: every subject's glossary.test.ts asserts no term
 * is defined in two of them, so the order of the lookups can never decide what a
 * reader is shown.
 */
export const lookupTerm = (term) =>
  lookupPhysicsTerm(term) ||
  lookupPhilosophyTerm(term) ||
  lookupHistoryTerm(term) ||
  lookupCsTerm(term);

/**
 * An inline definition for a difficult word.
 *
 * The control is a <button>, not a span with a CSS :hover rule, and that is the
 * whole design decision. Hover does not exist on a phone: a term marked up with
 * title="..." or a hover-only tooltip is a word that cannot be looked up by a
 * large share of the people reading this, and it fails silently rather than
 * visibly. A button fires on tap, on Enter and on Space, and can be focused by
 * a keyboard, so all three ways of interacting with the page reach it.
 *
 * The definition comes from src/data/blackholes/glossary.ts rather than from a
 * prop. "Entropy" is used in Level 6 and again in Level 7; two hand-written
 * tooltips for it would drift into two different wordings, which is worse than
 * not having either. Passing `definition` is still allowed for the rare case of
 * a term that genuinely needs different wording in a different context.
 *
 * If a term is not in the glossary the children render as ordinary text with no
 * button at all. A missing entry should degrade to normal reading, not to a
 * dead control the reader can click and get nothing from.
 */
export function GlossaryTerm({ term, children, definition, compact = false, hint }) {
  const entry = lookupTerm(term);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const panelId = useId();

  // Chained terms are followed one level deep, so "photon sphere" can point at
  // "event horizon" without a reader having to go looking for it.
  const chained = entry?.see ? lookupTerm(entry.see) : undefined;
  const text = definition || entry?.definition;
  const label = children || entry?.term || term;

  const close = useCallback(() => setOpen(false), []);

  /**
   * Placing the panel against the viewport, not against the word.
   *
   * The word is an inline span, so an absolutely positioned panel inherits the
   * width of whichever line fragment the word happens to sit on. On a phone a
   * term near the start of a line put a 320px panel at a negative x and half of
   * every line was cut off. Fixed coordinates, clamped to the viewport, are the
   * only placement that survives a wrapped inline element.
   */
  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return undefined;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return undefined;

    const width = Math.min(352, window.innerWidth - 24);
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
    const below = window.innerHeight - rect.bottom;
    const top = below > 260 ? rect.bottom + 8 : Math.max(12, rect.top - 232);

    setPosition({ left, top, width });
    return undefined;
  }, [open]);

  // A fixed panel would otherwise stay where it was when the page scrolls.
  useEffect(() => {
    if (!open) return undefined;
    const dismiss = () => close();
    window.addEventListener('scroll', dismiss, true);
    window.addEventListener('resize', dismiss);
    return () => {
      window.removeEventListener('scroll', dismiss, true);
      window.removeEventListener('resize', dismiss);
    };
  }, [open, close]);

  // Escape closes, and focus returns to the control that opened it, so a
  // keyboard reader is not dropped at the top of the document.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      close();
      buttonRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  // Clicking anywhere else dismisses it. Without this, one open definition
  // covers the paragraph underneath and there is no obvious way to get rid of it
  // on a touch screen.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (popoverRef.current?.contains(event.target)) return;
      if (buttonRef.current?.contains(event.target)) return;
      close();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open, close]);

  if (!text) {
    // Unregistered term: render as plain text so the paragraph still reads.
    return <>{children}</>;
  }

  const openLabel = `Define ${entry?.term || term}`;

  return (
    <span className="gt-root">
      <button
        type="button"
        ref={buttonRef}
        className={`gt-trigger ${compact ? 'gt-trigger-compact' : ''} ${open ? 'gt-trigger-open' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={openLabel}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <span className="gt-dotted" aria-hidden="true">
          {label}
        </span>
        {!compact && <BookOpen className="gt-icon" size={12} aria-hidden="true" focusable="false" />}
      </button>

      {open && position && (
        <span
          id={panelId}
          ref={popoverRef}
          className="gt-popover"
          style={{ left: position.left, top: position.top, width: position.width }}
          role="note"
          // Not a dialog: it does not take focus and does not trap it. The
          // button keeps focus so a keyboard reader can carry straight on.
          aria-label={entry?.term || term}
        >
          <span className="gt-popover-term">{entry?.term || term}</span>
          <span className="gt-popover-body">{text}</span>
          {chained && (
            <span className="gt-popover-see">
              Builds on <strong>{chained.term}</strong>, which has its own definition.
            </span>
          )}
          {!chained && hint && <span className="gt-popover-see">{hint}</span>}
        </span>
      )}
    </span>
  );
}

/**
 * Splits a string on {{term}} and {{term|display text}} and returns nodes.
 *
 * This exists because the level files are plain data. Storing JSX in a data
 * module would mean the content could not be checked, diffed or tested as text,
 * and a test that reads prose as a string is the only kind that can catch a
 * sentence drifting into a different entry. So the content is text and the
 * markup is a small explicit convention this function owns.
 *
 * The pattern is deliberately not markdown: no other syntax in the content can
 * collide with it, so the only thing that produces a definition is writing a
 * glossary term, and an unmatched brace is a visible typo rather than silently
 * swallowed formatting.
 */
export const INLINE_TERM = /\{\{([a-z][a-zA-Z /-]*?)(?:\|([^}]*))?\}\}/g;

export const parseInlineTerms = (text) => {
  if (typeof text !== 'string' || !text.includes('{{')) {
    return text;
  }

  // A regex with the global flag carries lastIndex between calls, which makes a
  // second call with the same pattern object start halfway through. A fresh
  // literal each time avoids a class of bug where terms quietly stop rendering
  // after the first string that used them.
  const pattern = new RegExp(INLINE_TERM.source, 'g');
  const nodes = [];
  let lastIndex = 0;
  let match = pattern.exec(text);
  let key = 0;

  while (match !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [, term, display] = match;
    nodes.push(
      <GlossaryTerm key={`gt-${key++}`} term={term.trim()}>
        {display || term.trim()}
      </GlossaryTerm>
    );
    lastIndex = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
};

export default GlossaryTerm;