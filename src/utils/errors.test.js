import { VeloraError, getVeloraErrorMessage, logError } from './errors';

describe('Error utilities', () => {
  test('VeloraError has correct code and userMessage', () => {
    const err = new VeloraError('raw error', 'AUTH_FAILED');
    expect(err.code).toBe('AUTH_FAILED');
    expect(err.userMessage).toBe('Login failed. Check email and password.');
    expect(err.message).toBe('raw error');
  });

  test('returns UNKNOWN for unrecognized codes', () => {
    expect(getVeloraErrorMessage('GIBBERISH_CODE')).toBe(
      'Something went wrong. Try again or refresh.'
    );
  });

  test('logError does not throw', () => {
    const err = new VeloraError('test', 'NETWORK_ERROR', { url: '/api' });
    expect(() => logError(err)).not.toThrow();
  });
});
