/**
 * The five levels of the history material, merged.
 *
 * One file per level, merged here, exactly as the physics and philosophy subjects
 * do it. History is the third subject built this way, and the fact that a
 * third discipline with a different evidentiary culture could be added without
 * inventing a new convention is the result the content work was meant to
 * produce rather than a claim made about it.
 *
 * Levels are validated on import. A level with a missing field, an entry with an
 * unknown status, an account too short to be history, or any label without a
 * source behind it fails the build rather than reaching a reader as a heading
 * with nothing under it.
 */
import { HistoryLevel, validateLevel } from './schema';

import LEVEL_0 from './level0-how-we-know';
import LEVEL_1 from './level1-ancient-worlds';
import LEVEL_2 from './level2-words-and-numbers';
import LEVEL_3 from './level3-rights-and-rule';
import LEVEL_4 from './level4-the-century-of-wars';

const ALL: HistoryLevel[] = [LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4];

ALL.forEach((level) => validateLevel(level, 'history/index'));

/** Sorted by number, so the rail order does not depend on import order. */
export const HISTORY_LEVELS = [...ALL].sort((first, second) => first.number - second.number);

export const findLevel = (id: string) => HISTORY_LEVELS.find((level) => level.id === id);

export const TOTAL_ENTRIES = HISTORY_LEVELS.reduce(
  (total, level) => total + (level.entries?.length ?? 0),
  0
);

export * from './schema';
export * from './glossary';