import {
  RECENT_ROUNDS,
  getGameResults,
  getGameResult,
  recordGameResult,
  getLastPlayedGame,
  formatResult,
  isLatestBest,
  bestDate,
  clearGameResults,
} from './gameResults';
import { KEYS } from './storage';

beforeEach(() => {
  window.localStorage.clear();
});

test('a device that has never finished a round reports nothing, not zero', () => {
  expect(getGameResults()).toEqual({});
  expect(getGameResult('puzzle')).toBeNull();
  expect(getLastPlayedGame()).toBeNull();
});

test('a finished round is remembered with what it was scored out of', () => {
  recordGameResult('puzzle', { score: 1200, max: 1600 });
  expect(getGameResult('puzzle')).toMatchObject({ best: 1200, max: 1600, plays: 1 });
});

test('a worse round counts as a play without replacing the best', () => {
  recordGameResult('puzzle', { score: 1200, max: 1600 });
  recordGameResult('puzzle', { score: 400, max: 1600 });
  expect(getGameResult('puzzle')).toMatchObject({ best: 1200, plays: 2 });
});

test('a better round takes over', () => {
  recordGameResult('puzzle', { score: 400, max: 1600 });
  recordGameResult('puzzle', { score: 1500, max: 1600 });
  expect(getGameResult('puzzle')).toMatchObject({ best: 1500, plays: 2 });
});

test('games keep separate records, so one scale cannot flatter another', () => {
  recordGameResult('scrabble', { score: 500, max: 5000 });
  recordGameResult('quiz', { score: 140, max: 140 });
  expect(getGameResults().scrabble).toMatchObject({ best: 500, max: 5000 });
  expect(getGameResults().quiz).toMatchObject({ best: 140, max: 140 });
});

test('the most recently finished game is the one offered back', () => {
  recordGameResult('quiz', { score: 10, max: 140 });
  recordGameResult('chain', { score: 30, max: 30 });
  expect(getLastPlayedGame().gameId).toBe('chain');
});

test('a stored entry that is not a record is dropped rather than trusted', () => {
  window.localStorage.setItem(
    KEYS.GAME_RESULTS,
    JSON.stringify({ v: 1, data: { quiz: 'nonsense', chain: { best: 3, max: 4, plays: 1 } } })
  );
  const results = getGameResults();
  expect(results.quiz).toBeUndefined();
  expect(results.chain).toMatchObject({ best: 3, plays: 1 });
});

test('a score stored as text or a negative play count is not passed through', () => {
  window.localStorage.setItem(
    KEYS.GAME_RESULTS,
    JSON.stringify({ v: 1, data: { quiz: { best: '140', max: 140, plays: -2 } } })
  );
  expect(getGameResult('quiz')).toMatchObject({ best: 140, plays: 0 });
});

test('a game with no id is not recorded', () => {
  expect(recordGameResult('', { score: 1 })).toBeNull();
  expect(getGameResults()).toEqual({});
});

describe('the rounds behind a record', () => {
  beforeEach(() => localStorage.clear());

  test('keeps the last few rounds, newest first', () => {
    recordGameResult('quiz', { score: 10, max: 140 });
    recordGameResult('quiz', { score: 20, max: 140 });
    recordGameResult('quiz', { score: 30, max: 140 });

    const record = getGameResult('quiz');
    expect(record.rounds.map((round) => round.score)).toEqual([30, 20, 10]);
    expect(record.lastScore).toBe(30);
  });

  test('holds a fixed number of rounds rather than growing forever', () => {
    for (let i = 1; i <= RECENT_ROUNDS + 4; i += 1) recordGameResult('quiz', { score: i, max: 10 });
    expect(getGameResult('quiz').rounds).toHaveLength(RECENT_ROUNDS);
  });

  test('separates the last round from the best one', () => {
    recordGameResult('quiz', { score: 90, max: 140 });
    recordGameResult('quiz', { score: 40, max: 140 });

    const record = getGameResult('quiz');
    expect(record.best).toBe(90);
    expect(record.lastScore).toBe(40);
    expect(isLatestBest(record)).toBe(false);
  });

  test('knows when the newest round is a new best, but says nothing after one round', () => {
    recordGameResult('quiz', { score: 40, max: 140 });
    expect(isLatestBest(getGameResult('quiz'))).toBe(false);

    recordGameResult('quiz', { score: 90, max: 140 });
    expect(isLatestBest(getGameResult('quiz'))).toBe(true);
  });

  test('dates the best round rather than leaving it undated', () => {
    recordGameResult('quiz', { score: 40, max: 140 });
    const first = bestDate(getGameResult('quiz'));
    expect(Number.isNaN(Date.parse(first))).toBe(false);

    // A worse round must not move the date the best was set.
    recordGameResult('quiz', { score: 10, max: 140 });
    expect(bestDate(getGameResult('quiz'))).toBe(first);
  });

  test('a record from before rounds were kept still reads as a record', () => {
    window.localStorage.setItem(
      KEYS.GAME_RESULTS,
      JSON.stringify({ v: 1, data: { quiz: { best: 70, max: 140, plays: 3, at: '2026-10-01T10:00:00.000Z' } } }),
    );
    const record = getGameResult('quiz');
    expect(record).toMatchObject({ best: 70, plays: 3 });
    expect(record.rounds).toEqual([]);
    expect(isLatestBest(record)).toBe(false);
  });

  test('a malformed round is dropped rather than rendered', () => {
    window.localStorage.setItem(
      KEYS.GAME_RESULTS,
      JSON.stringify({
        v: 1,
        data: {
          quiz: {
            best: 20,
            max: 20,
            plays: 2,
            at: '2026-10-01T10:00:00.000Z',
            rounds: [{ score: 20, max: 20, at: '2026-10-01T10:00:00.000Z' }, { score: 'x' }, null],
          },
        },
      }),
    );
    expect(getGameResult('quiz').rounds).toHaveLength(1);
  });

  test('every record can be forgotten at once', () => {
    recordGameResult('quiz', { score: 10, max: 10 });
    recordGameResult('puzzle', { score: 10, max: 10 });

    clearGameResults();

    expect(getGameResults()).toEqual({});
    expect(getLastPlayedGame()).toBeNull();
  });
});

test('the fraction is what a score is shown as, because the scales differ', () => {
  expect(formatResult({ best: 1200, max: 1600 })).toBe('1200 of 1600');
  expect(formatResult({ best: 3, max: 0 })).toBe('3');
  expect(formatResult(null)).toBe('');
});
