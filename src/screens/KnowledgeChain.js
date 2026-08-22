import React, { useState } from 'react';
import '../styles/GameStyles.css';

const CHAINS = [
  {
    title: 'Space Science Chain',
    concepts: ['Black Hole', 'Singularity', 'Event Horizon', 'Gravitational Lensing'],
    connections: [
      { from: 0, to: 1, label: 'Contains' },
      { from: 1, to: 2, label: 'Creates' },
      { from: 2, to: 3, label: 'Causes' },
    ],
  },
  {
    title: 'Biology Chain',
    concepts: ['DNA', 'Genes', 'Proteins', 'Cells'],
    connections: [
      { from: 0, to: 1, label: 'Contains' },
      { from: 1, to: 2, label: 'Code for' },
      { from: 2, to: 3, label: 'Build' },
    ],
  },
  {
    title: 'Chemistry Chain',
    concepts: ['Atoms', 'Molecules', 'Compounds', 'Reactions'],
    connections: [
      { from: 0, to: 1, label: 'Form' },
      { from: 1, to: 2, label: 'Make' },
      { from: 2, to: 3, label: 'Undergo' },
    ],
  },
];

function KnowledgeChain({ onBack }) {
  const [currentChain, setCurrentChain] = useState(0);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  const chain = CHAINS[currentChain];

  const handleConceptClick = (index) => {
    setSelectedConcepts([...selectedConcepts, index]);
  };

  const handleUndo = () => {
    setSelectedConcepts(selectedConcepts.slice(0, -1));
  };

  const handleSubmit = () => {
    // Check if selection forms a valid chain
    if (selectedConcepts.length === chain.concepts.length) {
      setMessage('✅ Perfect chain formed!');
      setScore(score + 50);
      setTimeout(() => {
        if (currentChain < CHAINS.length - 1) {
          setCurrentChain(currentChain + 1);
          setSelectedConcepts([]);
          setMessage('');
        }
      }, 1500);
    } else {
      setMessage('❌ Incomplete or wrong chain');
    }
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="game-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Knowledge Chain</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="chain-game">
        {/* Title */}
        <h3 className="chain-title">{chain.title}</h3>

        {/* Chain Visualization */}
        <div className="chain-display">
          {selectedConcepts.map((idx, position) => (
            <div key={position} className="chain-node selected">
              {chain.concepts[idx]}
            </div>
          ))}
          {selectedConcepts.length < chain.concepts.length && (
            <div className="chain-node empty">+</div>
          )}
        </div>

        {/* Available Concepts */}
        <div className="concepts-grid-chain">
          {chain.concepts.map((concept, idx) => {
            const isSelected = selectedConcepts.includes(idx);
            return (
              <button
                key={idx}
                className={`concept-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => !isSelected && handleConceptClick(idx)}
                disabled={isSelected}
              >
                {concept}
              </button>
            );
          })}
        </div>

        {/* Message */}
        {message && <p className={`chain-message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}

        {/* Actions */}
        <div className="chain-actions">
          <button className="btn-undo" onClick={handleUndo} disabled={selectedConcepts.length === 0}>
            ← Undo
          </button>
          <button
            className="btn-submit-chain"
            onClick={handleSubmit}
            disabled={selectedConcepts.length === 0}
          >
            Submit Chain
          </button>
        </div>

        {/* Progress */}
        <p className="chain-progress">
          Chain {currentChain + 1}/{CHAINS.length}
        </p>
      </div>
    </div>
  );
}

export default KnowledgeChain;