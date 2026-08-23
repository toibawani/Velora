import React, { useState } from 'react';
import '../styles/Doubts.css';

/**
 * Academic Inquiry & Peer Review Resolver (Doubts)
 * 
 * High-signal student discourse where learners post conceptual questions
 * with peer reward tokens and verified academic solutions.
 */

const INITIAL_DOUBTS = [
  {
    id: 1,
    question: "Why is the coordinate singularity at r = 2M in Schwarzschild metric not a physical singularity?",
    topic: "General Relativity",
    bounty: 50,
    answers: 3,
    bestAnswer: {
      author: "Relativity_Mentor",
      reputation: 980,
      content: "The Kretschmann scalar R^{abcd}R_{abcd} = 48M^2/r^6 remains perfectly finite at r = 2M. This proves the apparent divergence is merely a deficiency of Schwarzschild coordinates, easily resolved by switching to Eddington-Finkelstein or Kruskal-Szekeres coordinates.",
      upvotes: 87,
      reward: 50,
      claimed: true
    },
    status: 'answered'
  },
  {
    id: 2,
    question: "How does the phase velocity of a de Broglie matter wave exceed c without violating special relativity?",
    topic: "Quantum Mechanics",
    bounty: 75,
    answers: 1,
    status: 'open'
  },
];

const TOP_MENTORS = [
  { name: "Relativity_Mentor", domain: "Gravitational Physics", reputation: 980, answers: 67, peerTokens: 2340 },
  { name: "QuantumPioneer", domain: "Quantum State Mechanics", reputation: 840, answers: 52, peerTokens: 1890 },
  { name: "EpistemeScholar", domain: "Formal Logic & Philosophy", reputation: 710, answers: 41, peerTokens: 1450 },
];

