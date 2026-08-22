import React, { useState } from 'react';
import '../styles/SketchbookCard.css';

function SketchbookCard({ term }) {
  const [highlightedPart, setHighlightedPart] = useState(null);

  const termData = {
    'capillary-action': {
      term: 'Capillary Action',
      coreConcept: 'The ability of liquids to flow upward through narrow spaces against gravity.',
      parts: [
        { id: 'liquid', label: 'Liquid', description: 'Water molecules attracted to solid surfaces' },
        { id: 'tube', label: 'Tube', description: 'Narrow space with weak adhesive forces' },
        { id: 'meniscus', label: 'Meniscus', description: 'Curved surface formed by surface tension' },
      ],
      artEquivalent:
        'Like watercolor paint spreading across textured paper, water climbs through tiny fibers because of molecular attraction.',
    },
  };

  const data = termData[term] || termData['capillary-action'];

  return (
    <div className="sketchbook-card">
      <div className="sketchbook-illustration-side">
        <svg viewBox="0 0 300 400" className="sketch-svg">
          {/* Tube */}
          <rect x="100" y="50" width="30" height="280" fill="none" stroke="#333" strokeWidth="2" />
          <line x1="100" y1="50" x2="130" y2="50" stroke="#333" strokeWidth="2" />

          {/* Liquid */}
          <path
            d="M 102 280 Q 115 240 128 280 Z"
            fill="#667eea"
            opacity="0.6"
            className="liquid-fill"
          />
          <path d="M 102 280 Q 115 240 128 280" stroke="#667eea" strokeWidth="2" fill="none" />

          {/* Meniscus */}
          <path d="M 102 240 Q 115 235 128 240" stroke="#667eea" strokeWidth="3" fill="none" />
          <text x="115" y="225" fontSize="12" fill="#667eea" textAnchor="middle" fontWeight="bold">
            Meniscus
          </text>

          {/* Labels */}
          <text x="160" y="100" fontSize="14" fill="#333" fontWeight="bold">
            Adhesive Forces
          </text>
          <path d="M 155 105 L 135 120" stroke="#333" strokeWidth="1" />

          <text x="160" y="200" fontSize="14" fill="#333" fontWeight="bold">
            Capillary Rise
          </text>
        </svg>
        <p className="illustration-credit">Hand-sketched illustration</p>
      </div>

      <div className="sketchbook-definition-side">
        <div className="definition-header">
          <h2 className="definition-term">{data.term}</h2>
          <div className="definition-divider"></div>
        </div>

        <div className="definition-section">
          <h3 className="section-title">The Core Concept</h3>
          <p className="section-content">{data.coreConcept}</p>
        </div>

        <div className="definition-section">
          <h3 className="section-title">The Visual Breakdown</h3>
          <div className="parts-list">
            {data.parts.map((part) => (
              <div
                key={part.id}
                className="part-item"
                onMouseEnter={() => setHighlightedPart(part.id)}
                onMouseLeave={() => setHighlightedPart(null)}
              >
                <div className={`part-label ${highlightedPart === part.id ? 'active' : ''}`}>
                  {part.label}
                </div>
                <p className={`part-description ${highlightedPart === part.id ? 'visible' : ''}`}>
                  {part.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="definition-section">
          <h3 className="section-title">The Art World Equivalent</h3>
          <p className="section-content italic">{data.artEquivalent}</p>
        </div>
      </div>
    </div>
  );
}

export default SketchbookCard;