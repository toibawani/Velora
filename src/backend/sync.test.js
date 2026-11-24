import { KEYS, readValue } from '../utils/storage';

/**
 * The sync engine, tested against a fake server rather than a real one.
 *
 * Every scenario here is one a person can actually hit: signing in twice, a
 * device with nothing on it, an account with nothing on it, losing signal, and a
 * write that fails and is retried. The point of each is the same: no event is
 * lost, no event is sent twice, and the status never claims more than happened.
 */

import {
  collectLocalProgress,
  getSyncState,
  localDay,
  readLocalEvents,
  recordProgressEvent,
  resolveTopicId,
  retryNow,
  stopSync,
  subscribe,
  syncNow,
  SYNC_STATUS,
} from './sync';
import { fetchProgress, getSessionUser, onAuthChange, pushProgress } from './api';
import { BackendError } from './errors';

// Hoisted above the imports by babel-jest, which is why they can sit here.
jest.mock('./supabaseClient', () => ({ backendEnabled: true, supabase: null }));
jest.mock('./api');

const keystoreReset = () => window.localStorage.clear();

const lessonA = { topic_id: 'physics:motion', kind: 'lesson_read', day: '2026-11-20' };
const lessonB = { topic_id: 'physics:force', kind: 'lesson_read', day: '2026-11-21' };

beforeEach(() => {
  stopSync();
  keystoreReset();
  jest.clearAllMocks();
  getSessionUser.mockResolvedValue(null);
  onAuthChange.mockReturnValue(() => {});
  fetchProgress.mockResolvedValue([]);
  pushProgress.mockResolvedValue(0);
});

describe('topic ids', () => {
  test('a title resolves to subject:slug, and a title outside the curriculum does not resolve', () => {
    // The id is built from the slug so that editing a title cannot orphan
    // someone's progress. Motion really is `motion` under physics today.
    expect(resolveTopicId('physics', 'Motion')).toBe('physics:motion');
    expect(resolveTopicId('physics', 'A topic that does not exist')).toBeNull();
    // Black hole levels and deep reads are not curriculum topics. There is no
    // stable id for them, so they must not be given an invented one.
    expect(resolveTopicId('physics', 'The Singularity')).toBeNull();
  });

  test('the day is the local calendar day, not UTC', () => {
    const lateEvening = new Date(2026, 10, 20, 23, 45);
    expect(localDay(lateEvening)).toBe('2026-11-20');
  });
});

describe('the local copy is written first', () => {
  test('reading a lesson stores the event here before any request', async () => {
    const ok = recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });
    expect(ok).toBe(true);
    expect(readLocalEvents()).toEqual([lessonA]);
    // Signed out: nothing was attempted.
    expect(pushProgress).not.toHaveBeenCalled();
  });

  test('the same lesson on the same day is stored once', () => {
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });
    expect(readLocalEvents()).toHaveLength(1);
  });

  test('the old usage log is mapped through the registry, not read raw', () => {
    // Exactly what the app wrote before progress had its own key.
    window.localStorage.setItem(
      KEYS.EVENTS,
      JSON.stringify({
        v: 1,
        data: [
          {
            name: 'lesson_completed',
            lesson: 'Motion',
            subject: 'physics',
            timestamp: '2026-11-20T10:00:00.000Z',
          },
          // A lesson that is not a curriculum topic cannot be given an id.
          { name: 'lesson_completed', lesson: 'Nowhere', subject: 'physics', timestamp: '2026-11-20T10:00:00.000Z' },
        ],
      }),
    );
    const collected = collectLocalProgress();
    expect(collected).toHaveLength(1);
    expect(collected[0].topic_id).toBe('physics:motion');
  });
});

