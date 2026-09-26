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

  const games = [
    {
      id: 'quiz',
      name: 'Concept Check',
      type: 'quiz',
      description: 'Ten questions across physics, chemistry and biology, each with the reasoning behind the answer',
      icon: Target,
      color: '#8C4A2F',
      difficulty: 'Mixed',
      duration: '5 mins',
    },
    {
      id: 'scrabble',
      name: 'Singularity Concept Scrabble',
      type: 'scrabble',
      description: 'Assemble key scientific terminology from constituent root letters',
      icon: Type,
      color: '#34c759',
      difficulty: 'Easy',
      duration: '8 mins',
    },
    {
      id: 'chain',
      name: 'Cosmic Collapse Knowledge Chain',
      type: 'chain',
      description: 'Order sequential causality in gravitational and quantum phenomena',
      icon: Link2,
      color: '#ff9f0a',
      difficulty: 'Advanced',
      duration: '12 mins',
    },
    {
      id: 'duel',
      name: 'Definition Duel',
      type: 'duel',
      description: 'Discriminate between subtle conceptual nuances with precision',
      icon: FileText,
      color: '#2563EB',
      difficulty: 'Medium',
      duration: '8 mins',
    },
    {
      id: 'puzzle',
      name: 'Word & Principle Puzzle',
      type: 'puzzle',
      description: 'Fill in critical conceptual blanks to synthesize full physical laws',
      icon: Puzzle,
      color: '#30d5c8',
      difficulty: 'Easy',
      duration: '6 mins',
    },
    {
      id: 'relativity',
      name: 'Spacetime & Relativity Laboratory',
      type: 'simulation',
      description: 'Interact with gravitational metric funnels, time dilation, and event horizons',
      icon: Orbit,
      color: '#2563EB',
      difficulty: 'Advanced',
      duration: '15 mins',
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
          duration={parseInt(activeGameConfig.duration, 10) || 10}
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
            <div
              key={game.id}
              className="game-card-large"
              onClick={() => setSelectedGame(game.id)}
              style={{ '--game-color': game.color }}
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
                <span className="game-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} strokeWidth={1.5} />
                  <span>{game.duration}</span>
                </span>
              </div>

              <button className="play-btn-large" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>Start Session</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </div>
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