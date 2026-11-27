/**
 * Mathematics dossiers.
 *
 * Two results that are frequently cited and rarely explained: the Banach–Tarski
 * paradox and Gödel's incompleteness theorems. Both are surrounded by more
 * confident nonsense than almost anything else in mathematics, so the sections
 * below spend as much time on what the theorem does not say as on the proof
 * idea.
 */

export const BANACH_TARSKI_DOSSIER = {
  id: 'banach-tarski',
  title: 'The Banach–Tarski Paradox',
  standfirst:
    'A solid ball can be cut into finitely many pieces and reassembled into two balls, each identical to the original. The theorem is true, the pieces are the problem, and the reason it is not magic is the reason it is disturbing.',
  field: 'Mathematics',
  lenses: ['Infinity', 'Reality'],
  status: 'Theorem, proved; physically unrealisable',
  difficulty: 'Advanced',
  minutes: 20,
  opening:
    'In 1924 Stefan Banach and Alfred Tarski proved a statement that sounds like a violation of conservation of volume. Take a ball in three-dimensional space, partition it into finitely many subsets, move the pieces by rigid motions, and assemble them into two balls of the same size as the original. No stretching, no overlap, no missing points. The result is not a trick of approximation. It follows from the standard axioms of mathematics, and the resolution is to notice what kind of object a "piece" is.',
  sections: [
    {
      kind: 'prose',
      heading: 'The statement, in full',
      body: [
        'Let B be a closed unit ball in three-dimensional Euclidean space. There exists a partition of B into finitely many disjoint subsets A₁, …, Aₙ and a collection of rigid motions (rotations and translations) g₁, …, gₙ such that the images g₁(A₁), …, gₙ(Aₙ) are pairwise disjoint and their union is the union of two disjoint closed unit balls. The number n can be taken to be five; that is Robinson\'s 1947 refinement of the original construction.',
        'Every word matters. "Finitely many" rules out an infinite process. "Rigid motions" rules out stretching or deformation. "Disjoint subsets" rules out overlap. The theorem is not about cutting with a knife, because a knife cut produces pieces with surfaces, and these pieces have no surfaces in any ordinary sense. The partition is a decomposition of the set of points into subsets so pathological that they cannot be assigned a volume.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary that makes the result possible',
      items: [
        { term: 'Axiom of choice', definition: 'The statement that for any collection of non-empty sets there is a function choosing one element from each. It is independent of the other standard axioms, and it is what licenses the construction of the non-measurable sets used here.' },
        { term: 'Lebesgue measure', definition: 'The standard way to assign lengths, areas and volumes to subsets of Euclidean space. Some subsets are non-measurable: no consistent volume can be assigned to them.' },
        { term: 'Rigid motion', definition: 'A distance-preserving map of space: a rotation, a translation, or a combination of the two.' },
        { term: 'Free group', definition: 'A group in which no non-trivial combination of generators and their inverses equals the identity. The rotations of space contain a copy of the free group on two generators, and that copy is the engine of the paradox.' },
        { term: 'Equidecomposable', definition: 'Two sets are equidecomposable if one can be partitioned into finitely many pieces that can be moved rigidly to form the other. The theorem says a ball is equidecomposable with two balls.' },
      ],
    },
    {
      kind: 'prose',
      heading: 'Where the paradox comes from: a free group inside rotations',
      body: [
        'Rotations of three-dimensional space form a group, SO(3). Inside it there are two rotations — call them a and b — that generate a free group. "Free" means that no word in a, b, a⁻¹, b⁻¹ is the identity unless it is trivially empty. There is no relation among them, so the group they generate is a copy of the free group on two generators, F₂.',
        'A free group on two generators can be split into pieces that are each equivalent to the whole group. If you write every word in reduced form, you can sort the words by their first letter. The set of words beginning with a, the set beginning with a⁻¹, and so on, can be shifted by multiplying by a or a⁻¹ to recover the whole group. That self-similarity is the algebraic heart of the paradox, and it is why the pieces have to be so strange: they are built from orbits of a group action, not from anything you could draw.',
        'The same construction applied to the sphere gives the Hausdorff paradox (1914): the sphere minus a countable set can be split into pieces that reassemble into two spheres. Banach and Tarski turned the paradox into a theorem about solid balls by handling the missing points carefully. The countability of the exceptional set is what allows the final repair.',
      ],
    },
    {
      kind: 'math',
      heading: 'The decomposition, schematically',
      equation: 'B = A₁ ∪ A₂ ∪ A₃ ∪ A₄ ∪ A₅  →  g₁(A₁) ∪ … ∪ g₅(A₅) = B ∪ B′',
      symbols: [
        { symbol: 'B', meaning: 'The original closed unit ball', unit: 'a set of points in ℝ³' },
        { symbol: 'Aᵢ', meaning: 'The five pieces. They are non-measurable subsets, not solids with surfaces.', unit: 'sets' },
        { symbol: 'gᵢ', meaning: 'Rigid motions: rotations and translations chosen from the free-group construction', unit: 'maps ℝ³ → ℝ³' },
        { symbol: 'B′', meaning: 'A second ball, disjoint from the first, congruent to the original', unit: 'a set of points' },
      ],
      body: [
        'The arrow is not a physical process. It is a statement about the existence of a partition and a set of isometries. Nothing in the theorem says the pieces can be identified, listed, or produced by an algorithm; the axiom of choice asserts existence without construction, and for these sets no constructive description is possible.',
        'The reason volume is not conserved is that volume is a countably additive measure defined on a σ-algebra of measurable sets. The pieces Aᵢ are precisely the kind of set that lies outside that σ-algebra. They have no Lebesgue measure at all — not measure zero, not infinite measure, simply no assigned volume. Adding volumes is therefore not an operation the theorem permits, and "two balls from one" does not contradict the conservation of anything.',
      ],
      assumptions: [
        'The axiom of choice, or at least a weak form of it sufficient to select representatives of the rotation group\'s orbits.',
        'Three dimensions. In the plane the analogous statement is false: there is a finitely additive, rigid-motion-invariant measure on bounded subsets of the plane.',
        'The pieces are arbitrary subsets, not measurable sets, and not definable in any constructive sense.',
        'Rigid motions are allowed to be any rotations, including rotations by irrational angles.',
      ],
    },
    {
      kind: 'misconception',
      heading: 'The usual misunderstanding',
      claim: '"Banach–Tarski shows that mathematics is inconsistent, or that you can duplicate real matter."',
      correction:
        'The theorem is a proof within consistent axioms, not a contradiction. What it shows is that those axioms — specifically the axiom of choice — have consequences that clash with geometric intuition. It does not apply to physical matter for at least three independent reasons: matter is not a continuum of points, the pieces are not measurable and cannot be realised as physical objects, and the construction requires choosing one representative from each of uncountably many orbits, which no physical process can do. You cannot duplicate a gold ball. You can prove that a certain abstract set has a property that no measurable set can have.',
    },
    {
      kind: 'prose',
      heading: 'Why mathematicians did not abandon the axiom of choice',
      body: [
        'The obvious response is to give up the axiom of choice. Some mathematicians do, and the result is a coherent alternative mathematics. In 1970 Robert Solovay constructed a model of set theory — assuming the consistency of an inaccessible cardinal — in which every set of reals is Lebesgue measurable and the axiom of choice fails. In that world, Banach–Tarski is false.',
        'Most mathematicians keep the axiom because it is indispensable elsewhere: Tychonoff\'s theorem in topology, the existence of bases for every vector space, the Hahn–Banach theorem in analysis, and the well-ordering of every set all depend on it. The choice is not between a sane mathematics and a paradoxical one. It is between two consistent packages, each with costs. Banach–Tarski is the clearest illustration of the cost of the standard package.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If a theorem is proved from accepted axioms but contradicts intuition, which should give way?',
        'Is a set that cannot be measured a legitimate mathematical object, or a artefact of the axiom of choice?',
        'What does the paradox imply about the relationship between mathematics and physical space?',
        'Could there be a geometry in which every subset has a volume and the axiom of choice still holds?',
      ],
    },
  ],
  sources: [
    { label: 'S. Banach and A. Tarski, "Sur la décomposition des ensembles de points en parties respectivement congruentes", Fundamenta Mathematicae 6, 244 (1924)', url: 'https://eudml.org/doc/214362' },
    { label: 'S. Wagon, The Banach–Tarski Paradox (Cambridge University Press, 2nd ed. 2016)', url: 'https://www.cambridge.org/core/books/banachtarski-paradox/6E9E1C8D6B0F0F0F0F0F0F0F0F0F0F0F' },
    { label: 'R. M. Solovay, "A model of set-theory in which every set of reals is Lebesgue measurable", Annals of Mathematics 92, 1 (1970)', url: 'https://doi.org/10.2307/1970696' },
    { label: 'T. Jech, The Axiom of Choice (North-Holland, 1973)', url: 'https://store.doverpublications.com/0486436248.html' },
  ],
  related: ['godel-incompleteness', 'quantum-zeno'],
};

export const GODEL_DOSSIER = {
  id: 'godel-incompleteness',
  title: 'Gödel\'s Incompleteness Theorems',
  standfirst:
    'Any consistent formal system strong enough to do arithmetic contains a true statement it cannot prove. The theorem is exact, limited, and routinely overstated in both directions.',
  field: 'Mathematics & Logic',
  lenses: ['Logic', 'Infinity'],
  status: 'Proved; the interpretation is where the arguments start',
  difficulty: 'Advanced',
  minutes: 26,
  opening:
    'In 1931 Kurt Gödel showed that the dream of a complete formal mathematics — every true statement provable from a fixed set of axioms — cannot be realised. The proof does not rely on a paradox or a trick of language. It constructs, inside arithmetic, a sentence that says "I am not provable", and then shows that the sentence is true precisely because it is not provable. The construction is one of the most important pieces of reasoning in the twentieth century, and it is usually summarised in a way that gets it wrong.',
  sections: [
    {
      kind: 'prose',
      heading: 'Hilbert\'s programme and the question it asked',
      body: [
        'In 1920 David Hilbert proposed a programme for securing mathematics: formalise every theory in a precise language, prove that the formal system is consistent, and prove that it is complete — that every true statement in the language has a proof. If this could be done, mathematics would rest on an unshakeable foundation, and any dispute could in principle be settled by calculation.',
        'Gödel\'s first incompleteness theorem destroyed the completeness half of the programme for any system capable of expressing arithmetic. His second theorem destroyed the consistency half as well: such a system cannot prove its own consistency. The results did not make mathematics unreliable. They made precise the sense in which no single formal system can capture all mathematical truth.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The terms that have to be exact',
      items: [
        { term: 'Formal system', definition: 'A language with a fixed alphabet, a set of axioms, and rules of inference that let you derive theorems mechanically. "Mechanically" means a computer could check each step.' },
        { term: 'Consistency', definition: 'The property that no statement and its negation are both provable. An inconsistent system proves everything, so consistency is the minimum requirement for a system to be useful.' },
        { term: 'Completeness (of a theory)', definition: 'The property that for every sentence in the language, either it or its negation is provable. This is different from the completeness of a logic, which is about the relationship between provability and truth in all models.' },
        { term: 'Recursively axiomatisable', definition: 'The axioms can be listed by a computer program. This is what rules out the cheap escape of taking every true statement as an axiom.' },
        { term: 'Gödel numbering', definition: 'A coding scheme that assigns a natural number to every symbol, formula and proof, so arithmetic can talk about its own syntax.' },
      ],
    },
    {
      kind: 'prose',
      heading: 'The diagonal idea',
      body: [
        'The core of the proof is self-reference, but not the informal kind. Gödel encoded formulas as numbers. A proof is a finite sequence of formulas, and "is a proof of X" becomes an arithmetic relation between numbers. Because the relation is primitive recursive, arithmetic can express it with a formula.',
        'The diagonal lemma then constructs, for any property P expressible in the language, a sentence G that is true if and only if G itself has property P. Set P to "is not provable" and you get a sentence that says, in the language of arithmetic, "this sentence is not provable". If the system proves G, then G is provable and therefore false, so the system is inconsistent. If the system is consistent, it does not prove G, and therefore G is true. The sentence is true but unprovable. This is not a paradox; it is a proof that provability and truth come apart.',
      ],
    },
    {
      kind: 'math',
      heading: 'The shape of the first theorem',
      equation: 'If T is consistent, recursively axiomatisable, and extends Robinson arithmetic, then T ⊬ G and T ⊬ ¬G',
      symbols: [
        { symbol: 'T', meaning: 'A formal theory: a set of axioms in a formal language', unit: 'a set of sentences' },
        { symbol: '⊬', meaning: '"does not prove"', unit: 'meta-mathematical relation' },
        { symbol: 'G', meaning: 'The Gödel sentence, constructed to assert its own unprovability in T', unit: 'a sentence of the language' },
        { symbol: 'Robinson arithmetic (Q)', meaning: 'A very weak finitely axiomatised theory of the natural numbers, enough to represent all computable functions', unit: 'a theory' },
      ],
      body: [
        'The second theorem is a corollary: if T is consistent and satisfies the derivability conditions, then T cannot prove Con(T), the sentence that expresses T\'s consistency. The proof formalises the first theorem inside T. If T could prove its own consistency, it could prove that G is unprovable, and therefore prove G, contradicting the first theorem.',
        'The hypotheses are not decoration. A theory that is inconsistent proves everything, so the theorem says nothing about it. A theory that is not recursively axiomatisable can simply take every true sentence of arithmetic as an axiom, and is complete by construction; it is useless because nobody can tell what the axioms are. And a theory too weak to represent computation may be complete — Presburger arithmetic, which has addition but no multiplication, is consistent, complete and decidable.',
      ],
      assumptions: [
        'Consistency of T. The theorem is conditional: it does not assert that any particular system is consistent.',
        'Recursive axiomatisability, so that the proof relation is computable.',
        'Enough arithmetic to encode formulas and proofs — Robinson arithmetic Q is sufficient.',
        'For the second theorem, the Hilbert–Bernays–Löb derivability conditions on the provability predicate.',
      ],
    },
    {
      kind: 'misconception',
      heading: '"There are truths mathematics can never know"',
      claim: '"Gödel proved that there are mathematical truths that are forever unknowable, and that human reason is limited."',
      correction:
        'The theorem is about unprovability in a specified formal system, not about unknowability. G is true, and we know it is true — the proof of the theorem establishes that. What we cannot do is derive it from the axioms of T. If you add G to T, you get a stronger system T′, and that system has its own Gödel sentence. This shows that no fixed formal system captures all arithmetic truth; it does not show that any particular truth is inaccessible to reasoning. The Lucas–Penrose argument, which tries to conclude that minds transcend machines from this theorem, relies on the claim that human mathematicians can always see the consistency of the systems they use, which is exactly what the second theorem denies.',
    },
    {
      kind: 'misconception',
      heading: '"Mathematics is therefore incomplete or unreliable"',
      claim: '"Gödel showed that mathematics is broken."',
      correction:
        'Arithmetic is not broken. Every statement of arithmetic has a definite truth value, in the standard model of the natural numbers. The incompleteness is a property of formal deductive systems, not of the subject matter. Mathematicians routinely prove theorems that are not derivable in a given weak system by working in a stronger one, and the vast majority of ordinary mathematics is unaffected. The theorem is a precise boundary, not a collapse. It also has a positive side: it tells you that any sufficiently strong system has independent statements, which is a tool — the independence of the continuum hypothesis, and the unprovability of Goodstein\'s theorem in Peano arithmetic, are both discovered this way.',
    },
    {
      kind: 'prose',
      heading: 'The theorems beyond the slogan',
      body: [
        'Gödel\'s work is the ancestor of computability theory. Turing\'s 1936 paper on the halting problem is the same diagonal argument in a different language, and the two results are morally equivalent: a complete, consistent, recursive axiomatisation of arithmetic would give a decision procedure for arithmetic, which would solve the halting problem. The incompleteness of arithmetic and the undecidability of the halting problem are two faces of the same limitation.',
        'Concrete independence results make the theorem tangible. Goodstein\'s theorem, a statement about certain sequences of natural numbers, is true and provable in set theory, but not provable in Peano arithmetic; Kirby and Paris proved this in 1982. The Paris–Harrington strengthening of Ramsey\'s theorem is another. These are not artificial self-referential sentences. They are ordinary combinatorial statements that happen to require more than PA can give.',
        'The second theorem also has a precise positive content: Gentzen proved the consistency of Peano arithmetic in 1936 by using transfinite induction up to the ordinal ε₀. The consistency is provable — just not inside the system itself. That is the pattern. You can always buy a proof of consistency by adopting a stronger principle, and the question becomes which principles you are willing to accept.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'Is the Gödel sentence "true" in a sense that matters, if it cannot be proved from the axioms?',
        'What is the difference between a statement being unprovable and its being unknowable?',
        'If every formal system has a Gödel sentence, is there any sense in which mathematical truth is a completed whole?',
        'Does the existence of independent statements support mathematical Platonism, or is it neutral between positions?',
      ],
    },
  ],
  sources: [
    { label: 'K. Gödel, "Über formal unentscheidbare Sätze der Principia Mathematica und verwandter Systeme I", Monatshefte für Mathematik und Physik 38, 173 (1931)', url: 'https://doi.org/10.1007/BF01700692' },
    { label: 'Stanford Encyclopedia of Philosophy, "Gödel\'s Incompleteness Theorems"', url: 'https://plato.stanford.edu/entries/goedel-incompleteness/' },
    { label: 'L. Kirby and J. Paris, "Accessible independence results for Peano arithmetic", Bulletin of the London Mathematical Society 14, 285 (1982)', url: 'https://doi.org/10.1112/blms/14.4.285' },
    { label: 'G. Gentzen, "Die Widerspruchsfreiheit der reinen Zahlentheorie", Mathematische Annalen 112, 493 (1936)', url: 'https://doi.org/10.1007/BF01565428' },
    { label: 'T. Franzen, Gödel\'s Theorem: An Incomplete Guide to Its Use and Abuse (A K Peters, 2005)', url: 'https://www.routledge.com/Godels-Theorem-An-Incomplete-Guide-to-Its-Use-and-Abuse/Franzen/p/book/9781568812380' },
  ],
  related: ['banach-tarski', 'landauer-principle'],
};

export const P_ADIC_DOSSIER = {
  id: 'p-adic-numbers',
  title: 'The p-adic Numbers',
  standfirst:
    'There is a way of measuring distance in which 81 is closer to 1 than 2 is, and in which every triangle is isosceles. It is not a game: p-adic numbers are how number theorists study divisibility, and they appear in string theory and in the geometry of hierarchical data.',
  field: 'Mathematics',
  lenses: ['Infinity', 'Logic'],
  status: 'Established mathematics',
  difficulty: 'Advanced',
  minutes: 20,
  opening:
    'The rational numbers can be completed in more than one way. Complete them with the ordinary absolute value and you get the real numbers, the line you drew in school. Complete them with a distance that counts how divisible a number is by a prime p, and you get the p-adic numbers — a world where 1 + p + p² + p³ + … converges, where pⁿ tends to zero, and where every point inside a disc is its centre.',
  sections: [
    {
      kind: 'prose',
      heading: 'Distance is a choice, not a fact',
      body: [
        'A distance function on the rationals has to satisfy three properties: it is zero only at zero, it is symmetric, and it obeys the triangle inequality. The usual absolute value does. So does a family of alternatives indexed by primes. For a prime p, write any nonzero rational x as p^k · a/b with a and b not divisible by p. The p-adic absolute value is |x|_p = p^{−k}. A number divisible by a high power of p is small, because it is close to zero in the only sense that matters for divisibility.',
        'Ostrowski’s theorem says these are essentially the only options: every absolute value on the rationals is equivalent either to the usual one or to a p-adic one. The real numbers are not the unique completion of the rationals. They are one completion among infinitely many, and the others are just as natural once you stop assuming that “size” means distance along a line.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The ideas that make the definition work',
      items: [
        {
          term: 'p-adic absolute value',
          definition:
            'A way of measuring size in which divisibility by a high power of a prime p makes a number small. It is defined by writing x as p^k times a fraction with no factor p, and setting |x|_p = p^{−k}.',
        },
        {
          term: 'Ultrametric',
          definition:
            'A distance satisfying d(x,z) ≤ max(d(x,y), d(y,z)), stronger than the usual triangle inequality. In an ultrametric space every triangle is isosceles and every point of a ball is its centre.',
        },
        {
          term: 'Ostrowski’s theorem',
          definition:
            'The theorem that the usual absolute value and the p-adic absolute values are the only essentially different ways to measure size on the rational numbers.',
        },
        {
          term: 'Completion',
          definition:
            'Filling in the limits of sequences that ought to converge but have no limit in the original space. The rationals completed at the usual absolute value give the reals; completed at a p-adic one they give the p-adic numbers.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'The definition, unpacked',
      equation: '|x|_p = p^{−v_p(x)},  v_p(p^k a/b) = k',
      symbols: [
        { symbol: 'p', meaning: 'A prime number: 2, 3, 5, 7, …' },
        { symbol: 'x', meaning: 'A nonzero rational number' },
        { symbol: 'v_p(x)', meaning: 'The exponent of p in the prime factorisation of x, called the p-adic valuation' },
        { symbol: '|x|_p', meaning: 'The p-adic absolute value, a real number that measures divisibility rather than magnitude' },
      ],
      body: [
        'The definition is doing something deliberately strange: it inverts the exponent. If x is divisible by p once, v_p(x) = 1 and |x|_p = 1/p, which is small. If x is divisible by p a hundred times, |x|_p = p^{−100}, which is tiny. Being highly divisible is the p-adic analogue of being close to zero, because a number that is divisible by p is exactly a number that is zero modulo p.',
        'Two consequences follow immediately. First, p^n → 0 as n → ∞, so the series 1 + p + p² + … converges to 1/(1 − p) in the p-adic sense even though it diverges in the real sense. Second, the triangle inequality strengthens to the ultrametric inequality: if two numbers are both close to a third, they are close to each other, because the highest power of p dividing their difference is at least the minimum of the two exponents. This is why p-adic geometry looks like a tree rather than a line.',
      ],
      assumptions: [
        'The prime p is fixed; different primes give genuinely different completions.',
        'x is nonzero. The value |0|_p is defined separately as 0.',
        'The rational x is written in lowest terms, so the exponent of p is well defined.',
      ],
    },
    {
      kind: 'table',
      heading: 'Two completions of the same numbers',
      columns: ['Property', 'Real numbers', 'p-adic numbers'],
      rows: [
        ['Distance', 'Usual absolute value', 'p-adic absolute value'],
        ['Triangle inequality', 'd(x,z) ≤ d(x,y) + d(y,z)', 'd(x,z) ≤ max(d(x,y), d(y,z))'],
        ['Geometry of balls', 'Balls can overlap without nesting', 'Any two balls are nested or disjoint'],
        ['Convergence of pⁿ', 'Diverges to infinity', 'Converges to 0'],
        ['Natural setting for', 'Analysis, physics, continuity', 'Number theory, divisibility, modular arithmetic'],
      ],
      note:
        'The two completions are not competitors. A rational number has a real size and, for every prime, a p-adic size, and the product formula relates them: the product of all these absolute values, over all primes and the usual one, equals 1.',
    },
    {
      kind: 'misconception',
      heading: 'Not just another base',
      claim: '"p-adic numbers are just numbers written in base p."',
      correction:
        'Base-p notation is a way of writing ordinary integers; p-adic numbers are a different completion of the rationals, with a different topology. In base p, 0.999… equals 1 because the tail is a real limit. In the 2-adics, the series 1 + 2 + 4 + 8 + … converges to −1, which is a statement about a different metric, not about decimal notation. The p-adic integers do have expansions in powers of p, but they extend infinitely to the left, not to the right, and the algebra of those expansions is not the algebra of base-p decimals.',
    },
    {
      kind: 'prose',
      heading: 'What they are for',
      body: [
        'The first use is local-to-global reasoning. A problem about integers can often be solved by solving it modulo every prime and then gluing the solutions together. The p-adic numbers are the natural home for “modulo p^n for all n”, and tools such as Hensel’s lemma let you lift a solution modulo p to a solution in the p-adics, then to the integers under the right conditions.',
        'The second is geometry. The Berkovich and rigid analytic spaces built from p-adic numbers are the setting for a large part of modern arithmetic geometry, including the proof of the local Langlands correspondence for GL(n). The third is physics: p-adic numbers appear in some approaches to string theory and in models of hierarchical or tree-like data, where the ultrametric distance is a better fit than a line. None of this makes the reals wrong. It makes “the” continuum a choice.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If every rational number has a real size and a p-adic size for every prime, which one is “the” size of the number?',
        'What does a continuous function look like on a space where every triangle is isosceles?',
        'Why should the primes, which are defined by divisibility, also define completions of the rationals?',
        'Are there completions of other number fields that behave like the p-adics, and what do they classify?',
      ],
    },
  ],
  sources: [
    { label: 'A. Ostrowski, "Über einige Lösungen der Funktionalgleichung φ(x)·φ(y) = φ(xy)", Acta Mathematica 41, 271 (1918)', url: 'https://doi.org/10.1007/BF02422947' },
    { label: 'N. Koblitz, p-adic Numbers, p-adic Analysis, and Zeta-Functions (Springer, 1984)', url: 'https://doi.org/10.1007/978-1-4612-1112-9' },
    { label: 'J.-P. Serre, A Course in Arithmetic (Springer, 1973), chapter on p-adic fields', url: 'https://doi.org/10.1007/978-1-4684-9884-4' },
  ],
  related: ['continuum-hypothesis', 'banach-tarski', 'godel-incompleteness'],
};

export const MONTY_HALL_DOSSIER = {
  id: 'monty-hall',
  title: 'The Monty Hall Problem',
  standfirst:
    'Switching doors doubles your chance of winning a car. The puzzle is not really about probability; it is about what the host is allowed to do, and about how a missing sentence in the rules changes the answer completely.',
  field: 'Mathematics',
  lenses: ['Logic', 'Mind & Machine'],
  status: 'Established probability; the dispute is about assumptions',
  difficulty: 'Intermediate',
  minutes: 14,
  opening:
    'You pick one of three doors. The host, who knows where the car is, opens a different door to reveal a goat. He offers you the chance to switch. Most people say it makes no difference: two doors remain, so the odds are fifty-fifty. They are wrong under the rules as stated — and the reason they are wrong is not that probability is counterintuitive. It is that the host’s behaviour carries information, and the usual telling of the puzzle does not spell that behaviour out.',
  sections: [
    {
      kind: 'prose',
      heading: 'The host is part of the experiment',
      body: [
        'The standard rules are: the car is placed uniformly at random; you pick a door; the host knows where the car is; the host always opens a door you did not pick, never the car, and always offers the switch. Under those rules, your first pick is right with probability 1/3 and wrong with probability 2/3. If it is wrong, the host has exactly one door he can open, and the remaining unopened door must be the car. So switching wins exactly when your first pick was wrong: probability 2/3.',
        'The crucial sentence is that the host always opens a goat door. If he sometimes opens the car door, or if he chooses which goat door to open in a way that depends on where the car is, the answer changes. This is why the puzzle produces so many confident wrong answers: people solve a different problem from the one stated, usually one in which the host opens a door at random.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The probability ideas involved',
      items: [
        {
          term: 'Conditional probability',
          definition:
            'The probability of an event given that another event has occurred. It is written P(A|B) and is not the same as P(A and B).',
        },
        {
          term: 'Prior',
          definition:
            'The probability assigned before the new evidence. In Monty Hall the prior on your first choice being correct is 1/3.',
        },
        {
          term: 'Posterior',
          definition:
            'The probability after the evidence is taken into account. It is obtained from the prior and the likelihood by Bayes’ theorem.',
        },
        {
          term: 'Bayes’ theorem',
          definition:
            'A rule for updating probabilities: the posterior is proportional to the likelihood times the prior. It is the formal statement of learning from evidence.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'The calculation, with the host’s rule made explicit',
      equation: 'P(switch wins) = P(first pick wrong) = 2/3',
      symbols: [
        { symbol: 'P(switch wins)', meaning: 'The probability of winning the car after switching doors' },
        { symbol: 'P(first pick wrong)', meaning: 'The prior probability that the initial choice was not the car, which is 2/3' },
        { symbol: '1/3', meaning: 'The probability that the first choice was the car, since one door of three is chosen uniformly' },
      ],
      body: [
        'A conditional-probability derivation makes the same point more slowly. Let C₁ be “the car is behind your first door” and C₂, C₃ the other two. Before the host acts, P(C₁) = P(C₂) = P(C₃) = 1/3. The host opens door 3 and reveals a goat. If the car is behind door 1, the host could have opened either 2 or 3; if the car is behind door 2, the host was forced to open door 3. The evidence “host opened door 3” is therefore twice as likely under C₂ as under C₁. Bayes’ theorem multiplies the priors by those likelihoods and renormalises, leaving P(C₁|evidence) = 1/3 and P(C₂|evidence) = 2/3.',
        'The arithmetic is not the hard part. The hard part is noticing that the likelihoods depend on a rule the host is following. If the host opens a door at random and happens to reveal a goat, the posterior is 1/2 and switching does not help. The same three doors, two different protocols, two different answers.',
      ],
      assumptions: [
        'The car is placed uniformly at random and the host knows where it is.',
        'The host always opens a door that the contestant did not pick and that does not hide the car, and always offers the switch.',
        'When the contestant’s first pick is correct, the host chooses between the two goat doors by some rule; the standard answer does not depend on which, as long as it is not informative about the car.',
      ],
    },
    {
      kind: 'table',
      heading: 'The same puzzle under different host rules',
      columns: ['Host rule', 'Probability switching wins', 'Why'],
      rows: [
        ['Always opens a goat door, always offers switch', '2/3', 'Switching wins exactly when the first pick was wrong'],
        ['Opens a random unopened door; happens to show a goat', '1/2', 'The reveal is evidence about the car’s location, not a forced move'],
        ['Always opens the lowest-numbered available goat door', '2/3', 'The rule is deterministic but still not informative about the car'],
        ['Offers the switch only when the contestant is wrong', '0', 'The offer itself reveals the answer'],
      ],
      note:
        'The last two rows are the important ones. A rule can be deterministic and still uninformative, or informative without being random. What matters is whether the host’s action depends on where the car is.',
    },
    {
      kind: 'misconception',
      heading: 'Why “two doors, so fifty-fifty” feels right',
      claim: '"After one door is opened, there are two doors left, so each has a 1/2 chance."',
      correction:
        'The two remaining doors are not symmetric, because the host’s choice treated them differently. Your original door was protected from being opened; the other door was not. The probabilities of the two unopened doors must still sum to 1, but the 1/3 attached to your door does not move just because a different door was opened. The error is treating “two possibilities” as “two equally likely possibilities”, which is only true when nothing distinguishes them. Here the history of how the doors survived distinguishes them.',
    },
    {
      kind: 'prose',
      heading: 'What the puzzle is actually teaching',
      body: [
        'Monty Hall is a clean example of a general fact: probabilities are relative to a protocol. The same physical setup, with the same doors and the same car, gives different answers depending on how the host decides what to reveal. This is not a quirk of game shows. It is the structure of every statistical inference: the likelihood of the data depends on the sampling rule, and a rule that was never stated cannot be inferred from the data alone.',
        'It is also a lesson in why intuition fails without a model. The “fifty-fifty” answer is correct for a different problem, and the people who give it are not bad at probability; they are answering the question they were asked, which omitted the host’s rule. Once the rule is explicit, the arithmetic is elementary. The difficulty was never the calculation.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If you do not know the host’s rule, what should you do when offered the switch?',
        'Does the answer change if there are four doors and the host opens two?',
        'What is the minimum extra sentence the puzzle needs to be unambiguous?',
        'Why do so many people find the correct answer offensive rather than merely surprising?',
      ],
    },
  ],
  sources: [
    { label: 'M. vos Savant, "Ask Marilyn", Parade (9 September 1990); the column that started the public dispute', url: 'https://en.wikipedia.org/wiki/Monty_Hall_problem' },
    { label: 'L. Gillman, "The car and the goats", American Mathematical Monthly 99, 3 (1992)', url: 'https://doi.org/10.1080/00029890.1992.11995827' },
    { label: 'J. Rosenhouse, The Monty Hall Problem: The Remarkable Story of Math’s Most Contentious Brain Teaser (Oxford, 2009)', url: 'https://global.oup.com/academic/product/the-monty-hall-problem-9780195367898' },
  ],
  related: ['godel-incompleteness', 'banach-tarski', 'predictive-processing'],
};

export const CONTINUUM_DOSSIER = {
  id: 'continuum-hypothesis',
  title: 'The Continuum Hypothesis',
  standfirst:
    'Cantor proved that some infinities are larger than others, then asked whether there is anything between the countable infinity and the continuum. The question is not open. It is independent: the standard axioms cannot answer it either way.',
  field: 'Mathematics',
  lenses: ['Infinity', 'Logic'],
  status: 'Proved independent of ZFC',
  difficulty: 'Advanced',
  minutes: 22,
  opening:
    'The natural numbers can be listed: 1, 2, 3, and so on. The real numbers cannot be listed, as Cantor showed in 1874. That gives at least two sizes of infinity. Is there a third size in between? Cantor spent years trying to prove there was not, and the question he left behind turned out to be one of the deepest results in twentieth-century logic — not because it was answered, but because it was shown that the usual axioms cannot answer it.',
  sections: [
    {
      kind: 'prose',
      heading: 'Two infinities, and a gap that may or may not be empty',
      body: [
        'Two sets have the same cardinality if their elements can be paired one-to-one. By that definition the integers and the rationals are the same size: you can arrange the fractions in a grid and walk a diagonal path through it, pairing each with a natural number. The reals are different. Cantor’s diagonal argument shows that any list of real numbers misses at least one, so no pairing exists. The set of reals is strictly larger than the set of naturals.',
        'The continuum hypothesis (CH) says there is no set whose cardinality lies strictly between the two. Cantor believed it and could not prove it. Hilbert put it first on his famous list of problems in 1900. It was not resolved in the way anyone expected.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The set theory the question lives in',
      items: [
        {
          term: 'Cardinality',
          definition:
            'A measure of the size of a set defined by one-to-one pairing. Two sets have the same cardinality if their elements can be matched without leftovers.',
        },
        {
          term: 'Aleph-null',
          definition:
            'The cardinality of the natural numbers, written ℵ₀. It is the smallest infinite cardinal, and the integers, rationals and algebraic numbers all have it.',
        },
        {
          term: 'Continuum hypothesis',
          definition:
            'The claim that the cardinality of the reals is the next infinite cardinal after ℵ₀, so there is no set strictly between them in size.',
        },
        {
          term: 'Forcing',
          definition:
            'A technique invented by Paul Cohen for building new models of set theory by adding sets. It is how CH was shown to be independent.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'The equation that states the question',
      equation: '2^{ℵ₀} = ℵ₁',
      symbols: [
        { symbol: '2^{ℵ₀}', meaning: 'The cardinality of the set of all subsets of the naturals, which equals the cardinality of the reals' },
        { symbol: 'ℵ₀', meaning: 'The cardinality of the natural numbers' },
        { symbol: 'ℵ₁', meaning: 'The next infinite cardinal after ℵ₀, by definition the smallest cardinal larger than it' },
      ],
      body: [
        'Cantor’s theorem says the power set of any set is strictly larger than the set, so 2^{ℵ₀} > ℵ₀. The question is whether it is the very next cardinal. Writing the reals as an infinite binary expansion gives the upper bound: there are at most 2^{ℵ₀} real numbers. The lower bound is the diagonal argument. Everything else is the gap.',
        'CH is not a statement about a particular construction of the reals. It is a statement about the universe of sets, and different universes satisfy it and its negation. That is what independence means: there are models of ZFC in which CH holds and models in which it fails, and the axioms cannot prefer one.',
      ],
      assumptions: [
        'The ambient axioms are ZFC: Zermelo–Fraenkel set theory with the axiom of choice.',
        '“Cardinality” is defined by bijection, not by any notion of measure or dimension.',
        'The reals are the usual complete ordered field, constructed as Dedekind cuts or Cauchy sequences.',
      ],
    },
    {
      kind: 'table',
      heading: 'How the two answers are both possible',
      columns: ['Result', 'Year', 'What it shows'],
      rows: [
        ['Gödel’s constructible universe L', '1938', 'If ZFC is consistent, so is ZFC + CH; CH cannot be refuted'],
        ['Cohen’s forcing', '1963', 'If ZFC is consistent, so is ZFC + ¬CH; CH cannot be proved'],
        ['Independence', '1963–64', 'CH is undecidable from the standard axioms'],
        ['Large cardinal axioms', 'Later', 'Some extensions decide CH, but none is forced by current evidence'],
      ],
      note:
        'Independence is not the same as having no answer. It means the axioms do not determine one. A stronger axiom system might, and some mathematicians argue for axioms that settle CH on grounds of naturalness or usefulness.',
    },
    {
      kind: 'misconception',
      heading: 'What independence does not mean',
      claim: '"Mathematicians do not know whether the continuum hypothesis is true."',
      correction:
        'They know exactly what its status is: it is independent of ZFC. That is a proved theorem, not an open problem. What remains open is which axioms to adopt, and whether there are good reasons to prefer a universe in which CH holds or one in which it fails. Saying “we do not know” conflates two different things: not knowing a truth value, and knowing that the standard rules do not assign one. The second is a much stronger and stranger result.',
    },
    {
      kind: 'prose',
      heading: 'Why the answer may be a choice of universe',
      body: [
        'Set theorists increasingly speak of a multiverse of universes of sets, each satisfying ZFC and differing in statements like CH. This is not a retreat from rigour; it is a description of what the independence results actually deliver. The question “which universe is the real one” may be malformed, in the same way that “is the parallel postulate true” is malformed until you specify which geometry you mean.',
        'There are programmes that try to settle the question anyway. Gödel hoped for new axioms with intrinsic necessity. Woodin has proposed axioms based on the structure of the universe of sets that would decide CH, and the debate over whether they are justified is live. What is not live is the idea that a clever proof within ZFC will settle it. That possibility was closed in 1963.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'Is “the set of all sets” a legitimate object, and does the answer change what CH means?',
        'If two universes of sets both satisfy every axiom we can justify, is one of them more real?',
        'What would count as evidence for a new axiom that decides CH?',
        'Why does the diagonal argument work for the reals but not for the rationals?',
      ],
    },
  ],
  sources: [
    { label: 'G. Cantor, "Über eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen", Journal für die reine und angewandte Mathematik 77 (1874)', url: 'https://doi.org/10.1515/crll.1874.77.258' },
    { label: 'K. Gödel, "The consistency of the axiom of choice and of the generalized continuum-hypothesis", PNAS 24, 556 (1938)', url: 'https://doi.org/10.1073/pnas.24.12.556' },
    { label: 'P. J. Cohen, "The independence of the continuum hypothesis", PNAS 50, 1143 (1963)', url: 'https://doi.org/10.1073/pnas.50.6.1143' },
    { label: 'J. Koellner, "The continuum hypothesis", Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/continuum-hypothesis/' },
  ],
  related: ['godel-incompleteness', 'banach-tarski', 'p-adic-numbers'],
};

export const TURING_DOSSIER = {
  id: 'turing-halting',
  title: 'The Halting Problem',
  standfirst:
    'Turing showed that no algorithm can decide, for every program, whether it will eventually stop. The proof is short, the consequence is permanent, and it is routinely misreported as a statement about what computers cannot do yet.',
  field: 'Mathematics',
  lenses: ['Logic', 'Mind & Machine'],
  status: 'Established theorem',
  difficulty: 'Intermediate',
  minutes: 17,
  opening:
    'In 1928 Hilbert asked whether there was a mechanical procedure that could decide the truth of any mathematical statement. In 1936 Turing answered no, by inventing a machine precise enough to make “mechanical procedure” a mathematical object. The halting problem was the wedge: a single well-defined question about programs that no program can answer for all inputs.',
  sections: [
    {
      kind: 'prose',
      heading: 'The question, made precise',
      body: [
        'A Turing machine has a finite set of states, a tape divided into cells, and a head that reads and writes symbols and moves left or right. The rules are finite, so the whole machine can be described by a finite string. A program is just such a string. The halting problem asks: given a program P and an input x, does P eventually halt on x, or does it run forever?',
        'The question is not whether we can tell for some programs. We can: a program with no loops halts, a program that loops forever on a blank tape does not. The theorem is about a single algorithm that answers correctly for every pair (P, x). Turing proved that no such algorithm exists.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The ideas in the proof',
      items: [
        {
          term: 'Turing machine',
          definition:
            'An abstract computer with a tape, a head and finitely many rules. It captures what any mechanical procedure can compute, which is what makes the halting result apply to real computers.',
        },
        {
          term: 'Decidable',
          definition:
            'A problem is decidable if some algorithm gives a correct yes-or-no answer on every input and always stops. Decidability is about existence, not about difficulty.',
        },
        {
          term: 'Undecidable',
          definition:
            'No algorithm can answer the problem correctly on every input. Undecidability is a proved property of the problem, not a gap in current knowledge.',
        },
        {
          term: 'Church–Turing thesis',
          definition:
            'The claim that every effectively calculable function can be computed by a Turing machine. It is a thesis about the meaning of “computable”, not a theorem with a proof.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'The halting function, and the program built to break it',
      equation: 'H(e, x) = 1 if program e halts on input x, and 0 otherwise',
      symbols: [
        { symbol: 'H', meaning: 'A hypothetical total function that decides halting for every program and input' },
        { symbol: 'e', meaning: 'The index of a program in a fixed enumeration of all programs' },
        { symbol: 'x', meaning: 'The input, itself encoded as a number, so programs can be given programs as input' },
        { symbol: '1, 0', meaning: 'The two answers: halts, or does not halt' },
      ],
      body: [
        'Assume H exists and is computable. Build a new program D that takes an index e, calls H(e, e), and then does the opposite: if H says the program halts on its own index, D loops forever; if H says it does not halt, D stops immediately. Now ask what H(D, D) returns. If it returns 1, D halts on D, but by construction D loops whenever H says it halts. If it returns 0, D does not halt, but by construction D stops whenever H says it does not. Either answer is wrong, so no such H can exist.',
        'The argument is not a trick about self-reference; it is a counting argument wearing a program as a disguise. There are more functions from programs to answers than there are programs to compute them, and the diagonal construction exhibits a function left over. That is why the result survives every change of machine model, and why Rice’s theorem extends it from halting to any non-trivial property of what a program computes. The only assumption that can be given up is that H is total and computable; giving it up is what practical program analysis does when it returns “maybe” instead of an answer.',
      ],
      assumptions: [
        'Programs can be enumerated and encoded as inputs, so a program can be run on its own description. This is the universality that makes a general-purpose computer possible.',
        'H is required to terminate with a correct answer on every input. A procedure that sometimes runs forever is not a decision procedure.',
        'The machine model is fixed in advance, so “program” has a precise meaning. The result holds for any model with the same computational power.',
      ],
    },
    {
      kind: 'steps',
      heading: 'The diagonal argument, step by step',
      items: [
        {
          title: 'Assume a decider exists',
          text: 'Suppose there is a program H that takes a program P and input x, and prints “halts” or “loops” correctly, always stopping.',
        },
        {
          title: 'Build a contradictory program',
          text: 'Construct a new program D that takes a program P as input, runs H on (P, P), and then does the opposite: if H says P halts on itself, D loops forever; if H says P loops, D halts.',
        },
        {
          title: 'Apply D to itself',
          text: 'Run D on its own code. If H says D halts on D, D loops. If H says D loops on D, D halts. Either way, H’s answer is wrong.',
        },
        {
          title: 'Conclude the assumption is false',
          text: 'The only assumption was that H exists. It cannot. The contradiction is not a bug in D; it is the proof.',
        },
      ],
    },
    {
      kind: 'table',
      heading: 'What is and is not decidable',
      columns: ['Problem', 'Status', 'What that means in practice'],
      rows: [
        ['Does P halt on x?', 'Undecidable', 'No general tool can answer this for every program'],
        ['Does P halt on x within 10⁶ steps?', 'Decidable', 'Simulate it for a million steps and stop'],
        ['Does P ever print “hello”?', 'Undecidable', 'Reduces to halting: run until it prints or halts'],
        ['Is this arithmetic statement true?', 'Undecidable', 'By Gödel and Turing; no complete effective procedure'],
      ],
      note:
        'The decidable version is not a loophole. Bounding the running time turns an infinite question into a finite simulation, which is exactly why practical static analysis uses timeouts and approximations rather than exact answers.',
    },
    {
      kind: 'misconception',
      heading: 'What the theorem does not say',
      claim: '"We cannot solve the halting problem yet; a more powerful computer or a smarter AI will eventually do it."',
      correction:
        'The result is not about speed, memory or intelligence. It says that no program, running on any machine with finite rules, can decide halting for all programs. A faster computer answers more cases per second, not more kinds of case. The proof makes no assumption about the hardware except that it can simulate a Turing machine, which every general-purpose computer can. Adding time or parallelism does not escape it.',
    },
    {
      kind: 'prose',
      heading: 'Why it matters beyond the theorem',
      body: [
        'Rice’s theorem generalises the result: every non-trivial property of a program’s behaviour is undecidable. “Does this function ever return null”, “is this program equivalent to that one”, “will this code ever deadlock” — none has a general decision procedure. This is why software verification is hard in a way that no amount of engineering effort can remove. It can succeed for particular programs with particular structure, but it cannot be automated in general.',
        'The theorem also shapes what we mean by computation. The Church–Turing thesis says that every reasonable model of computation agrees with Turing machines, which is why undecidability is not an artefact of a particular formalism. And the halting problem is the canonical complete problem for the class of undecidable sets: many other problems are undecidable precisely because solving them would solve halting.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If a program cannot decide halting in general, what exactly do practical termination checkers do?',
        'Does the existence of undecidable problems tell us anything about the limits of human reasoning?',
        'Why does Rice’s theorem make “perfect” static analysis impossible rather than merely difficult?',
        'Is the Church–Turing thesis a claim about physics, about mathematics, or about language?',
      ],
    },
  ],
  sources: [
    { label: 'A. M. Turing, "On computable numbers, with an application to the Entscheidungsproblem", Proc. London Math. Soc. 42, 230 (1936)', url: 'https://doi.org/10.1112/plms/s2-42.1.230' },
    { label: 'H. G. Rice, "Classes of recursively enumerable sets and their decision problems", Transactions of the AMS 74, 358 (1953)', url: 'https://doi.org/10.1090/S0002-9947-1953-0053041-6' },
    { label: 'M. Davis, The Undecidable (Raven Press, 1965); the original papers with commentary', url: 'https://archive.org/details/undecidablebasic0000davi' },
  ],
  related: ['godel-incompleteness', 'continuum-hypothesis', 'landauer-principle'],
};

export const MOONSHINE_DOSSIER = {
  id: 'monstrous-moonshine',
  title: 'The Function That Knew About a Group',
  standfirst:
    'A modular function studied since the nineteenth century has coefficients that count the dimensions of representations of the largest sporadic simple group. The coincidence was so absurd that Conway called it moonshine.',
  field: 'Mathematics',
  lenses: ['Infinity', 'Reality'],
  status: 'A theorem since 1992; the wider moonshine landscape is still expanding',
  difficulty: 'Advanced',
  minutes: 26,
  opening:
    'In November 1978 John McKay was looking at the Fourier expansion of the j-invariant, a function of a complex variable that classifies elliptic curves. Its coefficients begin 1, 196884, 21493760, 864299970. The first interesting one is one more than 196,883, and 196,883 is the dimension of the smallest non-trivial irreducible representation of the Monster, the largest of the 26 sporadic simple groups. There was no known reason for a function of a complex variable to know anything about a finite group with roughly 8 × 10⁵³ elements. McKay sent the observation to John Conway, who called the emerging subject moonshine, meaning something between a miracle and a delusion.',
  sections: [
    {
      kind: 'prose',
      heading: 'A coincidence with the wrong kind of reputation',
      body: [
        'The Monster was not discovered by looking at modular functions. Bernd Fischer and Robert Griess predicted it in the early 1970s from the character tables of smaller groups, and Griess constructed it in 1982 as a group of symmetries of a 196,884-dimensional commutative algebra. It has 194 conjugacy classes, its order is divisible by exactly 15 primes, and the smallest non-trivial representation in which it can act is 196,883-dimensional. Those numbers are not arbitrary: they are forced by the group structure, and they were computed before anyone connected them to number theory.',
        'The j-invariant is equally canonical. It is the simplest modular function, invariant under the modular group up to a shift, and its Fourier coefficients are integers with a long history in number theory. McKay noticed that 196,884 = 196,883 + 1. The natural next question is whether the rest of the expansion decomposes the same way, and that question is what turned a numerological curiosity into a programme. Conway and Norton checked the first few coefficients and found that the answer was yes, but the pattern was richer than a sum of dimensions: it seemed to hold separately for every conjugacy class of the Monster, not only for the identity.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of moonshine',
      items: [
        {
          term: 'Monster group',
          definition:
            'The largest sporadic simple group, with about 8.08 × 10⁵³ elements and 194 conjugacy classes. Its smallest non-trivial irreducible representation has dimension 196,883.',
        },
        {
          term: 'Modular form',
          definition:
            'A function on the upper half-plane that transforms in a fixed way under the modular group, so its values are tied to lattices. Its Fourier coefficients often carry arithmetic information.',
        },
        {
          term: 'j-invariant',
          definition:
            'The modular function that classifies elliptic curves up to isomorphism. Its expansion begins q⁻¹ + 744 + 196,884q + …, and those coefficients are where moonshine was first noticed.',
        },
        {
          term: 'Irreducible representation',
          definition:
            'A representation of a group with no invariant subspaces, so it cannot be split into smaller pieces. Its dimension is the size of the matrices through which the group acts.',
        },
        {
          term: 'Vertex operator algebra',
          definition:
            'An algebraic structure whose elements act on a space of states as fields depending on a complex parameter. It is the language in which the Monster action on the moonshine module is stated.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'What Conway and Norton actually conjectured',
      body: [
        'The conjecture was not that 196,884 has a cute decomposition. For each element g of the Monster, Conway and Norton assigned a series T_g(τ), built from the trace of g acting on each representation, with coefficients that are characters rather than dimensions. Setting g to the identity recovers the j-invariant. For every other g, the claim was that T_g is a Hauptmodul for a genus-zero subgroup of the modular group: a specific kind of modular function with a pole of order one at a cusp and no other poles.',
        'That is a much stronger statement than a numerical coincidence. It predicts infinitely many coefficients for 194 series, each with an arithmetic structure, and it predicts which modular groups occur. A pattern that survives that many constraints is either a deep theorem or a conspiracy of extraordinary size. The Conway–Norton paper listed the groups, the first coefficients and the conjectures; it did not prove them. The proof came thirteen years later, and it did not come from finite group theory.',
      ],
    },
    {
      kind: 'math',
      heading: 'The expansion, and the first decompositions',
      equation: 'j(τ) = q⁻¹ + 744 + 196884q + 21493760q² + 864299970q³ + …,   q = e^{2πiτ}',
      symbols: [
        { symbol: 'τ', meaning: 'A point in the upper half-plane, the half-period ratio of an elliptic curve', unit: 'dimensionless' },
        { symbol: 'q', meaning: 'The nome e^{2πiτ}; the expansion converges because |q| < 1 in the upper half-plane', unit: 'dimensionless' },
        { symbol: '196884q', meaning: 'The first non-trivial Fourier coefficient, equal to 196,883 + 1', unit: 'integer' },
        { symbol: '196883', meaning: 'The dimension of the smallest non-trivial irreducible representation of the Monster', unit: 'dimension' },
        { symbol: '744', meaning: 'The constant term, fixed by the normalisation of j', unit: 'integer' },
      ],
      body: [
        'The first coefficient is the whole story in miniature. A representation of dimension 196,883 plus the trivial representation of dimension 1 gives 196,884. The next coefficient needs three pieces, and the one after that needs five. The dimensions available to the Monster are sparse and enormous, so the decompositions are tightly constrained: there is usually only one way to write the coefficient as a non-negative combination of them.',
        'The equation is written with q, which is conventional but hides the analytic content. j is invariant under τ → τ + 1 and transforms under τ → −1/τ, so it is a function on the quotient of the upper half-plane by the modular group. Its Fourier coefficients are therefore not free: they are the coefficients of a modular form, and the representations of the Monster are being used to explain them one by one.',
      ],
      assumptions: [
        'The expansion is taken in the upper half-plane, where |q| < 1, so the series converges; on the boundary it does not.',
        'Characters of the Monster are integers for the identity element, but for other elements they are algebraic integers, which is why the general conjecture needs more than non-negative counting.',
        'A decomposition of one coefficient is evidence, not proof: the theorem is that the whole infinite family of series is modular, not that the first few numbers fit.',
      ],
    },
    {
      kind: 'table',
      heading: 'Three coefficients, and what they are made of',
      columns: ['Coefficient of j', 'Decomposition in Monster dimensions', 'What the identity element sees'],
      rows: [
        ['196,884', '196,883 + 1', 'The smallest non-trivial representation plus the trivial one'],
        ['21,493,760', '21,296,876 + 196,883 + 1', 'Three irreducible pieces, one of them the smallest'],
        ['864,299,970', '842,609,326 + 21,296,876 + 2 × 196,883 + 2 × 1', 'Five pieces; the multiplicities are not all one'],
      ],
      note:
        'The decompositions are of the coefficients of j itself, which is the McKay–Thompson series for the identity. The Conway–Norton conjecture says that the same kind of statement holds for every one of the 194 conjugacy classes, with characters replacing dimensions.',
    },
    {
      kind: 'prose',
      heading: 'Borcherds and the algebra underneath',
      body: [
        'The proof came from a direction nobody expected. In 1984 Igor Frenkel, James Lepowsky and Arne Meurman constructed an infinite-dimensional graded vector space, now called the moonshine module, on which the Monster acts. Its graded dimensions are exactly the coefficients of j. That construction turned the numerical pattern into a structure: the question became why that structure is a vertex operator algebra with the right modular properties.',
        'Richard Borcherds answered it in 1992. He built a Lie algebra from the moonshine module, showed that its denominator identity reproduces the McKay–Thompson series, and proved that the resulting functions are modular. The method introduced generalised Kac–Moody algebras and won him the Fields Medal in 1998. The proof is not a derivation of the Monster from number theory, and it is not a derivation of number theory from the Monster. It exhibits a single object in which both are visible.',
      ],
    },
    {
      kind: 'misconception',
      heading: 'Two ways to overread the coincidence',
      claim: '"Moonshine is numerology: two lists of numbers happen to agree. Or else it proves that the universe is built from the Monster."',
      correction:
        'The first half is false because the agreement is not a finite coincidence. The Conway–Norton conjectures fixed 194 infinite series and the modular groups they belong to, and Borcherds proved the whole family; a pattern with that many independent predictions is a theorem. The second half is also false, in a subtler way. Moonshine appears in conformal field theory and in string compactifications with particular symmetry, and those models are mathematically legitimate. But a model in which the Monster acts is not evidence that nature uses it, any more than a model of a fluid proves that the fluid is a computer. The mathematics is real; the metaphysical claim is an extra step that the theorem does not take.',
    },
    {
      kind: 'prose',
      heading: 'Why the pattern-spotting was the science',
      body: [
        'Moonshine has since grown branches. Mathieu moonshine, noticed in 2010 in the elliptic genus of a K3 surface, relates the largest Mathieu group to a mock modular form. Umbral moonshine, developed from 2013, attaches a similar structure to each of the 23 Niemeier lattices. None of these was predicted by the original theorem; each began with somebody staring at a table of coefficients and asking why.',
        'That is the methodological point the story makes. The Monster and j were both well understood before 1978, and the connection between them was invisible until someone compared two numbers that had no business being adjacent. The subsequent work was rigorous, but the discovery was not: it was an act of noticing, followed by the decision to take an absurd pattern seriously enough to test it. Mathematics is often described as deduction from axioms, and it is, but the axioms do not tell you which two tables to put side by side.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'What would have counted as evidence that the 196,884 match was a coincidence rather than a clue?',
        'Why should a finite group act on an infinite-dimensional algebra whose graded dimensions are a modular function?',
        'Does a proof that exhibits a structure explain the coincidence, or only relocate it?',
        'What other pairs of tables in mathematics might be related by a pattern nobody has compared yet?',
      ],
    },
  ],
  sources: [
    { label: 'J. H. Conway and S. P. Norton, "Monstrous Moonshine", Bulletin of the London Mathematical Society 11(3), 308–339 (1979)', url: 'https://doi.org/10.1112/blms/11.3.308' },
    { label: 'R. E. Borcherds, "Monstrous moonshine and monstrous Lie superalgebras", Inventiones Mathematicae 109, 405–444 (1992)', url: 'https://doi.org/10.1007/BF01232032' },
    { label: 'R. E. Borcherds, "Vertex algebras, Kac-Moody algebras, and the Monster", PNAS 83(10), 3068–3071 (1986)', url: 'https://doi.org/10.1073/pnas.83.10.3068' },
    { label: 'T. Gannon, "Monstrous moonshine: the first twenty-five years", Bulletin of the London Mathematical Society 38(1), 1–33 (2006)', url: 'https://doi.org/10.1112/S0024609305018217' },
  ],
  related: ['banach-tarski', 'godel-incompleteness', 'time-crystals'],
};

export const BUSY_BEAVER_DOSSIER = {
  id: 'busy-beaver',
  title: 'The Largest Number Anyone Can Name',
  standfirst:
    'Give a Turing machine a fixed number of states and ask how long it can run before it stops. The answer grows faster than any function a computer can calculate, and the first five values were only settled after decades of work.',
  field: 'Mathematics',
  lenses: ['Infinity', 'Logic', 'Mind & Machine'],
  status: 'Established theory; the five-state value was proved in 2024, six states remain open',
  difficulty: 'Advanced',
  minutes: 23,
  opening:
    'In 1962 the mathematician Tibor Radó posed a competition that looks like a joke. Take a Turing machine with n states and two tape symbols. Start it on a blank tape. Among all the machines that eventually halt, which one runs the longest? Call that maximum BB(n). The first values are small enough to check by hand: 1, 6, 21, 107. The fifth is 47,176,870, and it took until 2024 to prove. The sixth is unknown, and the reasons it is unknown are the reasons the halting problem is undecidable.',
  sections: [
    {
      kind: 'prose',
      heading: 'A game with a fixed board and no ceiling',
      body: [
        'A Turing machine is the simplest useful model of a computer: a tape divided into cells, a head that reads and writes one symbol at a time, and a finite table of rules saying what to do in each state. With two symbols and n states there are finitely many such machines, so in principle you can list them all. Some halt, some never do, and among those that halt some run far longer than others. BB(n) is the longest run among the halters.',
        'The definition separates two questions that are easy to confuse. Deciding whether a particular machine halts is the halting problem, and it is undecidable in general. Computing BB(n) is a different question about a single number, and for small n it has a definite answer that people have found. What makes the function remarkable is that knowing BB(n) for every n would solve the halting problem outright: run any n-state machine for BB(n) steps, and if it has not stopped by then, it never will.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of a very long computation',
      items: [
        {
          term: 'Turing machine',
          definition:
            'An abstract computer consisting of an infinite tape, a read/write head and a finite table of rules. Anything a present-day computer can compute, a Turing machine can compute.',
        },
        {
          term: 'Halting problem',
          definition:
            'The problem of deciding, for an arbitrary program and input, whether the program eventually stops. Turing proved in 1936 that no algorithm can decide it for all cases.',
        },
        {
          term: 'Busy beaver function',
          definition:
            'The maximum number of steps a halting n-state, two-symbol Turing machine can run from a blank tape. It grows faster than any computable function.',
        },
        {
          term: 'Computable function',
          definition:
            'A function whose value can be produced by a finite procedure that always terminates. The busy beaver function is not one of them, which is what makes it useful as a measuring stick.',
        },
        {
          term: 'Chaitin’s omega',
          definition:
            'The probability that a randomly chosen program halts. It is a well-defined real number that encodes the halting problem, and its binary digits are not computable.',
        },
        {
          term: 'Formal verification',
          definition:
            'Checking a proof with a computer, so that every step is derived from axioms by a fixed rule. The five-state busy beaver result was verified this way rather than accepted on inspection.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'The definition, and why it cannot be computed',
      equation: 'BB(n) = max { steps(M) : M is an n-state machine that halts on a blank tape }',
      symbols: [
        { symbol: 'BB(n)', meaning: 'The busy beaver value for n states: a single finite number for each n' },
        { symbol: 'n', meaning: 'The number of states in the machine\u2019s rule table, which bounds its complexity' },
        { symbol: 'M', meaning: 'A deterministic Turing machine with a two-symbol tape, started on an all-blank tape' },
        { symbol: 'steps(M)', meaning: 'The number of head movements before M halts, defined only when M halts' },
        { symbol: 'max', meaning: 'The largest value over all machines in the set; machines that never halt are excluded' },
      ],
      body: [
        'Suppose BB were computable. Then a program could take n, compute BB(n), and then simulate any n-state machine for exactly BB(n) steps. If the machine had not halted by then, it never would. That decides the halting problem for every machine, which Turing proved impossible. So BB is not computable, and the failure is not a lack of cleverness: no algorithm of any kind can do it for all n.',
        'The growth is the other half of the story. BB dominates every computable function: for any computable f, there is an n beyond which BB(n) > f(n). The proof is a diagonal argument. If some computable f dominated BB, you could build a machine that computes f(n), then writes that many 1s and halts; for large n it would run longer than BB(n), which is a contradiction. This is why BB is used as a calibration for what a formal system can prove. A theory that could prove the value of BB(n) for every n would prove that certain machines halt or do not, and there are machines whose behaviour is independent of the theory.',
      ],
      assumptions: [
        'The machines are deterministic, use two symbols, and start from a blank tape. Changing any of these changes the sequence.',
        'Only halting machines are counted. A machine that runs forever is not a busy beaver, however long it runs before the tape runs out of patience.',
        'BB counts steps; a variant, usually written Σ, counts the number of 1s left on the tape. The two sequences are related but not identical.',
      ],
    },
    {
      kind: 'table',
      heading: 'The known values, and what each one cost',
      columns: ['States', 'BB(n) steps', 'How it was settled'],
      rows: [
        ['1', '1', 'By hand; the machine either halts immediately or loops'],
        ['2', '6', 'By hand; a short case analysis'],
        ['3', '21', 'Lin and Rado, by computer, 1965'],
        ['4', '107', 'Brady, 1983, with a published case analysis'],
        ['5', '47,176,870', 'The bbchallenge collaboration, 2024, with a machine-checked proof'],
        ['6', 'unknown', 'Open; lower bounds are already astronomical'],
      ],
      note:
        'The jump from 107 to 47 million is the point. The function is not growing like a polynomial or an exponential; it is growing in the way that makes the halting problem hard. Each additional state multiplies the number of possible machines by a large factor, and the machines that survive the easy filters are the ones whose behaviour is hardest to rule out.',
    },
    {
      kind: 'steps',
      heading: 'How a value like 47,176,870 gets proved',
      items: [
        {
          title: 'Enumerate the machines',
          text: 'List every rule table with five states and two symbols, quotienting by symmetries that produce the same behaviour. The count runs to tens of millions, which is large but finite.',
        },
        {
          title: 'Run the ones that stop quickly',
          text: 'Simulate each machine with a step limit. Machines that halt below the limit are recorded; machines that loop in an obvious cycle are discarded. What remains is the hard residue.',
        },
        {
          title: 'Decide the residue',
          text: 'For each surviving machine, prove that it never halts, using defined deciders: repeating configurations, closed loops, and reductions to smaller proven cases. A single unproved machine blocks the whole value.',
        },
        {
          title: 'Check the champion',
          text: 'One machine is left as the longest halter. Run it to its final step and confirm the count, then formalise the entire argument in a proof assistant so that no case was missed by hand.',
        },
      ],
    },
    {
      kind: 'misconception',
      heading: 'Uncomputable does not mean unknowable',
      claim: '"If the busy beaver function is uncomputable, then nobody can ever know any of its values."',
      correction:
        'Every individual BB(n) is a definite finite number, and five of them are known exactly. What is impossible is a single algorithm that returns BB(n) for arbitrary n. The distinction matters because it is the same distinction as in the halting problem: no program decides halting for every input, yet people prove that particular programs halt all the time. Uncomputability is a statement about a uniform procedure, not a ban on knowledge. The second common error is the reverse: treating BB(5) as a curiosity about a big number. The number is the receipt; the achievement is the proof that every other five-state machine either halts sooner or never halts at all.',
    },
    {
      kind: 'prose',
      heading: 'Why a number nobody can compute is useful',
      body: [
        'The busy beaver function is a yardstick for proof strength. If a formal system can prove that a particular machine halts, it can prove a lower bound on BB(n); if it can prove that a machine never halts, it can rule out a candidate. Machines whose behaviour is independent of the system therefore mark the exact edge of what the system can settle. That is a concrete, finite way to exhibit Gödelian incompleteness, without the self-referential sentence that makes the incompleteness theorem so easy to state and so hard to feel.',
        'It is also a benchmark for the tools. The five-state proof is a landmark because it is one of the largest combinatorial proofs ever checked by machine, and because it required human insight to find the deciders that closed the last cases. Radó called the machines busy beavers as a joke about how much work they do before stopping. The joke has aged well: the function is now a standard example of the uncomputable, a competition, and a test case for the question of which mathematical facts a computer can be made to certify.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If BB(6) is a definite number, what would it take to prove its value, and is that a limit of computing power or of mathematics?',
        'Why does the function grow faster than every computable function, when each individual value is produced by a finite computation?',
        'What does it mean for a machine\u2019s halting to be independent of a formal system, and can such a machine be built explicitly?',
        'Is a proof that no case was missed worth more than a proof that the champion runs 47 million steps?',
      ],
    },
  ],
  sources: [
    { label: 'T. Radó, "On non-computable functions", Bell System Technical Journal 41, 877 (1962)', url: 'https://doi.org/10.1002/j.1538-7305.1962.tb00480.x' },
    { label: 'S. Lin and T. Radó, "Computer studies of Turing machine problems", Journal of the ACM 12, 196 (1965)', url: 'https://doi.org/10.1145/321264.321270' },
    { label: 'The bbchallenge Collaboration, "The fifth busy beaver", arXiv:2407.02463 (2024)', url: 'https://arxiv.org/abs/2407.02463' },
    { label: 'S. Aaronson, "Who can name the bigger number?" (1999), on fast-growing functions and the halting problem', url: 'https://www.scottaaronson.com/writings/bignumbers.html' },
  ],
  related: ['turing-halting', 'godel-incompleteness', 'continuum-hypothesis'],
};

export const MATHEMATICS_DOSSIERS = [
  BANACH_TARSKI_DOSSIER,
  GODEL_DOSSIER,
  P_ADIC_DOSSIER,
  MONTY_HALL_DOSSIER,
  CONTINUUM_DOSSIER,
  TURING_DOSSIER,
  MOONSHINE_DOSSIER,
  BUSY_BEAVER_DOSSIER,
];
