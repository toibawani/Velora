import {
  enforceRLS,
  validatePayload,
  containsInjection,
  secureUserStorage,
  SecurityError,
  SecurityErrorCode,
} from './security';

describe('security and RLS enforcement module', () => {
  describe('enforceRLS', () => {
    test('permits access when authUid matches resourceUserId', () => {
      expect(enforceRLS('user-123', 'user-123', 'read')).toBe(true);
      expect(enforceRLS('user-abc', 'user-abc', 'write')).toBe(true);
    });

    test('rejects unauthenticated requests', () => {
      expect(() => enforceRLS(null, 'user-123', 'read')).toThrow(SecurityError);

      // Capture the error and assert on it outside the catch: an expectation
      // that only runs when something throws cannot fail when nothing does.
      let thrown;
      try {
        enforceRLS(null, 'user-123', 'read');
      } catch (err) {
        thrown = err;
      }
      expect(thrown).toBeInstanceOf(SecurityError);
      expect(thrown.code).toBe(SecurityErrorCode.UNAUTHORIZED);
    });

    test('rejects unauthorized access when authUid != resourceUserId', () => {
      expect(() => enforceRLS('attacker', 'victim', 'delete')).toThrow(SecurityError);

      let thrown;
      try {
        enforceRLS('attacker', 'victim', 'delete');
      } catch (err) {
        thrown = err;
      }
      expect(thrown).toBeInstanceOf(SecurityError);
      expect(thrown.code).toBe(SecurityErrorCode.FORBIDDEN);
    });
  });

  describe('injection detection', () => {
    test('flags SQL injection attempts', () => {
      expect(containsInjection("SELECT * FROM users WHERE id = '1'")).toBe(true);
      expect(containsInjection("'; DROP TABLE profiles; --")).toBe(true);
      expect(containsInjection("1' UNION SELECT null, password FROM credentials --")).toBe(true);
    });

    test('allows legitimate physics, philosophy, and everyday text', () => {
      expect(containsInjection('Why does a black hole have an event horizon?')).toBe(false);
      expect(containsInjection('E = mc^2 is Einstein’s mass-energy equivalence.')).toBe(false);
      expect(containsInjection('Plato’s Allegory of the Cave discusses perception vs reality.')).toBe(false);
    });
  });

  describe('validatePayload', () => {
    const questionSchema = {
      question: { type: 'string', required: true, min: 10, max: 200 },
      subject: { type: 'string', required: true, allowedValues: ['physics', 'philosophy', 'history'] },
    };

    test('validates valid payloads and sanitizes text', () => {
      const clean = validatePayload(questionSchema, {
        question: 'What is the Schwarzschild radius of a star?',
        subject: 'physics',
      });
      expect(clean.question).toBe('What is the Schwarzschild radius of a star?');
      expect(clean.subject).toBe('physics');
    });

    test('rejects missing required fields', () => {
      expect(() => validatePayload(questionSchema, { subject: 'physics' })).toThrow(SecurityError);
    });

    test('rejects payloads shorter than min', () => {
      expect(() => validatePayload(questionSchema, { question: 'Too short', subject: 'physics' })).toThrow(SecurityError);
    });

    test('rejects unauthorized option values', () => {
      expect(() => validatePayload(questionSchema, {
        question: 'What is the Schwarzschild radius of a star?',
        subject: 'astrology',
      })).toThrow(SecurityError);
    });

    test('rejects injection in string fields', () => {
      expect(() => validatePayload(questionSchema, {
        question: "'; DROP TABLE notes; --",
        subject: 'physics',
      })).toThrow(SecurityError);
    });
  });

  describe('secureUserStorage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('stores and retrieves data with user-scoped RLS', () => {
      const saved = secureUserStorage.setItem('notes', { title: 'Relative motion notes' }, 'user-42');
      expect(saved).toBe(true);

      const retrieved = secureUserStorage.getItem('notes', 'user-42');
      expect(retrieved.title).toBe('Relative motion notes');
    });

    test('refuses access to another user’s scoped key', () => {
      secureUserStorage.setItem('notes', { title: 'Private notes' }, 'user-42');

      // Attempting to read another user's key with different authUid throws
      expect(() => secureUserStorage.getItem('notes', 'imposter', 'user-42')).toThrow(SecurityError);
    });
  });
});
