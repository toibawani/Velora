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

export const MATHEMATICS_DOSSIERS = [BANACH_TARSKI_DOSSIER, GODEL_DOSSIER];
