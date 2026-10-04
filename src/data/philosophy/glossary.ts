/**
 * Every difficult word in the philosophy levels, defined once.
 *
 * Same file, same shape and same contract as the black hole glossary, because
 * the brief asked for one tooltip system rather than a second one bolted on for
 * this subject. <GlossaryTerm> already imports this module and already renders
 * whatever it finds here, so a term written as {{compatibilism}} in a level file
 * gets the identical control a reader met in the physics material.
 *
 * The definitions are written for someone who has not read philosophy before,
 * and each is short enough to read without losing the sentence you were in. The
 * test of that is the length bound in glossary.test.ts: past roughly 400
 * characters a gloss has stopped being a gloss.
 *
 * `see` chains a term to a simpler one, so reading "explanatory gap" does not
 * require having already read "qualia". Chains are followed one level deep.
 */

export interface GlossaryEntry {
  /** Matches what is written inside {{double braces}} in the level data. */
  term: string;
  definition: string;
  /** A simpler term to point at, when this one rests on another. */
  see?: string;
}

const TERMS: GlossaryEntry[] = [
  // --- The branches, named once so the levels can refer to them -------------
  {
    term: 'metaphysics',
    definition:
      'The branch of philosophy that asks what there is and what it is like, as opposed to how we come to know about it. Free will, time and personal identity are all metaphysics.',
  },
  {
    term: 'epistemology',
    definition:
      'The branch of philosophy that asks what knowledge is, how much of it we have, and what makes a belief justified rather than merely confident.',
    see: 'metaphysics',
  },
  {
    term: 'ontology',
    definition:
      'The part of metaphysics that asks which kinds of thing exist: only physical objects, or also numbers, properties, holes and possibilities.',
    see: 'metaphysics',
  },

  // --- How knowledge is meant to work --------------------------------------
  {
    term: 'a priori',
    definition:
      'Known without having to go and look. Arithmetic and definitions are the stock examples; whether any real knowledge is genuinely a priori is itself disputed.',
  },
  {
    term: 'a posteriori',
    definition:
      'Known by looking, testing or remembering. Anything that rests on experience rather than on reason alone is a posteriori.',
    see: 'a priori',
  },
  {
    term: 'justified true belief',
    definition:
      'The traditional recipe for knowledge: you believe it, it is true, and you have a good reason for believing it. Gettier showed the three are not enough.',
  },
  {
    term: 'Gettier case',
    definition:
      'A made-up situation in which someone holds a justified true belief that still is not knowledge, because the justification and the truth line up only by luck.',
    see: 'justified true belief',
  },
  {
    term: 'reliabilism',
    definition:
      'The view that a belief counts as knowledge when it was produced by a process that generally gets things right, whether or not the believer could give a reason.',
    see: 'Gettier case',
  },
  {
    term: 'virtue epistemology',
    definition:
      'The view that knowledge comes from the exercise of intellectual virtues such as carefulness and open-mindedness, so a lucky true belief is not knowledge.',
    see: 'reliabilism',
  },
  {
    term: 'relevant alternatives',
    definition:
      'The idea that you know something when you can rule out the possibilities that matter in the situation, rather than every possibility someone could dream up.',
    see: 'skeptical hypothesis',
  },
  {
    term: 'skeptical hypothesis',
    definition:
      'A story in which everything looks exactly as it does now but none of your beliefs about the world are true - the dream, the deceiving demon, the brain in a vat.',
  },
  {
    term: 'cogito',
    definition:
      "Descartes' 'I think, therefore I am'. It is the one claim he could not doubt while doubting everything else, though it proves far less than it first appears to.",
  },

  // --- Appearance and reality ----------------------------------------------
  {
    term: 'noumenon',
    definition:
      "Kant's word for the world as it is in itself. He held that we can never experience it, only the world as it appears to us, so its existence is a matter of argument.",
  },
  {
    term: 'phenomenal',
    definition:
      'Having to do with how things appear to a subject, as opposed to how they are in themselves. A phenomenal red is the red you see.',
    see: 'noumenon',
  },
  {
    term: 'phenomenology',
    definition:
      'The careful description of experience as it is lived from the first person, rather than as it is measured from outside. It brackets the question of what is really there.',
    see: 'phenomenal',
  },

  // --- Ethics --------------------------------------------------------------
  {
    term: 'consequentialism',
    definition:
      'The view that whether an action is right depends only on its consequences, not on what kind of act it is or what the agent intended.',
  },
  {
    term: 'utilitarianism',
    definition:
      'The best-known consequentialism: an action is right when it maximises overall happiness or well-being, counting every person equally.',
    see: 'consequentialism',
  },
  {
    term: 'deontology',
    definition:
      'The view that some acts are right or wrong in themselves, so good consequences cannot license breaking a rule such as keeping a promise.',
    see: 'consequentialism',
  },
  {
    term: 'doctrine of double effect',
    definition:
      'The claim that it can be permissible to cause a harm you merely foresee as a side effect of a good act, but not to intend that harm as your means.',
    see: 'deontology',
  },

  // --- Persons -------------------------------------------------------------
  {
    term: 'personal identity',
    definition:
      'What makes you the same person over time: the question of what would have to be true for the you of next year to be you, rather than someone with your memories.',
  },
  {
    term: 'psychological continuity',
    definition:
      'The Lockean answer to personal identity: you persist exactly as far as your memories, intentions and character carry your mental life forward.',
    see: 'personal identity',
  },
  {
    term: 'qualia',
    definition:
      'The raw feel of an experience - the redness of red, the sting of a sting - considered apart from anything the experience tells you or lets you do.',
  },
  {
    term: 'explanatory gap',
    definition:
      'The apparent impossibility of deducing what an experience feels like from even a complete physical description of the brain doing it.',
    see: 'qualia',
  },
  {
    term: 'hard problem',
    definition:
      'Why any physical process should be accompanied by experience at all, as opposed to happening in the dark. It is distinct from the easier problems of memory and attention.',
    see: 'explanatory gap',
  },

  // --- Freedom -------------------------------------------------------------
  {
    term: 'determinism',
    definition:
      'The thesis that the way things are now, together with the laws of nature, already fixes exactly one way things can go next.',
  },
  {
    term: 'indeterminism',
    definition:
      'The denial of determinism: the same past and the same laws leave more than one future genuinely open, as quantum mechanics appears to.',
    see: 'determinism',
  },
  {
    term: 'compatibilism',
    definition:
      'The view that free will and determinism can both be true, because freedom means acting from your own settled desires without outside coercion.',
    see: 'determinism',
  },
  {
    term: 'hard determinism',
    definition:
      'The view that determinism is true and free will is therefore an illusion, so nobody has ever done anything freely and blame is a fiction.',
    see: 'compatibilism',
  },
  {
    term: 'libertarian free will',
    definition:
      'The view that free will is real and requires that your choice was not fixed in advance, so determinism must be false of human action.',
    see: 'compatibilism',
  },
  {
    term: 'principle of alternate possibilities',
    definition:
      'The claim that you are morally responsible for an action only if you could have done otherwise. Frankfurt built a case that is meant to refute it.',
    see: 'compatibilism',
  },
];

/** Term -> entry, for lookup by whatever is written inside the double braces. */
export const GLOSSARY: Record<string, GlossaryEntry> = TERMS.reduce(
  (acc, entry) => {
    if (acc[entry.term]) {
      // Two definitions for one term is exactly the drift this file exists to
      // prevent, so it is a build failure rather than a silent overwrite.
      throw new Error(`philosophy glossary: "${entry.term}" is defined twice`);
    }
    acc[entry.term] = entry;
    return acc;
  },
  {} as Record<string, GlossaryEntry>
);

export const GLOSSARY_TERMS = TERMS.map((entry) => entry.term);

export const lookupTerm = (term: string): GlossaryEntry | undefined => GLOSSARY[term];
