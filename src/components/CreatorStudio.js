import React, { useState } from 'react';
import '../styles/Creator.css';

function CreatorStudio({ topic, onBack }) {
  const [activeMode, setActiveMode] = useState('notes'); // notes, mindmap, flashcards, lesson
  const [noteContent, setNoteContent] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcard, setCurrentFlashcard] = useState({ q: '', a: '' });
  const [saved, setSaved] = useState(false);

  const handleSaveNote = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    playSound('success');
  };

  const addFlashcard = () => {
    if (currentFlashcard.q && currentFlashcard.a) {
      setFlashcards([...flashcards, currentFlashcard]);
      setCurrentFlashcard({ q: '', a: '' });
      playSound('success');
    }
  };

  const playSound = (type) => {
    // In production, use Web Audio API or audio files
    // For now, just visual feedback
    console.log(`Sound: ${type}`);
  };

  return (
    <div className="learn-container">
      <div className="learn-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>🎨 Creator Studio</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="creator-container">
        <div className="creator-tabs">
          {[
            { id: 'notes', icon: '📝', label: 'Notes' },
            { id: 'mindmap', icon: '🧠', label: 'Mind Map' },
            { id: 'flashcards', icon: '🎴', label: 'Flashcards' },
            { id: 'lesson', icon: '📖', label: 'Mini Lesson' },
          ].map((mode) => (
            <button
              key={mode.id}
              className={`creator-tab ${activeMode === mode.id ? 'active' : ''}`}
              onClick={() => setActiveMode(mode.id)}
            >
              <span className="tab-icon">{mode.icon}</span>
              <span className="tab-label">{mode.label}</span>
            </button>
          ))}
        </div>

        <div className="creator-content">
          {/* Notes Mode */}
          {activeMode === 'notes' && (
            <div className="notes-editor">
              <h2>📝 Create Beautiful Notes</h2>
              <textarea
                placeholder="Write your notes here... Use #topics to organize"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="note-textarea"
              />
              <div className="notes-toolbar">
                <button className="toolbar-btn">Bold</button>
                <button className="toolbar-btn">Italic</button>
                <button className="toolbar-btn">Code</button>
                <button className="toolbar-btn">Link</button>
              </div>
              <button
                className={`btn-save-note ${saved ? 'saved' : ''}`}
                onClick={handleSaveNote}
              >
                {saved ? '✅ Saved!' : '💾 Save Note'}
              </button>
            </div>
          )}

          {/* Mind Map Mode */}
          {activeMode === 'mindmap' && (
            <div className="mindmap-creator">
              <h2>🧠 Create a Mind Map</h2>
              <svg className="mindmap-canvas" viewBox="0 0 600 400">
                {/* Center circle */}
                <circle cx="300" cy="200" r="50" fill="#667eea" />
                <text x="300" y="200" textAnchor="middle" dominantBaseline="central" fill="white">
                  {topic?.name}
                </text>

                {/* Branch circles */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const angle = (i * 2 * Math.PI) / 5;
                  const x = 300 + 150 * Math.cos(angle);
                  const y = 200 + 150 * Math.sin(angle);
                  return (
                    <g key={i}>
                      <line x1="300" y1="200" x2={x} y2={y} stroke="#D3D1C7" strokeWidth="2" />
                      <circle cx={x} cy={y} r="40" fill="#F1EFE8" stroke="#667eea" strokeWidth="2" />
                      <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
                        Concept {i + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <p className="mindmap-hint">Click on branches to edit and add connections</p>
              <button className="btn-share-mindmap">🔗 Share Mind Map</button>
            </div>
          )}

          {/* Flashcards Mode */}
          {activeMode === 'flashcards' && (
            <div className="flashcard-creator">
              <h2>🎴 Create Flashcards</h2>
              <div className="flashcard-input">
                <input
                  type="text"
                  placeholder="Question..."
                  value={currentFlashcard.q}
                  onChange={(e) =>
                    setCurrentFlashcard({ ...currentFlashcard, q: e.target.value })
                  }
                  className="flashcard-input-field"
                />
                <textarea
                  placeholder="Answer..."
                  value={currentFlashcard.a}
                  onChange={(e) =>
                    setCurrentFlashcard({ ...currentFlashcard, a: e.target.value })
                  }
                  className="flashcard-input-area"
                  rows="3"
                />
                <button className="btn-add-card" onClick={addFlashcard}>
                  ➕ Add Card
                </button>
              </div>

              {flashcards.length > 0 && (
                <div className="flashcards-list">
                  <h3>Your Cards ({flashcards.length})</h3>
                  {flashcards.map((card, idx) => (
                    <div key={idx} className="flashcard-item">
                      <div className="card-q">Q: {card.q}</div>
                      <div className="card-a">A: {card.a}</div>
                      <button
                        className="btn-remove-card"
                        onClick={() =>
                          setFlashcards(flashcards.filter((_, i) => i !== idx))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button className="btn-publish-cards">📤 Publish Cards</button>
                </div>
              )}
            </div>
          )}

          {/* Lesson Mode */}
          {activeMode === 'lesson' && (
            <div className="lesson-creator">
              <h2>📖 Create a Mini Lesson</h2>
              <div className="lesson-form">
                <input type="text" placeholder="Lesson Title" className="lesson-input" />
                <textarea
                  placeholder="Lesson Content (Markdown supported)"
                  className="lesson-textarea"
                  rows="8"
                />
                <div className="lesson-options">
                  <label>
                    <input type="checkbox" /> Include Video/Animation
                  </label>
                  <label>
                    <input type="checkbox" /> Add Practice Problems
                  </label>
                  <label>
                    <input type="checkbox" /> Make it Public
                  </label>
                </div>
                <button className="btn-publish-lesson">🚀 Publish Lesson</button>
              </div>
            </div>
          )}
        </div>

        {saved && <div className="save-notification">✨ Your work is being saved...</div>}
      </div>
    </div>
  );
}

export default CreatorStudio;