import PropTypes from 'prop-types';
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { recordGameResult } from '../utils/gameResults';
import '../styles/GameStyles.css';

/** The id this game is filed under, in stored results and in the hub's list. */
export const SCRABBLE_GAME_ID = 'scrabble';

/**
 * Hints used to give the answer away: "11 letters" for SINGULARITY and "8
 * letters" for CATALYST meant the only thing left to do was fill in the gaps.
 * They are now the first letter and a category.
 *
 * Two definitions were also wrong. Photosynthesis turns light energy into
 * chemical energy, not "light to energy", and a singularity is where our
 * physics stops predicting a density, not a place with a known infinite one.
 */
/**
 * Seven words, four of them space, and the definitions were written as terse
 * one-liners with no room for a second correct reading. Fourteen now, spread
 * across the subjects the dictionary covers, and every definition says something
 * the term must actually get right -- "without being used up" is the part of a
 * catalyst that distinguishes it from a reactant.
 *
 * These deliberately do not restate Definition Duel's wording for the same
 * terms. A test enforces that: two games asking the same question in different
 * clothes is padding, not breadth.
 */
const SCRABBLE_LEVELS = [
  {
    definition: 'A region of space that nothing can escape once entered',
    word: 'BLACKHOLE',
    // The rack spells a term as one run of capitals, so a two-word term needs a
    // spaced spelling wherever it is shown as an answer rather than as tiles.
    // Without it the review said the answer was "BLACKHOLE", which reads as a
    // typo rather than as a term.
    display: 'BLACK HOLE',
    hint: 'Two words',
    category: 'Space',
  },
  {
    definition: 'The point inside a black hole where our physics stops working',
    word: 'SINGULARITY',
    hint: 'Starts with S',
    category: 'Space',
  },
  {
    definition: 'The boundary beyond which nothing escapes a black hole',
    word: 'EVENTHORIZON',
    display: 'EVENT HORIZON',
    hint: 'Two words',
    category: 'Space',
  },
  {
    definition: 'Turning light energy into chemical energy stored in sugar',
    word: 'PHOTOSYNTHESIS',
    hint: 'Starts with P',
    category: 'Biology',
  },
  {
    definition: 'A substance that speeds a reaction up without being used up',
    word: 'CATALYST',
    hint: 'Starts with C',
    category: 'Chemistry',
  },
  {
    definition: 'Light bent by the gravity of something massive',
    word: 'LENSING',
    hint: 'Starts with L',
    category: 'Space',
  },
  {
    definition: 'How many arrangements of a system look the same from outside',
    word: 'ENTROPY',
    hint: 'Starts with E',
    category: 'Physics',
  },
  {
    definition: 'The organism that makes its own food using light',
    word: 'AUTOTROPH',
    hint: 'Starts with A',
    category: 'Biology',
  },
  {
    definition: 'The way a cell divides to produce two identical daughter cells',
    word: 'MITOSIS',
    hint: 'Starts with M',
    category: 'Biology',
  },
  {
    definition: 'The measure of how much heat a body can hold per degree',
    word: 'THERMALCAPACITY',
    display: 'THERMAL CAPACITY',
    hint: 'Two words',
    category: 'Physics',
  },
  {
    definition: 'The claim that a belief must be able to be proved false to count as science',
    word: 'FALSIFIABILITY',
    hint: 'Starts with F',
    category: 'Philosophy',
  },
  {
    definition: 'Working out which values you did not measure from the ones you did',
    word: 'REGRESSION',
    hint: 'Starts with R',
    category: 'Mathematics',
  },
  {
    definition: 'The habit of seeking out only the evidence that agrees with you',
    word: 'CONFIRMATIONBIAS',
    display: 'CONFIRMATION BIAS',
    hint: 'Two words',
    category: 'Psychology',
  },
  {
    definition: 'An agreement between two sides, and the price they settle at',
    word: 'MARKETEQUILIBRIUM',
    display: 'MARKET EQUILIBRIUM',
    hint: 'Two words',
    category: 'Economics',
  },
  {
    definition: 'The empire that lasted from 1299 until after the First World War',
    word: 'OTTOMAN',
    hint: 'Starts with O',
    category: 'History',
  },
  {
    definition: 'The rate at which a nation’s goods are taxed as they cross its border',
    word: 'TARIFF',
    hint: 'Starts with T',
    category: 'Political Science',
  },

  // Philosophy, and not one word more than this.
  //
  // The rack is built from the answer's own letters, so a word has to be a
  // single run of capitals. That rules out every multi-word philosophical term
  // in the dictionary - Categorical Imperative, Veil of Ignorance, Trolley
  // Problem, Problem of Induction and eleven more. Of the four that survive the
  // rule, three are asked elsewhere already: Epistemology and Pragmatism in
  // Concept Puzzle, Stoicism in Connect the Concept.
  //
  // So Falsifiability and Pragmatist are what this deck can honestly hold. That
  // is a ceiling rather than an oversight, and a test records it so the next
  // person adding terms does not re-derive it or quietly re-use a term another
  // game already asks.
  {
    definition: 'Holding that a belief counts as true when it works well in practice, rather than because it matches reality',
    word: 'PRAGMATIST',
    hint: 'Starts with P',
    category: 'Philosophy',
  },

  // Ten more, chosen so that the rack can actually spell them and so that no
  // term is one another game already asks for. The rack is built from the
  // answer's own letters, which is why every entry here is a single run of
  // capitals rather than the spaced spelling the term normally takes.
  {
    definition: 'A general rise in prices, which is the same thing as a fall in what money can buy',
    word: 'INFLATION',
    hint: 'Starts with I',
    category: 'Economics',
  },
  {
    definition: 'Buying in one market to sell immediately in another at a higher price, which closes the gap between them',
    word: 'ARBITRAGE',
    hint: 'Starts with A',
    category: 'Economics',
  },
  {
    definition: 'How much the quantity people buy responds to a change in the price',
    word: 'ELASTICITY',
    hint: 'Starts with E',
    category: 'Economics',
  },
  {
    definition: 'The right to be brought before a court so that it can decide whether your detention is lawful',
    word: 'HABEASCORPUS',
    display: 'HABEAS CORPUS',
    hint: 'Two words',
    category: 'Political Science',
  },
  {
    definition: 'Speaking without pause on the floor of a legislature in order to prevent a vote',
    word: 'FILIBUSTER',
    hint: 'Starts with F',
    category: 'Political Science',
  },
  {
    definition: 'The keeping of internal conditions steady while the world outside them changes',
    word: 'HOMEOSTASIS',
    hint: 'Starts with H',
    category: 'Biology',
  },
  {
    definition: 'The survival of the variants best suited to their surroundings, over many generations',
    word: 'NATURALSELECTION',
    display: 'NATURAL SELECTION',
    hint: 'Two words',
    category: 'Biology',
  },
  {
    definition: 'The division that halves the chromosome number to produce gametes',
    word: 'MEIOSIS',
    hint: 'Starts with M',
    category: 'Biology',
  },
  {
    definition: 'A single indivisible quantum of light, which no wave model can account for',
    word: 'PHOTON',
    hint: 'Starts with P',
    category: 'Physics',
  },
  {
    definition: 'The theory that measurements of time and length depend on how the observer is moving',
    word: 'RELATIVITY',
    hint: 'Starts with R',
    category: 'Physics',
  },
  {
    definition: 'Interest paid on the interest already earned, which is why a small rate compounds into a large sum',
    word: 'COMPOUNDINTEREST',
    display: 'COMPOUND INTEREST',
    hint: 'Two words',
    category: 'Mathematics',
  },
  {
    definition: 'The right to vote, won by arguments and by marches rather than given',
    word: 'SUFFRAGE',
    hint: 'Starts with S',
    category: 'Political Science',
  },
  {
    definition: 'The European movement that put reason and evidence ahead of inherited authority',
    word: 'ENLIGHTENMENT',
    hint: 'Starts with E',
    category: 'History',
  },
  {
    definition: 'Inflation climbing so fast that money stops working as a store of value',
    word: 'HYPERINFLATION',
    hint: 'Starts with H',
    category: 'Economics',
  },
  {
    definition: 'The power you raise ten to in order to get a number, which is what turns multiplication into addition',
    word: 'LOGARITHM',
    hint: 'Starts with L',
    category: 'Mathematics',
  },
  {
    definition: 'The decay of unstable nuclei, giving off alpha, beta or gamma radiation',
    word: 'RADIOACTIVITY',
    hint: 'Starts with R',
    category: 'Physics',
  },
  {
    definition: 'The loss of electrons by one substance, which is what rusting and burning have in common',
    word: 'OXIDATION',
    hint: 'Starts with O',
    category: 'Chemistry',
  },
  {
    definition: 'The roughly day-long internal cycle that sets when you sleep and when you are alert',
    word: 'CIRCADIANRHYTHM',
    display: 'CIRCADIAN RHYTHM',
    hint: 'Two words',
    category: 'Psychology',
  },
  {
    definition: 'Being careless because someone else bears the cost if things go wrong',
    word: 'MORALHAZARD',
    display: 'MORAL HAZARD',
    hint: 'Two words',
    category: 'Economics',
  },
  {
    definition: 'A protein that speeds up a reaction in a living cell without being consumed',
    word: 'ENZYME',
    hint: 'Starts with E',
    category: 'Chemistry',
  },
  {
    definition: 'The outer electrons that decide how an atom bonds and what it will react with',
    word: 'VALENCE',
    hint: 'Starts with V',
    category: 'Chemistry',
  },
  {
    definition: 'The system of land, service and obligation that organised medieval Europe',
    word: 'FEUDALISM',
    hint: 'Starts with F',
    category: 'History',
  },
  {
    definition: 'The sixteenth-century break that split western Christianity into rival churches',
    word: 'REFORMATION',
    hint: 'Starts with R',
    category: 'History',
  },
  {
    definition: 'The almond-shaped structure that flags a threat before you can name it',
    word: 'AMYGDALA',
    hint: 'Starts with A',
    category: 'Psychology',
  },
  {
    definition: 'The neurotransmitter whose reuptake the most common antidepressant drugs block',
    word: 'SEROTONIN',
    hint: 'Starts with S',
    category: 'Psychology',
  },
  {
    definition: 'An argument carried on by contradiction, the method Hegel gave its modern shape',
    word: 'DIALECTIC',
    hint: 'Starts with D',
    category: 'Philosophy',
  },
];

