import {
  validateEmail,
  validatePassword,
  validateUsername,
  getErrorMessage
} from './validation';

describe('Validation utilities', () => {
  test('validates email correctly', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('user@domain')).toBe(false);
  });

  test('validates password correctly', () => {
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('12345')).toBe(false);
  });

  test('validates username length', () => {
    expect(validateUsername('alice')).toBe(true);
    expect(validateUsername('al')).toBe(false);
    expect(validateUsername('a'.repeat(21))).toBe(false);
  });

  test('handles non-string values without throwing', () => {
    expect(getErrorMessage('Email', null)).toBe('Email is required');
    expect(getErrorMessage('Password', {})).toBe('Password is required');
  });

  test('generates expected error messages', () => {
    expect(getErrorMessage('Email', '')).toBe('Email is required');
    expect(getErrorMessage('Email', 'bademail')).toBe('Enter a valid email address, such as name@example.com');
    expect(getErrorMessage('Password', '123')).toBe('Use at least 6 characters for your password');
    expect(getErrorMessage('Username', 'ab')).toBe('Use 3–20 characters for your name');
    expect(getErrorMessage('Email', 'good@email.com')).toBeNull();
  });
});
