/**
 * The dossier glossary.
 *
 * Every difficult term the long-form library uses, defined in one place so the
 * same word cannot mean two things in two essays. The reader auto-links the
 * first few matches in each paragraph to these entries, which is why `brief`
 * has to stand on its own in a popover: it is the whole definition most readers
 * will ever see.
 *
 * `aliases` exist for the forms prose actually uses (plural, hyphenated, the
 * Latin name), not for loose synonyms. A word that needs a different definition
 * in a different context should get its own entry with a qualified term.
 */

const term = (name, field, brief, see = [], aliases = []) => ({ term: name, field, brief, see, aliases });

export const DOSSIER_GLOSSARY = [
  // -- Quantum field theory and the vacuum ---------------------------------
  term('quantum field', 'Physics', 'An operator defined at every point of space and time. Its excitations are what we call particles; the field itself is the more fundamental object.', ['vacuum state', 'mode']),
  term('vacuum state', 'Physics', 'The quantum state with no excitations in a chosen set of modes. Which state that is depends on how spacetime is sliced, which is why accelerated observers disagree about it.', ['mode', 'Rindler horizon']),
  term('mode', 'Physics', 'One independent wave solution of a field equation, like a single pure tone. Choosing a time coordinate chooses a set of modes, and therefore a definition of "particle".', ['quantum field']),
  term('Bogoliubov transformation', 'Physics', 'A change of mode basis that mixes creation and annihilation operators. When it mixes them, the two bases disagree about which state contains no particles.', ['vacuum state', 'mode']),
  term('Rindler horizon', 'Physics', 'The boundary beyond which a uniformly accelerating observer can never receive a signal. It is the flat-spacetime analogue of a black hole horizon.', ['event horizon']),
  term('event horizon', 'Physics', 'The surface around a black hole from which no signal can escape to the outside. It is a causal boundary, not a physical membrane.'),
  term('zero-point energy', 'Physics', 'The lowest energy a quantum mode can have, ħω/2. It cannot be removed from one mode, but the total can change when boundary conditions change.', ['boundary condition']),
  term('boundary condition', 'Physics', 'A constraint a field must satisfy at a surface, such as a conductor forcing the tangential electric field to zero. Changing it changes the allowed modes.', ['mode']),
  term('regularisation', 'Physics', 'A mathematical procedure for handling divergent sums so a finite difference can be extracted. It is a calculation technique, not a claim that the vacuum energy is finite.'),
  term('dielectric', 'Physics', 'A material that polarises in response to an electric field. Real mirrors are dielectrics, and their response to light is what Lifshitz theory uses to compute Casimir forces.'),
  term('van der Waals force', 'Physics', 'A weak attraction between neutral atoms or molecules caused by correlated fluctuations of their electron clouds. The Casimir force between real plates is its macroscopic form.', ['Casimir effect', 'dielectric']),
  term('virtual particle', 'Physics', 'A term from perturbation theory for an internal line in a calculation, not a short-lived object that pops into existence. The language is a bookkeeping device and misleads when taken literally.'),
  term('Casimir effect', 'Physics', 'The attraction between uncharged conducting plates in a vacuum, caused by the change in the electromagnetic mode spectrum under boundary conditions.', ['zero-point energy', 'boundary condition']),
  term('decoherence', 'Physics', 'The loss of quantum interference when a system becomes entangled with its environment. It explains why macroscopic objects look definite without explaining why one outcome occurs.', ['entanglement', 'superposition']),
  term('superposition', 'Physics', 'A quantum state written as a sum of other states. It is not "both at once" in the ordinary sense: the amplitudes can interfere, and a measurement yields one outcome.', ['amplitude', 'measurement']),
  term('entanglement', 'Physics', 'A correlation between two systems that cannot be described by giving each its own separate state. Measuring one constrains the other, without any signal travelling between them.', ['superposition', 'Bell inequality']),
  term('Bell inequality', 'Physics', 'A bound that any local, realist theory must satisfy. Quantum mechanics violates it, and experiments confirm the violation, which rules out local hidden variables.', ['entanglement', 'locality']),
  term('locality', 'Physics', 'The principle that an event is influenced only by what is in its immediate neighbourhood, with no faster-than-light action at a distance.', ['Bell inequality']),
  term('eigenstate', 'Physics', 'A state that a measurement of a given observable leaves unchanged, returning one definite value with certainty.', ['measurement', 'superposition']),
  term('Hamiltonian', 'Physics', 'The operator whose eigenvalues are the possible energies of a system. It generates time evolution, so it is the mathematical object that says how a system changes.', ['operator']),
  term('operator', 'Physics', 'A mathematical rule that acts on a quantum state. Observables are operators; their eigenvalues are the possible measurement results.', ['eigenstate', 'Hamiltonian']),
  term('wavefunction', 'Physics', 'The complex-valued function that encodes a quantum state. Its squared magnitude gives probabilities, and its phase is what allows interference.', ['amplitude', 'superposition']),
  term('amplitude', 'Physics', 'A complex number attached to a possible path or outcome. Amplitudes add; probabilities are the squared magnitude of their sum, which is why interference appears.', ['wavefunction', 'interference']),
  term('interference', 'Physics', 'The addition of waves, producing regions of higher and lower intensity. In quantum mechanics it occurs between amplitudes for indistinguishable alternatives.', ['amplitude', 'superposition']),
  term('measurement', 'Physics', 'An interaction that entangles a system with an apparatus and records an outcome. It need not involve a conscious observer, and it is not simply "looking".', ['projective measurement', 'decoherence']),
  term('projective measurement', 'Physics', 'An idealised measurement that leaves the system in an eigenstate of the measured observable, with probabilities given by the Born rule.', ['eigenstate', 'measurement']),
  term('Rabi oscillation', 'Physics', 'The periodic exchange of population between two quantum states driven at resonance. It is the simplest quantum system in which the Zeno effect is visible.', ['projective measurement']),
  term('anti-Zeno effect', 'Physics', 'The opposite of the Zeno effect: measurement at a particular intermediate rate can speed up a decay instead of inhibiting it.', ['quantum Zeno effect']),
  term('quantum Zeno effect', 'Physics', 'The suppression of a quantum transition by frequent measurement, because each measurement projects the system back toward its initial state.', ['projective measurement', 'Rabi oscillation']),
  term('thermodynamic arrow', 'Physics', 'The direction of time picked out by entropy increasing. The microscopic laws are time-symmetric, so the arrow has to come from a special initial condition.', ['entropy', 'past hypothesis']),
  term('past hypothesis', 'Physics', 'The assumption that the universe began in an extraordinarily low-entropy state. It is what makes entropy increase, and therefore the arrow of time, possible.', ['entropy', 'thermodynamic arrow']),
  term('entropy', 'Physics', 'A measure of how many microscopic arrangements produce the same macroscopic description. Systems evolve toward more of them, which is the second law.', ['second law of thermodynamics']),
  term('second law of thermodynamics', 'Physics', 'The total entropy of a closed system never decreases. It is statistical rather than absolute: the reverse is possible, just astronomically unlikely.'),
  term('Maxwell’s demon', 'Physics', 'A thought experiment in which a tiny being sorts fast and slow molecules, apparently decreasing entropy. It fails once the demon’s memory and erasure are counted.', ['Landauer’s principle', 'entropy']),
  term('Szilard engine', 'Physics', 'A one-molecule engine that converts information about which side of a box the molecule is on into work. It is the cleanest link between information and thermodynamics.', ['Maxwell’s demon', 'bit']),
  term('Landauer’s principle', 'Physics', 'Erasing one bit of information costs at least k_B T ln 2 of energy. Logically reversible operations are not subject to the bound.', ['bit', 'reversible computing']),
  term('bit', 'Information', 'A system with two distinguishable states. It carries one bit of information when the two states are equally likely.'),
  term('reversible computing', 'Information', 'Computation built from one-to-one gates, so no information is destroyed. Such gates can in principle dissipate arbitrarily little energy.', ['Landauer’s principle']),
  term('time-translation symmetry', 'Physics', 'The statement that the laws do not change from moment to moment. By Noether’s theorem it is what makes energy conservation possible.', ['Noether’s theorem']),
  term('Noether’s theorem', 'Physics', 'Every continuous symmetry of the laws corresponds to a conserved quantity. Time symmetry gives energy, space symmetry gives momentum.', ['time-translation symmetry']),
  term('spontaneous symmetry breaking', 'Physics', 'When the equations have a symmetry but the lowest-energy state does not. A ferromagnet picks a direction although the laws do not.', ['phase of matter', 'ground state']),
  term('phase of matter', 'Physics', 'A state of a material with qualitatively different order from another, separated by a transition. Ice, water and a time crystal are phases in this sense.', ['spontaneous symmetry breaking']),
  term('ground state', 'Physics', 'The lowest-energy state of a quantum system. A time crystal cannot be a ground state: the no-go theorems rule that out.', ['phase of matter']),
  term('Floquet system', 'Physics', 'A system driven periodically in time, so its Hamiltonian repeats every T. It exchanges energy with the drive and has no ordinary energy conservation.', ['Hamiltonian', 'subharmonic']),
  term('many-body localisation', 'Physics', 'A quantum phase in which disorder prevents a system from thermalising. It can protect a driven time crystal from heating, at least in an ideal model.', ['phase of matter']),
  term('subharmonic', 'Physics', 'A response whose period is a whole multiple of the drive period. A period-doubled response, 2T, is the signature of a discrete time crystal.', ['Floquet system']),
  term('quasiparticle', 'Physics', 'A collective excitation of a many-body system that behaves like a particle. It is not a fundamental particle, but it can carry momentum, charge or spin.', ['spin ice']),
  term('spin ice', 'Physics', 'A magnetic material whose atomic moments are arranged like protons in water ice. Its excitations behave as magnetic monopole quasiparticles.', ['quasiparticle', 'frustration']),
  term('frustration', 'Physics', 'When competing interactions cannot all be satisfied at once, so the ground state is highly degenerate. It is the reason spin ice has such strange excitations.', ['spin ice', 'ground state']),
  term('magnetic monopole', 'Physics', 'A particle with a single magnetic pole. None has been observed as a fundamental particle; spin ice hosts quasiparticles with the same effective behaviour.', ['quasiparticle', 'spin ice']),
  term('metastability', 'Physics', 'A state that is stable for a long time but not the lowest-energy state. A false vacuum is metastable, and it can decay by tunnelling.', ['false vacuum', 'quantum tunnelling']),
  term('false vacuum', 'Physics', 'A vacuum state that is a local minimum of the energy, not the global one. If it decays, the true vacuum expands at nearly the speed of light.', ['metastability', 'Higgs field']),
  term('Higgs field', 'Physics', 'The field whose nonzero value gives elementary particles their masses. Its potential may have more than one minimum, which is what makes vacuum decay conceivable.', ['false vacuum']),
  term('quantum tunnelling', 'Physics', 'A particle passing through a barrier it classically could not cross, because its wavefunction decays exponentially rather than stopping.', ['wavefunction', 'metastability']),

  // -- Mathematics and logic ------------------------------------------------
  term('axiom of choice', 'Mathematics', 'The statement that from any collection of non-empty sets one can choose an element from each. It is independent of the other standard axioms and has consequences that defy intuition.', ['non-measurable set']),
  term('Lebesgue measure', 'Mathematics', 'The standard way to assign length, area and volume to subsets of space. Some subsets cannot be assigned a consistent measure at all.', ['non-measurable set']),
  term('non-measurable set', 'Mathematics', 'A set to which no consistent volume can be assigned. The pieces in the Banach–Tarski decomposition are of this kind, which is why volume is not conserved.', ['Lebesgue measure', 'axiom of choice']),
  term('free group', 'Mathematics', 'A group in which no combination of generators and inverses is the identity unless it is trivially empty. Rotations of space contain a free group on two generators.', ['group']),
  term('group', 'Mathematics', 'A set with an associative operation, an identity and inverses. Symmetry is described by groups, and group theory is the language of conservation laws.', ['free group', 'Noether’s theorem']),
  term('rigid motion', 'Mathematics', 'A distance-preserving map of space: a rotation, a translation, or both. The Banach–Tarski pieces are moved only by rigid motions.', ['Banach–Tarski paradox']),
  term('equidecomposable', 'Mathematics', 'Two sets are equidecomposable if one can be cut into finitely many pieces and reassembled into the other using rigid motions.', ['Banach–Tarski paradox']),
  term('Banach–Tarski paradox', 'Mathematics', 'A ball can be split into finitely many pieces and reassembled into two balls of the same size. The pieces are non-measurable, so no volume is violated.', ['non-measurable set', 'axiom of choice']),
  term('formal system', 'Logic', 'A language with a fixed alphabet, axioms and mechanical rules of inference. A computer can check every step of a proof in it.', ['consistency', 'completeness']),
  term('consistency', 'Logic', 'The property that no statement and its negation are both provable. An inconsistent system proves everything, so consistency is the minimum requirement.', ['formal system']),
  term('completeness', 'Logic', 'The property that for every sentence, either it or its negation is provable. It is different from the completeness of a logic, which concerns truth in all models.', ['formal system', 'Gödel’s incompleteness theorems']),
  term('recursively axiomatisable', 'Logic', 'The axioms can be listed by a computer program. This rules out the trick of taking every true sentence as an axiom.', ['formal system']),
  term('Gödel numbering', 'Logic', 'A coding that assigns a natural number to every symbol, formula and proof, so arithmetic can talk about its own syntax.', ['Gödel’s incompleteness theorems']),
  term('diagonal lemma', 'Logic', 'A construction that, for any expressible property, builds a sentence asserting that it has that property itself. It is the engine of Gödel’s proof.', ['Gödel numbering']),
  term('Peano arithmetic', 'Logic', 'A standard formal system for the natural numbers, with induction. It is strong enough to encode proofs and therefore incomplete.', ['formal system', 'Gödel’s incompleteness theorems']),
  term('Gödel’s incompleteness theorems', 'Logic', 'Any consistent, recursively axiomatisable system strong enough for arithmetic has a true sentence it cannot prove, and cannot prove its own consistency.', ['Peano arithmetic', 'halting problem']),
  term('independence', 'Logic', 'A statement is independent of a system if neither it nor its negation is provable there. The continuum hypothesis is independent of the standard axioms of set theory.', ['continuum hypothesis', 'forcing']),
  term('halting problem', 'Computation', 'The problem of deciding, for an arbitrary program and input, whether it eventually stops. Turing proved no algorithm can do it in general.', ['Turing machine', 'undecidable']),
  term('decidable', 'Computation', 'A problem is decidable if an algorithm answers it correctly on every input and always stops. Decidability is about existence, not about how long the algorithm takes.', ['undecidable', 'halting problem']),
  term('Rice’s theorem', 'Computation', 'Every non-trivial property of what a program computes is undecidable. It generalises the halting problem to questions like “does this program ever return null”.', ['undecidable', 'halting problem']),
  term('algorithm', 'Computation', 'A finite, unambiguous procedure that takes an input and produces an output. The halting problem is a limit on what any algorithm can decide.', ['Turing machine', 'decidable']),
  term('undecidable', 'Computation', 'A problem for which no algorithm gives a correct yes-or-no answer on every input. Undecidability is a property of problems, not of our current technology.', ['halting problem', 'Turing machine']),
  term('Turing machine', 'Computation', 'An abstract device with a tape, a head and a finite set of rules. It captures what any mechanical procedure can compute.', ['Church–Turing thesis', 'halting problem']),
  term('Church–Turing thesis', 'Computation', 'The claim that any effectively calculable function can be computed by a Turing machine. It is a thesis about the meaning of "computable", not a theorem.', ['Turing machine']),
  term('absolute value', 'Mathematics', 'A function assigning a size to each number, satisfying |x| = 0 only at zero, |xy| = |x||y| and a triangle inequality. The usual and the p-adic absolute values are the only ones on the rationals.', ['p-adic number', 'Ostrowski’s theorem']),
  term('completion', 'Mathematics', 'Filling in the limits of sequences that should converge but have no limit in the original space. Completing the rationals at the usual absolute value gives the reals; at a p-adic one it gives the p-adic numbers.', ['p-adic number', 'absolute value']),
  term('Hensel’s lemma', 'Mathematics', 'A tool for lifting a solution of a polynomial equation modulo p to a solution in the p-adic integers, and then to exact arithmetic under a derivative condition. It is the p-adic analogue of Newton’s method.', ['p-adic number', 'completion'], ["Hensel's lemma"]),
  term('p-adic number', 'Mathematics', 'A number defined by a distance in which high powers of a prime p count as small. The result is an ultrametric world where every triangle is isosceles.', ['ultrametric', 'Ostrowski’s theorem']),
  term('ultrametric', 'Mathematics', 'A distance satisfying a stronger triangle inequality: d(x,z) ≤ max(d(x,y), d(y,z)). In an ultrametric space, every triangle is isosceles and all balls are nested.', ['p-adic number']),
  term('Ostrowski’s theorem', 'Mathematics', 'The theorem that the usual absolute value and the p-adic absolute values are the only essentially different ways to measure size on the rationals.', ['p-adic number']),
  term('cardinality', 'Mathematics', 'A measure of the size of a set, defined by whether its elements can be paired one-to-one with another set. Infinite sets can have different cardinalities.', ['aleph-null', 'continuum hypothesis']),
  term('aleph-null', 'Mathematics', 'The cardinality of the natural numbers, written ℵ₀. It is the smallest infinite cardinal, and the integers and rationals have the same size.', ['cardinality']),
  term('continuum hypothesis', 'Mathematics', 'The claim that there is no set whose size lies strictly between the natural numbers and the real numbers. It is independent of the standard axioms.', ['cardinality', 'forcing']),
  term('forcing', 'Mathematics', 'A technique, invented by Cohen, for building models of set theory by adding new sets. It is how the independence of the continuum hypothesis was proved.', ['continuum hypothesis', 'independence']),
  term('conditional probability', 'Probability', 'The probability of an event given that another event is known to have occurred. It is the foundation of Bayesian reasoning.', ['Bayes’ theorem', 'prior']),
  term('Bayes’ theorem', 'Probability', 'A rule for updating a probability when new evidence arrives: the posterior is proportional to the likelihood times the prior.', ['prior', 'posterior', 'conditional probability']),
  term('likelihood', 'Probability', 'The probability of the observed evidence under a particular hypothesis. In Bayes’ theorem it multiplies the prior, and it is what makes the same evidence count differently under different models.', ['Bayes’ theorem', 'prior']),
  term('prior', 'Probability', 'The probability assigned to a hypothesis before seeing the current evidence. A Bayesian analysis has to state it, which is a feature rather than a flaw.', ['Bayes’ theorem']),
  term('posterior', 'Probability', 'The updated probability of a hypothesis after the evidence has been taken into account.', ['Bayes’ theorem', 'prior']),
  term('Monty Hall problem', 'Probability', 'A three-door puzzle in which switching doors doubles the chance of winning. The answer is surprising only if the host’s behaviour is left out of the model.', ['conditional probability', 'Bayes’ theorem']),

  // -- Life, mind and complex systems --------------------------------------
  term('cell', 'Biology', 'The smallest unit that can carry out the functions of life. Bacteria and archaea are single cells; animals and plants are built from many, with a division of labour.', ['organism']),
  term('organism', 'Biology', 'An individual living system that maintains itself, takes in energy and reproduces. The boundary is less sharp than the word suggests: a lichen or a colonial alga blurs it.', ['cell', 'symbiosis']),
  term('evolution', 'Biology', 'Change in the heritable traits of a population across generations, driven by mutation, drift, migration and selection. It is a population process, not something an individual does.', ['horizontal gene transfer', 'phylogeny']),
  term('plasmodium', 'Biology', 'The multinucleate feeding stage of a slime mould: one continuous cell with many nuclei, creeping through a network of tubes.', ['mycelium']),
  term('mycelium', 'Biology', 'The branching network of fungal filaments that makes up the body of a fungus. It is the physical substrate of a mycorrhizal network.', ['hypha', 'mycorrhiza']),
  term('hypha', 'Biology', 'A single fungal filament. Hyphae branch and fuse to form a mycelium, and they are what actually penetrate soil and root tissue.', ['mycelium']),
  term('mycorrhiza', 'Biology', 'A symbiosis between a fungus and a plant root. The fungus supplies mineral nutrients and water; the plant supplies sugar.', ['mycelium', 'symbiosis']),
  term('symbiosis', 'Biology', 'A long-term living arrangement between organisms of different species. It may be mutualistic, commensal or parasitic, and the same relationship can shift between those.', ['mycorrhiza']),
  term('chemotaxis', 'Biology', 'Directed movement toward or away from a chemical. Slime moulds follow nutrient gradients and avoid repellents by this means.'),
  term('habituation', 'Biology', 'A decrease in response to a repeated stimulus that is not harmful. It is a simple form of learning and has been demonstrated in single cells.', ['chemotaxis']),
  term('horizontal gene transfer', 'Biology', 'The movement of genetic material between organisms other than by inheritance from parent to offspring. It is common in bacteria and complicates the idea of a tree of life.', ['plasmid', 'phylogeny']),
  term('plasmid', 'Biology', 'A small circle of DNA separate from the main chromosome, often carrying genes for antibiotic resistance or other transferable traits.', ['horizontal gene transfer', 'conjugation']),
  term('conjugation', 'Biology', 'The direct transfer of DNA from one bacterium to another through a physical connection. It is one of the main routes of horizontal gene transfer.', ['horizontal gene transfer', 'plasmid']),
  term('endosymbiosis', 'Biology', 'The incorporation of one organism inside another, as when mitochondria and chloroplasts became permanent parts of eukaryotic cells.', ['symbiosis', 'horizontal gene transfer']),
  term('phylogeny', 'Biology', 'The branching history of a lineage. Gene trees and species trees can disagree, which is one reason horizontal transfer matters.', ['horizontal gene transfer']),
  term('prediction error', 'Neuroscience', 'The difference between what a brain expected and what it received. Predictive processing treats the minimisation of this difference as a central organising principle.', ['generative model', 'predictive processing']),
  term('generative model', 'Neuroscience', 'An internal model that produces expectations about sensory input. In predictive processing the brain is treated as one.', ['prediction error', 'predictive processing']),
  term('predictive processing', 'Neuroscience', 'The theory that the brain constantly predicts its input and updates its model from the errors. Perception is then controlled hallucination constrained by the senses.', ['prediction error', 'precision weighting']),
  term('precision weighting', 'Neuroscience', 'The estimated reliability assigned to a prediction or a sensory signal. In predictive processing it decides which signal is allowed to change the model.', ['predictive processing', 'prediction error']),
  term('active inference', 'Neuroscience', 'The proposal that action is the brain changing the world to match its predictions, rather than only changing predictions to match the world.', ['predictive processing']),
  term('magnetoreception', 'Biology', 'The ability of some animals to detect the Earth’s magnetic field. The mechanism is still debated, and a radical-pair process in the eye is a leading candidate.', ['radical pair']),
  term('radical pair', 'Physics', 'Two molecules with unpaired electrons whose quantum spin state can be influenced by a weak magnetic field. It is the leading proposed mechanism for bird magnetoreception.', ['magnetoreception', 'entanglement']),
  term('bounce solution', 'Physics', 'The field configuration that dominates the tunnelling calculation: a Euclidean solution that interpolates between the false and true vacua and sets the exponential suppression.', ['false vacuum', 'vacuum decay'], ['bounce']),
  term('vacuum decay', 'Physics', 'The tunnelling of a metastable vacuum into a lower-energy one. A bubble of true vacuum forms and expands at nearly the speed of light, replacing the laws inside it.', ['false vacuum', 'quantum tunnelling']),
  term('eternal inflation', 'Physics', 'A regime in which space keeps inflating forever in some regions while inflation ends in others. It turns the cosmos into a continually branching set of bubble universes.', ['false vacuum', 'vacuum decay']),
  term('recurrence', 'Physics', 'Poincaré’s theorem that a bounded, isolated system eventually returns arbitrarily close to its starting state. The wait is astronomical, but the theorem forbids permanent irreversibility in a finite system.', ['entropy', 'second law of thermodynamics']),
  term('time-symmetric', 'Physics', 'A law is time-symmetric if replacing t with −t produces another valid solution. Almost every fundamental law has this property, which is why the arrow of time cannot come from the laws alone.', ['thermodynamic arrow']),
  // -- Chemistry ---------------------------------------------------------
  term('oscillating reaction', 'Chemistry', 'A reaction whose intermediate concentrations rise and fall periodically instead of settling. It needs an open system or a continuous feed of reactants.', ['far from equilibrium', 'autocatalysis']),
  term('autocatalysis', 'Chemistry', 'A reaction in which a product catalyses its own formation. Positive feedback of this kind is what lets a chemical system switch between states instead of drifting to equilibrium.', ['catalyst', 'oscillating reaction']),
  term('far from equilibrium', 'Chemistry', 'A state maintained away from the composition it would have at equilibrium, by a flow of matter or energy. Patterns and oscillations require it.', ['dissipative structure', 'entropy']),
  term('dissipative structure', 'Chemistry', 'An ordered pattern maintained by continuous energy flow, such as a flame or a spiral wave. It disappears when the flow stops.', ['far from equilibrium']),
  term('redox couple', 'Chemistry', 'A pair of species related by electron transfer, such as Ce⁴⁺ and Ce³⁺. The BZ reaction switches between them.', ['catalyst']),
  term('catalyst', 'Chemistry', 'A substance that speeds a reaction without being consumed, by lowering the activation energy. It changes the rate, not the equilibrium position.', ['activation energy', 'equilibrium constant']),
  term('activation energy', 'Chemistry', 'The energy barrier a reaction must overcome to proceed. Catalysts lower it; they do not change the overall energy released.', ['catalyst']),
  term('equilibrium constant', 'Chemistry', 'The ratio of product to reactant activities at equilibrium. It depends on temperature and determines how far a reaction proceeds.', ['Le Chatelier’s principle']),
  term('Le Chatelier’s principle', 'Chemistry', 'A system at equilibrium shifts to oppose a change in conditions. Raising pressure favours the side with fewer gas molecules.', ['equilibrium constant'], ["Le Chatelier's principle"]),
  term('nitrogen fixation', 'Chemistry', 'The conversion of atmospheric N₂ into usable compounds such as ammonia. It is the rate-limiting step of the natural nitrogen cycle.', ['nitrogenase', 'Haber–Bosch process']),
  term('Haber–Bosch process', 'Chemistry', 'The industrial synthesis of ammonia from nitrogen and hydrogen over an iron catalyst at high temperature and pressure. It supplies the nitrogen in roughly half the world’s food.', ['nitrogen fixation', 'catalyst'], ['Haber-Bosch process', 'Haber–Bosch']),
  term('nitrogenase', 'Biology', 'The enzyme that fixes nitrogen in bacteria. It breaks the N₂ triple bond at ambient temperature but spends about 16 ATP per molecule.', ['nitrogen fixation']),
  term('catalyst poisoning', 'Chemistry', 'The loss of a catalyst’s activity when impurities bind strongly to its active sites. Feed gas is purified to prevent it.', ['catalyst']),
  term('chirality', 'Chemistry', 'The property of an object that cannot be superimposed on its mirror image. A hand, a screw thread and many molecules are chiral.', ['enantiomer']),
  term('enantiomer', 'Chemistry', 'One of a pair of molecules that are mirror images and not superimposable. They have identical connectivity and differ only in spatial arrangement.', ['chirality', 'racemate']),
  term('racemate', 'Chemistry', 'A mixture with equal amounts of both enantiomers. It is optically inactive because the rotations cancel.', ['enantiomer', 'optical activity']),
  term('stereocentre', 'Chemistry', 'An atom bonded to four different groups so that exchanging two produces a different stereoisomer. It is the commonest source of chirality.', ['chirality', 'enantiomer']),
  term('optical activity', 'Chemistry', 'The rotation of the plane of polarised light by a chiral substance. It is the classical way to detect chirality and measure enantiomeric excess.', ['specific rotation', 'racemate']),
  term('specific rotation', 'Chemistry', 'Optical rotation normalised for path length and concentration. A pure enantiomer has a characteristic value; a racemate has zero.', ['optical activity']),
  term('homochirality', 'Chemistry', 'The use of a single handedness throughout a biochemical system, as in L-amino acids and D-sugars. Its origin is unresolved.', ['chirality', 'enantiomer']),
  term('Gibbs free energy', 'Chemistry', 'The thermodynamic potential that decreases in a spontaneous process at constant temperature and pressure. Equilibrium is its minimum.', ['entropy', 'equilibrium constant']),

  // -- Cosmology ---------------------------------------------------------
  term('Hubble constant', 'Cosmology', 'The present rate of cosmic expansion, in kilometres per second per megaparsec. It is not constant in time; H₀ is its value now.', ['redshift', 'standard candle']),
  term('standard candle', 'Cosmology', 'An object of known intrinsic brightness, whose observed brightness therefore gives its distance. Type Ia supernovae are the classic example.', ['distance ladder']),
  term('distance ladder', 'Cosmology', 'A chain of overlapping distance measurements, each calibrated by the rung below: parallax, Cepheids, then supernovae.', ['standard candle', 'Hubble constant']),
  term('cosmic microwave background', 'Cosmology', 'Relic radiation from when the universe became transparent, about 380,000 years after the Big Bang. Its pattern encodes the early expansion history.', ['baryon acoustic oscillations'], ['CMB']),
  term('baryon acoustic oscillations', 'Cosmology', 'A preferred distance scale imprinted on galaxy clustering by sound waves in the early universe. It works as a cosmic ruler independent of stellar distance indicators.', ['cosmic microwave background'], ['BAO']),
  term('redshift', 'Cosmology', 'The stretching of light to longer wavelengths by cosmic expansion or by motion. It is how recession velocity is inferred.', ['Hubble constant']),
  term('rotation curve', 'Cosmology', 'A plot of orbital speed against radius for a galaxy. Its shape measures the enclosed mass.', ['dark matter']),
  term('gravitational lensing', 'Cosmology', 'The bending of light by mass. It measures total mass along the line of sight, whether or not it emits light.', ['dark matter']),
  term('dark matter', 'Cosmology', 'A component that gravitates but does not appreciably interact with light. It is inferred from rotation curves, lensing and the microwave background.', ['rotation curve', 'gravitational lensing']),
  term('MOND', 'Cosmology', 'Modified Newtonian Dynamics: below a small acceleration threshold, gravity is stronger than Newton predicts. It fits many galaxy rotation curves without dark matter.', ['rotation curve', 'dark matter'], ['modified Newtonian dynamics']),
  term('dark energy', 'Cosmology', 'The unknown component driving accelerated expansion. It is inferred from the expansion history and is about 68 per cent of the energy budget.', ['cosmological constant']),
  term('cosmological constant', 'Cosmology', 'A constant energy density of space itself, written Λ. It is the simplest model of dark energy.', ['dark energy', 'vacuum energy']),
  term('equation of state', 'Cosmology', 'The relation between pressure and energy density, written w = p/ρ. A cosmological constant has w = −1.', ['dark energy', 'quintessence']),
  term('fine-tuning', 'Cosmology', 'A situation in which a parameter must take an improbably precise value for the observed outcome. The vacuum energy is the standard example.', ['cosmological constant']),
  term('quintessence', 'Cosmology', 'A dynamical dark energy model in which a scalar field evolves, so the equation of state changes with cosmic time.', ['dark energy', 'equation of state']),
  term('peculiar velocity', 'Cosmology', 'A galaxy’s motion relative to the expanding cosmic frame, caused by local gravity. It contaminates a pure Hubble-law measurement.', ['Hubble constant']),
  term('vacuum energy', 'Cosmology', 'The energy density of empty space in quantum field theory. Its predicted value is enormously larger than the observed dark energy density.', ['cosmological constant', 'zero-point energy']),

  // -- History -----------------------------------------------------------
  term('epicyclic gearing', 'History', 'A gear system in which one gear turns around another. It can add or subtract rotations and produced the moon’s variable speed in the Antikythera mechanism.', ['gear train'], ['epicyclic train', 'epicyclic']),
  term('gear train', 'History', 'A connected sequence of gears that transmits and transforms motion. The Antikythera mechanism contains at least thirty.', ['epicyclic gearing']),
  term('Metonic cycle', 'History', 'A period of 19 years after which lunar phases recur on the same calendar dates. It reconciles lunar months with the solar year.', ['Saros cycle']),
  term('Saros cycle', 'History', 'A period of 223 lunar months after which eclipses repeat in a similar pattern. It was the basis of ancient eclipse prediction.', ['Metonic cycle']),
  term('provenance', 'History', 'The recorded history of an object’s discovery and ownership. It determines whether an object can be dated and interpreted with confidence.', ['primary source']),
  term('primary source', 'History', 'A document or object produced at the time being studied, as opposed to a later account. It is evidence, not automatically a true report.', ['provenance', 'historiography']),
  term('historiography', 'History', 'The study of how history is written: which sources are used, which questions are asked, and how interpretations change.', ['primary source']),
  term('computed tomography', 'History', 'Imaging that reconstructs cross-sections from X-ray measurements. It let researchers read the Antikythera inscriptions without dismantling the object.', ['provenance']),
  term('astrolabe', 'History', 'An instrument for modelling the positions of the sun and stars, used for navigation and timekeeping. It is the closest later relative of the Antikythera device.', ['epicyclic gearing']),
  term('volcanic winter', 'History', 'Cooling caused by volcanic sulfate aerosols reflecting sunlight in the stratosphere. It can last years after a large eruption.', ['sulfate aerosol']),
  term('sulfate aerosol', 'History', 'Fine droplets of sulfuric acid formed from volcanic sulfur dioxide. They scatter sunlight and are the main cooling mechanism of large eruptions.', ['volcanic winter', 'ice core']),
  term('dendrochronology', 'History', 'Dating and climate reconstruction from tree rings. A cold or dry year produces a narrow ring, and overlapping sequences can be dated to the year.', ['ice core']),
  term('ice core', 'History', 'A cylinder drilled from an ice sheet, preserving annual layers of snow, dust and volcanic sulfate. It gives dated records of past eruptions.', ['dendrochronology']),
  term('Justinianic plague', 'History', 'The pandemic caused by Yersinia pestis that reached the Mediterranean in 541–542. Its death toll is disputed.', ['historiography']),
  term('Late Antique Little Ice Age', 'History', 'A cooler period from about 536 to 660, associated with a cluster of volcanic eruptions. The term was introduced by Büntgen and colleagues in 2016.', ['volcanic winter']),
  term('papyrus', 'History', 'A writing material made from pressed reed stems, used for scrolls. It is fragile and has to be recopied as it deteriorates.', ['scroll', 'codex']),
  term('codex', 'History', 'A book made of folded leaves, the format that replaced the scroll in late antiquity. It was more durable and easier to consult.', ['papyrus', 'scroll']),
  term('scroll', 'History', 'A roll of papyrus or parchment holding a text. A scroll usually carries one work, which is why ancient libraries needed so many of them.', ['papyrus', 'codex']),
  term('Mouseion', 'History', 'The research institution at Alexandria of which the library was part. The word means “place of the Muses” and is the origin of “museum”.', ['Serapeum']),
  term('Serapeum', 'History', 'A temple of Serapis in Alexandria, destroyed in 391 CE. A library was associated with it, but its link to the main library is uncertain.', ['Mouseion']),
  term('philology', 'History', 'The scholarly study of texts: establishing what they say and how they were transmitted. Alexandrian scholars did it systematically.', ['papyrus', 'codex']),

  // -- Philosophy --------------------------------------------------------
  term('personal identity', 'Philosophy', 'The relation that makes a person at one time the same person at another. It grounds responsibility, promises and self-interest.', ['psychological continuity']),
  term('psychological continuity', 'Philosophy', 'Overlapping chains of memory, intention and character connecting a later person to an earlier one. It is the main rival to bodily continuity.', ['personal identity', 'fission']),
  term('reductionism about persons', 'Philosophy', 'The view that a person’s persistence is nothing over and above psychological and physical relations; there is no further fact of identity.', ['personal identity', 'psychological continuity']),
  term('fission', 'Philosophy', 'A thought experiment in which one person divides into two psychological successors. It is the hardest case for identity-based accounts of survival.', ['personal identity', 'thought experiment']),
  term('thought experiment', 'Philosophy', 'A hypothetical case used to isolate a variable and test a principle. It is an argument tool, not evidence about the actual world.', ['fission']),
  term('animalism', 'Philosophy', 'The view that we are biological organisms, so personal identity is the continuity of the living body rather than of psychology.', ['personal identity']),
  term('epistemic injustice', 'Philosophy', 'A wrong done to someone in their capacity as a knower or communicator, such as being disbelieved or lacking the concepts to articulate an experience.', ['testimonial injustice', 'hermeneutical injustice']),
  term('testimonial injustice', 'Philosophy', 'A credibility deficit imposed on a speaker because of an identity prejudice. Their word is given less weight than it deserves.', ['credibility deficit', 'epistemic injustice']),
  term('hermeneutical injustice', 'Philosophy', 'A gap in shared concepts that makes it hard for someone to understand or express their own experience.', ['epistemic injustice']),
  term('credibility deficit', 'Philosophy', 'The gap between the credibility a speaker should receive and the credibility they actually receive. It is the mechanism of testimonial injustice.', ['testimonial injustice']),
  term('standpoint theory', 'Philosophy', 'The view that marginalised positions can afford epistemic advantages, because exclusion can reveal structures the privileged miss.', ['epistemic injustice']),
  term('epistemic paternalism', 'Philosophy', 'Overriding someone’s own epistemic judgment for their supposed benefit. It is a risk of heavy-handed remedies for credibility bias.', ['epistemic injustice']),
  term('is–ought gap', 'Philosophy', 'The logical gap between descriptive premises and evaluative conclusions. It is attributed to Hume, whose own statement is more cautious than the slogan.', ['naturalistic fallacy'], ['is-ought gap']),
  term('naturalistic fallacy', 'Philosophy', 'Moore’s term for defining goodness in terms of a natural property such as pleasure. It is related to, but not the same as, the is–ought gap.', ['is–ought gap', 'moral realism']),
  term('moral realism', 'Philosophy', 'The view that there are moral facts independent of what anyone believes or desires. It owes an account of what they are and how we know them.', ['moral constructivism']),
  term('expressivism', 'Philosophy', 'The view that moral statements express attitudes or commitments rather than describe facts.', ['moral realism']),
  term('thick concept', 'Philosophy', 'A concept that is both descriptive and evaluative, such as “cowardly”. Thick concepts complicate the is–ought distinction by seeming to cross it.', ['is–ought gap']),
  term('error theory', 'Philosophy', 'The view that moral claims are systematically false because there are no moral facts, even though moral discourse is useful.', ['moral realism']),
  term('moral constructivism', 'Philosophy', 'The view that moral facts are constructed by a procedure of practical reason rather than discovered in the world.', ['moral realism']),

  term('information', 'Information', 'In Shannon’s sense, a measure of how much a message reduces uncertainty, not of meaning. One bit is the information gained by resolving a fair coin flip.', ['bit', 'entropy']),
  term('erasure', 'Information', 'An operation that resets a memory to a standard state, destroying the information it held. It is the operation Landauer’s principle prices.', ['Landauer’s principle', 'bit']),
  term('qubit', 'Information', 'A two-state quantum system used as a unit of quantum information. Unlike a bit, it can be in a superposition, and its state cannot be copied arbitrarily.', ['superposition', 'bit']),
];

