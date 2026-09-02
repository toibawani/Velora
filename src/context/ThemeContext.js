import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'velora_theme_preference';

/**
 * Determines whether it is currently daytime (7 AM to 7 PM)
 */
const isDaytime = () => {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19;
};

export function ThemeProvider({ children }) {
  // Mode: 'dark' | 'light' | 'auto'
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'auto';
    } catch {
      return 'auto';
    }
  });

  // Compute actual applied theme ('dark' | 'light') dynamically during render
  const resolvedTheme = themeMode === 'auto' ? (isDaytime() ? 'light' : 'dark') : themeMode;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
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
