import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Analytics, { barColor } from './Analytics';
import { recordStudySession } from '../utils/analyticsStorage';

beforeEach(() => localStorage.clear());

// currentStreak and topicsCompleted are in the storage defaults and written by
// nothing, so both tiles sat at zero forever - one of them under the caption
// "Verified with flow quizzes", which describes a check no code performs.
test('trades the immovable tiles for ones that move', () => {
  recordStudySession('Plate Tectonics', 60, 'biology');
  recordStudySession('Deep Work', 30, 'philosophy');

  render(<Analytics setScreen={jest.fn()} user={{ name: 'Ada' }} />);

  // Each tile is a named group, so the caption is the handle rather than a
  // class match that also has to find the caption to identify the tile.
  const tileValue = (caption) => {
    const tile = screen.queryByRole('group', { name: caption });
    return tile ? within(tile).getByTestId('metric-value').textContent : undefined;
  };

  expect(tileValue('Sessions Logged')).toBe('2');
  expect(tileValue('Topics Touched')).toBe('2');
  expect(tileValue('Hours recorded')).toBe('1.5');
  // The tile used to say Total Focused Hours. Nothing measures focus, so it now
  // names the quantity it actually has: time between open and close.
  expect(tileValue('Total Focused Hours')).toBeUndefined();

  expect(screen.queryByText(/Active Learning Streak/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Mastered Modules/i)).not.toBeInTheDocument();
});

// The learning style bars and the peak-hours boxes read fields that no code
// writes, so the screen printed 0% beside a box confidently labelled
// "Evening (Peak)". A zero from no measurement is not a measurement.
test('does not present an unmeasured zero as a reading', () => {
  render(<Analytics setScreen={jest.fn()} user={null} />);

  // The replacement card has to name what used to be here, which is the
  // evidence that the panels are gone rather than merely relabelled, and no
  // percentage may appear beside them.
  expect(screen.getByRole('heading', { name: 'Not Measured Yet' })).toBeInTheDocument();
  expect(screen.getByText('Learning style')).toBeInTheDocument();
  expect(screen.getByText('Best time of day')).toBeInTheDocument();
  expect(screen.queryByText('Evening (Peak)')).not.toBeInTheDocument();
  expect(screen.queryByText('0%')).not.toBeInTheDocument();
  expect(screen.getByText(/Nothing writes to this list yet/)).toBeInTheDocument();
});

// jsdom discards a var() assigned to an inline style, so the token has to be
// asserted where it is produced rather than in the DOM.
test('paints a distribution bar from the subject token', () => {
  expect(barColor('biology')).toBe('var(--subject-biology, var(--accent-primary))');
  expect(barColor(undefined)).toBe('var(--accent-primary)');
});

test('a studied topic gets a bar and not a stored colour', () => {
  recordStudySession('Plate Tectonics', 60, 'biology');

  render(<Analytics setScreen={jest.fn()} user={null} />);

  expect(screen.getByText('Plate Tectonics')).toBeInTheDocument();
  expect(screen.getByTestId('bar-fill')).toBeInTheDocument();
  expect(screen.queryByText(/#2563EB/i)).not.toBeInTheDocument();
});
