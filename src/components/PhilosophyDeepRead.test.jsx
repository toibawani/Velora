import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import PhilosophyDeepRead from './PhilosophyDeepRead';
import GlossaryTerm from './GlossaryTerm';
import { PHILOSOPHY_LEVELS, TOTAL_ENTRIES, STATUS_LABELS } from '../data/philosophy';

const renderRead = (props = {}) => render(<PhilosophyDeepRead onBack={jest.fn()} {...props} />);

describe('the philosophy deep read', () => {
  test('opens on the opening level and says what the subject is', () => {
    renderRead();
    expect(screen.getByRole('heading', { level: 1, name: 'The big questions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'The big picture' })).toBeInTheDocument();
    // The header counts the material, so a reader knows the size of what is there.
    expect(screen.getByText(new RegExp(`${TOTAL_ENTRIES} entries`))).toBeInTheDocument();
  });

  test('offers every level in the rail, with a line about what is in it', () => {
    renderRead();
    const rail = screen.getByRole('navigation', { name: /philosophy levels/i });
    PHILOSOPHY_LEVELS.forEach((level) => {
      expect(within(rail).getByText(level.blurb)).toBeInTheDocument();
    });
  });

  test('opens on the level the Atlas named rather than the top of the subject', () => {
    // Tapping "Free Will" in the atlas is supposed to land on the free will
    // level. This is the half of that which lives in the reader.
    renderRead({ initialLevelId: 'are-we-free' });
    expect(screen.getByRole('heading', { level: 2, name: 'Are we free?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Free Will' })).toBeInTheDocument();
  });

  test('ignores an anchor that names no level rather than rendering nothing', () => {
    renderRead({ initialLevelId: 'no-such-level' });
    expect(screen.getByRole('heading', { level: 2, name: 'The big picture' })).toBeInTheDocument();
  });

  test('carries its own status vocabulary, not the physics one', () => {
    // The point of the whole exercise. "Unknown / contested" is a physics label
    // and would be wrong here; philosophy's tiers are settled / debated / open,
    // and a reader must be able to tell a closed result from a live argument.
    renderRead({ initialLevelId: 'what-we-can-know' });
    // Gettier's refutation is a settled result; skepticism is not.
    expect(screen.getByText(STATUS_LABELS.settled)).toBeInTheDocument();
    expect(screen.getByText(STATUS_LABELS.open)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Are we free\?/ }));
    expect(screen.getByText(STATUS_LABELS.debated)).toBeInTheDocument();
    // The physics labels must not appear anywhere in this subject.
    expect(screen.queryByText('Unknown / contested')).not.toBeInTheDocument();
    expect(screen.queryByText('Well-established')).not.toBeInTheDocument();
  });

  test('labels a contested question as contested rather than resolving it', () => {
    renderRead({ initialLevelId: 'are-we-free' });
    expect(screen.getByText(STATUS_LABELS.debated)).toBeInTheDocument();
    // And the entry says plainly that nobody has settled it.
    expect(screen.getByText(/there are three working positions/i)).toBeInTheDocument();
  });

  test('defines a philosophy term through the one glossary component', () => {
    renderRead({ initialLevelId: 'are-we-free' });
    fireEvent.click(screen.getByRole('button', { name: /define compatibilism/i }));
    expect(screen.getByRole('note')).toHaveTextContent(/without outside coercion/i);
  });

  test('still defines a physics term through the same control', () => {
    // The reverse direction, and the regression that matters: one component, two
    // glossaries. If this stops working, extending the glossary built a parallel
    // system instead of extending one.
    render(
      <div>
        <GlossaryTerm term="geodesic">geodesic</GlossaryTerm>
        <GlossaryTerm term="a priori">a priori</GlossaryTerm>
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: /define geodesic/i }));
    expect(screen.getByRole('note')).toHaveTextContent(/straightest possible path/i);
    fireEvent.click(screen.getByRole('button', { name: /define geodesic/i }));
    fireEvent.click(screen.getByRole('button', { name: /define a priori/i }));
    expect(screen.getByRole('note')).toHaveTextContent(/without having to go and look/i);
  });
});