/**
 * ASCII spellings of terms written with a typographic apostrophe. Prose is
 * inconsistent about the two, sometimes within one paragraph, and a reader who
 * taps "Landauer's principle" should not get nothing because the entry happens
 * to use ’.
 */
const ASCII_ALIASES = {
  "Maxwell's demon": 'Maxwell’s demon',
  "Landauer's principle": 'Landauer’s principle',
  "Noether's theorem": 'Noether’s theorem',
  "Ostrowski's theorem": 'Ostrowski’s theorem',
  "Godel's incompleteness theorems": 'Gödel’s incompleteness theorems',
  "Banach-Tarski paradox": 'Banach–Tarski paradox',
  'Bayes theorem': 'Bayes’ theorem',
};

Object.entries(ASCII_ALIASES).forEach(([form, name]) => {
  const entry = DOSSIER_GLOSSARY.find((candidate) => candidate.term === name);
  if (entry && !entry.aliases.includes(form)) entry.aliases.push(form);
});

const ALIAS_MAP = new Map();

DOSSIER_GLOSSARY.forEach((entry) => {
  [entry.term, ...entry.aliases].forEach((form) => {
    const key = form.toLowerCase();
    if (!ALIAS_MAP.has(key)) ALIAS_MAP.set(key, entry);
  });
});