function Doubts({ setScreen }) {
  const [activeTab, setActiveTab] = useState('my-doubts');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Physics');
  const [selectedBounty, setSelectedBounty] = useState(50);
  const [userCoins, setUserCoins] = useState(450);
  const [doubtsList, setDoubtsList] = useState(INITIAL_DOUBTS);

  const handlePostInquiry = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim() || userCoins < selectedBounty) return;

    const newInquiry = {
      id: Date.now(),
      question: newQuestionText.trim(),
      topic: selectedTopic,
      bounty: selectedBounty,
      answers: 0,
      status: 'open'
    };

    setDoubtsList([newInquiry, ...doubtsList]);
    setUserCoins(prev => prev - selectedBounty);
    setNewQuestionText('');
  };

  return (
    <div className="doubts-console">
      {/* Top Navbar */}
      <header className="doubts-navbar">
        <div className="doubts-nav-left">
          <button className="doubts-back-btn" onClick={() => setScreen('universe')}>
            ← Back
          </button>
          <div className="doubts-title-col">
            <h1 className="doubts-title">Academic Inquiry & Peer Review</h1>
            <span className="doubts-sub">Precision concept debugging with peer token bounties</span>
          </div>
        </div>
        <div className="doubts-tokens-pill">
          <span className="token-icon">💎</span>
          <span>{userCoins} Peer Tokens</span>
        </div>
      </header>

      <main className="doubts-main-layout">
        {/* Post Inquiry Composer */}
        <section className="doubts-card composer-card">
          <div className="composer-header-row">
            <h2 className="card-heading">Post a Conceptual Inquiry</h2>
            <span className="composer-caption">Offers token bounty to community mentors</span>
          </div>

          <form onSubmit={handlePostInquiry} className="inquiry-form">
            <div className="form-fields-row">
              <select
                className="inquiry-topic-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="Physics">General & Relativistic Physics</option>
                <option value="Quantum Mechanics">Quantum Mechanics & Waves</option>
                <option value="Philosophy">Epistemology & Logic</option>
                <option value="Mathematics">Mathematical Proofs & Calculus</option>
              </select>

              <div className="bounty-picker-row">
                <span className="bounty-label">Bounty:</span>
                {[25, 50, 75, 100].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`bounty-chip ${selectedBounty === amount ? 'active' : ''}`}
                    onClick={() => setSelectedBounty(amount)}
                  >
                    💎 {amount}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="inquiry-textarea"
              rows="3"
              placeholder="State your analytical question or the point where derivation breaks down..."
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />

            <div className="form-footer-row">
              <span className="char-count">{newQuestionText.length}/400 chars</span>
              <button
                type="submit"
                className="inquiry-submit-btn"
                disabled={!newQuestionText.trim() || userCoins < selectedBounty}
              >
                Publish Inquiry (💎 {selectedBounty})
              </button>
            </div>
          </form>
        </section>

        {/* Tab Navigation */}
        <div className="doubts-tabs-row">
          <button
            className={`doubts-tab-btn ${activeTab === 'my-doubts' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-doubts')}
          >
            My Inquiries ({doubtsList.length})
          </button>
          <button
            className={`doubts-tab-btn ${activeTab === 'open-bounties' ? 'active' : ''}`}
            onClick={() => setActiveTab('open-bounties')}
          >
            Open Bounties
          </button>
          <button
            className={`doubts-tab-btn ${activeTab === 'top-mentors' ? 'active' : ''}`}
            onClick={() => setActiveTab('top-mentors')}
          >
            Top Academic Mentors
          </button>
        </div>

        {/* Tab 1: My Doubts */}
        {activeTab === 'my-doubts' && (
          <section className="inquiries-stream">
            {doubtsList.map((d) => (
              <article key={d.id} className="inquiry-card">
                <div className="inquiry-card-header">
                  <span className="inquiry-topic-tag">{d.topic}</span>
                  <span className={`status-indicator-tag ${d.status}`}>
                    {d.status === 'answered' ? '✓ Verified Solution' : '● Open Inquiry'}
                  </span>
                </div>

                <h3 className="inquiry-question">{d.question}</h3>

                <div className="inquiry-meta-row">
                  <span className="inquiry-bounty-val">💎 {d.bounty} Token Bounty</span>
                  <span className="inquiry-answers-count">💬 {d.answers} {d.answers === 1 ? 'Answer' : 'Answers'}</span>
                </div>

                {d.bestAnswer && (
                  <div className="verified-solution-box">
                    <div className="solution-head">
                      <div className="mentor-info">
                        <span className="mentor-name">{d.bestAnswer.author}</span>
                        <span className="mentor-badge">Verified Mentor</span>
                      </div>
                      <span className="solution-tag">★ Best Explanation</span>
                    </div>

                    <p className="solution-content">{d.bestAnswer.content}</p>

                    <div className="solution-footer">
                      <span className="upvotes-badge">▲ {d.bestAnswer.upvotes} verified</span>
                      <span className="claimed-badge">💎 {d.bestAnswer.reward} tokens awarded</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {/* Tab 2: Open Bounties */}
        {activeTab === 'open-bounties' && (
          <section className="inquiries-stream">
            <div className="inquiry-card">
              <div className="inquiry-card-header">
                <span className="inquiry-topic-tag">General Relativity</span>
                <span className="status-indicator-tag open">● Open Inquiry</span>
              </div>
              <h3 className="inquiry-question">How does gravitational lensing produce Einstein rings rather than simple focal points?</h3>
              <p className="inquiry-desc-preview">
                Looking for a rigorous optical derivation comparing geometric optics in curved spacetime with classical refraction.
              </p>
              <div className="inquiry-meta-row">
                <span className="inquiry-bounty-val">💎 100 Token Bounty</span>
                <button className="answer-cta-btn">Submit Formal Solution →</button>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Top Mentors */}
        {activeTab === 'top-mentors' && (
          <section className="mentors-grid">
            {TOP_MENTORS.map((m, i) => (
              <div key={i} className="mentor-card">
                <div className="mentor-rank-badge">#{i + 1}</div>
                <div className="mentor-details">
                  <h4 className="mentor-title">{m.name}</h4>
                  <span className="mentor-domain">{m.domain}</span>
                </div>
                <div className="mentor-stats-row">
                  <span className="stat-item">⭐ {m.reputation} Rep</span>
                  <span className="stat-item">💎 {m.peerTokens} Earned</span>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Doubts;