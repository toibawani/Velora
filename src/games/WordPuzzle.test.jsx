import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import WordPuzzle, { PUZZLES } from './WordPuzzle';
import { SCRABBLE_LEVELS } from './ConceptScrabble';
import { CURIOUS_TERMS } from '../data/dictionary';

// Read from the dictionary so the cross-game test identifies the philosophy
// answers by where they came from rather than by a list repeated here.
// Every answer in this deck is stored in capitals because the input only
// accepts letters, so the dictionary is folded to match before comparing.
const dictionaryTermNames = CURIOUS_TERMS.map((t) => t.term.toUpperCase());

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
  test('the philosophy answers are the dictionary\'s own terms, not new coinages', () => {
    // Six philosophy answers now sit in a deck that had none. They are read from
    // the dictionary rather than copied here, so an answer that drifts away from
    // the entry it is drawn from fails this instead of quietly becoming a
    // different claim.
    // EVENT HORIZON and ENTROPY are dictionary terms too, so the count is
    // taken from the sentences rather than assumed: these are the puzzles whose
    // text names a philosopher, an argument, or a field of philosophy.
    const PHILOSOPHY_ANSWERS = PUZZLES
      .map((p) => p.word)
      .filter((w) => dictionaryTermNames.includes(w) && /Kant|Rawls|Foot|philosophy|knower/.test(
        PUZZLES.find((p) => p.word === w).sentence
      ));
    expect(PHILOSOPHY_ANSWERS.sort()).toEqual([
      'CATEGORICAL IMPERATIVE', 'EPISTEMOLOGY', 'PRAGMATISM',
      'TROLLEY PROBLEM', 'VEIL OF IGNORANCE', 'VIRTUE ETHICS',
    ]);

    // Folded to capitals for the same reason as above: the deck stores answers
    // uppercase and the dictionary stores them in title case, and comparing
    // them case-sensitively failed on all six.
    const dictionaryTerms = CURIOUS_TERMS
      .filter((t) => t.subject === 'philosophy')
      .map((t) => t.term.toUpperCase());
    PHILOSOPHY_ANSWERS.forEach((answer) => {
      expect(dictionaryTerms).toContain(answer);
    });

    // And each sentence names the thing it is about, so a reader who cannot
    // place the term has a handle to search on.
    const philosophy = PUZZLES.filter((p) => PHILOSOPHY_ANSWERS.includes(p.word));
    expect(philosophy.some((p) => /Kant/i.test(p.sentence))).toBe(true);
    expect(philosophy.some((p) => /Rawls/i.test(p.sentence))).toBe(true);
    expect(philosophy.some((p) => /Foot|1967/.test(p.sentence))).toBe(true);
  });

  test('no philosophy answer is asked twice across the two word games', () => {
    // Concept Scrabble spells a term from a rack of letters; this game fills it
    // into a sentence. Asking the reader for the same term in both is not a
    // different question, it is the same question twice - which is exactly what
    // the Definition Duel and Scrabble overlap was, seven terms in two decks.
    //
    // Scoped to the philosophy answers added here. The six science answers the
    // two decks already shared predate this change and are a content decision
    // rather than a bug, so they are asserted below as a known list instead of
    // being silently allowed through by a loose filter.
    const scrabbleKeys = SCRABBLE_LEVELS.map((l) => l.word.replace(/\s+/g, ''));
    const philosophy = PUZZLES.filter((p) => /Kant|Rawls|Foot|philosophy|knower/.test(p.sentence));

    const key = (w) => w.replace(/\s+/g, '');
    expect(philosophy.length).toBeGreaterThanOrEqual(6);
    philosophy.forEach((puzzle) => {
      expect(scrabbleKeys).not.toContain(key(puzzle.word));
    });

    // The pre-existing overlap, pinned so it is visible and so that adding a
    // seventh shared answer cannot slip past unnoticed.
    // Scrabble stores its words with no spaces, so the comparison folds them
    // rather than listing two spellings of the same term.
    const shared = PUZZLES
      .map((p) => p.word)
      .filter((w) => scrabbleKeys.includes(key(w)))
      .sort();
    expect(shared).toEqual([
      'BLACK HOLE', 'CATALYST', 'ENTROPY', 'EVENT HORIZON', 'LENSING', 'PHOTOSYNTHESIS',
    ]);
  });

  test('the hint always states the number of words the answer actually has', () => {
    // The lensing puzzle said "Two words" for the one-word answer LENSING, in a
    // sentence that already contained the word "gravitational". A hint that
    // contradicts the answer makes the puzzle unsolvable as written.
    PUZZLES.forEach((puzzle) => {
      const words = puzzle.word.trim().split(/\s+/).length;
      expect(puzzle.blanks).toBe(words);
      // The hint text is parsed, not pattern-matched to 1 and 2.
      //
      // It read `puzzle.hint === 'Two words' ? 2 : 1`, so anything that was not
      // exactly "Two words" counted as one word. The first three-word answer in
      // this deck made that visible: VEIL OF IGNORANCE states "Three words" and
      // the test read it as 1. Every future multi-word answer beyond two would
      // have failed the same way, and the deck could not grow past two words
      // without the test lying about it.
      const WORD_NUMBERS = {
        one: 1, two: 2, three: 3, four: 4, five: 5,
        six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      };
      const m = /^(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten)\b/.exec(puzzle.hint);
      // A hint that does not start with a number word is itself the failure, so
      // assert the shape before reading it rather than getting NaN.
      expect(m).not.toBeNull();
      const stated = WORD_NUMBERS[m[1].toLowerCase()];
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
