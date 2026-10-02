import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import BlackHoleMastery from './BlackHoleMastery';
import GlossaryTerm, { parseInlineTerms } from './GlossaryTerm';
import { BLACK_HOLE_LEVELS, TOTAL_ENTRIES } from '../data/blackholes';

beforeEach(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  global.requestAnimationFrame = jest.fn(() => 1);
});

const renderShell = (props = {}) => render(<BlackHoleMastery onBack={jest.fn()} {...props} />);

describe('the level reader', () => {
  test('opens on Level 0 and says so', () => {
    renderShell();
    expect(screen.getByRole('heading', { level: 2, name: 'The big picture' })).toBeInTheDocument();
    expect(screen.getByText(/Level 0 of/)).toBeInTheDocument();
  });

  test('offers every level in the rail, with a line about what is in it', () => {
    renderShell();
    const rail = screen.getByRole('navigation', { name: /black hole levels/i });
    BLACK_HOLE_LEVELS.forEach((level) => {
      // Each rail button carries its own blurb, so a reader can tell whether a
      // level is worth opening without entering it first.
      expect(within(rail).getByText(level.blurb)).toBeInTheDocument();
    });
  });

  test('marks the current level, so a reader who came back knows where they are', () => {
    renderShell();
    const rail = screen.getByRole('navigation', { name: /black hole levels/i });
    expect(within(rail).getAllByRole('button', { current: true })).toHaveLength(1);
  });

  test('jumps straight to a level instead of scrolling through the ones before it', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /The basics/ }));

    expect(screen.getByRole('heading', { level: 2, name: 'The basics' })).toBeInTheDocument();
    expect(screen.getByText(/Level 1 of/)).toBeInTheDocument();
  });

  test('moves focus to the level heading, not back up the rail', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /The basics/ }));

    // Without this a keyboard reader clicks a rail button and focus stays there,
    // so the next Tab walks the rail again instead of entering the text.
    expect(screen.getByRole('heading', { level: 2, name: 'The basics' })).toHaveFocus();
  });

  test('steps forward and back through the levels', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /^Next$/ }));
    expect(screen.getByRole('heading', { level: 2, name: 'The basics' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Previous/ }));
    expect(screen.getByRole('heading', { level: 2, name: 'The big picture' })).toBeInTheDocument();
  });

  test('disables Previous on the first level and Next on the last', () => {
    renderShell();
    expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled();

    const last = BLACK_HOLE_LEVELS[BLACK_HOLE_LEVELS.length - 1];
    fireEvent.click(screen.getByRole('button', { name: new RegExp(last.title) }));
    expect(screen.getByRole('button', { name: /^Next$/ })).toBeDisabled();
  });

  test('renders all four fields of an entry', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /The basics/ }));

    const entry = BLACK_HOLE_LEVELS[1].entries[0];
    expect(screen.getByRole('heading', { level: 3, name: entry.name })).toBeInTheDocument();
    expect(screen.getAllByText('Deeper').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Why it matters').length).toBeGreaterThan(0);
  });

  test('shows a status on every entry', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /The basics/ }));
    const entries = BLACK_HOLE_LEVELS[1].entries.length;
    expect(screen.getAllByText('Well-established').length + screen.getAllByText('Theoretical').length).toBeGreaterThanOrEqual(entries);
  });

  test('tells the reader how much there is', () => {
    renderShell();
    expect(screen.getByText(new RegExp(`${TOTAL_ENTRIES} entries`))).toBeInTheDocument();
  });

  test('opens the relativity lab from Level 1 only', () => {
    const onOpenLab = jest.fn();
    const { unmount } = renderShell({ onOpenLab });
    expect(screen.queryByRole('button', { name: /relativity lab/i })).not.toBeInTheDocument();
    unmount();

    renderShell({ onOpenLab });
    fireEvent.click(screen.getByRole('button', { name: /The basics/ }));
    fireEvent.click(screen.getByRole('button', { name: /relativity lab/i }));
    expect(onOpenLab).toHaveBeenCalled();
  });
});

describe('the glossary control', () => {
  test('is a button, so a finger and a keyboard can both reach it', () => {
    render(<GlossaryTerm term="geodesic">geodesic</GlossaryTerm>);
    const button = screen.getByRole('button', { name: /define geodesic/i });
    // A span with a :hover rule has no role, no name, and no tap handler.
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens the definition on click, with no hover required', () => {
    render(<GlossaryTerm term="geodesic">geodesic</GlossaryTerm>);
    fireEvent.click(screen.getByRole('button', { name: /define geodesic/i }));

    expect(screen.getByRole('note')).toHaveTextContent(/straightest possible path/i);
    expect(screen.getByRole('button', { name: /define geodesic/i })).toHaveAttribute('aria-expanded', 'true');
  });

  test('opens and closes again on a second click', () => {
    render(<GlossaryTerm term="geodesic">geodesic</GlossaryTerm>);
    const button = screen.getByRole('button', { name: /define geodesic/i });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  test('closes on Escape and hands focus back to the control', () => {
    render(<GlossaryTerm term="entropy">entropy</GlossaryTerm>);
    const button = screen.getByRole('button', { name: /define entropy/i });
    fireEvent.click(button);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('note')).not.toBeInTheDocument();
    // Focus left at the top of the document would be worse than never opening it.
    expect(button).toHaveFocus();
  });

  test('points at a simpler term when the word rests on one', () => {
    render(<GlossaryTerm term="photon sphere">photon sphere</GlossaryTerm>);
    fireEvent.click(screen.getByRole('button', { name: /define photon sphere/i }));
    expect(screen.getByRole('note')).toHaveTextContent(/event horizon/);
  });

  test('renders as plain text when the term is not in the glossary', () => {
    // A typo in a term name must not produce a button that opens nothing.
    render(<GlossaryTerm term="not a real term">plain words</GlossaryTerm>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('plain words')).toBeInTheDocument();
  });
});

describe('the inline parser', () => {
  test('leaves ordinary text alone', () => {
    expect(parseInlineTerms('nothing to do here')).toBe('nothing to do here');
  });

  test('splits a sentence around a term and keeps the words either side', () => {
    render(<div>{parseInlineTerms('Before {{entropy}} after.')}</div>);
    expect(screen.getByText(/Before/)).toBeInTheDocument();
    expect(screen.getByText(/after\./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /define entropy/i })).toBeInTheDocument();
  });

  test('uses the display text when one is given', () => {
    render(<div>{parseInlineTerms('{{hydrostatic equilibrium|balance inside a star}}')}</div>);
    expect(screen.getByRole('button', { name: /define hydrostatic equilibrium/i })).toHaveTextContent(
      'balance inside a star'
    );
  });

  test('handles several terms in one string', () => {
    render(<div>{parseInlineTerms('{{entropy}} and {{unitarity}} and {{geodesic}}.')}</div>);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  test('renders two terms in two strings independently', () => {
    // A global regex carries lastIndex between calls. If the parser reused one
    // pattern object, the second string would silently render as plain text.
    const { unmount } = render(<div>{parseInlineTerms('one {{geodesic}} here')}</div>);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    unmount();

    render(<div>{parseInlineTerms('two {{unitarity}} here')}</div>);
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});