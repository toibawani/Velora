/**
 * GlossaryText - renders prose with its difficult terms already clickable.
 *
 * The library has a glossary of every technical word it uses, and this is the
 * join between the two: it finds the first few glossary terms in a paragraph,
 * wraps them in the inline definition control, and leaves the rest of the
 * sentence exactly as written.
 *
 * Why automatic rather than {{term}} markup in the data: eighteen essays and
 * every future one would have to remember which words a reader might not know,
 * and the ones an author forgets are precisely the ones that need explaining.
 * A glossary entry is written once and every mention of the word can use it.
 *
 * Three links per paragraph is a deliberate cap. A paragraph with nine dotted
 * words reads as a form to fill in, not as prose.
 */
import React, { createContext, useContext } from 'react';
import { GlossaryTerm } from './GlossaryTerm';
import { buildGlossaryPattern, lookupDossierTerm, termAllowedInField } from '../data/dossiers/glossary';

/**
 * The dossier's field, so an ambiguous word links only where its technical
 * sense applies. Set once around the article instead of at every paragraph.
 */
export const GlossaryFieldContext = createContext(null);

export function GlossaryFieldProvider({ field, children }) {
  return <GlossaryFieldContext.Provider value={field}>{children}</GlossaryFieldContext.Provider>;
}

/**
 * The glossary's own matcher, built once at module load. The alternation is
 * longest-first so "quantum field" wins over "quantum" and "event horizon"
 * over "horizon", and it accepts plurals because that is how prose writes
 * these words.
 */
const TERM_PATTERN = buildGlossaryPattern();

const emphasisPattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

/**
 * Links terms inside one run of plain text, spending from a shared budget.
 * `used` is shared across the whole paragraph, so a word linked in the opening
 * sentence is not linked again two lines later.
 */
function linkPlain(text, budget, used, keyPrefix, field) {
  const nodes = [];
  let last = 0;
  let key = 0;
  TERM_PATTERN.lastIndex = 0;
  let match = TERM_PATTERN.exec(text);

  while (match) {
    const word = match[0];
    const entry = lookupDossierTerm(word);
    const canLink =
      entry && !used.has(entry.term) && budget.remaining > 0 && termAllowedInField(entry, field);

    if (!canLink) {
      match = TERM_PATTERN.exec(text);
      continue;
    }

    if (match.index > last) nodes.push(text.slice(last, match.index));
    used.add(entry.term);
    budget.remaining -= 1;
    nodes.push(
      <GlossaryTerm
        key={`${keyPrefix}-${key++}`}
        term={entry.term}
        definition={entry.brief}
        hint={entry.field}
        compact
      >
        {word}
      </GlossaryTerm>
    );
    last = match.index + word.length;
    match = TERM_PATTERN.exec(text);
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/**
 * Renders **emphasis**, *italics* and glossary terms. Emphasis is split first
 * so a term inside a bold phrase keeps its boldness, and so the asterisks never
 * reach the term matcher.
 */
export function GlossaryText({ text, limit = 3 }) {
  const field = useContext(GlossaryFieldContext);
  if (typeof text !== 'string' || text.length === 0) return null;

  const budget = { remaining: limit };
  const used = new Set();
  const nodes = [];
  let last = 0;
  let key = 0;
  emphasisPattern.lastIndex = 0;
  let match = emphasisPattern.exec(text);

  while (match) {
    if (match.index > last) {
      nodes.push(...linkPlain(text.slice(last, match.index), budget, used, `t-${key}`, field));
    }
    const token = match[0];
    const inner = linkPlain(
      token.slice(token.startsWith('**') ? 2 : 1, token.startsWith('**') ? -2 : -1),
      budget,
      used,
      `e-${key}`,
      field
    );
    nodes.push(
      token.startsWith('**') ? (
        <strong key={`strong-${key}`}>{inner}</strong>
      ) : (
        <em key={`em-${key}`}>{inner}</em>
      )
    );
    key += 1;
    last = match.index + token.length;
    match = emphasisPattern.exec(text);
  }

  if (last < text.length) {
    nodes.push(...linkPlain(text.slice(last), budget, used, 'tail', field));
  }

  return <>{nodes}</>;
}

export default GlossaryText;
