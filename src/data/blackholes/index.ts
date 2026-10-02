/**
 * The ten (eleven, counting Level 0) levels of the black hole material, merged.
 *
 * One file per level, merged here, so a level is added by adding a file and
 * editing two lists: this one and the import block above it. That is the same
 * arrangement the Curious Dictionary uses, and it exists so that no single file
 * holds the whole subject.
 *
 * Levels are validated on import. A level with a missing field, an entry with an
 * unknown status, or a "deeper note" too short to be one fails the build rather
 * than reaching a reader as a heading with nothing under it.
 */
import { BlackHoleLevel, validateLevel } from './schema';

import LEVEL_0 from './level0-big-picture';
import LEVEL_1 from './level1-basics';
import LEVEL_2 from './level2-formation';
import LEVEL_3 from './level3-anatomy';
import LEVEL_4 from './level4-evidence';
import LEVEL_5 from './level5-relativity';
import LEVEL_6 from './level6-thermodynamics';

const ALL: BlackHoleLevel[] = [LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6];

ALL.forEach((level) => validateLevel(level, 'blackholes/index'));

/** Sorted by number, so the sidebar order does not depend on import order. */
export const BLACK_HOLE_LEVELS = [...ALL].sort((first, second) => first.number - second.number);

export const findLevel = (id: string) => BLACK_HOLE_LEVELS.find((level) => level.id === id);

export const TOTAL_ENTRIES = BLACK_HOLE_LEVELS.reduce(
  (total, level) => total + (level.entries?.length ?? 0),
  0
);

export * from './schema';
export * from './glossary';