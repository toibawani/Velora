import fs from 'fs';
import path from 'path';
import {
  KEYS,
  FAILURE,
  CURRENT_VERSION,
  MIGRATIONS,
  EXPLANATION_BOARD,
  readValue,
  writeValue,
  removeValue,
  describeStorage,
  listStoredKeys,
  storageUsage,
  clearStoredData,
  KEY_PREFIX,
} from './storage';

beforeEach(() => {
  window.localStorage.clear();
});

test('writes a versioned envelope rather than a bare payload', () => {
  writeValue(KEYS.MYTH_STREAK, 3);
  const raw = JSON.parse(window.localStorage.getItem(KEYS.MYTH_STREAK));
  expect(raw).toEqual({ v: CURRENT_VERSION, data: 3 });
  expect(readValue(KEYS.MYTH_STREAK)).toBe(3);
});

test('reads a pre-registry payload as version 0 without losing it', () => {
  // Exactly what last week's build wrote: no envelope.
  window.localStorage.setItem(KEYS.QUESTION_DESK, JSON.stringify([{ question: 'Why?' }]));
  expect(readValue(KEYS.QUESTION_DESK)).toEqual([{ question: 'Why?' }]);
});

test('runs a registered migration instead of discarding the payload', () => {
  MIGRATIONS[KEYS.REVIEWS] = {
    0: (legacy) => ({ ...legacy, migrated: true }),
  };
  window.localStorage.setItem(KEYS.REVIEWS, JSON.stringify({ topicId: 'x' }));
  expect(readValue(KEYS.REVIEWS)).toEqual({ topicId: 'x', migrated: true });
  delete MIGRATIONS[KEYS.REVIEWS];
});

test('passes a non-JSON legacy string through, as safeGet always did', () => {
  window.localStorage.setItem(KEYS.EVENTS, 'not json at all');
  expect(readValue(KEYS.EVENTS, [])).toBe('not json at all');
});

test('reports quota exhaustion instead of claiming the write worked', () => {
  const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });
  expect(writeValue(KEYS.EVENTS, [])).toBe(FAILURE.QUOTA);
  setItem.mockRestore();
});

test('reports a refused write rather than silently dropping it', () => {
  const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('denied');
  });
  expect(writeValue(KEYS.EVENTS, [])).toBe(FAILURE.FAILED);
  setItem.mockRestore();
});

test('reports disabled storage without attempting a write', () => {
  const setItem = jest.spyOn(Storage.prototype, 'setItem');
  const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() {
      throw new DOMException('denied');
    },
  });
  expect(readValue(KEYS.EVENTS, [])).toEqual([]);
  expect(writeValue(KEYS.EVENTS, [])).toBe(FAILURE.DISABLED);
  expect(setItem).not.toHaveBeenCalled();
  if (descriptor) Object.defineProperty(window, 'localStorage', descriptor);
  setItem.mockRestore();
});

test('returns the fallback for an absent key and never throws', () => {
  expect(readValue('velora_never_written', 'fallback')).toBe('fallback');
});

test('removes a value', () => {
  writeValue(KEYS.MYTH_STREAK, 1);
  removeValue(KEYS.MYTH_STREAK);
  expect(readValue(KEYS.MYTH_STREAK, 0)).toBe(0);
});

test('namespaces per-term explanation boards', () => {
  expect(EXPLANATION_BOARD('stoicism')).toBe('velora_explanations_stoicism');
});

test('lists only the keys this app owns, including runtime families', () => {
  writeValue(KEYS.QUESTION_DESK, []);
  writeValue(EXPLANATION_BOARD('momentum'), { lines: [] });
  writeValue(`${KEYS.PREFERENCE_PREFIX}sort`, 'az');
  window.localStorage.setItem('someone_elses_key', 'keep me');

  expect(listStoredKeys()).toEqual(
    [KEYS.QUESTION_DESK, EXPLANATION_BOARD('momentum'), `${KEYS.PREFERENCE_PREFIX}sort`].sort(),
  );
  expect(listStoredKeys().every((key) => key.startsWith(KEY_PREFIX))).toBe(true);
});

test('reports space per key, largest first', () => {
  writeValue(KEYS.QUESTION_DESK, [{ question: 'x'.repeat(200) }]);
  writeValue(KEYS.MYTH_STREAK, 1);

  const usage = storageUsage();
  expect(usage.available).toBe(true);
  expect(usage.keys).toHaveLength(2);
  expect(usage.keys[0].key).toBe(KEYS.QUESTION_DESK);
  expect(usage.totalBytes).toBeGreaterThan(100);
  expect(usage.totalCharacters).toBeGreaterThan(100);
  expect(usage.keys[0].bytes).toBeGreaterThanOrEqual(usage.keys[0].characters);
});

test('counts nothing when storage is unavailable', () => {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() {
      throw new DOMException('denied');
    },
  });

  expect(storageUsage()).toEqual({
    available: false,
    keys: [],
    totalBytes: 0,
    totalCharacters: 0,
  });
  expect(listStoredKeys()).toEqual([]);
  expect(clearStoredData()).toBe(0);

  if (descriptor) Object.defineProperty(window, 'localStorage', descriptor);
});

test('clearing removes this app\'s keys and leaves anything else alone', () => {
  writeValue(KEYS.QUESTION_DESK, []);
  writeValue(EXPLANATION_BOARD('momentum'), { lines: [] });
  window.localStorage.setItem('someone_elses_key', 'keep me');

  expect(clearStoredData()).toBe(2);
  expect(listStoredKeys()).toEqual([]);
  expect(window.localStorage.getItem('someone_elses_key')).toBe('keep me');
});

test('describes a working store as available', () => {
  expect(describeStorage().available).toBe(true);
});

test('says plainly that nothing can be saved when a write is refused', () => {
  const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });
  const status = describeStorage();
  expect(status.available).toBe(false);
  expect(status.message).toMatch(/lost when you close the tab/);
  setItem.mockRestore();
});

test('every registered key is unique', () => {
  const values = Object.values(KEYS);
  expect(new Set(values).size).toBe(values.length);
});

test('no module outside storage.js spells a velora key itself', () => {
  // The registry's own rules say this, and four modules had broken it: resume,
  // dialogues, today's question and site analytics each held a literal key, so
  // the list of keys was not the list of keys. A rename in storage.js would
  // have silently orphaned their data. Tests are excluded because they assert
  // the literal values are stable, which is the opposite of a problem.
  const root = path.join(__dirname, '..');
  const files = [];
  const walk = (dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) files.push(full);
    });
  };
  walk(root);

  const offenders = files
    .filter((file) => !/\.test\./.test(path.basename(file)))
    .filter((file) => path.basename(file) !== 'storage.js')
    .filter((file) => /['"]velora_/.test(fs.readFileSync(file, 'utf8')))
    .map((file) => path.relative(root, file));

  expect(offenders).toEqual([]);
});
