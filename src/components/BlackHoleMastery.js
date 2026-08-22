import React, { useState, useEffect, useRef } from 'react';
import '../styles/BlackHoleMastery.css';

function BlackHoleMastery({ onBack }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const levels = [
    {
      id: 'what-is-space',
      title: 'What is Space?',
      icon: '🌌',
      color: '#667eea',
      content: 'The three-dimensional arena in which all physical objects exist and events occur.',
      duration: '8 mins',
    },
    {
      id: 'spacetime',
      title: 'Space-Time',
      icon: '⏱️',
      color: '#764ba2',
      content: 'Time and space are the same fabric—spacetime. Gravity bends it.',
      duration: '10 mins',
    },
    {
      id: 'gravity',
      title: "Einstein's Gravity",
      icon: '⬇️',
      color: '#1D9E75',
      content: 'Mass curves spacetime. Objects follow the straightest path in curved geometry.',
      duration: '12 mins',
    },
    {
      id: 'stellar-death',
      title: 'Death of Stars',
      icon: '💫',
      color: '#FF6B6B',
      content: 'A massive star collapses when fuel runs out. Gravity wins instantly.',
      duration: '11 mins',
    },
    {
      id: 'event-horizon',
      title: 'The Event Horizon',
      icon: '🔴',
      color: '#FFA500',
      content: 'The point of no return. Escape velocity exceeds the speed of light.',
      duration: '13 mins',
    },
    {
      id: 'singularity',
      title: 'The Singularity',
      icon: '•',
      color: '#000',
      content: 'Infinite density. Zero volume. Where physics breaks down.',
      duration: '9 mins',
    },
    {
      id: 'kerr-black-hole',
      title: 'Spinning Black Holes',
      icon: '⚡',
      color: '#667eea',
      content: 'Frame-dragging. Ergosphere. The cosmic tornado.',
      duration: '14 mins',
    },
    {
      id: 'hawking-radiation',
      title: 'Hawking Radiation',
      icon: '☢️',
      color: '#E74C3C',
      content: 'Black holes evaporate. They are not actually black.',
      duration: '12 mins',
    },
    {
      id: 'information-paradox',
      title: 'Information Paradox',
      icon: '❓',
      color: '#9B59B6',
      content: 'The greatest unsolved problem. Is information destroyed?',
      duration: '15 mins',
    },
    {
      id: 'holographic-principle',
      title: 'Holographic Principle',
      icon: '🖼️',
      color: '#3498DB',
      content: 'You might be a 2D hologram projected in 3D. The universe is data.',
      duration: '16 mins',
    },
  ];

  const detailedContent = {
    'what-is-space': {
      title: 'Chapter 1: What is Space?',
      sections: [
        {
          heading: 'The Fundamental Question',
          text: 'Close your eyes. Imagine absolutely nothing. No Earth. No Sun. No atoms. Nothing. Question: What remains? Most people answer: empty space. But what exactly IS space?',
          visual: 'space-basics',
        },
        {
          heading: 'Space is NOT Empty',
          text: 'Modern physics says space contains: electromagnetic fields, gravitational fields, quantum fields, vacuum fluctuations, and possibly dark energy. "Empty space" is incredibly active.',
          visual: 'space-fields',
        },
        {
          heading: 'Three Dimensions',
          text: 'Space has Length, Width, Height. You can move left-right, forward-backward, up-down. Exactly three independent directions. This is why our world is three-dimensional.',
          visual: 'three-dimensions',
        },
        {
          heading: 'Space Can Bend',
          text: 'This is the KEY idea. Space is not merely a container. Space can bend, stretch, ripple, expand, and twist. This single insight explains gravity, black holes, and gravitational waves.',
          visual: 'space-bending',
        },
      ],
    },
    'spacetime': {
      title: 'Chapter 3: Space-Time',
      sections: [
        {
          heading: 'The Rubber Sheet Analogy',
          text: 'Imagine a huge rubber sheet. Place a bowling ball on it—the sheet bends. Place a marble—it rolls toward the bowling ball. Did the bowling ball pull it? No. The marble followed the curved surface. This is how gravity works.',
          visual: 'rubber-sheet',
        },
        {
          heading: 'Time and Space are One',
          text: 'Einstein proved time and space are the same fabric. Outside a black hole, you move freely in space but are forced forward in time. Inside, these roles SWAP. The singularity becomes your inevitable future.',
          visual: 'spacetime-diagram',
        },
      ],
    },
    'gravity': {
      title: "Chapter 10: Einstein's Gravity",
      sections: [
        {
          heading: 'Mass Curves Space',
          text: 'Mass changes the geometry of spacetime. Objects move along the straightest possible paths within that curved geometry. The Sun curves space around it, forcing Earth into orbit.',
          visual: 'mass-curves-space',
        },
        {
          heading: 'The Inverse Square Law',
          text: 'Gravity follows the inverse-square law. If you cut the distance to mass in half, gravity quadruples. If you get millimeters away from the mass, gravity becomes infinite. This is why density matters.',
          visual: 'inverse-square-law',
        },
      ],
    },
    'event-horizon': {
      title: 'Chapter 13: The Event Horizon',
      sections: [
        {
          heading: 'The Point of No Return',
          text: 'The Event Horizon is not a physical wall. It is a mathematical boundary. Inside this bubble, the escape velocity exceeds the speed of light. Since nothing outruns light, nothing escapes.',
          visual: 'event-horizon-visual',
        },
        {
          heading: 'The Observer Problem',
          text: 'Watch your friend fall into a black hole. YOU will never see them cross the horizon. They slow down, turn red, freeze like a photograph. But THEY fall straight through instantly. Time is relative.',
          visual: 'observer-paradox',
        },
      ],
    },
    'singularity': {
      title: 'Chapter 14: The Singularity',
      sections: [
        {
          heading: 'Infinite Density',
          text: 'At the center of a black hole, all the mass has collapsed to infinite density. Here, the laws of physics STOP. It is not made of atoms. It is a point where space and time stretch into infinity.',
          visual: 'singularity-core',
        },
        {
          heading: 'Spaghettification',
          text: 'As you approach the singularity, tidal forces stretch you. Your feet feel stronger gravity than your head. You are stretched into a stream of atoms as long as the universe itself.',
          visual: 'spaghettification',
        },
      ],
    },
    'kerr-black-hole': {
      title: 'Chapter 20: Spinning Black Holes',
      sections: [
        {
          heading: 'Frame-Dragging',
          text: 'A spinning black hole drags the fabric of spacetime around it like a blender in honey. It does not just pull objects; it drags the empty fabric of space itself.',
          visual: 'frame-dragging',
        },
        {
          heading: 'The Ergosphere',
          text: 'Space itself spins so fast that you cannot stand still. To stay in one spot, you would have to travel backward at the speed of light—impossible. You are trapped in a merry-go-round of space.',
          visual: 'ergosphere',
        },
        {
          heading: 'The Penrose Process',
          text: 'Because the ergosphere drags space, you can use it as a cosmic slingshot. Drop cargo into the black hole, and your ship flies out with MORE energy than it entered. You steal rotational energy from the void.',
          visual: 'penrose-process',
        },
      ],
    },
    'hawking-radiation': {
      title: 'Chapter 24: Hawking Radiation',
      sections: [
        {
          heading: 'Black Holes are Not Black',
          text: 'Stephen Hawking proved black holes glow. Near the Event Horizon, quantum particles pop into existence in pairs. One falls in, one escapes. The black hole slowly evaporates over billions of years.',
          visual: 'hawking-radiation-visual',
        },
      ],
    },
    'information-paradox': {
      title: 'Chapter 25: The Information Paradox',
      sections: [
        {
          heading: 'The Greatest Problem',
          text: 'Quantum mechanics says information can never be destroyed. But if a black hole evaporates into random radiation, where did the information go? If it is destroyed, quantum mechanics is broken. If it escaped, relativity is broken.',
          visual: 'information-paradox-visual',
        },
      ],
    },
    'holographic-principle': {
      title: 'Chapter 27: The Holographic Principle',
      sections: [
        {
          heading: 'You Are 2D',
          text: 'To solve the paradox, physicists proved that everything falling into a black hole gets smeared onto the Event Horizon as 2D pixels of data—like a cosmic hard drive. The 3D universe inside is an optical illusion created by 2D information on the outside.',
          visual: 'holographic-principle-visual',
        },
        {
          heading: 'The Universe is a Hologram',
          text: 'If this is true for black holes, it is true for the entire universe. The 3D world you live in right now is just a holographic projection of information stored on the distant cosmic horizon of the Big Bang. You are a 3D illusion of a 2D reality.',
          visual: 'universe-hologram',
        },
      ],
    },
  };

  // Draw black hole animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const animate = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Black hole background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      gradient.addColorStop(0.5, 'rgba(102, 126, 234, 0.1)');
      gradient.addColorStop(1, 'rgba(10, 14, 39, 1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw event horizon
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 4;

      // Glowing ring
      ctx.strokeStyle = `rgba(255, 100, 100, 0.8)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner glow
      ctx.strokeStyle = `rgba(255, 150, 100, ${0.5 + 0.3 * Math.sin(time * 0.01)})`;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2);
      ctx.stroke();

      // Accretion disk
      ctx.strokeStyle = `rgba(255, 200, 0, 0.6)`;
      ctx.lineWidth = 20;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius + 40 + i * 30, radius / 3 + i * 10, 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Rotating particles
      for (let i = 0; i < 50; i++) {
        const angle = (time * 0.005 + (i / 50) * Math.PI * 2) % (Math.PI * 2);
        const distance = radius + 60 + Math.sin(time * 0.003 + i) * 30;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.3;

        ctx.fillStyle = `rgba(255, ${100 + Math.sin(time * 0.01 + i) * 100}, 0, ${0.5 + 0.5 * Math.sin(time * 0.01 + i)})`;
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }

      // Hawking radiation
      for (let i = 0; i < 30; i++) {
        const angle = (Math.random() * Math.PI * 2 + time * 0.003) % (Math.PI * 2);
        const distance = radius + 100 + Math.random() * 200;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        ctx.fillStyle = `rgba(100, 200, 255, ${0.3 * (1 - (distance - radius) / 200)})`;
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="black-hole-mastery-container" ref={containerRef}>
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="black-hole-canvas"></canvas>

      {/* Content Overlay */}
      <div className="black-hole-content">
        {/* Header */}
        <header className="bh-header">
          <button className="bh-back-btn" onClick={onBack}>
            ← Back to Learn
          </button>
          <h1 className="bh-title">🌌 Black Holes: The Masterclass</h1>
          <p className="bh-subtitle">From Absolute Zero to Advanced Physics</p>
        </header>

        {/* Main Content */}
        <main className="bh-main">
          {/* Curriculum Grid */}
          <div className="curriculum-grid">
            {levels.map((level, idx) => (
              <div
                key={level.id}
                className="curriculum-card"
                onClick={() => setCurrentLevel(idx)}
              >
                <div className="curriculum-icon">{level.icon}</div>
                <h3 className="curriculum-title">{level.title}</h3>
                <p className="curriculum-duration">⏱️ {level.duration}</p>
                <div className="curriculum-progress">
                  <div
                    className="progress-bar"
                    style={{
                      background: level.color,
                      width: `${(idx + 1) * 10}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Content Panel */}
          <div className="bh-detail-panel">
            <div className="detail-content">
              <h2 className="detail-title">{levels[currentLevel].title}</h2>

              {detailedContent[levels[currentLevel].id] && (
                <div className="detail-sections">
                  {detailedContent[levels[currentLevel].id].sections.map((section, idx) => (
                    <div key={idx} className="detail-section">
                      <h3 className="section-heading">{section.heading}</h3>
                      <p className="section-text">{section.text}</p>

                      {/* Visual Component */}
                      {section.visual === 'space-basics' && <SpaceBasicsVisual />}
                      {section.visual === 'rubber-sheet' && <RubberSheetVisual />}
                      {section.visual === 'event-horizon-visual' && <EventHorizonVisual />}
                      {section.visual === 'singularity-core' && <SingularityVisual />}
                      {section.visual === 'frame-dragging' && <FrameDraggingVisual />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Visual Components
function SpaceBasicsVisual() {
  return (
    <div className="visual-container">
      <svg viewBox="0 0 400 300" className="visual-svg">
        <defs>
          <linearGradient id="spaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 3D Axes */}
        <line x1="200" y1="250" x2="200" y2="50" stroke="#667eea" strokeWidth="2" />
        <line x1="200" y1="250" x2="350" y2="250" stroke="#764ba2" strokeWidth="2" />
        <line x1="200" y1="250" x2="130" y2="300" stroke="#1D9E75" strokeWidth="2" />

        {/* Axis Labels */}
        <text x="200" y="30" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">
          Z (Height)
        </text>
        <text x="360" y="270" fontSize="14" fill="white" fontWeight="bold">
          X (Width)
        </text>
        <text x="100" y="320" fontSize="14" fill="white" fontWeight="bold">
          Y (Depth)
        </text>

        {/* Objects in space */}
        <circle cx="200" cy="150" r="30" fill="url(#spaceGrad)" stroke="#667eea" strokeWidth="2" />
        <text x="200" y="160" fontSize="12" fill="white" textAnchor="middle">
          Object
        </text>

        {/* Grid */}
        {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
          <line key={`v${x}`} x1={x} y1="250" x2={x} y2="260" stroke="#667eea" strokeWidth="0.5" opacity="0.3" />
        ))}
        {[0, 50, 100, 150, 200, 250, 300].map((y) => (
          <line key={`h${y}`} x1="200" y1={y} x2="210" y2={y} stroke="#667eea" strokeWidth="0.5" opacity="0.3" />
        ))}
      </svg>
    </div>
  );
}

function RubberSheetVisual() {
  return (
    <div className="visual-container">
      <svg viewBox="0 0 400 300" className="visual-svg">
        {/* Rubber sheet */}
        <defs>
          <radialGradient id="sheetGrad" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFA500" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Curved surface */}
        <path
          d="M 50 80 Q 100 100 150 110 T 350 80"
          stroke="rgba(255, 215, 0, 0.5)"
          strokeWidth="2"
          fill="url(#sheetGrad)"
        />

        {/* Bowling ball */}
        <circle cx="150" cy="100" r="40" fill="#333" stroke="#666" strokeWidth="2" />
        <circle cx="140" cy="90" r="12" fill="#555" opacity="0.6" />

        {/* Marble rolling toward */}
        <circle cx="250" cy="95" r="8" fill="#FF6B6B" stroke="#FF4444" strokeWidth="1" />

        {/* Labels */}
        <text x="150" y="50" fontSize="13" fill="white" fontWeight="bold" textAnchor="middle">
          Massive Star
        </text>
        <text x="250" y="60" fontSize="13" fill="white" fontWeight="bold" textAnchor="middle">
          Object
        </text>
        <text x="200" y="270" fontSize="12" fill="#888" textAnchor="middle">
          Objects follow curved geometry of spacetime
        </text>
      </svg>
    </div>
  );
}

function EventHorizonVisual() {
  return (
    <div className="visual-container">
      <svg viewBox="0 0 400 400" className="visual-svg">
        {/* Black hole center */}
        <circle cx="200" cy="200" r="80" fill="#000" />

        {/* Event horizon boundary */}
        <circle cx="200" cy="200" r="120" fill="none" stroke="#FF4444" strokeWidth="3" strokeDasharray="5,5" />
        <text x="330" y="200" fontSize="12" fill="#FF4444" fontWeight="bold">
          Event Horizon
        </text>

        {/* Photon sphere */}
        <circle cx="200" cy="200" r="145" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
        <text x="360" y="210" fontSize="11" fill="#FFD700">
          Photon Sphere
        </text>

        {/* Falling objects */}
        <circle cx="200" cy="80" r="5" fill="#00FF00" />
        <text x="220" y="85" fontSize="11" fill="#00FF00">
          Outside
        </text>

        <circle cx="160" cy="130" r="5" fill="#FFFF00" />
        <text x="140" y="135" fontSize="11" fill="#FFFF00">
          Approaching
        </text>

        <circle cx="200" cy="200" r="0" fill="#FF0000" />
        <text x="215" y="205" fontSize="11" fill="#FF0000">
          Point of No Return
        </text>

        {/* Escape velocity lines */}
        <line x1="200" y1="200" x2="200" y2="60" stroke="#FFD700" strokeWidth="1" opacity="0.3" />
        <text x="210" y="130" fontSize="10" fill="#FFD700" opacity="0.6">
          Escape Velocity = Speed of Light
        </text>
      </svg>
    </div>
  );
}

function SingularityVisual() {
  return (
    <div className="visual-container">
      <svg viewBox="0 0 400 400" className="visual-svg">
        {/* Tidal forces visualization */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + 100 * Math.cos(rad);
          const y1 = 200 + 100 * Math.sin(rad);
          const x2 = 200 + 180 * Math.cos(rad);
          const y2 = 200 + 180 * Math.sin(rad);

          return (
            <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E74C3C" strokeWidth="2" opacity="0.6" />
          );
        })}

        {/* Singularity point */}
        <circle cx="200" cy="200" r="3" fill="#FF00FF" />
        <text x="200" y="220" fontSize="12" fill="#FF00FF" fontWeight="bold" textAnchor="middle">
          Singularity
        </text>

        {/* Person being spaghettified */}
        <g opacity="0.7">
          <circle cx="200" cy="80" r="8" fill="#FFD700" />
          <line x1="200" y1="88" x2="200" y2="130" stroke="#FFD700" strokeWidth="4" />
          <circle cx="200" cy="150" r="4" fill="#FFD700" />
        </g>

        <text x="220" y="110" fontSize="11" fill="#FFD700">
          Being Stretched
        </text>

        {/* Info text */}
        <text x="200" y="350" fontSize="11" fill="#888" textAnchor="middle">
          Tidal forces stretch objects into "spaghetti"
        </text>
      </svg>
    </div>
  );
}

function FrameDraggingVisual() {
  return (
    <div className="visual-container">
      <svg viewBox="0 0 400 400" className="visual-svg">
        {/* Spinning black hole */}
        <defs>
          <radialGradient id="bhGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0000FF" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="60" fill="url(#bhGrad)" />

        {/* Ergosphere */}
        <ellipse cx="200" cy="200" rx="120" ry="100" fill="none" stroke="#00FFFF" strokeWidth="2" opacity="0.7" />
        <text x="320" y="200" fontSize="11" fill="#00FFFF" fontWeight="bold">
          Ergosphere
        </text>

        {/* Frame-dragging swirl */}
        <path d="M 200 80 Q 280 140 280 200 Q 280 260 200 280" fill="none" stroke="#00FF00" strokeWidth="2" opacity="0.6" />
        <path d="M 200 80 Q 120 140 120 200 Q 120 260 200 280" fill="none" stroke="#00FF00" strokeWidth="2" opacity="0.6" />

        {/* Spacetime being dragged */}
        <text x="200" y="330" fontSize="12" fill="#00FF00" fontWeight="bold" textAnchor="middle">
          Space itself spins around the black hole
        </text>

        {/* Spacecraft using Penrose process */}
        <circle cx="250" cy="140" r="6" fill="#FFD700" />
        <text x="270" y="145" fontSize="10" fill="#FFD700">
          Ship (gaining energy)
        </text>
      </svg>
    </div>
  );
}

export default BlackHoleMastery;