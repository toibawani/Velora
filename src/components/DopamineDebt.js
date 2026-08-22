import React, { useState, useEffect } from 'react';
import '../styles/DopamineDebt.css';

function DopamineDebt({ user, studyStreak }) {
  const [debtBalance, setDebtBalance] = useState(0);
  const [offTokens, setOffTokens] = useState(2);
  const [streakHistory, setStreakHistory] = useState([
    { day: 'Mon', studied: true },
    { day: 'Tue', studied: true },
    { day: 'Wed', studied: true },
    { day: 'Thu', studied: true },
    { day: 'Fri', studied: true },
    { day: 'Sat', studied: false },
    { day: 'Sun', studied: false },
  ]);

  const handleTakeBreak = () => {
    if (offTokens > 0) {
      setOffTokens(offTokens - 1);
      // Use token, streak protected
      playSound('success');
    } else {
      // No token, incur debt
      setDebtBalance(debtBalance + 10);
      playSound('debt');
    }
  };

  const handlePayDebt = () => {
    // User must do harder session to pay debt
    alert('💪 Complete a hard review session (30 min) to pay off your ' + debtBalance + ' XP debt!');
  };

  const playSound = (type) => {
    console.log(`Sound: ${type}`);
  };

  return (
    <div className="dopamine-debt-widget">
      <div className="debt-header">
        <h3>📊 Learning Economy</h3>
        <span className="debt-icon">💰</span>
      </div>

      {/* Streak Visualization */}
      <div className="streak-visual">
        <h4>Your Week</h4>
        <div className="streak-days">
          {streakHistory.map((day, idx) => (
            <div key={idx} className={`day-marker ${day.studied ? 'studied' : 'debt'}`}>
              <span className="day-label">{day.day}</span>
              <span className="day-indicator">
                {day.studied ? '🔥' : '⏳'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Debt/Balance Display */}
      <div className="debt-display">
        {debtBalance > 0 ? (
          <div className="debt-card danger">
            <h4>You Owe</h4>
            <p className="debt-amount">{debtBalance} XP</p>
            <p className="debt-desc">Complete a hard session to pay it back</p>
            <button className="btn-pay-debt" onClick={handlePayDebt}>
              💪 Pay Debt
            </button>
          </div>
        ) : (
          <div className="debt-card success">
            <h4>Perfect Balance! 🎯</h4>
            <p className="debt-amount">0 XP Debt</p>
            <p className="debt-desc">You're on track with your studies</p>
          </div>
        )}
      </div>

      {/* Off Tokens */}
      <div className="off-tokens">
        <h4>🎟️ Break Tokens</h4>
        <p className="token-desc">Use to take a day off without breaking your streak</p>
        <div className="tokens-visual">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`token ${idx < offTokens ? 'available' : 'used'}`}
              onClick={() => idx < offTokens && handleTakeBreak()}
            >
              {idx < offTokens ? '✅' : '✕'}
            </div>
          ))}
        </div>
        <p className="token-hint">Earn tokens by studying 5 days straight</p>
      </div>

      {/* Streak Bonus */}
      <div className="streak-bonus">
        <h4>🔥 Streak Bonus</h4>
        <div className="bonus-progress">
          <div className="bonus-item">
            <span>5 days</span>
            <span>+1 Break Token</span>
          </div>
          <div className="bonus-item">
            <span>10 days</span>
            <span>+50 XP bonus</span>
          </div>
          <div className="bonus-item">
            <span>30 days</span>
            <span>🏆 Badge</span>
          </div>
        </div>
      </div>

      {/* Psychology Explainer */}
      <div className="psychology-note">
        <p>💡 <strong>How This Works:</strong> Instead of punishment, we use loss aversion. Missing a day creates a "debt" you must pay back. This is more motivating than just tracking streaks!</p>
      </div>
    </div>
  );
}

export default DopamineDebt;