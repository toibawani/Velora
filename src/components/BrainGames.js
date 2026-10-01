import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Brain,
  Zap,
  Lightbulb,
  MessageSquare,
  Check
} from 'lucide-react';
import { sanitizeText } from '../utils/sanitize';
import { KEYS, EXPLANATION_BOARD, readValue, writeValue } from '../utils/storage';
import { trackEvent } from '../utils/analytics';
import '../styles/BrainGames.css';

/**
 * VELORA Brain Games Suite
 *
 * Thoughtful, idea-driven mental games built for genuinely curious minds:
 * 1. Connect the Concept (Five terms, one hidden connective thread across subjects)
 * 2. Counterintuitive: True or Myth (Rapid intuition checks with deep explanations)
 * 3. Explain It Back (30-second Feynman sprint: write it like you're talking to a friend)
 */

// ============================================================================
// GAME 1: CONNECT THE CONCEPT
// ============================================================================
const CONNECT_PUZZLES = [
  {
    id: 'dissipation-arrow',
    title: 'The Unwinding Universe',
    difficulty: 'Challenging',
    terms: [
      { name: 'Entropy', subject: 'Physics', clue: 'Disorder never spontaneously reverses on its own' },
      { name: 'Evolution', subject: 'Biology', clue: 'Organisms consume free energy to maintain local order' },
      { name: 'Radioactive Decay', subject: 'Chemistry', clue: 'Unstable atomic nuclei shed particles into lower states' },
      { name: 'Stoicism', subject: 'Philosophy', clue: 'Acceptance that all physical assemblies inevitably dissolve' },
      { name: 'Second Law of Thermodynamics', subject: 'Physics', clue: 'The cosmic rule that gives time its forward arrow' },
    ],
    question: 'What single fundamental thread links all five of these concepts?',
    options: [
      'The one-way arrow of time and nature’s dissipation of ordered energy',
      'The microscopic behavior of covalent chemical bonds',
      'The mathematical foundations of calculus and differential rates',
      'The human psychological instinct for self-preservation',
    ],
    correctIdx: 0,
    insight: 'All five describe the one-way arrow of time. In physics and chemistry, entropy and radioactive decay disperse concentrated energy into random ambient heat. In biology, life survives only by pumping entropy outward into the environment. And 1,700 years before Clausius wrote the second law, Marcus Aurelius built Stoic philosophy around accepting that nature relentlessly unwinds everything composed of matter.',
    hardTerm: 'Stoicism',
  },
  {
    id: 'homeostatic-equilibrium',
    title: 'The Great Balancing Acts',
    difficulty: 'Medium',
    terms: [
      { name: 'Separation of Powers', subject: 'Political Science', clue: 'Three branches checking and balancing each other' },
      { name: 'Homeostasis', subject: 'Biology', clue: 'Shivering or sweating to keep body temperature steady' },
      { name: 'Le Chatelier’s Principle', subject: 'Chemistry', clue: 'A chemical reaction shifts to oppose any external pressure' },
      { name: 'Market Equilibrium', subject: 'Economics', clue: 'Prices rise when scarce and fall when abundant' },
      { name: 'Negative Feedback Loops', subject: 'Cybernetics', clue: 'A thermostat turning off the furnace once target heat is reached' },
    ],
    question: 'What core organizational principle connects every one of these systems?',
    options: [
      'Self-correcting negative feedback systems that push back against destabilizing extremes',
      'The historical triumph of 18th-century European Enlightenment theory',
      'The strict conservation of mechanical momentum across closed boundaries',
      'Cognitive biases in human decision-making under stress',
    ],
    correctIdx: 0,
    insight: 'Every system here is a self-regulating negative feedback loop. When a parameter gets nudged too high, internal counter-forces push it back down: sweating cools a fever, competition lowers inflated prices, and independent courts strike down executive overreach. Without negative feedback, systems experience runaways and collapse.',
    hardTerm: 'Le Chatelier’s Principle',
  },
  {
    id: 'rational-updating',
    title: 'How Truth Is Refined',
    difficulty: 'Hard',
    terms: [
      { name: 'Bayes’ Theorem', subject: 'Mathematics', clue: 'Updating probabilities mathematically when fresh data arrives' },
      { name: 'Falsifiability', subject: 'Philosophy of Science', clue: 'A theory is only scientific if you can imagine evidence that disproves it' },
      { name: 'Cognitive Dissonance', subject: 'Psychology', clue: 'The mental sting when facts contradict your treasured beliefs' },
      { name: 'Opportunity Cost', subject: 'Economics', clue: 'Weighing what you sacrifice against what you gain' },
      { name: 'Occam’s Razor', subject: 'Logic', clue: 'Shaving away extraneous assumptions when explaining phenomena' },
    ],
    question: 'What is the deep intellectual thread binding these five?',
    options: [
      'Frameworks for navigating uncertainty and updating beliefs when reality pushes back',
      'Techniques for winning public forensic debates against hostile opponents',
      'The biological architecture of the human prefrontal cortex',
      'Mathematical limits on computational processing speed',
    ],
    correctIdx: 0,
    insight: 'These are the premier intellectual tools developed by humanity to overcome our built-in cognitive flaws. Bayes updates our priors, Popper demands we test what could break our ideas, and cognitive dissonance is the internal friction we feel when forced to admit we were wrong.',
    hardTerm: 'Cognitive Dissonance',
  },
];

