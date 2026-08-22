import React, { useState, useEffect } from 'react';
import '../styles/GameStyles.css';

const DUEL_PAIRS = [
  { definition: 'Region where gravity is so strong nothing escapes', word: 'Black Hole' },
  { definition: 'Point of infinite density', word: 'Singularity' },
  { definition: 'Converting light to energy', word: 'Photosynthesis' },
  { definition: 'Substance speeding up reaction', word: 'Catalyst' },
  { definition: 'Measure of disorder', word: 'Entropy' },
  { definition: 'Bending of light by gravity', word: 'Gravitational Lensing' },
  { definition: 'Boundary of black hole', word: 'Event Horizon' },
  { definition: 'Organism that eats other organisms', word: 'Predator' },
];

function DefinitionDuel({ onBack }) {
  const [currentPair, setCurrentPair] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  const handleSubmit = () => {
    const pair = DUEL_PAIRS[currentPair];
    const userAnswer = userInput.trim().toLowerCase();
    const correctAnswer = pair.word.toLowerCase();

    if (userAnswer === correctAnswer) {
      setFeedback('✅ Correct!');
      setCorrect(true);
      setScore(score + 10);
      setUserInput('');
      setTimeout(() => {
        if (currentPair < DUEL_PAIRS.length - 1) {
          setCurrentPair(currentPair + 1);
          setFeedback('');
          setCorrect(false);
        } else {
          setGameActive(false);
        }
      }, 800);
    } else {
      setFeedback(`❌ Wrong! It was: ${pair.word}`);
      setCorrect(false);
    }
  };

  const pair = DUEL_PAIRS[currentPair];

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="game-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Definition Duel</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="duel-game">
        {/* Timer */}
        <div className={`timer ${timeLeft < 10 ? 'danger' : ''}`}>
          <div className="timer-circle">
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E0E0E0"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="3"
                strokeDasharray={`${(timeLeft / 60) * 282.7} 282.7`}
              />
            </svg>
            <span className="timer-text">{timeLeft}s</span>
          </div>
        </div>

        {gameActive ? (
          <>
            {/* Definition */}
            <div className="duel-definition">
              <p>{pair.definition}</p>
            </div>

            {/* Input */}
            <div className="duel-input-group">
              <input
                type="text"
                placeholder="Type your answer..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
                className={feedback ? (correct ? 'success' : 'error') : ''}
              />
              <button
                className="btn-duel-submit"
                onClick={handleSubmit}
                disabled={!userInput}
              >
                Submit
              </button>
            </div>

            {/* Feedback */}
            {feedback && <p className={`duel-feedback ${correct ? 'correct' : 'incorrect'}`}>{feedback}</p>}

            {/* Progress */}
            <p className="duel-progress">
              {currentPair + 1}/{DUEL_PAIRS.length}
            </p>
          </>
        ) : (
          <div className="game-over-screen">
            <h2>⏱️ Time's Up!</h2>
            <p className="final-score">{score}/80 Points</p>
            <p className="accuracy">
              {Math.round((score / (DUEL_PAIRS.length * 10)) * 100)}% Accuracy
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