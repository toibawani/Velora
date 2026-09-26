import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import WordPuzzle from './WordPuzzle';

const fill = (...words) => {
  words.forEach((w, i) => {
    fireEvent.change(screen.getByLabelText(`Word ${i + 1}`), { target: { value: w } });
  });
};

const submit = () => fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));

describe('Word Puzzle', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('the right words score and move to the next puzzle', () => {
    render(<WordPuzzle onBack={() => {}} />);
    fill('black', 'hole');
    submit();
    expect(screen.getByText('Score: 100')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(1300));
    expect(screen.getByText('Puzzle 2/7')).toBeInTheDocument();
  });

  // The definition and the sentence said the same thing twice, and two of
  // those definitions were factually wrong.
  test('the duplicated definition line is gone', () => {
    render(<WordPuzzle onBack={() => {}} />);
    expect(screen.queryByText(/process of plant converting light to energy/i)).not.toBeInTheDocument();
  });

  // The bug this file is mostly about: the last puzzle had no ending, so
  // solving it scored and then nothing happened, and revealing it did the same.
  test('solving the last puzzle reaches an end screen', () => {
    render(<WordPuzzle onBack={() => {}} />);
    const answers = [
      ['black', 'hole'],
      ['photosynthesis'],
      ['catalyst'],
      ['event', 'horizon'],
      ['entropy'],
      ['lensing'],
      ['kinetic'],
    ];

    answers.forEach((words, i) => {
      fill(...words);
      submit();
      act(() => jest.advanceTimersByTime(1300));
      if (i === answers.length - 1) {
        expect(screen.getByRole('heading', { name: /finished/i })).toBeInTheDocument();
      }
    });

    expect(screen.getByText('700 points')).toBeInTheDocument();
    expect(screen.getByText(/worked out 7 of 7 unaided/i)).toBeInTheDocument();
  });

  // Revealing used to be a dead end: there was no way forward except getting
  // the answer right, and on the last puzzle there was no way at all.
  test('revealing every answer still reaches an end screen', () => {
    render(<WordPuzzle onBack={() => {}} />);
    for (let i = 0; i < 7; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /reveal answer/i }));
      act(() => jest.advanceTimersByTime(2700));
    }
    expect(screen.getByRole('heading', { name: /finished/i })).toBeInTheDocument();
    expect(screen.getByText(/0 of 7 correct/i)).toBeInTheDocument();
  });

  test('a wrong answer does not advance and does not score', () => {
    render(<WordPuzzle onBack={() => {}} />);
    fill('dark', 'matter');
    submit();

    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(screen.getByText(/not that/i)).toBeInTheDocument();
    expect(screen.getByText('Puzzle 1/7')).toBeInTheDocument();
  });

  test('the answer is matched regardless of case and spacing', () => {
    render(<WordPuzzle onBack={() => {}} />);
    fill('  BLACK ', 'hole  ');
    submit();
    expect(screen.getByText('Score: 100')).toBeInTheDocument();
  });

  test('a revealed answer is counted as revealed, not as worked out', () => {
    render(<WordPuzzle onBack={() => {}} />);
    for (let i = 0; i < 7; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /reveal answer/i }));
      act(() => jest.advanceTimersByTime(2700));
    }
    expect(screen.getByText(/0 of 7 correct, of which 7 were revealed/i)).toBeInTheDocument();
    expect(screen.getByText(/worked out 0 of 7 unaided/i)).toBeInTheDocument();
  });
});
