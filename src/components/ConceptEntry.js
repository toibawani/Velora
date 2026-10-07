import React from 'react';
import PropTypes from 'prop-types';
import { parseInlineTerms } from './GlossaryTerm';
import { STATUS_LABELS as PHYSICS_STATUS_LABELS } from '../data/blackholes/schema';
import '../styles/BlackHoleMastery.css';

/**
 * One entry, in the four-field shape every entry uses.
 *
 * The order is fixed and it is deliberate: name, then the plain version, then
 * the mechanism, then why it matters, then how well it is known. The "why it
 * matters" line comes before the status because a reader who skips the caveat
 * should still have got the point, and because the status is a small quiet tag
 * in the corner rather than a badge you read first.
 *
 * Every field runs through the same inline-term parser, so a difficult word is
 * defined the same way wherever it appears. There is no per-entry markup.
 *
 * The status vocabulary is a prop rather than an import, because the two
 * subjects do not share one. Physics can call a result "established" when a
 * measurement decides it; philosophy cannot, and forcing that word onto a live
 * disagreement would be the exact dishonesty the labels exist to prevent. The
 * physics labels are the default so the black hole screen needs no change.
 */
function ConceptEntry({ entry, statusLabels = PHYSICS_STATUS_LABELS }) {
  const { name, simple, deeper, matters, status, source, sourceUrl } = entry;

  return (
    <article className="bhm-entry" aria-labelledby={`entry-${entry.id}`}>
      <header className="bhm-entry-head">
        <h3 id={`entry-${entry.id}`} className="bhm-entry-name">
          {name}
        </h3>
        {/* The status is a dot plus a short word, not a coloured badge. A loud
            badge on every entry would make the contested ones compete with the
            established ones, when the whole point is that they are not the
            same kind of claim. */}
        <span className={`bhm-status bhm-status-${status}`}>
          <span className="bhm-status-dot" aria-hidden="true" />
          {statusLabels[status]}
        </span>
      </header>

      <p className="bhm-entry-simple">{parseInlineTerms(simple)}</p>

      <div className="bhm-entry-deeper">
        <h4 className="bhm-field-label">Deeper</h4>
        <p>{parseInlineTerms(deeper)}</p>
      </div>

      <div className="bhm-entry-matters">
        <h4 className="bhm-field-label">Why it matters</h4>
        <p>{parseInlineTerms(matters)}</p>
      </div>

      {source && (
        <p className="bhm-entry-source">
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {source}
            </a>
          ) : (
            source
          )}
        </p>
      )}
    </article>
  );
}

export default ConceptEntry;