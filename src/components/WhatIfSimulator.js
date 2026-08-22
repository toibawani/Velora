import React, { useState } from 'react';
import '../styles/WhatIf.css';

function WhatIfSimulator({ topic }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);

  const scenarios = [
    {
      id: 1,
      question: 'What if gravity was 2x stronger?',
      topic: 'Physics',
      difficulty: 'Medium',
      explanation: `If gravity doubled, everything would weigh twice as much. Your body couldn't support the extra weight, and you'd collapse like a pancake. Plants couldn't grow tall. Atoms in stars would compress faster, making stellar evolution much quicker. The Moon would crash into Earth. The entire solar system would collapse.`,
      visuals: ['https://via.placeholder.com/300x200?text=Doubled+Gravity'],
    },
    {
      id: 2,
      question: 'What if the Roman Empire survived?',
      topic: 'History',
      difficulty: 'Hard',
      explanation: `If Rome never fell, European history would be completely different. The Dark Ages might never happen. Technology and learning would advance continuously. The Mediterranean would remain a unified economic zone. Christianity might develop differently. The world might have industrialized centuries earlier. Political borders would be unrecognizable.`,
      visuals: ['https://via.placeholder.com/300x200?text=Modern+Rome'],
    },
    {
      id: 3,
      question: 'What if photosynthesis was 10x more efficient?',
      topic: 'Biology',
      difficulty: 'Medium',
      explanation: `Plants would consume CO₂ from the atmosphere 10x faster. Climate change would reverse rapidly. Plants would need less sunlight and could grow in darker environments. Crops would need much less water. The entire food chain would shift - herbivores would have abundant food. Oxygen levels would spike. It would be a game-changer for civilization.`,
      visuals: ['https://via.placeholder.com/300x200?text=Super+Plants'],
    },
    {
      id: 4,
      question: 'What if light moved slower?',
      topic: 'Physics',
      difficulty: 'Hard',
      explanation: `If light traveled at, say, 1 meter per second instead of 299,792,458 m/s, the universe would be completely different. Time dilation effects would be visible to the naked eye. Relativity would affect everyday objects. GPS and electronics wouldn't work. Communication would be impossible. We'd perceive time differently. The very fabric of reality would change.`,
      visuals: ['https://via.placeholder.com/300x200?text=Slow+Light'],
    },
  ];

  const handleRunSimulation = (scenario) => {
    setSelectedScenario(scenario);
    setSimulationRunning(true);
    setTimeout(() => setSimulationRunning(false), 2000);
  };

  return (
    <div className="whatif-container">
      <h2>🔮 What-If Simulator</h2>
      <p className="whatif-intro">
        Explore mind-bending scenarios. See how changing one variable changes
        everything.
      </p>

      <div className="scenarios-grid">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="scenario-card"
            onClick={() => handleRunSimulation(scenario)}
          >
            <div className="scenario-header">
              <h3>{scenario.question}</h3>
              <span className="difficulty-badge">{scenario.difficulty}</span>
            </div>
            <p className="scenario-topic">{scenario.topic}</p>
            <div className="scenario-cta">Explore →</div>
          </div>
        ))}
      </div>

      {/* Simulation Display */}
      {selectedScenario && (
        <div className="simulation-modal">
          <button className="modal-close" onClick={() => setSelectedScenario(null)}>
            ✕
          </button>

          <div className="simulation-content">
            <h2>{selectedScenario.question}</h2>

            {simulationRunning && (
              <div className="simulation-loading">
                <div className="loader"></div>
                <p>Simulating scenario...</p>
              </div>
            )}

            {!simulationRunning && (
              <>
                <div className="simulation-visuals">
                  {selectedScenario.visuals.map((visual, idx) => (
                    <div
                      key={idx}
                      className="visual-box"
                      style={{
                        background: `linear-gradient(135deg, ${['#667eea', '#764ba2', '#1D9E75', '#FF6B6B'][idx % 4]} 0%, #F5F5F5 100%)`,
                      }}
                    >
                      <p>Scenario Visualization</p>
                    </div>
                  ))}
                </div>

                <div className="simulation-explanation">
                  <h3>What Happens?</h3>
                  <p>{selectedScenario.explanation}</p>
                </div>

                <div className="simulation-actions">
                  <button className="btn-deep-dive">
                    🔬 Deep Dive into Physics
                  </button>
                  <button className="btn-compare">📊 Compare Scenarios</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="whatif-note">
        <p>💡 <strong>Why This Works:</strong> "What-If" scenarios trigger curiosity and make learning interactive. You're not just memorizing facts; you're exploring consequences.</p>
      </div>
    </div>
  );
}

export default WhatIfSimulator;