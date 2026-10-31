import PropTypes from 'prop-types';
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { recordGameResult } from '../utils/gameResults';
import '../styles/GameStyles.css';

/** The id this game is filed under, in stored results and in the hub's list. */
export const QUIZ_GAME_ID = 'quiz';

/**
 * Every answer carries an explanation of why it is right. A multiple choice
 * quiz that only tells you whether you were right teaches you the shape of
 * the question, not the thing being asked about.
 *
 * This was called the Quantum Quiz and had no quantum content in it at all:
 * five questions about photosynthesis, catalysts and entropy. It is now named
 * for what it actually is.
 */
const QUIZ_QUESTIONS = [
  {
    question: 'What is an event horizon?',
    options: [
      'The boundary beyond which nothing escapes a black hole',
      'A type of star',
      'A cosmic event',
      'A time period',
    ],
    correct: 0,
    category: 'Space',
    explanation:
      'It is a boundary in space, not a surface. Nothing inside can reach the outside, and nothing outside can fall in without crossing it.',
  },
  {
    question: 'What does photosynthesis do with light?',
    options: [
      'Converts light energy into chemical energy stored in sugar',
      'Converts it directly into heat',
      'Reflects it away',
      'Converts light into oxygen',
    ],
    correct: 0,
    category: 'Biology',
    explanation:
      'The energy ends up in the chemical bonds of sugar. The oxygen released is a by-product of splitting water, not the light being turned into it.',
  },
  {
    question: 'What does a catalyst do in a reaction?',
    options: [
      'Gets used up alongside the reactants',
      'Lowers the energy needed to start the reaction',
      'Raises the temperature of the reactants',
      'Makes the reaction permanent',
    ],
    correct: 1,
    category: 'Chemistry',
    explanation:
      'It opens a lower energy route. It is not consumed, which is why the same catalyst works over and over, and why enzymes can be reused.',
  },
  {
    question: 'What is gravitational lensing?',
    options: [
      'Light bent by the gravity of something massive',
      'A type of telescope',
      'Light refracting in water',
      'A fault in a camera lens',
    ],
    correct: 0,
    category: 'Space',
    explanation:
      'Mass curves spacetime and light follows the curve, so a distant galaxy can appear as several images, or a ring. Einstein predicted it from general relativity in 1915.',
  },
  {
    question: 'What does entropy count?',
    options: [
      'The energy moving inside a system',
      'How many microscopic arrangements look the same from outside',
      'The temperature of a system',
      'How fast the particles are moving',
    ],
    correct: 1,
    category: 'Physics',
    explanation:
      'That is why a drop of ink spreads through water. There are far more ways for the ink to be spread out than concentrated, so it almost never goes back.',
  },
  {
    question: 'What makes an electron an electron rather than a wave of probability?',
    options: [
      'Nothing; it is genuinely both until measured',
      'It is smaller than light',
      'It is always moving',
      'It has a measurable charge',
    ],
    correct: 0,
    category: 'Quantum',
    explanation:
      'Interference experiments show light behaving as a wave, and photoelectric experiments show it arriving in lumps. Which one you observe depends on the experiment, not on the thing.',
  },
  {
    question: 'What is a black hole event horizon made of?',
    options: [
      'Solid matter crushed into the centre',
      'Nothing; it is a mathematical boundary, not a surface',
      'A shell of iron',
      'Frozen light',
    ],
    correct: 1,
    category: 'Space',
    explanation:
      'There is no surface to land on. If the Sun were replaced by a black hole of the same mass, Earth would keep its orbit and just lose the light.',
  },
  {
    question: 'What does DNA do that a gene does not?',
    options: [
      'Nothing; they are the same thing',
      'DNA is copied faithfully when a cell divides, which genes do not do',
      'DNA is found only in cells, genes are found everywhere',
      'DNA carries the instructions, genes are the instructions',
    ],
    correct: 1,
    category: 'Biology',
    explanation:
      'A gene is a stretch of DNA. The copying machinery works on all of it, which is why the whole set is duplicated when a cell divides.',
  },
  {
    question: 'What is the relationship between pressure, volume and temperature in a gas?',
    options: [
      'Halving the volume doubles the pressure at constant temperature',
      'Halving the volume halves the pressure',
      'Pressure and volume are unrelated',
      'Halving the volume quadruples the pressure',
    ],
    correct: 0,
    category: 'Physics',
    explanation:
      'Same temperature means the same speed of particles, so squeezing the same number of them into half the space doubles how often they hit the walls.',
  },
  {
    question: 'What is a half-life?',
    options: [
      'How long a substance takes to stop working',
      'How long until half the atoms in a sample have decayed',
      'The time it takes for a sample to be completely gone',
      'How often an atom decays in a second',
    ],
    correct: 1,
    category: 'Physics',
    explanation:
      'It never reaches zero, only keeps approaching it. After two half-lives a quarter remains, after three an eighth, and that is what makes carbon dating work.',
  },

  // Philosophy.
  //
  // The deck had no philosophy in it at all, and the game's own description
  // said "Ten questions across physics, chemistry and biology" - which was
  // already wrong, since five of the ten were space and quantum questions, and
  // wrong in the direction that hid an entire subject. Philosophy is eleven
  // lessons deep in this app and had a game that never mentioned it.
  //
  // These are drawn from the Curious Dictionary entries rather than invented for
  // the game, and each names the argument it is about so a reader who gets it
  // wrong can go and read the entry: the trolley problem is Philippa Foot's 1967
  // thought experiment, the is-ought gap is Hume's, and the Gettier case is the
  // 1963 result that knowledge is not reducible to justified true belief.
  {
    question: 'The trolley problem asks whether it is morally the same to pull a lever that kills one person to save five as it is to push one person off a bridge to save five. Why was it built that way?',
    options: [
      'To find the one answer most people agree on',
      'To expose a flaw in an earlier argument about double effect',
      'To argue that killing is always wrong',
      'To test whether people obey instructions under pressure',
    ],
    correct: 1,
    category: 'Philosophy',
    explanation:
      'Philippa Foot built it in 1967 to undermine an argument she thought was too tidy, not to be solved. Judith Jarvis Thomson later pointed out that the bridge case puts you in the same position as the victim, which is why most people judge the two differently and Foot\'s original argument does not survive.',
  },
  {
    question: 'Hume pointed out that no statement purely about how the world is can logically yield a statement about how it ought to be. What is the practical consequence?',
    options: [
      'Moral reasoning is impossible',
      'Most moral arguments need a premise about obligation stated explicitly',
      'Only religious thinkers can do ethics',
      'Facts about the world are unreliable',
    ],
    correct: 1,
    category: 'Philosophy',
    explanation:
      '"He is hungry, so feed him" only works if you add a rule saying you ought to feed the hungry. Without it the sentence is a non sequitur wearing the clothes of a moral argument, and that gap is where most of them hide their premise.',
  },
  {
    question: 'A stopped clock gets a bet on whether it will read correctly tomorrow. It was right by luck. Why is this a problem for a theory of knowledge?',
    options: [
      'It shows that luck makes a belief true',
      'It shows that a belief can be justified and true without being knowledge',
      'It shows that clocks cannot be trusted',
      'It shows that knowledge requires luck',
    ],
    correct: 1,
    category: 'Philosophy',
    explanation:
      'Getttier cases like this are why "justified true belief" was not the last word on knowledge. The belief is justified and it is true, but nothing about your reasons connects it to the truth, so it is not knowledge - and Gettier\'s 1963 paper is two and a half pages long.',
  },
  {
    question: 'You maximise expected happiness and take no account of how the action came about, only what it leads to. Which view of morality is that?',
    options: [
      'Deontology',
      'Consequentialism',
      'Virtue ethics',
      'The is-ought problem',
    ],
    correct: 1,
    category: 'Philosophy',
    explanation:
      'Judging an act only by what it produces is consequentialism. Deontologists judge by the kind of act it is regardless of results, and virtue ethicists ask what habit of character the act builds - they ask about the actor rather than the outcome or the rule.',
  },

  // The five fields the dictionary covers and the quiz did not: economics,
  // psychology, history, mathematics and politics. The deck was fourteen
  // questions over six subjects while the app holds a dictionary entry and
  // lessons for all eleven, so a reader could study a subject for an hour and
  // never be asked about it. Each question below is grounded in a term that
  // already exists in src/data/dictionary, so a wrong answer has somewhere to
  // go: the explanation names the idea rather than paraphrasing it loosely.
  {
    question:
      'A ticket costs £40. You take the evening off a shift that would have paid £60 in order to go. What did the evening cost you?',
    options: [
      '£40, the price of the ticket',
      '£100: the £40 spent and the £60 you did not earn',
      '£60, the shift you gave up',
      'Nothing, the ticket was a gift to yourself',
    ],
    correct: 1,
    category: 'Economics',
    explanation:
      'Opportunity cost is the value of the best alternative you gave up, not the money that left your account. The ticket was £40; the evening cost £40 plus the £60 shift, which is why a cheap night out can be an expensive decision.',
  },
  {
    question:
      'One country can produce both wine and cloth more cheaply than its neighbour. Why does the classical argument still recommend that they trade?',
    options: [
      'Because the neighbour has raw materials it lacks',
      'Because the cost gap is smaller in one good than the other, so specialising where each is least bad leaves both better off',
      'Because trade only works when costs are equal',
      'Because wine cannot be stored long enough to matter',
    ],
    correct: 1,
    category: 'Economics',
    explanation:
      'This is comparative advantage. What matters is the ratio of costs inside each country, not the absolute cost: the slower producer should specialise in whatever it gives up least to make. Absolute advantage would say the efficient country should make everything, and that is the version of the argument that is wrong.',
  },
  {
    question: 'Inflation is 3% and your savings account pays 2%. What has happened to what your money can buy?',
    options: [
      'It buys about 3% more',
      'It buys about 1% less',
      'It is unchanged, because the balance went up',
      'It buys about 5% less',
    ],
    correct: 1,
    category: 'Economics',
    explanation:
      'The balance grew by 2% while prices grew by 3%, so the real return is about minus 1%. The nominal number in the account is a return on the number, not on what the number can buy, and the gap between the two is the whole point of measuring inflation at all.',
  },
  {
    question: 'Why does spreading the same total study time over several days beat cramming it into one?',
    options: [
      'Because repetition matters more than the total time spent',
      'Because each review lands when the memory has partly faded, and the effort of retrieving it is what strengthens it',
      'Because shorter sessions are less tiring',
      'Because spaced material is easier to read',
    ],
    correct: 1,
    category: 'Psychology',
    explanation:
      'This is spaced repetition, and the mechanism is the retrieval, not the exposure. Material that is still fresh is easy to recall and teaches the memory little; material that has partly decayed forces a reconstruction, and that reconstruction is what makes the next recall easier.',
  },
  {
    question:
      'A driver cuts you off and you decide they are a reckless person. What is that inference called?',
    options: [
      'A self-serving bias',
      'The fundamental attribution error: explaining behaviour by character while discounting the situation',
      'Cognitive dissonance',
      'Anchoring',
    ],
    correct: 1,
    category: 'Psychology',
    explanation:
      'The fundamental attribution error is the habit of reading other people\'s behaviour as character and your own as circumstance - they cut you off because they are reckless, you cut someone off because you were late and the road was confusing. The situation is doing more of the work than the story about character admits.',
  },
  {
    question: 'What did the Peace of Westphalia in 1648 establish that still shapes international politics?',
    options: [
      'The United Nations',
      'The idea that each state has sovereignty over its own territory and internal affairs',
      'A single European currency',
      'The abolition of standing armies',
    ],
    correct: 1,
    category: 'History',
    explanation:
      'The treaties ended the Thirty Years\' War and are conventionally taken as the start of the state system: borders that other states recognise, and no authority above them entitled to rule inside them. Almost every argument about intervention since has been an argument about whether that settlement should hold.',
  },
  {
    question: 'Which of these is a primary source for studying the Black Death?',
    options: [
      'A recent textbook chapter on medieval Europe',
      'A will written in a plague year by a notary who survived it',
      'A television documentary about the plague',
      'An encyclopaedia entry on pandemics',
    ],
    correct: 1,
    category: 'History',
    explanation:
      'A primary source comes from the period being studied and was produced by someone inside it. The will is evidence of what one person expected to happen to their property and family; the textbook, documentary and encyclopaedia are all later accounts built out of sources like it, which is why they are secondary.',
  },
  {
    question:
      'The printing press did more than make books cheaper. What did it change about arguments themselves?',
    options: [
      'It made them shorter',
      'It made them fixed and reproducible, so the same text could be compared, cited and disputed in different cities',
      'It made them more emotional',
      'It ended handwriting as a skill',
    ],
    correct: 1,
    category: 'History',
    explanation:
      'A copied manuscript drifts with every copyist; a printed page does not. Once a claim had page numbers and identical copies, an argument could be checked by someone who had never met you, and the scholarly apparatus of citation and refutation became possible.',
  },
  {
    question: 'What does the central limit theorem say about the mean of a large number of independent samples?',
    options: [
      'That it equals the population mean exactly',
      'That its distribution approaches a normal curve as the sample size grows, whatever the underlying distribution looks like',
      'That it is normal for any sample size, however small',
      'That it only holds when the population is already normal',
    ],
    correct: 1,
    category: 'Mathematics',
    explanation:
      'The theorem is about the distribution of the sample mean, not the data. Skewed, lumpy, bounded - it does not matter what the population looks like, the means of large samples cluster into a bell. That is why so much of statistics can use the same machinery without knowing the shape of the underlying thing.',
  },
  {
    question:
      'A student scores far above the class average, then closer to average on a retest, with no change in teaching. What is the likeliest explanation?',
    options: [
      'The retest was easier',
      'Regression to the mean: an extreme score contains luck, and luck does not repeat',
      'The student forgot the material',
      'The first test was invalid',
    ],
    correct: 1,
    category: 'Mathematics',
    explanation:
      'An unusually high score is skill plus a good day. The skill persists and the good day does not, so the second score lands nearer the average without anything having gone wrong. It is also why the worst-performing group in any year tends to improve next year whether or not the intervention aimed at them worked.',
  },
  {
    question: 'What is judicial review?',
    options: [
      'A court\'s power to strike down a law or official action that conflicts with the constitution',
      'A parliamentary inspection of judges\' conduct',
      'The retrial of a criminal case',
      'A president\'s veto of legislation',
    ],
    correct: 0,
    category: 'Politics',
    explanation:
      'Judicial review lets a court check the other branches against the constitution rather than against its own preferences, which is the theory; in practice it is the most contested power in constitutional law, because someone has to decide what the constitution means and that someone is a court.',
  },
  {
    question: 'What makes gerrymandering work?',
    options: [
      'Packing and cracking voters so that a minority of votes yields a majority of seats',
      'Changing the total number of seats between elections',
      'Lowering the voting age',
      'Making voting compulsory',
    ],
    correct: 0,
    category: 'Politics',
    explanation:
      'Packing puts as many of your opponents as possible into a few districts they win overwhelmingly; cracking splits the rest thinly across districts they narrowly lose. Both waste votes on purpose, and neither changes a single ballot - which is why the map, not the turnout, is often the decisive document.',
  },
  {
    question: 'Why does ice float on liquid water?',
    options: [
      'Because cold things rise',
      'Because the hydrogen bonds hold the molecules in an open lattice when it freezes, so the solid takes up more room than the liquid',
      'Because ice contains trapped air',
      'Because water expands as it warms',
    ],
    correct: 1,
    category: 'Chemistry',
    explanation:
      'Most substances pack more tightly when they freeze. Water does the opposite: each molecule can hydrogen bond to four neighbours, and those bonds lock into a hexagonal cage with empty space inside it. The cage is why ice is about nine per cent less dense than the water it floats in - and why a pond freezes from the top down, which is what lets anything survive underneath.',
  },
  {
    question: 'What is the difference between a covalent bond and an ionic one?',
    options: [
      'Covalent bonds share electrons; ionic bonds transfer them and then attract the resulting ions',
      'Covalent bonds are weaker in every case',
      'Ionic bonds only form between metals',
      'Nothing; both are just names for the same attraction',
    ],
    correct: 0,
    category: 'Chemistry',
    explanation:
      'A covalent bond is two atoms holding the same pair of electrons between them. In an ionic bond one atom gives electrons away and the two charged ions stick together electrostatically. The distinction is a matter of degree rather than a wall - a bond can be mostly covalent with some ionic character - which is why chemists talk about polarity instead of only two kinds.',
  },
  {
    question: 'A solution has a pH of 3 instead of 5. How much more acidic is it?',
    options: [
      'Twice as acidic',
      'A hundred times, because each unit on the scale is a factor of ten',
      'Two per cent more acidic',
      'The same; pH only describes the colour of an indicator',
    ],
    correct: 1,
    category: 'Chemistry',
    explanation:
      'pH is a logarithmic scale, so a drop of two units is a hundredfold rise in hydrogen ion concentration. That is why a cola at pH 2.5 and stomach acid at pH 1.5 are not neighbours on any linear reading - the second is ten times stronger, which is also why diluting an acid by a factor of ten moves the pH by only one.',
  },
  {
    question: 'What does it mean for a qubit to be in superposition?',
    options: [
      'It holds two stored values at once, like two bits in one box',
      'Its state is a combination of 0 and 1 with amplitudes, and measuring it returns one of them with a probability set by those amplitudes',
      'It is broken and returns random answers',
      'It can only be 0 or 1, just faster',
    ],
    correct: 1,
    category: 'Quantum',
    explanation:
      'Superposition is not a hidden second bit. The state is a pair of amplitudes, and the amplitudes can interfere - which is the part that matters, because a quantum algorithm works by arranging for the wrong answers to cancel. Once you measure, you get a single ordinary bit and the amplitudes are gone.',
  },
  {
    question: 'Two particles are entangled. What can you actually do with that?',
    options: [
      'Send a message faster than light by measuring one of them',
      'Compare the results of measurements taken at both ends and find correlations stronger than any local hidden-variable account allows',
      'Copy the state of one particle onto the other',
      'Nothing; entanglement is only a mathematical convenience',
    ],
    correct: 1,
    category: 'Quantum',
    explanation:
      'Each measurement looks random on its own, so no message can ride on it - the correlations only appear when the two lists of results are brought together and compared, which takes ordinary communication. What is strange is how strong the agreement is: Bell tests rule out the idea that each particle carried a definite answer all along.',
  },
  {
    question: 'What is quantum tunnelling?',
    options: [
      'A particle passing through a barrier it does not have the energy to cross classically',
      'Light bending around a heavy object',
      'An electron falling into a nucleus',
      'A particle moving faster than light for a moment',
    ],
    correct: 0,
    category: 'Quantum',
    explanation:
      'A particle is described by a wave, and a wave does not stop dead at a wall - it decays through it and can emerge on the other side with some probability. The Sun runs on this: two protons in the core rarely have enough energy to fuse, but they tunnel close enough often enough to keep it burning for billions of years.',
  },
  {
    question: 'A population of insects becomes resistant to a pesticide. What happened?',
    options: [
      'The pesticide taught the insects to resist it',
      'A few insects already carried a resistance, survived, and left more offspring than the rest',
      'The insects chose to become resistant',
      'The pesticide made the insects stronger over time',
    ],
    correct: 1,
    category: 'Biology',
    explanation:
      'Nothing in the pesticide is aimed at the insect\'s future. Variation existed before the spray did; the spray changed which variants left offspring. That is why resistance appears fastest where the dose is heavy and the generations are short, and why the same argument explains antibiotic resistance in a hospital.',
  },
  {
    question: 'What is ATP for?',
    options: [
      'It is the genetic material of bacteria',
      'It carries energy from where it is released to where it is needed, in a form a cell can spend',
      'It is the membrane around a cell',
      'It stores oxygen in muscle',
    ],
    correct: 1,
    category: 'Biology',
    explanation:
      'Breaking the bond to the third phosphate releases a usable amount of energy, and the cell can reform it later. ATP is not a battery with a long life - a working cell turns over its whole supply many times a day - which is exactly what makes it useful as currency rather than storage.',
  },
  {
    question: 'What is the difference between mitosis and meiosis?',
    options: [
      'Mitosis makes two cells with the same chromosomes; meiosis makes four with half of each pair',
      'Mitosis happens only in plants',
      'Meiosis is mitosis done twice as fast',
      'Mitosis produces eggs and sperm',
    ],
    correct: 0,
    category: 'Biology',
    explanation:
      'Mitosis is copying: two daughter cells with the same set, which is what growth and repair need. Meiosis halves the set and shuffles it, so a sperm or egg carries one of each pair rather than both. That halving is the reason fertilisation restores the full number instead of doubling it every generation.',
  },
  {
    question: 'What is confirmation bias?',
    options: [
      'Preferring evidence that fits what you already believe, and reading ambiguous evidence as fitting it',
      'Refusing to believe anything without proof',
      'Copying the opinions of the people around you',
      'Remembering a fact because you repeated it',
    ],
    correct: 0,
    category: 'Psychology',
    explanation:
      'It is not a refusal to look at the other side; it is the quiet asymmetry of looking harder for reasons you are right. That is why a belief can survive years of contrary evidence while feeling well tested - the test was never run on the evidence that would have changed it.',
  },
  {
    question: 'Working memory differs from long-term memory in that it is',
    options: [
      'unlimited but slow',
      'small and short-lived, holding only a few items while you use them',
      'the same store, just used on different days',
      'only present in children',
    ],
    correct: 1,
    category: 'Psychology',
    explanation:
      'Working memory is the desk, not the filing cabinet: a handful of items kept available for the seconds you are manipulating them. The classic limit is around four chunks, which is why a phone number recited in groups is easier than the same digits in one run - the grouping is what turns eleven items into three.',
  },
  {
    question: 'Two people study for the same total time. One does it in a single block, the other spreads it across a week. Who remembers more a month later?',
    options: [
      'The one who blocked it, because momentum carries',
      'The one who spread it, even though the block felt more productive at the time',
      'Neither; total time is the only thing that matters',
      'The one who blocked it, because spacing causes forgetting',
    ],
    correct: 1,
    category: 'Psychology',
    explanation:
      'Spacing and retrieval beat re-reading, and the effect shows up most on delayed tests. The catch is that blocked practice feels easier and therefore feels more effective, so the method that works is the one people are least likely to choose on their own.',
  },
  {
    question: 'You take an unpaid day off to attend a wedding. What is the opportunity cost?',
    options: [
      'Nothing, because the ticket was free',
      'The pay you would have earned, plus whatever else you would have done with the day',
      'Only the cost of travelling there',
      'The couple\'s spending on the wedding',
    ],
    correct: 1,
    category: 'Economics',
    explanation:
      'Opportunity cost is the value of the best thing you gave up, not the money you spent. A free ticket to a concert on a night you could have worked is not free - which is why "it costs nothing" and "it costs me nothing" are different claims, and why the second is rarely true.',
  },
  {
    question: 'Why do two countries both gain from trade when one is better at making everything?',
    options: [
      'Because the better country is secretly worse at something',
      'Because what matters is comparative advantage: the cost of one good in terms of the other, not the absolute output',
      'Because trade always raises total production to the maximum',
      'They do not; the weaker country always loses',
    ],
    correct: 1,
    category: 'Economics',
    explanation:
      'Ricardo\'s point is about the ratio, not the level. If the faster country gives up fewer units of cloth to make a unit of wine than the other does, it should specialise in wine even though it is better at cloth too. The other country then makes cloth at the lower relative cost and both end up with more than if each made its own.',
  },
  {
    question: 'What does a rise in the general price level mean for someone whose wages do not change?',
    options: [
      'Their real wage has fallen, even though the number on their payslip is the same',
      'Nothing, because their wage is unchanged',
      'They are better off, because prices are higher',
      'Their wage has risen in real terms',
    ],
    correct: 0,
    category: 'Economics',
    explanation:
      'Purchasing power is what a wage buys, not what it says. A five per cent raise during eight per cent inflation is a cut in real terms, and the gap between the two numbers is why central banks target inflation rather than only watching employment - the same nominal wage can mean very different things in two years.',
  },
  {
    question: 'A study reports p = 0.04. What does that number say?',
    options: [
      'There is a 4% chance the hypothesis is true',
      'If there were no real effect, results at least this extreme would appear about 4% of the time',
      'The effect is 4% large',
      'The study will replicate 96% of the time',
    ],
    correct: 1,
    category: 'Mathematics',
    explanation:
      'The p-value is computed assuming the null hypothesis is true, so it cannot also be the probability that it is true. A small p says the data are unlikely under that assumption; it says nothing about the size of the effect, and with enough data a trivial effect can produce a very small p.',
  },
  {
    question: 'A test for a rare disease is 99% accurate, and 1 in 10,000 people have it. You test positive. Roughly how likely is it that you have the disease?',
    options: [
      'About 99%',
      'About 1%, because false positives from the healthy majority outnumber true positives',
      'About 50%',
      'It cannot be estimated without a second test',
    ],
    correct: 1,
    category: 'Mathematics',
    explanation:
      'In 10,000 people, about one has the disease and tests positive; about 100 do not have it and still test positive at a 1% error rate. So roughly one true positive against a hundred false ones - around 1%. This is the base rate fallacy, and it is why screening programmes confirm a positive before telling anyone they are ill.',
  },
  {
    question: 'What is the difference between a head of state and a head of government?',
    options: [
      'Nothing; the titles are interchangeable',
      'The head of state represents the country and its continuity; the head of government runs the executive and answers to the legislature',
      'A head of state always commands the army',
      'A head of government is always elected directly',
    ],
    correct: 1,
    category: 'Politics',
    explanation:
      'Splitting the two roles lets a country have a ceremonial or unifying figure above the daily argument. Britain, Germany and India all separate them; the United States merges them in one president. The distinction decides who can be voted out over a bad week and who stays as the face of the state.',
  },
  {
    question: 'What does a first-past-the-post system tend to do to the number of parties?',
    options: [
      'Increase it, because every party can win somewhere',
      'Reduce it, because votes for losing candidates in a district win nothing and supporters drift to the two strongest',
      'Have no effect at all',
      'Guarantee an exact share of seats for every vote share',
    ],
    correct: 1,
    category: 'Politics',
    explanation:
      'Duverger\'s law: single-member districts with plurality winners squeeze the field toward two viable parties. It also means a party can win a majority of seats on a minority of votes, and that a party with steady regional support gets more seats per vote than one spread thinly - the same tally producing different parliaments under a proportional rule.',
  },
  {
    question: 'Which combination best explains why industrialisation began in Britain rather than elsewhere?',
    options: [
      'A single invention, the steam engine, and nothing else',
      'Cheap coal near the surface and near water transport, unusually high wages that made saving labour worth the capital, and institutions that let investors keep the returns',
      'A larger population than any other country',
      'A government plan written in advance',
    ],
    correct: 1,
    category: 'History',
    explanation:
      'No single cause carries it. Coal was cheap where it was needed and could be moved by boat; wages were high enough that a machine could pay for itself; and property rights and a financial system made a long bet on a factory plausible. Places with only one of those advantages industrialised later or not at all, which is the comparison that makes the argument.',
  },
  {
    question: 'What is historiography?',
    options: [
      'The study of how history has been written, by whom, and with what assumptions',
      'The dating of old documents by handwriting',
      'A list of every event in a period',
      'The study of ancient coins',
    ],
    correct: 0,
    category: 'History',
    explanation:
      'Two histories of the same empire can disagree because they ask different questions, not only because one is wrong. Noticing that a nineteenth-century account treated empire as progress, and a later one as extraction, is historiography - and it is why reading the argument around a fact is often more useful than the fact alone.',
  },
  {
    question: 'What is the is-ought gap?',
    options: [
      'The claim that no set of purely descriptive facts about how things are can by itself entail a conclusion about how they ought to be',
      'The difference between a law and a custom',
      'The gap between what a person says and what they do',
      'The idea that morality changes between cultures',
    ],
    correct: 0,
    category: 'Philosophy',
    explanation:
      'Hume\'s point is about inference, not about whether facts matter to ethics. You can describe a practice in complete detail and still need a further premise to get from that description to a judgement, which is why arguments for a moral conclusion always contain something moral somewhere. Finding that premise is usually the useful part of the disagreement.',
  },
  {
    question: 'What makes a claim falsifiable, in Popper\'s sense?',
    options: [
      'That it has already been shown false',
      'That it rules out some observation, so there is a result that would count against it',
      'That it is supported by evidence',
      'That it can be tested in a laboratory',
    ],
    correct: 1,
    category: 'Philosophy',
    explanation:
      'A claim that is compatible with every possible result is not a strong one; it is unfalsifiable, and no amount of evidence can count for it either. Popper used this to separate science from pseudo-science, though real theories are rarely abandoned the moment one prediction fails - the useful question is what evidence would, in advance, change your mind.',
  },
  {
    question: 'A horse pulls a cart. The cart pulls back on the horse with an equal force. Why does anything move?',
    options: [
      'Because the horse is stronger, so its force is larger',
      'Because the two forces act on different bodies: the cart feels the horse\'s pull, and the horse feels the cart\'s drag plus the ground\'s push on its hooves',
      'Because Newton\'s third law does not apply to animals',
      'Because the cart is heavier than the force',
    ],
    correct: 1,
    category: 'Physics',
    explanation:
      'Equal and opposite pairs never cancel, because they are always on two different objects. The horse moves because the forward push from the ground can exceed the backward drag from the cart; the cart moves because the horse\'s pull can exceed the friction on its wheels. Watching one body at a time is what makes the third law stop looking like a paradox.',
  },
  {
    question: 'A fridge moves heat from cold inside to warm outside. Does that break the second law of thermodynamics?',
    options: [
      'Yes, because heat never flows from cold to hot',
      'No: the second law applies to an isolated system, and the fridge is not one - it spends work to move the heat',
      'Yes, but only while the door is closed',
      'No, because fridges are too small to follow the law',
    ],
    correct: 1,
    category: 'Physics',
    explanation:
      'Heat does not go from cold to hot on its own; with a pump, it can. The work done by the compressor is what pays for the decrease in entropy inside, and the total entropy of the room plus the fridge still rises - if it did not, the fridge would be a perpetual motion machine with a plug.',
  },
];

