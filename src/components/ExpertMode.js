import React, { useState } from 'react';
import '../styles/ExpertMode.css';

/**
 * ExpertMode Component
 * 
 * Deep academic dive for advanced learners:
 * - 1-page distillations of landmark astrophysics research papers
 * - Formal mathematical equations & tensor derivations
 * - Open philosophical/physical debate prompts
 * - Astrophysics career pathways
 */
function ExpertMode({ domain = 'physics', onOpenDiscussion }) {
  const [activeTab, setActiveTab] = useState('papers');
  const [selectedPaper, setSelectedPaper] = useState(0);

  const researchPapers = [
    {
      id: 0,
      title: 'Black hole explosions? (Hawking, 1974)',
      journal: 'Nature 248, 30–31 (1974)',
      summary: 'Stephen Hawking demonstrated that quantum particle-antiparticle creation near the event horizon causes black holes to emit thermal blackbody radiation and steadily lose mass.',
      keyTakeaway: 'Unifies General Relativity, Quantum Mechanics, and Thermodynamics for the first time in physics history.',
      equation: 'T_H = \\frac{\\hbar c^3}{8\\pi G M k_B}',
      equationName: 'Hawking Temperature Formula',
      equationExplanation: 'Temperature is inversely proportional to mass. Smaller primordial black holes radiate hotter and evaporate exponentially faster.'
    },
    {
      id: 1,
      title: 'First M87 Event Horizon Telescope Results (EHT Collaboration, 2019)',
      journal: 'The Astrophysical Journal Letters, 875:L1',
      summary: 'Using Very Long Baseline Interferometry (VLBI) across a planet-sized array of millimeter-wavelength telescopes, humanity captured the first direct shadow of supermassive black hole M87*.',
      keyTakeaway: 'The observed 42 microarcsecond shadow diameter confirms General Relativity predictions within 17% uncertainty.',
      equation: 'R_{shadow} = \\sqrt{27}\\,R_s = 3\\sqrt{3}\\,\\frac{2GM}{c^2}',
      equationName: 'Optical Shadow Radius for Schwarzschild Spacetime',
      equationExplanation: 'Gravitational photon capture causes the perceived dark silhouette to appear ~5.2 times larger than the gravitational radius.'
    },
    {
      id: 2,
      title: 'The Foundation of the General Theory of Relativity (Einstein, 1916)',
      journal: 'Annalen der Physik, 49, 769–822',
      summary: 'Einstein formalized gravitation not as a Newtonian force, but as the manifestation of Riemannian spacetime geometry deformed by stress-energy density.',
      keyTakeaway: 'Spacetime tells matter how to move; matter tells spacetime how to curve.',
      equation: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
      equationName: 'Einstein Field Equations',
      equationExplanation: 'The Einstein tensor (curvature) on the left equals the energy-momentum tensor on the right.'
    }
  ];

  const debateTopics = [
    {
      title: 'The Black Hole Information Paradox',
      provocation: 'If Hawking radiation is purely thermal, all quantum information about infalling matter appears permanently destroyed when the black hole evaporates. This violates quantum unitarity (probability conservation). Does the holographic principle resolve this, or must quantum mechanics be amended?',
      debatePoints: [
        'Hawking Radiation is subtly entangled with the interior (Page Curve)',
        'Information is preserved on the 2D boundary (AdS/CFT duality)',
        'Singularities represent an absolute breakdown of physical determinism'
      ]
    },
    {
      title: 'Are Naked Singularities Physically Realizable?',
      provocation: 'Roger Penrose formulated the Cosmic Censorship Hypothesis, conjecturing that every gravitational singularity must be safely shrouded behind an event horizon. Could extreme Kerr (spinning) black holes shed their horizon?',
      debatePoints: [
        'Over-spinning causes centrifugal repulsion to exceed gravitational pull',
        'Quantum backreaction prevents horizon destruction dynamically',
        'Naked singularities would destroy predictability in classical physics'
      ]
    }
  ];

  const careerPathways = [
    {
      role: 'Observational Astrophysicist / Interferometrist',
      institution: 'ALMA / Event Horizon Telescope / ESO',
      description: 'Analyze sub-millimeter radio data from global telescope arrays to map relativistic jets and photon rings around galactic centers.',
      coreSkills: ['Radio Interferometry', 'Python/Astropy', 'Fourier Optics', 'Bayesian Imaging Algorithms']
    },
    {
      role: 'Relativistic Hydrodynamic Modeler',
      institution: 'NASA Goddard / Max Planck Institute for Gravitational Physics',
      description: 'Run 3D supercomputer magnetohydrodynamic (GRMHD) simulations of accretion discs feeding supermassive black holes.',
      coreSkills: ['High-Performance Computing (C++/CUDA)', 'Fluid Dynamics', 'Differential Geometry', 'Plasma Physics']
    },
    {
      role: 'Quantum Gravity & String Theorist',
      institution: 'Institute for Advanced Study / Perimeter Institute',
      description: 'Investigate the microscopic quantum degrees of freedom of spacetime horizons using gauge-gravity duality.',
      coreSkills: ['Quantum Field Theory', 'Conformal Field Theory', 'Supersymmetry', 'Topology']
    }
  ];

  return (
    <div className="expert-mode-container">
      {/* Header Banner */}
      <div className="expert-hero-bar">
        <div className="expert-badge-tag">
          <span>🔬 EXPERT MODE</span>
        </div>
        <h2 className="expert-hero-title">Academic & Research Deep Dive</h2>
        <p className="expert-hero-sub">
          Peer-reviewed paper distillations, tensor equations, open foundational debates, and career pathways.
        </p>
      </div>

      {/* Mode Sub-Navigation */}
      <div className="expert-nav-tabs">
        <button
          className={`expert-tab ${activeTab === 'papers' ? 'active' : ''}`}
          onClick={() => setActiveTab('papers')}
        >
          📄 Research Papers (1-Page)
        </button>
        <button
          className={`expert-tab ${activeTab === 'debates' ? 'active' : ''}`}
          onClick={() => setActiveTab('debates')}
        >
          💬 Peer Debate Prompts
        </button>
        <button
          className={`expert-tab ${activeTab === 'careers' ? 'active' : ''}`}
          onClick={() => setActiveTab('careers')}
        >
          🚀 Astrophysics Career Paths
        </button>
      </div>

      {/* Tab 1: Research Papers */}
      {activeTab === 'papers' && (
        <div className="expert-tab-content">
          <div className="paper-selector-row">
            {researchPapers.map((paper, idx) => (
              <button
                key={paper.id}
                className={`paper-pill-btn ${selectedPaper === idx ? 'selected' : ''}`}
                onClick={() => setSelectedPaper(idx)}
              >
                Paper #{idx + 1}: {paper.title.split('(')[0]}
              </button>
            ))}
          </div>

          <div className="paper-deep-card">
            <div className="paper-meta-header">
              <span className="journal-badge">{researchPapers[selectedPaper].journal}</span>
              <h3 className="paper-headline">{researchPapers[selectedPaper].title}</h3>
            </div>

            <div className="paper-section-block">
              <h4 className="block-title">Executive Summary</h4>
              <p className="block-text">{researchPapers[selectedPaper].summary}</p>
            </div>

            <div className="paper-section-block highlight-takeaway">
              <h4 className="block-title">Key Scientific Takeaway</h4>
              <p className="block-text">{researchPapers[selectedPaper].keyTakeaway}</p>
            </div>

            <div className="paper-equation-box">
              <div className="equation-header">
                <span className="equation-label">{researchPapers[selectedPaper].equationName}</span>
                <span className="mono-tag">LaTeX Derivation</span>
              </div>
              <div className="equation-display">
                <code>{researchPapers[selectedPaper].equation}</code>
              </div>
              <p className="equation-desc">{researchPapers[selectedPaper].equationExplanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Open Debates */}
      {activeTab === 'debates' && (
        <div className="expert-tab-content">
          <div className="debates-grid">
            {debateTopics.map((topic, i) => (
              <div key={i} className="debate-card">
                <h3 className="debate-title">{topic.title}</h3>
                <p className="debate-provocation">{topic.provocation}</p>

                <div className="debate-bullet-points">
                  <span className="bullet-heading">Key Contending Hypotheses:</span>
                  <ul>
                    {topic.debatePoints.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <button
                  className="join-debate-btn"
                  onClick={() => onOpenDiscussion && onOpenDiscussion(topic.title)}
                >
                  Join Anonymous Debate in Shadow Learning →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Career Paths */}
      {activeTab === 'careers' && (
        <div className="expert-tab-content">
          <div className="careers-grid">
            {careerPathways.map((career, i) => (
              <div key={i} className="career-card">
                <div className="career-header">
                  <h3 className="career-role">{career.role}</h3>
                  <span className="career-inst">{career.institution}</span>
                </div>
                <p className="career-desc">{career.description}</p>
                <div className="skills-tag-cloud">
                  <span className="skills-label">Essential Prerequisites:</span>
                  <div className="tags-container">
                    {career.coreSkills.map((skill, idx) => (
                      <span key={idx} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpertMode;
