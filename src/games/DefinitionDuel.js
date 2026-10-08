import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/GameStyles.css';

/**
 * Definitions were loose enough to be wrong: photosynthesis does not convert
 * light to energy, it converts light energy into chemical energy, and a
 * catalyst is not used up by the reaction it speeds up. Worth fixing, because
 * the entire game is asking whether the player learned the right definition.
 */
/**
 * Sixteen hand-written term and clue pairs, spanning the subjects the dictionary
 * and the lessons actually cover.
 *
 * WHY THESE ARE NOT PULLED FROM THE DICTIONARY
 * --------------------------------------------
 * Each clue is written for this game and for no other. The dictionary's
 * explanation is an entry in its own right - it names the term it is explaining,
 * it carries the philosopher's name, and it is two or three sentences long -
 * and a clue that names the answer is not a clue. So the wording is this game's,
 * while the choice of terms is not invented: the ten philosophy terms below are
 * exactly the ten entries in the philosophy levels, and a test checks that they
 * cannot drift apart.
 *
 * WHY THE TERMS MUST NOT RECUR ACROSS GAMES
 * ------------------------------------------
 * A term quizzed in two games is answered twice. Seven were - Black Hole,
 * Photosynthesis, Catalyst, Regression, Confirmation Bias, Market Equilibrium and
 * Falsifiability all appeared here and in Concept Scrabble. The rule was written
 * down and a test was written to enforce it, and the test could not see any of
 * them, because it normalised both sides by stripping every character that was
 * not an uppercase letter. "Falsifiability" became "F" and "FALSIFIABILITY"
 * became "FALSIFIABILITY", so the two never matched.
 *
 * Philosophy has taken the freed slots, which is where the ten new entries went:
 * a subject with eleven lessons had a game that never mentioned it.
 */
const DUEL_PAIRS = [
  // Written so this definition could not be answered from Concept Scrabble's
  // version of the same term. A cross-game test enforces that: before it,
  // black hole, photosynthesis, catalyst, gravitational lensing and entropy
  // were near-copies across the two games, so playing both meant answering the
  // same five questions twice.
  { definition: 'An organism that hunts other organisms for food', word: 'Predator' },
  { definition: 'Light from a distant object arriving bent, so a galaxy appears stretched into arcs', word: 'Gravitational Lensing' },
  { definition: 'You should believe nothing that could not survive being doubted', word: 'Cartesian Doubt' },
  { definition: 'The authority of a government derives from those it governs, not from a ruler', word: 'Popular Sovereignty' },
  { definition: 'Two things moving together, which proves nothing about which one moves the other', word: 'Correlation' },
  { definition: 'The chemical bond in which one atom takes electrons away from another', word: 'Ionic Bonding' },
  { definition: 'The chain of amino acids that folds into a working protein', word: 'Primary Structure' },
  { definition: 'The empire dissolved after a war in which its soldiers were defeated', word: 'Ottoman Empire' },

  // The ten philosophy entries. These are the terms the levels are actually
  // written under, so a reader who has read "Free Will" and then met it here is
  // meeting the same idea, not a paraphrase of it.
  { definition: 'Whatever is the case whether or not anyone happens to be looking at it', word: 'Reality' },
  { definition: 'Being among the things there are, which is the part of metaphysics a person can actually get wrong', word: 'Existence' },
  { definition: 'Believing it, it being true, and having a good reason - a recipe a two-and-a-half page paper showed to be incomplete in 1963', word: 'Knowledge' },
  { definition: 'Noticing that your reasons for believing you are awake right now are exactly your reasons if you were dreaming', word: 'Skepticism' },
  { definition: 'The study of what an agent ought to do, including whether causing a harm differs from merely allowing it', word: 'Morality' },
  { definition: 'Judging an action only by what it brings about, and never by what kind of act it is', word: 'Consequentialism' },
  { definition: 'What makes you the same person while your cells are replaced, as they are, every few years or so', word: 'Identity' },
  { definition: 'The felt quality of experience itself, which no complete physical description has yet delivered', word: 'Consciousness' },
  { definition: 'Control over your own actions, disputed for two thousand years over whether it needs the power to have done otherwise', word: 'Free Will' },
  { definition: 'The claim that the state of the world now, with its laws, fixes exactly one future rather than probably one', word: 'Determinism' },
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

DefinitionDuel.propTypes = { onBack: PropTypes.func };

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

export { DUEL_PAIRS };

export default DefinitionDuel;
