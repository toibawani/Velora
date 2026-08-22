import React, { useState } from 'react';
import '../styles/Components.css';

function ContextDoubtSolver({ topic, subject, studentLevel, onBack }) {
  const [doubt, setDoubt] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = () => {
    if (!doubt.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const responses = {
        beginner: `Let me explain in simple terms! 👶\n\nFor someone at your level, think of it like this:\nImagine you're pushing a box across the floor.\n\nKey points:\n• Force is the push or pull\n• Bigger force = faster movement\n• Direction matters too!`,
        intermediate: `Great question! 🤔\n\nYou already know about Newton's Laws, so let's build on that.\n\nThis concept works because the underlying physics shows that acceleration depends on force and mass.\n\nThis connects to ${topic?.name} because both involve understanding how objects move.`,
        advanced: `Excellent critical thinking! 🧠\n\nLet's dive deep into the mathematics:\n\nF = ma (Newton's Second Law)\nWhere force causes acceleration inversely proportional to mass.\n\nProof: Using calculus, dp/dt = F\n\nEdge cases: At relativistic speeds, this breaks down.`,
      };

      setAnswer(
        responses[studentLevel] || responses.intermediate
      );
      setLoading(false);
      setDoubt('');
    }, 1500);
  };

  return (
    <div className="learn-container">
      <div className="learn-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>💡 Ask Anything</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="doubt-solver-container">
        <div className="doubt-info">
          <p className="context-info">
            🎯 Solving for: <strong>{topic?.name}</strong>
          </p>
          <p className="level-info">
            📊 Your level: <strong>{studentLevel}</strong>
          </p>
        </div>

        <div className="doubt-input-section">
          <h2>What's your doubt?</h2>
          <textarea
            placeholder="Ask anything... The AI will adapt to your level and learning context."
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            rows={4}
          />
          <button
            className="btn-ask"
            onClick={handleAsk}
            disabled={loading || !doubt.trim()}
          >
            {loading ? 'Thinking... 🤔' : 'Ask AI →'}
          </button>
        </div>

        {answer && (
          <div className="doubt-answer">
            <h3>AI Response</h3>
            <div className="answer-content">
              {answer.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
            <div className="answer-actions">
              <button className="btn-helpful">👍 Helpful</button>
              <button className="btn-more">More details →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContextDoubtSolver;