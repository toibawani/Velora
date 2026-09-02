import React, { useState } from 'react';
import MasteryPath from '../components/MasteryPath';
import BlackHolesElite from '../components/BlackHolesElite';
import BlackHoleMastery from '../components/BlackHoleMastery';
import RelativityLab from '../components/RelativityLab';
import FlowStateGame from '../components/FlowStateGame';
import AIWhiteboard from '../components/AIWhiteboard';
import CreatorStudio from '../components/CreatorStudio';
import SensoryRooms from '../components/SensoryRooms';
import WhatIfSimulator from '../components/WhatIfSimulator';
import UniverseBuilder from '../components/UniverseBuilder';
import ShadowLearning from '../components/ShadowLearning';
import SketchbookCard from '../components/SketchbookCard';
import ExpertMode from '../components/ExpertMode';
import LearningStories from '../components/LearningStories';
import InstitutionalMode from '../components/InstitutionalMode';
import '../styles/Learn.css';
import LearningAnalytics from '../components/LearningAnalytics';
import SmartRevision from '../components/SmartRevision';
import SocialProof from '../components/SocialProof';

function Learn({ setScreen, selectedSubject, setSelectedSubject, initialView = 'overview', setInitialView }) {
  const [currentView, setCurrentView] = useState(initialView || 'overview');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeGame, setActiveGame] = useState({
    name: 'Quantum Concepts Quiz',
    type: 'quiz',
    difficulty: 'Intermediate',
    duration: 10
  });

  const subjectData = {
    physics: {
      name: 'Physics',
      icon: '⚛️',
      color: '#4f7df3',
      description: 'Explore the fundamental laws governing spacetime, matter, and energy',
      modules: [
        {
          id: 'classical-mechanics',
          name: 'Classical Mechanics',
          status: 'in-progress',
          progress: 65,
          topics: [
            { id: 'newtons-laws', name: "Newton's Laws & Inertial Frames", lessons: 5 },
            { id: 'forces', name: 'Forces & Equilibrium', lessons: 4 },
            { id: 'work-energy', name: 'Work, Energy & Conservative Fields', lessons: 6 },
          ],
        },
        {
          id: 'modern-physics',
          name: 'Modern & Relativistic Physics',
          status: 'in-progress',
          progress: 40,
          topics: [
            { id: 'relativity', name: 'Special & General Relativity', lessons: 7 },
            { id: 'quantum', name: 'Quantum States & Superposition', lessons: 8 },
          ],
        },
      ],
    },
    philosophy: {
      name: 'Philosophy',
      icon: '🤔',
      color: '#af52de',
      description: 'Dive into epistemic, ethical, and metaphysical frameworks',
      modules: [
        {
          id: 'ancient-philosophy',
          name: 'Classical Antiquity',
          status: 'in-progress',
          progress: 45,
          topics: [
            { id: 'socrates', name: 'Socratic Method & Platonic Forms', lessons: 4 },
            { id: 'aristotle', name: 'Aristotelian Logic & Telos', lessons: 5 },
          ],
        },
        {
          id: 'modern-philosophy',
          name: 'Modern Rationalism & Empiricism',
          status: 'not-started',
          progress: 0,
          topics: [
            { id: 'descartes', name: 'Cartesian Doubt & Cogito', lessons: 3 },
            { id: 'kant', name: 'Kantian Transcendental Idealism', lessons: 4 },
          ],
        },
      ],
    },
    history: {
      name: 'History',
      icon: '📜',
      color: '#ff9f0a',
      description: 'Understand the civilizational catalysts shaping human history',
      modules: [
        {
          id: 'ancient-history',
          name: 'Ancient Civilizations',
          status: 'completed',
          progress: 100,
          topics: [
            { id: 'egypt', name: 'The Nile River & Monumental Architecture', lessons: 6 },
            { id: 'rome', name: 'Roman Republic & Imperial Governance', lessons: 7 },
          ],
        },
        {
          id: 'medieval',
          name: 'The Middle Ages & Renaissance',
          status: 'in-progress',
          progress: 35,
          topics: [
            { id: 'dark-ages', name: 'Feudal Structure & Monastic Scholarship', lessons: 5 },
            { id: 'renaissance', name: 'Scientific Revival & Humanism', lessons: 6 },
          ],
        },
      ],
    },
  };

  const subject = subjectData[selectedSubject || 'physics'];
  if (!subject) return null;

  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
    } else if (currentView !== 'overview') {
      setCurrentView('overview');
      if (setInitialView) setInitialView('overview');
    } else {
      if (setInitialView) setInitialView('overview');
      setScreen('universe');
    }
  };

  const startFlowGame = (gameConfig) => {
    setActiveGame(gameConfig);
    setCurrentView('playing-game');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '⏳';
      case 'not-started':
        return '•';
      case 'locked':
        return '🔒';
      default:
        return '•';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#34c759';
      case 'in-progress':
        return '#ff9f0a';
      case 'not-started':
        return '#666666';
      case 'locked':
        return '#444444';
      default:
        return '#666666';
    }
  };
  {currentView === 'overview' && (
  <>
    {/* ... existing sections ... */}

    {/* Analytics */}
    <section className="learn-section">
      <LearningAnalytics selectedSubject={selectedSubject} />
    </section>

    {/* Revision */}
    <section className="learn-section">
      <SmartRevision selectedSubject={selectedSubject} />
    </section>

    {/* Social Proof */}
    <section className="learn-section">
      <SocialProof />
    </section>
  </>
)}

  // View: Flow State Game
  if (currentView === 'playing-game') {
    return (
      <FlowStateGame
        gameName={activeGame.name}
        gameType={activeGame.type}
        difficulty={activeGame.difficulty}
        duration={activeGame.duration}
        onBack={handleBack}
      />
    );
  }

  // View: Whiteboard
  if (currentView === 'whiteboard') {
    return (
      <AIWhiteboard
        topic={selectedTopic}
        onBack={handleBack}
      />
    );
  }

  // View: Creator Studio
  if (currentView === 'creator') {
    return (
      <CreatorStudio
        topic={selectedTopic}
        onBack={handleBack}
      />
    );
  }

  // View: Sensory Rooms
  if (currentView === 'sensory-rooms') {
    return (
      <SensoryRooms
        topic={selectedTopic}
        onBack={handleBack}
      />
    );
  }

  // View: What-If Simulator
  if (currentView === 'what-if') {
    return (
      <WhatIfSimulator
        topic={selectedTopic}
        onBack={handleBack}
      />
    );
  }

  // View: Universe Builder
  if (currentView === 'universe') {
    return (
      <UniverseBuilder
        topic={selectedTopic}
        onBack={handleBack}
      />
    );
  }

  // View: Shadow Learning
  if (currentView === 'shadow-learning') {
    return (
      <ShadowLearning
        topic={selectedTopic}
        onBack={handleBack}
      />
    );
  }

  // View: Sketchbook
  if (currentView === 'sketchbook') {
    return (
      <div className="learn-container">
        <header className="learn-header">
          <button className="learn-back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>Scientific Dictionary</h1>
          <div style={{ width: '60px' }}></div>
        </header>
        <SketchbookCard term="capillary-action" />
      </div>
    );
  }

  // View: Black Hole Masterclass
  if (currentView === 'black-hole-mastery') {
    return (
      <BlackHoleMastery
        onBack={handleBack}
        onOpenLab={() => setCurrentView('relativity-lab')}
      />
    );
  }

  // View: Relativity Lab
  if (currentView === 'relativity-lab') {
    return (
      <RelativityLab
        onBack={handleBack}
      />
    );
  }

  // Main Overview
  return (
    <div className="learn-container">
      {/* Header */}
      <header className="learn-header">
        <button className="learn-back-btn" onClick={() => setScreen('universe')}>
          ← Return to Universe
        </button>
        <h1 className="learn-title">{subject.name}</h1>
        <div style={{ width: '60px' }}></div>
      </header>

      <main className="learn-main">
        {/* Mastery Path */}
        <MasteryPath selectedSubject={selectedSubject || 'physics'} />

        {/* Black Holes Special (for Physics) */}
        {(selectedSubject === 'physics' || !selectedSubject) && (
          <section className="learn-section">
            <h2 className="section-title">Featured: Black Holes & Spacetime</h2>
            <BlackHolesElite
              onExploreMasterclass={() => setCurrentView('black-hole-mastery')}
              onOpenLab={() => setCurrentView('relativity-lab')}
            />
          </section>
        )}

        {/* Narrative Learning Stories */}
        <section className="learn-section">
          <LearningStories />
        </section>

        {/* Structured Modules */}
        <section className="learn-section">
          <h2 className="section-title">Curated Modules</h2>
          <div className="modules-list">
            {subject.modules.map((module) => (
              <div
                key={module.id}
                className={`module-card ${module.status}`}
              >
                <div className="module-header">
                  <div className="module-info">
                    <h3 className="module-name">{module.name}</h3>
                    <span
                      className="module-status"
                      style={{ color: getStatusColor(module.status) }}
                    >
                      {getStatusIcon(module.status)} {module.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="module-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{module.progress}%</span>
                  </div>
                </div>

                <div className="module-topics">
                  {module.topics.map((topic) => (
                    <button
                      key={topic.id}
                      className="topic-btn"
                      onClick={() => {
                        setSelectedTopic(topic);
                        startFlowGame({
                          name: topic.name,
                          type: 'quiz',
                          difficulty: 'Intermediate',
                          duration: 10
                        });
                      }}
                    >
                      <span className="topic-name">{topic.name}</span>
                      <span className="topic-lessons">
                        {topic.lessons} interactive parts
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Flow-State Interactive Learning Experiences */}
        <section className="learn-section">
          <h2 className="section-title">Flow-State Learning Experiences</h2>
          <div className="games-grid">
            <div
              className="game-card"
              onClick={() => startFlowGame({
                name: 'Quantum Concepts Quiz',
                type: 'quiz',
                difficulty: 'Intermediate',
                duration: 10
              })}
            >
              <span className="game-icon">🎯</span>
              <h4 className="game-title">Quantum Quiz</h4>
              <p className="game-desc">Focus deeply on foundational principles</p>
              <span className="game-time">10 min</span>
            </div>

            <div
              className="game-card"
              onClick={() => startFlowGame({
                name: 'Singularity Concept Scrabble',
                type: 'scrabble',
                difficulty: 'Easy',
                duration: 8
              })}
            >
              <span className="game-icon">🔤</span>
              <h4 className="game-title">Concept Scrabble</h4>
              <p className="game-desc">Construct core terminology</p>
              <span className="game-time">8 min</span>
            </div>

            <div
              className="game-card"
              onClick={() => startFlowGame({
                name: 'Cosmic Collapse Chain',
                type: 'chain',
                difficulty: 'Advanced',
                duration: 12
              })}
            >
              <span className="game-icon">🔗</span>
              <h4 className="game-title">Knowledge Chain</h4>
              <p className="game-desc">Sequence causal phenomena</p>
              <span className="game-time">12 min</span>
            </div>

            <div
              className="game-card"
              onClick={() => startFlowGame({
                name: 'Definition Duel',
                type: 'duel',
                difficulty: 'Medium',
                duration: 8
              })}
            >
              <span className="game-icon">📝</span>
              <h4 className="game-title">Definition Duel</h4>
              <p className="game-desc">Match nuances with precision</p>
              <span className="game-time">8 min</span>
            </div>
          </div>
        </section>

        {/* Learning Tools */}
        <section className="learn-section">
          <h2 className="section-title">Deep Exploration Tools</h2>
          <div className="tools-grid">
            <div
              className="tool-card"
              onClick={() => setCurrentView('relativity-lab')}
            >
              <span className="tool-icon">⚛️</span>
              <h4 className="tool-title">Relativity Lab</h4>
              <p className="tool-desc">Simulate spacetime curvature</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('black-hole-mastery')}
            >
              <span className="tool-icon">🌌</span>
              <h4 className="tool-title">Black Holes Masterclass</h4>
              <p className="tool-desc">10 deep visual chapters</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('whiteboard')}
            >
              <span className="tool-icon">✏️</span>
              <h4 className="tool-title">AI Whiteboard</h4>
              <p className="tool-desc">Draw & visualize concepts</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('creator')}
            >
              <span className="tool-icon">🎨</span>
              <h4 className="tool-title">Creator Studio</h4>
              <p className="tool-desc">Make notes & flashcards</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('sensory-rooms')}
            >
              <span className="tool-icon">🏛️</span>
              <h4 className="tool-title">Sensory Rooms</h4>
              <p className="tool-desc">Multi-sensory learning</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('what-if')}
            >
              <span className="tool-icon">🔮</span>
              <h4 className="tool-title">What-If Simulator</h4>
              <p className="tool-desc">Explore scenarios</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('universe')}
            >
              <span className="tool-icon">🌌</span>
              <h4 className="tool-title">Universe Builder</h4>
              <p className="tool-desc">Map your knowledge</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('shadow-learning')}
            >
              <span className="tool-icon">👥</span>
              <h4 className="tool-title">Shadow Learning</h4>
              <p className="tool-desc">Learn from community</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('sketchbook')}
            >
              <span className="tool-icon">📚</span>
              <h4 className="tool-title">Dictionary</h4>
              <p className="tool-desc">Sketchbook cards</p>
            </div>
          </div>
        </section>

        {/* Academic Deep Dive & Expert Mode */}
        <section className="learn-section">
          <ExpertMode
            domain={selectedSubject || 'physics'}
            onOpenDiscussion={() => setCurrentView('shadow-learning')}
          />
        </section>

        {/* Institutional & Family Portal */}
        <section className="learn-section">
          <InstitutionalMode />
        </section>
      </main>
    </div>
  );
}


export default Learn;