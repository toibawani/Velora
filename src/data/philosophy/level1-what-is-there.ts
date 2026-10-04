import { PhilosophyLevel } from './schema';

/**
 * Level 1: what there is.
 *
 * The topics here are the first two lines of the Atlas's own Philosophy index -
 * Metaphysics is the first discipline and Reality is its first topic - so this
 * is what a reader reaches by clicking the first thing in front of them.
 *
 * Order is a dependency order again: Reality has to come before Existence,
 * because the second question only becomes sharp once you have separated "how
 * things are" from "how things appear". A reader who opened Existence first
 * would meet Russell's King of France without the machinery that makes it
 * interesting.
 */
const LEVEL_1: PhilosophyLevel = {
  id: 'what-is-there',
  number: 1,
  title: 'What there is',
  blurb: 'Reality as opposed to appearance, and what it means for something to exist.',
  intro:
    '{{metaphysics}} opens with a question that looks too easy to argue about: is there a world that does not depend on anyone thinking about it? The reason it is not easy is that every piece of evidence you could ever offer is itself something you are experiencing, so the world and the appearance of the world arrive together and cannot be prised apart from the inside.',
  entries: [
    {
      id: 'reality',
      name: 'Reality',
      simple:
        'Reality is whatever is the case whether or not anyone is looking. That sounds like a sentence with nothing in it. The argument starts when you ask what evidence could ever show that there is a world outside your experience at all.',
      deeper:
        'Two questions get run together here and they are not the same. One is whether there is a world that does not depend on anyone\'s mind. The other is whether we could ever know what that world is like. Berkeley took the first to be unanswerable, because everything we ever meet is an idea in a mind, so there is nothing left over to compare against. Kant did not deny a mind-independent world; he named it the {{noumenon}} and said it is permanently out of reach, which leaves the {{phenomenal}} world - the one we actually live in - as the only one we can describe. Plato\'s cave is the older picture: prisoners who see only shadows thrown on a wall and take the shadows for the whole of what exists. What all three share is the discovery that "how things are" and "how things appear" are two different sentences, and that most of the trouble in this area starts when they get used as one.',
      matters:
        'It separates two things people normally merge. "We cannot know what the world is like in itself" and "there is nothing but our ideas" are different claims, and only the first is an honest conclusion from the cave. Keeping them apart is what stops a modest point about knowledge turning into an immodest claim about reality.',
      status: 'debated',
      source: "SEP, 'Realism' and 'Challenges to Metaphysical Realism'; Plato, Republic, Book VII (the cave)",
      sourceUrl: 'https://plato.stanford.edu/entries/realism/',
    },
    {
      id: 'existence',
      name: 'Existence',
      simple:
        'To exist is to be among the things there are. The trouble starts with the things you can reason about but cannot bump into: numbers, holes, fictional detectives, the average family.',
      deeper:
        'Kant made the point modern logic kept: existence is not a property in the way being red is. Saying "unicorns exist" is not adding a feature to a unicorn; it is saying the concept is not empty, which is why the old argument that moves from the concept of a perfect being to its existence was already in trouble before Russell arrived. Russell supplied the machinery for "the present King of France", a phrase that means something even though there is no King of France to mean it, and showed that a sentence can carry existential weight without naming an object. Quine then gave the plain criterion - {{ontology}} is answered by asking what your best theories must quantify over - and the real dispute becomes visible. Your best physics quantifies over electrons. Does your best arithmetic quantify over numbers in the same way, and if it does, are numbers therefore real in the sense an electron is real?',
      matters:
        'It turns "do numbers exist?" from a shrug into a disciplined question with a stated criterion behind it, and the same machinery decides whether holes, colours, properties and fictional characters are cheap ways of talking or genuine commitments.',
      status: 'debated',
      source:
        "SEP, 'Existence'; Kant, Critique of Pure Reason (1781) on existence and the ontological argument; Russell, 'On Denoting' (1905); Quine, 'On What There Is' (1948)",
      sourceUrl: 'https://plato.stanford.edu/entries/existence/',
    },
  ],
};

export default LEVEL_1;