const POINTS_PER_CORRECT = 10;

/**
 * Where each option is drawn on screen.
 *
 * The options were rendered in the order they are written in the data, and the
 * data happens to put the right answer first on five of the fourteen questions
 * and second on most of the rest. Nothing shuffled them, so a player who never
 * read a word could score well by always taking A, and a player who did read
 * them learned "the long one is usually right" - the answer's position was
 * information about the deck rather than about the subject.
 *
 * Deterministic rather than random: the same question always lays out the same
 * way, so a re-render cannot move the options while a finger is on the way to
 * one, and a replay of a question the player just saw is not a new guess at
 * where the answer went. What it removes is the fixed link between a question
 * and the slot its answer sits in, which is the thing that was being learned.
 */
function optionOrder(questionIndex, count) {
  const stride = count > 2 ? count - 1 : 1;
  const offset = (questionIndex * 5 + 1) % count;
  const order = [];
  for (let i = 0; i < count; i += 1) order.push((offset + i * stride) % count);
  const isIdentity = order.every((value, position) => value === position);
  return isIdentity ? order.slice().reverse() : order;
}

/** The options in the order they are drawn, paired with the index they are graded by. */
function shuffledOptions(questionIndex) {
  const { options } = QUIZ_QUESTIONS[questionIndex];
  return optionOrder(questionIndex, options.length).map((original) => ({
    original,
    text: options[original],
  }));
}

