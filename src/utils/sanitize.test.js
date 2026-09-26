import { sanitizeText, sanitizeObject, MAX_TEXT_LENGTH } from './sanitize';

describe('Text cleanup', () => {
  test('removes script blocks whole, including the code inside them', () => {
    const raw = 'before <script>alert("xss")</script> after';
    expect(sanitizeText(raw)).toBe('before  after');
    expect(sanitizeText(raw)).not.toMatch(/alert/);
  });

  test('removes a script tag that was never closed', () => {
    expect(sanitizeText('hello <script>alert(1)')).not.toMatch(/alert/);
  });

  test('drops stray tags but leaves ordinary punctuation alone', () => {
    expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe('');
    expect(sanitizeText('a < b and 5 < 10')).toBe('a < b and 5 < 10');
    expect(sanitizeText('x > y, therefore')).toBe('x > y, therefore');
  });

  test('keeps text a learner would plausibly type', () => {
    const physics = 'F = ma, so if m < 2kg the acceleration is higher.';
    expect(sanitizeText(physics)).toBe(physics);
  });

  test('strips control characters that would break rendering', () => {
    expect(sanitizeText('clean\u0000text\u0007here')).toBe('cleantexthere');
    expect(sanitizeText('two\nlines\ttabbed')).toBe('two\nlines\ttabbed');
  });

  test('caps absurdly long input', () => {
    expect(sanitizeText('x'.repeat(50000)).length).toBe(MAX_TEXT_LENGTH);
    expect(sanitizeText('y'.repeat(50000), 10).length).toBe(10);
  });

  test('returns an empty string for anything that is not a string', () => {
    [null, undefined, 42, {}, [], true].forEach((value) => {
      expect(sanitizeText(value)).toBe('');
    });
  });

  test('walks an object and leaves non-strings alone', () => {
    const clean = sanitizeObject({
      title: 'Newton\u0000\'s laws',
      nested: { note: '<script>bad()</script>ok', count: 24, on: true },
    });
    expect(clean.title).toBe("Newton's laws");
    expect(clean.nested.note).toBe('ok');
    expect(clean.nested.count).toBe(24);
    expect(clean.nested.on).toBe(true);
  });

  test('will not carry a prototype-polluting key through', () => {
    const clean = sanitizeObject(JSON.parse('{"__proto__": {"polluted": true}, "keep": "yes"}'));
    expect(clean.keep).toBe('yes');
    expect({}.polluted).toBeUndefined();
  });
});
