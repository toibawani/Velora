import React, { useState } from 'react';
import '../styles/ConceptMap.css';

function ConceptMap({ subject }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const conceptMaps = {
    physics: {
      title: 'Physics Knowledge Map',
      nodes: [
        { id: 1, label: 'Space & Time', x: 50, y: 20, color: '#2563EB' },
        { id: 2, label: 'Gravity', x: 80, y: 50, color: '#2563EB' },
        { id: 3, label: 'Black Holes', x: 95, y: 80, color: '#E74C3C' },
        { id: 4, label: 'Relativity', x: 20, y: 50, color: '#2563EB' },
        { id: 5, label: 'Quantum Mechanics', x: 50, y: 80, color: '#F39C12' },
      ],
      edges: [
        { from: 1, to: 2, label: 'leads to' },
        { from: 2, to: 3, label: 'extreme case' },
        { from: 1, to: 4, label: 'connects to' },
        { from: 4, to: 2, label: 'explains' },
        { from: 1, to: 5, label: 'contrasts with' },
      ],
      details: {
        1: 'The fundamental concepts of how space and time work together',
        2: 'The force that pulls objects together based on mass',
        3: 'Region where gravity is so strong nothing escapes',
        4: 'Theory describing gravity and spacetime curvature',
        5: 'Physics of extremely small scales and particles',
      },
    },
    philosophy: {
      title: 'Philosophy Knowledge Map',
      nodes: [
        { id: 1, label: 'Epistemology', x: 50, y: 20, color: '#2E7D32' },
        { id: 2, label: 'Ontology', x: 80, y: 50, color: '#2E7D32' },
        { id: 3, label: 'Ethics', x: 20, y: 50, color: '#2E7D32' },
        { id: 4, label: 'Metaphysics', x: 50, y: 80, color: '#F39C12' },
        { id: 5, label: 'Logic', x: 95, y: 20, color: '#2563EB' },
      ],
      edges: [
        { from: 1, to: 4, label: 'overlaps with' },
        { from: 2, to: 4, label: 'part of' },
        { from: 3, to: 1, label: 'requires' },
        { from: 5, to: 1, label: 'supports' },
      ],
      details: {
        1: 'Study of knowledge and how we know things',
        2: 'Study of existence and being',
        3: 'Study of right and wrong',
        4: 'Study of reality and existence',
        5: 'Study of reasoning and arguments',
      },
    },
    history: {
      title: 'History Knowledge Map',
      nodes: [
        { id: 1, label: 'Ancient Civilizations', x: 50, y: 20, color: '#F39C12' },
        { id: 2, label: 'Medieval Era', x: 30, y: 50, color: '#F39C12' },
        { id: 3, label: 'Renaissance', x: 70, y: 50, color: '#F39C12' },
        { id: 4, label: 'Industrial Revolution', x: 90, y: 80, color: '#E74C3C' },
        { id: 5, label: 'Modern Era', x: 50, y: 80, color: '#E74C3C' },
      ],
      edges: [
        { from: 1, to: 2, label: 'leads to' },
        { from: 1, to: 3, label: 'inspired' },
        { from: 2, to: 3, label: 'transitioning to' },
        { from: 3, to: 4, label: 'causes' },
        { from: 4, to: 5, label: 'creates' },
      ],
      details: {
        1: 'Earliest human civilizations (Egypt, Rome, China)',
        2: 'Period of feudalism and church dominance',
        3: 'Rebirth of learning inspired by ancient knowledge',
        4: 'Mechanization and factory systems transform society',
        5: 'Contemporary era shaped by technology and globalization',
      },
    },
  };

  const map = conceptMaps[subject] || conceptMaps.physics;

  const handleNodeClick = (nodeId) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const handleNodeKeyDown = (event, nodeId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNodeClick(nodeId);
    }
  };

  return (
    <div className="concept-map">
      <div className="map-header">
        <h2 className="map-title">{map.title}</h2>
        <p className="map-subtitle">Click nodes to explore connections</p>
      </div>

      <div className="map-visualization">
        <svg viewBox="0 0 100 100" className="concept-svg">
          {/* Draw edges */}
          {map.edges.map((edge, idx) => {
            const fromNode = map.nodes.find((n) => n.id === edge.from);
            const toNode = map.nodes.find((n) => n.id === edge.to);
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className="concept-edge"
                  stroke="#ddd"
                  strokeWidth="0.5"
                />
                <text
                  x={midX}
                  y={midY}
                  className="edge-label"
                  fontSize="2"
                  fill="#999"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Draw nodes */}
          {map.nodes.map((node) => (
            <g
              key={node.id}
              className={`concept-node ${selectedNode === node.id ? 'selected' : ''}`}
              onClick={() => handleNodeClick(node.id)}
               onKeyDown={(event) => handleNodeKeyDown(event, node.id)}
               role="button"
               tabIndex={0}
               aria-label={`Explore ${node.label}`}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r="5"
                fill={node.color}
                stroke={selectedNode === node.id ? '#000' : 'none'}
                strokeWidth={selectedNode === node.id ? '0.5' : '0'}
              />
              <text
                x={node.x}
                y={node.y + 8}
                className="node-label"
                fontSize="2.5"
                textAnchor="middle"
                fill="#1a1a1a"
                fontWeight="600"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {selectedNode && (
        <div className="node-detail">
          <div className="detail-header">
            <h3 className="detail-title">
              {map.nodes.find((n) => n.id === selectedNode).label}
            </h3>
            <button className="detail-close" onClick={() => setSelectedNode(null)}>
              ✕
            </button>
          </div>
          <p className="detail-description">
            {map.details[selectedNode]}
          </p>
          <button className="learn-btn">Learn More →</button>
        </div>
      )}

      <div className="map-legend">
        <h4 className="legend-title">Key Concepts</h4>
        <div className="legend-items">
          {map.nodes.map((node) => (
            <div key={node.id} className="legend-item">
              <div
                className="legend-color"
                style={{ background: node.color }}
              ></div>
              <span className="legend-label">{node.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConceptMap;