import React from 'react';
import PropTypes from 'prop-types';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from '../utils/analytics';

const MODES = [
  { mode: 'light', label: 'Light', Icon: Sun },
  { mode: 'dark', label: 'Dark', Icon: Moon },
  { mode: 'auto', label: 'Auto', Icon: Monitor },
];

/**
 * Tri-state switch: explicit light, explicit dark, or follow the system.
 * ThemeContext persists the mode, and the pre-paint script in index.html
 * reads the same key so a reload lands already themed (no cream flash).
 */
/* PropTypes for ThemeToggle */
ThemeToggle.propTypes = { onChange: PropTypes.func };

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const select = (mode) => {
    if (theme === mode) return;
    setTheme(mode);
    trackEvent('theme_changed', { mode });
  };

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {MODES.map(({ mode, label, Icon }) => (
        <button
          key={mode}
          type="button"
          className="theme-toggle-segment"
          aria-pressed={theme === mode}
          // The visible label alone is "Dark" or "Light", and both are common
          // words in the atlas: "Dark Matter" is a physics topic and the index
          // now renders every topic at once. Prefixing the accessible name with
          // the control's own group makes the two distinguishable to anyone
          // navigating by name rather than by position.
          aria-label={`Theme: ${label}`}
          title={mode === 'auto' ? 'Follow the system theme' : `${label} theme`}
          onClick={() => select(mode)}
        >
          <Icon size={14} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
