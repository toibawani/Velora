import React, { useState } from 'react';
import '../styles/Doubts.css';

function Doubts({ setScreen }) {
  const [activeTab, setActiveTab] = useState('my-doubts');
  const [newDoubt, setNewDoubt] = useState('');
  const [userCoins, setUserCoins] = useState(450); // Virtual currency

  const myDoubts = [
    {
      id: 1,
      question: "What's the difference between event horizon and singularity?",
      topic: "Black Holes",
      bounty: 50,
      answers: 3,
      bestAnswer: {
        author: "Physics_Master",
        reputation: 245,
        content: "Event horizon is the boundary... singularity is the center...",
        upvotes: 87,
        reward: 50,
        claimed: true
      },
      status: 'answered'
    },
    {
      id: 2,
      question: "How do I solve this relativity problem?",
      topic: "Special Relativity",
      bounty: 75,
      answers: 1,
      status: 'open'
    },
  ];

  const topDoubtAnswerers = [
    { name: "Physics_Master", reputation: 245, answers: 67, earnings: 2340 },
    { name: "Einstein_Fan", reputation: 198, answers: 52, earnings: 1890 },
    { name: "Concept_Guru", reputation: 156, answers: 41, earnings: 1450 },
  ];

  return (
    <div className="doubts-page">
      <header className="doubts-header">
        <div className="container">
          <h1>💬 Doubt Bounty System</h1>
          <div className="header-right">
            <div className="coins-display">
              <span className="coin-icon">💎</span>
              <span className="coin-amount">{userCoins} coins</span>
            </div>
            <button className="btn btn-primary" onClick={() => setScreen('dashboard')}>
              ← Back
            </button>
          </div>
        </div>
      </header>

      <main className="container doubts-main">
        {/* How it works */}
        <div className="how-it-works">
          <h3>🎯 How Doubt Bounty Works</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <p><strong>Ask a doubt</strong> and offer coins as bounty</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p><strong>Community answers</strong> your question</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p><strong>You reward</strong> the best answer</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <p><strong>Answerer gets coins</strong> + reputation</p>
            </div>
          </div>
        </div>

        {/* Post New Doubt */}
        <div className="post-doubt-section">
          <h3>📝 Post a Doubt</h3>
          <div className="post-form">
            <select style={{ marginBottom: '1rem', padding: '10px', borderRadius: '8px', border: '1px solid #D3D1C7', width: '100%' }}>
              <option>Select Topic</option>
              <option>Black Holes</option>
              <option>Quantum Mechanics</option>
              <option>Special Relativity</option>
              <option>General Relativity</option>
            </select>
            <textarea
              placeholder="Describe your doubt in detail..."
              value={newDoubt}
              onChange={(e) => setNewDoubt(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #D3D1C7',
                marginBottom: '1rem',
                fontFamily: 'inherit',
                minHeight: '120px'
              }}
            />
            <div className="bounty-selector">
              <label>Bounty (coins):</label>
              <div className="bounty-options">
                {[25, 50, 75, 100].map((amount) => (
                  <button key={amount} className="bounty-btn">
                    {amount}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Post Doubt with Bounty
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="doubts-tabs">
          <button
            className={`tab ${activeTab === 'my-doubts' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-doubts')}
          >
            My Doubts ({myDoubts.length})
          </button>
          <button
            className={`tab ${activeTab === 'top-answerers' ? 'active' : ''}`}
            onClick={() => setActiveTab('top-answerers')}
          >
            Top Answerers
          </button>
          <button
            className={`tab ${activeTab === 'open-bounties' ? 'active' : ''}`}
            onClick={() => setActiveTab('open-bounties')}
          >
            Open Bounties
          </button>
        </div>

        {/* My Doubts */}
        {activeTab === 'my-doubts' && (
          <div className="doubts-list">
            {myDoubts.map((doubt) => (
              <div key={doubt.id} className={`doubt-card ${doubt.status}`}>
                <div className="doubt-header">
                  <h3>{doubt.question}</h3>
                  <span className={`status-badge ${doubt.status}`}>
                    {doubt.status === 'answered' ? '✅ Answered' : '🔴 Open'}
                  </span>
                </div>
                <p className="doubt-topic">📚 {doubt.topic}</p>
                <div className="doubt-stats">
                  <span>💎 {doubt.bounty} coins bounty</span>
                  <span>💬 {doubt.answers} answers</span>
                </div>

                {doubt.bestAnswer && (
                  <div className="best-answer">
                    <div className="answer-header">
                      <div className="answerer-info">
                        <h4>{doubt.bestAnswer.author}</h4>
                        <p>Reputation: {doubt.bestAnswer.reputation}</p>
                      </div>
                      <span className="best-badge">⭐ Best Answer</span>
                    </div>
                    <p className="answer-content">{doubt.bestAnswer.content}</p>
                    <div className="answer-footer">
                      <span className="upvotes">👍 {doubt.bestAnswer.upvotes}</span>
                      <span className="reward">💎 +{doubt.bestAnswer.reward} earned</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Top Answerers */}
        {activeTab === 'top-answerers' && (
          <div className="top-answerers-list">
            {topDoubtAnswerers.map((answerer, idx) => (
              <div key={idx} className="answerer-card">
                <div className="rank">{idx + 1}</div>
                <div className="answerer-info">
                  <h3>{answerer.name}</h3>
                  <p>⭐ Reputation: {answerer.reputation}</p>
                  <p>💬 {answerer.answers} answers</p>
                </div>
                <div className="answerer-earnings">
                  <p className="earnings-amount">₹{answerer.earnings}</p>
                  <p className="earnings-label">earned this month</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Open Bounties */}
        {activeTab === 'open-bounties' && (
          <div className="open-bounties">
            <p style={{ color: '#888780', marginBottom: '2rem' }}>🔥 Help others and earn coins!</p>
            <div className="bounty-card">
              <h3>What causes gravitational lensing?</h3>
              <p className="bounty-topic">📚 General Relativity</p>
              <div className="bounty-footer">
                <span className="bounty-reward">💎 100 coins</span>
                <button className="btn btn-primary">Answer Now</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Doubts;