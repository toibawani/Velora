import React, { useState, useEffect } from 'react';
import '../styles/FlowStateGame.css';

function FlowStateGame({ gameName, gameType, difficulty, duration, onBack }) {
  const [gameState, setGameState] = useState('start'); // start, playing, complete
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [insights, setInsights] = useState([]);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleGameComplete();
    }
  }, [timeLeft, gameState]);

  const handleGameComplete = () => {
    setGameState('complete');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // START STATE
  if (gameState === 'start') {
    return (
      <div className="learn-container">
        <header className="learn-header">
          <button className="learn-back-btn" onClick={onBack}>
            ← Back
          </button>
          <h1>{gameName}</h1>
          <div style={{ width: '60px' }}></div>
        </header>

        <main style={{ padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div className="flow-start">
            <div className="flow-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {gameType === 'quiz' && '🎯'}
              {gameType === 'scrabble' && '🔤'}
              {gameType === 'chain' && '🔗'}
            </div>

            <h2 className="flow-title">Ready to Master This Concept?</h2>

            <div className="flow-info">
              <div className="info-item">
                <span className="info-label">Difficulty</span>
                <span className="info-value">{difficulty}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Duration</span>
                <span className="info-value">{duration} min</span>
              </div>
              <div className="info-item">
                <span className="info-label">Focus Level</span>
                <span className="info-value">High</span>
              </div>
            </div>

            <p className="flow-desc">
              This learning experience is designed for deep focus. No distractions, no points,
              just you and the concepts. You'll discover key insights along the way.
            </p>

            <button
              className="flow-start-btn"
              onClick={() => setGameState('playing')}
            >
              Enter Flow State →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // PLAYING STATE
  if (gameState === 'playing') {
    return (
      <div className="learn-container">
        <div className="flow-header">
          <div className="flow-timer">
            <span className="timer-label">Time</span>
            <span className="timer-value">{formatTime(timeLeft)}</span>
          </div>
          <h2 className="flow-title-small">{gameName}</h2>
          <div style={{ width: '80px' }}></div>
        </div>

        <main className="flow-playing">
          <div className="flow-content">
            <p className="flow-instruction">
              Focus on understanding, not points. You'll see insights at the end.
            </p>

            {gameType === 'quiz' && (
              <div className="quiz-container">
                <h3 className="quiz-question">What is an event horizon?</h3>
                <div className="quiz-options">
                  <button className="quiz-option">The boundary of a black hole</button>
                  <button className="quiz-option">A type of star</button>
                  <button className="quiz-option">A cosmic event</button>
                  <button className="quiz-option">A time period</button>
                </div>
              </div>
            )}

            {gameType === 'scrabble' && (
              <div className="scrabble-container">
                <h3 className="scrabble-prompt">Build the word from these letters:</h3>
                <div className="letter-tiles">
                  {['S', 'I', 'N', 'G', 'U', 'L'].map((letter) => (
                    <div key={letter} className="letter-tile">
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // COMPLETE STATE
  if (gameState === 'complete') {
    return (
      <div className="learn-container">
        <header className="learn-header">
          <button className="learn-back-btn" onClick={onBack}>
            ← Back
          </button>
          <h1>Learning Complete</h1>
          <div style={{ width: '60px' }}></div>
        </header>

        <main style={{ padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div className="flow-complete">
            <div className="complete-icon">✓</div>

            <h2 className="complete-title">You've Made Progress</h2>

            <div className="insights-section">
              <h3 className="insights-title">Key Insights You Discovered</h3>
              <div className="insights-list">
                <div className="insight-item">
                  <span className="insight-icon">💡</span>
                  <p className="insight-text">
                    Event horizons aren't physical objects—they're mathematical boundaries where escape velocity exceeds light speed.
                  </p>
                </div>
                <div className="insight-item">
                  <span className="insight-icon">💡</span>
                  <p className="insight-text">
                    Time behaves differently near black holes. What takes seconds for you takes years for observers far away.
                  </p>
                </div>
                <div className="insight-item">
                  <span className="insight-icon">💡</span>
                  <p className="insight-text">
                    Black holes aren't cosmic vacuum cleaners. Matter in orbit can emit incredible energy before falling in.
                  </p>
                </div>
              </div>
            </div>

            <div className="reflection-section">
              <h3 className="reflection-title">Reflect on Your Learning</h3>
              <textarea
                className="reflection-input"
                placeholder="What's one thing you learned today that surprised you?"
                rows="4"
              />
            </div>

            <div className="complete-actions">
              <button className="action-btn secondary" onClick={onBack}>
                Back to Lessons
              </button>
              <button className="action-btn primary">
                Continue Learning →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default FlowStateGame;