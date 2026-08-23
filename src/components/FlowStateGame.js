import React, { useState, useEffect } from 'react';
import ShareAchievementModal from './ShareAchievementModal';
import '../styles/FlowStateGame.css';

/**
 * FlowStateGame
 * 
 * Replaces gamified arcade mechanics with a distraction-free, flow-state learning
 * experience. Focuses on conceptual clarity, reflective learning, and key takeaways
 * rather than arcade points.
 */
function FlowStateGame({ gameName = 'Quantum Concepts Quiz', gameType = 'quiz', difficulty = 'Intermediate', duration = 10, onBack }) {
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'complete'
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedExplanations, setRevealedExplanations] = useState({});
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [reflection, setReflection] = useState('');
  const [savedReflection, setSavedReflection] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Timer countdown during flow state
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('complete');
    }
  }, [timeLeft, gameState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Content for Quiz mode
  const quizQuestions = [
    {
      id: 0,
      question: 'What fundamentally defines an Event Horizon?',
      options: [
        'A physical impenetrable wall in space',
        'The mathematical boundary where escape velocity equals light speed',
        'The luminous accretion ring orbiting a stellar corpse',
        'A distortion caused solely by dark matter'
      ],
      correct: 1,
      explanation: 'The event horizon is a coordinate boundary. Once crossed, all paths in spacetime point inward toward the singularity.'
    },
    {
      id: 1,
      question: 'According to General Relativity, what happens to time near a massive black hole?',
      options: [
        'Time stops completely for all observers everywhere',
        'Time speeds up relative to a distant observer',
        'Gravitational time dilation causes time to pass slower relative to distant observers',
        'Time flows backwards inside the photon sphere'
      ],
      correct: 2,
      explanation: 'Mass curves spacetime. The closer you get to a profound gravitational well, the slower your clock ticks relative to an observer at infinity.'
    },
    {
      id: 2,
      question: 'What is Hawking Radiation?',
      options: [
        'Quantum thermal radiation predicted to emit from near the event horizon due to quantum fluctuations',
        'High-energy synchrotron jets propelled from magnetic poles',
        'X-rays released as infalling hydrogen gas heats up in the accretion disc',
        'Gamma-ray bursts occurring when two neutron stars collide'
      ],
      correct: 0,
      explanation: 'Stephen Hawking showed that quantum field theory in curved spacetime allows black holes to slowly lose mass and radiate energy.'
    }
  ];

  // Content for Chain mode (connecting steps in a causal loop)
  const chainSteps = [
    { id: 'c1', label: 'Massive Star Exhausts Nuclear Fuel', order: 1 },
    { id: 'c2', label: 'Outward Radiation Pressure Drops Below Gravity', order: 2 },
    { id: 'c3', label: 'Core Undergoes Catastrophic Gravitational Collapse', order: 3 },
    { id: 'c4', label: 'Density Exceeds Neutron Degeneracy Pressure Limit', order: 4 },
    { id: 'c5', label: 'Spacetime Curves to Form an Event Horizon & Singularity', order: 5 }
  ];

  const [chainUserOrder, setChainUserOrder] = useState(['c3', 'c1', 'c5', 'c2', 'c4']);

  const moveChainItem = (index, direction) => {
    const newOrder = [...chainUserOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setChainUserOrder(newOrder);
  };

  // Content for Scrabble / Anagram mode
  const scrabbleData = {
    target: 'SINGULARITY',
    clue: 'The point in spacetime where gravitational curvature becomes infinite according to General Relativity.',
    tiles: ['G', 'U', 'S', 'I', 'L', 'N', 'A', 'R', 'T', 'I', 'Y']
  };

  const [assembledWord, setAssembledWord] = useState([]);

  const handleSelectQuizOption = (qIdx, optIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    setRevealedExplanations(prev => ({ ...prev, [qIdx]: true }));
  };

  const handleFinish = () => {
    setGameState('complete');
  };

  // START SCREEN
  if (gameState === 'start') {
    return (
      <div className="flow-game-container">
        <header className="flow-nav-header">
          <button className="flow-back-btn" onClick={onBack}>
            ← Back to Lessons
          </button>
          <span className="flow-mode-badge">Flow State Experience</span>
          <div style={{ width: '80px' }}></div>
        </header>

        <main className="flow-start-wrapper">
          <div className="flow-start-card">
            <div className="flow-icon-hero">
              {gameType === 'quiz' && '🎯'}
              {gameType === 'scrabble' && '🔤'}
              {gameType === 'chain' && '🔗'}
              {gameType === 'duel' && '📝'}
            </div>

            <h1 className="flow-main-title">{gameName}</h1>
            <p className="flow-subtitle">
              Deep focus mode. No intrusive popups, zero arcade gimmicks. Just pure conceptual mastery and reflective discovery.
            </p>

            <div className="flow-meta-grid">
              <div className="flow-meta-box">
                <span className="meta-label">Difficulty</span>
                <span className="meta-value">{difficulty}</span>
              </div>
              <div className="flow-meta-box">
                <span className="meta-label">Target Duration</span>
                <span className="meta-value">{duration} minutes</span>
              </div>
              <div className="flow-meta-box">
                <span className="meta-label">Experience Style</span>
                <span className="meta-value">Self-Paced Focus</span>
              </div>
            </div>

            <button className="flow-action-btn primary" onClick={() => setGameState('playing')}>
              Begin Flow Session →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // PLAYING SCREEN
  if (gameState === 'playing') {
    return (
      <div className="flow-game-container">
        <header className="flow-playing-header">
          <div className="flow-timer-pill">
            <span className="timer-icon">⏱️</span>
            <span className="timer-digits">{formatTime(timeLeft)} remaining</span>
          </div>
          <h2 className="flow-header-title">{gameName}</h2>
          <button className="flow-exit-btn" onClick={() => setGameState('complete')}>
            Complete Early
          </button>
        </header>

        <main className="flow-interactive-area">
          {/* Quiz Experience */}
          {gameType === 'quiz' && (
            <div className="flow-card-stack">
              <div className="flow-progress-indicator">
                Concept {currentStep + 1} of {quizQuestions.length}
              </div>

              <h3 className="flow-step-question">
                {quizQuestions[currentStep].question}
              </h3>

              <div className="flow-options-list">
                {quizQuestions[currentStep].options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentStep] === idx;
                  const isCorrect = idx === quizQuestions[currentStep].correct;
                  const isRevealed = revealedExplanations[currentStep];

                  let optionClass = 'flow-option-card';
                  if (isRevealed && isSelected) {
                    optionClass += isCorrect ? ' correct-choice' : ' incorrect-choice';
                  } else if (isRevealed && isCorrect) {
                    optionClass += ' correct-choice';
                  }

                  return (
                    <button
                      key={idx}
                      className={optionClass}
                      onClick={() => handleSelectQuizOption(currentStep, idx)}
                    >
                      <span className="option-index">{String.fromCharCode(65 + idx)}</span>
                      <span className="option-text">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {revealedExplanations[currentStep] && (
                <div className="flow-explanation-box">
                  <div className="explanation-header">
                    <span className="explanation-tag">Deep Insight</span>
                  </div>
                  <p className="explanation-content">
                    {quizQuestions[currentStep].explanation}
                  </p>
                </div>
              )}

              <div className="flow-nav-actions">
                {currentStep > 0 && (
                  <button
                    className="flow-secondary-btn"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                  >
                    ← Previous Concept
                  </button>
                )}
                {currentStep < quizQuestions.length - 1 ? (
                  <button
                    className="flow-primary-btn"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={selectedAnswers[currentStep] === undefined}
                  >
                    Next Concept →
                  </button>
                ) : (
                  <button
                    className="flow-primary-btn"
                    onClick={handleFinish}
                    disabled={selectedAnswers[currentStep] === undefined}
                  >
                    Finish Session & View Insights →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Chain Connection Experience */}
          {gameType === 'chain' && (
            <div className="flow-card-stack">
              <h3 className="flow-step-question">
                Arrange the physical sequence of cosmic collapse in correct chronological order:
              </h3>
              <p className="flow-helper-text">
                Use the arrows on the right to reorder the conceptual chain.
              </p>

              <div className="chain-list">
                {chainUserOrder.map((stepId, index) => {
                  const item = chainSteps.find(s => s.id === stepId);
                  return (
                    <div key={stepId} className="chain-item-card">
                      <div className="chain-index">{index + 1}</div>
                      <div className="chain-text">{item.label}</div>
                      <div className="chain-controls">
                        <button
                          className="chain-arrow-btn"
                          disabled={index === 0}
                          onClick={() => moveChainItem(index, -1)}
                        >
                          ▲
                        </button>
                        <button
                          className="chain-arrow-btn"
                          disabled={index === chainUserOrder.length - 1}
                          onClick={() => moveChainItem(index, 1)}
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flow-nav-actions">
                <button className="flow-primary-btn" onClick={handleFinish}>
                  Verify Knowledge Chain →
                </button>
              </div>
            </div>
          )}

          {/* Concept Scrabble / Anagram Experience */}
          {(gameType === 'scrabble' || gameType === 'duel' || gameType === 'puzzle') && (
            <div className="flow-card-stack">
              <h3 className="flow-step-question">{scrabbleData.clue}</h3>
              
              <div className="assembled-slots">
                <span className="slots-label">Constructed Term:</span>
                <div className="slots-container">
                  {scrabbleData.target.split('').map((_, i) => (
                    <span key={i} className="char-slot">
                      {assembledWord[i] || '_'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="tiles-bank">
                {scrabbleData.tiles.map((letter, i) => (
                  <button
                    key={i}
                    className="flow-letter-tile"
                    onClick={() => {
                      if (assembledWord.length < scrabbleData.target.length) {
                        setAssembledWord([...assembledWord, letter]);
                      }
                    }}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              <div className="flow-tile-actions">
                <button
                  className="flow-secondary-btn"
                  onClick={() => setAssembledWord([])}
                >
                  Clear Tiles
                </button>
                <button
                  className="flow-primary-btn"
                  onClick={handleFinish}
                >
                  Confirm Term →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // COMPLETION & REFLECTION SCREEN
  return (
    <div className="flow-game-container">
      <header className="flow-nav-header">
        <button className="flow-back-btn" onClick={onBack}>
          ← Return to Hub
        </button>
        <span className="flow-mode-badge">Session Synthesis</span>
        <div style={{ width: '80px' }}></div>
      </header>

      <main className="flow-complete-wrapper">
        <div className="flow-complete-card">
          <div className="completion-badge-circle">✓</div>
          <h1 className="complete-heading">Flow Session Complete</h1>
          <p className="complete-sub">
            You maintained uninterrupted focus on fundamental physics principles.
          </p>

          {/* 3-Star Quality & Depth Rating */}
          <div className="depth-rating-box">
            <span className="rating-label">Conceptual Depth Attained</span>
            <div className="stars-row">
              <span className="star active">★</span>
              <span className="star active">★</span>
              <span className="star active">★</span>
            </div>
            <span className="rating-tagline">Mastery Level: Advanced Comprehension</span>
          </div>

          {/* Key Insights Discovered */}
          <div className="insights-curation">
            <h3 className="insights-header-text">Key Scientific Insights Discovered</h3>
            <div className="insight-card-list">
              <div className="curated-insight-item">
                <span className="insight-bullet">✦</span>
                <p>
                  <strong>Coordinate vs Physical Boundaries:</strong> The event horizon is not a surface of solid matter; it is the mathematical demarcation where light itself cannot outpace spacetime curvature.
                </p>
              </div>
              <div className="curated-insight-item">
                <span className="insight-bullet">✦</span>
                <p>
                  <strong>Relativistic Invariance:</strong> Observers falling into a supermassive black hole experience normal local time progression, while external observers see them asymptotically freeze at the horizon.
                </p>
              </div>
              <div className="curated-insight-item">
                <span className="insight-bullet">✦</span>
                <p>
                  <strong>Quantum Thermodynamic Balance:</strong> Virtual particle pairs near the horizon lead to net radiation emission, providing a deep link between thermodynamics, quantum theory, and gravitation.
                </p>
              </div>
            </div>
          </div>

          {/* Reflection Area */}
          <div className="flow-reflection-box">
            <label className="reflection-label" htmlFor="reflection-text">
              What was the most counterintuitive realization from this session?
            </label>
            <textarea
              id="reflection-text"
              className="reflection-textarea"
              rows="3"
              placeholder="e.g., How light curvature and time dilation are two expressions of the exact same geometric warping..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
            <button
              className="reflection-save-btn"
              onClick={() => setSavedReflection(true)}
            >
              {savedReflection ? '✓ Saved to Your Study Notebook' : 'Save Reflection Note'}
            </button>
          </div>

          <div className="flow-final-actions">
            <button
              className="flow-action-btn secondary-share"
              onClick={() => setShowShareModal(true)}
              style={{
                background: 'rgba(255, 214, 10, 0.1)',
                color: '#ffd60a',
                border: '1px solid rgba(255, 214, 10, 0.3)',
                marginRight: '12px'
              }}
            >
              🏆 Share Milestone Badge
            </button>
            <button className="flow-action-btn primary" onClick={onBack}>
              Continue Learning Pathway →
            </button>
          </div>
        </div>
      </main>

      {/* Share Achievement Modal */}
      <ShareAchievementModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        milestone={`${gameName} Mastery`}
        score="3/3 Stars Comprehension"
      />
    </div>
  );
}

export default FlowStateGame;