describe('sign-in reconciling', () => {
  test('empty local and empty remote leaves both empty and does not push', async () => {
    await syncNow();
    expect(fetchProgress).toHaveBeenCalledTimes(1);
    expect(pushProgress).toHaveBeenCalledWith([]);
    expect(readLocalEvents()).toEqual([]);
    expect(getSyncState().status).toBe(SYNC_STATUS.SYNCED);
  });

  test('empty local and a remote account copies the account down', async () => {
    fetchProgress.mockResolvedValue([lessonA, lessonB]);
    await syncNow();
    expect(readLocalEvents()).toEqual([lessonA, lessonB]);
    expect(pushProgress).toHaveBeenCalledWith([]);
  });

  test('empty remote and local work sends everything local up', async () => {
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });
    recordProgressEvent({ subject: 'physics', topicId: 'force', day: '2026-11-21' });
    await syncNow();
    expect(pushProgress).toHaveBeenCalledWith([lessonA, lessonB]);
  });

  test('signing in twice sends nothing the second time', async () => {
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });
    fetchProgress.mockResolvedValue([]);
    await syncNow();
    expect(pushProgress).toHaveBeenLastCalledWith([lessonA]);

    // The server now has it. A second sign-in must produce no rows at all.
    fetchProgress.mockResolvedValue([lessonA]);
    await syncNow();
    expect(pushProgress).toHaveBeenLastCalledWith([]);
    expect(readLocalEvents()).toEqual([lessonA]);
  });

  test('a union that both sides contributed keeps every event exactly once', async () => {
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });
    fetchProgress.mockResolvedValue([lessonA, lessonB]);
    await syncNow();
    expect(readLocalEvents()).toHaveLength(2);
    // Already on the server, so it is not sent again.
    expect(pushProgress).toHaveBeenCalledWith([]);
  });
});

describe('failure is a state, not a lie', () => {
  test('never says synced before the push resolves', async () => {
    let release;
    pushProgress.mockImplementation(
      () => new Promise((resolve) => {
        release = resolve;
      }),
    );
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });

    const run = syncNow();
    // Wait until the push has actually been attempted rather than counting
    // microtasks: the number of awaits before it depends on internals.
    while (pushProgress.mock.calls.length === 0) {
      await Promise.resolve();
    }
    expect(getSyncState().status).toBe(SYNC_STATUS.SYNCING);

    release(1);
    await run;
    expect(getSyncState().status).toBe(SYNC_STATUS.SYNCED);
  });

  test('offline keeps the local event and reports offline', async () => {
    fetchProgress.mockRejectedValue(
      new BackendError('offline', 'You look offline. Everything is still saved on this device.'),
    );
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });

    await syncNow();
    expect(getSyncState().status).toBe(SYNC_STATUS.OFFLINE);
    expect(getSyncState().error).toMatch(/still saved on this device/i);
    expect(readLocalEvents()).toEqual([lessonA]);
  });

  test('going back online reconciles what was written while offline', async () => {
    fetchProgress.mockRejectedValue(new BackendError('offline', 'You look offline.'));
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });
    await syncNow();
    expect(getSyncState().status).toBe(SYNC_STATUS.OFFLINE);

    fetchProgress.mockResolvedValue([]);
    pushProgress.mockResolvedValue(1);
    await retryNow();

    expect(getSyncState().status).toBe(SYNC_STATUS.SYNCED);
    expect(pushProgress).toHaveBeenLastCalledWith([lessonA]);
  });

  test('a failed push is failed, not synced, and a retry sends it', async () => {
    pushProgress.mockRejectedValueOnce(
      new BackendError('unknown', 'Something went wrong on our side. Try again in a moment.'),
    );
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });

    await syncNow();
    expect(getSyncState().status).toBe(SYNC_STATUS.FAILED);
    expect(getSyncState().pending).toBe(1);
    expect(readLocalEvents()).toEqual([lessonA]);

    pushProgress.mockResolvedValue(1);
    await retryNow();
    expect(getSyncState().status).toBe(SYNC_STATUS.SYNCED);
    expect(getSyncState().pending).toBe(0);
    expect(readLocalEvents()).toEqual([lessonA]);
  });

  test('subscribers see the status go through syncing before synced', async () => {
    const seen = [];
    const stop = subscribe((snapshot) => seen.push(snapshot.status));
    await syncNow();
    stop();
    expect(seen).toContain(SYNC_STATUS.SYNCING);
    expect(seen[seen.length - 1]).toBe(SYNC_STATUS.SYNCED);
    // And it never went straight to synced without a syncing in between.
    expect(seen.indexOf(SYNC_STATUS.SYNCING)).toBeLessThan(seen.lastIndexOf(SYNC_STATUS.SYNCED));
  });
});

describe('the registry key', () => {
  test('progress is stored under its own versioned key, not bolted onto the usage log', () => {
    recordProgressEvent({ subject: 'physics', topicId: 'motion', day: '2026-11-20' });
    const raw = JSON.parse(window.localStorage.getItem(KEYS.PROGRESS_EVENTS));
    expect(raw.v).toBe(1);
    expect(raw.data).toEqual([lessonA]);
    expect(readValue(KEYS.PROGRESS_EVENTS)).toEqual([lessonA]);
  });
});
