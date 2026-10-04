import { HistoryLevel } from './schema';

/**
 * Level 0: how we know any of this.
 *
 * Physics could appeal to a measurement and philosophy could not, so the two
 * subjects so far disagreed about what it means for a claim to be settled.
 * History sits between them and needs its own answer, because its evidence
 * survives in a way neither a laboratory nor an argument does: letters, treaties,
 * inscriptions, court records, and the things people wrote when they expected to
 * be believed.
 *
 * This level is the only one without entries. It exists so the four levels that
 * do carry content are read against the method that produced them, and because
 * the question "how do we know this?" has to be answered before "what happened?"
 * is worth asking about a discipline whose whole subject is evidence.
 */
const LEVEL_0: HistoryLevel = {
  id: 'how-we-know',
  number: 0,
  title: 'How we know',
  blurb: 'Primary sources, historians, and why the past is not a fixed thing.',
  intro:
    'History is the study of a past that left evidence but not its own account of itself. What survives is uneven: the letters of one person and the silence of a thousand, a treaty text and nothing about what the losers thought. Every claim below is built from that uneven material, and the reason the status labels in these levels mean something is that they describe how good the evidence is, not how confident anyone feels. A well-documented claim is one the contemporary record establishes. A disputed one is one competent historians still argue about. A contested one is one where the very framing is under challenge. The method is not decoration on the content; it decides which kind of question each topic can honestly answer.',
};

export default LEVEL_0;