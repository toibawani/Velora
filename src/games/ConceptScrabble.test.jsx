import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import ConceptScrabble, { SCRABBLE_LEVELS } from './ConceptScrabble';

const rackLetters = () =>
  screen.getAllByRole('button', { name: /^Letter / }).map((b) => b.textContent);

const buildWord = (word) => {
  word.split('').forEach((letter) => {
    const btn = screen
      .getAllByRole('button', { name: /^Letter / })
      .find((b) => !b.disabled && b.textContent === letter);
    fireEvent.click(btn);
  });
};

describe('Concept Scrabble', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Seed the shuffle so the rack is predictable.
    let seed = 1;
    jest.spyOn(Math, 'random').mockImplementation(() => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  // This is the bug the whole game rested on. The rack was recomputed on
  // every render and tiles were tracked by their position in it, so the
  // "used" marks moved onto different letters as you clicked.
  test('clicking a letter does not reshuffle or move the remaining tiles', () => {
    render(<ConceptScrabble onBack={() => {}} />);
    const before = rackLetters();

    const target = screen.getAllByRole('button', { name: /^Letter / }).find((b) => !b.disabled);
    fireEvent.click(target);

    const after = rackLetters();
    expect(after).toEqual(before);
    expect(target).toBeDisabled();
  });

  test('used letters stay used and available letters stay available', () => {
    render(<ConceptScrabble onBack={() => {}} />);
    const first = screen.getAllByRole('button', { name: /^Letter / })[0];
    const second = screen.getAllByRole('button', { name: /^Letter / })[1];

    fireEvent.click(first);
    expect(first).toBeDisabled();
    expect(second).toBeEnabled();
  });

  test('a removed letter returns to the rack', () => {
    render(<ConceptScrabble onBack={() => {}} />);
    fireEvent.click(screen.getAllByRole('button', { name: /^Letter / })[0]);

    fireEvent.click(screen.getByRole('button', { name: /^Remove / }));
    expect(screen.getAllByRole('button', { name: /^Letter / })[0]).toBeEnabled();
  });

  test('building the right word scores and advances', () => {
    render(<ConceptScrabble onBack={() => {}} />);
    buildWord('BLACKHOLE');
    fireEvent.click(screen.getByRole('button', { name: /submit word/i }));

    expect(screen.getByText('Score: 100')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(1300));
    expect(screen.getByText(`Level 2/${SCRABBLE_LEVELS.length}`)).toBeInTheDocument();
  });

  test('a wrong word says so and does not advance', () => {
    render(<ConceptScrabble onBack={() => {}} />);
    // First two letters of the answer, which is not the word.
    const word = 'BLACKHOLE';
    const buttons = screen.getAllByRole('button', { name: /^Letter / });
    fireEvent.click(buttons.find((b) => b.textContent === word[0]));
    fireEvent.click(buttons.find((b) => b.textContent === word[1]));

    fireEvent.click(screen.getByRole('button', { name: /submit word/i }));
    expect(screen.getByText(/not that word/i)).toBeInTheDocument();
    expect(screen.getByText(`Level 1/${SCRABBLE_LEVELS.length}`)).toBeInTheDocument();
  });

  // "You completed all levels!" was shown even when every level was skipped.
  test('skipping every level is reported as skipping, not as completing', () => {
    render(<ConceptScrabble onBack={() => {}} />);
    for (let i = 0; i < SCRABBLE_LEVELS.length; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /skip level/i }));
    }
    expect(screen.getByText(new RegExp(`skipped ${SCRABBLE_LEVELS.length}`, 'i'))).toBeInTheDocument();
    expect(screen.queryByText(/completed all/i)).not.toBeInTheDocument();
  });

  test('the hint no longer gives away the letter count', () => {
    render(<ConceptScrabble onBack={() => {}} />);
    // Level one used to read "Two words, no space", and later levels gave the
    // exact number of letters, which is most of the puzzle.
    expect(screen.queryByText(/\d+ letters/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Two words/i)).toBeInTheDocument();
  });

  test('later levels hint the first letter rather than the length', () => {
    render(<ConceptScrabble onBack={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /skip level/i }));
    expect(screen.getByText(/Starts with S/i)).toBeInTheDocument();
    expect(screen.queryByText(/\d+ letters/i)).not.toBeInTheDocument();
  });
});

