import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/GameStyles.css';

/**
 * Definitions were loose enough to be wrong: photosynthesis does not convert
 * light to energy, it converts light energy into chemical energy, and a
 * catalyst is not used up by the reaction it speeds up. Worth fixing, because
 * the entire game is asking whether the player learned the right definition.
 */
const DUEL_PAIRS = [
  { definition: 'A region of spacetime that nothing can escape once entered', word: 'Black Hole' },
  { definition: 'A point where our physics predicts density with no upper limit', word: 'Singularity' },
  { definition: 'Turning light energy into chemical energy stored in sugar', word: 'Photosynthesis' },
  { definition: 'A substance that speeds a reaction up without being used up', word: 'Catalyst' },
  { definition: 'A count of how many arrangements look the same from outside', word: 'Entropy' },
  { definition: 'Light bent by the gravity of something massive', word: 'Gravitational Lensing' },
  { definition: 'The boundary beyond which nothing escapes a black hole', word: 'Event Horizon' },
  { definition: 'An organism that hunts other organisms for food', word: 'Predator' },
];

const ROUND_SECONDS = 60;
const POINTS_PER_CORRECT = 10;

/** Accepts the word with light punctuation and spacing differences. */
const normalise = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]+$/, '')
    .replace(/\s+/g, ' ');

function DefinitionDuel({ onBack }) {
  const [currentPair, setCurrentPair] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [finished, setFinished] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correct, setCorrect] = useState(false);

  // A wall-clock deadline rather than a counter that ticks once a second. A
  // counter keeps running in a backgrounded tab, which handed out free seconds
  // to anyone who switched away, and a laptop that slept mid-round kept the
  // full minute on return.
  const deadlineRef = useRef(null);
  const pausedAtRef = useRef(0);
  const tickRef = useRef(null);
  const advanceRef = useRef(null);
  const settledRef = useRef(false);

  const timeRemaining = useCallback(
    () => Math.max(0, Math.ceil(((deadlineRef.current || 0) - Date.now()) / 1000)),
    []
  );

  const endGame = useCallback((ranOut) => {
    if (settledRef.current) return;
    settledRef.current = true;
    clearInterval(tickRef.current);
    clearTimeout(advanceRef.current);
    setGameActive(false);
    setFinished(!ranOut);
  }, []);

  useEffect(() => {
    if (!gameActive) return undefined;

    const tick = () => {
      const left = timeRemaining();
      setTimeLeft(left);
      if (left <= 0) endGame(true);
    };

    deadlineRef.current = Date.now() + ROUND_SECONDS * 1000;
    tick();
    tickRef.current = setInterval(tick, 250);

    const onVisibility = () => {
      if (document.hidden) {
        pausedAtRef.current = Date.now();
      } else if (pausedAtRef.current) {
        deadlineRef.current += Date.now() - pausedAtRef.current;
        pausedAtRef.current = 0;
        tick();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(tickRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [endGame, gameActive, timeRemaining]);

  useEffect(
    () => () => {
      clearTimeout(advanceRef.current);
      clearInterval(tickRef.current);
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!gameActive || !userInput.trim()) return;

    const pair = DUEL_PAIRS[currentPair];
    const isCorrect = normalise(userInput) === normalise(pair.word);

    setAttempts((prev) => prev + 1);

    if (!isCorrect) {
      setFeedback(`Not quite. The answer was ${pair.word}.`);
      setCorrect(false);
      return;
    }

    setFeedback('Correct.');
    setCorrect(true);
    setScore((prev) => prev + POINTS_PER_CORRECT);
    setUserInput('');

    const isLast = currentPair === DUEL_PAIRS.length - 1;
    if (isLast) {
      // Finishing every card is not the same as running out of time, and
      // saying "Time's Up!" after a perfect round was a lie.
      endGame(false);
      return;
    }

    advanceRef.current = setTimeout(() => {
      setCurrentPair((prev) => prev + 1);
      setFeedback('');
      setCorrect(false);
    }, 800);
  }, [currentPair, endGame, gameActive, userInput]);

  const pair = DUEL_PAIRS[currentPair];
  const maxScore = DUEL_PAIRS.length * POINTS_PER_CORRECT;
  const accuracy = attempts > 0 ? Math.round((score / (attempts * POINTS_PER_CORRECT)) * 100) : 0;

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="game-back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <h2>Definition Duel</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="duel-game">
        <div className={`timer ${timeLeft < 10 ? 'danger' : ''}`}>
          <div className="timer-circle">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" strokeWidth="3" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="3"
                strokeDasharray={`${(timeLeft / ROUND_SECONDS) * 282.7} 282.7`}
              />
            </svg>
            <span className="timer-text" role="timer" aria-live="off">
              {timeLeft}s
            </span>
          </div>
        </div>

        {gameActive ? (
          <>
            <div className="duel-definition">
              <p>{pair.definition}</p>
            </div>

            <div className="duel-input-group">
              <input
                type="text"
                placeholder="Type the term..."
                aria-label="Type the term being defined"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
                className={feedback ? (correct ? 'success' : 'error') : ''}
              />
              <button className="btn-duel-submit" onClick={handleSubmit} disabled={!userInput.trim()}>
                Submit
              </button>
            </div>

            {feedback && (
              <p className={`duel-feedback ${correct ? 'correct' : 'incorrect'}`} role="status">
                {feedback}
              </p>
            )}

            <p className="duel-progress">
              {currentPair + 1}/{DUEL_PAIRS.length}
            </p>
          </>
        ) : (
          <div className="game-over-screen">
            <h2>{finished ? 'All cards done' : "Time's up"}</h2>
            <p className="final-score">
              {score}/{maxScore} points
            </p>
            <p className="accuracy">
              {attempts > 0
                ? `${accuracy}% of the ${attempts} you attempted`
                : 'No answers attempted'}
            </p>
            <p className="accuracy">
              {finished ? `You got through all ${DUEL_PAIRS.length} definitions.` : `You reached card ${currentPair + 1} of ${DUEL_PAIRS.length}.`}
            </p>
            <button className="btn-restart" onClick={onBack}>
              Back to Games
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DefinitionDuel;
