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

  test('generates expected error messages', () => {
    expect(getErrorMessage('Email', '')).toBe('Email is required');
    expect(getErrorMessage('Email', 'bademail')).toBe('Invalid email format');
    expect(getErrorMessage('Password', '123')).toBe('Password must be 6+ characters');
    expect(getErrorMessage('Username', 'ab')).toBe('Username must be 3-20 characters');
    expect(getErrorMessage('Email', 'good@email.com')).toBeNull();
  });
});
