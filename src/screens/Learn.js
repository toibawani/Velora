import React, { useState } from 'react';
import '../styles/Learn.css';
import StudyMood from '../components/StudyMood';
import TeachAI from '../components/TeachAI';
import KnowledgeGraph from '../components/KnowledgeGraph';
import ContextDoubtSolver from '../components/ContextDoubtSolver';
import ProjectLearning from '../components/ProjectLearning';
import RevisionPlanner from '../components/RevisionPlanner';
import AIWhiteboard from '../components/AIWhiteboard';
import CreatorStudio from '../components/CreatorStudio';
import DopamineDebt from '../components/DopamineDebt';
import SensoryRooms from '../components/SensoryRooms';
import ShadowLearning from '../components/ShadowLearning';
import WhatIfSimulator from '../components/WhatIfSimulator';
import UniverseBuilder from '../components/UniverseBuilder';
import MasteryPath from '../components/MasteryPath';

// In Learn screen, after selecting subject:
{selectedSubject && (
  <section>
    <MasteryPath selectedSubject={selectedSubject} />
  </section>
)}

const SUBJECT_STRUCTURE = {
  physics: {
    name: 'Physics',
    icon: '⚛️',
    description: 'Master the laws of motion and energy',
    modules: [
      {
        id: 'classical',
        name: 'Classical Mechanics',
        icon: '🔄',
        difficulty: 'Beginner',
        topics: [
          { id: 'newtons-laws', name: "Newton's Laws of Motion", duration: '45 min', status: 'completed' },
          { id: 'forces', name: 'Forces & Equilibrium', duration: '50 min', status: 'in-progress' },
          { id: 'work-energy', name: 'Work & Energy', duration: '55 min', status: 'locked' },
          { id: 'momentum', name: 'Momentum & Collisions', duration: '50 min', status: 'locked' },
        ],
      },
      {
        id: 'waves',
        name: 'Waves & Oscillations',
        icon: '〰️',
        difficulty: 'Intermediate',
        topics: [
          { id: 'simple-harmonic', name: 'Simple Harmonic Motion', duration: '60 min', status: 'locked' },
          { id: 'sound-waves', name: 'Sound Waves', duration: '55 min', status: 'locked' },
          { id: 'light-waves', name: 'Light as Waves', duration: '60 min', status: 'locked' },
        ],
      },
      {
        id: 'modern',
        name: 'Modern Physics',
        icon: '🌌',
        difficulty: 'Advanced',
        topics: [
          { id: 'quantum', name: 'Quantum Mechanics', duration: '90 min', status: 'locked' },
          { id: 'relativity', name: 'Relativity Theory', duration: '85 min', status: 'locked' },
          { id: 'nuclear', name: 'Nuclear Physics', duration: '70 min', status: 'locked' },
        ],
      },
    ],
  },
  philosophy: {
    name: 'Philosophy',
    icon: '🤔',
    description: 'Explore the nature of knowledge and existence',
    modules: [
      {
        id: 'ancient',
        name: 'Ancient Philosophy',
        icon: '🏛️',
        difficulty: 'Beginner',
        topics: [
          { id: 'socrates', name: 'Socratic Method', duration: '40 min', status: 'completed' },
          { id: 'plato', name: "Plato's Theory of Forms", duration: '50 min', status: 'in-progress' },
          { id: 'aristotle', name: 'Aristotle & Logic', duration: '55 min', status: 'locked' },
        ],
      },
      {
        id: 'medieval',
        name: 'Medieval Philosophy',
        icon: '📖',
        difficulty: 'Intermediate',
        topics: [
          { id: 'aquinas', name: 'Aquinas & Theology', duration: '60 min', status: 'locked' },
          { id: 'scholasticism', name: 'Scholasticism', duration: '50 min', status: 'locked' },
        ],
      },
      {
        id: 'modern',
        name: 'Modern Philosophy',
        icon: '💡',
        difficulty: 'Advanced',
        topics: [
          { id: 'descartes', name: 'Descartes & Rationalism', duration: '65 min', status: 'locked' },
          { id: 'kant', name: "Kant's Critique", duration: '75 min', status: 'locked' },
          { id: 'existentialism', name: 'Existentialism', duration: '70 min', status: 'locked' },
        ],
      },
    ],
  },
  chemistry: {
    name: 'Chemistry',
    icon: '🧪',
    description: 'Understanding matter and reactions',
    modules: [
      {
        id: 'general',
        name: 'General Chemistry',
        icon: '⚗️',
        difficulty: 'Beginner',
        topics: [
          { id: 'atoms', name: 'Atomic Structure', duration: '50 min', status: 'completed' },
          { id: 'bonding', name: 'Chemical Bonding', duration: '55 min', status: 'in-progress' },
          { id: 'reactions', name: 'Chemical Reactions', duration: '60 min', status: 'locked' },
        ],
      },
      {
        id: 'organic',
        name: 'Organic Chemistry',
        icon: '🧬',
        difficulty: 'Advanced',
        topics: [
          { id: 'hydrocarbons', name: 'Hydrocarbons', duration: '70 min', status: 'locked' },
          { id: 'mechanisms', name: 'Reaction Mechanisms', duration: '80 min', status: 'locked' },
        ],
      },
    ],
  },
};

