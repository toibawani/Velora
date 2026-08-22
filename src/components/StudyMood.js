import React from 'react';
import '../styles/Components.css';

function StudyMood({ onMoodSelected, onClose }) {
  const moods = [
    { id: 'tired', emoji: '😴', label: 'Tired', description: 'Short & visual lessons' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', description: 'Revision mode' },
    { id: 'focused', emoji: '🎯', label: 'Focused', description: 'Deep concepts' },
    { id: 'quick', emoji: '⚡', label: 'Quick (15 min)', description: 'Fast learning' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="mood-modal" onClick={(e) => e.stopPropagation()}>
        <h2>How are you today?</h2>
        <p>We'll adjust the learning style based on your mood</p>

        <div className="moods-grid">
          {moods.map((mood) => (
            <button
              key={mood.id}
              className="mood-btn"
              onClick={() => onMoodSelected(mood.label)}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <h4>{mood.label}</h4>
              <p>{mood.description}</p>
            </button>
          ))}
        </div>

        <button className="modal-close-btn" onClick={onClose}>Skip</button>
      </div>
    </div>
  );
}

export default StudyMood;