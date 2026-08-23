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

  // Calculate actual applied theme ('dark' | 'light')
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (themeMode === 'auto') {
      return isDaytime() ? 'light' : 'dark';
    }
    return themeMode;
  });

  useEffect(() => {
    let effective = themeMode;
    if (themeMode === 'auto') {
      effective = isDaytime() ? 'light' : 'dark';
    }
    setResolvedTheme(effective);
    document.documentElement.setAttribute('data-theme', effective);
    document.body.setAttribute('data-theme', effective);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch (e) {
      console.warn('Could not save theme preference', e);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    if (themeMode === 'dark') setThemeMode('light');
    else if (themeMode === 'light') setThemeMode('auto');
    else setThemeMode('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme: themeMode, resolvedTheme, setTheme: setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
