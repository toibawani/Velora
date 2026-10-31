/**
 * What the games have actually produced on this device.
 *
 * Six games each kept their round in component state, which meant the number a
 * player earned disappeared the moment they went back to the hub, and the hub
 * itself could say nothing about any game except its name. Someone deciding
 * what to play had no way to tell that they had never finished Concept
 * Scrabble, and someone who had just scored 1200 in Word Puzzle had no way to
 * see it beat last week's round.
 *
 * Two values per game, and neither invents a comparison the games do not
 * support:
 *
 *   best  - the highest score seen, kept alongside `max` because the games are
 *           not scored on the same scale. Concept Scrabble pays 500 a term and
 *           Concept Check pays 10 a question, so a bare "1600" would invite a
 *           comparison between rounds that were not measuring the same thing.
 *   plays - rounds finished. Started and abandoned does not count, because the
 *           games only report when they reach their own end screen.
 *
 * Nothing here is a measure of understanding and the hub does not present it as
 * one. It is a record of what happened, which is the only thing a score is.
 */
import { KEYS, readValue, writeValue } from './storage';

/** The shape stored under KEYS.GAME_RESULTS: game id to one record. */
export const EMPTY_RESULTS = {};

/**
 * How many recent rounds each game keeps.
 *
 * Best and plays were enough to say what a game had produced and nothing about
 * how it was going. Five is enough for a player to see the last few attempts
 * without turning the record into a database: the number the card shows is
 * still the best, and the history only exists to say whether the latest round
 * was it.
 */
export const RECENT_ROUNDS = 5;

const isRound = (round) =>
  round !== null &&
  typeof round === 'object' &&
  Number.isFinite(Number(round.score)) &&
  typeof round.at === 'string';

const isRecord = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Every game's record, with anything malformed left out.
 *
 * Storage is shared with older builds and with whatever a person typed into a
 * devtools console, so this reads defensively rather than trusting the shape:
 * a damaged entry is dropped, not thrown, because a hub that refuses to render
 * is worse than a hub that has forgotten one score.
 */
export function getGameResults() {
  const stored = readValue(KEYS.GAME_RESULTS, EMPTY_RESULTS);
  if (!isRecord(stored)) return { ...EMPTY_RESULTS };

  const results = {};
  Object.entries(stored).forEach(([gameId, record]) => {
    if (!isRecord(record)) return;
    const best = Number(record.best);
    const max = Number(record.max);
    const plays = Number(record.plays);
    // A record written before rounds were kept has none, and one written by
    // something else may have anything at all in this field.
    const rounds = Array.isArray(record.rounds)
      ? record.rounds.filter(isRound).slice(0, RECENT_ROUNDS).map((round) => ({
          score: Number(round.score),
          max: Number.isFinite(Number(round.max)) ? Number(round.max) : 0,
          at: round.at,
        }))
      : [];
    const lastScore = Number(record.lastScore);

    results[gameId] = {
      best: Number.isFinite(best) ? best : 0,
      max: Number.isFinite(max) ? max : 0,
      plays: Number.isFinite(plays) && plays > 0 ? Math.floor(plays) : 0,
      at: typeof record.at === 'string' ? record.at : null,
      lastScore: Number.isFinite(lastScore)
        ? lastScore
        : rounds.length > 0
        ? rounds[0].score
        : null,
      bestAt: typeof record.bestAt === 'string' ? record.bestAt : null,
      rounds,
    };
  });
  return results;
}

/** One game's record, or null if that game has never reached its own end screen. */
export function getGameResult(gameId) {
  return getGameResults()[gameId] || null;
}

/**
 * Records a finished round and returns the record as it now stands.
 *
 * `plays` always increments; `best` only when this round beat the stored one,
 * which is why it is kept next to the score it was earned on rather than
 * compared against a number of unknown scale. `id` is never guessed from a
 * name, so a renamed game keeps its history.
 */
