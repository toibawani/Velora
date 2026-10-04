import { PhilosophyLevel } from './schema';

/**
 * Level 4: who we are.
 *
 * Personal identity is the fullest entry in this read, and deliberately so. It
 * is the topic where the thought experiment is not an illustration of the
 * argument but the argument itself: the ship, the brave officer and Parfit's
 * branching cases each break a different assumption, and there is no way to
 * state the position without walking through them. That is the same reason Black
 * Holes gave its levels room on general relativity and thermodynamics.
 *
 * Consciousness is the second entry and the second 'open' one. Both are labelled
 * honestly against the temptation to make them sound finished.
 */
const LEVEL_4: PhilosophyLevel = {
  id: 'who-we-are',
  number: 4,
  title: 'Who we are',
  blurb: 'Personal identity through change, and the experience nobody has explained.',
  intro:
    'Two questions about persons, and they pull in opposite directions. The first is what makes you the same person over years of physical and mental change. The second is why any of that machinery is accompanied by experience at all. The first has rival answers that all have costs; the second has no answer that anyone defends as complete.',
  entries: [
    {
      id: 'identity',
      name: 'Identity',
      simple:
        'Your cells are replaced, your memories are lossy, and every atom in you is swapped over the years. So what exactly makes the you of today the same person as the you of ten years ago?',
      deeper:
        'Start with the oldest version, which is about a ship rather than a person. Theseus\' ship is repaired plank by plank until not one original plank remains, and the question is whether it is still the same ship. Then someone collects the planks that were removed and rebuilds the original ship exactly as it was, and there are now two candidates for one name. The ship names the shape of the problem; the person names what is at stake in it. Locke, in the Essay of 1690, said the answer is memory. If the consciousness of a prince were to wake up in the body of a cobbler, the person who wakes is the prince, because the body is not what carries a person forward - the remembered life is. Thomas Reid answered with the brave officer: a general remembers taking a standard as a young soldier; that soldier, as a boy, was flogged and did not remember it; and the general does not remember the flogging either. By the memory criterion the general is the soldier and the soldier is the boy, so the general must be the boy - except that he is not, by the very same criterion. Memory is not transitive and identity has to be. Parfit, in "Personal Identity" (1971) and then in Reasons and Persons (1984), took the wreckage seriously instead of patching it. Suppose a machine scans your body and mind, destroys you, and rebuilds you on Mars from the plan, memories intact. The rebuilt person says they are you, and everyone treats them as you. Now suppose the scanner is used twice, so there are two of them and still only one of you - and identity cannot branch, because two things cannot both be identical with a third. Parfit\'s conclusion is that the question "will it be me?" is the wrong question, and that what we actually care about is {{psychological continuity}} and connectedness, which come in degrees and can split. Survival, he says, is not identity, and seeing that is supposed to be a relief rather than a loss.',
      matters:
        'It decides what you are allowed to care about: whether the person in the hospital bed is your friend or a copy wearing their face, and whether a teleporter is a way to travel or a way to die. More sharply, it is the clearest case in philosophy where the intuition and the argument pull apart. Almost everyone insists identity is all-or-nothing; almost everyone, shown Parfit\'s cases, can find no non-arbitrary place to draw the line. Sitting with that instead of picking a side is the honest reading.',
      status: 'debated',
      source:
        "SEP, 'Personal Identity'; Locke, An Essay Concerning Human Understanding, Book II Ch. 27 (1690); Reid, Essays on the Intellectual Powers of Man (1785); Parfit, 'Personal Identity', Philosophical Review (1971)",
      sourceUrl: 'https://plato.stanford.edu/entries/identity-personal/',
    },
    {
      id: 'consciousness',
      name: 'Consciousness',
      simple:
        'Every part of the brain anyone has explained, they have explained as physics and chemistry. Nobody has explained why any of it is accompanied by experience, or what an explanation could even look like.',
      deeper:
        'Two claims get bundled together here and only one of them is in trouble. The first is easy to state and hard to do: mental states are what the brain does, and we keep getting better at tracking which ones. The second is the {{explanatory gap}}: no amount of physical description seems to deliver what it is like to taste salt, and you cannot deduce the taste from any neural fact, however complete. Chalmers named the residue the {{hard problem}}, and set it against the "easy" problems - attention, memory, verbal report - which are difficult but at least have a recognisable shape. The standard cases are built to make the gap visible. Searle\'s Chinese room (1980): a person sits in a room with a rulebook and manipulates Chinese symbols so well that the replies coming out are indistinguishable from a fluent speaker\'s, and the person inside understands none of it. If understanding is just the right computation, the room understands; Searle says it plainly does not, so understanding is not that. Jackson\'s knowledge argument (1982): Mary knows every physical fact about colour while confined to a black-and-white room, then sees red for the first time. If she learns something, physical facts were not all the facts. The replies are serious rather than evasive - that she gains an ability rather than a fact, or re-encounters a fact she already had under a new mode - and each has a cost. The {{phenomenology}} of the room, and of Mary\'s room, is the data the whole argument runs on.',
      matters:
        'It marks a limit that is different in kind from an unsolved puzzle. An ordinary unsolved problem has a shape: a missing measurement, a broken theory, a place to look next. This one has no agreed form for what a solution would even look like, which is why it is filed as open rather than merely unfinished, and why "we will understand it once the neuroscience is better" is a hope rather than a plan.',
      status: 'open',
      source:
        "SEP, 'Consciousness'; Chalmers, 'Facing Up to the Problem of Consciousness' (1995); Searle, 'Minds, Brains, and Programs' (1980); Jackson, 'Epiphenomenal Qualia' (1982)",
      sourceUrl: 'https://plato.stanford.edu/entries/consciousness/',
    },
  ],
};

export default LEVEL_4;
