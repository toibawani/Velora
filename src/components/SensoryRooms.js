import React, { useState } from 'react';
import '../styles/SensoryRooms.css';

function SensoryRooms({ topic }) {
  const [room, setRoom] = useState({
    lightLevel: 50,
    temperature: 20,
    soundType: 'ambient',
    objects: [],
  });
  const [activeObject, setActiveObject] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#FFD700');

  const objects = [
    {
      id: 'sun',
      name: 'Sun',
      emoji: '☀️',
      sensoryEffect: { light: 100, warmth: 40, color: '#FFD700' },
      description: 'Energy source',
    },
    {
      id: 'leaf',
      name: 'Leaf',
      emoji: '🍃',
      sensoryEffect: { color: '#2ECC71', sound: 'rustling', vibration: 'wave' },
      description: 'Chlorophyll',
    },
    {
      id: 'water',
      name: 'Water',
      emoji: '💧',
      sensoryEffect: { sound: 'trickling', coolness: 20, vibration: 'ripple' },
      description: 'H₂O',
    },
    {
      id: 'glucose',
      name: 'Glucose',
      emoji: '🍬',
      sensoryEffect: { color: '#FF6B6B', sweetness: 'simulated', pulse: true },
      description: 'Energy product',
    },
  ];

  const handleDragObject = (obj) => {
    setRoom({
      ...room,
      lightLevel: obj.sensoryEffect.light || room.lightLevel,
      temperature: (obj.sensoryEffect.warmth || 0) + 20,
      soundType: obj.sensoryEffect.sound || 'ambient',
    });
    setSelectedColor(obj.sensoryEffect.color || '#FFD700');
    setActiveObject(obj);

    // Trigger haptic feedback (if available)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    playSound(obj.sensoryEffect.sound);
  };

  const playSound = (soundType) => {
    const sounds = {
      rustling: '🌿 Rustle...',
      trickling: '💧 Trickling...',
      ambient: '🎵 Ambient...',
    };
    console.log(`Playing: ${sounds[soundType]}`);
  };

  return (
    <div className="sensory-rooms-container">
      <h2>🏛️ Memory Palace: {topic?.name}</h2>

      <div className="rooms-main">
        {/* The Room */}
        <div
          className="memory-room"
          style={{
            background: `linear-gradient(135deg, ${selectedColor}33 0%, #F5F5F5 100%)`,
            filter: `brightness(${50 + room.lightLevel / 2}%)`,
          }}
        >
          <div className="room-info">
            <p className="room-label">Drag objects into this space</p>
            <p className="room-sensory">
              💡 Brightness: {room.lightLevel}% | 🌡️ Warmth: {room.temperature - 20}°C
            </p>
          </div>

          {/* Room Objects */}
          {room.objects.length > 0 && (
            <div className="placed-objects">
              {room.objects.map((obj, idx) => (
                <div
                  key={idx}
                  className="object-placed"
                  style={{
                    animation: obj.sensoryEffect.pulse ? 'pulse 1.5s infinite' : 'none',
                  }}
                >
                  {obj.emoji}
                  <p>{obj.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Objects Palette */}
        <div className="objects-palette">
          <h3>Available Objects</h3>
          <div className="objects-grid">
            {objects.map((obj) => (
              <div
                key={obj.id}
                className="object-card"
                draggable
                onDragEnd={() => {
                  handleDragObject(obj);
                  setRoom({ ...room, objects: [...room.objects, obj] });
                }}
                onClick={() => handleDragObject(obj)}
              >
                <span className="object-emoji">{obj.emoji}</span>
                <h4>{obj.name}</h4>
                <p className="object-desc">{obj.description}</p>
                <div className="sensory-tags">
                  {obj.sensoryEffect.sound && <span className="tag">🔊 Sound</span>}
                  {obj.sensoryEffect.color && <span className="tag">🎨 Color</span>}
                  {obj.sensoryEffect.vibration && <span className="tag">📳 Haptic</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Object Details */}
      {activeObject && (
        <div className="sensory-effects-panel">
          <h3>✨ Sensory Effects: {activeObject.name}</h3>
          <div className="sensory-items">
            {activeObject.sensoryEffect.light && (
              <div className="sensory-item light">
                <span>💡 Visual Brightness</span>
                <p>Enhanced with {activeObject.sensoryEffect.color}</p>
              </div>
            )}
            {activeObject.sensoryEffect.sound && (
              <div className="sensory-item audio">
                <span>🔊 Audio: {activeObject.sensoryEffect.sound}</span>
                <p>Encoding auditory memory</p>
              </div>
            )}
            {activeObject.sensoryEffect.vibration && (
              <div className="sensory-item haptic">
                <span>📳 Haptic: {activeObject.sensoryEffect.vibration}</span>
                <p>Tactile feedback engaged</p>
              </div>
            )}
            {activeObject.sensoryEffect.warmth && (
              <div className="sensory-item thermal">
                <span>🌡️ Thermal: +{activeObject.sensoryEffect.warmth}°</span>
                <p>Temperature sensation simulated</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rooms-note">
        <p>🧠 <strong>Why This Works:</strong> Multi-sensory encoding creates stronger neural pathways. By associating concepts with colors, sounds, and haptic feedback, you remember better!</p>
      </div>
    </div>
  );
}

export default SensoryRooms;