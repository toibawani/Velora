import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'velora_theme_preference';

/**
 * Determines whether it is currently daytime (7 AM to 7 PM)
 */
const THEME_MODES = ['dark', 'light', 'auto'];
const normalizeThemeMode = (value) => THEME_MODES.includes(value) ? value : 'auto';

const isSystemDark = () => {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  } catch {
    return false;
  }
};

export function ThemeProvider({ children }) {
  // Mode: 'dark' | 'light' | 'auto'
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return normalizeThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
    } catch {
      return 'auto';
    }
  });

  // Compute actual applied theme ('dark' | 'light') dynamically during render
  const [systemDark, setSystemDark] = React.useState(isSystemDark);
  const resolvedTheme = themeMode === 'auto' ? (systemDark ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    if (themeMode !== 'auto' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setSystemDark(event.matches);
    media.addEventListener?.('change', handleChange);
    return () => media.removeEventListener?.('change', handleChange);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
    document.body.setAttribute('data-theme', resolvedTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch (e) {
      console.warn('Could not save theme preference', e);
    }
  }, [themeMode, resolvedTheme]);

  const toggleTheme = React.useCallback(() => {
    setThemeMode((currentMode) => {
      if (currentMode === 'dark') return 'light';
      if (currentMode === 'light') return 'auto';
      return 'dark';
    });
  }, []);

  const contextValue = React.useMemo(() => ({
    theme: themeMode,
    resolvedTheme,
    setTheme: setThemeMode,
    toggleTheme
  }), [themeMode, resolvedTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
