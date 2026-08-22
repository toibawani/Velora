import React from 'react';

function SensoryRooms({ topic, onBack }) {
  return (
    <div className="learn-container">
      <header className="learn-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>🏛️ Sensory Rooms</h1>
        <div style={{ width: '60px' }}></div>
      </header>
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#6f6f6f' }}>
            Sensory Rooms - Coming Soon
          </p>
        </div>
      </main>
    </div>
  );
}

export default SensoryRooms;