import PropTypes from 'prop-types';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
/**
 * Each chain is a causal sequence, and every link has to earn its place. The
 * chemistry chain used to end "Chemical Bond holds together Molecule", which
 * says the same thing as the step before it in reverse. A link that restates
 * its neighbour is not a chain, so the second step now carries the actual
 * mechanism: electrons shared between atoms is what a covalent bond is, and
 * that is what makes a molecule.
 *
 * Six chains, up from three. One round of three was thin enough that a learner
 * finished the game in under a minute and never saw a non-biological one.
 */
const CHAINS = [
  {
    title: 'Biology Chain',
    concepts: ['DNA', 'Genes', 'Proteins', 'Cells'],
    links: ['carries the instructions that make up', 'are the instructions for building', 'are the machinery that builds'],
  },
  {
    title: 'Chemistry Chain',
    concepts: ['Atom', 'Electron', 'Chemical Bond', 'Molecule'],
    links: ['has outer-shell', 'are shared between atoms to create a', 'joins atoms together into a'],
  },
  {
    title: 'Space Chain',
    concepts: ['Mass', 'Gravity', 'Orbital Velocity', 'Satellite'],
    links: ['bends spacetime and produces', 'sets the sideways speed a body needs to stay in orbit around', 'stays in orbit because of'],
  },
  {
    title: 'Physics Chain',
    concepts: ['Temperature', 'Particle Motion', 'Pressure', 'Gas Expansion'],
    links: [
      'is the average speed of',
      'raises the force per unit area when its particles push harder in',
      'pushes outwards as the particles strike its walls harder, causing',
    ],
  },
  {
    title: 'Economics Chain',
    concepts: ['Scarcity', 'Choice', 'Price', 'Trade'],
    links: [
      'forces a rationing decision, creating',
      'is resolved by the scarcity, which is settled by',
      'is what makes exchanging what you have for what you lack worthwhile',
    ],
  },
  {
    title: 'History Chain',
    concepts: ['Grain Surplus', 'Population Growth', 'Urban Labour', 'Specialisation'],
    links: [
      'feeds and enables',
      'whose numbers supply cities with',
      'which frees people to trade goods they make better than their neighbours do',
    ],
  },
  // Philosophy.
  //
  // The other five chains are causal in the physical, economic or demographic
  // sense: surplus feeds population, population supplies cities. Philosophy
  // mostly has no such chains, and forcing one in is how this deck ended up
  // with links that restated the step before them. These two are built on
  // arguments where a link genuinely is a mechanism: Kant's test of a maxim,
  // and Aristotle's account of habituation as the formation of character.
  {
    title: 'Kant Chain',
    concepts: ['Maxims', 'Universal Law', 'Good Will', 'Duty'],
    links: [
      'are the rules you act on, and asking whether they survive being made universal is the test that produces',
      'and acting on it whatever the consequences is what makes a',
      'the character you are praised for rather than the outcome you got',
    ],
  },
  {
    title: 'Aristotle Chain',
    concepts: ['Actions', 'Repetition', 'Habit', 'Character'],
    links: [
      'done often enough stop being decisions and settle into',
      'and doing something without thinking about it any more is what',
      'so virtue is built by doing rather than waited for',
    ],
  },
];

const isCorrectOrder = (selected, total) =>
  selected.length === total && selected.every((index, position) => index === position);

/**
 * The order the four concept buttons are laid out in.
 *
 * They used to be rendered straight off `chain.concepts`, which is the answer.
 * So the board showed DNA, Genes, Proteins, Cells left to right in the order
 * they belong, and the shortest winning line was to click them left to right -
 * the game was asking whether you could read, not whether you knew the chain.
 * A test checked that clicking DNA, Proteins, Genes, Cells was rejected, which
 * is true and was never the problem.
 *
 * This returns a permutation that is never the identity, so there is no round
 * where the puzzle answers itself. It is derived from the chain index rather
 * than from Math.random, because a re-render mid-move must not reshuffle the
 * buttons under the player's cursor - the same chain always lays out the same
 * way, and a different chain lays out differently.
 */
function boardOrder(chainIndex, count) {
  // A stride coprime with the count visits every position exactly once, which
  // is what makes this a permutation rather than something that can drop a
  // button or draw one twice.
  const stride = count % 2 === 0 ? count - 1 : count - 2;
  const offset = (chainIndex * 3) % count;
  const order = [];
  for (let i = 0; i < count; i += 1) order.push((offset + i * stride) % count);

  // Guard rather than an assumption: for a four-concept chain the identity
  // cannot come out of the line above, but a chain of a different length could,
  // and the identity is the one output this function exists to prevent.
  const isIdentity = order.every((value, position) => value === position);
  return isIdentity ? order.slice().reverse() : order;
}

KnowledgeChain.propTypes = { onBack: PropTypes.func };

function KnowledgeChain({ onBack }) {
  const [currentChain, setCurrentChain] = useState(0);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [solved, setSolved] = useState(false);
  const advanceRef = useRef(null);

  const chain = CHAINS[currentChain];
  const isLastChain = currentChain === CHAINS.length - 1;
  // The buttons are laid out in a scrambled order; the picks are still recorded
  // as positions in `chain.concepts`, which is what `isCorrectOrder` grades.
  const buttonOrder = useMemo(
    () => boardOrder(currentChain, chain.concepts.length),
    [chain.concepts.length, currentChain]
  );

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
          {buttonOrder.map((idx) => {
            const isSelected = selectedConcepts.includes(idx);
            return (
              <button
                key={chain.concepts[idx]}
                type="button"
                className={`concept-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleConceptClick(idx)}
                disabled={isSelected || solved}
              >
                {chain.concepts[idx]}
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

export { CHAINS, boardOrder };

export default KnowledgeChain;
