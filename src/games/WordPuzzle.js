import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/GameStyles.css';

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
    hint: 'Two words',
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
];

const POINTS_PER_PUZZLE = 100;

const normalise = (text) => text.trim().toUpperCase().replace(/\s+/g, ' ');

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
  const [message, setMessage] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const advanceRef = useRef(null);

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
  }, [currentPuzzle, isLast]);

  const handleInputChange = useCallback((index, value) => {
    setUserAnswers((prev) => {
      const next = [...prev];
      next[index] = value.toUpperCase();
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (userAnswers.some((a) => !a.trim())) return;

    const isCorrect = normalise(userAnswers.join(' ')) === normalise(puzzle.word);
    if (!isCorrect) {
      setMessage('Not that. Read the sentence again and try.');
      return;
    }

    setMessage('Correct.');
    setScore((prev) => prev + POINTS_PER_PUZZLE);
    setSolved((prev) => prev + 1);
    setUnaided((prev) => prev + 1);
    advanceRef.current = setTimeout(goToNext, 1200);
  }, [goToNext, puzzle.word, userAnswers]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    setRevealedCount((prev) => prev + 1);
    setMessage(`The answer is ${puzzle.word}.`);
    // Revealing used to be a dead end on the last puzzle, and on any puzzle
    // there was no way forward at all short of getting it right.
    advanceRef.current = setTimeout(goToNext, 2600);
  }, [goToNext, puzzle.word]);

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
          <button className="btn-restart" onClick={onBack}>
            Back to Games
          </button>
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
              type="text"
              placeholder={`Word ${idx + 1}`}
              aria-label={`Word ${idx + 1}`}
              value={answer}
              onChange={(e) => handleInputChange(idx, e.target.value)}
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
            disabled={userAnswers.some((a) => !a.trim()) || revealed}
          >
            Submit answer
          </button>
          <button className="btn-hint" onClick={handleReveal} disabled={revealed}>
            Reveal answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default WordPuzzle;
