import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flame, Gift, Check } from 'lucide-react';
import '../styles/StreakTracker.css';

function StreakTracker({ onNotify }) {
  const [streak, setStreak] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('velora_streak') || 'null');
      if (saved && Number.isInteger(saved.current) && saved.current >= 0 && Number.isInteger(saved.breakTokens) && saved.breakTokens >= 0 && saved.breakTokens <= 2 && (saved.lastLearned === null || typeof saved.lastLearned === 'string')) return saved;
    } catch {
      // Start clean if the browser cache is damaged.
    }
    return { current: 0, lastLearned: null, breakTokens: 2 };
  });

  useEffect(() => {
    try {
      localStorage.setItem('velora_streak', JSON.stringify(streak));
    } catch {
      // A full or unavailable storage should not interrupt learning.
    }
  }, [streak]);

  const handleLearningToday = () => {
    const today = new Date().toDateString();
    const lastDate = streak.lastLearned ? new Date(streak.lastLearned).toDateString() : null;

    if (lastDate === today) {
      if (onNotify) onNotify('You already learned today. Your streak is safe.', 'info');
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
        if (onNotify) onNotify('Break token used. Your streak is safe.', 'info');
      } else {
        if (onNotify) onNotify('Your streak restarted. A fresh rhythm starts today.', 'info');
        setStreak({ current: 1, lastLearned: new Date(), breakTokens: 2 });
      }
    }
  };

  const getStreakMessage = () => {
    if (streak.current >= 60) return 'Unstoppable consistency';
    if (streak.current >= 30) return 'Habit mastery unlocked';
    if (streak.current >= 14) return 'Exceptional momentum';
    if (streak.current >= 7) return 'Consistent progress';
    if (streak.current >= 3) return 'Solid foundation';
    return 'Cultivating daily focus...';
  };

  return (
    <div className="streak-tracker">
      <motion.div
        className="streak-card"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="streak-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} strokeWidth={1.5} color="var(--color-accent)" />
            <h3 className="streak-title" style={{ margin: 0 }}>Learning Streak</h3>
          </div>
          <span className="streak-message">{getStreakMessage()}</span>
        </div>

        <div className="streak-display">
          <div className="streak-number">{streak.current}</div>
          <div className="streak-label">Consecutive Days</div>
        </div>

        <div className="streak-tokens">
          <span className="token-label">Safety Tokens:</span>
          <div className="token-boxes">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className={`token-box ${i < streak.breakTokens ? 'active' : 'used'}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {i < streak.breakTokens ? (
                  <Gift size={14} strokeWidth={1.5} color="var(--color-accent)" />
                ) : (
                  <Check size={14} strokeWidth={1.5} color="var(--color-text-muted)" />
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="streak-info">
          Missed days can consume a safety token to preserve retention. {streak.breakTokens} remaining.
        </p>

        <button
          className="streak-btn"
          onClick={handleLearningToday}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Check size={16} strokeWidth={1.5} />
          <span>Record Study Session Today</span>
        </button>
      </motion.div>
    </div>
  );
}

export default StreakTracker;