import React, { useState } from 'react';
import '../styles/SketchbookCard.css';

/**
 * SketchbookCard Component
 * 
 * Editorial, humanized visual cards combining:
 * - Hand-sketched SVG diagrams with interactive callouts
 * - Core conceptual definition & visual breakdown
 * - "Everyday Connection" (real-world daily life application)
 * - On-the-fly interactive "Challenge Me" quiz
 * - "Save to Study Kit" personal curation
 */
function SketchbookCard({ term = 'capillary-action' }) {
  const [highlightedPart, setHighlightedPart] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [selectedTermKey, setSelectedTermKey] = useState(term);

  const termData = {
    'capillary-action': {
      term: 'Capillary Action',
      domain: 'Fluid Dynamics & Surface Tension',
      coreConcept: 'The spontaneous upward movement of liquids through narrow spaces against the pull of gravity, driven by adhesive forces between the liquid and solid surfaces exceeding cohesive intermolecular forces.',
      parts: [
        { id: 'liquid', label: 'Adhesive Attraction', description: 'Water molecules bond strongly with polar molecules lining narrow conduits.' },
        { id: 'tube', label: 'Conduit Radius', description: 'As tube diameter shrinks, the ratio of surface contact area to liquid weight increases exponentially.' },
        { id: 'meniscus', label: 'Curved Meniscus', description: 'Surface tension pulls the water surface upward into a concave curve.' },
      ],
      artEquivalent:
        'Like watercolor pigments racing across textured cotton rag paper, water climbs through tiny cellulose fibers through atomic-level molecular attraction.',
      everydayConnection:
        'Without capillary action, 300-foot Redwood trees could not draw water from soil to their crown leaves without mechanical pumps. It also powers paper towels instantly wicking kitchen spills and tear ducts lubricating human eyes.',
      challenge: {
        question: 'Why does water rise higher in a thinner glass straw than in a wide glass?',
        options: [
          'The weight of the liquid column is smaller relative to the adhesive contact area',
          'Gravity exerts zero force inside thin tubes',
          'Water molecules expand in volume when compressed',
          'Atmospheric air pressure pushes only on wide tubes'
        ],
        correct: 0,
        explanation: 'Jurin’s Law states capillary rise height is inversely proportional to tube radius: $h = \\frac{2\\gamma \\cos\\theta}{\\rho g r}$. Smaller radius means less fluid weight per unit perimeter contact.'
      }
    },
    'event-horizon': {
      term: 'Event Horizon',
      domain: 'General Relativity & Astrophysics',
      coreConcept: 'The non-physical boundary enveloping a black hole where the escape velocity strictly equals the speed of light in a vacuum ($c$). Outside, light can radiate freely; inside, all null geodesics curve inexorably toward the singularity.',
      parts: [
        { id: 'horizon-radius', label: 'Schwarzschild Radius ($R_s$)', description: 'The critical geometric radius ($2GM/c^2$) where gravity traps all outgoing light.' },
        { id: 'photon-sphere', label: 'Photon Sphere ($1.5 R_s$)', description: 'The unstable orbit where light rays can orbit the black hole in circles.' },
        { id: 'accretion-disk', label: 'Relativistic Accretion Ring', description: 'Superheated plasma swirling at near-light speeds emitting intense X-rays.' }
      ],
      artEquivalent:
        'Like an invisible waterfall plunging faster than a salmon can swim upstream—no matter how vigorously you paddle, downstream is the only surviving vector.',
      everydayConnection:
        'Event horizons establish the boundary conditions for cosmic cosmic ray acceleration and inform modern optical GPS satellite relativistic timing corrections across Earth’s geoid.',
      challenge: {
        question: 'What happens to a clock dropped toward the event horizon from the viewpoint of a distant observer?',
        options: [
          'It appears to tick slower and slower, asymptotically freezing at the horizon and redshifting to invisibility',
          'It instantly vanishes with an explosive flash of green light',
          'Its hands spin infinitely fast and reverse direction',
          'It continues ticking normally with zero visual distortion'
        ],
        correct: 0,
        explanation: 'Gravitational time dilation causes emitted photon wavelengths to stretch infinitely (infinite gravitational redshift) as viewed by external observers.'
      }
    },
    'entropy': {
      term: 'Entropy ($S$)',
      domain: 'Thermodynamics & Statistical Mechanics',
      coreConcept: 'A quantitative measure of the number of microscopic configurations (microstates) that correspond to a given macroscopic thermodynamic state ($S = k_B \\ln \\Omega$).',
      parts: [
        { id: 'microstates', label: 'Microstates ($\\Omega$)', description: 'The exact arrangement of individual particles and quantum momentum states.' },
        { id: 'arrow-of-time', label: 'Thermodynamic Arrow of Time', description: 'The universal tendency of isolated systems to evolve toward maximum probability.' },
        { id: 'dissipation', label: 'Thermal Dissipation', description: 'Concentrated useful work dissipating into dispersed, disordered heat energy.' }
      ],
      artEquivalent:
        'Like a drop of indigo ink dispersing in warm water—while molecular physics permits the ink to re-assemble into a single droplet, the statistical odds against it are virtually infinite.',
      everydayConnection:
        'Entropy explains why your coffee always cools to room temperature, why eggs break but never spontaneously un-break, and why computer processors require cooling fans to exhaust computational heat.',
      challenge: {
        question: 'Why does entropy in the universe always increase overall?',
        options: [
          'Because disordered microstates vastly outnumber ordered ones by astronomical factors',
          'Because atoms decay into pure void over time',
          'Because gravitational fields absorb matter',
          'Because temperature is constantly falling to absolute zero'
        ],
        correct: 0,
        explanation: 'Statistical mechanics shows that nature simply evolves into the state of maximum statistical probability, where the number of microstates is maximized.'
      }
    }
  };

  const data = termData[selectedTermKey] || termData['capillary-action'];

  const handleSaveToStudyKit = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="sketchbook-wrapper">
      {/* Term Switcher */}
      <div className="sketchbook-selector-bar">
        <span className="selector-title">Curated Concept Visuals:</span>
        <div className="selector-pills">
          <button
            className={`term-pill ${selectedTermKey === 'capillary-action' ? 'active' : ''}`}
            onClick={() => { setSelectedTermKey('capillary-action'); setShowChallenge(false); setQuizAnswer(null); }}
          >
            Capillary Action
          </button>
          <button
            className={`term-pill ${selectedTermKey === 'event-horizon' ? 'active' : ''}`}
            onClick={() => { setSelectedTermKey('event-horizon'); setShowChallenge(false); setQuizAnswer(null); }}
          >
            Event Horizon
          </button>
          <button
            className={`term-pill ${selectedTermKey === 'entropy' ? 'active' : ''}`}
            onClick={() => { setSelectedTermKey('entropy'); setShowChallenge(false); setQuizAnswer(null); }}
          >
            Entropy & Arrow of Time
          </button>
        </div>
      </div>

      <div className="sketchbook-card">
        {/* Left Side: Hand-Sketched Diagram */}
        <div className="sketchbook-illustration-side">
          {selectedTermKey === 'capillary-action' && (
            <svg viewBox="0 0 300 400" className="sketch-svg">
              <rect x="95" y="40" width="40" height="300" fill="none" stroke="#555" strokeWidth="2" />
              <line x1="95" y1="40" x2="135" y2="40" stroke="#555" strokeWidth="2" />
              <path
                d="M 97 290 Q 115 220 133 290 Z"
                fill="#4f7df3"
                opacity="0.6"
                className="liquid-fill"
              />
              <path d="M 97 290 Q 115 220 133 290" stroke="#4f7df3" strokeWidth="2" fill="none" />
              <path d="M 97 220 Q 115 210 133 220" stroke="#4f7df3" strokeWidth="3" fill="none" />
              <text x="115" y="195" fontSize="11" fill="#4f7df3" textAnchor="middle" fontWeight="bold">
                Meniscus
              </text>
              <text x="165" y="100" fontSize="13" fill="#e0e0e0" fontWeight="bold">
                Adhesive Forces
              </text>
              <path d="M 160 105 L 138 120" stroke="#888" strokeWidth="1" />
              <text x="165" y="220" fontSize="13" fill="#e0e0e0" fontWeight="bold">
                Capillary Rise ($h$)
              </text>
            </svg>
          )}

          {selectedTermKey === 'event-horizon' && (
            <svg viewBox="0 0 300 400" className="sketch-svg">
              <circle cx="150" cy="200" r="90" fill="none" stroke="#ff9f0a" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="150" cy="200" r="65" fill="none" stroke="#4f7df3" strokeWidth="2" />
              <circle cx="150" cy="200" r="45" fill="#000000" stroke="#ffffff" strokeWidth="2" />
              <text x="150" y="205" fontSize="12" fill="#ffffff" textAnchor="middle" fontWeight="bold">
                Singularity
              </text>
              <text x="150" y="145" fontSize="11" fill="#4f7df3" textAnchor="middle" fontWeight="bold">
                $R_s$ Horizon
              </text>
              <text x="150" y="95" fontSize="11" fill="#ff9f0a" textAnchor="middle" fontWeight="bold">
                Photon Sphere (1.5 $R_s$)
              </text>
            </svg>
          )}

          {selectedTermKey === 'entropy' && (
            <svg viewBox="0 0 300 400" className="sketch-svg">
              <rect x="40" y="80" width="90" height="90" fill="none" stroke="#4f7df3" strokeWidth="2" />
              <circle cx="65" cy="105" r="4" fill="#4f7df3" />
              <circle cx="85" cy="105" r="4" fill="#4f7df3" />
              <circle cx="105" cy="105" r="4" fill="#4f7df3" />
              <circle cx="65" cy="125" r="4" fill="#4f7df3" />
              <circle cx="85" cy="125" r="4" fill="#4f7df3" />
              <circle cx="105" cy="125" r="4" fill="#4f7df3" />
              <text x="85" y="195" fontSize="11" fill="#4f7df3" textAnchor="middle" fontWeight="bold">
                Low Entropy (Ordered)
              </text>

              <path d="M 140 125 L 165 125" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrow)" />

              <rect x="175" y="80" width="90" height="90" fill="none" stroke="#ff9f0a" strokeWidth="2" />
              <circle cx="185" cy="95" r="4" fill="#ff9f0a" />
              <circle cx="245" cy="105" r="4" fill="#ff9f0a" />
              <circle cx="195" cy="150" r="4" fill="#ff9f0a" />
              <circle cx="230" cy="135" r="4" fill="#ff9f0a" />
              <circle cx="210" cy="115" r="4" fill="#ff9f0a" />
              <circle cx="250" cy="160" r="4" fill="#ff9f0a" />
              <text x="220" y="195" fontSize="11" fill="#ff9f0a" textAnchor="middle" fontWeight="bold">
                High Entropy (Dispersed)
              </text>
            </svg>
          )}

          <div className="illustration-caption-row">
            <span className="caption-text">Interactive Geometric Schema</span>
          </div>
        </div>

        {/* Right Side: Definition, Everyday Connection, & Challenge */}
        <div className="sketchbook-definition-side">
          <div className="definition-header">
            <div>
              <span className="domain-label">{data.domain}</span>
              <h2 className="definition-term">{data.term}</h2>
            </div>
            <div className="card-utility-actions">
              <button
                className={`save-kit-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveToStudyKit}
              >
                {isSaved ? '✓ Saved in Study Kit' : '⭐ Save to Study Kit'}
              </button>
            </div>
          </div>

          <div className="definition-section">
            <h3 className="section-title">The Core Concept</h3>
            <p className="section-content">{data.coreConcept}</p>
          </div>

          <div className="definition-section">
            <h3 className="section-title">Visual Anatomy Breakdown</h3>
            <div className="parts-list">
              {data.parts.map((part) => (
                <div
                  key={part.id}
                  className={`part-item ${highlightedPart === part.id ? 'active' : ''}`}
                  onMouseEnter={() => setHighlightedPart(part.id)}
                  onMouseLeave={() => setHighlightedPart(null)}
                >
                  <div className="part-label">
                    {part.label}
                  </div>
                  <p className="part-description">
                    {part.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Everyday Connection */}
          <div className="definition-section everyday-connection-box">
            <h3 className="section-title">🌍 Everyday Connection</h3>
            <p className="section-content">{data.everydayConnection}</p>
          </div>

          {/* Art Metaphor */}
          <div className="definition-section">
            <h3 className="section-title">Poetic Metaphor</h3>
            <p className="section-content italic">{data.artEquivalent}</p>
          </div>

          {/* Interactive Challenge Me Trigger */}
          <div className="definition-section challenge-cta-row">
            {!showChallenge ? (
              <button
                className="challenge-me-trigger-btn"
                onClick={() => setShowChallenge(true)}
              >
                ⚡ Challenge Me on {data.term} →
              </button>
            ) : (
              <div className="interactive-challenge-panel">
                <div className="challenge-panel-header">
                  <span className="panel-badge">Rapid Active Recall</span>
                  <button className="close-panel-btn" onClick={() => setShowChallenge(false)}>×</button>
                </div>
                <p className="challenge-q-text">{data.challenge.question}</p>
                <div className="challenge-opts-list">
                  {data.challenge.options.map((opt, i) => {
                    const isSelected = quizAnswer === i;
                    const isCorrect = i === data.challenge.correct;
                    let optClass = 'challenge-opt-btn';
                    if (quizAnswer !== null) {
                      if (isSelected) optClass += isCorrect ? ' correct' : ' wrong';
                      else if (isCorrect) optClass += ' correct';
                    }
                    return (
                      <button
                        key={i}
                        className={optClass}
                        onClick={() => setQuizAnswer(i)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizAnswer !== null && (
                  <p className="challenge-explanation-text">
                    💡 {data.challenge.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SketchbookCard;