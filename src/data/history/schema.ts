/**
 * The shape every history entry has, in one place.
 *
 * It is deliberately the same four fields as the black hole and philosophy
 * entries - name, the plain version, the mechanism, and what it changes - because
 * the point of this subject, as with philosophy, is to find out whether that shape
 * generalises. What does not generalise is the status label, and history needs its
 * own for the same reason philosophy did.
 *
 * WHY THE LABELS ARE DIFFERENT AGAIN
 * ------------------------------------
 * Physics could say "established" and mean it, because a measurement decides the
 * question. Philosophy could not, because its questions have no measurement to
 * appeal to. History sits in between, and that produces a three-way split neither
 * of the other subjects has:
 *
 * - 'well-documented'  the contemporary record establishes what happened and its
 *                      broad shape. That is a claim about the evidence, not about
 *                      interpretation: ancient Egypt being well-documented does not
 *                      mean everyone agrees what its monuments were for.
 * - 'disputed'        the events are known and historians actively disagree about
 *                      cause, weight, or consequence. The origins of the First
 *                      World War, and how far the Enlightenment shaped the French
 *                      Revolution, are both live. An entry that resolved one of
 *                      these in passing would be the exact failure this build
 *                      exists to remove.
 * - 'contested'       stronger than disputed: not only the explanation but the
 *                      framing or the category itself is under active challenge.
 *                      "Colonialism" and "Age of Exploration" sit here, because the
 *                      terms themselves - what counts as contact, whose "discovery"
 *                      - are part of the argument. Labelling these merely 'disputed'
 *                      would imply the framework is agreed and only the details are
 *                      in dispute, which is the opposite of the case.
 *
 * The label describes the claim the entry actually makes, not the topic as a
 * whole. The entry called "Ancient Rome" is 'well-documented' because the card's
 * claim is what the sources establish about republican and imperial institutions;
 * the fall of Rome is a separate question the card names as such rather than
 * letting the settled-looking label cover it.
 */

export type HistoryStatus = 'well-documented' | 'disputed' | 'contested';

export const STATUS_LABELS: Record<HistoryStatus, string> = {
  'well-documented': 'Well-documented',
  disputed: 'Disputed among historians',
  contested: 'Contested framing',
};

export const STATUS_ORDER: HistoryStatus[] = ['well-documented', 'disputed', 'contested'];

export interface HistoryEntry {
  /** Stable id, kebab-case. Used as a React key and for glossary cross-links. */
  id: string;
  /** The term as it should be read. Matches the Atlas topic wherever one exists. */
  name: string;
  /**
   * One or two sentences, no jargon. History's plain version usually opens with a
   * concrete person, place, or moment, because a history card that opens "The
   * Industrial Revolution was a period of..." has already lost the reader.
   */
  simple: string;
  /**
   * The account worked through concretely, drawing on the primary record where
   * it exists. Inline terms are marked with {{double braces}} and rendered by
   * <GlossaryTerm>.
   *
   * The rule is the same as the other subjects: a paragraph that could be lifted
   * into a different topic unchanged is too generic. History's version of the
   * voice rule is specific dates, named people, and at least one primary detail -
   * an actual quotation, an actual number, an actual decision in a named room.
   * "Many believed the war was inevitable" is not an entry; what Moltke or Bethmann
   * Hollweg actually said in July 1914 is.
   */
  deeper: string;
  /**
   * What this actually changes about how the reader understands the period or the
   * discipline. This is the field that keeps an entry from being trivia: for a
   * contested entry it has to say what the live disagreement actually is rather
   * than merely that one exists.
   */
  matters: string;
  status: HistoryStatus;
  /** Where the account and the interpretation come from. */
  source?: string;
  sourceUrl?: string;
}

export interface HistoryLevel {
  id: string;
  /** 0-10, mirroring the other subjects' numbering, which the rail renders. */
  number: number;
  title: string;
  /** One line for the nav rail: a reader should know what is in a level from here. */
  blurb: string;
  /** A short paragraph before the entries. Level 0 is this and nothing else. */
  intro?: string;
  entries?: HistoryEntry[];
}
const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * Throws on anything that would render as a broken card.
 *
 * Runs at module load rather than only in a test, so a malformed entry fails the
 * build instead of reaching a reader as a heading with nothing under it. The
 * bounds match the other subjects' schemas and do the same job: "simple" over 600
 * characters is not simple, and a two-line "deeper" account is a decoration
 * rather than history.
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

  if (!STATUS_ORDER.includes(record.status as HistoryStatus)) {
    throw new Error(
      `${where}: entry ${String(record.id)} has status "${String(record.status)}", which is not one of ${STATUS_ORDER.join(', ')}`
    );
  }

  const deeper = record.deeper as string;
  const matters = record.matters as string;
  if (deeper.length < 120) {
    throw new Error(`${where}: entry ${record.id} has a "deeper" account of ${deeper.length} characters, too short to be history`);
  }
  if (matters.length < 80) {
    throw new Error(`${where}: entry ${record.id} has a "matters" line of ${matters.length} characters, too short to say what it changes`);
  }
  if ((record.simple as string).length > 600) {
    throw new Error(`${where}: entry ${record.id} has a "simple" explanation over 600 characters, which is not simple`);
  }

  // Every status here carries an obligation to say where the account comes from.
  // History has no 'open' tier the way philosophy does, so there is no label here
  // that excuses an unsourced claim.
  if (!String(`${record.source ?? ''}${record.sourceUrl ?? ''}`).trim()) {
    throw new Error(`${where}: entry ${record.id} is labelled "${String(record.status)}" with no source behind it`);
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