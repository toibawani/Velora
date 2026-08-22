import React, { useState } from 'react';
import MasteryPath from '../components/MasteryPath';
import BlackHolesElite from '../components/BlackHolesElite';
import AIWhiteboard from '../components/AIWhiteboard';
import CreatorStudio from '../components/CreatorStudio';
import SensoryRooms from '../components/SensoryRooms';
import WhatIfSimulator from '../components/WhatIfSimulator';
import UniverseBuilder from '../components/UniverseBuilder';
import ShadowLearning from '../components/ShadowLearning';
import SketchbookCard from '../components/SketchbookCard';
import '../styles/Learn.css';

function Learn({ setScreen, selectedSubject, setSelectedSubject }) {
  const [currentView, setCurrentView] = useState('overview');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const subjectData = {
    physics: {
      name: 'Physics',
      icon: '⚛️',
      color: '#667eea',
      description: 'Explore the fundamental laws of the universe',
      modules: [
        {
          id: 'classical-mechanics',
          name: 'Classical Mechanics',
          status: 'in-progress',
          progress: 65,
          topics: [
            { id: 'newtons-laws', name: "Newton's Laws", lessons: 5 },
            { id: 'forces', name: 'Forces & Equilibrium', lessons: 4 },
            { id: 'work-energy', name: 'Work & Energy', lessons: 6 },
          ],
        },
        {
          id: 'modern-physics',
          name: 'Modern Physics',
          status: 'locked',
          progress: 0,
          topics: [
            { id: 'relativity', name: 'Relativity', lessons: 7 },
            { id: 'quantum', name: 'Quantum Mechanics', lessons: 8 },
          ],
        },
      ],
    },
    philosophy: {
      name: 'Philosophy',
      icon: '🤔',
      color: '#2E7D32',
      description: 'Dive into the big questions of existence',
      modules: [
        {
          id: 'ancient-philosophy',
          name: 'Ancient Philosophy',
          status: 'in-progress',
          progress: 45,
          topics: [
            { id: 'socrates', name: 'Socrates & Plato', lessons: 4 },
            { id: 'aristotle', name: 'Aristotle', lessons: 5 },
          ],
        },
        {
          id: 'modern-philosophy',
          name: 'Modern Philosophy',
          status: 'not-started',
          progress: 0,
          topics: [
            { id: 'descartes', name: 'Descartes', lessons: 3 },
            { id: 'kant', name: 'Kant', lessons: 4 },
          ],
        },
      ],
    },
    history: {
      name: 'History',
      icon: '📜',
      color: '#F39C12',
      description: 'Understand how humanity evolved',
      modules: [
        {
          id: 'ancient-history',
          name: 'Ancient Civilizations',
          status: 'completed',
          progress: 100,
          topics: [
            { id: 'egypt', name: 'Ancient Egypt', lessons: 6 },
            { id: 'rome', name: 'Roman Empire', lessons: 7 },
          ],
        },
        {
          id: 'medieval',
          name: 'Medieval Era',
          status: 'in-progress',
          progress: 35,
          topics: [
            { id: 'dark-ages', name: 'Dark Ages', lessons: 5 },
            { id: 'renaissance', name: 'Renaissance', lessons: 6 },
          ],
        },
      ],
    },
  };

  const subject = subjectData[selectedSubject];
  if (!subject) return null;

  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
    } else if (currentView !== 'overview') {
      setCurrentView('overview');
    } else {
      setScreen('universe');
    }
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
        return '#2E7D32';
      case 'in-progress':
        return '#F39C12';
      case 'not-started':
        return '#6f6f6f';
      case 'locked':
        return '#999';
      default:
        return '#6f6f6f';
    }
  };

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
          <h1>Dictionary</h1>
          <div style={{ width: '60px' }}></div>
        </header>
        <SketchbookCard term="capillary-action" />
      </div>
    );
  }

  // Main Overview
  return (
    <div className="learn-container">
      {/* Header */}
      <header className="learn-header">
        <button className="learn-back-btn" onClick={() => setScreen('universe')}>
          ← Back
        </button>
        <h1 className="learn-title">{subject.name}</h1>
        <div style={{ width: '60px' }}></div>
      </header>

      <main className="learn-main">
        {/* Mastery Path */}
        <MasteryPath selectedSubject={selectedSubject} />

        {/* Black Holes Special (for Physics) */}
        {selectedSubject === 'physics' && (
          <section className="learn-section">
            <h2 className="section-title">Featured: Black Holes Masterclass</h2>
            <BlackHolesElite />
          </section>
        )}

        {/* Modules */}
        <section className="learn-section">
          <h2 className="section-title">Modules</h2>
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
                        setCurrentView('topic-detail');
                      }}
                    >
                      <span className="topic-name">{topic.name}</span>
                      <span className="topic-lessons">
                        {topic.lessons} lessons
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Tools */}
        <section className="learn-section">
          <h2 className="section-title">Learning Tools</h2>
          <div className="tools-grid">
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
      </main>
    </div>
  );
}

export default Learn;