import type { DictionaryTerm } from './types';

/**
 * Curious Dictionary: Mathematics.
 *
 * Filed under the subject it belongs to rather than under whichever file
 * it happened to be typed into, so adding a term means opening one file and
 * the compiler checks it against DictionaryTerm while you type.
 */
export const MATH_TERMS: DictionaryTerm[] = [
{
    id: 'bayes-theorem',
    term: 'Bayes’ Theorem',
    subject: 'mathematics',
    letter: 'B',
    tagline: 'The mathematical rule for how much you should update your belief when new evidence lands.',
    explanation: 'Bayes’ theorem calculates the probability that a hypothesis is true given new data. It reminds us that evidence cannot be judged in a vacuum: you must factor in how common or rare the situation was beforehand (the prior probability).',
    example: 'If a rare disease affects 1 in 10,000 people and a test is 99% accurate, testing positive does NOT mean you have a 99% chance of being sick. Because the disease is so rare, false positives will still outnumber true cases by roughly 100 to 1.',
    source: 'Thomas Bayes, An Essay towards solving a Problem in the Doctrine of Chances (1763)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Bayes%27_theorem',
  },

{
    id: 'central-limit-theorem',
    term: 'Central Limit Theorem',
    subject: 'mathematics',
    letter: 'C',
    tagline: 'Why the bell curve appears almost everywhere in nature and statistics.',
    explanation: 'If you take independent random samples from almost any population—even one that looks wildly skewed, flat, or weird—and calculate their averages, the distribution of those averages will inevitably form a smooth, symmetric bell curve (normal distribution).',
    example: 'Roll a single die and every number (1 to 6) has an equal 16.7% flat chance. But roll 100 dice and add their sum: almost every roll clusters around 350, with extreme sums like 100 or 600 becoming vanishingly rare.',
    source: 'Pierre-Simon Laplace, Théorie analytique des probabilités (1812)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Central_limit_theorem',
  },

{
    id: 'infinity',
    term: 'Infinity',
    subject: 'mathematics',
    letter: 'I',
    tagline: 'Bigger than any number, and still not the biggest.',
    explanation: 'Infinity is not a number but a property of sets, and it comes in sizes. The counting numbers and the rationals are both infinite, yet there are more real numbers than rationals, so one infinity is strictly larger than another.',
    example: 'Cantor showed in 1891 that the real numbers cannot be listed, because any list you write can be shown to miss at least one. A shorter proof: the decimals between 0 and 1, and the list itself, must be the same size, and one of those is uncountable.',
    source: 'Cantor, "Ueber eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen" (1873)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Infinity',
  },

{
    id: 'derivative',
    term: 'Derivative',
    subject: 'mathematics',
    letter: 'D',
    tagline: 'The rate of change, exactly, at one point.',
    explanation: 'A derivative is the limit of how much a function changes over a shrinking interval, which sounds useless until you realise it works at every point along a curve. Once you can ask "how fast here", almost all of motion, economics, and optimisation becomes calculable.',
    example: 'Position gives velocity by differentiating, and velocity gives acceleration by differentiating again. The whole of Newtonian mechanics is three functions of time related by that operation.',
    source: 'Newton, "De Methodis Serierum et Fluxionum" (1671)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Derivative',
  },

{
    id: 'pythagorean-theorem',
    term: 'Pythagorean Theorem',
    subject: 'mathematics',
    letter: 'P',
    tagline: 'The oldest theorem still used every day.',
    explanation: 'In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides. What makes it remarkable is that it holds in curved space too, with a different geometry, and it is what allowed coordinate geometry to work at all.',
    example: 'Surveyors used it for centuries before satellites. The curvature of the Earth in the formula is small enough to ignore over a few kilometres, which is why a flat-earth calculation is accurate for a road but not for a flight.',
    source: 'Pythagoras, attributed, c. 570-495 BCE',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pythagorean_theorem',
  },

{
    id: 'prime-numbers',
    term: 'Prime Numbers',
    subject: 'mathematics',
    letter: 'P',
    tagline: 'The numbers that cannot be broken down further.',
    explanation: 'A prime divides evenly into nothing but 1 and itself, and every integer is built from primes uniquely. They are the atoms of arithmetic, and they get sparser without a pattern, in a way that is still not fully understood.',
    example: 'Every integer above 1 can be written as primes in exactly one way: 360 is 2 x 2 x 2 x 3 x 3 x 5. This is the fundamental theorem of arithmetic, and RSA encryption depends on primes being hard to find in reverse.',
    source: 'Euclid, Elements, Book VII (c. 300 BCE)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Prime_number',
  },

{
    id: 'regression-to-mean',
    term: 'Regression to the Mean',
    subject: 'mathematics',
    letter: 'R',
    tagline: 'After an extreme result, the next one usually looks less extreme.',
    explanation: 'When you select on a measurement being high, the following measurement tends to be lower, purely because of how selection works and not because anything improved. The effect is everywhere and is routinely mistaken for a treatment working.',
    example: 'A student who happens to be selected for tutoring because they scored unusually badly will typically improve anyway, which looks like proof tutoring works. Giving the same students no tutoring at all shows a similar rise, which is the actual finding.',
    source: 'Galton, "Regression towards mediocrity in hereditary stature" (1886)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Regression_toward_the_mean',
  },

{
    id: 'pigeonhole-principle',
    term: 'Pigeonhole Principle',
    subject: 'mathematics',
    letter: 'P',
    tagline: 'Put enough pigeons in too few holes and one hole gets crowded.',
    explanation: 'If you have more objects than containers, at least one container holds more than one object. It sounds trivial, but applied to hair, hands, or a deck of cards it produces real mathematical results.',
    example: 'In any group of 13 people, two share a birth month. The same principle forces a repeated pair of socks in a drawer of 10 black and 10 brown, and it is the reason behind the party problem where two share an acquaintance.',
    source: 'Pigeonhole Principle, first stated by Dirichlet (1834)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Pigeonhole_principle',
  },

{
    id: 'mathematical-induction',
    term: 'Mathematical Induction',
    subject: 'mathematics',
    letter: 'M',
    tagline: 'Proving the first case and the step proves all of them.',
    explanation: 'Induction proves a statement for every natural number by showing it holds for one and that holding for n implies holding for n+1. It looks circular but is not, because the base case and the step are checked independently.',
    example: 'It is how you prove that every integer above 1 is either prime or composite, that a sum of n odd numbers is odd, and that the polygon formula holds. Fermat used it for his famous theorem, and the proof was lost for centuries.',
    source: 'Peano, Arithmetices principia, nova methodo exposita (1889)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mathematical_induction',
  },

{
    id: 'function',
    term: 'Function',
    subject: 'mathematics',
    letter: 'F',
    tagline: 'An input, an output, and a rule joining them.',
    explanation: 'A function takes each input and produces exactly one output, and that constraint is the entire idea. Almost every piece of applied mathematics is a function, including time, temperature, price, and the risk an insurer prices.',
    example: 'The area of a circle as a function of its radius is pi r squared, so each radius has one area. It also means the function is not a graph but a mapping, which is why several different formulas can define the same function.',
    source: 'Euler, Introductio in analysin infinitorum (1748)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Function_(mathematics)',
  },

{
    id: 'limit',
    term: 'Limit',
    subject: 'mathematics',
    letter: 'L',
    tagline: 'Where a thing is heading, even where it never arrives.',
    explanation: 'A limit describes the value a function approaches as its input gets arbitrarily close to some point, without requiring the function to be defined there. Most of calculus is built on it, and it is why derivatives work at sharp corners.',
    example: 'The tangent to a curve at a point is the limit of secants as the second point slides toward the first. At a cusp the derivative is undefined, but the curve still has a perfectly good tangent in the limit sense, which Newton needed for orbital work.',
    source: 'Cauchy, Cours d\'Analyse de l\'Ecole Polytechnique (1821)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Limit_of_a_function',
  },

{
    id: 'fourier-transform',
    term: 'Fourier Transform',
    subject: 'mathematics',
    letter: 'F',
    tagline: 'Any signal can be written as a sum of pure tones.',
    explanation: 'Fourier showed that any repeating signal can be decomposed into a sum of simple sine waves, and the reverse process rebuilds it. The transform is the recipe for that decomposition, and it turns convolution into multiplication.',
    example: 'A CD reads a digital signal, takes its Fourier transform, and checks which frequencies are present to pick the right data stream. The same idea is why a phone call can be compressed, and why a noisy audio file can have its hiss removed.',
    source: 'Fourier, "Theorie Analytique de la Chaleur" (1822)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Fourier_transform',
  },

{
    id: 'correlation-causation',
    term: 'Correlation Is Not Causation',
    subject: 'mathematics',
    letter: 'C',
    tagline: 'Two things moving together proves neither one moves the other.',
    explanation: 'A measurable relationship between two quantities does not identify a mechanism, and it is often produced by a shared cause rather than a direct link. It is the most repeated statistical mistake outside statistics.',
    example: 'Countries with more Nobel laureates also eat more chocolate, which does not mean chocolate produces Nobel prizes; both are explained by national wealth. Ice cream sales and drownings track each other for the same reason, and nobody has blamed ice cream.',
    source: 'Pearson, "On lines and planes of closest fit to systems of points in space" (1901)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Correlation_does_not_imply_causation',
  },

{
    id: 'mathematical-probability',
    term: 'Probability',
    subject: 'mathematics',
    letter: 'P',
    tagline: 'How much of this is expectation rather than fact.',
    explanation: 'Probability quantifies how likely an outcome is, and the key discipline is that it does not improve by collecting more of the same information about an event that is already determined. It is a number about your state of knowledge, not a property of the thing itself.',
    example: 'Rolling a six on a fair die has probability 1/6 however many times you roll beforehand. A single roll of 2.4 million needs no fairness at all, and the real question is what you knew about the die, not what the die "really" is.',
    source: 'Kolmogorov, "Grundbegriffe der Wahrscheinlichkeitsrechnung" (1933)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Probability',
  },
];
