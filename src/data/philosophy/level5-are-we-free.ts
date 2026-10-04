import { PhilosophyLevel } from './schema';

/**
 * Level 5: are we free?
 *
 * This is the level that most needed the honest labelling, and it is why the
 * status tiers exist at all. Free will is the paradigm case of a question where
 * the comfortable answer and the honest answer differ: it would be easy to write
 * "compatibilism shows that free will survives determinism" and move on, and it
 * would be a lie by omission. There are three live positions, Frankfurt's case
 * reshaped the field in 1969, and the argument has not closed.
 *
 * Determinism follows free will rather than preceding it, because the Consequence
 * Argument is stated in the first entry and the second entry is what it rests on.
 */
const LEVEL_5: PhilosophyLevel = {
  id: 'are-we-free',
  number: 5,
  title: 'Are we free?',
  blurb: 'The consequence argument, Frankfurt\'s counterexample, and whether the future is fixed.',
  intro:
    'The whole debate lives in two questions that arrive together. If everything up to this moment fixed what you are about to do, in what sense was it up to you? And if nothing fixed it - if the choice could have gone either way with the world identical up to the last instant - in what sense was it your choice rather than a coin landing? Neither answer is comfortable, and the entry below does not pretend one of them wins.',
  entries: [
    {
      id: 'free-will',
      name: 'Free Will',
      simple:
        'You are about to choose something. If the world up to now already fixed what you will choose, how was it up to you? If it did not, how was the choice yours rather than a coin?',
      deeper:
        'Begin with the argument that made the problem sharp again in the twentieth century, van Inwagen\'s Consequence Argument. If {{determinism}} is true, then our acts are the consequences of the laws of nature together with events in the remote past. But the laws of nature are not up to us, and the remote past is not up to us. Therefore our acts are not up to us. Each step looks unremarkable and the conclusion is one almost nobody wants, which is exactly what makes it a good argument rather than a trick - and the whole compatibilist project is an attempt to find the step that is doing something illicit. Then the counterexample that reorganised the field. In 1969 Frankfurt asked whether moral responsibility really needs the ability to do otherwise. Suppose Black wants Jones to do a certain thing and has quietly arranged that if Jones shows any sign of deciding against it, Black will intervene and make him do it anyway. Jones never wavers, and does it himself, for his own reasons. So Jones could not have done otherwise. And almost everyone says he is still responsible, and that blaming him would be entirely fair. If that judgement holds, the {{principle of alternate possibilities}} is false, and the inference from determinism to "nobody is ever responsible" loses its engine. {{compatibilism}} takes this as the way out: freedom is acting from your own settled desires without external coercion, and that survives determinism intact. {{hard determinism}} says the move cheats, because a desire that was fixed by history is no more yours than a desire Black installed by hand. {{libertarian free will}} says both are describing the wrong thing, because free choice requires a kind of self-determination that is incompatible with determinism and simply had better be the case. The SEP\'s own framing is that the disagreement is about what kind of control matters, not about a fact anyone can look up.',
      matters:
        'It is the topic where the label matters most, and the reason is not academic. The comfortable sentence - "science has shown free will is an illusion" or "philosophy has shown it is fine" - is available in either direction and both are overclaims. The honest report is that there are three working positions, that Frankfurt\'s case moved the argument rather than settling it, and that a reader who is told otherwise is being given a conclusion the field has not reached.',
      status: 'debated',
      source:
        "SEP, 'Free Will' and 'Compatibilism'; van Inwagen, An Essay on Free Will (1983); Frankfurt, 'Alternate Possibilities and Moral Responsibility', Journal of Philosophy (1969)",
      sourceUrl: 'https://plato.stanford.edu/entries/freewill/',
    },
    {
      id: 'determinism',
      name: 'Determinism',
      simple:
        'Determinism says that the state of the world right now, together with the laws of nature, already fixes exactly one future. Not probably one future. Exactly one.',
      deeper:
        'Laplace stated the picture cleanly in 1814: an intellect that knew the position and momentum of every particle, and every law, could compute the whole past and the whole future in a single formula. Two things are often confused with determinism and are not it. The first is causation, which is about what produces what, whereas determinism only says the future is fixed however it comes about. The second is predictability, and determinism does not give you that at all - chaotic systems are perfectly deterministic and famously impossible to forecast, because the smallest error in the initial numbers explodes within days. Then the physical question, which is where the label gets decided. Quantum mechanics has no such formula: it yields probabilities for outcomes rather than one outcome, so any naive determinism at the level of measurement is dead. But that is not the end of it, because deterministic hidden-variable theories exist and reproduce every experiment performed so far, and the interpretation of quantum mechanics is itself unresolved - so {{indeterminism}} is a live option rather than a proven fact. The SEP states it plainly: there is no agreement over whether determinism is true, or even over whether it could be known to be true or false.',
      matters:
        'It is the premise the previous entry runs on, and its own status is different: whether the world is deterministic is open, while what free will would mean if it were is debated. Those are separate questions and merging them is what produces confident answers to a problem that has none. Keeping them apart is what lets the free will entry say honestly that it does not know.',
      status: 'open',
      source:
        "SEP, 'Causal Determinism'; Laplace, A Philosophical Essay on Probabilities (1814); Hoefer's SEP survey of determinism across classical, relativistic and quantum physics",
      sourceUrl: 'https://plato.stanford.edu/entries/determinism-causal/',
    },
  ],
};

export default LEVEL_5;
