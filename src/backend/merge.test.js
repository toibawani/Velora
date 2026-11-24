import { mergeEvents, missingOnServer, eventKey, isEvent } from './merge';

const a = { topic_id: 'physics:motion', kind: 'lesson_read', day: '2026-11-20' };
const b = { topic_id: 'physics:entropy', kind: 'lesson_read', day: '2026-11-21' };

test('empty local and empty remote gives empty', () => {
  expect(mergeEvents([], [])).toEqual([]);
});

test('union keeps events from both sides', () => {
  expect(mergeEvents([a], [b]).map(eventKey).sort()).toEqual([eventKey(a), eventKey(b)].sort());
});

test('same event on both sides is not duplicated', () => {
  expect(mergeEvents([a, a], [a])).toHaveLength(1);
});

test('syncing twice sends nothing the second time', () => {
  const first = missingOnServer([a, b], [a]);
  expect(first).toEqual([b]);
  expect(missingOnServer([a, b], [a, b])).toEqual([]);
});

test('empty remote means everything local is sent', () => {
  expect(missingOnServer([a, b], [])).toHaveLength(2);
});

test('a half-written row is dropped rather than uploaded', () => {
  // A crashed write, or a hand-edited localStorage value. Sending it would fail
  // the whole batch and leave every real event unsynced behind it.
  expect(isEvent({ topic_id: 'physics:motion', kind: 'lesson_read' })).toBe(false);
  expect(isEvent({ topic_id: 'physics:motion', kind: 'lesson_read', day: '20/11/2026' })).toBe(
    false,
  );
  expect(mergeEvents([{ topic_id: 'physics:motion' }, a], [])).toEqual([a]);
});

test('only the three stored fields are kept', () => {
  // Local events carry a title for display; it must not become a column.
  expect(mergeEvents([{ ...a, title: 'Motion', minutes: 12 }], [])).toEqual([a]);
});
