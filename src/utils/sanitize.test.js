import { sanitizeText, sanitizeObject } from './sanitize';

describe('Sanitization utilities', () => {
  test('strips HTML script tags and harmful event handlers', () => {
    const raw = '<script>alert("xss")</script>Hello <img src="x" onerror="alert(1)"/> world!';
    expect(sanitizeText(raw)).toBe('Hello  world!');
  });

  test('strips javascript: protocol', () => {
    const raw = 'javascript:doSomething()';
    expect(sanitizeText(raw)).toBe('doSomething()');
  });

  test('recursively sanitizes strings in an object', () => {
    const data = {
      title: '<b>Physics</b>',
      user: {
        bio: 'Student <iframe src="evil.com"></iframe>',
        age: 24
      }
    };
    const clean = sanitizeObject(data);
    expect(clean.title).toBe('Physics');
    expect(clean.user.bio).toBe('Student');
    expect(clean.user.age).toBe(24);
  });
});
