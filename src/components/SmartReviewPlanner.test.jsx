import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SmartReviewPlanner from './SmartReviewPlanner';
import { REVIEW_LADDER, completeReviewItem, getReviewItems } from '../utils/reviewPlanner';

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

describe('SmartReviewPlanner', () => {
  beforeEach(() => localStorage.clear());

  test('says when nothing is due rather than showing an empty box', () => {
    store([item({})]);
    render(<SmartReviewPlanner onNotify={() => {}} />);
    expect(screen.getByRole('status')).toHaveTextContent('Nothing is due right now');
    expect(screen.getByText(/in 2 days/i)).toBeInTheDocument();
  });

  test('separates due items from later ones', () => {
    store([
      item({ id: 'a:a', topic: 'Late one', nextReview: new Date(Date.now() - 3 * DAY).toISOString() }),
      item({ id: 'b:b', topic: 'Future one', nextReview: new Date(Date.now() + 9 * DAY).toISOString() }),
    ]);

    render(<SmartReviewPlanner onNotify={() => {}} />);

    expect(screen.getByText('Due now')).toBeInTheDocument();
    expect(screen.getByText('Later')).toBeInTheDocument();
    expect(screen.getByText('3 days late')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('1 due right now');
  });

  test('records a review and reports the real next gap', () => {
    store([item({ nextReview: new Date(Date.now() - DAY).toISOString() })]);
    const onNotify = jest.fn();
    render(<SmartReviewPlanner onNotify={onNotify} />);

    fireEvent.click(screen.getByRole('button', { name: /mark stoicism as reviewed/i }));

    const expected = REVIEW_LADDER[1];
    expect(onNotify).toHaveBeenCalledWith(
      `Review recorded. The next one is in ${expected} days.`,
      'success',
    );
    expect(getReviewItems()[0].reviews).toBe(1);
  });

  test('snoozing a due item moves it out of the due group without a review count', () => {
    store([item({ nextReview: new Date().toISOString() })]);
    render(<SmartReviewPlanner onNotify={() => {}} />);

    expect(screen.getByText('Due now')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /not today for stoicism/i }));

    expect(screen.queryByText('Due now')).not.toBeInTheDocument();
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
    expect(getReviewItems()[0].reviews).toBe(0);
  });

  test('only offers "Not today" on items that are actually due', () => {
    store([item({ nextReview: new Date(Date.now() + 5 * DAY).toISOString() })]);
    render(<SmartReviewPlanner onNotify={() => {}} />);
    expect(screen.queryByRole('button', { name: /not today/i })).not.toBeInTheDocument();
  });

  test('shows which step of the ladder each item is on', () => {
    store([
      item({ reviews: 2, nextReview: new Date(Date.now() + 4 * DAY).toISOString() }),
    ]);
    render(<SmartReviewPlanner onNotify={() => {}} />);
    expect(screen.getByText(new RegExp(`step 3 of ${REVIEW_LADDER.length}`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/2× reviewed/)).toBeInTheDocument();
  });

  test('filters by subject without losing the stored schedule', () => {
    store([
      item({ id: 'philosophy:stoicism', subject: 'philosophy' }),
      item({ id: 'physics:optics', subject: 'physics', topic: 'Optics' }),
    ]);
    const { rerender } = render(<SmartReviewPlanner selectedSubject="physics" onNotify={() => {}} />);
    expect(screen.getByText('Optics')).toBeInTheDocument();
    expect(screen.queryByText('Stoicism')).not.toBeInTheDocument();

    rerender(<SmartReviewPlanner selectedSubject={undefined} onNotify={() => {}} />);
    expect(screen.getByText('Stoicism')).toBeInTheDocument();
  });

  test('explains the whole ladder rather than one flat interval', () => {
    store([item({})]);
    render(<SmartReviewPlanner onNotify={() => {}} />);
    expect(screen.getByText(new RegExp(REVIEW_LADDER.join(', '), 'i'))).toBeInTheDocument();
  });

  test('completing through the planner keeps storage in step', () => {
    store([item({ nextReview: new Date().toISOString() })]);
    render(<SmartReviewPlanner onNotify={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /mark stoicism as reviewed/i }));

    const stored = JSON.parse(localStorage.getItem('velora_reviews')).data;
    expect(stored[0].reviews).toBe(1);
    expect(completeReviewItem('philosophy:stoicism')[0].reviews).toBe(2);
  });
});
