import React, { useState } from 'react';
import '../styles/MasteryPath.css';

function MasteryPath({ selectedSubject }) {
  const paths = {
    physics: {
      name: 'Master Quantum Physics',
      duration: '30 Days',
      lessons: [
        { id: 1, title: 'What is Space?', completed: true, time: '8 min' },
        { id: 2, title: 'What is Time?', completed: true, time: '10 min' },
        { id: 3, title: 'Space-Time', completed: false, time: '12 min' },
        { id: 4, title: 'Quantum Mechanics Basics', completed: false, time: '15 min' },
        { id: 5, title: 'Wave-Particle Duality', completed: false, time: '12 min' },
      ],
    },
    philosophy: {
      name: 'Foundations of Philosophy',
      duration: '20 Days',
      lessons: [
        { id: 1, title: 'What is Philosophy?', completed: true, time: '7 min' },
        { id: 2, title: 'Ancient Philosophy', completed: true, time: '14 min' },
        { id: 3, title: 'Medieval Thought', completed: false, time: '12 min' },
        { id: 4, title: 'Modern Philosophy', completed: false, time: '13 min' },
      ],
    },
  };

  const path = paths[selectedSubject];
  if (!path) return null;

  const completed = path.lessons.filter(l => l.completed).length;
  const percentage = Math.round((completed / path.lessons.length) * 100);

  return (
    <div className="mastery-path">
      <div className="path-header">
        <h2 className="path-title">{path.name}</h2>
        <span className="path-duration">⏱️ {path.duration}</span>
      </div>

      {/* Progress */}
      <div className="path-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="progress-text">
          You've completed {completed} of {path.lessons.length} lessons ({percentage}%)
        </p>
      </div>

      {/* Lessons */}
      <div className="path-lessons">
        {path.lessons.map((lesson, idx) => (
          <div key={lesson.id} className={`lesson-item ${lesson.completed ? 'completed' : ''}`}>
            <div className="lesson-check">
              {lesson.completed ? '✓' : idx + 1}
            </div>
            <div className="lesson-info">
              <h4 className="lesson-title">{lesson.title}</h4>
              <span className="lesson-time">{lesson.time}</span>
            </div>
            <button className={`lesson-btn ${lesson.completed ? 'review' : 'start'}`}>
              {lesson.completed ? 'Review' : 'Start'}
            </button>
          </div>
        ))}
      </div>

      {/* Achievement */}
      {percentage >= 50 && (
        <div className="path-achievement">
          <span className="achievement-icon">🎯</span>
          <p className="achievement-text">
            You're in the top 15% of learners! Keep it up.
          </p>
        </div>
      )}
    </div>
  );
}

export default MasteryPath;