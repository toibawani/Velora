import PropTypes from 'prop-types';
import React from 'react';

/**
 * The part of `text` that matches `query`, marked.
 *
 * The dictionary already filtered to the matching entries, which told you that
 * six of them matched and left you to find the word in each one yourself - on a
 * card with a term, a tagline and a paragraph, the word you searched for was
 * sometimes in the third place you looked.
 *
 * Matching is done with indexOf on lowercased copies rather than a regular
 * expression, for two reasons: a query is user input, so building a pattern out
 * of it means escaping every metacharacter and getting that wrong once is a
 * crash; and a plain substring search is what the reader means by "highlight
 * what I typed". An empty or whitespace-only query returns the text untouched.
 */
export const splitOnQuery = (text, query) => {
  const value = typeof text === 'string' ? text : '';
  const needle = typeof query === 'string' ? query.trim() : '';
  if (!value || !needle) return [{ text: value, match: false }];

  const haystack = value.toLowerCase();
  const lowered = needle.toLowerCase();
  const parts = [];
  let from = 0;

  let at = haystack.indexOf(lowered, from);
  while (at !== -1) {
    if (at > from) parts.push({ text: value.slice(from, at), match: false });
    parts.push({ text: value.slice(at, at + needle.length), match: true });
    from = at + needle.length;
    at = haystack.indexOf(lowered, from);
  }
  if (from < value.length) parts.push({ text: value.slice(from), match: false });
  return parts;
};

HighlightedText.propTypes = {
  text: PropTypes.string,
  query: PropTypes.string,
  /** Rendered instead of `text` when there is nothing to show. */
  fallback: PropTypes.string,
};

function HighlightedText({ text, query, fallback = '' }) {
  const value = typeof text === 'string' ? text : fallback;
  const parts = splitOnQuery(value, query);
  if (parts.length === 1 && !parts[0].match) return <>{parts[0].text}</>;

  return (
    <>
      {parts.map((part, index) =>
        part.match ? (
          // <mark> rather than a span with a background: it is the element that
          // means "this is the part you were looking for", and a screen reader
          // announces it as such.
          <mark key={index} className="text-match">
            {part.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )}
    </>
  );
}

export { HighlightedText };
export default HighlightedText;
