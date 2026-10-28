import { formatBytes } from './format';

test('shows bytes below a thousand as bytes', () => {
  expect(formatBytes(0)).toBe('0 B');
  expect(formatBytes(-5)).toBe('0 B');
  expect(formatBytes(980)).toBe('980 B');
});

test('scales to decimal kilobytes and megabytes', () => {
  expect(formatBytes(1000)).toBe('1 kB');
  expect(formatBytes(12400)).toBe('12.4 kB');
  expect(formatBytes(2500000)).toBe('2.5 MB');
});

test('drops a pointless decimal', () => {
  expect(formatBytes(2000)).toBe('2 kB');
  expect(formatBytes(1000000)).toBe('1 MB');
});

test('does not invent a number from nothing', () => {
  expect(formatBytes(undefined)).toBe('0 B');
  expect(formatBytes('not a number')).toBe('0 B');
});
