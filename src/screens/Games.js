import React, { useState } from 'react';
import FlowStateGame from '../components/FlowStateGame';
import ConceptScrabble from '../games/ConceptScrabble';
import QuantumQuiz from '../games/QuantumQuiz';
import DefinitionDuel from '../games/DefinitionDuel';
import KnowledgeChain from '../games/KnowledgeChain';
import WordPuzzle from '../games/WordPuzzle';
import RelativityLab from '../components/RelativityLab';
import '../styles/Games.css';

/**
 * GameHub
 * 
 * Offers both classic interactive modes and distraction-free Flow State learning
 * sessions tailored for deep conceptual mastery.
 */
function GameHub({ setScreen }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [useFlowMode, setUseFlowMode] = useState(true);

  const games = [
    {
      id: 'quiz',
      name: 'Quantum Concepts Quiz',
      type: 'quiz',
      description: 'Test and sharpen fundamental principles of modern physics',
      icon: '🎯',
      color: '#4f7df3',
      difficulty: 'Intermediate',
      duration: '10 mins',
    },
    {
      id: 'scrabble',
      name: 'Singularity Concept Scrabble',
      type: 'scrabble',
      description: 'Assemble key scientific terminology from constituent root letters',
      icon: '🔤',
      color: '#34c759',
      difficulty: 'Easy',
      duration: '8 mins',
    },
    {
      id: 'chain',
      name: 'Cosmic Collapse Knowledge Chain',
      type: 'chain',
      description: 'Order sequential causality in gravitational and quantum phenomena',
      icon: '🔗',
      color: '#ff9f0a',
      difficulty: 'Advanced',
      duration: '12 mins',
    },
    {
      id: 'duel',
      name: 'Definition Duel',
      type: 'duel',
      description: 'Discriminate between subtle conceptual nuances with precision',
      icon: '📝',
      color: '#af52de',
      difficulty: 'Medium',
      duration: '8 mins',
    },
    {
      id: 'puzzle',
      name: 'Word & Principle Puzzle',
      type: 'puzzle',
      description: 'Fill in critical conceptual blanks to synthesize full physical laws',
      icon: '🧩',
      color: '#30d5c8',
      difficulty: 'Easy',
      duration: '6 mins',
    },
    {
      id: 'relativity',
      name: 'Spacetime & Relativity Laboratory',
      type: 'simulation',
      description: 'Interact with gravitational metric funnels, time dilation, and event horizons',
      icon: '⚛️',
      color: '#667eea',
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
        <h1 className="games-main-title">Interactive Learning Experiences</h1>
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
      </header>

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
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card-large"
            onClick={() => setSelectedGame(game.id)}
            style={{ '--game-color': game.color }}
          >
            <div className="game-card-header">
              <span className="game-icon-large">{game.icon}</span>
              <h3>{game.name}</h3>
            </div>

            <p className="game-description">{game.description}</p>

            <div className="game-meta-row">
              <span className="game-difficulty">{game.difficulty}</span>
              <span className="game-duration">⏱️ {game.duration}</span>
            </div>

            <button className="play-btn-large">
              Start Session →
            </button>
          </div>
        ))}
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
    </div>
  );
}

export default GameHub;