import { getPreference, setPreference } from './preferences';

describe('Preferences utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns default value when preference does not exist', () => {
    expect(getPreference('darkMode', false)).toBe(false);
    expect(getPreference('non_existent', 'default')).toBe('default');
  });

  test('saves and retrieves preferences correctly', () => {
    setPreference('darkMode', true);
    expect(getPreference('darkMode', false)).toBe(true);

    setPreference('fontSize', 14);
    expect(getPreference('fontSize', 12)).toBe(14);
  });
});
