export const getPreference = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(`velora_pref_${key}`);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setPreference = (key, value) => {
  try {
    localStorage.setItem(`velora_pref_${key}`, JSON.stringify(value));
  } catch {
    console.error('Failed to save preference');
  }
};
