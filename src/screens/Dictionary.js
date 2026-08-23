import React, { useState, useMemo } from 'react';
import '../styles/Dictionary.css';

/**
 * Concept Dictionary & Scientific Lexicon
 * 
 * High-performance, distraction-free encyclopedia of foundational academic terms,
 * mathematical formalisms, intuitive analogies, and cross-disciplinary connections.
 */

const DICTIONARY_ENTRIES = [
  {
    id: 'black-hole',
    term: 'Black Hole',
    letter: 'B',
    subject: 'physics',
    pronunciation: '/blæk hoʊl/',
    definition: 'A region of spacetime where gravitational acceleration is so extreme that nothing—including particles and electromagnetic radiation such as light—can escape from it.',
    analogy: 'Imagine a waterfall in spacetime where the current flows faster than any fish can swim. The edge of the waterfall is the Event Horizon.',
    formalism: 'r_s = \\frac{2GM}{c^2}',
    related: ['Event Horizon', 'Singularity', 'Hawking Radiation', 'General Relativity']
  },
  {
    id: 'decoherence',
    term: 'Quantum Decoherence',
    letter: 'D',
    subject: 'physics',
    pronunciation: '/diːkoʊˈhɪərəns/',
    definition: 'The loss of quantum coherence whereby a quantum system transitions from a superposition of states into an apparent classical probability mixture through environmental entanglement.',
    analogy: 'Imagine dropping a single clear drop of dye into turbulent ocean water—the information is not destroyed, but it becomes irreversibly scrambled across surrounding molecules.',
    formalism: '\\rho_{ij}(t) = \\rho_{ij}(0) e^{-\\Gamma t}',
    related: ['Superposition', 'Wave Function', 'Quantum Entanglement']
  },
  {
    id: 'epistemology',
    term: 'Epistemology',
    letter: 'E',
    subject: 'philosophy',
    pronunciation: '/ɪˌpɪstɪˈmɒlədʒi/',
    definition: 'The branch of philosophy concerned with the theory of knowledge, investigating what distinguishes justified belief from mere opinion, its sources, and its limits.',
    analogy: 'If science is the process of building a map of reality, epistemology is the rigorous inspection of the surveyor tools used to draw the map.',
    formalism: 'JTB Framework: S \\text{ knows that } P \\iff P \\land B(S, P) \\land J(S, P)',
    related: ['Socratic Method', 'Rationalism', 'Empiricism', 'Falsifiability']
  },
  {
    id: 'entropy',
    term: 'Entropy',
    letter: 'E',
    subject: 'physics',
    pronunciation: '/ˈɛntrəpi/',
    definition: 'A thermodynamic property measuring the number of specific microscopic configurations (microstates) corresponding to a thermodynamic system’s macroscopic state.',
    analogy: 'A shattered glass has vastly more disordered microstates than an intact one; nature inevitably drifts toward the state of maximum statistical probability.',
    formalism: 'S = k_B \\ln \\Omega',
    related: ['Thermodynamics', 'Statistical Mechanics', 'Information Theory']
  },
  {
    id: 'falsifiability',
    term: 'Falsifiability',
    letter: 'F',
    subject: 'philosophy',
    pronunciation: '/ˌfɔːlsɪfaɪəˈbɪlɪti/',
    definition: 'A standard of scientific evaluation introduced by Karl Popper, stating that a hypothesis is scientific only if it is inherently capable of being proven false through empirical observation.',
    analogy: 'A theory that explains everything in hindsight (e.g. "it was destiny") explains nothing in practice because no possible observation can contradict it.',
    formalism: '\\exists \\text{ observation } O : P(O | H) = 0',
    related: ['Epistemology', 'Scientific Method', 'Karl Popper']
  },
  {
    id: 'kerr-metric',
    term: 'Kerr Metric',
    letter: 'K',
    subject: 'physics',
    pronunciation: '/kɜːr ˈmɛtrɪk/',
    definition: 'An exact vacuum solution to Einstein’s field equations describing the spacetime geometry surrounding an uncharged, rotating stationary black hole with axial symmetry.',
    analogy: 'A cosmic whirlpool that does not just pull objects down, but violently twists the surrounding fluid of space itself in a frame-dragging ergosphere.',
    formalism: 'ds^2 = -\\left(1 - \\frac{r_s r}{\\rho^2}\\right) c^2 dt^2 + \\dots',
    related: ['Black Hole', 'Frame Dragging', 'Penrose Process']
  },
  {
    id: 'peano-axioms',
    term: 'Peano Axioms',
    letter: 'P',
    subject: 'mathematics',
    pronunciation: '/peɪˈɑːnoʊ ˈæksiəmz/',
    definition: 'A set of formal mathematical axioms defined by Giuseppe Peano to provide a rigorous, non-circular deductive foundation for the natural numbers.',
    analogy: 'The absolute bedrock rules of arithmetic—defining zero, successors, and mathematical induction from first principles.',
    formalism: '\\forall n \\in \\mathbb{N}, S(n) \\in \\mathbb{N}',
    related: ['Mathematical Induction', 'Set Theory', 'Logic']
  }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function Dictionary({ setScreen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [activeEntry, setActiveEntry] = useState(null);

  const filteredEntries = useMemo(() => {
    return DICTIONARY_ENTRIES.filter(entry => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTerm = entry.term.toLowerCase().includes(query);
        const matchesDef = entry.definition.toLowerCase().includes(query);
        const matchesAnalogy = entry.analogy.toLowerCase().includes(query);
        if (!matchesTerm && !matchesDef && !matchesAnalogy) return false;
      }
      if (selectedLetter !== 'ALL' && entry.letter !== selectedLetter) return false;
      if (selectedSubject !== 'ALL' && entry.subject !== selectedSubject) return false;
      return true;
    });
  }, [searchQuery, selectedLetter, selectedSubject]);

  return (
    <div className="dictionary-console">
      {/* Top Navbar */}
      <header className="dict-navbar">
        <div className="dict-nav-left">
          <button className="dict-back-btn" onClick={() => setScreen('universe')}>
            ← Back
          </button>
          <div className="dict-title-col">
            <h1 className="dict-title">Scientific & Philosophical Lexicon</h1>
            <span className="dict-sub">Deductive definitions, analogies, and formalisms</span>
          </div>
        </div>
        <div className="dict-stat-pill">
          <span>{DICTIONARY_ENTRIES.length} Core Principles Index</span>
        </div>
      </header>

      <main className="dict-main-layout">
        {/* Search and Filters Bar */}
        <section className="dict-controls-card">
          <div className="dict-search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="dict-search-input"
              placeholder="Search concepts, mathematical formalisms, or analogies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="dict-filters-row">
            <div className="subject-pills-row">
              {['ALL', 'physics', 'philosophy', 'mathematics'].map(sub => (
                <button
                  key={sub}
                  className={`sub-filter-pill ${selectedSubject === sub ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(sub)}
                >
                  {sub === 'ALL' ? 'All Disciplines' : sub.charAt(0).toUpperCase() + sub.slice(1)}
                </button>
              ))}
            </div>

            <div className="alphabet-selector-strip">
              <button
                className={`letter-pill ${selectedLetter === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedLetter('ALL')}
              >
                All
              </button>
              {ALPHABET.map(char => {
                const hasChar = DICTIONARY_ENTRIES.some(e => e.letter === char);
                return (
                  <button
                    key={char}
                    disabled={!hasChar}
                    className={`letter-pill ${selectedLetter === char ? 'active' : ''} ${!hasChar ? 'disabled' : ''}`}
                    onClick={() => setSelectedLetter(char)}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Entries Grid */}
        <section className="dict-entries-stream">
          {filteredEntries.length === 0 ? (
            <div className="dict-empty-state">
              <p>No concepts matching your search filter.</p>
            </div>
          ) : (
            filteredEntries.map(entry => (
              <article
                key={entry.id}
                className={`lexicon-entry-card ${activeEntry?.id === entry.id ? 'expanded' : ''}`}
                onClick={() => setActiveEntry(activeEntry?.id === entry.id ? null : entry)}
              >
                <div className="entry-head-row">
                  <div className="entry-title-wrap">
                    <h2 className="entry-term">{entry.term}</h2>
                    <span className="entry-pronunciation">{entry.pronunciation}</span>
                  </div>
                  <span className={`entry-domain-badge domain-${entry.subject}`}>
                    {entry.subject}
                  </span>
                </div>

                <p className="entry-definition">{entry.definition}</p>

                <div className="entry-analogy-box">
                  <span className="analogy-label">Intuitive Model:</span>
                  <p className="analogy-text">{entry.analogy}</p>
                </div>

                {entry.formalism && (
                  <div className="entry-formalism-box">
                    <span className="formalism-label">Formal Mathematical Statement</span>
                    <code className="formalism-code">{entry.formalism}</code>
                  </div>
                )}

                <div className="entry-footer-row">
                  <span className="related-label">Related Concepts:</span>
                  <div className="related-tags-row">
                    {entry.related.map((rel, idx) => (
                      <span key={idx} className="related-tag">{rel}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Dictionary;