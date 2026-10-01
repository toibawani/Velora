import React from 'react';
import { render, screen } from '@testing-library/react';
import Journey from './Journey';
import { recordStudySession } from '../utils/analyticsStorage';

beforeEach(() => localStorage.clear());

// This screen used to render five achievements - relativistic spacetime at 94,
// event horizons at 88 - for every learner who opened it, including someone who
// had never opened a lesson. Those strings are asserted absent so they cannot
// come back as placeholder content.
test('says what belongs here instead of showing milestones nobody earned', () => {
  render(<Journey setScreen={jest.fn()} />);

  expect(screen.getByText(/Nothing recorded yet/i)).toBeInTheDocument();
  expect(screen.queryByText(/Relativistic Spacetime/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Hawking Radiation/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Mastery:/i)).not.toBeInTheDocument();
});

test('lists the topics whose sessions were actually recorded', () => {
  recordStudySession('Bayesian Updating', 30, 'philosophy');
  recordStudySession('Plate Tectonics', 90, 'biology');

  render(<Journey setScreen={jest.fn()} />);

  expect(screen.getByText('Plate Tectonics')).toBeInTheDocument();
  expect(screen.getByText('Bayesian Updating')).toBeInTheDocument();
  expect(screen.getByText('2 hours recorded')).toBeInTheDocument();
  expect(screen.getByText('1.5 hours recorded')).toBeInTheDocument();
});

test('orders the timeline by where the time went', () => {
  recordStudySession('Small Topic', 10, 'physics');
  recordStudySession('Long Topic', 120, 'physics');

  render(<Journey setScreen={jest.fn()} />);

  const titles = Array.from(document.querySelectorAll('.milestone-topic-title')).map((node) => node.textContent);
  expect(titles).toEqual(['Long Topic', 'Small Topic']);
});
