import React from 'react';
import '../styles/MasteryPath.css';

/**
 * Mastery Path Progress Module
 * 
 * Tracks structured milestone sequences across subject tracks.
 */

const PATHS = {
  physics: {
    name: 'Quantum & Relativistic Foundations',
    duration: '30 Days Cadence',
    lessons: [
      { id: 1, title: 'Spacetime & Coordinate Invariance', completed: true, time: '8 min' },
      { id: 2, title: 'Proper Time & Geodesic Deviation', completed: true, time: '10 min' },
      { id: 3, title: 'Metric Tensors & Curvature', completed: false, time: '12 min' },
      { id: 4, title: 'Wavefunction & State Vector Superposition', completed: false, time: '15 min' },
      { id: 5, title: 'Decoherence & Measurement Problem', completed: false, time: '12 min' },
    ],
  },
  philosophy: {
    name: 'Formal Epistemology & Deductive Logic',
    duration: '20 Days Cadence',
    lessons: [
      { id: 1, title: 'Axioms of Truth & Justification', completed: true, time: '7 min' },
      { id: 2, title: 'Socratic Method & Aporia', completed: true, time: '14 min' },
      { id: 3, title: 'Rationalism vs. Pure Empiricism', completed: false, time: '12 min' },
      { id: 4, title: 'Falsifiability & Scientific Demarcation', completed: false, time: '13 min' },
    ],
  },
};

function MasteryPath({ selectedSubject }) {
  const path = PATHS[selectedSubject || 'physics'] || PATHS.physics;

  const completed = path.lessons.filter(l => l.completed).length;
  const percentage = Math.round((completed / path.lessons.length) * 100);

  return (
    <div className="mastery-path-card">
      <div className="path-header">
        <div className="path-title-col">
          <span className="path-overline">Structured Syllabus</span>
          <h2 className="path-title">{path.name}</h2>
        </div>
        <span className="path-duration-badge">⏱️ {path.duration}</span>
      </div>

      {/* Progress */}
      <div className="path-progress">
        <div className="path-progress-bar">
          <div className="path-progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="path-progress-text">
          {completed} of {path.lessons.length} core modules verified ({percentage}%)
        </p>
      </div>

      {/* Lessons */}
      <div className="path-lessons">
        {path.lessons.map((lesson, idx) => (
          <div key={lesson.id} className={`lesson-row-item ${lesson.completed ? 'completed' : ''}`}>
            <div className="lesson-check-indicator">
              {lesson.completed ? '✓' : idx + 1}
            </div>
            <div className="lesson-info">
              <h4 className="lesson-title">{lesson.title}</h4>
              <span className="lesson-time">{lesson.time} focus</span>
            </div>
            <button className={`lesson-action-btn ${lesson.completed ? 'review' : 'start'}`}>
              {lesson.completed ? 'Review' : 'Start Module'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MasteryPath;