import React, { useState } from 'react';
import { Target, Type, Link2, FileText, Puzzle, Orbit, Clock, ArrowRight } from 'lucide-react';
import FlowStateGame from '../components/FlowStateGame';
import ConceptScrabble from '../games/ConceptScrabble';
import QuantumQuiz from '../games/QuantumQuiz';
import DefinitionDuel from '../games/DefinitionDuel';
import KnowledgeChain from '../games/KnowledgeChain';
import WordPuzzle from '../games/WordPuzzle';
import RelativityLab from '../components/RelativityLab';
import PhysicsSimulations from '../components/PhysicsSimulations';
import BrainGames from '../components/BrainGames';
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
            🧠 Brain Games
          </button>
          <button
            type="button"
            className={`pill-btn ${hubTab === 'sims' ? 'active' : ''}`}
            onClick={() => { setHubTab('sims'); setSelectedGame(null); }}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            ⚡ Physics Simulations
          </button>
          <button
            type="button"
            className={`pill-btn ${hubTab === 'classic' ? 'active' : ''}`}
            onClick={() => { setHubTab('classic'); setSelectedGame(null); }}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            🧩 Concept Puzzles
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
      <section className="games-stats">
        <h3>Your Learning Insights</h3>
        <div className="stats-row">
          <div className="stat-item">
            <p className="stat-number">18</p>
            <p className="stat-label">Flow Sessions Completed</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">4.9/5</p>
            <p className="stat-label">Comprehension Rating</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">15</p>
            <p className="stat-label">Concepts Mastered</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">92%</p>
            <p className="stat-label">Retention Score</p>
          </div>
        </div>
      </section>
      </>
    )}
  </div>
);
}

export default GameHub;