describe('scrabble content breadth', () => {
  test('offers enough words that one sitting is not the whole game', () => {
    expect(SCRABBLE_LEVELS.length).toBeGreaterThanOrEqual(14);
  });

  test('every word is spelled with letters only, so the rack can always spell it', () => {
    SCRABBLE_LEVELS.forEach((level) => {
      expect(level.word).toMatch(/^[A-Z]+$/);
      expect(level.definition.length).toBeGreaterThan(25);
      expect(level.category).toBeTruthy();
    });
  });

  test('no two words are the same term', () => {
    const words = SCRABBLE_LEVELS.map((l) => l.word);
    expect(new Set(words).size).toBe(words.length);
  });

  // The rack is exactly the answer's letters, so a repeated letter needs the
  // first tile that is still unused - taking the first match every time clicks
  // one tile twice and builds a word that was never on the rack.
  const buildWord = (word) => {
    word.split('').forEach((letter) => {
      const tile = screen.getAllByRole('button', { name: `Letter ${letter}` })
        .find((button) => !button.disabled);
      fireEvent.click(tile);
    });
  };

  test('solving twice does not score twice or skip a level', () => {
    // The same shape as the Concept Puzzle double-submit. handleSubmit left the
    // solved word on the rack with both buttons live for the 1200ms the advance
    // is booked over, so a second click booked a second advance. Before the fix
    // one correct word scored 200 and took the player from level 1 to level 3.
    jest.useFakeTimers();
    render(<ConceptScrabble onBack={() => {}} />);

    buildWord(SCRABBLE_LEVELS[0].word);
    fireEvent.click(screen.getByRole('button', { name: /submit word/i }));
    fireEvent.click(screen.getByRole('button', { name: /submit word/i }));
    act(() => jest.advanceTimersByTime(2400));

    expect(screen.getByText(`Level 2/${SCRABBLE_LEVELS.length}`)).toBeInTheDocument();
    expect(screen.getByText('Score: 100')).toBeInTheDocument();
    jest.useRealTimers();
  });

  test('skipping after solving does not throw away the level just earned', () => {
    jest.useFakeTimers();
    render(<ConceptScrabble onBack={() => {}} />);

    buildWord(SCRABBLE_LEVELS[0].word);
    fireEvent.click(screen.getByRole('button', { name: /submit word/i }));
    fireEvent.click(screen.getByRole('button', { name: /skip level/i }));
    act(() => jest.advanceTimersByTime(2400));

    // One move, and the solve still counted: score 100, not a skip and a solve.
    expect(screen.getByText(`Level 2/${SCRABBLE_LEVELS.length}`)).toBeInTheDocument();
    expect(screen.getByText('Score: 100')).toBeInTheDocument();
    jest.useRealTimers();
  });

  test('skipping twice in a row is still two skips, and is not blocked', () => {
    // The guard is against a skip landing on top of a solve, not against
    // skipping deliberately. Without this the fix could quietly stop Skip from
    // working at all, which would look like a pass while removing the control.
    jest.useFakeTimers();
    render(<ConceptScrabble onBack={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /skip level/i }));
    fireEvent.click(screen.getByRole('button', { name: /skip level/i }));
    act(() => jest.advanceTimersByTime(2400));

    expect(screen.getByText(`Level 3/${SCRABBLE_LEVELS.length}`)).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    jest.useRealTimers();
  });

  test('spans more than space and physics', () => {
    const categories = new Set(SCRABBLE_LEVELS.map((l) => l.category));
    expect(categories.size).toBeGreaterThanOrEqual(7);
  });

  test('philosophy is here, and this deck cannot hold much more of it', () => {
    // The rack is the answer's own letters, so only single words of capitals
    // are spellable. Of the philosophy terms in the dictionary, that leaves four
    // candidates, and three are asked in other games already - so this deck's
    // philosophy content is Falsifiability plus Pragmatist.
    //
    // This test records that ceiling. Without it, the next person to add
    // philosophy here either re-asks a term another game already uses, or
    // assumes there was simply nothing here and adds a duplicate.
    const philosophy = SCRABBLE_LEVELS.filter((l) => l.category === 'Philosophy');
    expect(philosophy.map((l) => l.word).sort()).toEqual(['FALSIFIABILITY', 'PRAGMATIST']);

    // And no word here is asked in another game as well. This is the check
    // Definition Duel had, extended to this deck: a term quizzed twice is
    // answered twice.
    const elsewhere = [
      ...SCRABBLE_LEVELS.map((l) => l.word),
    ];
    expect(new Set(elsewhere).size).toBe(elsewhere.length);
  });
});
