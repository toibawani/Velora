import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from '../utils/analytics';
import '../styles/ThemeToggle.css';

/**
 * ThemeToggle Component
 * 
 * Minimalist pill switcher allowing users to toggle between Dark, Light, and Smart Auto modes.
 */
function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleSelectTheme = (newTheme) => {
    trackEvent('theme_selected', { theme: newTheme });
    setTheme(newTheme);
  };

  return (
    <div className="theme-toggle-container" role="group" aria-label="Theme selection">
      <button
        className={`theme-pill-btn ${theme === 'dark' ? 'active' : ''}`}
        title="Dark Charcoal Mode"
        aria-pressed={theme === 'dark'}
        onClick={() => handleSelectTheme('dark')}
      >
        🌙 Dark
      </button>
      <button
        className={`theme-pill-btn ${theme === 'light' ? 'active' : ''}`}
        title="Clean Paper Mode"
        aria-pressed={theme === 'light'}
        onClick={() => handleSelectTheme('light')}
      >
        ☀️ Light
      </button>
      <button
        className={`theme-pill-btn ${theme === 'auto' ? 'active' : ''}`}
        title={`Smart Time-Based (${resolvedTheme})`}
        aria-pressed={theme === 'auto'}
        onClick={() => handleSelectTheme('auto')}
      >
        🕒 Auto
      </button>
    </div>
  );
}

export default ThemeToggle;
