import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Community from './Community';

const open = () => render(<Community setScreen={jest.fn()} />);

beforeEach(() => localStorage.clear());

test('the fabricated community is not recoverable from the screen', () => {
  const { container } = open();
  const text = container.textContent;

  // Every phrase here was printed as fact by the old discussion feed: invented
  // handles, invented vote counts, invented rooms and a report button that
  // reported to nobody. Velora has no server, so none of it can be true.
  [
    /Scholar_\d/i,
    /RelativityTutor|DialecticMind/i,
    /Verified Mentor/i,
    /active now/i,
    /\bmembers?\b/i,
    /Report for safety review/i,
    /\bvotes?\b/i,
    /\bupvote/i,
  ].forEach((pattern) => expect(text).not.toMatch(pattern));
});

test('an untouched desk says so rather than showing something made up', () => {
  open();

  expect(screen.getByText('Question Desk')).toBeInTheDocument();
  expect(screen.getByText('No questions yet')).toBeInTheDocument();
  expect(screen.getByText('Saved on this device')).toBeInTheDocument();
});

test('a question the learner writes is kept and comes back with its notes', () => {
  open();
  const asked = 'Why does the horizon trap light past the limit?';

  fireEvent.change(screen.getByPlaceholderText(/What is actually confusing you/i), {
    target: { value: asked },
  });
  fireEvent.click(screen.getByRole('button', { name: /Keep this question/i }));

  expect(screen.getByText(asked)).toBeInTheDocument();
  expect(screen.queryByText('No questions yet')).not.toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText(/Add a note/i), {
    target: { value: 'Because the coordinates stop meaning anything there.' },
  });
  fireEvent.click(screen.getByRole('button', { name: /^Add note$/i }));

  expect(screen.getByText('Because the coordinates stop meaning anything there.')).toBeInTheDocument();
});

test('an empty submission is refused with a reason rather than stored', () => {
  open();

  fireEvent.click(screen.getByRole('button', { name: /Keep this question/i }));

  expect(screen.getByText(/at least 15 characters/i)).toBeInTheDocument();
  expect(screen.getByText('No questions yet')).toBeInTheDocument();
});

test('a draft below the length floor cannot be submitted at all', () => {
  open();

  fireEvent.change(screen.getByPlaceholderText(/What is actually confusing you/i), {
    target: { value: 'why?' },
  });

  // The button is disabled while the draft is under the floor, so the character
  // count already tells the learner what is missing before they try.
  expect(screen.getByRole('button', { name: /Keep this question/i })).toBeDisabled();
});

