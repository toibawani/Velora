import React from 'react';
import { render, screen } from '@testing-library/react';
import Analytics, { barColor } from './Analytics';
import { recordStudySession } from '../utils/analyticsStorage';

beforeEach(() => localStorage.clear());

// currentStreak and topicsCompleted are in the storage defaults and written by
// nothing, so both tiles sat at zero forever - one of them under the caption
// "Verified with flow quizzes", which describes a check no code performs.
test('trades the immovable tiles for ones that move', () => {
  recordStudySession('Plate Tectonics', 60, 'biology');
  recordStudySession('Deep Work', 30, 'philosophy');

  const { container } = render(<Analytics setScreen={jest.fn()} user={{ name: 'Ada' }} />);

  const tileValue = (caption) =>
    Array.from(container.querySelectorAll('.metric-box'))
      .find((box) => box.querySelector('.metric-caption')?.textContent === caption)
      ?.querySelector('.metric-big-num')?.textContent;

  expect(tileValue('Sessions Logged')).toBe('2');
  expect(tileValue('Topics Touched')).toBe('2');
  expect(tileValue('Total Focused Hours')).toBe('1.5');

  expect(screen.queryByText(/Active Learning Streak/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Mastered Modules/i)).not.toBeInTheDocument();
});

// The learning style bars and the peak-hours boxes read fields that no code
// writes, so the screen printed 0% beside a box confidently labelled
// "Evening (Peak)". A zero from no measurement is not a measurement.
test('does not present an unmeasured zero as a reading', () => {
  const { container } = render(<Analytics setScreen={jest.fn()} user={null} />);

  // The panels are gone by structure, not by phrase: the replacement card names
  // what used to be there, so the words themselves still appear on the page.
  expect(container.querySelector('.style-bars-list, .peak-hours-grid, .style-pct, .peak-pct')).toBeNull();
  expect(screen.getByRole('heading', { name: 'Not Measured Yet' })).toBeInTheDocument();
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

  const { container } = render(<Analytics setScreen={jest.fn()} user={null} />);

  expect(screen.getByText('Plate Tectonics')).toBeInTheDocument();
  expect(container.querySelector('.bar-fill')).not.toBeNull();
  expect(screen.queryByText(/#2563EB/i)).not.toBeInTheDocument();
});
