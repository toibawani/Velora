import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import DefinitionDuel, { DUEL_PAIRS } from './DefinitionDuel';

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

    // Answer every card in the deck, read from the data rather than a hardcoded
    // list, so growing the deck does not silently turn this into a test of the
    // first eight answers.
    DUEL_PAIRS.forEach((pair, i) => {
      answer(pair.word);
      if (i < DUEL_PAIRS.length - 1) act(() => jest.advanceTimersByTime(900));
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

describe('duel content breadth', () => {
  test('offers enough terms that one sitting is not the whole game', () => {
    expect(DUEL_PAIRS.length).toBeGreaterThanOrEqual(15);
  });

  test('no two definitions are the same sentence with different terms swapped', () => {
    const defs = DUEL_PAIRS.map((p) => p.definition.trim().toLowerCase());
    expect(new Set(defs).size).toBe(defs.length);
  });

  test('no term is guessed from a definition that also appears in another game', () => {
    // Three original definitions were copied verbatim from Concept Scrabble, so
    // playing both games gave the same three questions twice.
    const scrabble = fs.readFileSync(path.join(__dirname, 'ConceptScrabble.js'), 'utf8');
    DUEL_PAIRS.forEach((pair) => {
      const key = pair.definition.trim().replace(/^(a|an|the)\s+/i, '').toLowerCase();
      // Compare on the distinctive tail of the sentence rather than the whole
      // string, so a rewritten opening does not count as duplication.
      const tail = key.split(' ').slice(-4).join(' ');
      expect(scrabble.toLowerCase()).not.toContain(tail);
    });
  });

  test('spans more than physics, since the original was five space terms of eight', () => {
    const SPACE = ['black hole', 'singularity', 'event horizon', 'gravitational lensing', 'entropy'];
    const spaceCount = DUEL_PAIRS.filter((p) =>
      SPACE.includes(p.word.toLowerCase())
    ).length;
    expect(spaceCount).toBeLessThanOrEqual(2);
  });
});
