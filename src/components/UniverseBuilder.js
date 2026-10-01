import React, { useRef, useState } from 'react';
import { Orbit, TrendingUp, Map as MapIcon, Leaf, Wind, Zap, Atom, Dna, Lightbulb, X } from 'lucide-react';
import '../styles/Universe.css';
import { useFocusTrap } from '../hooks/useFocusTrap';

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
    icon: Leaf,
    position: { x: 140, y: 120 },
    summary: 'Light-dependent conversion of photons to chemical potential energy.'
  },
  {
    id: 2,
    name: 'Cellular Respiration',
    category: 'biology',
    icon: Wind,
    position: { x: 260, y: 180 },
    summary: 'Aerobic catabolism of glucose yielding ATP and CO2.'
  },
  {
    id: 3,
    name: 'ATP Synthesis',
    category: 'chemistry',
    icon: Zap,
    position: { x: 380, y: 100 },
    summary: 'Proton gradient driven rotary catalysis via ATP synthase.'
  },
  {
    id: 4,
    name: 'Thermodynamic Entropy',
    category: 'physics',
    icon: Orbit,
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

// The node label is drawn at node.y + 36, below the circle. An edge label used
// to sit at a flat midpointY - 4, so it landed in whichever row that produced:
// for the Cellular Respiration -> ATP Synthesis edge, "Energy Coupling" ended up
// at y=136, the exact baseline of the "ATP Synthesis" node label beside it, and
// the two collided at every scale.
//
// Offsetting perpendicular to the edge, by a fraction of the edge's own length,
// keeps the clearance proportional to how far apart the two nodes are, so it
// holds when the diagram is scaled and when a node moves, instead of being a
// constant that happened to line up at one set of coordinates.
//
// Both perpendiculars are scored against every node and the roomier one wins.
// A fixed side is not enough: "Solar Flux" runs from Thermodynamic Entropy to
// Photosynthesis, and pushing its label upward walks it straight through the
// Cellular Respiration circle that sits near the midpoint.
const EDGE_LABEL_CLEARANCE = [0.12, 0.2, 0.28, 0.36];
const NODE_RADIUS = 24;
const NODE_LABEL_DROP = 36;
// An 8px monospace label runs about 5 user units per character, so a 15
// character name is roughly 75u wide. Scoring only the anchor point let a wide
// label reach past a node it had cleared by a comfortable margin: "Solar Flux"
// sat 17u from the Cellular Respiration circle centre-to-centre and still
// overlapped it, because the text extends roughly 25u sideways from its anchor.
// The label's own footprint has to be part of the measurement.
const LABEL_WIDTH_PER_CHAR = 5;
const LABEL_HALF_HEIGHT = 4.7;

const getEdgeLabelPosition = (fromNode, toNode, allNodes, label) => {
  const dx = toNode.position.x - fromNode.position.x;
  const dy = toNode.position.y - fromNode.position.y;
  const length = Math.hypot(dx, dy);
  const mx = (fromNode.position.x + toNode.position.x) / 2;
  const my = (fromNode.position.y + toNode.position.y) / 2;
  if (!length) return { x: mx, y: my };

  const perpX = -dy / length;
  const perpY = dx / length;

  // The label is centred on its anchor and textAnchor is middle, so it reaches
  // half its width either side of it. Measuring the anchor alone would let a long
  // name overlap something it had nominally cleared.
  const halfWidth = (String(label || '').length * LABEL_WIDTH_PER_CHAR) / 2;

  // Worst clearance from this anchor, in user units. Negative means the label
  // would sit on top of a node's circle or its name.
  const worstGap = (ax, ay) => {
    const left = ax - halfWidth;
    const right = ax + halfWidth;
    const top = ay - LABEL_HALF_HEIGHT;
    const bottom = ay + LABEL_HALF_HEIGHT;

    return allNodes.reduce((worst, node) => {
      // Nearest point of this node's circle to the label box.
      const cx = Math.max(left, Math.min(node.position.x, right));
      const cy = Math.max(top, Math.min(node.position.y, bottom));
      const fromCircle = Math.hypot(cx - node.position.x, cy - node.position.y) - NODE_RADIUS;

      // Vertical gap to the node's own name, whose baseline is node.y + 36.
      const nodeTop = node.position.y + NODE_LABEL_DROP - LABEL_HALF_HEIGHT;
      const nodeBottom = node.position.y + NODE_LABEL_DROP + LABEL_HALF_HEIGHT;
      const fromName = top >= nodeBottom ? top - nodeBottom : bottom <= nodeTop ? nodeTop - bottom : -Infinity;

      return Math.min(worst, fromCircle, fromName);
    }, Infinity);
  };

  // Try each clearance on both sides and keep the roomiest. Trying several
  // distances matters because the nearest obstacle differs per edge: two nodes
  // that sit far apart have room just off the midpoint, while a short edge
  // hemmed in by a third node needs to step much further out.
  let best = { x: mx, y: my, gap: worstGap(mx, my) };
  EDGE_LABEL_CLEARANCE.forEach((factor) => {
    const offset = length * factor;
    [1, -1].forEach((sign) => {
      const ax = mx + perpX * offset * sign;
      const ay = my + perpY * offset * sign;
      const gap = worstGap(ax, ay);
      if (gap > best.gap) best = { x: ax, y: ay, gap };
    });
  });
  return best;
};

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
  const addConceptModalRef = useRef(null);
  useFocusTrap(isAddingConcept, addConceptModalRef, { onClose: () => setIsAddingConcept(false) });

  const handleAddConcept = (e) => {
    e.preventDefault();
    if (!newConceptName.trim()) return;

    const newId = Date.now();
    const newEntry = {
      id: newId,
      name: newConceptName.trim(),
      category: newConceptCategory,
      icon: newConceptCategory === 'physics' ? Atom : newConceptCategory === 'biology' ? Dna : Lightbulb,
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
              { id: 'galaxy', icon: Orbit, label: 'Topology Graph' },
              { id: 'timeline', icon: TrendingUp, label: 'Epistemic Timeline' },
              { id: 'map', icon: MapIcon, label: 'Matrix Grid' },
            ].map((mode) => (
              <button
                key={mode.id}
                className={`mode-tab-btn ${viewMode === mode.id ? 'active' : ''}`}
                onClick={() => setViewMode(mode.id)}
              >
                <span><mode.icon size={15} aria-hidden="true" /></span>
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
            <div className="add-concept-modal" ref={addConceptModalRef} role="dialog" aria-modal="true" aria-labelledby="add-concept-title">
              <div className="modal-header">
                <h2 id="add-concept-title">Add Concept to Knowledge Universe</h2>
                <button className="modal-close-btn" aria-label="Close the add concept dialog" onClick={() => setIsAddingConcept(false)}><X size={18} aria-hidden="true" /></button>
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
            {/* preserveAspectRatio is stated rather than left at its default so
                the coordinate space matches the element's ratio. The CSS sets
                that ratio; this keeps the drawing and its box in agreement if
                the viewBox ever changes. */}
            <svg viewBox="0 0 540 380" preserveAspectRatio="xMidYMid meet" className="topology-svg">
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
                const labelPos = getEdgeLabelPosition(fromNode, toNode, concepts, conn.label);
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
                        x={labelPos.x}
                        y={labelPos.y}
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
                const NodeIcon = node.icon;
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
                    {/* Lucide renders an <svg>, so a nested <svg> at the node origin
                        replaces the emoji glyph that used to sit in a <text> here. */}
                    <NodeIcon size={16} x={-8} y={-7} color={nodeColor} strokeWidth={1.75} aria-hidden="true" />
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
                    <span className="inspector-icon"><selectedConcept.icon size={18} aria-hidden="true" /></span>
                    <h2 className="inspector-name">{selectedConcept.name}</h2>
                  </div>
                  <button className="inspector-close" aria-label="Close the node inspector" onClick={() => setSelectedConcept(null)}><X size={16} aria-hidden="true" /></button>
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
                    <span className="matrix-icon"><concept.icon size={16} aria-hidden="true" /></span>
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