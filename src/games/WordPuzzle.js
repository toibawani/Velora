import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { recordGameResult } from '../utils/gameResults';
import '../styles/GameStyles.css';

/** The id this game is filed under, in stored results and in the hub's list. */
export const WORD_PUZZLE_GAME_ID = 'puzzle';

/**
 * The last puzzle had no ending. handleSubmit advanced to the next puzzle only
 * when currentPuzzle was not the last one, so solving the fifth one scored 100
 * points, said "Correct! Excellent!" and then did nothing, and so did
 * revealing it. There was no end screen at all. It has one now, and it says
 * how many you worked out unaided.
 *
 * The definitions were also showing the same information as the sentence
 * directly above them, and two of them were wrong in the same way as the
 * copies in the other games: photosynthesis turns light energy into chemical
 * energy, and entropy counts arrangements rather than disorder.
 */
const PUZZLES = [
  {
    hint: 'Two words',
    sentence: 'A massive star that collapses can leave a _____ behind.',
    word: 'BLACK HOLE',
    blanks: 2,
  },
  {
    hint: 'One word',
    sentence: 'Plants use _____ to turn sunlight into sugar.',
    word: 'PHOTOSYNTHESIS',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'A substance that speeds up a reaction without being used up is a _____.',
    word: 'CATALYST',
    blanks: 1,
  },
  {
    hint: 'Two words',
    sentence: 'Nothing that crosses the _____ of a black hole ever comes back out.',
    word: 'EVENT HORIZON',
    blanks: 2,
  },
  {
    hint: 'One word',
    sentence: 'In an isolated system, _____ tends to increase over time.',
    word: 'ENTROPY',
    blanks: 1,
  },
  {
    // The hint said "Two words" for a one-word answer. The sentence already
    // contains the word "gravitational", so the blank is the second half of the
    // phrase and is one word long.
    hint: 'One word',
    sentence: 'Gravity bends light, and the result is called gravitational _____.',
    word: 'LENSING',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'The energy an object has because it is moving is called _____ energy.',
    word: 'KINETIC',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'The chemical bond in which one atom takes electrons away from another is _____ bonding.',
    word: 'IONIC',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'The splitting of one heavy nucleus into lighter ones, releasing energy, is called nuclear _____.',
    word: 'FISSION',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'The change of a gas into liquid happens when it is _____.',
    word: 'CONDENSED',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'The outward push of a fluid on a surface is called _____ pressure.',
    word: 'BLOOD',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'The transfer of heat through a solid, metal or empty space with no movement of the substance itself, is _____ conduction.',
    word: 'THERMAL',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'In statistics, a chance result you would still expect to see fairly often is called _____.',
    word: 'FLUKE',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Everyone who takes the same wrong medicine gets sick, but the fever spreading person to person is a _____.',
    word: 'CONTAGION',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'A claim with no evidence and no interest in whether it is true is a _____.',
    word: 'FABRICATION',
    blanks: 1,
  },

  // Philosophy.
  //
  // The deck had none, in a subject with eleven lessons and thirteen dictionary
  // entries. These are the dictionary's own terms rather than new coinages, and
  // none of them is an answer Concept Scrabble already uses: the two decks share
  // six science words today (a pre-existing overlap, tracked separately), and a
  // reader who spelled a term in one game should not be asked to fill it in
  // again in the other.
  {
    hint: 'Two words',
    sentence: 'Kant held that some acts are right in themselves and would be right however everyone chose them, which is the _____ imperative.',
    word: 'CATEGORICAL IMPERATIVE',
    blanks: 2,
  },
  {
    hint: 'Three words',
    sentence: 'Rawls said to choose the principles of justice before knowing what position you would end up in, behind the _____ of ignorance.',
    word: 'VEIL OF IGNORANCE',
    blanks: 3,
  },
  {
    hint: 'Two words',
    sentence: 'In philosophy, judging a person by the character they have built over a whole life rather than by any single act is the _____ approach.',
    word: 'VIRTUE ETHICS',
    blanks: 2,
  },
  {
    hint: 'One word',
    sentence: 'The branch of philosophy that asks what knowledge is, and how anyone could ever get any, is _____.',
    word: 'EPISTEMOLOGY',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'In philosophy, holding that a belief is true when it works well in practice rather than because it matches reality is called _____.',
    word: 'PRAGMATISM',
    blanks: 1,
  },
  {
    hint: 'Two words',
    sentence: 'Philippa Foot built the _____ in 1967 to show that an argument against killing could not stay as tidy as it claimed.',
    word: 'TROLLEY PROBLEM',
    blanks: 2,
  },

  // Economics, statistics, politics, psychology and biology.
  //
  // The deck was nineteen sentences, twelve of them physics, chemistry or
  // space, in an app whose dictionary covers eleven fields. None of these
  // repeats a Concept Scrabble answer, which the deck's own test pins as a
  // closed list rather than a habit.
  {
    hint: 'Two words',
    sentence: 'The real cost of a choice is the _____: the value of the best thing you gave up to make it.',
    word: 'OPPORTUNITY COST',
    blanks: 2,
  },
  {
    hint: 'One word',
    sentence: 'A factory that fouls a river nobody it sells to owns is imposing a negative _____.',
    word: 'EXTERNALITY',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'When the price of a good rises, the quantity firms are willing to sell rises, which is the law of _____.',
    word: 'SUPPLY',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'A poll of two thousand people drawn at random is a _____, and its mean is an estimate of the whole population.',
    word: 'SAMPLE',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Two things moving together is a correlation; claiming one produced the other is a claim of _____, which the correlation alone cannot support.',
    word: 'CAUSATION',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Drawing district boundaries so a minority of votes wins a majority of seats is called _____.',
    word: 'GERRYMANDERING',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Dividing power between a national government and regional ones, each sovereign in its own sphere, is _____.',
    word: 'FEDERALISM',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Training a response by pairing a stimulus with a reward or a punishment is called _____.',
    word: 'CONDITIONING',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'A sugar pill that relieves pain because the patient expects it to is a _____.',
    word: 'PLACEBO',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Perfume crossing a room and settling into the air with no current to carry it has spread by _____.',
    word: 'DIFFUSION',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Water crosses a membrane towards the side with more dissolved solute, which is _____.',
    word: 'OSMOSIS',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Chemical marks on DNA that switch genes on or off without changing the sequence are studied in _____.',
    word: 'EPIGENETICS',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Driving a current through a salt solution to split it into its elements is _____.',
    word: 'ELECTROLYSIS',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Two atoms of the same element with different numbers of neutrons are _____ of each other.',
    word: 'ISOTOPES',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'A body in motion stays in motion unless a force acts on it, which is the law of _____.',
    word: 'INERTIA',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'A straw looks bent in a glass of water because light changes direction on entering it, which is _____.',
    word: 'REFRACTION',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Paying a professional to argue your case to a legislator, rather than writing to them yourself, is _____.',
    word: 'LOBBYING',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'A country run by a small group that holds power through wealth or the army is an _____.',
    word: 'OLIGARCHY',
    blanks: 1,
  },
  {
    hint: 'One word',
    sentence: 'Letting the first figure in a negotiation set the range for every figure after it is _____.',
    word: 'ANCHORING',
    blanks: 1,
  },
  {
    hint: 'Two words',
    sentence: 'A policy that benefits everyone a little and costs a small group a great deal leaves a _____ _____ that no one pays for by choice.',
    word: 'DEADWEIGHT LOSS',
    blanks: 2,
  },
];

