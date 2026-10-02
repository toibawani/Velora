/**
 * The shape every black hole entry has, in one place.
 *
 * There were previously two different record shapes in this app for "a thing
 * that is explained": the Curious Dictionary has tagline/explanation/example/
 * source, and BlackHoleMastery had freeform heading/text pairs. They could not
 * be rendered by one component, so every screen built its own.
 *
 * These are the four fields the brief asks for, plus a status and an optional
 * source. Status is a closed union rather than a string so "settled" and
 * "settled-ish" cannot both reach the screen: the whole point of labelling an
 * entry is that the label means one of a known set of things.
 */

/**
 * How well the thing is actually pinned down.
 *
 * - 'established'  direct measurement, or a prediction confirmed to many digits
 * - 'theoretical'  a coherent model with no direct test yet
 * - 'contested'    active disagreement between competent people
 *
 * The information paradox, firewalls and primordial black holes as dark matter
 * are 'contested' or 'theoretical'. They are not 'established', and an entry
 * that quietly implied otherwise would be the exact failure this build spends
 * its time removing.
 */
export type BlackHoleStatus = 'established' | 'theoretical' | 'contested';

export const STATUS_LABELS: Record<BlackHoleStatus, string> = {
  established: 'Well-established',
  theoretical: 'Theoretical',
  contested: 'Unknown / contested',
};

export const STATUS_ORDER: BlackHoleStatus[] = ['established', 'theoretical', 'contested'];

export interface ConceptEntry {
  /** Stable id, kebab-case. Used as a React key and for glossary cross-links. */
  id: string;
  /** The term as it should be read. */
  name: string;
  /**
   * One or two sentences, no jargon. This is the part that has to work for
   * someone who has never taken a physics class, so it is where the analogy
   * goes and where a defining term is named rather than glossed.
   */
  simple: string;
  /**
   * The mechanism or the nuance. Still readable prose, not a derivation.
   * Inline terms are marked with {{double braces}} and rendered by
   * <GlossaryTerm>; see glossary.ts for why that is a parser and not a
   * component in the data.
   */
  deeper: string;
  /**
   * What this actually changes about how you understand the universe. This is
   * the field that keeps an entry from being trivia: it has to say what the
   * reader now sees differently.
   */
  matters: string;
  status: BlackHoleStatus;
  /** Where the numbers in this entry come from. Optional but preferred. */
  source?: string;
  sourceUrl?: string;
}

export interface BlackHoleLevel {
  id: string;
  /** 0-10. The brief's numbering, which the sidebar renders directly. */
  number: number;
  title: string;
  /** One line for the nav rail: a reader should know what is in a level from here. */
  blurb: string;
  /** A short paragraph before the entries. Level 0 is this and nothing else. */
  intro?: string;
  entries?: ConceptEntry[];
  /** Set on the level whose entries are all terms rather than concepts. */
  isGlossary?: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * Throws on anything that would render as a broken card.
 *
 * This runs at module load rather than only in a test, so a malformed entry
 * fails the build instead of reaching a reader as a heading with nothing under
 * it. The cost is a noisier failure; the benefit is that the screen cannot
 * render half an entry.
 */
export const validateEntry = (entry: unknown, where: string): void => {
  if (!isRecord(entry)) throw new Error(`${where}: entry is not an object`);
  const record = entry as Record<string, unknown>;

  ['id', 'name', 'simple', 'deeper', 'matters'].forEach((field) => {
    const value = record[field];
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${where}: entry ${String(record.id ?? '?')} is missing "${field}"`);
    }
  });

  if (!STATUS_ORDER.includes(record.status as BlackHoleStatus)) {
    throw new Error(
      `${where}: entry ${String(record.id)} has status "${String(record.status)}", which is not one of ${STATUS_ORDER.join(', ')}`
    );
  }

  // These fields exist to be read. A four-word "deeper note" is a decoration.
  const deeper = record.deeper as string;
  const matters = record.matters as string;
  if (deeper.length < 80) {
    throw new Error(`${where}: entry ${record.id} has a "deeper" note of ${deeper.length} characters, too short to be a note`);
  }
  if (matters.length < 60) {
    throw new Error(`${where}: entry ${record.id} has a "matters" line of ${matters.length} characters, too short to say what it changes`);
  }
  if ((record.simple as string).length > 600) {
    throw new Error(`${where}: entry ${record.id} has a "simple" explanation over 600 characters, which is not simple`);
  }
};

export const validateLevel = (level: unknown, where: string): void => {
  if (!isRecord(level)) throw new Error(`${where}: level is not an object`);
  const record = level as Record<string, unknown>;

  if (typeof record.number !== 'number') throw new Error(`${where}: level is missing "number"`);
  ['id', 'title', 'blurb'].forEach((field) => {
    if (typeof record[field] !== 'string' || (record[field] as string).trim() === '') {
      throw new Error(`${where}: level ${String(record.id ?? record.number)} is missing "${field}"`);
    }
  });

  const entries = record.entries;
  if (entries !== undefined) {
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error(`${where}: level ${record.id} has an empty or non-array "entries"`);
    }
    (entries as unknown[]).forEach((entry) => validateEntry(entry, `${where}/${record.id}`));
  }

  // A level with neither an intro nor entries renders as a blank page with a
  // heading on it, which is the one thing a level must never be.
  if (!record.intro && !record.entries) {
    throw new Error(`${where}: level ${record.id} has neither an intro nor any entries`);
  }
};