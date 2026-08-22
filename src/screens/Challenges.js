import React, { useState } from 'react';
import '../styles/Challenges.css';

function Challenges({ setScreen }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userChallenges, setUserChallenges] = useState({
    completed: 5,
    inProgress: 2,
    totalPoints: 3450
  });

  const challenges = [
    {
      id: 1,
      name: 'Black Holes Mastery',
      description: 'Learn 5 topics in Black Holes section and score 80%+ on quiz',
      difficulty: 'Medium',
      reward: 500,
      progress: 80,
      status: 'in-progress',
      timeLeft: '2 days',
      participants: 234,
      yourRank: 45
    },
    {
      id: 2,
      name: '7-Day Streak Champion',
      description: 'Study for 7 consecutive days without missing',
      difficulty: 'Easy',
      reward: 300,
      progress: 100,
      status: 'completed',
      participants: 1203,
      yourRank: 1
    },
    {
      id: 3,
      name: 'Quantum Master',
      description: 'Complete all Quantum Mechanics topics and score 90%',
      difficulty: 'Hard',
      reward: 800,
      progress: 45,
      status: 'in-progress',
      timeLeft: '5 days',
      participants: 156,
      yourRank: 23
    },
    {
      id: 4,
      name: 'Community Helper',
      description: 'Answer 10 doubts and get upvoted 50+ times',
      difficulty: 'Medium',
      reward: 600,
      progress: 60,
      status: 'in-progress',
      timeLeft: '3 days',
      participants: 89,
      yourRank: 12
    },
  ];

  return (
    <div className="challenges-page">
      <header className="challenges-header">
        <div className="container">
          <h1>🏆 Weekly Challenges</h1>
          <button className="btn btn-primary" onClick={() => setScreen('dashboard')}>
            ← Back
          </button>
        </div>
      </header>

      <main className="container challenges-main">
        {/* User Stats */}
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <p className="stat-label">Challenges Completed</p>
              <p className="stat-value">{userChallenges.completed}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <p className="stat-label">Active Challenges</p>
              <p className="stat-value">{userChallenges.inProgress}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <p className="stat-label">Total Points Earned</p>
              <p className="stat-value">{userChallenges.totalPoints}</p>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="challenges-grid">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className={`challenge-card ${challenge.status}`}
              onClick={() => setSelectedChallenge(challenge)}
            >
              <div className="challenge-header">
                <h3>{challenge.name}</h3>
                <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
                  {challenge.difficulty}
                </span>
              </div>

              <p className="challenge-description">{challenge.description}</p>

              <div className="progress-section">
                <div className="progress-label">
                  <span>Progress</span>
                  <span className="progress-value">{challenge.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${challenge.progress}%` }}></div>
                </div>
              </div>

              <div className="challenge-footer">
                <div className="challenge-info">
                  <span className="participants">👥 {challenge.participants}</span>
                  <span className="time-left">⏱️ {challenge.timeLeft}</span>
                </div>
                <span className="reward-badge">💎 +{challenge.reward}</span>
              </div>

              <button 
                className={`challenge-btn ${challenge.status}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedChallenge(challenge);
                }}
              >
                {challenge.status === 'completed' ? '✅ Completed' : 'Continue'}
              </button>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="leaderboard-section">
          <h2>🥇 Weekly Leaderboard</h2>
          <div className="leaderboard">
            {[
              { rank: 1, name: 'Arjun_Physics', points: 5420, challenges: 8 },
              { rank: 2, name: 'Priya_Scholar', points: 5100, challenges: 7 },
              { rank: 3, name: 'Rajesh_Pro', points: 4850, challenges: 7 },
              { rank: 4, name: 'You', points: userChallenges.totalPoints, challenges: userChallenges.completed + userChallenges.inProgress },
              { rank: 5, name: 'Sneha_Genius', points: 4200, challenges: 6 },
            ].map((entry) => (
              <div key={entry.rank} className={`leaderboard-entry ${entry.name === 'You' ? 'highlight' : ''}`}>
                <span className="rank">{entry.rank}</span>
                <span className="name">{entry.name}</span>
                <span className="points">{entry.points} pts</span>
                <span className="challenges">{entry.challenges} challenges</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="modal-overlay" onClick={() => setSelectedChallenge(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedChallenge(null)}>✕</button>
            <h2>{selectedChallenge.name}</h2>
            <p className="modal-description">{selectedChallenge.description}</p>
            
            <div className="modal-stats">
              <div className="modal-stat">
                <p>Difficulty</p>
                <p className={`difficulty-badge ${selectedChallenge.difficulty.toLowerCase()}`}>
                  {selectedChallenge.difficulty}
                </p>
              </div>
              <div className="modal-stat">
                <p>Reward</p>
                <p className="reward">💎 {selectedChallenge.reward} points</p>
              </div>
              <div className="modal-stat">
                <p>Your Rank</p>
                <p className="rank-text">#{selectedChallenge.yourRank} of {selectedChallenge.participants}</p>
              </div>
            </div>

            <div className="modal-progress">
              <p>Progress: {selectedChallenge.progress}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${selectedChallenge.progress}%` }}></div>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
              {selectedChallenge.status === 'completed' ? 'View Certificate' : 'Continue Challenge'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Challenges;