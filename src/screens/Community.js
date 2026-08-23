import React, { useState, useMemo } from 'react';
import '../styles/Community.css';

/**
 * Community Screen — Shared Interest Discussion Rooms & Safe Peer Learning
 * 
 * Features:
 * - Clean, distraction-free Twitter/X-style feed & discussion threads
 * - Subject-specific active rooms & live learner counters
 * - Lightweight client-side safety & moderation checks (spam/toxicity filter)
 * - Thread reply expansions & verified academic badge system
 */

const INITIAL_DISCUSSIONS = [
  {
    id: 'd1',
    roomId: 'room-1',
    topic: 'Black Holes & Spacetime',
    question: 'Why does the event horizon feel unexceptional to a freely falling observer, but appears extreme to an outside observer?',
    votes: 242,
    author: 'Scholar_409',
    authorRole: 'Peer Contributor',
    timeAgo: '3h ago',
    preview: 'The equivalence principle guarantees that physical laws are strictly local. In a sufficiently small frame falling through the horizon, curvature tidal forces are finite, making local physics indistinguishable from flat spacetime.',
    expertVerified: true,
    upvotedByYou: false,
    subject: 'physics',
    repliesCount: 14,
    replies: [
      {
        id: 'r1-1',
        author: 'RelativityTutor',
        role: 'Verified Mentor',
        timeAgo: '2h ago',
        content: 'Exactly right. The apparent singularity at r = 2M in Schwarzschild coordinates is a coordinate artifact, completely removable in Eddington-Finkelstein or Kruskal coordinates.'
      }
    ]
  },
  {
    id: 'd2',
    roomId: 'room-1',
    topic: 'General Relativity',
    question: 'Can metric expansion of space exceed the speed of light without violating Lorentz invariance?',
    votes: 187,
    author: 'CosmoStudent',
    authorRole: 'Learner',
    timeAgo: '6h ago',
    preview: 'Special relativity imposes c as the upper speed limit for information transfer *through* spacetime, whereas cosmic expansion is the dilation of metric geometry itself.',
    expertVerified: true,
    upvotedByYou: false,
    subject: 'physics',
    repliesCount: 8,
    replies: []
  },
  {
    id: 'd3',
    roomId: 'room-3',
    topic: 'Socratic Epistemology',
    question: 'Socrates asserts "I know that I know nothing" — does this formulate an epistemic self-refutation?',
    votes: 134,
    author: 'DialecticMind',
    authorRole: 'Philosophy Scholar',
    timeAgo: '12h ago',
    preview: 'In the original Greek (Plato’s Apology 21d), Socrates clarifies he does not claim absolute omniscience, but rather recognizes the boundaries of his own epistemic justification.',
    expertVerified: false,
    upvotedByYou: false,
    subject: 'philosophy',
    repliesCount: 6,
    replies: []
  },
  {
    id: 'd4',
    roomId: 'room-2',
    topic: 'Quantum Mechanics',
    question: 'Is Schrödinger’s Cat meant to defend superposition or satirize macro-indeterminacy in Copenhagen mechanics?',
    votes: 311,
    author: 'WaveFunction',
    authorRole: 'Verified Mentor',
    timeAgo: '1d ago',
    preview: 'Schrödinger formulated the paradox in 1935 explicitly as a reductio ad absurdum to highlight the measurement problem before decoherence theory was developed.',
    expertVerified: true,
    upvotedByYou: false,
    subject: 'physics',
    repliesCount: 22,
    replies: []
  }
];

const ROOMS = [
  { id: 'room-1', name: 'Black Holes & Gravitation', members: 1240, active: 38, desc: 'Penrose diagrams, geodesics, Kerr metric, and horizon physics', subject: 'physics' },
  { id: 'room-2', name: 'Quantum Information & Waves', members: 2150, active: 64, desc: 'State vectors, entanglement, measurement theory, and Hilbert space', subject: 'physics' },
  { id: 'room-3', name: 'Classical & Modern Epistemology', members: 890, active: 19, desc: 'Socratic dialogue, rationalism, empiricism, and falsification', subject: 'philosophy' },
  { id: 'room-4', name: 'Rigorous Mathematical Proofs', members: 3420, active: 112, desc: 'Real analysis, abstract algebra, discrete topologies, and set theory', subject: 'mathematics' }
];

// Lightweight client-side safety keywords for academic integrity & constructive discourse
const PROHIBITED_PATTERNS = [
  /\b(cheat|exam dump|test bank|leak)\b/i,
  /\b(hack|dox|hate|scam)\b/i
];

