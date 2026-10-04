import { PhilosophyLevel } from './schema';

/**
 * Level 3: what we should do.
 *
 * The Atlas lists Morality and Consequentialism side by side under Ethics, and
 * they run in that order here because Morality is the case that shows you why
 * you need a theory at all. Both entries are 'debated'. That is the honest
 * label: nobody has a worked-out answer to the trolley problem that commands
 * assent, and consequentialism is a live position rather than a settled one.
 */
const LEVEL_3: PhilosophyLevel = {
  id: 'what-we-should-do',
  number: 3,
  title: 'What we should do',
  blurb: 'The trolley problem, worked through, and the theory it embarrasses.',
  intro:
    'This level is one thought experiment and one theory. The experiment is the best-known case in moral philosophy and it is best known for a reason: it produces the same arithmetic twice and two opposite verdicts, and the discomfort in between is not a failure to follow the argument. It is the argument.',
  entries: [
    {
      id: 'morality',
      name: 'Morality',
      simple:
        'A runaway tram is heading for five people. You can throw a switch and send it down a side track where it will kill one. Almost everyone pulls the switch. The second case is the same arithmetic and almost nobody will.',
      deeper:
        'Philippa Foot set the first case in 1967, as an objection to a claim about abortion rather than as a puzzle in its own right. A runaway tram is heading for five people. You can throw a switch and send it down a side track where it will kill one person who is standing there. Most people say pull the switch, and the reasoning feels decisive rather than difficult: five is more than one. Then Judith Jarvis Thomson moved the lever to a new position, and the arithmetic stopped being decisive. You are standing on a footbridge above the track, beside a very large stranger. The only way to stop the tram is to push him off the bridge; his body will stop it, he will die, and the five will live. One dies, five live. Almost everyone now says no, and the refusal is immediate. Thomson\'s own view was that the cases really are different, and that the difference is not squeamishness: at the switch you redirect a threat that is already loose, while on the bridge you enlist a person\'s body as the instrument that stops it, which is to make him the means. That is the idea behind the {{doctrine of double effect}}, which permits a harm you foresee as a side effect but not a harm you intend as a means. The surgeon\'s variant is the sharpest version and it is not really a trolley at all: five patients each need a different organ, one healthy visitor has all five, and even committed {{consequentialism}} usually will not take the trade. Foot\'s original lever and Thomson\'s footbridge are the same number of deaths, and the felt gap between them is the thing a theory of morality has to explain rather than explain away.',
      matters:
        'It is the cleanest evidence that almost nobody is a consistent consequentialist by intuition, including people who defend consequentialism in print. It also shows what a thought experiment is for: not to illustrate a theory but to break one. If a principle says the two cases are identical or the two verdicts are identical, the principle has failed a test it was not warned about.',
      status: 'debated',
      source:
        "Foot, 'The Problem of Abortion and the Doctrine of Double Effect' (1967); Thomson, 'The Trolley Problem', Yale Law Journal (1985); SEP, 'Doing vs. Allowing Harm'",
      sourceUrl: 'https://plato.stanford.edu/entries/doing-allowing/',
    },
    {
      id: 'consequentialism',
      name: 'Consequentialism',
      simple:
        'Judge an action by what it brings about rather than by what kind of act it is. If lying produced more good than telling the truth, the consequentialist says lie.',
      deeper:
        'The plain version is {{utilitarianism}}: an act is right when it maximises overall well-being, counting everybody equally. That last clause is the surprising one, because it makes the view strikingly demanding and strikingly egalitarian at once - your own interests count for no more than a stranger\'s, and if the money in your account would do more good elsewhere, the sums say so. Bentham and Mill built it to be a public, calculable standard, and the advantages are real: it refuses to hide behind rules, and it forces the question a {{deontology}} never has to answer, which is why keep the rule when the rule makes things worse. The costs show up in the same place. A standard that only counts totals will sacrifice a minority whenever the numbers add up, which is exactly the surgeon\'s case from the previous entry, and it needs a measure of "well-being" that nobody has agreed on - Mill\'s attempt to answer that in Chapter 4 of Utilitarianism (1863) was called a fallacy by its first critics and the argument has not closed since. So modern consequentialists moved the rule to the level of dispositions: follow ordinary rules, or build the virtues, because doing that generally maximises good. It is a real repair, and it also makes the view harder to distinguish from its rivals, which is its own kind of cost.',
      matters:
        'It is the position you have to argue against to be anything else. Deontology and virtue ethics are both defined largely by what they deny here, and the trolley\'s footbridge case was designed to put this view under pressure in front of an audience. Reading it first is what makes the other two branches of ethics legible.',
      status: 'debated',
      source:
        "Mill, Utilitarianism (1863); Bentham, An Introduction to the Principles of Morals and Legislation (1789); SEP, 'Consequentialism'",
      sourceUrl: 'https://plato.stanford.edu/entries/consequentialism/',
    },
  ],
};

export default LEVEL_3;
