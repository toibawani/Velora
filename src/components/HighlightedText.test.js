import React from 'react';
import { render, screen } from '@testing-library/react';
import HighlightedText, { splitOnQuery } from './HighlightedText';

describe('splitOnQuery', () => {
  test('marks the typed characters and leaves the rest alone', () => {
    expect(splitOnQuery('Gravitational Lensing', 'tional')).toEqual([
      { text: 'Gravita', match: false },
      { text: 'tional', match: true },
      { text: ' Lensing', match: false },
    ]);
  });

  test('is case-insensitive but keeps the original casing', () => {
    const parts = splitOnQuery('Momentum', 'MOM');
    expect(parts[0]).toEqual({ text: 'Mom', match: true });
  });

  test('marks every occurrence, not only the first', () => {
    const marked = splitOnQuery('entropy and entropy again', 'entropy').filter((p) => p.match);
    expect(marked).toHaveLength(2);
  });

  test('an empty query hands the text back whole', () => {
    expect(splitOnQuery('Entropy', '   ')).toEqual([{ text: 'Entropy', match: false }]);
  });

  test('a query that is not in the text marks nothing', () => {
    expect(splitOnQuery('Entropy', 'momentum')).toEqual([{ text: 'Entropy', match: false }]);
  });

  test('regex characters are matched literally', () => {
    // A query is user input. Building a RegExp out of it would need escaping,
    // and an unescaped "(" throws.
    expect(() => splitOnQuery('Function f(x)', 'f(')).not.toThrow();
    expect(splitOnQuery('Function f(x)', 'f(')[1]).toEqual({ text: 'f(', match: true });
  });
});

describe('HighlightedText', () => {
  test('renders the text with the match inside a mark element', () => {
    render(<HighlightedText text="Conservation of Energy" query="energy" />);

    expect(screen.getByText('Energy', { selector: 'mark' })).toBeInTheDocument();
    expect(screen.getByText(/Conservation of/)).toBeInTheDocument();
  });

  test('renders plain text when there is nothing to mark', () => {
    render(<HighlightedText text="Entropy" query="" />);

    expect(screen.queryByText('Entropy', { selector: 'mark' })).toBeNull();
    expect(screen.getByText('Entropy')).toBeInTheDocument();
  });

  test('renders the fallback rather than the string "undefined" for a missing value', () => {
    render(<HighlightedText query="x" fallback="—" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