function Community({ setScreen }) {
  const [tab, setTab] = useState('discussions'); // 'discussions' | 'rooms'
  const [activeRoomFilter, setActiveRoomFilter] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [expandedDiscussionId, setExpandedDiscussionId] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [moderationNotice, setModerationNotice] = useState(null);
  const [flaggedIds, setFlaggedIds] = useState(new Set());

  // Filtered thread listing
  const filteredDiscussions = useMemo(() => {
    return discussions.filter(d => {
      if (activeRoomFilter && d.roomId !== activeRoomFilter) return false;
      if (subjectFilter !== 'all' && d.subject !== subjectFilter) return false;
      return true;
    });
  }, [discussions, activeRoomFilter, subjectFilter]);

  const handleUpvote = (id) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id !== id) return d;
      return {
        ...d,
        votes: d.upvotedByYou ? d.votes - 1 : d.votes + 1,
        upvotedByYou: !d.upvotedByYou
      };
    }));
  };

  const validatePostContent = (text) => {
    if (text.trim().length < 15) {
      return 'Questions must be at least 15 characters to foster high-depth discussion.';
    }
    for (const pattern of PROHIBITED_PATTERNS) {
      if (pattern.test(text)) {
        return 'Post contains keywords flagged by the Academic Integrity & Safety Filter.';
      }
    }
    return null;
  };

  const handlePostQuestion = (e) => {
    e.preventDefault();
    const safetyError = validatePostContent(newQuestion);
    if (safetyError) {
      setModerationNotice(safetyError);
      return;
    }

    setModerationNotice(null);
    const newThread = {
      id: `d-${Date.now()}`,
      roomId: activeRoomFilter || 'room-1',
      topic: `${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Inquiry`,
      question: newQuestion.trim(),
      votes: 1,
      author: 'Scholar_You',
      authorRole: 'Peer Contributor',
      timeAgo: 'Just now',
      preview: '',
      expertVerified: false,
      upvotedByYou: true,
      subject: selectedSubject,
      repliesCount: 0,
      replies: []
    };

    setDiscussions([newThread, ...discussions]);
    setNewQuestion('');
  };

  const handleAddReply = (discussionId) => {
    const text = replyInputs[discussionId] || '';
    if (!text.trim()) return;

    setDiscussions(prev => prev.map(d => {
      if (d.id !== discussionId) return d;
      const newReply = {
        id: `r-${Date.now()}`,
        author: 'Scholar_You',
        role: 'Peer Contributor',
        timeAgo: 'Just now',
        content: text.trim()
      };
      return {
        ...d,
        repliesCount: d.repliesCount + 1,
        replies: [...d.replies, newReply]
      };
    }));

    setReplyInputs(prev => ({ ...prev, [discussionId]: '' }));
  };

  const handleFlag = (id) => {
    setFlaggedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="community-page">
      {/* Top Header */}
      <header className="community-nav-header">
        <div className="comm-header-left">
          <button className="comm-back-btn" onClick={() => setScreen('universe')}>
            ← Back
          </button>
          <div className="comm-header-titles">
            <h1 className="comm-title">Academic Exchange</h1>
            <span className="comm-subtitle">High-signal peer discourse & research rooms</span>
          </div>
        </div>
        <div className="comm-safety-badge">
          <span className="safety-dot"></span>
          <span>Safety & Integrity Active</span>
        </div>
      </header>

      <main className="community-main-body">
        {/* Navigation & Room Tabs */}
        <div className="comm-top-bar">
          <div className="comm-tabs-row">
            <button
              className={`comm-tab-btn ${tab === 'discussions' ? 'active' : ''}`}
              onClick={() => { setTab('discussions'); setActiveRoomFilter(null); }}
            >
              Threads & Debates
            </button>
            <button
              className={`comm-tab-btn ${tab === 'rooms' ? 'active' : ''}`}
              onClick={() => setTab('rooms')}
            >
              Study Rooms ({ROOMS.length})
            </button>
          </div>

          {activeRoomFilter && (
            <div className="active-room-chip">
              <span>Room: {ROOMS.find(r => r.id === activeRoomFilter)?.name}</span>
              <button onClick={() => setActiveRoomFilter(null)} className="chip-remove-btn">×</button>
            </div>
          )}
        </div>

        {/* ===== DISCUSSIONS VIEW ===== */}
        {tab === 'discussions' && (
          <div className="discussions-layout">
            {/* Quick Topic Filter */}
            <div className="subject-filter-row">
              {['all', 'physics', 'philosophy', 'mathematics'].map(sub => (
                <button
                  key={sub}
                  className={`filter-pill ${subjectFilter === sub ? 'active' : ''}`}
                  onClick={() => setSubjectFilter(sub)}
                >
                  {sub === 'all' ? 'All Topics' : sub.charAt(0).toUpperCase() + sub.slice(1)}
                </button>
              ))}
            </div>

            {/* Composer Box (Clean Twitter/X style) */}
            <form className="ask-question-box" onSubmit={handlePostQuestion}>
              <div className="ask-header-row">
                <span className="ask-anon-tag">Verified Peer Posting</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="ask-subject-select"
                >
                  <option value="physics">Physics</option>
                  <option value="philosophy">Philosophy</option>
                  <option value="mathematics">Mathematics</option>
                </select>
              </div>

              <textarea
                className="ask-textarea"
                rows="3"
                placeholder="Pose an analytical question or conceptual paradox..."
                value={newQuestion}
                onChange={(e) => {
                  setNewQuestion(e.target.value);
                  if (moderationNotice) setModerationNotice(null);
                }}
              />

              {moderationNotice && (
                <div className="comm-alert-box">
                  ⚠️ {moderationNotice}
                </div>
              )}

              <div className="ask-footer-row">
                <span className="char-count-text">
                  {newQuestion.length}/500 chars
                </span>
                <button type="submit" className="ask-submit-btn" disabled={!newQuestion.trim()}>
                  Publish Thread
                </button>
              </div>
            </form>

            {/* Discussion Feed */}
            <div className="discussion-cards-stack">
              {filteredDiscussions.length === 0 ? (
                <div className="comm-empty-state">
                  <p>No active discussions found for this topic filter.</p>
                </div>
              ) : (
                filteredDiscussions.map(d => {
                  const isFlagged = flaggedIds.has(d.id);
                  const isExpanded = expandedDiscussionId === d.id;

                  if (isFlagged) {
                    return (
                      <div key={d.id} className="discussion-card flagged">
                        <span className="flagged-msg">This thread has been flagged for moderator review.</span>
                      </div>
                    );
                  }

                  return (
                    <article key={d.id} className="discussion-card">
                      <div className="disc-card-top-row">
                        <span className="disc-topic-tag">{d.topic}</span>
                        {d.expertVerified && (
                          <span className="expert-verified-badge">Peer Verified</span>
                        )}
                        <span className="disc-time-ago">{d.timeAgo}</span>
                      </div>

                      <h2 className="disc-question">{d.question}</h2>

                      {d.preview && (
                        <p className="disc-preview-snippet">{d.preview}</p>
                      )}

                      <div className="disc-card-footer">
                        <div className="disc-author-meta">
                          <span className="author-name">{d.author}</span>
                          <span className="author-dot">·</span>
                          <span className="author-role">{d.authorRole}</span>
                        </div>

                        <div className="disc-actions">
                          <button
                            type="button"
                            className={`upvote-btn ${d.upvotedByYou ? 'upvoted' : ''}`}
                            onClick={() => handleUpvote(d.id)}
                            aria-label="Upvote explanation"
                          >
                            ▲ {d.votes}
                          </button>

                          <button
                            type="button"
                            className="reply-toggle-btn"
                            onClick={() => setExpandedDiscussionId(isExpanded ? null : d.id)}
                          >
                            💬 {d.repliesCount} {d.repliesCount === 1 ? 'Reply' : 'Replies'}
                          </button>

                          <button
                            type="button"
                            className="flag-btn"
                            onClick={() => handleFlag(d.id)}
                            title="Report for safety review"
                          >
                            ⚐
                          </button>
                        </div>
                      </div>

                      {/* Thread Replies Section */}
                      {isExpanded && (
                        <div className="thread-replies-tray">
                          {d.replies && d.replies.length > 0 ? (
                            <div className="replies-list">
                              {d.replies.map(r => (
                                <div key={r.id} className="reply-item">
                                  <div className="reply-header">
                                    <span className="reply-author">{r.author}</span>
                                    <span className="reply-role-tag">{r.role}</span>
                                    <span className="reply-time">{r.timeAgo}</span>
                                  </div>
                                  <p className="reply-body">{r.content}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="no-replies-text">No responses yet. Be the first to contribute an answer.</p>
                          )}

                          <div className="reply-input-row">
                            <input
                              type="text"
                              className="reply-input"
                              placeholder="Write a concise academic response..."
                              value={replyInputs[d.id] || ''}
                              onChange={(e) => setReplyInputs({ ...replyInputs, [d.id]: e.target.value })}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleAddReply(d.id); }}
                            />
                            <button
                              type="button"
                              className="reply-submit-btn"
                              onClick={() => handleAddReply(d.id)}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ===== STUDY ROOMS VIEW ===== */}
        {tab === 'rooms' && (
          <div className="rooms-grid">
            {ROOMS.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-card-header">
                  <span className="room-subject-tag">{room.subject}</span>
                  <div className="room-live-indicator">
                    <span className="live-dot"></span>
                    <span className="live-count">{room.active} active now</span>
                  </div>
                </div>

                <h3 className="room-name">{room.name}</h3>
                <p className="room-desc">{room.desc}</p>

                <div className="room-footer-row">
                  <span className="room-members">{room.members.toLocaleString()} members</span>
                  <button
                    className="room-join-btn"
                    onClick={() => {
                      setActiveRoomFilter(room.id);
                      setTab('discussions');
                    }}
                  >
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