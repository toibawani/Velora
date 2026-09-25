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

  test('redacts private fields before logging', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logError(new VeloraError('test', 'AUTH_FAILED', { email: 'person@example.com', password: 'secret', attempt: 1 }));
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ details: { attempt: 1 } }));
    spy.mockRestore();
  });
});
