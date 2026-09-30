import type { DictionaryTerm } from './types';

/**
 * Curious Dictionary: Philosophy.
 *
 * Filed under the subject it belongs to rather than under whichever file
 * it happened to be typed into, so adding a term means opening one file and
 * the compiler checks it against DictionaryTerm while you type.
 */
export const PHILOSOPHY_TERMS: DictionaryTerm[] = [
{
    id: 'epistemology-phil',
    term: 'Epistemology',
    subject: 'philosophy',
    letter: 'E',
    tagline: 'The branch of philosophy investigating how we know what is actually true.',
    explanation: 'Epistemology asks: what is the difference between genuinely knowing something and merely having a strong hunch that happens to be right? It probes perception, sensory evidence, logical deduction, and the limits of human certainty.',
    example: 'If a broken watch happens to show 3:15 right when you look at it at 3:15, your belief that it is 3:15 was true, but did you really "know" it? Philosophers use this to prove knowledge requires proper justification.',
    source: 'Plato, Theaetetus (c. 369 BCE)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Epistemology',
  },

{
    id: 'falsifiability-phil',
    term: 'Falsifiability',
    subject: 'philosophy',
    letter: 'F',
    tagline: 'Popper’s proposal for telling science apart from things that only look like it — and the argument that has been going on ever since.',
    explanation: 'Karl Popper argued that science doesn’t advance by piling up confirmations; it advances by trying to break its own theories. If an explanation is worded so loosely that no observation could ever contradict it, it cannot be checked, and to him that made it dogma rather than knowledge. He offered this as a way to draw a line, not as a finished rule, and a lot has been argued with it since: Thomas Kuhn thought real science is not much like that, and Imre Lakatos argued that theories are judged as they develop rather than in single decisive tests.',
    example: 'The claim "all swans are white" is a testable scientific statement because finding a single black swan in Australia immediately disproves it. The claim "everything that happens is secretly meant to be" cannot be tested, because any outcome is retroactively claimed as part of the plan.',
    source: 'Karl Popper, The Logic of Scientific Discovery (1934)',
    sourceUrl: 'https://plato.stanford.edu/entries/popper/',
    verified: true
  },

{
    id: 'veil-of-ignorance',
    term: 'Veil of Ignorance',
    subject: 'philosophy',
    letter: 'V',
    tagline: 'A thought experiment: how would you design society if you didn’t know who you’d be born as?',
    explanation: 'Philosopher John Rawls asked us to imagine gathering to write the rules of justice while blinded to our own future: you don’t know whether you’ll be rich or poor, healthy or disabled, a majority or a persecuted minority. Under this veil, rational people naturally choose laws that protect the most vulnerable.',
    example: 'When two siblings split a cake, the fairest system is for one child to slice and the other to pick first. The slicer, ignorant of which piece they will receive, cuts both with absolute precision.',
    source: 'John Rawls, A Theory of Justice (1971)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Veil_of_ignorance',
  },

{
    id: 'categorical-imperative',
    term: 'Categorical Imperative',
    subject: 'philosophy',
    letter: 'C',
    tagline: 'Act only on principles you would want every human being on Earth to follow.',
    explanation: 'Immanuel Kant rejected the idea that ethics is about weighing good or bad consequences. Instead, he argued that duty requires acting only on rules that wouldn’t destroy society if everybody adopted them as universal law.',
    example: 'Can you tell a lie to get out of a tight spot? If everyone lied whenever convenient, the very concept of a promise would collapse, making your lie useless. Therefore, Kant argued, deception is fundamentally irrational.',
    source: 'Immanuel Kant, Groundwork of the Metaphysics of Morals (1785)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Categorical_imperative',
  },

{
    id: 'platos-cave',
    term: "Plato's Cave",
    subject: 'philosophy',
    letter: 'P',
    tagline: 'You would still believe the shadows if nobody told you.',
    explanation: 'Plato imagines prisoners chained since birth, seeing only firelight on a cave wall and treating the shadows as the whole of reality. The point is not that they are stupid but that everything they have ever been shown has been curated by someone.',
    example: 'The Allegory of the Cave sits at the start of the Republic, and its test is simple: if your world were a controlled projection, would your first reaction be gratitude or alarm? Plato assumes you would be mostly grateful.',
    source: 'Plato, Republic, Book VII',
    sourceUrl: 'https://en.wikipedia.org/wiki/Allegory_of_the_cave',
  },

{
    id: 'aristotle-virtue',
    term: 'Virtue Ethics',
    subject: 'philosophy',
    letter: 'V',
    tagline: 'The good life is a skill, not a rulebook.',
    explanation: 'Where most ethics asks what rules to follow, virtue ethics asks what kind of person to become. Virtue is built by practice, the way courage is built by doing frightening things, so there is no shortcut to it and no complete list of it.',
    example: 'Aristotle held that the best person is not the one who never gets angry but the one who is angry at the right things, in the right amount, at the right time. That judgement cannot be written down, which is the objection Plato and Kant both had.',
    source: 'Aristotle, Nicomachean Ethics',
    sourceUrl: 'https://en.wikipedia.org/wiki/Virtue_ethics',
  },

{
    id: 'stoicism',
    term: 'Stoicism',
    subject: 'philosophy',
    letter: 'S',
    tagline: 'Control what is yours, and let go of the rest.',
    explanation: 'Stoicism holds that virtue is the only genuine good and that everything outside your own judgement is not yours to command. That is not passivity: it is the argument that your effort is the only lever you have, so spending it on outcomes you cannot control is wasted.',
    example: 'Epictetus was born a slave and taught that the person inside the slave was not the thing in chains. Marcus Aurelius, Roman emperor, kept a private journal of the same discipline, which is the source for the popular modern version.',
    source: 'Epictetus, Discourses and Selected Fragments',
    sourceUrl: 'https://en.wikipedia.org/wiki/Stoicism',
  },

{
    id: 'hume-guillotine',
    term: "Hume's Guillotine",
    subject: 'philosophy',
    letter: 'H',
    tagline: 'You cannot get a should out of an is by pure logic.',
    explanation: 'Hume noticed that no amount of describing how things are will tell you how they ought to be, and that the leap is only ever bridged by a feeling. Any argument claiming to get an ought out of facts alone has smuggled a value in unnoticed.',
    example: 'This is why "animals suffer" is a factual claim while "animals should not suffer" needs a moral premise to go anywhere. Most arguments that seem to prove something moral are secretly borrowing one.',
    source: 'Hume, A Treatise of Human Nature, Book III',
    sourceUrl: 'https://en.wikipedia.org/wiki/Is%E2%80%93ought_problem',
  },

{
    id: 'is-ought-problem',
    term: 'Is-Ought Problem',
    subject: 'philosophy',
    letter: 'I',
    tagline: 'The gap where a value would have to be.',
    explanation: 'David Hume pointed out that no statement purely about how the world is can logically yield a statement about how it ought to be. It is a small point with large consequences, since most moral arguments try to get from facts to duties without a stated premise.',
    example: '"He is hungry, so feed him" needs a rule about obligation to be smuggled in. Without it, the sentence is a non sequitur dressed as a moral argument.',
    source: 'Hume, A Treatise of Human Nature, Book III',
    sourceUrl: 'https://en.wikipedia.org/wiki/Is%E2%80%93ought_problem',
  },

{
    id: 'pragmatism',
    term: 'Pragmatism',
    subject: 'philosophy',
    letter: 'P',
    tagline: 'True if it works, and meaning is what it does.',
    explanation: 'Pragmatism treats an idea as true when it produces the right results in practice, rather than matching reality by correspondence. It also argues that the meaning of a word is the consequences it has for use, which is why a dictionary gives examples before definitions.',
    example: 'William James defended pragmatism in 1907 partly to break the deadlock between idealists and materialists. Peirce, who coined the word, was more rigorous about it than most accounts suggest, insisting that a belief must lead somewhere.',
    source: 'James, Pragmatism (1907)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pragmatism',
  },

{
    id: 'problem-of-induction',
    term: 'Problem of Induction',
    subject: 'philosophy',
    letter: 'P',
    tagline: 'The sun will rise tomorrow, and no argument proves it.',
    explanation: 'Every inductive argument assumes that the future will resemble the past, and that assumption can never itself be justified inductively. Hume noticed that induction cannot be defended without assuming what it is trying to defend, and that is a real limit on how much science can promise.',
    example: 'A turkey that has been fed every morning for 1,000 days provides a simple case. Nothing in its record guarantees the 1,001st, which is why philosophers distinguish evidence for a prediction from a proof of it.',
    source: 'Hume, An Enquiry Concerning Human Understanding (1748)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Problem_of_induction',
  },

{
    id: 'pragmatic-doubt',
    term: 'Descartes Method of Doubt',
    subject: 'philosophy',
    letter: 'D',
    tagline: 'Believe nothing that could not survive being doubted.',
    explanation: 'Descartes set aside every belief that could be doubted, including anything taken on the testimony of the senses, hoping that what survived would be indubitable. He found only one thing left: that doubting is itself an act of existing.',
    example: 'The famous "I think therefore I am" is a conclusion, not a slogan. Its whole weight comes from the preceding demolition, and without the demolition it is a much smaller claim than it is usually treated as.',
    source: 'Descartes, Discourse on Method (1637)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cogito',
  },

{
    id: 'occams-razor',
    term: "Occam's Razor",
    subject: 'philosophy',
    letter: 'O',
    tagline: 'Do not multiply explanations beyond need.',
    explanation: 'When several explanations fit the same evidence, the one positing the fewest unsupported assumptions is usually the one to test first. It is a rule for where to start looking, not proof that the simplest explanation is true.',
    example: 'Disease was eliminated as the cause of the cattle plague in the 1990s because it fit none of the evidence, even though it was a perfectly simple candidate. Simplicity narrowed the search; it did not settle it.',
    source: 'William of Ockham, Quodlibetal Questions, Qu. 12 (early 14th century)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Occam%27s_razor',
  },

{
    id: 'trolley-problem',
    term: 'Trolley Problem',
    subject: 'philosophy',
    letter: 'T',
    tagline: 'A thought experiment built to be unsolvable.',
    explanation: 'The trolley problem asks whether pulling a lever that kills one to save five makes you a murderer, and a variant asks whether pushing one person off a bridge does the same thing. It was designed by Philippa Foot in 1967 to expose a flaw in an earlier argument, not to be answered.',
    example: 'Judith Jarvis Thomson, who was herself dying of lung cancer when she wrote about it, argued the two cases are not morally the same because the bridge case puts you in the same position as the victim. Most people agree, and the original argument does not survive it.',
    source: 'Foot, "The Problem of Abortion and the Doctrine of Double Effect" (1967)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Trolley_problem',
  },

{
    id: 'banality-of-evil',
    term: 'Banality of Evil',
    subject: 'philosophy',
    letter: 'B',
    tagline: 'Evil can be done by people following a procedure.',
    explanation: 'Hannah Arendt argued that the worst atrocities were committed not by people who felt themselves to be wicked but by people who followed rules carefully and never described their actions as cruel. The evil was in the refusal to think, and the bureaucratic form was its vehicle.',
    example: 'Arendt watched the Eichmann trial in Jerusalem in 1963 and was struck by how ordinary the defendant appeared. Reporting on it is the origin of the phrase, and the part of her analysis most philosophers reject is the claim that reasoning is a defence against responsibility.',
    source: 'Arendt, Eichmann in Jerusalem (1963)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Banality_of_evil',
  },

{
    id: 'mind-body-problem',
    term: 'Mind-Body Problem',
    subject: 'philosophy',
    letter: 'M',
    tagline: 'How does subjective experience come from physical stuff?',
    explanation: 'Everything physical about you can be described in atoms, but the felt quality of redness or pain does not follow from the description. Explaining how subjective experience arises from objective machinery is still unsolved and is the reason consciousness is taken seriously.',
    example: 'The Chinese room, proposed by Searle in 1980, argues that a man following a rulebook in a sealed room understands nothing, even though everything in the room behaves as if he does. If that works, syntax is not sufficient for meaning.',
    source: 'Chalmers, "Facing Up to the Problem of Consciousness" (1995)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mind%E2%80%93body_problem',
  },
];
