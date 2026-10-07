import { CsLevel } from './schema';

/**
 * Level 0: how a computer science claim gets settled.
 *
 * Physics could appeal to a measurement, philosophy could not, and history had a
 * surviving record. Computer science needs a fourth answer and this level states
 * it, because the five status tiers in schema.ts only mean something once the
 * reader knows that a number here is a statement about a machine rather than a
 * statement about the world.
 *
 * This is the only level without entries. It exists so the five levels that do
 * carry content are read against the method that produced them, and because a
 * discipline whose most common failure is stating a benchmark number as a
 * universal truth has to answer "how would we know?" before "what do we know?"
 * is worth asking.
 */
const LEVEL_0: CsLevel = {
  id: 'how-we-know',
  number: 0,
  title: 'How we know',
  blurb: 'Proofs, benchmarks, and why a number here is about a machine.',
  intro:
    'A fact in this subject is settled by one of five different things, and the difference is not academic. A proof settles it: the FLP result is not a claim about any computer, so no faster machine weakens it. A measurement settles it: an image-classification error rate is real, and it was real on that dataset, on that model, in that year. A version settles it, which is a category the other subjects in this app do not have - Java\'s HashMap was a constant-time lookup until JDK 8, and became logarithmic on hostile input, and both statements were true at the time they were written. A disagreement settles nothing, and some questions here are openly disputed between people who are both right about their own measurements. And some questions are simply open, with a prize attached: P versus NP carries one million dollars and has been unsolved since the year 2000. So a claim here is labelled by what backs it, not by how confident the writer feels. Proved means no experiment can overturn it. Measured means a number exists and can be reproduced. Machine-dependent means the number is true only of a named configuration, and will change when you upgrade. Contested means capable people actively disagree. Open means nobody has solved it and nobody claims to. Each label describes the claim the entry actually makes, not the topic it sits under.',
};

export default LEVEL_0;