function Learn({ setScreen, selectedSubject }) {
  const [currentView, setCurrentView] = useState(selectedSubject ? 'modules' : 'subjects');
  const [localSelectedSubject, setLocalSelectedSubject] = useState(selectedSubject);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showStudyMood, setShowStudyMood] = useState(false);
  const [studyMood, setStudyMood] = useState(null);
  const [studentLevel] = useState('intermediate');

  const subject = localSelectedSubject ? SUBJECT_STRUCTURE[localSelectedSubject] : null;

  const handleSelectSubject = (subjectKey) => {
    setLocalSelectedSubject(subjectKey);
    setCurrentView('modules');
  };

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    setCurrentView('topics');
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setShowStudyMood(true);
  };

  const handleMoodSelected = (mood) => {
    setStudyMood(mood);
    setShowStudyMood(false);
    setCurrentView('topic-detail');
  };

  const handleBack = () => {
    if (currentView === 'topics') {
      setCurrentView('modules');
      setSelectedModule(null);
    } else if (currentView === 'topic-detail') {
      setCurrentView('topics');
      setSelectedTopic(null);
      setStudyMood(null);
    } else if (currentView === 'modules') {
      setCurrentView('subjects');
      setLocalSelectedSubject(null);
    } else {
      setScreen('dashboard');
    }
  };

  // Subjects View
  if (currentView === 'subjects') {
    return (
      <div className="learn-container">
        <div className="learn-header">
          <button className="learn-back-btn" onClick={() => setScreen('dashboard')}>
            ← Back
          </button>
          <h1>📚 Choose Subject</h1>
          <div style={{ width: '60px' }}></div>
        </div>

        <div className="subjects-list">
          {Object.entries(SUBJECT_STRUCTURE).map(([key, subj]) => (
            <div
              key={key}
              className="subject-card-select"
              onClick={() => handleSelectSubject(key)}
            >
              <div className="subj-icon">{subj.icon}</div>
              <h3>{subj.name}</h3>
              <p>{subj.description}</p>
              <span className="subj-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Modules View
  if (currentView === 'modules' && subject) {
    return (
      <div className="learn-container">
        <div className="learn-header">
          <button className="learn-back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>{subject.icon} {subject.name}</h1>
          <div style={{ width: '60px' }}></div>
        </div>

        <div className="modules-list">
          {subject.modules.map((module) => (
            <div key={module.id} className="module-card" onClick={() => handleSelectModule(module)}>
              <div className="module-header">
                <span className="module-icon">{module.icon}</span>
                <div className="module-info">
                  <h3>{module.name}</h3>
                  <p>{module.difficulty}</p>
                </div>
              </div>
              <div className="module-topics-count">
                {module.topics.length} topics
              </div>
              <span className="module-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Topics View
  if (currentView === 'topics' && selectedModule && subject) {
    return (
      <div className="learn-container">
        <div className="learn-header">
          <button className="learn-back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>{selectedModule.icon} {selectedModule.name}</h1>
          <div style={{ width: '60px' }}></div>
        </div>

        <div className="topics-list">
          {selectedModule.topics.map((topic) => (
            <div
              key={topic.id}
              className={`topic-card ${topic.status}`}
              onClick={() => topic.status !== 'locked' && handleSelectTopic(topic)}
            >
              <div className="topic-status">
                {topic.status === 'completed' && '✅'}
                {topic.status === 'in-progress' && '⏳'}
                {topic.status === 'locked' && '🔒'}
              </div>
              <div className="topic-content">
                <h4>{topic.name}</h4>
                <p>⏱️ {topic.duration}</p>
              </div>
              {topic.status !== 'locked' && <span className="topic-arrow">→</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Study Mood Modal
  if (showStudyMood) {
    return (
      <>
        <StudyMood
          onMoodSelected={handleMoodSelected}
          onClose={() => setShowStudyMood(false)}
        />
      </>
    );
  }

  // Topic Detail View
  if (currentView === 'topic-detail' && selectedTopic && subject) {
    return (
      <div className="learn-container">
        <div className="learn-header">
          <button className="learn-back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>📖 {selectedTopic.name}</h1>
          <div style={{ width: '60px' }}></div>
        </div>

        <div className="topic-detail-content">
          {studyMood && (
            <div className="mood-indicator">
              <p>Study Mode: <strong>{studyMood}</strong></p>
            </div>
          )}

          <div className="lesson-section">
            <h2>Lesson Content</h2>
            <div className="lesson-card">
              <h3>{selectedTopic.name}</h3>
              <p>
                This lesson covers the fundamentals of {selectedTopic.name.toLowerCase()}. 
                You'll learn key concepts, formulas, and real-world applications.
              </p>
              <div className="lesson-outline">
                <h4>What You'll Learn:</h4>
                <ul>
                  <li>Core concepts and definitions</li>
                  <li>Key formulas and principles</li>
                  <li>Real-world applications</li>
                  <li>Practice problems</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="learning-tools">
            <h2>Learning Tools</h2>
            <div className="tools-grid">
              <div className="tool-card" onClick={() => setCurrentView('teach-ai')}>
                <span className="tool-icon">🤖</span>
                <h4>Teach AI</h4>
                <p>You teach, AI learns</p>
              </div>

              <div className="tool-card" onClick={() => setCurrentView('knowledge-graph')}>
                <span className="tool-icon">🗺️</span>
                <h4>Knowledge Map</h4>
                <p>See connections</p>
              </div>

              <div className="tool-card" onClick={() => setCurrentView('doubt-solver')}>
                <span className="tool-icon">💡</span>
                <h4>Ask Doubts</h4>
                <p>Context-aware AI</p>
              </div>

              <div className="tool-card" onClick={() => setCurrentView('projects')}>
                <span className="tool-icon">🎯</span>
                <h4>Projects</h4>
                <p>Learn by doing</p>
              </div>
              <div className="tool-card" onClick={() => setCurrentView('whiteboard')}>
  <span className="tool-icon">✨</span>
  <h4>AI Whiteboard</h4>
  <p>Visual explanations</p>
</div>

<div className="tool-card" onClick={() => setCurrentView('sensory-rooms')}>
  <span className="tool-icon">🏛️</span>
  <h4>Memory Palace</h4>
  <p>Sensory encoding</p>
</div>

<div className="tool-card" onClick={() => setCurrentView('shadow-learning')}>
  <span className="tool-icon">👥</span>
  <h4>Community Notes</h4>
  <p>Teach & learn</p>
</div>

<div className="tool-card" onClick={() => setCurrentView('what-if')}>
  <span className="tool-icon">🔮</span>
  <h4>What-If</h4>
  <p>Explore scenarios</p>
</div>

<div className="tool-card" onClick={() => setCurrentView('universe')}>
  <span className="tool-icon">🌌</span>
  <h4>Universe Builder</h4>
  <p>Your knowledge map</p>
</div>

              <div className="tool-card" onClick={() => setCurrentView('revision')}>
                <span className="tool-icon">🔄</span>
                <h4>Revision</h4>
                <p>Spaced repetition</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teach AI View
  if (currentView === 'teach-ai') {
    return (
      <TeachAI
        topic={selectedTopic}
        subject={subject}
        onBack={handleBack}
        studentLevel={studentLevel}
      />
    );
  }

  // Knowledge Graph View
  if (currentView === 'knowledge-graph') {
    return (
      <KnowledgeGraph
        subject={subject}
        module={selectedModule}
        onBack={handleBack}
      />
    );
  }

  // Doubt Solver View
  if (currentView === 'doubt-solver') {
    return (
      <ContextDoubtSolver
        topic={selectedTopic}
        subject={subject}
        studentLevel={studentLevel}
        onBack={handleBack}
      />
    );
  }

  // Projects View
  if (currentView === 'projects') {
    return (
      <ProjectLearning
        topic={selectedTopic}
        subject={subject}
        onBack={handleBack}
      />
    );
  }
  // In the topic-detail section, add:
{currentView === 'whiteboard' && (
  <AIWhiteboard
    topic={selectedTopic}
    onBack={handleBack}
  />
)}

{currentView === 'creator' && (
  <CreatorStudio
    topic={selectedTopic}
    onBack={handleBack}
  />
)}
// Sensory Rooms
if (currentView === 'sensory-rooms') {
  return (
    <SensoryRooms
      topic={selectedTopic}
      onBack={handleBack}
    />
  );
}

// Shadow Learning
if (currentView === 'shadow-learning') {
  return (
    <ShadowLearning
      topic={selectedTopic}
      onBack={handleBack}
    />
  );
}

// What-If Simulator
if (currentView === 'what-if') {
  return (
    <WhatIfSimulator
      topic={selectedTopic}
      onBack={handleBack}
    />
  );
}

// Universe Builder
if (currentView === 'universe') {
  return (
    <UniverseBuilder
      topic={selectedTopic}
      onBack={handleBack}
    />
  );
}
  // Revision View
  if (currentView === 'revision') {
    return (
      <RevisionPlanner
        topic={selectedTopic}
        subject={subject}
        onBack={handleBack}
      />
    );
    
  }

  return null;
}

export default Learn;