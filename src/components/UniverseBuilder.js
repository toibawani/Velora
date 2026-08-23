import React, { useState } from 'react';
import '../styles/Universe.css';

/**
 * Knowledge Universe & Interdisciplinary Topology Builder
 * 
 * Interactive concept mapper allowing students to construct causal connections,
 * cross-domain analogies, and epistemic timelines across STEM and humanities.
 */

const INITIAL_CONCEPTS = [
  {
    id: 1,
    name: 'Photosynthesis',
    category: 'biology',
    icon: '🌿',
    position: { x: 140, y: 120 },
    summary: 'Light-dependent conversion of photons to chemical potential energy.'
  },
  {
    id: 2,
    name: 'Cellular Respiration',
    category: 'biology',
    icon: '💨',
    position: { x: 260, y: 180 },
    summary: 'Aerobic catabolism of glucose yielding ATP and CO2.'
  },
  {
    id: 3,
    name: 'ATP Synthesis',
    category: 'chemistry',
    icon: '⚡',
    position: { x: 380, y: 100 },
    summary: 'Proton gradient driven rotary catalysis via ATP synthase.'
  },
  {
    id: 4,
    name: 'Thermodynamic Entropy',
    category: 'physics',
    icon: '🌌',
    position: { x: 260, y: 280 },
    summary: 'Second law requirement: localized order creates net cosmic disorder.'
  },
];

const INITIAL_CONNECTIONS = [
  { from: 1, to: 2, label: 'Substrate Loop' },
  { from: 2, to: 3, label: 'Energy Coupling' },
  { from: 3, to: 4, label: 'Dissipation' },
  { from: 4, to: 1, label: 'Solar Flux' },
];

const CATEGORY_COLORS = {
  biology: 'var(--color-biology)',
  chemistry: 'var(--accent-orange)',
  physics: 'var(--color-physics)',
  philosophy: 'var(--color-philosophy)',
  mathematics: 'var(--color-mathematics)',
};