const POINTS_PER_PUZZLE = 100;

const normalise = (text) => text.trim().toUpperCase().replace(/\s+/g, ' ');

WordPuzzle.propTypes = { onBack: PropTypes.func };

function WordPuzzle({ onBack }) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [userAnswers, setUserAnswers] = useState(() => Array(PUZZLES[0].blanks).fill(''));
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(0);
  // Counted as they happen. Subtracting reveals from a solved total gave a
  // negative number when you revealed everything, which is what the first
  // version of this did.
  const [unaided, setUnaided] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  // Which puzzles were given up on, so the end screen can quote the sentence and
  // the answer back. "3 were revealed" is a score line; the three sentences are
  // the part someone can reread.
  const [missed, setMissed] = useState([]);
  const [message, setMessage] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  // True once this puzzle has been settled - solved or revealed - and the move
  // to the next one is already booked.
  //
  // This was missing, and every path through it was a double-count. Solving a
  // puzzle leaves the word in the boxes and the Submit button enabled, so a
  // second click inside the 1200ms advance window booked a second advance: one
  // correct answer scored 200 and skipped a puzzle, and the score line then
  // claimed a total the player could not earn by playing the deck. Reveal has
  // the same shape. Neither needs a deliberate mistake to trigger - it is
  // anyone tapping twice, or anyone on a connection where the click lands after
  // the animation.
  const [settled, setSettled] = useState(false);
  const advanceRef = useRef(null);
  const firstInputRef = useRef(null);
  // The round is reported once per pass through the deck. Recorded in an effect
  // on the end screen rather than at the moment the last puzzle was answered,
  // because the score is state and the final 100 points are only in it after
  // the re-render - reading it any earlier would understate the round by the one
  // puzzle that finished it.
  const recordedRef = useRef(false);

  useEffect(() => {
    if (!finished) {
      recordedRef.current = false;
      return;
    }
    if (recordedRef.current) return;
    recordedRef.current = true;
    recordGameResult(WORD_PUZZLE_GAME_ID, {
      score,
      max: PUZZLES.length * POINTS_PER_PUZZLE,
    });
  }, [finished, score]);

  /*
   * The first box is focused when the puzzle appears.
   *
   * Nothing was focused, so every puzzle in a sixteen puzzle deck began with a
   * click into a text box before a single letter could be typed - and the box
   * sits below the sentence the player is reading, so the pointer had to travel
   * there and back on each one. Focus is moved only when the puzzle changes, so
   * it cannot pull the cursor out of a box being typed into.
   */
  useEffect(() => {
    firstInputRef.current?.focus();
  }, [currentPuzzle]);

  const puzzle = PUZZLES[currentPuzzle];
  const isLast = currentPuzzle === PUZZLES.length - 1;

  useEffect(() => () => clearTimeout(advanceRef.current), []);

  const goToNext = useCallback(() => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrentPuzzle((prev) => prev + 1);
    setUserAnswers(() => Array(PUZZLES[currentPuzzle + 1].blanks).fill(''));
    setMessage('');
    setRevealed(false);
    setSettled(false);
  }, [currentPuzzle, isLast]);

  /**
   * Start again from puzzle one.
   *
   * The end screen offered only Back to Games, so a second pass through a
   * sixteen puzzle deck meant leaving for the hub and reopening the game. Every
   * counter has to be cleared here, not just the position: the settled latch in
   * particular, because leaving it set would make the first answer of the new
   * round unrecordable.
   */
  const handleReplay = useCallback(() => {
    clearTimeout(advanceRef.current);
    setCurrentPuzzle(0);
    setUserAnswers(Array(PUZZLES[0].blanks).fill(''));
    setScore(0);
    setSolved(0);
    setUnaided(0);
    setRevealedCount(0);
    setMissed([]);
    setMessage('');
    setRevealed(false);
    setFinished(false);
    setSettled(false);
  }, []);

  const handleInputChange = useCallback((index, value) => {
    setUserAnswers((prev) => {
      const next = [...prev];
      next[index] = value.toUpperCase();
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (userAnswers.some((a) => !a.trim())) return;
    // Booked already: scoring again would pay twice and advance twice.
    if (settled) return;

    const isCorrect = normalise(userAnswers.join(' ')) === normalise(puzzle.word);
    if (!isCorrect) {
      setMessage('Not that. Read the sentence again and try.');
      return;
    }

    setMessage('Correct.');
    setScore((prev) => prev + POINTS_PER_PUZZLE);
    setSolved((prev) => prev + 1);
    setUnaided((prev) => prev + 1);
    setSettled(true);
    advanceRef.current = setTimeout(goToNext, 1200);
  }, [goToNext, puzzle.word, settled, userAnswers]);

  const handleReveal = useCallback(() => {
    if (settled) return;
    setSettled(true);
    setRevealed(true);
    setRevealedCount((prev) => prev + 1);
    setMissed((prev) => (prev.includes(currentPuzzle) ? prev : [...prev, currentPuzzle]));
    setMessage(`The answer is ${puzzle.word}.`);
    // Revealing used to be a dead end on the last puzzle, and on any puzzle
    // there was no way forward at all short of getting it right.
    advanceRef.current = setTimeout(goToNext, 2600);
  }, [currentPuzzle, goToNext, puzzle.word, settled]);

  if (finished) {
    const total = PUZZLES.length;
    return (
      <div className="game-screen">
        <div className="game-over-screen">
          <h2>Finished</h2>
          <p className="final-score">{score} points</p>
          <p className="game-completed-msg">
            {solved} of {total} correct
            {revealedCount > 0
              ? `, of which ${revealedCount} ${revealedCount === 1 ? 'was' : 'were'} revealed.`
              : ', none of them revealed.'}
          </p>
          <p className="game-completed-msg">
            You worked out {unaided} of {total} unaided.
          </p>

          {missed.length > 0 && (
            <div className="quiz-review" data-testid="puzzle-review">
              <h3>
                {missed.length === 1
                  ? 'The sentence that got away'
                  : `The ${missed.length} sentences that got away`}
              </h3>
              <ul className="quiz-review-list">
                {missed.map((index) => (
                  <li key={PUZZLES[index].word} className="quiz-review-item">
                    <p className="quiz-review-question">{PUZZLES[index].sentence}</p>
                    <p className="quiz-review-answer">
                      <span className="quiz-review-label">Answer:</span>{' '}
                      {PUZZLES[index].word}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="game-over-actions">
            <button className="btn-restart" onClick={handleReplay}>
              Play again
            </button>
            <button className="btn-restart secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="game-back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <h2>Word Puzzle</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="puzzle-game">
        <div className="game-progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={PUZZLES.length}
            aria-valuenow={currentPuzzle + 1}
            aria-label="Puzzle progress"
          >
            <div
              className="progress-fill"
              style={{ width: `${((currentPuzzle + 1) / PUZZLES.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Puzzle {currentPuzzle + 1}/{PUZZLES.length}
          </span>
        </div>

        <div className="puzzle-sentence">
          <p>{puzzle.sentence}</p>
          <p className="hint-text">{puzzle.hint}</p>
        </div>

        <div className="puzzle-inputs">
          {userAnswers.map((answer, idx) => (
            <input
              key={idx}
              ref={idx === 0 ? firstInputRef : null}
              type="text"
              placeholder={`Word ${idx + 1}`}
              aria-label={`Word ${idx + 1}`}
              value={answer}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              // Enter submits rather than doing nothing. A one-box puzzle has
              // nowhere else to go, and a two-box puzzle has no reason to make
              // the player reach for the button to send what they just typed.
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              className="puzzle-input"
              disabled={revealed}
            />
          ))}
        </div>

        {message && (
          <p
            className={`puzzle-message ${message === 'Correct.' ? 'success' : 'error'}`}
            role="status"
          >
            {message}
          </p>
        )}

        <div className="puzzle-actions">
          <button
            className="btn-submit-puzzle"
            onClick={handleSubmit}
            disabled={userAnswers.some((a) => !a.trim()) || revealed || settled}
          >
            Submit answer
          </button>
          <button className="btn-hint" onClick={handleReveal} disabled={revealed || settled}>
            Reveal answer
          </button>
        </div>
      </div>
    </div>
  );
}

export { PUZZLES };

export default WordPuzzle;