export function recordGameResult(gameId, { score, max } = {}) {
  if (typeof gameId !== 'string' || !gameId) return null;

  const results = getGameResults();
  const previous = results[gameId] || { best: 0, max: 0, plays: 0, at: null };

  const numericScore = Number(score);
  const numericMax = Number(max);
  const rounded = Number.isFinite(numericScore) ? numericScore : 0;
  const maxValue = Number.isFinite(numericMax) ? numericMax : previous.max;

  const stamp = nextStamp();
  const beatTheBest = rounded > previous.best;
  const record = {
    best: Math.max(previous.best, rounded),
    max: Math.max(previous.max, maxValue),
    plays: previous.plays + 1,
    at: stamp,
    // The last round played, kept apart from `best`. Without it there is no way
    // to tell a player who just scored 1200 from one who scored 1200 last week.
    lastScore: rounded,
    // When the best was set. A best with no date reads as something earned today.
    bestAt: beatTheBest ? stamp : previous.bestAt || previous.at || null,
    rounds: [
      { score: rounded, max: maxValue, at: stamp },
      ...(previous.rounds || []),
    ].slice(0, RECENT_ROUNDS),
  };

  const next = { ...results, [gameId]: record };
  writeValue(KEYS.GAME_RESULTS, next);
  return record;
}

/**
 * Whether the newest round is the best one, or merely another try.
 *
 * Only after more than one round: calling a first round a new best says nothing
 * a player does not already know, and the card already shows the score.
 */
export const isLatestBest = (record) =>
  Boolean(
    record &&
      record.plays > 1 &&
      Array.isArray(record.rounds) &&
      record.rounds.length > 0 &&
      record.rounds[0].score >= record.best,
  );

/** When the best round happened, or null when no date was kept. */
export const bestDate = (record) => {
  if (!record) return null;
  const stored = record.bestAt || (record.rounds && record.rounds[0] && record.rounds[0].at);
  return typeof stored === 'string' ? stored : null;
};

/**
 * When, in words, a round was played: "today", "yesterday", "3 days ago".
 *
 * The hub says which game was last played and a date - but a date reads as
 * history, and "Oct 29" beside "last played" makes someone work out whether
 * that was this morning or last week. Days rather than hours, because a game
 * played at 11pm and reopened at 1am is not "2 hours ago" to a person.
 *
 * Empty string when there is no usable date, so a caller can leave the clause
 * out rather than print "last played Invalid Date".
 */
export function playedWhen(record, now = new Date()) {
  const stored = record && record.at;
  if (typeof stored !== 'string') return '';
  const then = new Date(stored);
  if (Number.isNaN(then.getTime())) return '';

  const startOfDay = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(then)) / 86400000);

  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? 'last week' : `${weeks} weeks ago`;
  }
  return 'over a month ago';
}

/** Forgets every game's record on this device. */
export const clearGameResults = () => {
  writeValue(KEYS.GAME_RESULTS, {});
  return {};
};

/** The game most recently finished, or null. The hub offers to reopen it. */
export function getLastPlayedGame() {
  const results = getGameResults();
  let latest = null;
  Object.entries(results).forEach(([gameId, record]) => {
    if (!record.at) return;
    if (!latest || record.at > latest.at) latest = { gameId, ...record };
  });
  return latest;
}

/**
 * The moment this round finished, never the same as the last one recorded.
 *
 * Two rounds can finish inside the same millisecond - a one-question replay, or
 * a pair of games closed seconds apart by a fast clicker - and a shared
 * timestamp makes "which was played last" depend on the order keys happen to
 * sit in a stored object. Bumping past the previous stamp costs nothing and
 * means the hub's offer to reopen a game cannot point at the wrong one.
 */
function nextStamp() {
  const previous = getLastPlayedGame();
  const now = Date.now();
  if (previous && Date.parse(previous.at) >= now) return new Date(Date.parse(previous.at) + 1).toISOString();
  return new Date(now).toISOString();
}

/**
 * "1200 of 1600" rather than "1200".
 *
 * The rounds are scored on different scales, so the fraction is what makes a
 * score mean anything at all on a grid where six of them sit side by side.
 */
export function formatResult(record) {
  if (!record) return '';
  return record.max > 0 ? `${record.best} of ${record.max}` : `${record.best}`;
}

export default getGameResults;
