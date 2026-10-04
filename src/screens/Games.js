import React, { useState } from 'react';
import { Target, Type, Link2, FileText, Puzzle, Orbit, Clock, ArrowRight, Brain, Zap } from 'lucide-react';
import FlowStateGame from '../components/FlowStateGame';
import ConceptScrabble from '../games/ConceptScrabble';
import QuantumQuiz from '../games/QuantumQuiz';
import DefinitionDuel from '../games/DefinitionDuel';
import KnowledgeChain from '../games/KnowledgeChain';
import WordPuzzle from '../games/WordPuzzle';
import RelativityLab from '../components/RelativityLab';
import PhysicsSimulations from '../components/PhysicsSimulations';
import BrainGames from '../components/BrainGames';
import { getAnalyticsData } from '../utils/analyticsStorage';
import '../styles/Games.css';

/**
 * GameHub
 * 
 * Offers both classic interactive modes and distraction-free Flow State learning
 * sessions tailored for deep conceptual mastery.
 */
function GameHub({ setScreen, initialTab = 'classic' }) {
  const [hubTab, setHubTab] = useState(initialTab); // 'brain' | 'sims' | 'classic'
  const [selectedGame, setSelectedGame] = useState(null);
  // What this device has actually recorded. Read once on mount, the same way
  // Journey reads it, so the two screens cannot disagree about the same numbers.
  const [analytics] = useState(() => getAnalyticsData());
  const sessionsLogged = analytics.weeklyActivity.reduce(
    (total, day) => total + (day.sessions || 0),
    0
  );
  const conceptsTouched = analytics.topicTimeDistribution.length;
  // Off by default. Flow State is a timed question drill, so switching it on by
  // default meant the six real games underneath could not be reached at all
  // unless you found this checkbox and turned it off.
  const [useFlowMode, setUseFlowMode] = useState(false);

  // Names, colours and time limits are taken from what these games actually
  // do. The durations used to be invented: Definition Duel is a 60 second
  // round advertised as 8 minutes, and Knowledge Chain has no clock at all
  // and claimed 12. The colours were blue, green, orange and teal, in a
  // palette the stylesheet explicitly describes as warm espresso, never
  // indigo.
  const games = [
    {
      id: 'quiz',
      name: 'Concept Check',
      type: 'quiz',
      description: 'Ten questions across physics, chemistry and biology, with the reasoning behind each answer',
      icon: Target,
      color: '#8C4A2F',
      difficulty: 'Mixed',
    },
    {
      id: 'scrabble',
      name: 'Concept Scrabble',
      type: 'scrabble',
      description: 'Build scientific terms from a rack of letters',
      icon: Type,
      color: '#A05A2C',
      difficulty: 'Easy',
    },
    {
      id: 'chain',
      name: 'Knowledge Chain',
      type: 'chain',
      description: 'Put four concepts in the order where each one causes the next',
      icon: Link2,
      color: '#7A4B2A',
      difficulty: 'Medium',
    },
    {
      id: 'duel',
      name: 'Definition Duel',
      type: 'duel',
      description: 'Type the term a definition describes, against a 60 second clock',
      icon: FileText,
      color: '#8C4A2F',
      difficulty: 'Medium',
      fixedLength: '60 seconds',
    },
    {
      id: 'puzzle',
      name: 'Concept Puzzle',
      type: 'puzzle',
      description: 'Fill in the missing term in a definition',
      icon: Puzzle,
      color: '#6B5644',
      difficulty: 'Easy',
    },
    {
      id: 'relativity',
      name: 'Relativity Lab',
      type: 'simulation',
      description: 'Play with time dilation, length contraction and event horizons',
      icon: Orbit,
      color: '#7A4B2A',
      difficulty: 'Advanced',
    },
  ];


  // Render selected game in Flow State or Classic mode
  if (selectedGame) {
    const activeGameConfig = games.find(g => g.id === selectedGame) || games[0];

    if (activeGameConfig.type === 'simulation') {
      return <RelativityLab onBack={() => setSelectedGame(null)} />;
    }

    if (useFlowMode) {
      return (
        <FlowStateGame
          gameName={activeGameConfig.name}
          gameType={activeGameConfig.type}
          difficulty={activeGameConfig.difficulty}
          duration={parseInt(activeGameConfig.fixedLength, 10) || 10}
          onBack={() => setSelectedGame(null)}
        />
      );
    }

    const gameMap = {
      scrabble: <ConceptScrabble onBack={() => setSelectedGame(null)} />,
      quiz: <QuantumQuiz onBack={() => setSelectedGame(null)} />,
      duel: <DefinitionDuel onBack={() => setSelectedGame(null)} />,
      chain: <KnowledgeChain onBack={() => setSelectedGame(null)} />,
      puzzle: <WordPuzzle onBack={() => setSelectedGame(null)} />,
      relativity: <RelativityLab onBack={() => setSelectedGame(null)} />,
    };

    return gameMap[selectedGame] || <FlowStateGame gameName={activeGameConfig.name} onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="games-hub-new">
      {/* Header */}
      <header className="games-header-new">
        <button className="back-btn-games" onClick={() => setScreen('universe')}>
          ← Return to Universe
        </button>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`pill-btn ${hubTab === 'brain' ? 'active' : ''}`}
            onClick={() => { setHubTab('brain'); setSelectedGame(null); }}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            <Brain size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} /> Brain Games
          </button>
          <button
            type="button"
            className={`pill-btn ${hubTab === 'sims' ? 'active' : ''}`}
            onClick={() => { setHubTab('sims'); setSelectedGame(null); }}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            <Zap size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} /> Physics Simulations
          </button>
          <button
            type="button"
            className={`pill-btn ${hubTab === 'classic' ? 'active' : ''}`}
            onClick={() => { setHubTab('classic'); setSelectedGame(null); }}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            <Puzzle size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} /> Concept Puzzles
          </button>
        </div>
        {hubTab === 'classic' && (
          <div className="flow-mode-switch">
            <label className="mode-switch-label">
              <input
                type="checkbox"
                checked={useFlowMode}
                onChange={(e) => setUseFlowMode(e.target.checked)}
              />
              <span className="mode-text">Flow State Mode</span>
            </label>
          </div>
        )}
      </header>

      {hubTab === 'brain' && <BrainGames onBack={() => setScreen('universe')} />}
      {hubTab === 'sims' && <PhysicsSimulations onBack={() => setScreen('universe')} />}

      {hubTab === 'classic' && (
        <>
          {/* Hero */}
          <section className="games-hero">
            <div className="hero-content">
              <h2>Master Concepts Through Deep Interaction</h2>
              <p>
                Engage with scientific frameworks directly. No artificial scoreboards—only focus, clarity, and reflection.
              </p>
            </div>
          </section>

      {/* Games Grid */}
      <main className="games-grid-main">
        {games.map((game) => {
          const GameIcon = game.icon;
          return (
            // A div with an onClick is not focusable, has no role, and cannot
            // be activated by keyboard, so the entire games grid was mouse
            // only. The inner "Start Session" button did nothing on its own
            // and relied on the click bubbling up to the div.
            <button
              type="button"
              key={game.id}
              className="game-card-large"
              onClick={() => setSelectedGame(game.id)}
              style={{ '--game-color': game.color, textAlign: 'left' }}
            >
              <div className="game-card-header">
                <span className="game-icon-large" style={{ display: 'flex', alignItems: 'center' }}>
                  <GameIcon size={24} strokeWidth={1.5} color={game.color} />
                </span>
                <h3>{game.name}</h3>
              </div>

              <p className="game-description">{game.description}</p>

              <div className="game-meta-row">
                <span className="game-difficulty">{game.difficulty}</span>
                {game.fixedLength && (
                  <span className="game-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} strokeWidth={1.5} />
                    <span>{game.fixedLength}</span>
                  </span>
                )}
              </div>

              <span className="play-btn-large" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>Start session</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </span>
            </button>
          );
        })}
      </main>

      {/* Stats */}
        {/*
         * These four numbers used to be typed out by hand: 18 sessions, 4.9/5
         * comprehension, 15 concepts mastered, 92% retention. Nothing on this
         * device produced any of them, and every learner saw exactly the same
         * four - including someone who had just arrived - which is the same
         * failure Journey was rebuilt to remove. The hero above this panel even
         * claims "no artificial scoreboards", which put the contradiction on one
         * screen.
         *
         * What is real is minutes spent: LessonReader records a session when a
         * lesson closes. So the panel now shows that, plus an empty state that
         * says so, rather than a number that flatters.
         *
         * What stays absent is the scoring. Comprehension and retention are not
         * dropped because they would be awkward to produce - they are dropped
         * because nothing here measures them. A quiz would produce a number
         * instantly, and that number would not be a measure of understanding.
         */}
        <section className="games-stats">
          <h3>Your Learning Insights</h3>
          {sessionsLogged === 0 ? (
            <p className="games-stats-empty">
              Nothing recorded yet. A count appears here when you close a lesson, so this
              panel can only ever show time you actually spent.
            </p>
          ) : (
            <div className="stats-row">
              <div className="stat-item">
                <p className="stat-number">{sessionsLogged}</p>
                <p className="stat-label">Sessions logged</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">{conceptsTouched}</p>
                <p className="stat-label">Concepts touched</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">{analytics.totalHoursStudied}</p>
                <p className="stat-label">Hours recorded</p>
              </div>
            </div>
          )}
          <p className="games-stats-note">
            No comprehension rating and no retention score. Nothing in this app measures
            either one, so a number here would be decoration shaped like a measurement.
          </p>
        </section>
      </>
    )}
  </div>
);
}

export default GameHub;