/** Fisher-Yates. `sort(() => Math.random() - 0.5)` is not a shuffle: it is
 *  biased and leaves long runs of letters in their original order. */
const shuffle = (letters) => {
  const out = [...letters];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const POINTS_PER_WORD = 100;

ConceptScrabble.propTypes = { onBack: PropTypes.func };

function ConceptScrabble({ onBack }) {
  /*
   * Which category the rack is drawn from.
   *
   * Thirty-six levels in one sitting, and no way in except the front, so a
   * reader who has just finished an economics lesson had to spell their way
   * through ten space and biology terms to reach it. 'All' is the deck as
   * written, so the default is unchanged.
   */
  const [categoryFilter, setCategoryFilter] = useState('All');
  const deck = useMemo(
    () =>
      SCRABBLE_LEVELS.map((entry, index) => index).filter(
        (index) => categoryFilter === 'All' || SCRABBLE_LEVELS[index].category === categoryFilter
      ),
    [categoryFilter]
  );
  // A single category is a practice deck - see the note on the end screen.
  const isNarrowed = categoryFilter !== 'All';
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [skipped, setSkipped] = useState(0);
  // Which levels were passed over, so the end screen can name them. "skipped 9"
  // is a verdict; the nine terms are a reading list, and the definition shown on
  // the card is the thing worth going back to.
  const [skippedLevels, setSkippedLevels] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [shake, setShake] = useState(false);
  // True once this level has been solved and the move on is already booked.
  //
  // handleSubmit left the solved word on the rack with both buttons still live
  // for the 1200ms the advance is waiting out, so a second click passed the same
  // guard the first one did and booked a second move. Measured before the fix:
  // one correct word scored 200 and jumped from level 1 to level 3. Skip had the
  // same hole from the other direction - skipping after solving cost the player
  // the level they had just earned.
  const [settled, setSettled] = useState(false);
  /**
   * How many places the rack has been turned.
   *
   * The letters were shuffled once per level and then frozen, so a rack that
   * read as nonsense in one arrangement stayed in exactly that arrangement.
   * Moving letters around is how an anagram gets solved - the eye finds a
   * familiar pair once it is next to itself - so a player stuck could only do
   * it by mentally rearranging eleven tiles. Turning the rack is the physical
   * version of that, and it is deterministic rather than a second shuffle, so
   * pressing it repeatedly walks through the arrangements instead of possibly
   * landing on the one you were already looking at.
   */
  const [rackOffset, setRackOffset] = useState(0);
  const advanceRef = useRef(null);
  const shakeRef = useRef(null);
  // Reported once per pass through the rack. The last word's 100 points are
  // only in `score` after the re-render, so the record is taken from the end
  // screen rather than from the moment the last word was submitted.
  const recordedRef = useRef(false);

  useEffect(() => {
    if (!gameOver) {
      recordedRef.current = false;
      return;
    }
    if (recordedRef.current) return;
    recordedRef.current = true;
    // A single category is not comparable to the whole rack, so it is scored on
    // its own end screen and not stored as a best.
    if (isNarrowed) return;
    recordGameResult(SCRABBLE_GAME_ID, {
      score,
      max: SCRABBLE_LEVELS.length * POINTS_PER_WORD,
    });
  }, [gameOver, isNarrowed, score]);

  const levelIndex = deck[currentLevel];
  const level = SCRABBLE_LEVELS[levelIndex];
  const isLastLevel = currentLevel >= deck.length - 1;

  // Memoised on the level, and only the level. Recomputing this on every
  // render reshuffled the rack every time you clicked a tile, and because a
  // tile was tracked by its position in the shuffled list, the "used" marks
  // jumped onto different letters as you went.
  const rack = useMemo(() => {
    const tiles = level.word.split('').map((letter, i) => ({ id: `${i}-${letter}`, letter }));
    const shuffled = shuffle(tiles);
    const turn = rackOffset % shuffled.length;
    return [...shuffled.slice(turn), ...shuffled.slice(0, turn)];
  }, [level, rackOffset]);

  useEffect(
    () => () => {
      clearTimeout(advanceRef.current);
      clearTimeout(shakeRef.current);
    },
    []
  );

  const handleLetterClick = useCallback((tile) => {
    setSelectedLetters((prev) => [...prev, tile]);
  }, []);

  const handleRemoveLetter = useCallback((idToRemove) => {
    setSelectedLetters((prev) => prev.filter((tile) => tile.id !== idToRemove));
  }, []);

  /**
   * Empty the board in one action.
   *
   * Taking back a wrongly-built word meant clicking each of its letters in
   * turn, and the longest words here are eleven characters - an anagram attempt
   * that started wrong cost eleven separate clicks to undo, on a game where
   * trying a wrong arrangement is the actual activity.
   */
  const handleClearBoard = useCallback(() => {
    setSelectedLetters([]);
    setMessage('');
  }, []);

  /**
   * Backspace takes the last letter off the board rather than out of the word.
   *
   * The tiles are not text inputs, so the key did nothing at all and the only
   * route back was the mouse. Typing a word and pressing a key that normally
   * undoes a keystroke should not be the one place it does not.
   */
  useEffect(() => {
    if (settled || gameOver) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== 'Backspace') return;
      event.preventDefault();
      setSelectedLetters((prev) => prev.slice(0, -1));
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameOver, settled]);

  const goToNextLevel = useCallback(() => {
    if (isLastLevel) {
      setGameOver(true);
      return;
    }
    setCurrentLevel((prev) => prev + 1);
    setSelectedLetters([]);
    setMessage('');
    setSettled(false);
    setRackOffset(0);
  }, [isLastLevel]);

  const handleSubmit = useCallback(() => {
    // Booked already: paying again would score twice and advance twice.
    if (settled) return;
    const formed = selectedLetters.map((tile) => tile.letter).join('');
    if (formed !== level.word) {
      setMessage('Not that word. Try rearranging what you have.');
      setShake(true);
      clearTimeout(shakeRef.current);
      shakeRef.current = setTimeout(() => setShake(false), 600);
      return;
    }

    setMessage('Correct.');
    setScore((prev) => prev + POINTS_PER_WORD);
    setSolvedCount((prev) => prev + 1);
    setSettled(true);
    advanceRef.current = setTimeout(goToNextLevel, 1200);
  }, [goToNextLevel, level.word, selectedLetters, settled]);

  /**
   * Back to level one with a clear board.
   *
   * The end screen offered only Back to Games, so playing the rack again meant
   * leaving for the hub and reopening the game. The settled flag and the pending
   * advance both have to go, or a replay inherits the last level's booked move
   * and jumps a level on its own.
   */
  /**
   * Switch decks and start over in the new one.
   *
   * Every counter is cleared: a round of four chemistry terms cannot inherit
   * the score of six biology ones. The filter is applied here rather than in an
   * effect, so the first level of the new rack is ready on the same render the
   * reader asked for it.
   */
  const handleCategoryChange = useCallback((next) => {
    clearTimeout(advanceRef.current);
    clearTimeout(shakeRef.current);
    setCategoryFilter(next);
    setCurrentLevel(0);
    setSelectedLetters([]);
    setScore(0);
    setSolvedCount(0);
    setSkipped(0);
    setSkippedLevels([]);
    setGameOver(false);
    setMessage('');
    setShake(false);
    setSettled(false);
    setRackOffset(0);
  }, []);

  // Play again means the rack that just finished, not the whole set.
  const handleReplay = useCallback(
    () => handleCategoryChange(categoryFilter),
    [categoryFilter, handleCategoryChange]
  );

  const handleSkip = useCallback(() => {
    // Skipping a level already solved would throw away the level just earned
    // and cost a second advance on top of the one already booked.
    if (settled) return;
    setSkipped((prev) => prev + 1);
    setSkippedLevels((prev) =>
      prev.includes(levelIndex) ? prev : [...prev, levelIndex]
    );
    goToNextLevel();
  }, [goToNextLevel, levelIndex, settled]);

  if (gameOver) {
    const total = deck.length;
    return (
      <div className="game-screen">
        <div className="game-over-screen">
          <h2>Finished</h2>
          <p className="final-score">{score} points</p>
          <p className="game-completed-msg">
            You solved {solvedCount} of {total}
            {skipped > 0 ? `, and skipped ${skipped}.` : ', with none skipped.'}
          </p>
          {isNarrowed && (
            <p className="game-completed-msg" data-testid="scrabble-not-stored">
              A single category is scored here but not stored as a best, because it is not
              comparable to the whole rack.
            </p>
          )}
          {skippedLevels.length > 0 && (
            <div className="quiz-review" data-testid="scrabble-review">
              <h3>
                {skippedLevels.length === 1
                  ? 'The term you passed over'
                  : `The ${skippedLevels.length} terms you passed over`}
              </h3>
              <ul className="quiz-review-list">
                {skippedLevels.map((index) => (
                  <li key={SCRABBLE_LEVELS[index].word} className="quiz-review-item">
                    <p className="quiz-review-question">
                      {SCRABBLE_LEVELS[index].definition}
                    </p>
                    <p className="quiz-review-answer">
                      <span className="quiz-review-label">Answer:</span>{' '}
                      {SCRABBLE_LEVELS[index].display || SCRABBLE_LEVELS[index].word}
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
            {isNarrowed && (
              <button
                className="btn-restart secondary"
                data-testid="scrabble-play-all"
                onClick={() => handleCategoryChange('All')}
              >
                Play the whole rack
              </button>
            )}
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
        <h2>Concept Scrabble</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="scrabble-game">
        {/* The category switch. Thirty-six levels with no way in except the
          * front meant a reader who had just studied economics spelled their way
          * through ten other terms to reach it. */}
        <div className="scrabble-deck-row">
          <label className="scrabble-deck-label" htmlFor="scrabble-category">
            Category
          </label>
          <select
            id="scrabble-category"
            className="scrabble-deck-select"
            value={categoryFilter}
            onChange={(event) => handleCategoryChange(event.target.value)}
          >
            <option value="All">All categories</option>
            {[...new Set(SCRABBLE_LEVELS.map((entry) => entry.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <span className="scrabble-deck-count" data-testid="scrabble-deck-count">
            {deck.length} {deck.length === 1 ? 'term' : 'terms'}
          </span>
        </div>

        <div className="game-progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={deck.length}
            aria-valuenow={currentLevel + 1}
            aria-label="Level progress"
          >
            <div
              className="progress-fill"
              style={{ width: `${((currentLevel + 1) / deck.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Level {currentLevel + 1}/{deck.length}
          </span>
        </div>

        <div className="definition-box">
          <p className="definition-text" data-testid="definition-text">{level.definition}</p>
          <p className="hint-text">
            {level.category} &middot; {level.hint}
          </p>
        </div>

        <div className={`word-builder ${shake ? 'shake' : ''}`}>
          <div className="built-word" data-testid="built-word">
            {selectedLetters.length > 0 ? (
              selectedLetters.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  className="built-letter"
                  data-testid="built-letter"
                  onClick={() => handleRemoveLetter(tile.id)}
                  aria-label={`Remove ${tile.letter}`}
                >
                  {tile.letter}
                </button>
              ))
            ) : (
              <p className="placeholder" data-testid="built-placeholder">
                Click letters below to build the word
              </p>
            )}
          </div>
        </div>

        <div className="letters-grid">
          {rack.map((tile) => {
            const isUsed = selectedLetters.some((t) => t.id === tile.id);
            return (
              <button
                key={tile.id}
                type="button"
                className={`letter-btn ${isUsed ? 'used' : ''}`}
                onClick={() => !isUsed && handleLetterClick(tile)}
                disabled={isUsed}
                aria-label={`Letter ${tile.letter}`}
              >
                {tile.letter}
              </button>
            );
          })}
        </div>

        {message && (
          <p
            className={`game-message ${selectedLetters.map((t) => t.letter).join('') === level.word ? 'success' : 'error'}`}
            role="status"
          >
            {message}
          </p>
        )}

        <div className="game-actions">
          <button className="btn-submit" onClick={handleSubmit} disabled={selectedLetters.length === 0 || settled}>
            Submit word
          </button>
          <button
            className="btn-clear"
            onClick={handleClearBoard}
            disabled={selectedLetters.length === 0 || settled}
          >
            Clear board
          </button>
          {/* Only useful while the board is empty: turning the rack with
            * letters already on it moves the tiles that are left, which reads
            * as the game taking a letter back. */}
          <button
            type="button"
            className="btn-clear"
            data-testid="scrabble-shuffle"
            onClick={() => setRackOffset((offset) => offset + 1)}
            disabled={selectedLetters.length > 0 || settled}
          >
            Turn the rack
          </button>
          <button className="btn-skip" onClick={handleSkip} disabled={settled}>
            Skip level
          </button>
        </div>
      </div>
    </div>
  );
}

export { SCRABBLE_LEVELS, POINTS_PER_WORD };

export default ConceptScrabble;
