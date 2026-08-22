import React, { useState } from 'react';
import '../styles/GameStyles.css';

const PUZZLES = [
  {
    definition: 'Region where gravity is so strong nothing escapes',
    sentence: 'A _____ is formed when a massive star collapses.',
    word: 'BLACK HOLE',
    blanks: 2,
  },
  {
    definition: 'Process of plant converting light to energy',
    sentence: '_____ is how plants make food from sunlight.',
    word: 'PHOTOSYNTHESIS',
    blanks: 1,
  },
  {
    definition: 'Substance speeding up reaction without being consumed',
    sentence: 'A _____ speeds up chemical reactions.',
    word: 'CATALYST',
    blanks: 1,
  },
  {
    definition: 'Boundary beyond which nothing can escape',
    sentence: 'The _____ is the point of no return in a black hole.',
    word: 'EVENT HORIZON',
    blanks: 2,
  },
  {
    definition: 'Measure of disorder in system',
    sentence: '_____ increases in isolated systems over time.',
    word: 'ENTROPY',
    blanks: 1,
  },
];

function WordPuzzle({ onBack }) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(PUZZLES[currentPuzzle].blanks).fill(''));
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [revealed, setRevealed] = useState(false);

  const puzzle = PUZZLES[currentPuzzle];

  const handleInputChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value.toUpperCase();
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const userAnswer = userAnswers.join(' ').trim();
    const correctAnswer = puzzle.word.trim();

    if (userAnswer === correctAnswer) {
      setMessage('✅ Correct! Excellent!');
      setScore(score + 100);
      setTimeout(() => {
        if (currentPuzzle < PUZZLES.length - 1) {
          setCurrentPuzzle(currentPuzzle + 1);
          setUserAnswers(Array(PUZZLES[currentPuzzle + 1].blanks).fill(''));
          setMessage('');
          setRevealed(false);
        }
      }, 1500);
    } else {
      setMessage('❌ Not quite right. Try again!');
    }
  };

  const handleReveal = () => {
    setRevealed(true);
    setMessage(`The answer is: ${puzzle.word}`);
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="game-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Word Puzzle</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="puzzle-game">
        <div className="game-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentPuzzle + 1) / PUZZLES.length) * 100}%`,
              }}
            ></div>
          </div>
          <span className="progress-text">
            Puzzle {currentPuzzle + 1}/{PUZZLES.length}
          </span>
        </div>

        <div className="puzzle-definition">
          <p>📖 {puzzle.definition}</p>
        </div>

        <div className="puzzle-sentence">
          <p>{puzzle.sentence}</p>
        </div>

        <div className="puzzle-inputs">
          {userAnswers.map((answer, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Word ${idx + 1}`}
              value={answer}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              className="puzzle-input"
              disabled={revealed}
            />
          ))}
        </div>

        {message && (
          <p
            className={`puzzle-message ${
              message.includes('✅') ? 'success' : 'error'
            }`}
          >
            {message}
          </p>
        )}

        <div className="puzzle-actions">
          <button
            className="btn-submit-puzzle"
            onClick={handleSubmit}
            disabled={userAnswers.some((a) => !a) || revealed}
          >
            Submit Answer
          </button>
          <button className="btn-hint" onClick={handleReveal} disabled={revealed}>
            Reveal Answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default WordPuzzle;