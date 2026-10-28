import {
  BACKUP_FORMAT_VERSION,
  IMPORT_MODE,
  buildBackup,
  describeBackup,
  describeImport,
  explainParseFailure,
  importBackup,
  parseBackup,
  serialiseBackup,
} from './backup';
import { KEYS, EXPLANATION_BOARD, listStoredKeys, readValue, writeValue } from './storage';

const NOW = new Date('2026-10-28T09:00:00.000Z');

const seed = () => {
  writeValue(KEYS.QUESTION_DESK, [{ question: 'Why is entropy time-asymmetric?' }]);
  writeValue(KEYS.GAME_RESULTS, { scrabble: { best: 1500, max: 2000, plays: 2 } });
  writeValue(EXPLANATION_BOARD('momentum'), { lines: ['p = mv'] });
  writeValue(`${KEYS.PREFERENCE_PREFIX}sort`, 'az');
};

describe('building a backup', () => {
  beforeEach(() => localStorage.clear());

  test('carries every key the app owns, including the runtime families', () => {
    seed();
    const backup = buildBackup(NOW);

    expect(backup.app).toBe('velora');
    expect(backup.format).toBe(BACKUP_FORMAT_VERSION);
    expect(backup.exportedAt).toBe(NOW.toISOString());
    expect(backup.entries.map((entry) => entry.key).sort()).toEqual(listStoredKeys().sort());
    expect(backup.entries).toHaveLength(4);
  });

  test('exports payloads rather than the storage envelope', () => {
    seed();
    const backup = buildBackup(NOW);
    const question = backup.entries.find((entry) => entry.key === KEYS.QUESTION_DESK);
    expect(question.value).toEqual([{ question: 'Why is entropy time-asymmetric?' }]);
  });

  test('leaves out keys belonging to anything else on the origin', () => {
    seed();
    localStorage.setItem('some_other_app', '{"v":1,"data":"nope"}');
    expect(buildBackup(NOW).entries.map((entry) => entry.key)).not.toContain('some_other_app');
  });

  test('writes readable JSON with a trailing newline', () => {
    seed();
    const text = serialiseBackup(buildBackup(NOW));
    expect(text.endsWith('\n')).toBe(true);
    expect(text).toContain('\n  "app": "velora"');
  });

  test('describes itself in one phrase', () => {
    seed();
    expect(describeBackup(buildBackup(NOW))).toBe('4 saved keys');
    expect(describeBackup({ entries: [] })).toBe('0 saved keys');
  });
});

describe('reading a backup', () => {
  const valid = {
    app: 'velora',
    format: 1,
    exportedAt: NOW.toISOString(),
    origin: 'https://example.test',
    entries: [{ key: KEYS.QUESTION_DESK, value: [{ question: 'x' }] }],
  };

  test('accepts a file this build wrote', () => {
    const result = parseBackup(JSON.stringify(valid));
    expect(result.ok).toBe(true);
    expect(result.dropped).toBe(0);
    expect(result.backup.entries).toHaveLength(1);
    expect(result.backup.origin).toBe('https://example.test');
  });

  test('names each way a file can be wrong', () => {
    expect(parseBackup('').reason).toBe('empty');
    expect(parseBackup('   ').reason).toBe('empty');
    expect(parseBackup('not json').reason).toBe('not-json');
    expect(parseBackup('{"hello":"world"}').reason).toBe('not-a-backup');
    expect(parseBackup(JSON.stringify({ app: 'velora', format: 0 })).reason).toBe('not-a-backup');
    expect(
      parseBackup(JSON.stringify({ ...valid, format: BACKUP_FORMAT_VERSION + 1 })).reason,
    ).toBe('from-a-newer-version');
    expect(parseBackup(JSON.stringify({ ...valid, entries: [] })).reason).toBe('no-entries');
  });

  test('explains a failure without blaming the person', () => {
    expect(explainParseFailure('not-json')).toMatch(/not JSON/);
    expect(explainParseFailure('not-a-backup')).toMatch(/not a VELORA backup/);
    expect(explainParseFailure('from-a-newer-version')).toMatch(/newer version/);
    expect(explainParseFailure('something-new')).toMatch(/not a VELORA backup/);
  });

  test('drops malformed entries but keeps the rest, and counts them', () => {
    const result = parseBackup(
      JSON.stringify({
        ...valid,
        entries: [valid.entries[0], { key: 42 }, null, { value: 'no key' }],
      }),
    );
    expect(result.ok).toBe(true);
    expect(result.backup.entries).toHaveLength(1);
    expect(result.dropped).toBe(3);
  });
});

describe('importing a backup', () => {
  beforeEach(() => localStorage.clear());

  test('round trips every value through export and import', () => {
    seed();
    const text = serialiseBackup(buildBackup(NOW));
    localStorage.clear();
    expect(listStoredKeys()).toEqual([]);

    const parsed = parseBackup(text);
    const result = importBackup(parsed.backup);

    expect(result.written).toBe(4);
    expect(readValue(KEYS.QUESTION_DESK)).toEqual([{ question: 'Why is entropy time-asymmetric?' }]);
    expect(readValue(`${KEYS.PREFERENCE_PREFIX}sort`)).toBe('az');
    expect(readValue(EXPLANATION_BOARD('momentum'))).toEqual({ lines: ['p = mv'] });
  });

  test('merge leaves keys the file does not mention alone', () => {
    writeValue(KEYS.MYTH_STREAK, 7);
    const backup = {
      app: 'velora',
      format: 1,
      exportedAt: NOW.toISOString(),
      entries: [{ key: KEYS.QUESTION_DESK, value: [] }],
    };

    const result = importBackup(backup, { mode: IMPORT_MODE.MERGE });
    expect(result.written).toBe(1);
    expect(readValue(KEYS.MYTH_STREAK)).toBe(7);
  });

  test('replace removes what the file does not contain', () => {
    writeValue(KEYS.MYTH_STREAK, 7);
    const backup = {
      app: 'velora',
      format: 1,
      exportedAt: NOW.toISOString(),
      entries: [{ key: KEYS.QUESTION_DESK, value: [] }],
    };

    const result = importBackup(backup, { mode: IMPORT_MODE.REPLACE });
    expect(result.removed).toBe(1);
    expect(readValue(KEYS.MYTH_STREAK, null)).toBeNull();
    expect(readValue(KEYS.QUESTION_DESK)).toEqual([]);
  });

  test('refuses to write a key belonging to another app', () => {
    const backup = {
      app: 'velora',
      format: 1,
      entries: [
        { key: 'some_other_app', value: 'clobbered' },
        { key: KEYS.QUESTION_DESK, value: [] },
      ],
    };

    const result = importBackup(backup);
    expect(result.written).toBe(1);
    expect(result.skipped).toBe(1);
    expect(localStorage.getItem('some_other_app')).toBeNull();
  });

  test('reports keys that could not be written instead of claiming success', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    const result = importBackup({ entries: [{ key: KEYS.QUESTION_DESK, value: [] }] });
    setItem.mockRestore();

    expect(result.written).toBe(0);
    expect(result.failed).toBe(1);
    expect(describeImport(result)).toMatch(/could not be written/);
  });

  test('describes a clean import in one line', () => {
    expect(describeImport({ written: 3, skipped: 0, failed: 0, removed: 0 })).toBe(
      '3 keys restored.',
    );
    expect(describeImport({ written: 1, skipped: 2, failed: 0, removed: 0 })).toBe(
      '1 key restored, 2 ignored.',
    );
  });
});
