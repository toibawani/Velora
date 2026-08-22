import React, { useState } from 'react';
import '../styles/ShadowLearning.css';

function ShadowLearning({ topic }) {
  const [myNote, setMyNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [anonymousNotes, setAnonymousNotes] = useState([
    {
      id: 1,
      text: 'Photosynthesis is plants eating sunlight and turning it into sugar. Sun → Energy → Food',
      votes: { clear: 145, funny: 8, memorable: 92 },
      author: 'Anonymous #42',
    },
    {
      id: 2,
      text: 'Its basically the opposite of respiration but with light instead of food',
      votes: { clear: 89, funny: 12, memorable: 56 },
      author: 'Anonymous #15',
    },
    {
      id: 3,
      text: 'Plants are solar panels that make candy with CO2 and water. They are very greedy.',
      votes: { clear: 234, funny: 156, memorable: 198 },
      author: 'Anonymous #7',
    },
  ]);

  const handleSubmitNote = () => {
    if (myNote.trim().length < 20) {
      alert('Make it at least 20 characters (aim for 1 sentence!)');
      return;
    }

    setAnonymousNotes([
      ...anonymousNotes,
      {
        id: anonymousNotes.length + 1,
        text: myNote,
        votes: { clear: 0, funny: 0, memorable: 0 },
        author: `You (Anonymous)`,
      },
    ]);

    setSubmitted(true);
    setMyNote('');

    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleVote = (noteId, voteType) => {
    setAnonymousNotes(
      anonymousNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              votes: {
                ...note.votes,
                [voteType]: note.votes[voteType] + 1,
              },
            }
          : note
      )
    );
  };

  const topNote = [...anonymousNotes].sort(
    (a, b) =>
      b.votes.clear +
      b.votes.funny +
      b.votes.memorable -
      (a.votes.clear + a.votes.funny + a.votes.memorable)
  )[0];

  return (
    <div className="shadow-learning-container">
      <h2>👥 Community Notes: {topic?.name}</h2>

      {/* Explain it to a 10-year-old */}
      <div className="my-note-section">
        <h3>📝 Your Turn to Teach</h3>
        <p className="challenge">
          Explain <strong>{topic?.name}</strong> in ONE sentence to a 10-year-old.
          Keep it simple, clear, and memorable!
        </p>
        <textarea
          placeholder="Example: 'Plants eat sunlight and turn it into food...'  (Make it creative!)"
          value={myNote}
          onChange={(e) => setMyNote(e.target.value)}
          className="note-input-shadow"
          maxLength="280"
        />
        <div className="note-meta">
          <span className="char-count">{myNote.length}/280</span>
          <button
            className={`btn-submit-note ${submitted ? 'submitted' : ''}`}
            onClick={handleSubmitNote}
          >
            {submitted ? '✅ Submitted!' : '🚀 Submit Note'}
          </button>
        </div>
      </div>

      {/* Community Votes */}
      <div className="community-notes">
        <h3>🏆 Best Notes</h3>

        {/* Top Voted */}
        {topNote && (
          <div className="top-note">
            <div className="badge">⭐ Most Helpful</div>
            <p className="note-text">"{topNote.text}"</p>
            <div className="note-votes">
              <span className="vote-count">
                💡 Clear: {topNote.votes.clear}
              </span>
              <span className="vote-count">
                😄 Funny: {topNote.votes.funny}
              </span>
              <span className="vote-count">
                🧠 Memorable: {topNote.votes.memorable}
              </span>
            </div>
          </div>
        )}

        {/* All Notes */}
        <div className="notes-list">
          {anonymousNotes
            .sort(
              (a, b) =>
                b.votes.clear +
                b.votes.funny +
                b.votes.memorable -
                (a.votes.clear + a.votes.funny + a.votes.memorable)
            )
            .map((note) => (
              <div key={note.id} className="note-item">
                <p className="note-text">"{note.text}"</p>
                <div className="note-voting">
                  <button
                    className="vote-btn clear"
                    onClick={() => handleVote(note.id, 'clear')}
                  >
                    💡 Clear ({note.votes.clear})
                  </button>
                  <button
                    className="vote-btn funny"
                    onClick={() => handleVote(note.id, 'funny')}
                  >
                    😄 Funny ({note.votes.funny})
                  </button>
                  <button
                    className="vote-btn memorable"
                    onClick={() => handleVote(note.id, 'memorable')}
                  >
                    🧠 Memorable ({note.votes.memorable})
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="shadow-note">
        <p>🎓 <strong>Why Anonymity?</strong> Removes ego and fear of being wrong. You learn faster when competing to explain simply, not to show off.</p>
      </div>
    </div>
  );
}

export default ShadowLearning;