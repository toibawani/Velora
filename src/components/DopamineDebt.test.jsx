import React from 'react';
import { render, screen } from '@testing-library/react';
import DopamineDebt from './DopamineDebt';

const FLAME = '\u{1F525}';
const HOURGLASS = '\u23F3';

describe('DopamineDebt', () => {
  // The week used to be a hardcoded array with Mon-Fri marked as studied, so
  // every account looked like it had a five day streak on arrival.
  test('a new user is not shown a streak they have not earned', () => {
    render(<DopamineDebt studyStreak={0} onNotify={() => {}} />);
    expect(screen.getByText(/No streak running/i)).toBeInTheDocument();
    expect(screen.getAllByText(HOURGLASS)).toHaveLength(7);
  });

  test('the number of studied days follows the real streak length', () => {
    render(<DopamineDebt studyStreak={3} onNotify={() => {}} />);
    expect(screen.getByText(/current streak of 3 days/i)).toBeInTheDocument();
    // Six completed days are shown, three of them studied.
    expect(screen.getAllByText(FLAME)).toHaveLength(3);
  });

  test('a streak of one reads as a single day, not one days', () => {
    render(<DopamineDebt studyStreak={1} onNotify={() => {}} />);
    expect(screen.getByText(/current streak of 1 day\./i)).toBeInTheDocument();
  });

  test('a missing or nonsense streak does not crash the widget', () => {
    render(<DopamineDebt studyStreak={undefined} onNotify={() => {}} />);
    expect(screen.getByText(/No streak running/i)).toBeInTheDocument();
  });
});
