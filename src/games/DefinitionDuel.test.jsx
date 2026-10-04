import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DefinitionDuel, { DUEL_PAIRS } from './DefinitionDuel';
import { SCRABBLE_LEVELS } from './ConceptScrabble';
import { PHILOSOPHY_LEVELS } from '../data/philosophy';

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

  // These three used to hardcode "Black Hole", which was in the deck when they
  // were written and is not any more. They read the first card from the data
  // instead, so growing or reshuffling the deck cannot quietly break them.
  const firstWord = DUEL_PAIRS[0].word;

  test('the answer is accepted regardless of case and trailing punctuation', () => {
    render(<DefinitionDuel onBack={() => {}} />);
    answer(`${firstWord.toLowerCase()}.`);
    expect(screen.getByText('Score: 10')).toBeInTheDocument();
  });

  test('a wrong answer says what the answer actually was', () => {
    render(<DefinitionDuel onBack={() => {}} />);
    answer('sunspot');
    expect(screen.getByText(new RegExp(`the answer was ${firstWord}`, 'i'))).toBeInTheDocument();
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
    answer(firstWord);
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
    fireEvent.change(input, { target: { value: firstWord } });
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

  test('no term appears in this game and in Concept Scrabble at once', () => {
    // Three original definitions were copied verbatim from Concept Scrabble, so
    // playing both games gave the same three questions twice. The rule is that
    // the same term is not quizzed twice in different games -- the wording does
    // not have to differ, the term must not recur.
    //
    // The key used to strip every character that was not an uppercase letter.
    // Concept Scrabble writes its terms in capitals, so its words survived that
    // intact while every title-case word here was reduced to its initials:
    // "Falsifiability" became "F". Seven terms were in both decks - Black Hole,
    // Photosynthesis, Catalyst, Regression, Confirmation Bias, Market Equilibrium
    // and Falsifiability - and this test could not see one of them. Case is
    // folded out first now, then anything that is not a letter is dropped, so
    // "Black Hole" and "BLACK HOLE" are the same key.
    const key = (term) => term.toUpperCase().replace(/[^A-Z]/g, '');
    const scrabbleWords = new Set(SCRABBLE_LEVELS.map((level) => key(level.word)));
    const overlap = DUEL_PAIRS.filter((pair) => scrabbleWords.has(key(pair.word)));
    expect(overlap.map((p) => p.word)).toEqual([]);
  });

  test('the philosophy terms here are the philosophy entries, not lookalikes', () => {
    // A subject with eleven lessons had a game that never mentioned it. These
    // ten terms are the terms the levels are actually written under, so a reader
    // who has read "Free Will" meets the same idea here rather than a paraphrase.
    // Reading the real entries rather than a copy means the two cannot drift.
    const entryNames = PHILOSOPHY_LEVELS.flatMap((level) =>
      (level.entries ?? []).map((entry) => entry.name)
    );
    const duelWords = DUEL_PAIRS.map((pair) => pair.word);
    const PHILOSOPHY_DUEL_TERMS = [
      'Reality', 'Existence', 'Knowledge', 'Skepticism', 'Morality',
      'Consequentialism', 'Identity', 'Consciousness', 'Free Will', 'Determinism',
    ];

    PHILOSOPHY_DUEL_TERMS.forEach((term) => {
      expect(entryNames).toContain(term);
      expect(duelWords).toContain(term);
    });
    // And no clue gives its own answer away, which is the whole point of a clue.
    DUEL_PAIRS.forEach((pair) => {
      const firstWord = pair.word.split(' ')[0].toUpperCase();
      expect(pair.definition.toUpperCase()).not.toContain(` ${firstWord} `);
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
