import React, { useState, useCallback } from 'react';
import '../styles/GameStyles.css';

/**
 * Every answer carries an explanation of why it is right. A multiple choice
 * quiz that only tells you whether you were right teaches you the shape of
 * the question, not the thing being asked about.
 *
 * This was called the Quantum Quiz and had no quantum content in it at all:
 * five questions about photosynthesis, catalysts and entropy. It is now named
 * for what it actually is.
 */
const QUIZ_QUESTIONS = [
  {
    question: 'What is an event horizon?',
    options: [
      'The boundary beyond which nothing escapes a black hole',
      'A type of star',
      'A cosmic event',
      'A time period',
    ],
    correct: 0,
    category: 'Space',
    explanation:
      'It is a boundary in space, not a surface. Nothing inside can reach the outside, and nothing outside can fall in without crossing it.',
  },
  {
    question: 'What does photosynthesis do with light?',
    options: [
      'Converts light energy into chemical energy stored in sugar',
      'Converts it directly into heat',
      'Reflects it away',
      'Converts light into oxygen',
    ],
    correct: 0,
    category: 'Biology',
    explanation:
      'The energy ends up in the chemical bonds of sugar. The oxygen released is a by-product of splitting water, not the light being turned into it.',
  },
  {
    question: 'What does a catalyst do in a reaction?',
    options: [
      'Gets used up alongside the reactants',
      'Lowers the energy needed to start the reaction',
      'Raises the temperature of the reactants',
      'Makes the reaction permanent',
    ],
    correct: 1,
    category: 'Chemistry',
    explanation:
      'It opens a lower energy route. It is not consumed, which is why the same catalyst works over and over, and why enzymes can be reused.',
  },
  {
    question: 'What is gravitational lensing?',
    options: [
      'Light bent by the gravity of something massive',
      'A type of telescope',
      'Light refracting in water',
      'A fault in a camera lens',
    ],
    correct: 0,
    category: 'Space',
    explanation:
      'Mass curves spacetime and light follows the curve, so a distant galaxy can appear as several images, or a ring. Einstein predicted it from general relativity in 1915.',
  },
  {
    question: 'What does entropy count?',
    options: [
      'The energy moving inside a system',
      'How many microscopic arrangements look the same from outside',
      'The temperature of a system',
      'How fast the particles are moving',
    ],
    correct: 1,
    category: 'Physics',
    explanation:
      'That is why a drop of ink spreads through water. There are far more ways for the ink to be spread out than concentrated, so it almost never goes back.',
  },
  {
    question: 'What makes an electron an electron rather than a wave of probability?',
    options: [
      'Nothing; it is genuinely both until measured',
      'It is smaller than light',
      'It is always moving',
      'It has a measurable charge',
    ],
    correct: 0,
    category: 'Quantum',
    explanation:
      'Interference experiments show light behaving as a wave, and photoelectric experiments show it arriving in lumps. Which one you observe depends on the experiment, not on the thing.',
  },
  {
    question: 'What is a black hole event horizon made of?',
    options: [
      'Solid matter crushed into the centre',
      'Nothing; it is a mathematical boundary, not a surface',
      'A shell of iron',
      'Frozen light',
    ],
    correct: 1,
    category: 'Space',
    explanation:
      'There is no surface to land on. If the Sun were replaced by a black hole of the same mass, Earth would keep its orbit and just lose the light.',
  },
  {
    question: 'What does DNA do that a gene does not?',
    options: [
      'Nothing; they are the same thing',
      'DNA is copied faithfully when a cell divides, which genes do not do',
      'DNA is found only in cells, genes are found everywhere',
      'DNA carries the instructions, genes are the instructions',
    ],
    correct: 1,
    category: 'Biology',
    explanation:
      'A gene is a stretch of DNA. The copying machinery works on all of it, which is why the whole set is duplicated when a cell divides.',
  },
  {
    question: 'What is the relationship between pressure, volume and temperature in a gas?',
    options: [
      'Halving the volume doubles the pressure at constant temperature',
      'Halving the volume halves the pressure',
      'Pressure and volume are unrelated',
      'Halving the volume quadruples the pressure',
    ],
    correct: 0,
    category: 'Physics',
    explanation:
      'Same temperature means the same speed of particles, so squeezing the same number of them into half the space doubles how often they hit the walls.',
  },
  {
    question: 'What is a half-life?',
    options: [
      'How long a substance takes to stop working',
      'How long until half the atoms in a sample have decayed',
      'The time it takes for a sample to be completely gone',
      'How often an atom decays in a second',
    ],
    correct: 1,
    category: 'Physics',
    explanation:
      'It never reaches zero, only keeps approaching it. After two half-lives a quarter remains, after three an eighth, and that is what makes carbon dating work.',
  },
];

const POINTS_PER_CORRECT = 10;

function QuantumQuiz({ onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];
  const isLast = currentQuestion === QUIZ_QUESTIONS.length - 1;

  const handleAnswerClick = useCallback(
    (index) => {
      // Without this a second click on another option rewrote the answer after
      // the result was already showing.
      if (answered) return;
      setSelectedAnswer(index);
      setAnswered(true);
      if (index === question.correct) {
        setScore((prev) => prev + POINTS_PER_CORRECT);
        setCorrectCount((prev) => prev + 1);
      }
    },
    [answered, question.correct]
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      setGameOver(true);
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  }, [isLast]);

  if (gameOver) {
    const total = QUIZ_QUESTIONS.length;
    const percentage = Math.round((correctCount / total) * 100);

    return (
      <div className="game-screen">
        <div className="game-over-screen">
          <h2>Quiz complete</h2>
          <p className="final-score">
            {correctCount} of {total} correct
          </p>
          <p className="percentage">{percentage}%</p>
          <div className="performance">
            {percentage === 100 && <p>Every one right.</p>}
            {percentage >= 80 && percentage < 100 && (
              <p>Worth another look at the one you missed below.</p>
            )}
            {percentage < 80 && (
              <p>Play it again and read the explanations, they are the point.</p>
            )}
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
          &larr; Back
        </button>
        <h2>Concept Check</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="quiz-game">
        <div className="game-progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={QUIZ_QUESTIONS.length}
            aria-valuenow={currentQuestion + 1}
            aria-label="Quiz progress"
          >
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
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
          {question.options.map((option, index) => {
            const isChosen = selectedAnswer === index;
            const isCorrectOption = index === question.correct;
            return (
              <button
                key={option}
                type="button"
                className={`quiz-option ${
                  isChosen ? (isCorrectOption ? 'correct' : 'incorrect') : ''
                } ${answered && isCorrectOption ? 'show-correct' : ''}`}
                onClick={() => handleAnswerClick(index)}
                disabled={answered}
                aria-pressed={isChosen}
              >
                <span className="option-number">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {answered && isCorrectOption && <span className="checkmark">&#10003;</span>}
                {answered && isChosen && !isCorrectOption && <span className="cross">&#10007;</span>}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="quiz-feedback">
            <p className={selectedAnswer === question.correct ? 'result-right' : 'result-wrong'}>
              {selectedAnswer === question.correct ? 'Correct.' : 'Not quite.'}
            </p>
            <p className="quiz-explanation">{question.explanation}</p>
          </div>
        )}

        {answered && (
          <button className="btn-next" onClick={handleNext}>
            {isLast ? 'Finish' : 'Next question'}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuantumQuiz;
