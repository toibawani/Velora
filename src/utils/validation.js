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
  if (!value || !value.trim()) return `${field} is required`;

  if (field === 'Email' && !validateEmail(value)) {
    return 'Invalid email format';
  }

  if (field === 'Password' && !validatePassword(value)) {
    return 'Password must be 6+ characters';
  }

  if (field === 'Username' && !validateUsername(value)) {
    return 'Username must be 3-20 characters';
  }

  return null;
};
