/**
 * VELORA utility module
 * backup
 *
 * Reading and writing everything this browser holds about a learner, as one
 * file they can keep.
 *
 * The app promises that nothing leaves the device. That promise has a cost: a
 * cleared browser, a new laptop or a different profile takes every saved
 * lesson, question, note and round with it, and there is no account to sign
 * back into. "Your data is only here" is honest, but without an export it is
 * also final.
 *
 * What is exported is the payload of each key, not the stored envelope. The
 * envelope carries a version number for this build; a payload is the thing that
 * can be migrated forward on the way back in, which is the direction that
 * matters when the file is a year old.
 *
 * Nothing here decides *when* to export, and nothing uploads. The file is
 * handed to the browser's download machinery and the rest is the person's own
 * filesystem.
 */
import { KEY_PREFIX, listStoredKeys, readValue, removeValue, writeValue, FAILURE } from './storage';

export const BACKUP_APP = 'velora';
export const BACKUP_FORMAT_VERSION = 1;

export const IMPORT_MODE = {
  /** Write what the file holds, leave everything else alone. */
  MERGE: 'merge',
  /** Delete this app's keys first, so the file is the whole state. */
  REPLACE: 'replace',
};

/**
 * The whole of this browser's VELORA data, as a plain object.
 *
 * `origin` is included so a person opening the file later can see which
 * deployment it came from. It is a URL they were already on, not an identifier,
 * and nothing reads it back on import.
 */
export function buildBackup(now = new Date()) {
  const entries = listStoredKeys().map((key) => ({ key, value: readValue(key, null) }));
  return {
    app: BACKUP_APP,
    format: BACKUP_FORMAT_VERSION,
    exportedAt: now.toISOString(),
    origin: typeof window === 'undefined' ? null : window.location.origin,
    entries,
  };
}

/** A JSON string ready to be written to a file. Indented for reading. */
export const serialiseBackup = (backup) => `${JSON.stringify(backup, null, 2)}\n`;

/** "14 keys" for a button label or a confirmation line. */
export const describeBackup = (backup) =>
  `${backup.entries.length} saved ${backup.entries.length === 1 ? 'key' : 'keys'}`;

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Parses a file into a backup, or says why it cannot.
 *
 * Every failure is a named reason rather than a thrown error or a bare false,
 * because the screen has to tell someone something more useful than "invalid
 * file" - pasting the wrong JSON and picking last month's export are different
 * mistakes with different fixes.
 */
export function parseBackup(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return { ok: false, reason: 'empty' };
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'not-json' };
  }

  if (!isPlainObject(parsed) || parsed.app !== BACKUP_APP) {
    return { ok: false, reason: 'not-a-backup' };
  }

  const format = Number(parsed.format);
  if (!Number.isFinite(format) || format < 1) {
    return { ok: false, reason: 'not-a-backup' };
  }
  if (format > BACKUP_FORMAT_VERSION) {
    // A newer build wrote this. Reading it anyway would mean guessing at a
    // shape this code has never seen, so it is refused rather than half-read.
    return { ok: false, reason: 'from-a-newer-version' };
  }

  if (!Array.isArray(parsed.entries)) {
    return { ok: false, reason: 'not-a-backup' };
  }

  const entries = parsed.entries.filter(
    (entry) => isPlainObject(entry) && typeof entry.key === 'string' && 'value' in entry,
  );

  if (entries.length === 0) {
    return { ok: false, reason: 'no-entries' };
  }

  return {
    ok: true,
    backup: {
      app: BACKUP_APP,
      format,
      exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : null,
      origin: typeof parsed.origin === 'string' ? parsed.origin : null,
      entries,
    },
    /** Entries dropped as malformed, so the screen can mention them. */
    dropped: parsed.entries.length - entries.length,
  };
}

/** What a failed parse means, in a sentence someone can act on. */
export const explainParseFailure = (reason) => {
  switch (reason) {
    case 'empty':
      return 'That file is empty. Choose the JSON file you exported from VELORA.';
    case 'not-json':
      return 'That file is not JSON. Choose the file VELORA exported, not a screenshot or a text copy.';
    case 'from-a-newer-version':
      return 'That backup was written by a newer version of VELORA. Update this copy before restoring it.';
    case 'no-entries':
      return 'That backup has no saved data in it.';
    case 'not-a-backup':
    default:
      return 'That is JSON, but it is not a VELORA backup.';
  }
};

/**
 * Writes a parsed backup into storage.
 *
 * Keys that do not start with this app's prefix are skipped rather than
 * written: the file is untrusted input, and a backup should never be able to
 * write to a key belonging to another app on the same origin.
 *
 * Merge overwrites only the keys the file contains. Replace removes every
 * VELORA key first, which is why it is the mode a screen has to confirm: it can
 * delete a question written this morning.
 */
export function importBackup(backup, { mode = IMPORT_MODE.MERGE } = {}) {
  const result = { written: 0, skipped: 0, failed: 0, removed: 0 };

  if (mode === IMPORT_MODE.REPLACE) {
    listStoredKeys().forEach((key) => {
      if (removeValue(key)) result.removed += 1;
    });
  }

  backup.entries.forEach(({ key, value }) => {
    if (typeof key !== 'string' || !key.startsWith(KEY_PREFIX)) {
      result.skipped += 1;
      return;
    }
    if (writeValue(key, value) === FAILURE.NONE) result.written += 1;
    else result.failed += 1;
  });

  return result;
}

/** One line describing what an import did, for the notice above the buttons. */
export const describeImport = (result) => {
  const parts = [`${result.written} ${result.written === 1 ? 'key' : 'keys'} restored`];
  if (result.removed > 0) parts.push(`${result.removed} replaced`);
  if (result.skipped > 0) parts.push(`${result.skipped} ignored`);
  if (result.failed > 0) parts.push(`${result.failed} could not be written`);
  return `${parts.join(', ')}.`;
};

export default buildBackup;
