export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  const normalized = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized);
};

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const validateUsername = (username) => {
  return typeof username === 'string' && username.length >= 3 && username.length <= 20;
};

export const getErrorMessage = (field, value) => {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) return `${field} is required`;

  if (field === 'Email' && !validateEmail(normalized)) {
    return 'Enter a valid email address, such as name@example.com';
  }

  if (field === 'Password' && !validatePassword(normalized)) {
    return 'Use at least 6 characters for your password';
  }

  if (field === 'Username' && !validateUsername(normalized)) {
    return 'Use 3–20 characters for your name';
  }

  return null;
};
