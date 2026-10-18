/**
 * VELORA utility module test
 * shareLinks
 *
 * Proves share URLs round-trip: a built link parses back into the same
 * destination, and unrelated hashes parse as null so the app opens normally.
 * If the format changes without the parser, this test fails.
 */

import { buildLessonShareUrl, buildTermShareUrl, parseShareHash } from './shareLinks';

describe('shareLinks', () => {
  test('builds and parses a lesson link', () => {
    const url = buildLessonShareUrl('physics', 'black-holes');
    const hash = url.slice(url.indexOf('#'));
    const dest = parseShareHash(hash);
    expect(dest).toEqual({ kind: 'lesson', subject: 'physics', topicId: 'black-holes' });
  });

  test('builds and parses a dictionary term link', () => {
    const url = buildTermShareUrl('event-horizon');
    const hash = url.slice(url.indexOf('#'));
    expect(parseShareHash(hash)).toEqual({ kind: 'term', termId: 'event-horizon' });
  });

  test('decodes a subject containing a slash or space safely', () => {
    const dest = parseShareHash('#/lesson/computer%20science/arrays');
    expect(dest).toEqual({ kind: 'lesson', subject: 'computer science', topicId: 'arrays' });
  });

  test('returns null for hashes that name nothing shareable', () => {
    expect(parseShareHash('')).toBeNull();
    expect(parseShareHash('#')).toBeNull();
    expect(parseShareHash('#/')).toBeNull();
    expect(parseShareHash('#/lesson')).toBeNull();
    expect(parseShareHash('#/lesson/physics')).toBeNull();
    expect(parseShareHash('#/unknown/thing')).toBeNull();
    expect(parseShareHash(null)).toBeNull();
    expect(parseShareHash(undefined)).toBeNull();
  });

  test('tolerates a missing leading slash', () => {
    expect(parseShareHash('#lesson/physics/black-holes')).toEqual({
      kind: 'lesson',
      subject: 'physics',
      topicId: 'black-holes',
    });
  });
});
