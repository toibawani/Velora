import React, { useState } from 'react';
import '../styles/GameStyles.css';

const SCRABBLE_LEVELS = [
  {
    definition: 'Region where gravity is so strong nothing escapes',
    word: 'BLACKHOLE',
    hint: 'Two words, no space',
  },
  {
    definition: 'Point of infinite density at center of black hole',
    word: 'SINGULARITY',
    hint: '11 letters',
  },
  {
    definition: 'Boundary beyond which nothing can escape',
    word: 'EVENTHORIZON',
    hint: 'Three words, no space',
  },
  {
    definition: 'Process of plant converting light to energy',
    word: 'PHOTOSYNTHESIS',
    hint: 'Two words, no space',
  },
  {
    definition: 'Substance speeding up reaction without being consumed',
    word: 'CATALYST',
    hint: '8 letters',
  },
];

function ConceptScrabble({ onBack }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [shake, setShake] = useState(false);

  const level = SCRABBLE_LEVELS[currentLevel];
  const availableLetters = level.word.split('').sort(() => Math.random() - 0.5);

  const handleLetterClick = (letter, index) => {
    setSelectedLetters([...selectedLetters, { letter, index }]);
  };

  const handleRemoveLetter = (indexToRemove) => {
    setSelectedLetters(
      selectedLetters.filter((_, idx) => idx !== indexToRemove)
    );
  };

  const handleSubmit = () => {
    const formed = selectedLetters.map((l) => l.letter).join('');
    if (formed === level.word) {
      setMessage('✅ Correct! Amazing!');
      setScore(score + 100);
      setTimeout(() => {
        if (currentLevel < SCRABBLE_LEVELS.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setSelectedLetters([]);
          setMessage('');
        } else {
          setGameOver(true);
        }
      }, 1500);
    } else {
      setMessage('❌ Not quite right');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleSkip = () => {
    if (currentLevel < SCRABBLE_LEVELS.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setSelectedLetters([]);
      setMessage('');
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <div className="game-screen">
        <div className="game-over-screen">
          <h2>🎉 Game Complete!</h2>
          <p className="final-score">{score} Points</p>
          <p className="game-completed-msg">You completed all {SCRABBLE_LEVELS.length} levels!</p>
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
          ← Back
        </button>
        <h2>Concept Scrabble</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="scrabble-game">
        <div className="game-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentLevel + 1) / SCRABBLE_LEVELS.length) * 100}%`,
              }}
            ></div>
          </div>
          <span className="progress-text">
            Level {currentLevel + 1}/{SCRABBLE_LEVELS.length}
          </span>
        </div>

        <div className="definition-box">
          <p className="definition-text">{level.definition}</p>
          <p className="hint-text">💡 {level.hint}</p>
        </div>

        <div className={`word-builder ${shake ? 'shake' : ''}`}>
          <div className="built-word">
            {selectedLetters.length > 0 ? (
              selectedLetters.map((item, idx) => (
                <div
                  key={idx}
                  className="built-letter"
                  onClick={() => handleRemoveLetter(idx)}
                >
                  {item.letter}
                </div>
              ))
            ) : (
              <p className="placeholder">Click letters below to build the word</p>
            )}
          </div>
        </div>

        <div className="letters-grid">
          {availableLetters.map((letter, idx) => {
            const isUsed = selectedLetters.some((l) => l.index === idx);
            return (
              <button
                key={idx}
                className={`letter-btn ${isUsed ? 'used' : ''}`}
                onClick={() => !isUsed && handleLetterClick(letter, idx)}
                disabled={isUsed}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {message && <p className={`game-message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}

        <div className="game-actions">
          <button className="btn-submit" onClick={handleSubmit}>
            Submit Word
          </button>
          <button className="btn-skip" onClick={handleSkip}>
            Skip Level
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConceptScrabble;