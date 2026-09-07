import React, { useState, useEffect } from 'react';
import '../styles/StreakTracker.css';

function StreakTracker({ user }) {
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('velora_streak');
    return saved ? JSON.parse(saved) : { current: 0, lastLearned: null, breakTokens: 2 };
  });

  useEffect(() => {
    localStorage.setItem('velora_streak', JSON.stringify(streak));
  }, [streak]);

  const handleLearningToday = () => {
    const today = new Date().toDateString();
    const lastDate = streak.lastLearned ? new Date(streak.lastLearned).toDateString() : null;

    if (lastDate === today) {
      alert('You already learned today! Come back tomorrow to keep your streak.');
      return;
    }

    if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
      // Consecutive day
      setStreak({ ...streak, current: streak.current + 1, lastLearned: new Date() });
    } else if (lastDate === null) {
      // First day
      setStreak({ ...streak, current: 1, lastLearned: new Date() });
    } else {
      // Streak broken, but can use break token
      if (streak.breakTokens > 0) {
        setStreak({
          ...streak,
          current: streak.current + 1,
          lastLearned: new Date(),
          breakTokens: streak.breakTokens - 1,
        });
        alert('Break token used! Your streak is safe.');
      } else {
        alert('Streak broken! Start fresh and build a new one.');
        setStreak({ current: 1, lastLearned: new Date(), breakTokens: 2 });
      }
    }
  };

  const getStreakMessage = () => {
    if (streak.current >= 60) return '🔥 You are UNSTOPPABLE!';
    if (streak.current >= 30) return '🌟 Legend status unlocked!';
    if (streak.current >= 14) return '💪 You are on fire!';
    if (streak.current >= 7) return '✨ Great momentum!';
    if (streak.current >= 3) return '🚀 Keep going!';
    return '🌱 Building habits...';
  };

  return (
    <div className="streak-tracker">
      <div className="streak-card">
        <div className="streak-header">
          <h3 className="streak-title">Your Learning Streak</h3>
          <span className="streak-message">{getStreakMessage()}</span>
        </div>

        <div className="streak-display">
          <div className="streak-number">{streak.current}</div>
          <div className="streak-label">Days in a row</div>
        </div>

        <div className="streak-tokens">
          <span className="token-label">Break Tokens:</span>
          <div className="token-boxes">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className={`token-box ${i < streak.breakTokens ? 'active' : 'used'}`}
              >
                {i < streak.breakTokens ? '🎁' : '✓'}
              </div>
            ))}
          </div>
        </div>

        <p className="streak-info">
          Miss a day? Use a break token to keep your streak alive. You have {streak.breakTokens} left.
        </p>

        <button className="streak-btn" onClick={handleLearningToday}>
          I Learned Today ✓
        </button>
      </div>
    </div>
  );
}

export default StreakTracker;