QuantumQuiz.propTypes = { onBack: PropTypes.func };

function QuantumQuiz({ onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  // The questions this round is playing, as positions in the deck. It is a
  // list rather than a number because the game now has two rounds in it: the
  // whole deck, and a short one made of the questions just answered wrong.
  // Everything below that used to read QUIZ_QUESTIONS.length - the progress
  // bar, the "question 4 of 26" label, the final total - reads this instead, so
  // a practice round cannot claim to be out of 26 when it holds three.
  const [deck, setDeck] = useState(() => QUIZ_QUESTIONS.map((_, index) => index));
  // A run of consecutive right answers, and the longest run of the round.
  //
  // The score is cumulative, so it cannot show momentum: getting four right,
  // then one wrong, then four right reads the same as getting nine right in a
  // row, and the difficulty of the second is the whole reason the round is
  // worth playing. The streak is the closest thing the deck has to a measure
  // of the player rather than the deck, so it is shown while it is running and
  // remembered on the results screen after it breaks.
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  // Which questions were answered wrong, in the order they came up. The
  // explanation was shown for a few seconds mid-round and then thrown away with
  // the question, so the end screen could say "10 of 14" and nothing else -
  // and the four that needed rereading were the four the player could not
  // remember which ones they were.
  const [missed, setMissed] = useState([]);
  // The round is reported once. Finish is reachable from both the button and
  // Enter, and pressing either twice in the same tick would otherwise book two
  // plays for one sitting.
  const recordedRef = useRef(false);

  const question = QUIZ_QUESTIONS[deck[currentQuestion]];
  const isLast = currentQuestion === deck.length - 1;
  // A practice round is a subset, so it is not comparable to a full one and is
  // not recorded. Booking it would either overwrite the best with a score out
  // of 30 or leave a best that the maximum no longer explains.
  const isPractice = deck.length !== QUIZ_QUESTIONS.length;
  // Positions in the original options array, so `question.correct` still grades
  // and the displayed order stays separate from the data order.
  const options = useMemo(() => shuffledOptions(currentQuestion), [currentQuestion]);

  /**
   * Back to the first question with nothing carried over.
   *
   * The only way to play again was to leave for the games hub and come back,
   * which also threw away the round the player had just finished reading the
   * explanations from. Resetting has to clear all five pieces of state - score,
   * count, the missed list, the selected answer and the answered flag - or a
   * second round starts halfway through the first one's results.
   */
  const handleReplay = useCallback(() => {
    setDeck(QUIZ_QUESTIONS.map((_, index) => index));
    setCurrentQuestion(0);
    setScore(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setGameOver(false);
    setMissed([]);
    // The streak belongs to the round. Leaving it at the previous value meant a
    // second round opened with a run already on the board that nobody earned.
    setStreak(0);
    setBestStreak(0);
    recordedRef.current = false;
  }, []);

  const handleAnswerClick = useCallback(
    (index) => {
      // Without this a second click on another option rewrote the answer after
      // the result was already showing.
      if (answered) return;
      setSelectedAnswer(index);
      setAnswered(true);
      if (index === question.correct) {
        const nextStreak = streak + 1;
        setScore((prev) => prev + POINTS_PER_CORRECT);
        setCorrectCount((prev) => prev + 1);
        setStreak(nextStreak);
        setBestStreak((best) => (nextStreak > best ? nextStreak : best));
      } else {
        setStreak(0);
        setMissed((prev) => (prev.includes(currentQuestion) ? prev : [...prev, currentQuestion]));
      }
    },
    [answered, currentQuestion, question.correct, streak]
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      setGameOver(true);
      // The round is recorded here rather than in an effect on gameOver, so the
      // score that lands is the one this round earned before any of it was
      // cleared for a replay. A practice round is not recorded at all.
      if (!recordedRef.current && !isPractice) {
        recordedRef.current = true;
        recordGameResult(QUIZ_GAME_ID, {
          score,
          max: QUIZ_QUESTIONS.length * POINTS_PER_CORRECT,
        });
      }
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  }, [isLast, isPractice, score]);

  /**
   * Play the questions that were answered wrong, and only those.
   *
   * The end screen already listed them with their reasoning, which is a page to
   * read; reading an explanation is not the same as being asked the question
   * again on your own. This sets the deck to the missed positions and starts
   * over, so the four that got away become a round of four.
   */
  const handlePractiseMissed = useCallback(() => {
    setDeck(missed);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setGameOver(false);
    setStreak(0);
    setBestStreak(0);
    setMissed([]);
    recordedRef.current = false;
  }, [missed]);

  /*
   * Number keys pick an option and Enter advances.
   *
   * The card already tells the player the options are 1 to 4 - the option
   * badges are the letters A to D, and the only way to use one was to move the
   * mouse and click. On a fourteen question deck that is fourteen trips away
   * from the keyboard for anyone reading along, and the key that does the
   * obvious thing did nothing.
   *
   * A is the first option drawn, not the first option in the data, because the
   * letters label what is on screen rather than what is in the source.
   */
  useEffect(() => {
    if (gameOver) return undefined;

    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (answered) {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleNext();
        }
        return;
      }

      const position = /^[1-9]$/.test(event.key)
        ? Number(event.key) - 1
        : 'abcd'.indexOf(event.key.toLowerCase());
      if (position < 0 || position >= options.length) return;
      event.preventDefault();
      handleAnswerClick(options[position].original);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [answered, gameOver, handleAnswerClick, handleNext, options]);

  if (gameOver) {
    const total = deck.length;
    const percentage = Math.round((correctCount / total) * 100);

    return (
      <div className="game-screen">
        <div className="game-over-screen">
          <h2>{isPractice ? 'Practice round complete' : 'Quiz complete'}</h2>
          <p className="final-score">
            {correctCount} of {total} correct
          </p>
          <p className="percentage">{percentage}%</p>

          {/* The longest run of the round. A percentage over a fixed deck can
              be the same number for a scrappy round and a composed one; the
              run is the part of the result that says which of those happened. */}
          <p className="quiz-streak-summary" data-testid="quiz-best-streak">
            {bestStreak === 1
              ? 'Longest run: one in a row.'
              : `Longest run: ${bestStreak} in a row.`}
          </p>

          <div className="performance">
            {percentage === 100 && <p>Every one right.</p>}
            {percentage >= 80 && percentage < 100 && (
              <p>Worth another look at the one you missed below.</p>
            )}
            {percentage < 80 && (
              <p>The ones below are worth rereading, they are the point.</p>
            )}
          </div>

          {/*
            * The questions that were answered wrong, with the reasoning. The
            * explanation was already on screen for each one during the round and
            * then discarded with the question, which left the end screen able to
            * say how many were right and nothing about which - the score is the
            * least useful thing this screen knows.
            */}
          {missed.length > 0 && (
            <div className="quiz-review" data-testid="quiz-review">
              <h3>
                {missed.length === 1 ? 'The one that got away' : `The ${missed.length} that got away`}
              </h3>
              <ul className="quiz-review-list">
                {missed.map((index) => {
                  const item = QUIZ_QUESTIONS[index];
                  return (
                    <li key={item.question} className="quiz-review-item">
                      <p className="quiz-review-question">{item.question}</p>
                      <p className="quiz-review-answer">
                        <span className="quiz-review-label">Answer:</span>{' '}
                        {item.options[item.correct]}
                      </p>
                      <p className="quiz-review-explanation">{item.explanation}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="game-over-actions">
            {/* The review above is a page to read. Being asked the question
                again is a different act, and the missed ones are the only part
                of the deck worth another pass. */}
            {missed.length > 0 && (
              <button className="btn-restart" onClick={handlePractiseMissed}>
                Practise the {missed.length} you missed
              </button>
            )}
            <button className={`btn-restart${missed.length > 0 ? ' secondary' : ''}`} onClick={handleReplay}>
              {isPractice ? 'Play the whole deck' : 'Play again'}
            </button>
            <button className="btn-restart secondary" onClick={onBack}>
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="game-back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <h2>Concept Check</h2>
        <div className="game-score" data-testid="quiz-score">
          {streak >= 2 && (
            <span
              className="quiz-streak"
              data-testid="quiz-streak"
              title={`${streak} right in a row`}
            >
              {streak} in a row
            </span>
          )}
          Score: {score}
        </div>
      </div>

      <div className="quiz-game">
        <div className="game-progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={deck.length}
            aria-valuenow={currentQuestion + 1}
            aria-label={isPractice ? 'Practice progress' : 'Quiz progress'}
          >
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / deck.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            {isPractice ? 'Practice' : 'Question'} {currentQuestion + 1}/{deck.length}
          </span>
        </div>

        <div className="category-badge">{question.category}</div>

        <div className="quiz-question">
          <h3>{question.question}</h3>
        </div>

        <p className="quiz-keyhint" aria-hidden="true">
          Press 1&ndash;{options.length} or A&ndash;{String.fromCharCode(64 + options.length)} to answer,
          then Enter for the next question.
        </p>

        <div className="quiz-options">
          {options.map(({ original, text }, index) => {
            const isChosen = selectedAnswer === original;
            const isCorrectOption = original === question.correct;
            return (
              <button
                key={text}
                type="button"
                className={`quiz-option ${
                  isChosen ? (isCorrectOption ? 'correct' : 'incorrect') : ''
                } ${answered && isCorrectOption ? 'show-correct' : ''}`}
                onClick={() => handleAnswerClick(original)}
                disabled={answered}
                aria-pressed={isChosen}
              >
                <span className="option-number">{String.fromCharCode(65 + index)}</span>
                <span className="option-text" data-testid="option-text">{text}</span>
                {answered && isCorrectOption && <span className="checkmark">&#10003;</span>}
                {answered && isChosen && !isCorrectOption && <span className="cross">&#10007;</span>}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="quiz-feedback">
            <p className={selectedAnswer === question.correct ? 'result-right' : 'result-wrong'}>
              {selectedAnswer === question.correct ? 'Correct.' : 'Not quite.'}
            </p>
            <p className="quiz-explanation">{question.explanation}</p>
          </div>
        )}

        {answered && (
          <button className="btn-next" onClick={handleNext}>
            {isLast ? 'Finish' : 'Next question'}
          </button>
        )}
      </div>
    </div>
  );
}

export { QUIZ_QUESTIONS, optionOrder, shuffledOptions };
export default QuantumQuiz;
