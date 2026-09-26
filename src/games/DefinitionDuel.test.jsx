import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DefinitionDuel from './DefinitionDuel';

const answer = (text) => {
  fireEvent.change(screen.getByLabelText(/type the term/i), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: /^submit$/i }));
};

describe('Definition Duel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T12:00:00Z'));
  });
  afterEach(() => jest.useRealTimers());

  test('the answer is accepted regardless of case and trailing punctuation', () => {
    render(<DefinitionDuel onBack={() => {}} />);
    answer('black hole.');
    expect(screen.getByText('Score: 10')).toBeInTheDocument();
  });

  test('a wrong answer says what the answer actually was', () => {
    render(<DefinitionDuel onBack={() => {}} />);
    answer('sunspot');
    expect(screen.getByText(/the answer was Black Hole/i)).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });

  // The old end screen said "Time's Up!" whether or not time was up.
  test('finishing every card is not reported as running out of time', () => {
    render(<DefinitionDuel onBack={() => {}} />);

    const answers = [
      'Black Hole', 'Singularity', 'Photosynthesis', 'Catalyst',
      'Entropy', 'Gravitational Lensing', 'Event Horizon', 'Predator',
    ];
    answers.forEach((word, i) => {
      answer(word);
      if (i < answers.length - 1) act(() => jest.advanceTimersByTime(900));
    });

    expect(screen.getByText(/all cards done/i)).toBeInTheDocument();
    expect(screen.queryByText(/time'?s up/i)).not.toBeInTheDocument();
  });

  // Accuracy used to divide by every card in the deck, so answering three
  // out of three correctly reported 37 percent.
  test('accuracy is measured against what was attempted, not the whole deck', () => {
    render(<DefinitionDuel onBack={() => {}} />);
    answer('Black Hole');
    act(() => jest.advanceTimersByTime(900));
    answer('nonsense');
    act(() => jest.advanceTimersByTime(61_000));

    // One of two attempted was right, which is 50 percent. The old code
    // divided by all eight cards, so this read as 12 percent.
    expect(screen.getByText(/50% of the 2 you attempted/i)).toBeInTheDocument();
  });

  test('the clock is real time, not a second per tick', () => {
    render(<DefinitionDuel onBack={() => {}} />);
    expect(screen.getByText('60s')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(10_000));
    expect(screen.getByText('50s')).toBeInTheDocument();
  });

  test('running out of time ends the round', () => {
    render(<DefinitionDuel onBack={() => {}} />);
    act(() => jest.advanceTimersByTime(61_000));
    expect(screen.getByText(/time'?s up/i)).toBeInTheDocument();
  });

  test('a round with no answers does not claim zero percent accuracy', () => {
    render(<DefinitionDuel onBack={() => {}} />);
    act(() => jest.advanceTimersByTime(61_000));
    expect(screen.getByText(/no answers attempted/i)).toBeInTheDocument();
  });

  test('submitting on Enter works', () => {
    render(<DefinitionDuel onBack={() => {}} />);
    const input = screen.getByLabelText(/type the term/i);
    fireEvent.change(input, { target: { value: 'Black Hole' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Score: 10')).toBeInTheDocument();
  });
});
