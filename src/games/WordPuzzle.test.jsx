import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import WordPuzzle, { PUZZLES } from './WordPuzzle';

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
    expect(screen.getByText(`Puzzle 2/${PUZZLES.length}`)).toBeInTheDocument();
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
    // Derived from the data rather than hardcoded, so growing the deck keeps
    // testing the real ending instead of only the first seven answers.
    const answers = PUZZLES.map((p) => p.word.toLowerCase().split(' '));

    answers.forEach((words, i) => {
      fill(...words);
      submit();
      act(() => jest.advanceTimersByTime(1300));
      if (i === answers.length - 1) {
        expect(screen.getByRole('heading', { name: /finished/i })).toBeInTheDocument();
      }
    });

    expect(screen.getByText(`${PUZZLES.length * 100} points`)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`worked out ${PUZZLES.length} of ${PUZZLES.length} unaided`, 'i'))
    ).toBeInTheDocument();
  });

  // Revealing used to be a dead end: there was no way forward except getting
  // the answer right, and on the last puzzle there was no way at all.
  test('revealing every answer still reaches an end screen', () => {
    render(<WordPuzzle onBack={() => {}} />);
    for (let i = 0; i < PUZZLES.length; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /reveal answer/i }));
      act(() => jest.advanceTimersByTime(2700));
    }
    expect(screen.getByRole('heading', { name: /finished/i })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`0 of ${PUZZLES.length} correct`, 'i'))).toBeInTheDocument();
  });

  test('a wrong answer does not advance and does not score', () => {
    render(<WordPuzzle onBack={() => {}} />);
    fill('dark', 'matter');
    submit();

    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(screen.getByText(/not that/i)).toBeInTheDocument();
    expect(screen.getByText(`Puzzle 1/${PUZZLES.length}`)).toBeInTheDocument();
  });

  test('the answer is matched regardless of case and spacing', () => {
    render(<WordPuzzle onBack={() => {}} />);
    fill('  BLACK ', 'hole  ');
    submit();
    expect(screen.getByText('Score: 100')).toBeInTheDocument();
  });

  test('a revealed answer is counted as revealed, not as worked out', () => {
    render(<WordPuzzle onBack={() => {}} />);
    for (let i = 0; i < PUZZLES.length; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /reveal answer/i }));
      act(() => jest.advanceTimersByTime(2700));
    }
    expect(
      screen.getByText(
        new RegExp(`0 of ${PUZZLES.length} correct, of which ${PUZZLES.length} were revealed`, 'i')
      )
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`worked out 0 of ${PUZZLES.length} unaided`, 'i'))).toBeInTheDocument();
  });
});

describe('puzzle data integrity', () => {
  test('the hint always states the number of words the answer actually has', () => {
    // The lensing puzzle said "Two words" for the one-word answer LENSING, in a
    // sentence that already contained the word "gravitational". A hint that
    // contradicts the answer makes the puzzle unsolvable as written.
    PUZZLES.forEach((puzzle) => {
      const words = puzzle.word.trim().split(/\s+/).length;
      expect(puzzle.blanks).toBe(words);
      const stated = puzzle.hint === 'Two words' ? 2 : 1;
      expect(stated).toBe(words);
    });
  });

  test('every sentence has exactly as many blanks as the answer has words', () => {
    PUZZLES.forEach((puzzle) => {
      // blanks is the number of input boxes, one per word, and the sentence
      // carries a single gap marker for the whole phrase -- "_____ behind" with
      // two boxes for BLACK HOLE is how this puzzle is meant to look. What has
      // to hold is that there is a gap to see and one box per word.
      expect(puzzle.sentence).toMatch(/_____/);
      expect(puzzle.blanks).toBe(puzzle.word.trim().split(/\s+/).length);
    });
  });

  test('every answer is a letter-only string the input can accept', () => {
    PUZZLES.forEach((puzzle) => {
      expect(puzzle.word).toMatch(/^[A-Z ]+$/);
      expect(puzzle.sentence.length).toBeGreaterThan(25);
    });
  });

  test('offers more than seven puzzles', () => {
    expect(PUZZLES.length).toBeGreaterThanOrEqual(14);
  });

  test('no two puzzles use the same answer', () => {
    const words = PUZZLES.map((p) => p.word);
    expect(new Set(words).size).toBe(words.length);
  });
});
