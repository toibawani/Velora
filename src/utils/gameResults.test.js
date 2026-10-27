import {
  getGameResults,
  getGameResult,
  recordGameResult,
  getLastPlayedGame,
  formatResult,
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

test('the fraction is what a score is shown as, because the scales differ', () => {
  expect(formatResult({ best: 1200, max: 1600 })).toBe('1200 of 1600');
  expect(formatResult({ best: 3, max: 0 })).toBe('3');
  expect(formatResult(null)).toBe('');
});
