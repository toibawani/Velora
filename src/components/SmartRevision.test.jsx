import React from 'react';
import { render, screen } from '@testing-library/react';
import SmartRevision from './SmartRevision';

const DAY = 86400000;

const store = (items) => localStorage.setItem('velora_reviews', JSON.stringify(items));

const item = (overrides) => ({
  id: 'philosophy:stoicism',
  topic: 'Stoicism',
  subject: 'philosophy',
  reviews: 0,
  nextReview: new Date(Date.now() + 2 * DAY).toISOString(),
  ...overrides,
});

describe('SmartRevision', () => {
  beforeEach(() => localStorage.clear());

  test('says plainly when nothing has been saved', () => {
    render(<SmartRevision />);
    expect(screen.getByText(/nothing saved for review/i)).toBeInTheDocument();
  });

  test('shows the ladder step instead of the removed difficulty chip', () => {
    store([item({ reviews: 1 })]);
    render(<SmartRevision />);
    expect(screen.getByText(/step 2 of/i)).toBeInTheDocument();
    // The old row rendered `item.difficulty`, which is no longer written; an
    // empty chip in the badge slot is what that bug looked like.
    expect(screen.getByText(/step 2 of/i).textContent.trim()).not.toBe('');
  });

  test('counts what is due against what is saved', () => {
    store([
      item({ id: 'a:a', topic: 'Late', nextReview: new Date(Date.now() - DAY).toISOString() }),
      item({ id: 'b:b', topic: 'Soon', nextReview: new Date(Date.now() + 4 * DAY).toISOString() }),
    ]);
    render(<SmartRevision />);
    expect(screen.getByRole('status')).toHaveTextContent('1 of 2 due now');
    expect(screen.getByText('A day late')).toBeInTheDocument();
  });

  test('says none are due rather than counting zero against a total', () => {
    store([item({})]);
    render(<SmartRevision />);
    expect(screen.getByRole('status')).toHaveTextContent('1 saved, none due right now');
  });

  test('filters to one subject', () => {
    store([
      item({ id: 'philosophy:stoicism' }),
      item({ id: 'physics:optics', subject: 'physics', topic: 'Optics' }),
    ]);
    render(<SmartRevision selectedSubject="philosophy" />);
    expect(screen.getByText('Stoicism')).toBeInTheDocument();
    expect(screen.queryByText('Optics')).not.toBeInTheDocument();
  });
});