function UniverseBuilder({ topic, onBack }) {
  const [viewMode, setViewMode] = useState('galaxy'); // 'galaxy' | 'timeline' | 'map'
  const [concepts, setConcepts] = useState(INITIAL_CONCEPTS);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [isAddingConcept, setIsAddingConcept] = useState(false);
  const [newConceptName, setNewConceptName] = useState('');
  const [newConceptCategory, setNewConceptCategory] = useState('physics');
  const [newConceptSummary, setNewConceptSummary] = useState('');

  const handleAddConcept = (e) => {
    e.preventDefault();
    if (!newConceptName.trim()) return;

    const newId = Date.now();
    const newEntry = {
      id: newId,
      name: newConceptName.trim(),
      category: newConceptCategory,
      icon: newConceptCategory === 'physics' ? '⚛️' : newConceptCategory === 'biology' ? '🧬' : '💡',
      position: {
        x: Math.floor(Math.random() * 300) + 100,
        y: Math.floor(Math.random() * 200) + 80
      },
      summary: newConceptSummary.trim() || 'User defined epistemic concept.'
    };

    setConcepts(prev => [...prev, newEntry]);
    if (concepts.length > 0) {
      setConnections(prev => [...prev, { from: concepts[concepts.length - 1].id, to: newId, label: 'Causal Link' }]);
    }
    setNewConceptName('');
    setNewConceptSummary('');
    setIsAddingConcept(false);
  };

  return (
    <div className="universe-console">
      {/* Header */}
      <header className="universe-navbar">
        <div className="univ-nav-left">
          {onBack && (
            <button className="univ-back-btn" onClick={onBack}>
              ← Back
            </button>
          )}
          <div className="univ-title-col">
            <h1 className="univ-title">Interdisciplinary Knowledge Graph</h1>
            <span className="univ-sub">Causal mapping & multi-domain conceptual synthesis</span>
          </div>
        </div>

        <div className="univ-nav-right">
          <button
            className="univ-action-btn primary"
            onClick={() => setIsAddingConcept(true)}
          >
            + Add Concept Node
          </button>
        </div>
      </header>

      <main className="univ-main-layout">
        {/* Controls & View Modes */}
        <section className="univ-controls-bar">
          <div className="view-mode-tabs">
            {[
              { id: 'galaxy', icon: '🌌', label: 'Topology Graph' },
              { id: 'timeline', icon: '📈', label: 'Epistemic Timeline' },
              { id: 'map', icon: '🗺️', label: 'Matrix Grid' },
            ].map((mode) => (
              <button
                key={mode.id}
                className={`mode-tab-btn ${viewMode === mode.id ? 'active' : ''}`}
                onClick={() => setViewMode(mode.id)}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          <div className="category-legend-strip">
            {Object.entries(CATEGORY_COLORS).map(([cat, col]) => (
              <span key={cat} className="legend-tag">
                <span className="legend-dot" style={{ backgroundColor: col }} />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            ))}
          </div>
        </section>

        {/* Modal: Add Concept */}
        {isAddingConcept && (
          <div className="add-concept-overlay">
            <div className="add-concept-modal">
              <div className="modal-header">
                <h3>Add Concept to Knowledge Universe</h3>
                <button className="modal-close-btn" onClick={() => setIsAddingConcept(false)}>✕</button>
              </div>
              <form onSubmit={handleAddConcept} className="add-concept-form">
                <label>
                  Concept Name:
                  <input
                    type="text"
                    required
                    placeholder="e.g. Carnot Efficiency or Quantum Entanglement"
                    value={newConceptName}
                    onChange={(e) => setNewConceptName(e.target.value)}
                  />
                </label>
                <label>
                  Academic Discipline:
                  <select
                    value={newConceptCategory}
                    onChange={(e) => setNewConceptCategory(e.target.value)}
                  >
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="philosophy">Philosophy</option>
                    <option value="mathematics">Mathematics</option>
                  </select>
                </label>
                <label>
                  Brief Formal Explanation:
                  <textarea
                    rows="2"
                    placeholder="Describe how this concept interfaces with the surrounding graph..."
                    value={newConceptSummary}
                    onChange={(e) => setNewConceptSummary(e.target.value)}
                  />
                </label>
                <div className="modal-actions-row">
                  <button type="button" className="btn-cancel" onClick={() => setIsAddingConcept(false)}>Cancel</button>
                  <button type="submit" className="btn-confirm">Add Node & Connect</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View 1: Topology Graph (SVG) */}
        {viewMode === 'galaxy' && (
          <div className="graph-card">
            <svg viewBox="0 0 540 380" className="topology-svg">
              {/* Grid background lines */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Edge Connections */}
              {connections.map((conn, idx) => {
                const fromNode = concepts.find((c) => c.id === conn.from);
                const toNode = concepts.find((c) => c.id === conn.to);
                if (!fromNode || !toNode) return null;
                const mx = (fromNode.position.x + toNode.position.x) / 2;
                const my = (fromNode.position.y + toNode.position.y) / 2;
                return (
                  <g key={idx}>
                    <line
                      x1={fromNode.position.x}
                      y1={fromNode.position.y}
                      x2={toNode.position.x}
                      y2={toNode.position.y}
                      stroke="var(--border-strong)"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />
                    {conn.label && (
                      <text
                        x={mx}
                        y={my - 4}
                        textAnchor="middle"
                        fill="var(--text-tertiary)"
                        fontSize="8"
                        fontFamily="var(--font-mono)"
                      >
                        {conn.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Concept Nodes */}
              {concepts.map((node) => {
                const isSelected = selectedConcept?.id === node.id;
                const nodeColor = CATEGORY_COLORS[node.category] || 'var(--accent-primary)';
                return (
                  <g
                    key={node.id}
                    className="topology-node"
                    transform={`translate(${node.position.x}, ${node.position.y})`}
                    onClick={() => setSelectedConcept(isSelected ? null : node)}
                  >
                    <circle
                      r={isSelected ? 32 : 24}
                      fill="var(--bg-secondary)"
                      stroke={nodeColor}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                    />
                    <text
                      y="5"
                      textAnchor="middle"
                      fontSize="14"
                    >
                      {node.icon}
                    </text>
                    <text
                      y="36"
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Node Inspector Callout */}
            {selectedConcept && (
              <div className="node-inspector-drawer">
                <div className="inspector-head">
                  <div className="inspector-title-row">
                    <span className="inspector-icon">{selectedConcept.icon}</span>
                    <h3 className="inspector-name">{selectedConcept.name}</h3>
                  </div>
                  <button className="inspector-close" onClick={() => setSelectedConcept(null)}>✕</button>
                </div>
                <span className="inspector-discipline-tag" style={{ color: CATEGORY_COLORS[selectedConcept.category] }}>
                  {selectedConcept.category.toUpperCase()}
                </span>
                <p className="inspector-summary">{selectedConcept.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* View 2: Epistemic Timeline */}
        {viewMode === 'timeline' && (
          <div className="timeline-card">
            <div className="timeline-feed">
              {concepts.map((concept, idx) => (
                <div key={concept.id} className="timeline-entry">
                  <div className="timeline-node-marker" style={{ borderColor: CATEGORY_COLORS[concept.category] }}>
                    <span>{idx + 1}</span>
                  </div>
                  <div className="timeline-entry-body">
                    <div className="timeline-title-row">
                      <h4 className="timeline-concept-title">{concept.name}</h4>
                      <span className="timeline-cat-badge">{concept.category}</span>
                    </div>
                    <p className="timeline-summary-text">{concept.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 3: Matrix Map */}
        {viewMode === 'map' && (
          <div className="matrix-card">
            <div className="matrix-grid">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="matrix-item"
                  style={{ borderLeft: `3px solid ${CATEGORY_COLORS[concept.category]}` }}
                >
                  <div className="matrix-item-top">
                    <span className="matrix-icon">{concept.icon}</span>
                    <span className="matrix-cat">{concept.category}</span>
                  </div>
                  <h4 className="matrix-title">{concept.name}</h4>
                  <p className="matrix-desc">{concept.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UniverseBuilder;