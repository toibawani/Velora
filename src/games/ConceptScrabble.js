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
  }, [isLastLevel]);

  const handleSubmit = useCallback(() => {
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
    advanceRef.current = setTimeout(goToNextLevel, 1200);
  }, [goToNextLevel, level.word, selectedLetters]);

  const handleSkip = useCallback(() => {
    setSkipped((prev) => prev + 1);
    goToNextLevel();
  }, [goToNextLevel]);

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
          <button className="btn-submit" onClick={handleSubmit} disabled={selectedLetters.length === 0}>
            Submit word
          </button>
          <button className="btn-skip" onClick={handleSkip}>
            Skip level
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConceptScrabble;
