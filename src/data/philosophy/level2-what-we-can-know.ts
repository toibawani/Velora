import { PhilosophyLevel } from './schema';

/**
 * Level 2: what we can know.
 *
 * Knowledge first, and it is the one entry in this whole read labelled
 * 'settled'. That is not a slip. The settled thing is a negative result - the
 * justified-true-belief analysis is dead - and the card says so in its own
 * sentences. The positive question, what knowledge actually is, is as open as
 * anything here, and the entry reports that too.
 *
 * Skepticism comes second because it is the test any answer to the first
 * question has to pass.
 */
const LEVEL_2: PhilosophyLevel = {
  id: 'what-we-can-know',
  number: 2,
  title: 'What we can know',
  blurb: 'The recipe for knowledge, the case that broke it, and the skeptic who was never refuted.',
  intro:
    '{{epistemology}} asks what has to be true of you for a belief to count as knowledge rather than as a lucky guess with good manners. The answer offered for two thousand years was three conditions together, and the reason this level exists is that a two-and-a-half page paper in 1963 showed the three are not enough.',
  entries: [
    {
      id: 'knowledge',
      name: 'Knowledge',
      simple:
        'For most of two thousand years the answer was: you know something when you believe it, it is true, and you have a good reason. In 1963 a short paper showed that this is not enough, and nothing agreed since has replaced it.',
      deeper:
        'The paper is Edmund Gettier\'s "Is Justified True Belief Knowledge?", published in Analysis in 1963. Take his first case. You have strong evidence that a colleague will get a job - the manager told you, and you have seen the colleague\'s ten coins in his pocket - so you conclude, correctly, that the person who gets the job has ten coins in their pocket. The job goes to you. You also happen to have ten coins in your pocket. Your belief was true, you were justified in holding it, and it was true by luck: nothing about your evidence had anything to do with the way it turned out. His second case runs the same trick through a disjunction. You are justified in believing Jones owns a Ford, so you infer "Jones owns a Ford or Brown is in Barcelona", which remains true when Jones turns out to own no Ford at all but Brown, entirely coincidentally, is in Barcelona. The inference was valid, the belief was justified, the belief was true, and you did not know it. Almost every reply since has either added a fourth condition to rule out this species of luck or replaced justification with something else - {{reliabilism}}, {{virtue epistemology}}, {{relevant alternatives}} - and none of those has commanded assent.',
      matters:
        'The claim here is deliberately narrow, because that is what the label is for: the refutation is settled, and a philosopher who denied it would simply be making a mistake. What knowledge is, now that the old recipe is gone, is open, and anyone who tells you otherwise is selling a view. The case also shows why we cared about justification in the first place - not to check a box, but to make sure a true belief is not an accident, which a justified true belief can still be.',
      status: 'settled',
      source: "Gettier, 'Is Justified True Belief Knowledge?', Analysis 23 (1963); SEP, 'The Analysis of Knowledge'",
      sourceUrl: 'https://plato.stanford.edu/entries/knowledge-analysis/',
    },
    {
      id: 'skepticism',
      name: 'Skepticism',
      simple:
        'The skeptic is not the person who doubts everything. It is the person who notices that the reasons you have for believing you are awake right now are exactly the reasons you would have if you were dreaming.',
      deeper:
        'Descartes built the strongest version in the first of the Meditations. Suppose an evil demon has devoted itself to deceiving you about everything - the sky, your hands, the arithmetic you did this morning. Any belief the demon cannot touch survives, and Descartes could find only one: that he is thinking, and therefore exists ({{cogito}}). He then had to rebuild the world from that single foothold, which is the part of the project that did not work. The modern version swaps the demon for a brain in a vat or a machine running a simulation. The point is never that these are likely. It is that no test distinguishes them from the ordinary case, because they are built to predict exactly what you are now observing, so an appeal to the evidence is an appeal to something both stories already agree about. Answers usually change the question instead of answering it: {{relevant alternatives}} theory says you only need to rule out the possibilities that matter in the situation, and contextualism says the word "knows" means a stricter thing in a seminar than in a supermarket.',
      matters:
        'It is the standard any theory of knowledge has to be measured against, because a theory that cannot even state the problem has not started. It is also the reason honesty about uncertainty is a feature of this subject rather than an embarrassment: the strongest skeptical argument has never been refuted, only set aside, and a writer who claims otherwise is overclaiming.',
      status: 'open',
      source: "SEP, 'Descartes' Epistemology' and 'Skepticism'; Descartes, Meditations on First Philosophy, Meditation I (1641)",
      sourceUrl: 'https://plato.stanford.edu/entries/descartes-epistemology/',
    },
  ],
};

export default LEVEL_2;