/** Every surface form the auto-linker may match, longest first. */
export const GLOSSARY_FORMS = [...ALIAS_MAP.keys()].sort((a, b) => b.length - a.length);

/**
 * Resolves a word as written in prose, including a plural. Prose says "p-adic
 * numbers" and "modes", not the dictionary headword, and a matcher that only
 * knows the singular leaves the most natural sentence unlinked.
 */
export const lookupDossierTerm = (word) => {
  const key = String(word || '').toLowerCase();
  if (ALIAS_MAP.has(key)) return ALIAS_MAP.get(key);
  if (key.endsWith('es') && ALIAS_MAP.has(key.slice(0, -2))) return ALIAS_MAP.get(key.slice(0, -2));
  if (key.endsWith('s') && ALIAS_MAP.has(key.slice(0, -1))) return ALIAS_MAP.get(key.slice(0, -1));
  return null;
};

/**
 * One pattern for every surface form, longest first, with an optional plural.
 * Exported so the reader and the coverage test match the same words: a test
 * with its own looser matcher would pass while the page linked nothing.
 */
export const buildGlossaryPattern = () => {
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b(${GLOSSARY_FORMS.map(escape).join('|')})(?:e?s)?\\b`, 'gi');
};

export const GLOSSARY_COUNT = DOSSIER_GLOSSARY.length;

/**
 * Words that mean different things in different fields. "Measurement" in a
 * history essay is not projective measurement in quantum mechanics, and "group"
 * in a sentence about people is not a mathematical group. These entries only
 * link inside the field that owns the technical sense; elsewhere they stay
 * ordinary prose.
 */
const FIELD_ONLY = {
  measurement: ['Physics'],
  group: ['Mathematics'],
  evolution: ['Biology'],
  cell: ['Biology'],
  organism: ['Biology'],
};

/** True when an entry's technical sense belongs to the dossier's field. */
export const termAllowedInField = (entry, field) => {
  const fields = FIELD_ONLY[entry.term];
  if (!fields || !field) return true;
  return fields.includes(field);
};
