import React, { useState } from 'react';
import '../styles/GameStyles.css';

const QUIZ_QUESTIONS = [
  {
    question: 'What is an event horizon?',
    options: [
      'The boundary of a black hole',
      'A type of star',
      'A cosmic event',
      'A time period',
    ],
    correct: 0,
    category: 'Space Science',
  },
  {
    question: 'What is photosynthesis?',
    options: [
      'Plant growth process',
      'Converting light energy to chemical energy',
      'Making plants green',
      'Eating light',
    ],
    correct: 1,
    category: 'Biology',
  },
  {
    question: 'What is a catalyst?',
    options: [
      'A chemical that burns',
      'Something that starts a reaction',
      'A substance speeding up reaction without being consumed',
      'A type of enzyme',
    ],
    correct: 2,
    category: 'Chemistry',
  },
  {
    question: 'What is gravitational lensing?',
    options: [
      'Bending of light by gravity',
      'A type of telescope',
      'Light refraction in water',
      'Lens distortion',
    ],
    correct: 0,
    category: 'Space Science',
  },
  {
    question: 'What is entropy?',
    options: [
      'Energy in motion',
      'Measure of disorder in system',
      'Heat temperature',
      'Molecular speed',
    ],
    correct: 1,
    category: 'Physics',
  },
];

function QuantumQuiz({ onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [animation, setAnimation] = useState('');

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswerClick = (index) => {
    if (!answered) {
      setSelectedAnswer(index);
      setAnswered(true);
      if (index === question.correct) {
        setAnimation('correct');
        setScore(score + 10);
      } else {
        setAnimation('incorrect');
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setAnimation('');
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    const percentage = Math.round((score / (QUIZ_QUESTIONS.length * 10)) * 100);
    return (
      <div className="game-screen">
        <div className="game-over-screen">
          <h2>🏁 Quiz Complete!</h2>
          <p className="final-score">{score}/{QUIZ_QUESTIONS.length * 10}</p>
          <p className="percentage">{percentage}% Correct</p>
          <div className="performance">
            {percentage >= 80 && <p>🌟 Outstanding performance!</p>}
            {percentage >= 60 && percentage < 80 && <p>👍 Great job!</p>}
            {percentage < 60 && <p>📚 Keep practicing!</p>}
          </div>
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
        <h2>Quantum Quiz</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="quiz-game">
        <div className="game-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              }}
            ></div>
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
          </span>
        </div>

        <div className="category-badge">{question.category}</div>

        <div className="quiz-question">
          <h3>{question.question}</h3>
        </div>

        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${
                selectedAnswer === index
                  ? index === question.correct
                    ? 'correct'
                    : 'incorrect'
                  : ''
              } ${answered && index === question.correct ? 'show-correct' : ''}`}
              onClick={() => handleAnswerClick(index)}
              disabled={answered}
            >
              <span className="option-number">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {answered && index === question.correct && <span className="checkmark">✓</span>}
              {answered && selectedAnswer === index && index !== question.correct && (
                <span className="cross">✗</span>
              )}
            </button>
          ))}
        </div>

        {answered && (
          <div className={`quiz-feedback ${animation}`}>
            {selectedAnswer === question.correct ? (
              <p>✅ Correct! Great job!</p>
            ) : (
              <p>❌ Incorrect. The answer was: {question.options[question.correct]}</p>
            )}
          </div>
        )}

        {answered && (
          <button className="btn-next" onClick={handleNext}>
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuantumQuiz;