import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ComputerScienceDeepRead from './ComputerScienceDeepRead';
import GlossaryTerm from './GlossaryTerm';
import { CS_LEVELS, TOTAL_ENTRIES, STATUS_LABELS } from '../data/computerscience';

const renderRead = (props = {}) => render(<ComputerScienceDeepRead onBack={jest.fn()} {...props} />);

describe('the computer science deep read', () => {
  test('opens on the opening level and says what the subject is', () => {
    renderRead();
    expect(screen.getByRole('heading', { level: 1, name: 'Computer science, from the machine up' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'How we know' })).toBeInTheDocument();
    // The header counts the material, so a reader knows the size of what is there.
    expect(screen.getByText(new RegExp(`${TOTAL_ENTRIES} entries`))).toBeInTheDocument();
  });

  test('offers every level in the rail, with a line about what is in it', () => {
    renderRead();
    const rail = screen.getByRole('navigation', { name: /computer science levels/i });
    CS_LEVELS.forEach((level) => {
      expect(within(rail).getByText(level.blurb)).toBeInTheDocument();
    });
  });

  test('opens on the level the Atlas named rather than the top of the subject', () => {
    // Tapping "Quantum Computing" in the atlas is supposed to land on the
    // frontier level. This is the half of that which lives in the reader.
    renderRead({ initialLevelId: 'the-frontier' });
    expect(screen.getByRole('heading', { level: 2, name: 'The frontier, and the arguments' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Quantum Computing' })).toBeInTheDocument();
  });

  test('ignores an anchor that names no level rather than rendering nothing', () => {
    renderRead({ initialLevelId: 'no-such-level' });
    expect(screen.getByRole('heading', { level: 2, name: 'How we know' })).toBeInTheDocument();
  });

  test('carries its own status vocabulary, not the physics one', () => {
    // The point of the whole exercise. "Unknown / contested" is a physics label
    // and would be wrong here; computer science's tiers are proved / measured /
    // machine-dependent / contested / open, and a reader must be able to tell a
    // proved result from a benchmark from a disputed one.
    renderRead({ initialLevelId: 'many-machines' });
    // Two entries at the proved tier, because FLP and the two-generals problem
    // are different results and the test needs them to be distinguishable from
    // physics labels, not from each other.
    expect(screen.getAllByText(STATUS_LABELS.proved).length).toBeGreaterThan(0);

    const rail = screen.getByRole('navigation', { name: /computer science levels/i });
    fireEvent.click(within(rail).getByText('Fast, and correct'));
    expect(screen.getAllByText(STATUS_LABELS['machine-dependent']).length).toBeGreaterThan(0);

    fireEvent.click(within(rail).getByText('The frontier, and the arguments'));
    expect(screen.getAllByText(STATUS_LABELS.contested).length).toBeGreaterThan(0);
    // The physics labels must not appear anywhere in this subject.
    expect(screen.queryByText('Unknown / contested')).not.toBeInTheDocument();
    expect(screen.queryByText('Well-established')).not.toBeInTheDocument();
  });

  test('defines a computer science term through the one glossary component', () => {
    renderRead({ initialLevelId: 'the-machine' });
    fireEvent.click(screen.getByRole('button', { name: /define undefined behaviour/i }));
    expect(screen.getByRole('note')).toHaveTextContent(/does not specify at all/i);
  });

  test('still defines a physics term through the same control', () => {
    // The reverse direction, and the regression that matters: one component,
    // four glossaries. If this stops working, extending the glossary built a
    // parallel system instead of extending one.
    render(
      <div>
        <GlossaryTerm term="geodesic">geodesic</GlossaryTerm>
        <GlossaryTerm term="latency">latency</GlossaryTerm>
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: /define geodesic/i }));
    expect(screen.getByRole('note')).toHaveTextContent(/straightest possible path/i);
    fireEvent.click(screen.getByRole('button', { name: /define geodesic/i }));
    fireEvent.click(screen.getByRole('button', { name: /define latency/i }));
    expect(screen.getByRole('note')).toHaveTextContent(/wait before something arrives/i);
  });
});