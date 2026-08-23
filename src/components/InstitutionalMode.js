import React, { useState } from 'react';
import '../styles/InstitutionalMode.css';

/**
 * InstitutionalMode Component
 * 
 * Provides dedicated interfaces for:
 * 1. Educators & Teachers (Curriculum alignment, Socratic discussion guides, age levels)
 * 2. Parents (Privacy-safe developmental insights, Educational Value Index, dinner conversation starters)
 */
function InstitutionalMode({ onBack }) {
  const [activeRole, setActiveRole] = useState('educator'); // 'educator' | 'parent'
  const [selectedAgeBand, setSelectedAgeBand] = useState('high-school');

  const educatorGuides = [
    {
      topic: 'General Relativity & Gravity',
      gradeBand: 'high-school',
      curriculumAlignments: ['AP Physics C: Mechanics', 'IB Physics HL (Option A)', 'CBSE Class 11 Gravitation'],
      coreConceptGoal: 'Transition students from Newtonian flat space force vectors to Riemannian spacetime curvature.',
      socraticPrompts: [
        'If gravity is a force pulling downwards, why do astronauts in orbit feel weightless despite being in 90% of Earth’s surface gravity?',
        'How does an accelerating elevator mimic a gravitational field (Einstein’s Equivalence Principle)?'
      ],
      misconceptionsToDismantle: [
        'Misconception: Astronauts float because there is zero gravity in space.',
        'Misconception: Black holes actively suck in distant planets like cosmic vacuum cleaners.'
      ],
      classroomLabIdea: 'Use a stretched spandex sheet with heavy steel ball bearings and light marbles to visually demonstrate orbital precession and photon geodesic deflection.'
    },
    {
      topic: 'Socratic Epistemology & Modern Ethics',
      gradeBand: 'middle-school',
      curriculumAlignments: ['Middle Years IB Humanities', 'Critical Thinking & Civics', 'Introductory Philosophy'],
      coreConceptGoal: 'Equip young learners to distinguish between factual evidence, inductive assumptions, and dogma.',
      socraticPrompts: [
        'How do we know what we know? Can our senses ever deceive us?',
        'If a computer program makes a decision that harms someone, who is responsible: the coder, the user, or the machine?'
      ],
      misconceptionsToDismantle: [
        'Misconception: Philosophy is just opinions with no rigorous logical criteria.',
        'Misconception: Ancient thinkers knew less than us about human nature.'
      ],
      classroomLabIdea: 'Conduct a 20-minute classroom Socratic circle debating the digital Allegory of the Cave.'
    }
  ];

  return (
    <div className="institutional-mode-container">
      {/* Top Header */}
      <header className="inst-header-bar">
        <div className="inst-brand-info">
          <span className="inst-badge">INSTITUTIONAL & FAMILY PORTAL</span>
          <h2 className="inst-title">VELORA for Educators & Families</h2>
        </div>

        {/* Mode Switcher */}
        <div className="role-switch-pills">
          <button
            className={`role-pill ${activeRole === 'educator' ? 'active' : ''}`}
            onClick={() => setActiveRole('educator')}
          >
            🎓 Educator Mode
          </button>
          <button
            className={`role-pill ${activeRole === 'parent' ? 'active' : ''}`}
            onClick={() => setActiveRole('parent')}
          >
            👨‍👧 Parent Insights
          </button>
        </div>
      </header>

      <main className="inst-main-body">
        {/* EDUCATOR MODE */}
        {activeRole === 'educator' && (
          <div className="educator-dashboard">
            <section className="inst-hero-summary">
              <h3>Curriculum Integration & Lesson Guides</h3>
              <p>
                Seamlessly bridge VELORA’s interactive visual simulations with your classroom syllabus.
                Download Socratic lesson plans, discussion rubrics, and conceptual diagnostic checks.
              </p>
            </section>

            {/* Age Band Selector */}
            <div className="age-band-selector">
              <button
                className={`age-btn ${selectedAgeBand === 'middle-school' ? 'active' : ''}`}
                onClick={() => setSelectedAgeBand('middle-school')}
              >
                Middle School (Grades 6–8)
              </button>
              <button
                className={`age-btn ${selectedAgeBand === 'high-school' ? 'active' : ''}`}
                onClick={() => setSelectedAgeBand('high-school')}
              >
                High School (Grades 9–12 / AP / IB)
              </button>
              <button
                className={`age-btn ${selectedAgeBand === 'university' ? 'active' : ''}`}
                onClick={() => setSelectedAgeBand('university')}
              >
                Undergraduate / Advanced
              </button>
            </div>

            {/* Teaching Guides List */}
            <div className="guides-stack">
              {educatorGuides
                .filter(g => selectedAgeBand === 'university' || g.gradeBand === selectedAgeBand)
                .map((guide, idx) => (
                  <div key={idx} className="educator-guide-card">
                    <div className="guide-card-header">
                      <div>
                        <span className="guide-domain-tag">Lesson Framework</span>
                        <h4 className="guide-topic-title">{guide.topic}</h4>
                      </div>
                      <div className="curriculum-align-tags">
                        {guide.curriculumAlignments.map((align, i) => (
                          <span key={i} className="align-badge">{align}</span>
                        ))}
                      </div>
                    </div>

                    <div className="guide-content-grid">
                      <div className="guide-col">
                        <span className="col-label">🎯 Pedagogical Objective</span>
                        <p className="col-text">{guide.coreConceptGoal}</p>

                        <span className="col-label">💡 Socratic Discussion Prompts</span>
                        <ul className="guide-ul">
                          {guide.socraticPrompts.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="guide-col">
                        <span className="col-label">⚠️ Common Misconceptions to Dismantle</span>
                        <ul className="guide-ul warnings">
                          {guide.misconceptionsToDismantle.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>

                        <span className="col-label">🔬 Experiential Classroom Lab</span>
                        <p className="col-text">{guide.classroomLabIdea}</p>
                      </div>
                    </div>

                    <div className="guide-card-footer">
                      <button className="guide-export-btn" onClick={() => window.print()}>
                        Export Printable Lesson Plan PDF →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* PARENT MODE */}
        {activeRole === 'parent' && (
          <div className="parent-dashboard">
            <section className="inst-hero-summary">
              <h3>Transparent Developmental Insights</h3>
              <p>
                VELORA replaces dopamine-trap scrolling with deep conceptual exploration.
                Monitor focus velocity, educational value index, and conversation starters—without invasive tracking.
              </p>
            </section>

            {/* Educational Value Index Card */}
            <div className="parent-stats-grid">
              <div className="parent-stat-box">
                <span className="stat-eyebrow">Educational Value Index</span>
                <div className="stat-main-row">
                  <span className="stat-score-large">98/100</span>
                </div>
                <p className="stat-sub-expl">
                  Top tier cognitive enrichment. 100% time spent on physics, logic, and history.
                </p>
              </div>

              <div className="parent-stat-box">
                <span className="stat-eyebrow">Focused Learning Time</span>
                <div className="stat-main-row">
                  <span className="stat-score-large">24.5 hrs</span>
                </div>
                <p className="stat-sub-expl">
                  Equivalent to 3 weeks of high school advanced science tutoring.
                </p>
              </div>

              <div className="parent-stat-box">
                <span className="stat-eyebrow">Attention & Flow State</span>
                <div className="stat-main-row">
                  <span className="stat-score-large">High (42m avg)</span>
                </div>
                <p className="stat-sub-expl">
                  Uninterrupted deep focus sessions without algorithmic distractions.
                </p>
              </div>
            </div>

            {/* Dinner Table Conversation Starters */}
            <div className="conversation-starters-card">
              <h4 className="starter-header">🍽️ Dinner Table Conversation Starters</h4>
              <p className="starter-sub">
                Connect with your child’s learning naturally using these curiosity-driven questions:
              </p>

              <div className="starters-list">
                <div className="starter-item">
                  <span className="starter-num">1</span>
                  <div className="starter-text-block">
                    <p className="starter-q">"Why do clocks run slower near a black hole than on Earth?"</p>
                    <span className="starter-tip">
                      💡 Tip: Ask them about gravitational time dilation and how Einstein discovered gravity curves spacetime.
                    </span>
                  </div>
                </div>

                <div className="starter-item">
                  <span className="starter-num">2</span>
                  <div className="starter-text-block">
                    <p className="starter-q">"What did Socrates mean when he said the only true wisdom is knowing you know nothing?"</p>
                    <span className="starter-tip">
                      💡 Tip: Encourage them to explain intellectual humility and questioning assumptions.
                    </span>
                  </div>
                </div>

                <div className="starter-item">
                  <span className="starter-num">3</span>
                  <div className="starter-text-block">
                    <p className="starter-q">"How did Galileo prove Earth wasn’t the center of the universe using just a telescope?"</p>
                    <span className="starter-tip">
                      💡 Tip: They will love explaining Jupiter’s moons and the Moon’s craters.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default InstitutionalMode;
