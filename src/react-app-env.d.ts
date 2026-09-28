/// <reference types="react-scripts" />

/**
 * Ambient declarations for the string keys this app keeps in localStorage.
 *
 * These live outside the ThemeContext file so a plain .js module and a .ts
 * module can point at the same stored value without one importing the other's
 * implementation just to agree on a key name.
 */

type VeloraThemeMode = 'light' | 'dark' | 'auto';
