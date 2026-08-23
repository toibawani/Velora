import React, { useState } from 'react';
import '../styles/Community.css';

/**
 * Community Screen — Integrated Discussions in Learning
 *
 * Real intellectual discourse integrated directly into the learning experience:
 * - Anonymous "Shadow Learning" discussions per topic (vote on clearest explanations)
 * - Live learning rooms with active learner counts and topic threads
 * - Pinned expert responses to clarify common conceptual misconceptions
 */

const DISCUSSIONS = [
  {
    id: 'd1',
    topic: 'Black Holes & Spacetime',
    question: 'Why doesn\'t the event horizon feel special to a falling observer, but feels extreme to an outside observer?',
    votes: 242,
    author: '🌑 Anonymous Scholar',
    timeAgo: '3h ago',
    preview: 'The key is that physical laws are always local — in a small enough region near the horizon, spacetime is approximately flat...',
    expertVerified: true,
    upvotedByYou: false,
    subject: 'physics'
  },
  {
    id: 'd2',
    topic: 'General Relativity',
    question: 'Can space itself expand faster than light? And does that violate Einstein\'s speed limit?',
    votes: 187,
    author: '⚛️ Anonymous Inquirer',
    timeAgo: '6h ago',
    preview: 'This is one of the most beautiful misconceptions in cosmology. Einsteins speed limit applies to objects MOVING THROUGH space, not to spacetime expansion itself...',
    expertVerified: true,
    upvotedByYou: false,
    subject: 'physics'
  },
  {
    id: 'd3',
    topic: 'Socratic Philosophy',
    question: 'Socrates says he "knows that he knows nothing" — but is this actually a claim to knowledge itself?',
    votes: 134,
    author: '🏛️ Anonymous Thinker',
    timeAgo: '12h ago',
    preview: 'There\'s a beautiful paradox here: if Socrates truly knows nothing, he cannot know that he knows nothing. This is known as the paradox of the knowledgeable ignoramus...',
    expertVerified: false,
    upvotedByYou: false,
    subject: 'philosophy'
  },
  {
    id: 'd4',
    topic: 'Quantum Mechanics',
    question: 'Is Schrödinger\'s Cat really "both alive and dead" or is that just a bad metaphor for superposition?',
    votes: 311,
    author: '🔬 Anonymous Physicist',
    timeAgo: '1d ago',
    preview: 'Schrödinger designed this thought experiment to show how ABSURD the Copenhagen Interpretation becomes at macro scales. He was mocking the idea, not endorsing it...',
    expertVerified: true,
    upvotedByYou: false,
    subject: 'physics'
  }
];

const ROOMS = [
  { id: 1, name: 'Black Holes & Singularities', members: 234, active: 18, desc: 'Gravitational physics, Penrose diagrams, tidal forces', unread: 3 },
  { id: 2, name: 'Quantum Mechanics Lab', members: 456, active: 41, desc: 'Wave-particle duality, entanglement, decoherence', unread: 0 },
  { id: 3, name: 'Ancient Philosophy Circle', members: 189, active: 9, desc: 'Plato, Aristotle, Stoicism, Episteme vs. Doxa', unread: 5 },
  { id: 4, name: 'Mathematics & Proofs', members: 1024, active: 88, desc: 'Formal logic, set theory, topology', unread: 12 },
];

function Community({ setScreen }) {
  const [tab, setTab] = useState('discussions');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [discussions, setDiscussions] = useState(DISCUSSIONS);
  const [newQuestion, setNewQuestion] = useState('');

  const filtered = subjectFilter === 'all'
    ? discussions
    : discussions.filter(d => d.subject === subjectFilter);

  const handleUpvote = (id) => {
    setDiscussions(prev => prev.map(d =>
      d.id === id
        ? { ...d, votes: d.upvotedByYou ? d.votes - 1 : d.votes + 1, upvotedByYou: !d.upvotedByYou }
        : d
    ));
  };

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return;
    const newD = {
      id: `d${Date.now()}`,
      topic: 'Your Question',
      question: newQuestion.trim(),
      votes: 0,
      author: '👤 You (Anonymous)',
      timeAgo: 'Just now',
      preview: '',
      expertVerified: false,
      upvotedByYou: false,
      subject: 'physics'
    };
    setDiscussions(prev => [newD, ...prev]);
    setNewQuestion('');
  };

  return (
    <div className="community-page">
      {/* Nav Header */}
      <header className="community-nav-header">
        <button className="comm-back-btn" onClick={() => setScreen('universe')}>
          ← Back to Universe
        </button>
        <h1 className="comm-title">Learning Community</h1>
        <div style={{ width: '80px' }}></div>
      </header>

      <main className="community-main-body">
        {/* Tab Switcher */}
        <div className="comm-tabs-row">
          <button
            className={`comm-tab-btn ${tab === 'discussions' ? 'active' : ''}`}
            onClick={() => setTab('discussions')}
          >
            💬 Anonymous Discussions
          </button>
          <button
            className={`comm-tab-btn ${tab === 'rooms' ? 'active' : ''}`}
            onClick={() => setTab('rooms')}
          >
            🏫 Study Rooms
          </button>
        </div>

        {/* ===== DISCUSSIONS TAB ===== */}
        {tab === 'discussions' && (
          <div className="discussions-layout">
            {/* Subject Filter + Ask Box */}
            <div className="discussions-controls">
              <div className="subject-filter-row">
                {['all', 'physics', 'philosophy', 'history', 'mathematics'].map(s => (
                  <button
                    key={s}
                    className={`filter-pill ${subjectFilter === s ? 'active' : ''}`}
                    onClick={() => setSubjectFilter(s)}
                  >
                    {s === 'all' ? 'All Topics' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              {/* Anonymous Question Submission */}
              <div className="ask-question-box">
                <span className="ask-anon-tag">Anonymous Mode On</span>
                <textarea
                  className="ask-textarea"
                  rows="2"
                  placeholder="Ask a conceptual question anonymously — no identity attached..."
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                />
                <button className="ask-submit-btn" onClick={handleSubmitQuestion}>
                  Post Question →
                </button>
              </div>
            </div>

            {/* Discussion Cards */}
            <div className="discussion-cards-stack">
              {filtered.map(d => (
                <div key={d.id} className="discussion-card">
                  <div className="disc-card-top-row">
                    <span className="disc-topic-tag">{d.topic}</span>
                    {d.expertVerified && (
                      <span className="expert-verified-badge">✓ Expert Verified</span>
                    )}
                    <span className="disc-time-ago">{d.timeAgo}</span>
                  </div>

                  <h3 className="disc-question">{d.question}</h3>

                  {d.preview && (
                    <p className="disc-preview-snippet">"{d.preview}"</p>
                  )}

                  <div className="disc-card-footer">
                    <span className="disc-author">{d.author}</span>
                    <button
                      className={`upvote-btn ${d.upvotedByYou ? 'upvoted' : ''}`}
                      onClick={() => handleUpvote(d.id)}
                    >
                      ▲ {d.votes} clearest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== STUDY ROOMS TAB ===== */}
        {tab === 'rooms' && (
          <div className="rooms-grid">
            {ROOMS.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-live-indicator">
                  <span className="live-dot"></span>
                  <span className="live-count">{room.active} active now</span>
                </div>
                <h3 className="room-name">{room.name}</h3>
                <p className="room-desc">{room.desc}</p>
                <div className="room-footer-row">
                  <span className="room-members">{room.members.toLocaleString()} scholars</span>
                  <button className="room-join-btn" onClick={() => setTab('discussions')}>
                    Enter Room →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Community;