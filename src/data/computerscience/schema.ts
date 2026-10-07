 /**
 * The shape every computer science entry has, in one place.
 *
 * The four content fields are identical to the physics, philosophy and history
 * schemas - name, the plain version, the mechanism, what it changes - and that
 * is deliberate. The point of building a fourth subject this way is that nothing
 * had to be invented to accommodate it.
 *
 * WHY THIS SUBJECT NEEDS FIVE STATUS TIERS AND NOT THREE
 * -------------------------------------------------------
 * The three subjects before it each had a three-way split, and each split was
 * forced by that discipline's answer to "what settles this?".
 *
 *   Physics     a measurement             -> established / theoretical / contested
 *   Philosophy  no measurement exists     -> settled / debated / open
 *   History     a surviving record        -> well-documented / disputed / contested
 *
 * Computer science has three different things that settle claims, which is why
 * it needs five tiers and not three. The extra two are the point of building
 * this subject next:
 *
 * - 'proved'  a proof settles it. Nothing that happens on hardware can overturn
 *             the FLP impossibility result, because it is not a claim about any
 *             machine. No other subject here has a tier for "mathematically
 *             settled", because for physics an experiment is in principle always
 *             available.
 *
 * - 'machine-dependent' is the genuinely new tier, and the reason this subject
 *             was worth doing now. In the other three, a claim that survives
 *             checking is simply true. Here a number can be exactly right and
 *             still stop being true when the hardware, the library version or the
 *             kernel changes. Java's HashMap was a constant-time lookup until
 *             JDK 8 treeified long buckets at a threshold of 8; the Linux
 *             delayed-ACK timer is 40 ms and TCP_NODELAY makes it 0. Labelling
 *             these 'proved' or 'measured' would be misleading, and labelling
 *             them 'contested' would be wrong too, because nobody is arguing
 *             about them. They are settled *conditionally*, and the condition is
 *             the interesting part.
 *
 * - 'open'    a named problem nobody has solved and nobody claims to have.
 *             P vs NP is the example. This is a different epistemic state from
 *             'contested', and merging them would be the exact failure these
 *             labels exist to prevent: a live disagreement between experts
 *             (quantum advantage) and an agreed-unsolved question (P vs NP) are
 *             not the same claim and must not wear the same label.
 *
 * The five tiers are used where the epistemics demand them, not to hit a quota.
 * computerscience.test.ts requires at least one entry in each tier but does not
 * require equal numbers, and 'machine-dependent' has two entries because two is
 * what the material honestly supports.
 */

export type CsStatus =
  | 'proved'
  | 'measured'
  | 'machine-dependent'
  | 'contested'
  | 'open';

export const STATUS_LABELS: Record<CsStatus, string> = {
  proved: 'Proved',
  measured: 'Measured',
  'machine-dependent': 'Machine-dependent',
  contested: 'Actively contested',
  open: 'Open problem',
};

export const STATUS_ORDER: CsStatus[] = [
  'proved',
  'measured',
  'machine-dependent',
  'contested',
  'open',
];

export interface CsEntry {
  /** Stable id, kebab-case. Used as a React key and for glossary cross-links. */
  id: string;
  /** The term as it should be read. Matches the Atlas topic wherever one exists. */
  name: string;
  /**
   * One or two sentences, no jargon.
   *
   * Computer science is the one subject here whose reader is most likely to be
   * quietly misled by a confident one-line summary, because the summary is
   * usually true and usually hiding a condition. So the plain version leads with
   * the mechanism, not the label.
   */
  simple: string;
  /**
   * The mechanism, worked through concretely. Inline terms are marked with
   * {{double braces}} and rendered by <GlossaryTerm>.
   *
   * The voice rule, specific to this subject: at least one of a named constant,
   * a named version, a named person, or a named incident per hard idea. The
   * memory-hierarchy entry is worthless without the actual cell counts; the
   * undefined-behaviour entry is worthless without a compiler actually deleting
   * a check. "Computers are fast" could be pasted into any subject and is the
   * failure this field exists to prevent.
   */
  deeper: string;
  /**
   * What this changes about how the reader should reason about software they did
   * not write. For a contested or open entry this states the live disagreement,
   * not merely that one exists.
   */
  matters: string;
  status: CsStatus;
  /**
   * Where the numbers and dates come from. Optional in the type but required in
   * practice for four of the five tiers: 'proved', 'measured',
   * 'machine-dependent' and 'open' all make claims a reader could check, and the
   * validator below refuses an entry in those tiers that names no source. The
   * only tier where an unsourced entry is permitted is 'contested', because there
   * the evidence is usually the disagreement itself, which the entry must
   * describe rather than cite.
   */
  source?: string;
  sourceUrl?: string;
}

export interface CsLevel {
  id: string;
  /** 0-10, mirroring the other subjects' numbering, which the rail renders. */
  number: number;
  title: string;
  /** One line for the nav rail: a reader should know what is in a level from here. */
  blurb: string;
  /** A short paragraph before the entries. Level 0 is this and nothing else. */
  intro?: string;
  entries?: CsEntry[];
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
 * rather than an explanation.
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

  if (!STATUS_ORDER.includes(record.status as CsStatus)) {
    throw new Error(
      `${where}: entry ${String(record.id)} has status "${String(record.status)}", which is not one of ${STATUS_ORDER.join(', ')}`
    );
  }

  const deeper = record.deeper as string;
  const matters = record.matters as string;
  if (deeper.length < 120) {
    throw new Error(`${where}: entry ${record.id} has a "deeper" account of ${deeper.length} characters, too short to be an explanation`);
  }
  if (matters.length < 80) {
    throw new Error(`${where}: entry ${record.id} has a "matters" line of ${matters.length} characters, too short to say what it changes`);
  }
  if ((record.simple as string).length > 600) {
    throw new Error(`${where}: entry ${record.id} has a "simple" explanation over 600 characters, which is not simple`);
  }

  // Four of the five tiers assert something a reader could go and check: a
  // proof, a measured number, a conditional fact with a version attached, or the
  // open status of a named problem. Each is exactly the kind of claim that rots
  // into folklore if nobody records where it came from, so the source is
  // mandatory for them.
  //
  // 'measured' is included here even though it is less obvious why: a benchmark
  // number without the hardware it was measured on is the single most common way
  // a computer science fact becomes wrong while still sounding right.
  const NEEDS_SOURCE: CsStatus[] = ['proved', 'measured', 'machine-dependent', 'open'];
  if (NEEDS_SOURCE.includes(record.status as CsStatus)) {
    if (!String(`${record.source ?? ''}${record.sourceUrl ?? ''}`).trim()) {
      throw new Error(
        `${where}: entry ${String(record.id)} is labelled "${String(record.status)}" with no source behind it`
      );
    }
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
