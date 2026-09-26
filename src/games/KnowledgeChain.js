import React, { useState, useCallback, useRef, useEffect } from 'react';
import '../styles/GameStyles.css';

/**
 * Each chain is a real causal sequence. The player has to put the four
 * concepts in the right order, not merely collect all four, which is what
 * the game used to check: submitting Black Hole, Gravitational Lensing,
 * Event Horizon, Singularity scored a perfect chain, because the only
 * condition was that all four had been picked.
 *
 * `links[i]` is the relationship between concept i and concept i + 1, and is
 * shown once the chain is correct, because the link is the thing worth
 * learning. The old wording of these links was also wrong: an event horizon
 * does not "create" gravitational lensing, and a black hole does not contain
 * a singularity in the order that was listed.
 */
const CHAINS = [
  {
    title: 'Biology Chain',
    concepts: ['DNA', 'Genes', 'Proteins', 'Cells'],
    links: ['contains', 'code for', 'build'],
  },
  {
    title: 'Chemistry Chain',
    concepts: ['Atom', 'Electron', 'Chemical Bond', 'Molecule'],
    links: ['has', 'form', 'holds together'],
  },
  {
    title: 'Space Chain',
    concepts: ['Mass', 'Gravity', 'Orbital Velocity', 'Satellite'],
    links: ['produces', 'sets', 'keeps in orbit'],
  },
];

const isCorrectOrder = (selected, total) =>
  selected.length === total && selected.every((index, position) => index === position);

function KnowledgeChain({ onBack }) {
  const [currentChain, setCurrentChain] = useState(0);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [solved, setSolved] = useState(false);
  const advanceRef = useRef(null);

  const chain = CHAINS[currentChain];
  const isLastChain = currentChain === CHAINS.length - 1;

  // Moving on used to be a bare setTimeout that nothing could cancel, so
  // unmounting inside that 1.5s window set state on a component that is gone
  // and jumping to the next chain landed you in a game you had already left.
  useEffect(() => () => clearTimeout(advanceRef.current), []);

  const handleConceptClick = useCallback((index) => {
    setSelectedConcepts((prev) => (prev.includes(index) ? prev : [...prev, index]));
  }, []);

  const handleUndo = useCallback(() => {
    setSelectedConcepts((prev) => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(() => {
    if (solved) return;

    if (!isCorrectOrder(selectedConcepts, chain.concepts.length)) {
      setMessage('Not quite: that is the right four concepts in the wrong order.');
      return;
    }

    setSolved(true);
    setScore((prev) => prev + 50);
    setMessage('Correct, and the links are what make it a chain rather than a list.');

    if (!isLastChain) {
      advanceRef.current = setTimeout(() => {
        setCurrentChain((prev) => prev + 1);
        setSelectedConcepts([]);
        setSolved(false);
        setMessage('');
      }, 2600);
    }
  }, [chain, isLastChain, selectedConcepts, solved]);

  const handleReset = useCallback(() => {
    clearTimeout(advanceRef.current);
    setSelectedConcepts([]);
    setSolved(false);
    setMessage('');
  }, []);

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="game-back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <h2>Knowledge Chain</h2>
        <div className="game-score">Score: {score}</div>
      </div>

      <div className="chain-game">
        <h3 className="chain-title">{chain.title}</h3>
        <p className="chain-instruction">
          Put these four in the order that makes each one cause the next.
        </p>

        <div className="chain-display">
          {selectedConcepts.map((idx, position) => (
            <React.Fragment key={idx}>
              <div className="chain-node selected">{chain.concepts[idx]}</div>
              {position < selectedConcepts.length - 1 && (
                <div className="chain-link" aria-hidden="true">&rarr;</div>
              )}
            </React.Fragment>
          ))}
          {selectedConcepts.length < chain.concepts.length && (
            <div className="chain-node empty">+</div>
          )}
        </div>

        {solved && (
          <div className="chain-links-explained">
            {chain.links.map((link, i) => (
              <p key={link + i}>
                <strong>{chain.concepts[i]}</strong> {link}{' '}
                <strong>{chain.concepts[i + 1]}</strong>
              </p>
            ))}
          </div>
        )}

        <div className="concepts-grid-chain">
          {chain.concepts.map((concept, idx) => {
            const isSelected = selectedConcepts.includes(idx);
            return (
              <button
                key={concept}
                type="button"
                className={`concept-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleConceptClick(idx)}
                disabled={isSelected || solved}
              >
                {concept}
              </button>
            );
          })}
        </div>

        {message && (
          <p className={`chain-message ${solved ? 'success' : 'error'}`} role="status">
            {message}
          </p>
        )}

        <div className="chain-actions">
          <button className="btn-undo" onClick={handleUndo} disabled={selectedConcepts.length === 0 || solved}>
            &larr; Undo
          </button>
          <button
            className="btn-submit-chain"
            onClick={handleSubmit}
            disabled={selectedConcepts.length !== chain.concepts.length || solved}
          >
            Check Chain
          </button>
          <button className="btn-undo" onClick={handleReset}>
            Start Over
          </button>
        </div>

        <p className="chain-progress">
          Chain {currentChain + 1}/{CHAINS.length}
        </p>
        {isLastChain && solved && <p className="chain-progress">All chains done. Final score {score}.</p>}
      </div>
    </div>
  );
}

export default KnowledgeChain;
