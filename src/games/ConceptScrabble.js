import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import '../styles/GameStyles.css';

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
    hint: 'Two words',
    category: 'Psychology',
  },
  {
    definition: 'An agreement between two sides, and the price they settle at',
    word: 'MARKETEQUILIBRIUM',
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

function ConceptScrabble({ onBack }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [skipped, setSkipped] = useState(0);
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
  const advanceRef = useRef(null);
  const shakeRef = useRef(null);

  const level = SCRABBLE_LEVELS[currentLevel];
  const isLastLevel = currentLevel === SCRABBLE_LEVELS.length - 1;

  // Memoised on the level, and only the level. Recomputing this on every
  // render reshuffled the rack every time you clicked a tile, and because a
  // tile was tracked by its position in the shuffled list, the "used" marks
  // jumped onto different letters as you went.
  const rack = useMemo(() => {
    const tiles = level.word.split('').map((letter, i) => ({ id: `${i}-${letter}`, letter }));
    return shuffle(tiles);
  }, [level]);

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

  const goToNextLevel = useCallback(() => {
    if (isLastLevel) {
      setGameOver(true);
      return;
    }
    setCurrentLevel((prev) => prev + 1);
    setSelectedLetters([]);
    setMessage('');
    setSettled(false);
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

  const handleSkip = useCallback(() => {
    // Skipping a level already solved would throw away the level just earned
    // and cost a second advance on top of the one already booked.
    if (settled) return;
    setSkipped((prev) => prev + 1);
    goToNextLevel();
  }, [goToNextLevel, settled]);

  if (gameOver) {
    const total = SCRABBLE_LEVELS.length;
    return (
      <div className="game-screen">
        <div className="game-over-screen">
          <h2>Finished</h2>
          <p className="final-score">{score} points</p>
          <p className="game-completed-msg">
            You solved {solvedCount} of {total}
            {skipped > 0 ? `, and skipped ${skipped}.` : ', with none skipped.'}
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
        <h2>Concept Scrabble</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="scrabble-game">
        <div className="game-progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={SCRABBLE_LEVELS.length}
            aria-valuenow={currentLevel + 1}
            aria-label="Level progress"
          >
            <div
              className="progress-fill"
              style={{ width: `${((currentLevel + 1) / SCRABBLE_LEVELS.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Level {currentLevel + 1}/{SCRABBLE_LEVELS.length}
          </span>
        </div>

        <div className="definition-box">
          <p className="definition-text">{level.definition}</p>
          <p className="hint-text">
            {level.category} &middot; {level.hint}
          </p>
        </div>

        <div className={`word-builder ${shake ? 'shake' : ''}`}>
          <div className="built-word">
            {selectedLetters.length > 0 ? (
              selectedLetters.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  className="built-letter"
                  onClick={() => handleRemoveLetter(tile.id)}
                  aria-label={`Remove ${tile.letter}`}
                >
                  {tile.letter}
                </button>
              ))
            ) : (
              <p className="placeholder">Click letters below to build the word</p>
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
          <button className="btn-skip" onClick={handleSkip} disabled={settled}>
            Skip level
          </button>
        </div>
      </div>
    </div>
  );
}

export { SCRABBLE_LEVELS };

export default ConceptScrabble;
