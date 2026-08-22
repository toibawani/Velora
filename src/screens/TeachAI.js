import React, { useState } from 'react';
import '../styles/Components.css';

function TeachAI({ topic, subject, onBack, studentLevel }) {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: `Hi! I'm learning from you today! 🤖\n\nPlease explain "${topic.name}" to me. You can:\n• Define the concept\n• Give examples\n• Explain why it matters\n\nTake your time, I'm here to learn! 📚`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add student message
    setMessages([...messages, { type: 'student', text: input }]);
    setInput('');
    setIsEvaluating(true);

    // Simulate AI evaluation
    setTimeout(() => {
      const responses = [
        `That's a great explanation! 👏 I especially liked how you mentioned the practical application. Can you elaborate more on the mathematical side?`,
        `Excellent! You clearly understand this well. One question: How does this concept connect to what you learned in the previous chapter?`,
        `Very good! Your explanation was clear and comprehensive. Now, can you think of a real-world example where this would fail or not apply?`,
        `Brilliant explanation! 🌟 You really understand the nuances here. Let me challenge you: How would you explain this to a 10-year-old?`,
        `Good start! You got the core idea, but let me ask: What about edge cases or exceptions to this rule?`,
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [...prev, { type: 'ai', text: randomResponse }]);
      setIsEvaluating(false);
    }, 1500);
  };

  return (
    <div className="learn-container">
      <div className="learn-header">
        <button className="learn-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>🤖 Teach AI</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="teach-ai-container">
        <div className="teach-ai-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <div className="message-avatar">
                {msg.type === 'ai' ? '🤖' : '👤'}
              </div>
              <div className="message-content">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {isEvaluating && (
            <div className="message ai">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <p className="typing">AI is thinking... 💭</p>
              </div>
            </div>
          )}
        </div>

        <div className="teach-ai-input">
          <input
            type="text"
            placeholder="Share your understanding..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} disabled={isEvaluating}>
            Send ➤
          </button>
        </div>
        <div className="tool-card" onClick={() => setCurrentView('whiteboard')}>
  <span className="tool-icon">✨</span>
  <h4>AI Whiteboard</h4>
  <p>Visual explanations</p>
</div>

<div className="tool-card" onClick={() => setCurrentView('creator')}>
  <span className="tool-icon">🎨</span>
  <h4>Creator Studio</h4>
  <p>Create content</p>
</div>

        <div className="teaching-tips">
          <p>💡 Tip: The more detailed you are, the better AI can help!</p>
        </div>
      </div>
    </div>
  );
}

export default TeachAI;