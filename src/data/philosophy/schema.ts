/**
 * The shape every philosophy entry has, in one place.
 *
 * It is deliberately the same four fields as the black hole entries - name, the
 * plain version, the mechanism, and what it changes - because the point of this
 * subject is to find out whether that shape generalises. It largely does. What
 * does not generalise is the status label, and that is the interesting part.
 *
 * WHY THE LABELS ARE DIFFERENT FROM PHYSICS
 * -----------------------------------------
 * Physics can say "established" and mean it, because a measurement decides the
 * question. Philosophy mostly cannot: the interesting questions are the ones
 * where measurement is not the arbiter. Forcing 'established / theoretical /
 * contested' onto this subject would have produced a tag that was either
 * always the same or quietly dishonest, so the three tiers here are the ones
 * the field actually uses when it reports on itself.
 *
 * - 'settled'  a result competent philosophers do not dispute. It is rarer than
 *              it sounds, and it is never a matter of taste: Gettier's 1963
 *              refutation of the justified-true-belief analysis is settled, and
 *              a philosopher who denied it would be making a mistake rather than
 *              holding a rival view.
 * - 'debated'  live disagreement between competent people. Free will, personal
 *              identity and the trolley problem all sit here, and an entry that
 *              resolved them in passing would be the exact failure this build
 *              exists to remove.
 * - 'open'     nobody has a worked-out position that commands assent, and often
 *              the disagreement is about what a solution would even look like.
 *              Consciousness and the truth of determinism sit here.
 *
 * The label describes the claim the entry actually makes, not the topic. The
 * entry called "Knowledge" is labelled 'settled' because the claim on the card
 * is Gettier's negative result, and the card says so; the positive analysis of
 * knowledge is open, and the card says that too. Reading the label as a verdict
 * on the whole topic is the mistake this comment exists to prevent.
 */

export type PhilosophyStatus = 'settled' | 'debated' | 'open';

export const STATUS_LABELS: Record<PhilosophyStatus, string> = {
  settled: 'Settled result',
  debated: 'Live debate',
  open: 'Open question',
};

export const STATUS_ORDER: PhilosophyStatus[] = ['settled', 'debated', 'open'];

export interface PhilosophyEntry {
  /** Stable id, kebab-case. Used as a React key and for glossary cross-links. */
  id: string;
  /** The term as it should be read. Matches the Atlas topic wherever one exists. */
  name: string;
  /**
   * One or two sentences, no jargon. This is where the thought experiment's
   * opening move goes, because a philosophy entry that opens with a summary of
   * a debate has already lost the reader it was written for.
   */
  simple: string;
  /**
   * The case worked through concretely, or the argument followed step by step -
   * whichever the entry actually turns on. Inline terms are marked with
   * {{double braces}} and rendered by <GlossaryTerm>.
   *
   * The rule for this field is the one the brief set for physics: a paragraph
   * that could be lifted into a different topic unchanged is too generic. "The
   * trolley problem asks whether you would pull a lever" is a summary; walking
   * through why the fat-man variant makes the same arithmetic feel monstrous is
   * the entry. If it is not doing that, it is not finished.
   */
  deeper: string;
  /**
   * What a reader now sees differently. For philosophy this is rarely a number;
   * it is usually the difference between the comfortable answer and the honest
   * one, stated plainly.
   */
  matters: string;
  status: PhilosophyStatus;
  /**
   * Which source(s) the entry was actually built from. Named directly rather
   * than gestured at, because "philosophers have long debated" is not a
   * citation. SEP entries and primary texts, in that order where both were used.
   */
  source?: string;
  sourceUrl?: string;
}

export interface PhilosophyLevel {
  id: string;
  /** 0-5. The reader's order, rendered directly in the rail. */
  number: number;
  title: string;
  /** One line for the rail: a reader should know what is in a level from here. */
  blurb: string;
  /** A short paragraph before the entries. Level 0 is this and nothing else. */
  intro?: string;
  entries?: PhilosophyEntry[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * Throws on anything that would render as a broken card.
 *
 * Runs at module load rather than only in a test, so a malformed entry fails the
 * build instead of reaching a reader as a heading with nothing under it. The
 * bounds are the same as the physics schema's, and they are doing the same job:
 * "simple" over 600 characters is not simple, and a two-line "deeper" note is a
 * decoration rather than an argument.
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

  if (!STATUS_ORDER.includes(record.status as PhilosophyStatus)) {
    throw new Error(
      `${where}: entry ${String(record.id)} has status "${String(record.status)}", which is not one of ${STATUS_ORDER.join(', ')}`
    );
  }

  const deeper = record.deeper as string;
  const matters = record.matters as string;
  if (deeper.length < 80) {
    throw new Error(`${where}: entry ${record.id} has a "deeper" note of ${deeper.length} characters, too short to be an argument`);
  }
  if (matters.length < 60) {
    throw new Error(`${where}: entry ${record.id} has a "matters" line of ${matters.length} characters, too short to say what it changes`);
  }
  if ((record.simple as string).length > 600) {
    throw new Error(`${where}: entry ${record.id} has a "simple" explanation over 600 characters, which is not simple`);
  }

  // The label is the part a reader is most entitled to trust, so "settled" and
  // "debated" both carry an obligation to say where the claim comes from. An
  // 'open' entry is the one case where a source may be thin, because the honest
  // report is that there is no answer to cite.
  if (record.status !== 'open' && !String(`${record.source ?? ''}${record.sourceUrl ?? ''}`).trim()) {
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

  if (!record.intro && !record.entries) {
    throw new Error(`${where}: level ${record.id} has neither an intro nor any entries`);
  }
};
