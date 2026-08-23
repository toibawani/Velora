import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/ThemeToggle.css';

/**
 * ThemeToggle Component
 * 
 * Minimalist pill switcher allowing users to toggle between Dark, Light, and Smart Auto modes.
 */
function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button
        className={`theme-pill-btn ${theme === 'dark' ? 'active' : ''}`}
        title="Dark Charcoal Mode"
        onClick={() => setTheme('dark')}
      >
        🌙 Dark
      </button>
      <button
        className={`theme-pill-btn ${theme === 'light' ? 'active' : ''}`}
        title="Clean Paper Mode"
        onClick={() => setTheme('light')}
      >
        ☀️ Light
      </button>
      <button
        className={`theme-pill-btn ${theme === 'auto' ? 'active' : ''}`}
        title={`Smart Time-Based (${resolvedTheme})`}
        onClick={() => setTheme('auto')}
      >
        🕒 Auto
      </button>
    </div>
  );
}

export default ThemeToggle;
