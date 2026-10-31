import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { recordGameResult } from '../utils/gameResults';
import '../styles/GameStyles.css';

/** The id this game is filed under, in stored results and in the hub's list. */
export const DEFINITION_DUEL_GAME_ID = 'duel';

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

  // Economics, statistics, politics, psychology, biology and physics.
  //
  // The duel was the most played of the six games and the second narrowest: it
  // could serve a whole round without asking about a field the app teaches. Each
  // term below is one the dictionary already carries, so a card answered wrong
  // can be looked up rather than only marked.
  {
    definition: 'The value of the best thing you gave up in order to do what you did',
    word: 'Opportunity Cost',
  },
  {
    definition: 'A cost that lands on people who never agreed to it, which is how a market can be efficient and still harmful',
    word: 'Externality',
  },
  {
    definition: 'Carrying on because of what you have already spent rather than because of what comes next',
    word: 'Sunk Cost Fallacy',
  },
  {
    definition: 'The result that the mean of many independent samples approaches a bell curve, whatever you started with',
    word: 'Central Limit Theorem',
  },
  {
    definition: 'Drawing district boundaries so that a minority of votes yields a majority of seats',
    word: 'Gerrymandering',
  },
  {
    definition: 'A court setting aside a law because it conflicts with the constitution rather than with the judges\' taste',
    word: 'Judicial Review',
  },
  {
    definition: 'The 1648 settlement that made borders the business of states rather than of any authority above them',
    word: 'Peace of Westphalia',
  },
  {
    definition: 'Reviewing at widening intervals so that each recall happens once the memory has partly faded',
    word: 'Spaced Repetition',
  },
  {
    definition: 'Letting the first number you hear drag every later estimate towards it',
    word: 'Anchoring',
  },
  {
    definition: 'Water crossing a membrane towards the side holding more dissolved solute',
    word: 'Osmosis',
  },
  {
    definition: 'Light ejecting electrons from a metal only above a threshold frequency, which no wave model can explain',
    word: 'Photoelectric Effect',
  },
  {
    definition: 'Chemical marks on DNA that switch genes up or down without changing the sequence itself',
    word: 'Epigenetics',
  },
  {
    definition: 'DNA is transcribed to RNA, and RNA is translated to protein - the direction information flows in a cell',
    word: 'Central Dogma',
  },
  {
    definition: 'Survival of the bacteria that happened to carry a defence before the drug arrived',
    word: 'Antibiotic Resistance',
  },
  {
    definition: 'The junction where one neuron passes a signal to the next, across a gap rather than a wire',
    word: 'Synapse',
  },
  {
    definition: 'Mass times velocity, which a closed system conserves even when everything in it collides',
    word: 'Momentum',
  },
  {
    definition: 'The speed at which you can leave and never come back, which is why the Moon has none to offer',
    word: 'Escape Velocity',
  },
  {
    definition: 'Sitting still and falling freely feel the same, so gravity and acceleration cannot be told apart locally',
    word: 'Equivalence Principle',
  },
  {
    definition: 'The region where a compass needle turns, produced by moving charges rather than by a substance',
    word: 'Magnetic Field',
  },
  {
    definition: 'Giving each branch its own job so that no one of them can do all of the others\' work at once',
    word: 'Separation of Powers',
  },
  {
    definition: 'The claim that the same rules bind the government and the governed, and are known in advance',
    word: 'Rule of Law',
  },
  {
    definition: 'Breaking a law openly and accepting the punishment, to show that the law itself is the problem',
    word: 'Civil Disobedience',
  },
  {
    definition: 'Voters pick electors who pick the winner, which is why the popular vote and the result can disagree',
    word: 'Electoral College',
  },
  {
    definition: 'The discomfort of holding two beliefs that cannot both be true, which is usually settled by changing the belief that is easier to change',
    word: 'Cognitive Dissonance',
  },
  {
    definition: 'Knowing too little to see how much you are getting wrong, so the least skilled are the most confident',
    word: 'Dunning-Kruger Effect',
  },
  {
    definition: 'Explaining a stranger\'s behaviour by their character and your own by the situation you were in',
    word: 'Fundamental Attribution Error',
  },
  {
    definition: 'The roughly twenty-four hour internal clock that light resets and that a long flight disrupts',
    word: 'Circadian Rhythm',
  },
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
  const [hintText, setHintText] = useState('');
  // Cards passed over without answering. Counted and reported, because a card
  // skipped and a card the clock beat are different outcomes and the end screen
  // telling the player only the score loses the one they can act on.
  const [skipped, setSkipped] = useState(0);
  // Cards that were answered wrongly or passed over, in the order they came up.
  // The end screen said how many were skipped and how accurate the answers were
  // and never which cards they were, which is the only part a player can act on:
  // "3 cards were passed over" sends nobody anywhere, a list of the three does.
  const [missed, setMissed] = useState([]);

  // Cards where the hint was used. A Set rather than a flag, because the hint
  // belongs to the card it was asked for: nulling a boolean on advance would
  // already have lost which card it was, and a revealed answer is a different
  // thing from a recalled one when the score is added up.
  const hintedRef = useRef(new Set());

  // A wall-clock deadline rather than a counter that ticks once a second. A
  // counter keeps running in a backgrounded tab, which handed out free seconds
  // to anyone who switched away, and a laptop that slept mid-round kept the
  // full minute on return.
  const deadlineRef = useRef(null);
  // Reported once per round, from the end-of-round state rather than from the
  // moment the clock ran out: the last card's points are only in `score` after
  // the re-render, so reading it inside endGame would bank a round one answer
  // short of what the end screen shows.
  const recordedRef = useRef(false);
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

  useEffect(() => {
    if (gameActive) {
      recordedRef.current = false;
      return;
    }
    if (recordedRef.current) return;
    recordedRef.current = true;
    recordGameResult(DEFINITION_DUEL_GAME_ID, {
      score,
      max: DUEL_PAIRS.length * POINTS_PER_CORRECT,
    });
  }, [gameActive, score]);

  const handleSubmit = useCallback(() => {
    if (!gameActive || !userInput.trim()) return;

    const pair = DUEL_PAIRS[currentPair];
    const isCorrect = normalise(userInput) === normalise(pair.word);

    setAttempts((prev) => prev + 1);

    if (!isCorrect) {
      setFeedback(`Not quite. The answer was ${pair.word}.`);
      setCorrect(false);
      setMissed((prev) => (prev.includes(currentPair) ? prev : [...prev, currentPair]));
      return;
    }

    setFeedback('Correct.');
    setCorrect(true);
    // A hinted card is worth half. Any other arrangement would make the hint a
    // free answer key, and marking it zero would mean the honest thing to do
    // with a card you are stuck on is nothing at all.
    setScore((prev) => prev + (hintedRef.current.has(currentPair) ? POINTS_PER_CORRECT / 2 : POINTS_PER_CORRECT));
    setUserInput('');
    setHintText('');

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
      setHintText('');
    }, 800);
  }, [currentPair, endGame, gameActive, userInput]);

  /**
   * Start a fresh round without leaving the game.
   *
   * The clock is not reset here: it is armed by the effect on `gameActive`, so
   * flipping that back to true is what gives the new round its full minute.
   * settledRef has to be cleared by hand, because it is the latch that stops a
   * second end being booked, and leaving it set meant a replay began already
   * over.
   */
  const handleReplay = useCallback(() => {
    settledRef.current = false;
    clearInterval(tickRef.current);
    clearTimeout(advanceRef.current);
    hintedRef.current = new Set();
    setCurrentPair(0);
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    setAttempts(0);
    setSkipped(0);
    setMissed([]);
    setFinished(false);
    setUserInput('');
    setFeedback('');
    setCorrect(false);
    setHintText('');
    setGameActive(true);
  }, []);

  /**
   * Pass on a card. Counted separately from a wrong answer, because a card the
   * player could not name is not a card they got wrong, and mixing the two
   * would leave the accuracy figure explaining neither.
   */
  const handleSkip = useCallback(() => {
    if (!gameActive) return;
    clearTimeout(advanceRef.current);
    setSkipped((prev) => prev + 1);
    setMissed((prev) => (prev.includes(currentPair) ? prev : [...prev, currentPair]));
    setFeedback('');
    setCorrect(false);
    setHintText('');
    setUserInput('');

    if (currentPair === DUEL_PAIRS.length - 1) {
      endGame(false);
      return;
    }
    setCurrentPair((prev) => prev + 1);
  }, [currentPair, endGame, gameActive]);

  /**
   * A second letter is most of a one-word answer, so the hint gives the shape
   * rather than the spelling: how many words, and the first letter of the first
   * one. Enough to turn a blank into a memory, not enough to be the answer.
   */
  const handleHint = useCallback(() => {
    if (!gameActive) return;
    const { word } = DUEL_PAIRS[currentPair];
    hintedRef.current.add(currentPair);
    const parts = word.split(' ');
    setHintText(
      `${parts.length > 1 ? `${parts.length} words. ` : ''}Starts with ${word[0].toUpperCase()}.`
    );
  }, [currentPair, gameActive]);

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
              <button
                type="button"
                className="btn-duel-hint"
                onClick={handleHint}
                disabled={hintText !== ''}
                aria-label="Show a hint for this definition"
              >
                Hint
              </button>
              <button
                type="button"
                className="btn-duel-skip"
                onClick={handleSkip}
                aria-label="Skip this definition"
              >
                Skip
              </button>
            </div>

            {hintText && (
              <p className="duel-hint" role="status">
                {hintText} This card is worth half its points now.
              </p>
            )}

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
            {skipped > 0 && (
              <p className="accuracy">
                {skipped === 1
                  ? 'One card was passed over rather than answered.'
                  : `${skipped} cards were passed over rather than answered.`}
              </p>
            )}

            {/*
             * What to do next. A count of mistakes is a verdict; the list is a
             * reading list, and every card here names the term so it can be
             * looked up in the dictionary rather than only remembered as a miss.
             */}
            {missed.length > 0 && (
              <div className="quiz-review" data-testid="duel-review">
                <h3>
                  {missed.length === 1
                    ? 'The card that got away'
                    : `The ${missed.length} cards that got away`}
                </h3>
                <ul className="quiz-review-list">
                  {missed.map((index) => (
                    <li key={DUEL_PAIRS[index].word} className="quiz-review-item">
                      <p className="quiz-review-question">{DUEL_PAIRS[index].definition}</p>
                      <p className="quiz-review-answer">
                        <span className="quiz-review-label">Answer:</span>{' '}
                        {DUEL_PAIRS[index].word}
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
        )}
      </div>
    </div>
  );
}

export { DUEL_PAIRS };

export default DefinitionDuel;
