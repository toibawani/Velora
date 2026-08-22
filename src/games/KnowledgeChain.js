import React, { useState } from 'react';
import '../styles/GameStyles.css';

const CHAINS = [
  {
    title: 'Space Science Chain',
    concepts: ['Black Hole', 'Singularity', 'Event Horizon', 'Gravitational Lensing'],
  },
  {
    title: 'Biology Chain',
    concepts: ['DNA', 'Genes', 'Proteins', 'Cells'],
  },
  {
    title: 'Chemistry Chain',
    concepts: ['Atoms', 'Molecules', 'Compounds', 'Reactions'],
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
        <h3 className="chain-title">{chain.title}</h3>

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

        {message && <p className={`chain-message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}

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

        <p className="chain-progress">
          Chain {currentChain + 1}/{CHAINS.length}
        </p>
      </div>
    </div>
  );
}

export default KnowledgeChain;