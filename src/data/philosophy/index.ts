/**
 * The philosophy material, merged.
 *
 * One file per level, merged here, exactly as the black hole subject does it.
 * That arrangement is the thing this subject was built to test: if the pattern
 * only worked for physics, this directory could not be assembled without
 * inventing a second convention, and the fact that it can is most of the answer.
 *
 * Levels are validated on import. A level with a missing field, an entry with an
 * unknown status, a "deeper" note too short to be an argument, or a 'settled' or
 * 'debated' label with no source behind it fails the build rather than reaching a
 * reader as a heading with nothing under it.
 */
import { PhilosophyLevel, validateLevel } from './schema';

import LEVEL_0 from './level0-big-picture';
import LEVEL_1 from './level1-what-is-there';
import LEVEL_2 from './level2-what-we-can-know';
import LEVEL_3 from './level3-what-we-should-do';
import LEVEL_4 from './level4-who-we-are';

const ALL: PhilosophyLevel[] = [LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4];

ALL.forEach((level) => validateLevel(level, 'philosophy/index'));

/** Sorted by number, so the rail order does not depend on import order. */
export const PHILOSOPHY_LEVELS = [...ALL].sort((first, second) => first.number - second.number);

export const findLevel = (id: string) => PHILOSOPHY_LEVELS.find((level) => level.id === id);

export const TOTAL_ENTRIES = PHILOSOPHY_LEVELS.reduce(
  (total, level) => total + (level.entries?.length ?? 0),
  0
);

export * from './schema';
export * from './glossary';
