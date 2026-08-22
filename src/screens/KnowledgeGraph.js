import React, { useState } from 'react';
import '../styles/Components.css';

function KnowledgeGraph({ subject, module, onBack }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Example knowledge graphs
  const graphs = {
    physics: {
      nodes: [
        { id: 1, name: "Newton's Laws", level: 1, x: 50, y: 20 },
        { id: 2, name: 'Forces', level: 1, x: 150, y: 20 },
        { id: 3, name: 'Work & Energy', level: 2, x: 100, y: 80 },
        { id: 4, name: 'Momentum', level: 2, x: 180, y: 80 },
        { id: 5, name: 'Thermodynamics', level: 3, x: 140, y: 140 },
      ],
      edges: [
        { from: 1, to: 3 },
        { from: 2, to: 3 },
        { from: 3, to: 5 },
        { from: 4, to: 5 },
      ],
    },
    philosophy: {
      nodes: [
        { id: 1, name: 'Logic', level: 1, x: 50, y: 20 },
        { id: 2, name: 'Epistemology', level: 1, x: 150, y: 20 },
        { id: 3, name: 'Metaphysics', level: 2, x: 100, y: 80 },
        { id: 4, name: 'Ethics', level: 2, x: 180, y: 80 },
        { id: 5, name: 'Existentialism', level: 3, x: 140, y: 140 },
      ],
      edges: [
        { from: 1, to: 3 },
        { from: 2, to: 3 },
        { from: 3, to: 5 },
        { from: 4, to: 5 },
      ],
    },
  };

  const graph = graphs[subject.icon === '⚛️' ? 'physics' : 'philosophy'] || graphs.physics;

  return (
    <div className="learn-container">
      <div className="learn-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>🗺️ Knowledge Map</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="knowledge-graph-container">
        <svg className="graph-svg" viewBox="0 0 400 300">
          {/* Edges */}
          {graph.edges.map((edge, idx) => {
            const fromNode = graph.nodes.find((n) => n.id === edge.from);
            const toNode = graph.nodes.find((n) => n.id === edge.to);
            return (
              <line
                key={`edge-${idx}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#D3D1C7"
                strokeWidth="2"
              />
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((node) => (
            <g
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="graph-node"
            >
              <circle cx={node.x} cy={node.y} r="30" />
              <text x={node.x} y={node.y}>{node.name}</text>
            </g>
          ))}
        </svg>

        {selectedNode && (
          <div className="node-details">
            <h3>{selectedNode.name}</h3>
            <p>This concept connects to other topics and forms the foundation for advanced learning.</p>
            <button className="btn-explore">Explore This Topic →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default KnowledgeGraph;