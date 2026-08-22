import React, { useState } from 'react';
import '../styles/Games.css';

// Game Components
import ConceptScrabble from '../games/ConceptScrabble';
import QuantumQuiz from '../games/QuantumQuiz';
import DefinitionDuel from '../games/DefinitionDuel';
import KnowledgeChain from '../games/KnowledgeChain';
import WordPuzzle from '../games/WordPuzzle';

function GameHub({ setScreen }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'scrabble',
      name: 'Concept Scrabble',
      description: 'Build words from letters to complete definitions',
      icon: '🔤',
      color: '#667eea',
      difficulty: 'Easy',
      duration: '5 mins',
    },
    {
      id: 'quiz',
      name: 'Quantum Quiz',
      description: 'Answer questions with beautiful animations',
      icon: '⚡',
      color: '#FF6B6B',
      difficulty: 'Medium',
      duration: '3 mins',
    },
    {
      id: 'duel',
      name: 'Definition Duel',
      description: 'Race against time to match definitions',
      icon: '⚔️',
      color: '#FFA500',
      difficulty: 'Hard',
      duration: '2 mins',
    },
    {
      id: 'chain',
      name: 'Knowledge Chain',
      description: 'Connect related concepts to form chains',
      icon: '⛓️',
      color: '#1D9E75',
      difficulty: 'Medium',
      duration: '4 mins',
    },
    {
      id: 'puzzle',
      name: 'Word Puzzle',
      description: 'Fill blanks to complete definitions',
      icon: '🧩',
      color: '#764ba2',
      difficulty: 'Easy',
      duration: '3 mins',
    },
  ];

  // Render selected game
  const renderGame = () => {
    const gameMap = {
      scrabble: <ConceptScrabble onBack={() => setSelectedGame(null)} />,
      quiz: <QuantumQuiz onBack={() => setSelectedGame(null)} />,
      duel: <DefinitionDuel onBack={() => setSelectedGame(null)} />,
      chain: <KnowledgeChain onBack={() => setSelectedGame(null)} />,
      puzzle: <WordPuzzle onBack={() => setSelectedGame(null)} />,
    };
    return gameMap[selectedGame];
  };

  if (selectedGame) {
    return renderGame();
  }

  return (
    <div className="games-hub-new">
      {/* Header */}
      <header className="games-header-new">
        <button className="back-btn-games" onClick={() => setScreen('dashboard')}>
          ← Back
        </button>
        <h1>🎮 Learning Games</h1>
        <div style={{ width: '40px' }}></div>
      </header>

      {/* Hero */}
      <section className="games-hero">
        <div className="hero-content">
          <h2>Learn While Playing</h2>
          <p>Master concepts through engaging games. No boring studying!</p>
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
              Play Now →
            </button>
          </div>
        ))}
      </main>

      {/* Stats */}
      <section className="games-stats">
        <h3>Your Game Statistics</h3>
        <div className="stats-row">
          <div className="stat-item">
            <p className="stat-number">23</p>
            <p className="stat-label">Games Played</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">1,245</p>
            <p className="stat-label">Points Earned</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">15</p>
            <p className="stat-label">Concepts Mastered</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">4.8/5</p>
            <p className="stat-label">Average Score</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GameHub;