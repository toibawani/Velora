/**
 * The six levels of the computer science material, merged - Level 0 through
 * Level 5.
 *
 * One file per level, merged here, exactly as the physics, philosophy and history
 * subjects do it. Computer science is the fourth subject built this way, and the
 * fact that a discipline with genuinely different epistemics - one that needs
 * five status tiers where the other three needed three - could be added with a
 * new schema and no change to the reader, the glossary join, or the resolver, is
 * the result the content work was meant to produce rather than a claim made
 * about it.
 *
 * Levels are validated on import. A level with a missing field, an entry with an
 * unknown status, an explanation too short to be one, or a claim in a tier that
 * requires a source and has none fails the build rather than reaching a reader as
 * a heading with nothing under it.
 */
import { CsLevel, validateLevel } from './schema';

import LEVEL_0 from './level0-how-we-know';
import LEVEL_1 from './level1-the-machine';
import LEVEL_2 from './level2-fast-and-correct';
import LEVEL_3 from './level3-many-machines';
import LEVEL_4 from './level4-learning-from-data';
import LEVEL_5 from './level5-the-frontier';

const ALL: CsLevel[] = [LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];

ALL.forEach((level) => validateLevel(level, 'computerscience/index'));

/** Sorted by number, so the rail order does not depend on import order. */
export const CS_LEVELS = [...ALL].sort((first, second) => first.number - second.number);

export const findLevel = (id: string) => CS_LEVELS.find((level) => level.id === id);

export const TOTAL_ENTRIES = CS_LEVELS.reduce(
  (total, level) => total + (level.entries?.length ?? 0),
  0
);

export * from './schema';
export * from './glossary';