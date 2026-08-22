import React, { useState } from 'react';
import '../styles/Universe.css';

function UniverseBuilder({ topic }) {
  const [viewMode, setViewMode] = useState('galaxy'); // galaxy, timeline, map, world
  const [concepts, setConcepts] = useState([
    {
      id: 1,
      name: 'Photosynthesis',
      category: 'biology',
      icon: '🌿',
      position: { x: 100, y: 100 },
    },
    {
      id: 2,
      name: 'Cellular Respiration',
      category: 'biology',
      icon: '💨',
      position: { x: 200, y: 150 },
    },
    {
      id: 3,
      name: 'ATP Synthesis',
      category: 'chemistry',
      icon: '⚡',
      position: { x: 250, y: 80 },
    },
    {
      id: 4,
      name: 'Glucose Metabolism',
      category: 'chemistry',
      icon: '🍬',
      position: { x: 180, y: 200 },
    },
  ]);
  const [connections, setConnections] = useState([
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 1 },
  ]);

  const categoryColors = {
    biology: '#2ECC71',
    chemistry: '#E74C3C',
    physics: '#3498DB',
    history: '#F39C12',
    philosophy: '#9B59B6',
  };

  return (
    <div className="universe-builder-container">
      <h2>🌌 Build Your Own Universe</h2>
      <p className="universe-intro">
        Organize your knowledge into interconnected galaxies, timelines, maps, or worlds.
      </p>

      {/* View Mode Selector */}
      <div className="view-modes">
        {[
          { id: 'galaxy', icon: '🌌', label: 'Galaxy View' },
          { id: 'timeline', icon: '📈', label: 'Timeline' },
          { id: 'map', icon: '🗺️', label: 'Concept Map' },
          { id: 'world', icon: '🌍', label: 'World' },
        ].map((mode) => (
          <button
            key={mode.id}
            className={`view-btn ${viewMode === mode.id ? 'active' : ''}`}
            onClick={() => setViewMode(mode.id)}
          >
            <span className="view-icon">{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Galaxy View */}
      {viewMode === 'galaxy' && (
        <div className="universe-view galaxy-view">
          <svg viewBox="0 0 600 400" className="galaxy-svg">
            {/* Connections */}
            {connections.map((conn, idx) => {
              const fromConcept = concepts.find((c) => c.id === conn.from);
              const toConcept = concepts.find((c) => c.id === conn.to);
              return (
                <line
                  key={idx}
                  x1={fromConcept.position.x}
                  y1={fromConcept.position.y}
                  x2={toConcept.position.x}
                  y2={toConcept.position.y}
                  stroke="#D3D1C7"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}

            {/* Concept Nodes */}
            {concepts.map((concept) => (
              <g
                key={concept.id}
                className="concept-node"
                transform={`translate(${concept.position.x}, ${concept.position.y})`}
              >
                <circle
                  r="35"
                  fill={categoryColors[concept.category]}
                  opacity="0.2"
                />
                <circle
                  r="30"
                  fill={categoryColors[concept.category]}
                  stroke={categoryColors[concept.category]}
                  strokeWidth="2"
                />
                <text
                  y="8"
                  textAnchor="middle"
                  className="concept-emoji"
                  fontSize="20"
                >
                  {concept.icon}
                </text>
                <text
                  y="45"
                  textAnchor="middle"
                  className="concept-label"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {concept.name.split(' ')[0]}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="universe-view timeline-view">
          <div className="timeline-content">
            {concepts.map((concept, idx) => (
              <div
                key={concept.id}
                className="timeline-item"
                style={{
                  borderLeftColor: categoryColors[concept.category],
                }}
              >
                <div
                  className="timeline-marker"
                  style={{
                    background: categoryColors[concept.category],
                  }}
                >
                  {concept.icon}
                </div>
                <div className="timeline-body">
                  <h4>{concept.name}</h4>
                  <p className="timeline-category">{concept.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="universe-view map-view">
          <div className="map-content">
            <h3>Concept Relationships</h3>
            <div className="concept-blocks">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="concept-block"
                  style={{
                    borderTopColor: categoryColors[concept.category],
                  }}
                >
                  <span className="block-icon">{concept.icon}</span>
                  <h4>{concept.name}</h4>
                  <p className="block-category">{concept.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* World View */}
      {viewMode === 'world' && (
        <div className="universe-view world-view">
          <div className="world-globe">
            <svg viewBox="0 0 400 300" className="world-svg">
              <defs>
                <radialGradient id="worldGradient">
                  <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#764ba2" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              {/* World background */}
              <circle cx="200" cy="150" r="120" fill="url(#worldGradient)" />

              {/* Continents (concept clusters) */}
              {concepts.map((concept, idx) => {
                const angle = (idx / concepts.length) * Math.PI * 2;
                const x = 200 + 80 * Math.cos(angle);
                const y = 150 + 80 * Math.sin(angle);
                return (
                  <g key={concept.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill={categoryColors[concept.category]}
                      opacity="0.7"
                    />
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="12"
                    >
                      {concept.icon}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="world-caption">
            🌍 Your knowledge world. Each continent is a concept cluster.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="universe-actions">
        <button className="btn-add-concept">➕ Add Concept</button>
        <button className="btn-export">📤 Export Universe</button>
        <button className="btn-share">🔗 Share with Class</button>
      </div>

      <div className="universe-note">
        <p>🧠 <strong>Why This Matters:</strong> Visualizing knowledge as an interconnected system creates ownership and deeper understanding. You're no longer memorizing; you're building.</p>
      </div>
    </div>
  );
}

export default UniverseBuilder;