function ConnectConceptGame() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [revealedClues, setRevealedClues] = useState({});

  const puzzle = CONNECT_PUZZLES[puzzleIdx];

  const toggleClue = (idx) => {
    setRevealedClues((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
  };

  const nextPuzzle = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setRevealedClues({});
    setPuzzleIdx((prev) => (prev + 1) % CONNECT_PUZZLES.length);
  };

  const isCorrect = selectedOption === puzzle.correctIdx;

  return (
    <div className="bg-game-card">
      <div className="bg-game-header">
        <div>
          <span className="bg-game-kicker">DAILY CONCEPT THREAD</span>
          <h3 className="bg-game-title">Connect the Concept: {puzzle.title}</h3>
        </div>
        <span className="bg-difficulty-badge">{puzzle.difficulty}</span>
      </div>

      <p className="bg-game-prompt">
        Inspect the five concepts below. Each belongs to a different subject, but a single deep thread connects them all. Tap any card to reveal its context clue.
      </p>

      {/* 5 Concept Cards */}
      <div className="bg-terms-grid">
        {puzzle.terms.map((term, i) => (
          <button
            key={term.name}
            type="button"
            className={`bg-term-card ${revealedClues[i] ? 'clue-open' : ''}`}
            onClick={() => toggleClue(i)}
            aria-expanded={Boolean(revealedClues[i])}
          >
            <div className="bg-term-subject">{term.subject}</div>
            <div className="bg-term-name">{term.name}</div>
            {revealedClues[i] ? (
              <div className="bg-term-clue">{term.clue}</div>
            ) : (
              <div className="bg-term-hint-action">Tap for clue</div>
            )}
          </button>
        ))}
      </div>

      {/* Question & Options */}
      <div className="bg-options-section">
        <h4 className="bg-question-text">{puzzle.question}</h4>
        <div className="bg-options-list">
          {puzzle.options.map((opt, i) => {
            let stateClass = '';
            if (isAnswered) {
              if (i === puzzle.correctIdx) stateClass = 'correct';
              else if (i === selectedOption) stateClass = 'wrong';
            }
            return (
              <button
                key={i}
                type="button"
                className={`bg-option-btn ${stateClass} ${selectedOption === i ? 'selected' : ''}`}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
              >
                <span className="bg-option-marker">{String.fromCharCode(65 + i)}</span>
                <span className="bg-option-text">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* End / Feedback Screen */}
      {isAnswered && (
        <div className={`bg-result-card ${isCorrect ? 'result-success' : 'result-miss'}`}>
          <div className="bg-result-header">
            {isCorrect ? (
              <CheckCircle2 className="result-icon text-success" size={24} />
            ) : (
              <HelpCircle className="result-icon text-warning" size={24} />
            )}
            <div>
              <h4>
                {isCorrect
                  ? `You spotted the thread! The ${puzzle.hardTerm} connection was the subtle one.`
                  : `Almost! The ${puzzle.hardTerm} link is what trips most people up.`}
              </h4>
            </div>
          </div>
          <p className="bg-result-insight">{puzzle.insight}</p>
          <div className="bg-result-actions">
            <button type="button" className="bg-btn bg-btn-primary" onClick={nextPuzzle}>
              Next Connection <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 2: COUNTERINTUITIVE (TRUE OR MYTH)
// ============================================================================
const MYTH_QUESTIONS = [
  {
    id: 'glass-liquid',
    claim: 'Ancient cathedral stained glass is thicker at the bottom because glass is a slow-moving liquid that sags downward over centuries.',
    answer: false, // MYTH
    label: 'Myth',
    explanation:
      'Medieval window glass was blown into a cylinder and spun flat, the crown glass technique, which left the rim thicker than the centre because the glass had to cool fastest there. Glaziers installed those panes with the heavy edge at the bottom. Nothing about the glass flowing downward is involved.',
    subject: 'Materials Science & History',
    sourceUrl: 'https://en.wikipedia.org/wiki/Crown_glass'
  },
  {
    id: 'feather-drop',
    claim: 'Inside an evacuated vacuum chamber with zero air resistance, a 20 kg iron sphere and a falcon feather hit the ground at the exact same millisecond.',
    answer: true, // TRUE
    label: 'True',
    explanation:
      'Gravity pulls harder on the heavy ball, and the heavy ball resists being sped up by exactly the same proportion, so in a vacuum the two effects cancel and everything falls at the same rate. This is the equivalence principle, and Apollo 15’s David Scott demonstrated it on the Moon in 1971 with a geologist’s hammer and a falcon feather.',
    subject: 'Physics',
    sourceUrl: 'https://en.wikipedia.org/wiki/Free_fall'
  },
  {
    id: 'mpemba-effect',
    claim: 'Under specific thermodynamic conditions, an open container of warm water can begin freezing faster than an identical container of cold water.',
    answer: true, // TRUE
    label: 'True',
    explanation:
      'This is the Mpemba effect, named after Erasto Mpemba, a Tanzanian student who raised it with his teacher in 1963, and which Aristotle appears to have noted earlier. It is real but not fully explained. Evaporation from the hot sample reduces its mass, convection currents move heat upwards faster, and dissolved gases change where ice crystals nucleate. The effect does not always appear.',
    subject: 'Thermodynamics',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mpemba_effect'
  },
  {
    id: 'sink-coriolis',
    claim: 'Water drains out of household bathroom sinks in opposite spiral directions in Sydney versus New York because of the Earth’s Coriolis effect.',
    answer: false, // MYTH
    label: 'Myth',
    explanation: 'The Coriolis force generated by Earth’s 24-hour rotation is real and decisive for thousand-kilometer hurricanes, but at the scale of a 30-centimeter basin it is far too weak to beat the shape of the sink, the angle of the faucet jet, and whatever swirl the water was already carrying.',
    subject: 'Geophysics',
    sourceUrl: 'https://en.wikipedia.org/wiki/Coriolis_effect'
  },
  {
    id: 'blind-spot',
    claim: 'The human eye contains a literal blind spot in each retina that has zero photoreceptors, but your visual cortex hallucinates the missing scenery.',
    answer: true, // TRUE
    label: 'True',
    explanation:
      'The optic nerve leaves the back of the eyeball, and where it leaves there is no room for rods or cones. You have a blind patch about the size of a coin in each eye right now, and you cannot see it, because the visual system fills in from the surrounding retina rather than reporting a hole. It is filling in rather than imagining, but the description is close enough that people call it hallucinating.',
    subject: 'Neurobiology',
    sourceUrl: 'https://en.wikipedia.org/wiki/Blind_spot_(vision)'
  },
  {
    id: 'napoleon-height',
    claim: 'Napoleon Bonaparte was exceptionally short compared to other 18th-century French men.',
    answer: false, // MYTH
    label: 'Myth',
    explanation: 'The height taken down at his death on St Helena was 5 feet 2 inches, but that was in French inches, and the French and English inches were different lengths. A London reader heard “five foot two” and pictorialised a child; converted to English units he stood roughly 5 foot 7 (about 170 cm), a little above the average Frenchman of his era. The short tyrant was a character the British cartoonist James Gillray invented, not a measurement.',
    subject: 'History',
    sourceUrl: 'https://en.wikipedia.org/wiki/Napoleon'
  }
];

function TrueOrMythGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => readValue(KEYS.MYTH_STREAK, 0));
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const question = MYTH_QUESTIONS[currentIdx];

  const handleAnswer = (choice) => {
    if (isAnswered) return;
    const isCorrect = choice === question.answer;
    setSelectedAnswer(choice);
    setIsAnswered(true);
    setTotalAnswered((prev) => prev + 1);
    trackEvent('myth_question_answered', { subject: question.subject, correct: isCorrect });

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setCorrectCount((prev) => prev + 1);
      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        writeValue(KEYS.MYTH_STREAK, nextStreak);
      }
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => (prev + 1) % MYTH_QUESTIONS.length);
  };

  const isCorrect = selectedAnswer === question.answer;

  return (
    <div className="bg-game-card">
      <div className="bg-game-header">
        <div>
          <span className="bg-game-kicker">RAPID INTUITION CHECK</span>
          <h3 className="bg-game-title">Counterintuitive: True or Myth?</h3>
        </div>
        <div className="bg-streak-counter">
          <Zap size={15} className="streak-icon" />
          <span>Streak: <strong>{streak}</strong></span>
          <small>(Best: {bestStreak})</small>
        </div>
      </div>

      <div className="bg-myth-question-box">
        <span className="bg-myth-subject-tag">{question.subject}</span>
        <blockquote className="bg-myth-claim">
          "{question.claim}"
        </blockquote>
      </div>

      {!isAnswered ? (
        <div className="bg-myth-actions-row">
          <button
            type="button"
            className="bg-myth-btn bg-myth-true"
            onClick={() => handleAnswer(true)}
          >
            <CheckCircle2 size={18} />
            <span>It’s Real (True)</span>
          </button>
          <button
            type="button"
            className="bg-myth-btn bg-myth-false"
            onClick={() => handleAnswer(false)}
          >
            <XCircle size={18} />
            <span>It’s a Myth</span>
          </button>
        </div>
      ) : (
        <div className={`bg-result-card ${isCorrect ? 'result-success' : 'result-miss'}`}>
          <div className="bg-result-header">
            {isCorrect ? (
              <CheckCircle2 className="result-icon text-success" size={24} />
            ) : (
              <XCircle className="result-icon text-danger" size={24} />
            )}
            <div>
              <h4>
                {isCorrect ? 'Intuition confirmed!' : `Surprise: It’s actually ${question.label}.`}
              </h4>
            </div>
          </div>
          <p className="bg-result-insight">{question.explanation}</p>
          {question.sourceUrl && (
            <p className="bg-result-source">
              <a href={question.sourceUrl} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </p>
          )}
          <div className="bg-result-actions">
            <button type="button" className="bg-btn bg-btn-primary" onClick={nextQuestion}>
              Next Intuition Check <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {totalAnswered >= 5 && (
        <div className="bg-session-summary">
          <span>Session progress: <strong>{correctCount} / {totalAnswered}</strong> intuition checks mastered.</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 3: EXPLAIN IT BACK (The 30-Second Feynman Sprint)
// ============================================================================
const EXPLAIN_PROMPTS = [
  {
    id: 'momentum',
    term: 'Momentum',
    subject: 'Physics',
    targetAudience: 'Explain it to a smart 14-year-old without using formulas or circular words.',
    keyConcepts: ['speed', 'mass', 'heavy', 'stop', 'truck', 'moving', 'force', 'hard'],
    peerExplanations: [
      {
        // These used to be attributed to 'Richard Feynman, Lectures on Physics
        // (1961)' and 'John Rawls, A Theory of Justice (1971)': real published
        // works, quoted from memory, with no page reference and no way for a
        // reader to check the words were ever said. Making up words for a named
        // person is the same class of fabrication as an invented leaderboard and
        // worse, because the name is real and the reader cannot tell. The
        // explanations are ours, so they are labelled ours, and where a claim is
        // genuinely the thinker's it carries a source you can open.
        body:
          'Momentum is how hard something is to bring to a dead stop. A freight train creeping at 3 mph and a bullet flying at 1,000 mph both carry enormous momentum, because one has immense mass and the other has immense speed.',
        by: 'VELORA',
        source: null,
      },
      {
        body:
          'It’s why you can catch a tennis ball traveling 40 mph with bare hands, but catching a bowling ball traveling 40 mph will break your wrist.',
        by: 'VELORA',
        source: null,
      }
    ]
  },
  {
    id: 'epigenetics',
    term: 'Epigenetics',
    subject: 'Biology',
    targetAudience: 'Explain how two cells with identical DNA can behave completely differently.',
    keyConcepts: ['tag', 'switch', 'read', 'book', 'mark', 'recipe', 'gene', 'turn'],
    peerExplanations: [
      {
        body:
          'Your DNA is a cookbook containing every recipe you could ever cook. Epigenetics are the post-it notes and paperclips that mark which specific page is open in the kitchen today.',
        by: 'VELORA',
        source: null,
      },
      {
        body:
          'Your genome is a piano keyboard; epigenetics is the sheet music deciding which keys get pressed and which stay silent.',
        by: 'VELORA',
        source: null,
      }
    ]
  },
  {
    id: 'veil-of-ignorance',
    term: 'Veil of Ignorance',
    subject: 'Philosophy',
    targetAudience: 'Explain John Rawls’ test for fairness to someone who thinks they are self-made.',
    keyConcepts: ['blind', 'slice', 'born', 'rules', 'cake', 'fair', 'know', 'who'],
    peerExplanations: [
      {
        // Rawls's own account of the device is in A Theory of Justice, section 3,
        // and this summary is close enough to check it against. Unlike the entries
        // above it is the thinker's argument, so it keeps a citable source -- and
        // it is a paraphrase written here, not a quotation, which is why the
        // rendering labels it as a summary rather than as his words.
        body:
          'Imagine setting the rules of society before you know who you will be born as: rich or poor, healthy or disabled, majority or minority. Lacking that knowledge, you would design rules that protect the least fortunate, because that could be you.',
        by: 'VELORA',
        source: {
          label: 'Rawls, A Theory of Justice (1971), section 3',
          url: 'https://plato.stanford.edu/entries/justice-distributive/',
        },
      },
      {
        body:
          'It’s the universal cake-cutting rule: one person cuts, the other chooses first. Ignorant of which piece you will get, you slice right down the exact center.',
        by: 'VELORA',
        source: null,
      }
    ]
  },
  {
    id: 'supply-and-demand',
    term: 'Supply and Demand',
    subject: 'Economics',
    targetAudience: 'Explain to someone who has never heard the phrase why the price of anything moves.',
    keyConcepts: ['price', 'signal', 'expensive', 'buy fewer', 'push', 'plan', 'supply', 'demand'],
    peerExplanations: [
      {
        body:
          'A price is a signal, not a setting. When tomatoes get expensive, two things happen at once: people buy fewer of them, and people who were sitting on unsold tomatoes plant more. Both movements push the price back down. Nobody planned it, and nobody is in charge.',
        by: 'VELORA',
        source: null,
      },
      {
        body:
          'It is the escalator in the wrong direction. If a shop marks up a scarce item and sells out, the higher price tells every seller in the country to get hold of more of it. More supply and less demand, and the price slides back toward where it started.',
        by: 'VELORA',
        source: null,
      }
    ]
  },
  {
    id: 'plate-tectonics',
    term: 'Plate Tectonics',
    subject: 'Geography',
    targetAudience: 'Explain to a teenager why there are mountains, why there are earthquakes, and why the continents do not fit a globe.',
    keyConcepts: ['crust', 'move', 'sea', 'floor', 'push', 'plate', 'slow', 'continent'],
    peerExplanations: [
      {
        body:
          'The Earth’s surface is broken into plates that ride on a hot, soft layer and move about as fast as your fingernails grow. That is the whole mechanism. Mountains rise where two plates push into each other, trenches open where they pull apart, and earthquakes are the plates catching up after years of strain.',
        by: 'VELORA',
        source: null,
      },
      {
        body:
          'The continents only look wrong because the sea floor moves too. There is rock under the ocean that is younger than almost everything on land, which is exactly what you would expect if the sea floor were being made continuously and pushed out to both sides.',
        by: 'VELORA',
        source: null,
      }
    ]
  },
  {
    id: 'opportunity-cost',
    term: 'Opportunity Cost',
    subject: 'Economics',
    targetAudience: 'Explain why "it cost nothing" is almost never true, using a decision the listener has actually made.',
    keyConcepts: ['instead', 'gave up', 'better', 'two prices', 'money', 'free', 'choice', 'question'],
    peerExplanations: [
      {
        body:
          'Every choice has two prices. One is the money you paid. The other is the best thing you could have had instead, and that second number is the one people skip when they decide something was free.',
        by: 'VELORA',
        source: null,
      },
      {
        body:
          'Two hours on your phone was not free. The question is only whether you gave up something better — the couch, a friend, an hour of sleep — by spending it the way you did. Economics is mostly the discipline of asking that question out loud.',
        by: 'VELORA',
        source: null,
      }
    ]
  },
  {
    id: 'neuron',
    term: 'Action Potential',
    subject: 'Neuroscience',
    targetAudience: 'Explain to someone who is not a scientist why a nerve fires all-or-nothing and why nerves are slow.',
    keyConcepts: ['electrical', 'signal', 'jump', 'fibre', 'speed', 'chemical', 'all at once', 'threshold'],
    peerExplanations: [
      {
        body:
          'A nerve does not send a weak signal for a weak stimulus and a strong one for a strong stimulus. It sends the same electrical spike every time, and the intensity is carried by how many neurons fire and how fast, never by how big one spike is. All or nothing, like a light switch.',
        by: 'VELORA',
        source: null,
      },
      {
        body:
          'The surprise is the speed. Electricity travels fast, but nerves are slow — around a metre per second, which is roughly walking pace. Most of the time is spent waiting for chemical signals to jump between cells, and that is why your reaction time is longer than the distance you think it should take.',
        by: 'VELORA',
        source: null,
      }
    ]
  },
  {
    id: 'printing-press',
    term: 'The Printing Press',
    subject: 'History',
    targetAudience: 'Explain to someone today why an argument could spread at all before printing, and what changed when it did.',
    keyConcepts: ['copy', 'argument', 'cheap', 'print', 'letter', 'reach', 'anyone', 'cheaply'],
    peerExplanations: [
      {
        body:
          'Before print, an argument could only travel as fast and as far as someone was willing to hand-copy it by hand, which made every claim expensive to repeat and therefore easy to drown out. Printing turned a rumour into something you could check, because you could hold the page and compare it with another copy.',
        by: 'VELORA',
        source: null,
      },
      {
        body:
          'Printing did not create disagreement — people had always disagreed. It made the disagreement countable. Once you could print the same page and hand it to someone who had never heard the case, "trust me, I was there" stopped working as an argument.',
        by: 'VELORA',
        source: null,
      }
    ]
  }
];

/** Same key shape the Peer Explanations component writes, so this reads the
 *  explanations already stored on this device instead of inventing a feed. */
const peerStorageKey = (term) =>
  EXPLANATION_BOARD(term.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

function readLocalExplanations(term) {
  const stored = readValue(peerStorageKey(term), []);
  if (!Array.isArray(stored)) return [];
  return stored
    .filter((item) => item && typeof item.text === 'string' && item.text.trim())
    .map((item) => ({
      text: item.text,
      votes: item.votes && Number.isFinite(item.votes.clear) ? item.votes.clear : 0,
    }));
}

function ExplainItBackGame() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedFeedbacks, setSavedFeedbacks] = useState([]);
  const [pausedNote, setPausedNote] = useState(false);
  // A wall-clock deadline, not a counter. A counter kept ticking in a
  // backgrounded tab, which handed out free seconds to anyone who switched
  // away, and punished the person whose laptop went to sleep mid-sprint.
  const deadlineRef = useRef(null);
  const pausedForRef = useRef(0);
  const timerRef = useRef(null);
  const submittedRef = useRef(false);

  const currentPrompt = EXPLAIN_PROMPTS[promptIdx];

  const timeRemaining = () =>
    Math.max(0, Math.ceil(((deadlineRef.current || 0) - Date.now()) / 1000));

  useEffect(() => {
    if (!timerActive) return undefined;

    const tick = () => {
      setTimeLeft(timeRemaining());
    };

    tick();
    timerRef.current = setInterval(tick, 250);

    // Switching tabs should not spend the clock. The deadline is pushed out by
    // however long the tab was hidden, so the sprint is still 30 seconds of
    // actual attention.
    const onVisibility = () => {
      if (document.hidden) {
        pausedForRef.current = Date.now();
      } else if (pausedForRef.current) {
        const away = Date.now() - pausedForRef.current;
        deadlineRef.current += away;
        pausedForRef.current = 0;
        setPausedNote(true);
        tick();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [timerActive]);

  const finish = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    setTimerActive(false);
    clearInterval(timerRef.current);
    setSubmitted(true);
    setTimeLeft(timeRemaining());

    const sanitized = sanitizeText(explanation.trim());
    if (sanitized) {
      const stored = readValue(KEYS.MY_EXPLANATIONS, []);
      const list = Array.isArray(stored) ? stored : [];
      list.unshift({
        term: currentPrompt.term,
        text: sanitized,
        date: new Date().toLocaleDateString(),
      });
      writeValue(KEYS.MY_EXPLANATIONS, list.slice(0, 10));

      // Show what this browser already holds for the same term, which is what
      // the peer explanations screen stores.
      setSavedFeedbacks(readLocalExplanations(currentPrompt.term));
    }
  }, [explanation, currentPrompt]);

  // The clock running out is what triggers the submit, rather than the effect
  // calling a function it did not depend on.
  useEffect(() => {
    if (timerActive && timeLeft <= 0) finish();
  }, [timerActive, timeLeft, finish]);

  const startSprint = () => {
    submittedRef.current = false;
    pausedForRef.current = 0;
    deadlineRef.current = Date.now() + 30000;
    setTimeLeft(30);
    setTimerActive(true);
    setPausedNote(false);
    setSubmitted(false);
    setSavedFeedbacks([]);
    setExplanation('');
  };

  const handleSubmit = () => {
    finish();
  };

  const nextPrompt = () => {
    setPromptIdx((prev) => (prev + 1) % EXPLAIN_PROMPTS.length);
    setExplanation('');
    setTimeLeft(30);
    setTimerActive(false);
    setSubmitted(false);
    setSavedFeedbacks([]);
  };

  // Word count & intuition score
  const wordCount = explanation.trim() ? explanation.trim().split(/\s+/).length : 0;
  const matchedConcepts = currentPrompt.keyConcepts.filter((word) =>
    explanation.toLowerCase().includes(word)
  );

  return (
    <div className="bg-game-card">
      <div className="bg-game-header">
        <div>
          <span className="bg-game-kicker">THE 30-SECOND FEYNMAN SPRINT</span>
          <h3 className="bg-game-title">Explain It Back: {currentPrompt.term}</h3>
        </div>
        <div className="bg-timer-badge">
          <Timer size={16} />
          <span>{timeLeft}s</span>
        </div>
      </div>

      <div className="bg-explain-prompt-box">
        <p className="bg-explain-task">
          <strong>Mission:</strong> {currentPrompt.targetAudience}
        </p>
      </div>

      {!submitted ? (
        <div className="bg-sprint-input-wrap">
          {!timerActive && timeLeft === 30 && (
            <div className="bg-sprint-start-banner">
              <p>You have 30 seconds to distill the idea into clean, honest human speech.</p>
              <button type="button" className="bg-btn bg-btn-primary" onClick={startSprint}>
                Start 30s Timer
              </button>
            </div>
          )}

          {timerActive && pausedNote && (
            <p className="bg-paused-note" role="status">
              Paused while you were in another tab, so the 30 seconds is 30
              seconds of you actually thinking.
            </p>
          )}

          {timerActive && (
            <>
              <textarea
                className="bg-sprint-textarea"
                rows={4}
                maxLength={600}
                placeholder="Type your explanation here using a concrete, relatable example..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                autoFocus
                aria-label="Your concept explanation"
              />
              <div className="bg-sprint-sub-row">
                <span className="bg-word-count">{wordCount} words</span>
                <button
                  type="button"
                  className="bg-btn bg-btn-primary"
                  onClick={handleSubmit}
                  disabled={wordCount === 0}
                >
                  Submit Explanation
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-feynman-results">
          <div className="bg-your-distillation">
            <span className="bg-distill-label">YOUR DISTILLATION ({wordCount} words)</span>
            <blockquote className="bg-your-quote">
              "{sanitizeText(explanation) || '(No explanation entered before time expired)'}"
            </blockquote>
            {matchedConcepts.length > 0 && (
              <div className="bg-intuition-tags">
                <span>Intuition cues spotted:</span>
                {matchedConcepts.map((cue) => (
                  <span key={cue} className="bg-cue-pill"><Check size={12} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 4 }} />{cue}</span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-peer-comparison-section">
            <h4 className="bg-peer-heading">
              <MessageSquare size={16} /> How Others Explained This Concept
            </h4>

            {savedFeedbacks.length > 0 ? (
              <>
                <p className="bg-peer-note">
                  From this browser only. Other people&rsquo;s explanations need a
                  server, so right now the only ones here are yours and any
                  written earlier on this device.
                </p>
                <div className="bg-peers-grid">
                  {savedFeedbacks.map((peer, i) => (
                    <div key={i} className="bg-peer-card">
                      <div className="bg-peer-meta">
                        <strong>Saved on this device</strong>
                        <small>{peer.votes} marked as clear</small>
                      </div>
                      <p className="bg-peer-text">"{peer.text}"</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="bg-peer-note">
                Nothing from this browser for {currentPrompt.term} yet. The two
                below are ones we wrote as examples, not quotes from anyone.
              </p>
            )}

            <div className="bg-peers-grid">
              {currentPrompt.peerExplanations.map((peer, i) => (
                <div key={i} className="bg-peer-card bg-peer-card-example">
                  <div className="bg-peer-meta">
                    <strong>Written by {peer.by}</strong>
                    <small>{peer.source ? 'summary, with a source' : 'example, not a quote'}</small>
                  </div>
                  <p className="bg-peer-text">"{peer.body}"</p>
                  {peer.source && (
                    <a
                      className="bg-peer-source"
                      href={peer.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {peer.source.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-result-actions">
            <button type="button" className="bg-btn bg-btn-primary" onClick={nextPrompt}>
              Next Concept Sprint <ArrowRight size={15} />
            </button>
            <button type="button" className="bg-btn bg-btn-ghost" onClick={startSprint}>
              <RotateCcw size={14} /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN BRAIN GAMES SCREEN COMPONENT
// ============================================================================
export { EXPLAIN_PROMPTS, MYTH_QUESTIONS, CONNECT_PUZZLES };

export default function BrainGames({ onBack }) {
  const [activeTab, setActiveTab] = useState('connect');

  const tabs = [
    { id: 'connect', label: 'Connect the Concept', icon: Brain },
    { id: 'myth', label: 'Counterintuitive (True/Myth)', icon: Zap },
    { id: 'explain', label: 'Explain It Back (30s Sprint)', icon: Lightbulb },
  ];

  return (
    <div className="brain-games-page">
      <div className="bg-hero">
        <div className="bg-hero-copy">
          <span className="bg-kicker">BRAIN GAMES</span>
          <h2>Mental workouts built around genuine ideas.</h2>
          <p>
            No superficial word scrambles or artificial dopamine loops. These are short,
            satisfying sessions that challenge how you connect concepts, check counterintuitive facts,
            and explain what you understand.
          </p>
        </div>
        {onBack && (
          <button type="button" className="bg-back-btn" onClick={onBack}>
            ← Back
          </button>
        )}
      </div>

      <div className="bg-tab-rail" role="tablist" aria-label="Mental games">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`bg-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <main className="bg-active-game-area">
        {activeTab === 'connect' && <ConnectConceptGame />}
        {activeTab === 'myth' && <TrueOrMythGame />}
        {activeTab === 'explain' && <ExplainItBackGame />}
      </main>
    </div>
  );
}
