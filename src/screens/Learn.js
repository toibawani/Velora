import React, { useState, useEffect } from 'react';
import {
  Atom,
  Brain,
  Landmark,
  Target,
  Type,
  Link2,
  FileText,
  Orbit,
  Disc,
  Edit3,
  Palette,
  Headphones,
  Sparkles,
  Compass,
  Users,
  BookOpen
} from 'lucide-react';
import MasteryPath from '../components/MasteryPath';
import BlackHolesElite from '../components/BlackHolesElite';
import BlackHoleMastery from '../components/BlackHoleMastery';
import RelativityLab from '../components/RelativityLab';
import PhysicsSimulations from '../components/PhysicsSimulations';
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
import EmptyState from '../components/EmptyState';
import { trackEvent } from '../utils/analytics';
import { measurePerformance } from '../utils/performance';
import LessonReader from '../components/LessonReader';
import { CURRICULUM, getTopic } from '../data/curriculum';

function Learn({ setScreen, selectedSubject, setSelectedSubject, initialView = 'overview', setInitialView, showToast }) {
  const [currentView, setCurrentView] = useState(initialView || 'overview');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeGame, setActiveGame] = useState({
    name: 'Quantum Concepts Quiz',
    type: 'quiz',
    difficulty: 'Intermediate',
    duration: 10
  });

  useEffect(() => {
    trackEvent('learning_started', { subject: selectedSubject, view: currentView });
  }, [selectedSubject, currentView]);

  const subjectRecord = measurePerformance('resolve_subject_data', () => CURRICULUM[selectedSubject || 'physics']);
  const subjectIcons = { physics: Atom, philosophy: Brain, history: Landmark };
  const subject = subjectRecord && {
    ...subjectRecord,
    icon: subjectIcons[selectedSubject || 'physics'],
    modules: subjectRecord.modules.map((module, index) => ({
      ...module,
      name: module.title,
      status: index === 0 ? 'in-progress' : 'not-started',
      progress: 0,
      topics: module.topics.map((topic) => ({ ...topic, name: topic.title, lessons: topic.sections.length })),
    })),
  };
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

  // View: Full curriculum lesson
  if (currentView === 'lesson' && selectedTopic) {
    return <LessonReader topic={selectedTopic} subject={selectedSubject || 'physics'} onBack={handleBack} showToast={showToast} />;
  }

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
        onNotify={showToast}
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

  // View: Interactive Physics Simulations Laboratory
  if (currentView === 'physics-sims') {
    return (
      <div className="learn-container">
        <header className="learn-header">
          <button className="learn-back-btn" onClick={handleBack}>
            ← Back to Curriculum
          </button>
          <h1 className="learn-title">Interactive Physics Laboratory</h1>
          <div style={{ width: '60px' }}></div>
        </header>
        <PhysicsSimulations onBack={handleBack} />
      </div>
    );
  }

  const SubjectIconHeader = subject.icon;

  // Main Overview
  return (
    <div className="learn-container">
      {/* Header */}
      <header className="learn-header">
        <button className="learn-back-btn" onClick={() => setScreen('universe')}>
          ← Return to Universe
        </button>
        <h1 className="learn-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <SubjectIconHeader size={20} strokeWidth={1.5} color="var(--color-accent)" />
          <span>{subject.name}</span>
        </h1>
        <div style={{ width: '60px' }}></div>
      </header>

      <main className="learn-main">
        {/* Mastery Path */}
        <MasteryPath selectedSubject={selectedSubject || 'physics'} />

            {/* Interactive Physics Simulations (for Physics) */}
            {(selectedSubject === 'physics' || !selectedSubject) && (
              <section className="learn-section">
                <div
                  className="card p-6 border border-[#3E2718]/15 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FFF9F1] shadow-sm mb-6"
                  style={{ background: '#FFF9F1', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(62, 39, 24, 0.12)' }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8C4A2F', display: 'block', marginBottom: '4px' }}>
                      Interactive Laboratory
                    </span>
                    <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.35rem', margin: '0 0 6px', color: '#2C2118' }}>
                      Physics in Motion: 5 Hands-On Simulations
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#6E5846', maxWidth: '640px' }}>
                      Test Newton's second law on a live track, angle ballistic projectiles, drop objects in a vacuum chamber, watch ripple waves interfere, and fire thruster burns in Keplerian orbit.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentView('physics-sims')}
                    style={{ whiteSpace: 'nowrap', backgroundColor: '#8C4A2F', color: '#FFF8F1', borderRadius: '999px', padding: '10px 20px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                  >
                    Open Physics Lab →
                  </button>
                </div>
              </section>
            )}

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
              {(!subject.modules || subject.modules.length === 0) ? (
                <EmptyState
                  icon="📚"
                  title="No modules found"
                  description="Complete topics or explore another subject to unlock tailored modules."
                  actionText="Switch Subject"
                  action={() => setSelectedSubject('physics')}
                />
              ) : (
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
                              const curriculumTopic = getTopic(selectedSubject || 'physics', topic.id);
                              setSelectedTopic(curriculumTopic || topic);
                              trackEvent('lesson_opened', { subject: selectedSubject, topic: topic.id });
                              setCurrentView('lesson');
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
            )}
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
                <span className="game-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  <Target size={22} strokeWidth={1.5} color="var(--color-accent)" />
                </span>
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
              <span className="game-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <Type size={22} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
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
              <span className="game-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <Link2 size={22} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
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
              <span className="game-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <FileText size={22} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
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
              <span className="tool-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Orbit size={24} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
              <h4 className="tool-title">Relativity Lab</h4>
              <p className="tool-desc">Simulate spacetime curvature</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('black-hole-mastery')}
            >
              <span className="tool-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Disc size={24} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
              <h4 className="tool-title">Black Holes Masterclass</h4>
              <p className="tool-desc">10 deep visual chapters</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('whiteboard')}
            >
              <span className="tool-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Edit3 size={24} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
              <h4 className="tool-title">AI Whiteboard</h4>
              <p className="tool-desc">Draw & visualize concepts</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('creator')}
            >
              <span className="tool-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Palette size={24} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
              <h4 className="tool-title">Creator Studio</h4>
              <p className="tool-desc">Make notes & flashcards</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('sensory-rooms')}
            >
              <span className="tool-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Headphones size={24} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
              <h4 className="tool-title">Sensory Rooms</h4>
              <p className="tool-desc">Multi-sensory learning</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('what-if')}
            >
              <span className="tool-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={24} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
              <h4 className="tool-title">What-If Simulator</h4>
              <p className="tool-desc">Explore scenarios</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('universe')}
            >
              <span className="tool-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={24} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
              <h4 className="tool-title">Universe Builder</h4>
              <p className="tool-desc">Map your knowledge</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('shadow-learning')}
            >
              <span className="tool-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
              <h4 className="tool-title">Shadow Learning</h4>
              <p className="tool-desc">Learn from community</p>
            </div>

            <div
              className="tool-card"
              onClick={() => setCurrentView('sketchbook')}
            >
              <span className="tool-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} strokeWidth={1.5} color="var(--color-accent)" />
              </span>
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

        {/* Analytics & Smart Revision */}
        <section className="learn-section">
          <LearningAnalytics selectedSubject={selectedSubject} />
        </section>

        <section className="learn-section">
          <SmartRevision selectedSubject={selectedSubject} />
        </section>

        {/* Institutional & Family Portal */}
        <section className="learn-section">
          <InstitutionalMode />
        </section>

        {/* Community Proof */}
        <section className="learn-section">
          <SocialProof />
        </section>
      </main>
    </div>
  );
}

export default Learn;