import React, { useState } from 'react';
import '../styles/Community.css';

const ROOMS = [
  { id: 1, name: 'Black Holes & Singularities', members: 234, desc: 'Exploring mysteries of black holes', unread: 3 },
  { id: 2, name: 'Quantum Mechanics Lab', members: 456, desc: 'Deep dive into quantum physics', unread: 0 },
  { id: 3, name: 'Ancient Philosophy', members: 189, desc: 'Discourse on Plato, Aristotle & more', unread: 5 },
  { id: 4, name: 'NCERT 12th Physics', members: 1024, desc: 'Study group for class 12 physics', unread: 12 },
  { id: 5, name: 'History of Civilizations', members: 567, desc: 'Exploring world history together', unread: 2 },
];

function Community({ setScreen }) {
  const [tab, setTab] = useState('rooms');

  return (
    <div className="community-page">
      <header className="community-header">
        <div className="container">
          <h1>Community Hub</h1>
          <button className="btn btn-primary" onClick={() => setScreen('dashboard')}>
            Back
          </button>
        </div>
      </header>

      <main className="container community-main">
        <div className="community-tabs">
          <button 
            className={`tab-btn ${tab === 'rooms' ? 'active' : ''}`}
            onClick={() => setTab('rooms')}
          >
            Rooms
          </button>
          <button 
            className={`tab-btn ${tab === 'rules' ? 'active' : ''}`}
            onClick={() => setTab('rules')}
          >
            Community Rules
          </button>
        </div>

        {tab === 'rooms' ? (
          <div className="rooms-list">
            {ROOMS.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-info">
                  <h3>{room.name}</h3>
                  <p>{room.desc}</p>
                  <span>👥 {room.members} members</span>
                </div>
                <div className="room-actions">
                  {room.unread > 0 && (
                    <span className="unread-badge">{room.unread}</span>
                  )}
                  <button className="btn btn-primary">Join</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rules-card">
            <h2>Community Guidelines</h2>
            <div className="rules-content">
              <p><strong>✓ Be respectful</strong> - Treat all members with courtesy and dignity.</p>
              <p><strong>✓ Stay on topic</strong> - Keep discussions relevant to the room's subject.</p>
              <p><strong>✓ Share knowledge</strong> - Help others learn and grow.</p>
              <p><strong>✗ No spam or harassment</strong> - Irrelevant posts will be automatically removed.</p>
              <p><strong>✗ No misinformation</strong> - Share only verified and accurate information.</p>
              <p className="warning">⚠️ <strong>Auto-moderation</strong>: Users who post irrelevant or harmful content will be automatically flagged and temporarily blocked.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Community;