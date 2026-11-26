/**
 * Physics dossiers.
 *
 * These are not topic cards. Each one is a written argument with a history, a
 * mechanism, the mathematics that carries the claim, the evidence that exists,
 * and the parts that remain unsettled. The reader renders section kinds, so the
 * shape here is the shape on the page.
 *
 * Editorial rule for this file: every number is either exact, or explicitly
 * labelled as an estimate. Every experimental claim names the experiment. Every
 * speculative claim is described as speculation in the sentence that makes it.
 */

export const UNRUH_DOSSIER = {
  id: 'unruh-effect',
  title: 'The Unruh Effect',
  standfirst:
    'An accelerating thermometer in empty space should read a temperature. The prediction is fifty years old, the temperature for everyday acceleration is around 10⁻²⁰ kelvin, and the reason it matters is that it makes the vacuum itself observer-dependent.',
  field: 'Physics',
  lenses: ['Reality', 'Time'],
  status: 'Theoretical prediction, not directly observed',
  difficulty: 'Advanced',
  minutes: 24,
  opening:
    'Take a perfect vacuum, remove every atom, every photon, every stray field. Now accelerate through it. Quantum field theory says the vacuum will no longer look empty to you: a detector carried along your path will click as though it were sitting in a warm bath. Nothing was added to the universe. What changed is which slice of the field you are entitled to call "the state with no particles".',
  sections: [
    {
      kind: 'prose',
      heading: 'The vacuum is a bookkeeping decision',
      body: [
        'In quantum field theory a field is not a collection of particles. It is an operator at every point of space and time, and particles are what you get when you expand that operator in a particular set of modes — the standing waves of a chosen coordinate system. The vacuum state is then defined as the state annihilated by every mode\'s lowering operator. That definition sounds absolute. It is not, because "every mode" depends on how you slice spacetime into space and time.',
        'For an observer moving at constant velocity in flat spacetime, the natural modes are plane waves, and the resulting vacuum is the Minkowski vacuum. For an observer with constant acceleration, the natural coordinates are Rindler coordinates, and the natural modes are different functions of the same field. The two sets of modes are related by a Bogoliubov transformation: a linear change of basis that mixes creation and annihilation operators. Mixing them means the state with no Rindler particles is a superposition of states with different numbers of Minkowski particles. The count is not invariant. It was never going to be, because the count was defined relative to a choice of modes.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The five ideas you need before the equation',
      items: [
        {
          term: 'Quantum field',
          definition:
            'An operator-valued function of spacetime. Every point can create or destroy an excitation; the excitations we call particles are its normal modes.',
        },
        {
          term: 'Mode',
          definition:
            'A solution of the field equation with a definite frequency in a chosen time coordinate, like a single pure tone in a sound wave. Choosing a time coordinate chooses a set of modes.',
        },
        {
          term: 'Bogoliubov transformation',
          definition:
            'A change of mode basis that can mix creation and annihilation operators. If it does, the two bases disagree about which state contains no particles.',
        },
        {
          term: 'Rindler horizon',
          definition:
            'The boundary beyond which a uniformly accelerating observer can never receive a signal. Light from behind it can never catch up, exactly as nothing can escape a black hole horizon.',
        },
        {
          term: 'Unruh–DeWitt detector',
          definition:
            'An idealised two-level system coupled to the field along a worldline. Its excitation probability is the operational definition of "what the observer sees".',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'Why acceleration creates a horizon indoors',
      body: [
        'A uniformly accelerating observer does not move in a straight line through spacetime; they follow a hyperbola. The hyperbola has an asymptote. Signals emitted from far enough behind the observer can never reach them, because the observer keeps accelerating away from the light. That asymptote is the Rindler horizon, and its existence is the whole reason the effect appears.',
        'A horizon is what turns a global vacuum into a local thermal state. The observer can only access part of the field — the part inside their causal patch. Tracing out the inaccessible region leaves a mixed state, and a mixed state with the right spectrum is exactly what a thermal bath looks like. In this sense the Unruh effect is not a force or a substance. It is what ignorance of a horizon does to a quantum state. The same logic, applied to the event horizon of a black hole, produces Hawking radiation.',
      ],
    },
    {
      kind: 'math',
      heading: 'The temperature, and what each symbol is doing',
      equation: 'T_U = ħ a / (2π c k_B)',
      symbols: [
        { symbol: 'T_U', meaning: 'Unruh temperature measured by the accelerating detector', unit: 'kelvin' },
        { symbol: 'ħ', meaning: 'Reduced Planck constant, 1.055 × 10⁻³⁴', unit: 'J·s' },
        { symbol: 'a', meaning: 'Proper acceleration along the worldline', unit: 'm/s²' },
        { symbol: 'c', meaning: 'Speed of light, 2.998 × 10⁸', unit: 'm/s' },
        { symbol: 'k_B', meaning: 'Boltzmann constant, 1.381 × 10⁻²³', unit: 'J/K' },
      ],
      body: [
        'The formula contains no property of the detector and no property of the field. It depends only on the acceleration and three constants of nature. That is why it is a statement about the vacuum rather than about a particular experiment: any sufficiently simple detector with the same acceleration should read the same temperature.',
        'The dimensions check out. ħ has units of joule-seconds, acceleration is metres per second squared, and ħ·a has units of energy per second per metre — a force times a velocity, or a power. Dividing by c converts the acceleration to a gradient, and dividing by k_B converts energy to temperature. The 2π is the geometric factor that comes from the periodicity of the field modes in imaginary time, and it is the same 2π that appears in Hawking\'s temperature.',
        'Put in numbers, a detector accelerating at 9.81 m/s² reads 3.97 × 10⁻²⁰ K. That is about ten orders of magnitude below the cosmic microwave background, which is 2.7 K. To reach 1 K you would need an acceleration of roughly 2.5 × 10²⁰ m/s², about 10¹⁹ g. The effect is not small because the physics is doubtful; it is small because the conversion factor ħ/c is tiny.',
      ],
      assumptions: [
        'Flat spacetime. In curved spacetime the statement becomes local and the temperature depends on the observer\'s proper acceleration at the detector.',
        'Eternal uniform acceleration. A finite pulse of acceleration produces a transient spectrum that is only approximately thermal.',
        'An ideal detector with no internal structure and a coupling that remains valid at arbitrarily high energies.',
        'Quantum field theory at energies far below the Planck scale. The derivation says nothing about quantum gravity.',
      ],
    },
    {
      kind: 'steps',
      heading: 'How the detector actually clicks',
      items: [
        {
          title: 'Couple a two-level system to the field',
          text: 'The detector has a ground state and an excited state separated by energy E. It moves along the accelerating worldline and interacts with the field through a monopole coupling.',
        },
        {
          title: 'Compute the transition rate',
          text: 'First-order perturbation theory gives the excitation rate as an integral of the field\'s two-point function along the worldline, weighted by e^{iEt/ħ}.',
        },
        {
          title: 'Evaluate on the hyperbolic path',
          text: 'On a uniformly accelerated path the two-point function is periodic in imaginary proper time, with period 2πc/a. That periodicity is the geometric origin of the temperature.',
        },
        {
          title: 'Read off a Planck factor',
          text: 'The resulting integral produces the detailed-balance ratio P(excite)/P(de-excite) = e^{−E/k_BT_U}. A ratio of that form is the definition of a thermal state at temperature T_U.',
        },
        {
          title: 'Note what was not assumed',
          text: 'At no point did anything "create" a particle in the global state. The detector responded to the correlations the field already had across the horizon.',
        },
      ],
    },
    {
      kind: 'table',
      heading: 'What has actually been tested',
      columns: ['Year', 'Work', 'What it established'],
      rows: [
        ['1973', 'Fulling, on quantisation in Rindler coordinates', 'The two coordinate systems do not agree on the particle content of the same field state.'],
        ['1975', 'Davies, on the thermal spectrum of accelerating detectors', 'Derived the temperature formula for a uniformly accelerating observer.'],
        ['1976', 'Unruh, on notes on black-hole evaporation', 'Gave the operational detector argument and connected it to Hawking radiation.'],
        ['1981', 'Unruh and Wald', 'Put the derivation on a more rigorous footing and clarified the role of the horizon.'],
        ['1990s–2010s', 'Analogue-gravity experiments in fluids and Bose–Einstein condensates', 'Measured thermal phonon spectra at analogue horizons. These test the kinematic mechanism, not the Unruh effect itself in vacuum.'],
        ['2019', 'Steinhauer, analogue black hole in a BEC', 'Reported a thermal spectrum with the predicted temperature in an analogue system. The interpretation is still debated in the literature.'],
      ],
      note:
        'No experiment has measured Unruh radiation from an accelerating detector in vacuum. The accelerations required are astronomical, and a detector would also see the ordinary vacuum fluctuations and the acceleration\'s own electromagnetic radiation. Analogue systems reproduce the mathematics with sound waves, which is strong evidence that the mathematics is right and no evidence at all that the vacuum behaves this way at low acceleration.',
    },
    {
      kind: 'misconception',
      heading: 'Three things the Unruh effect is not',
      claim: '"Acceleration creates particles out of empty space, so you can extract unlimited energy from the vacuum."',
      correction:
        'The global state is unchanged and still has zero particles in the Minkowski sense. The accelerated observer re-describes the same state in a different basis. Crucially, an accelerating observer cannot use the radiation to run a perpetual-motion machine: the same horizon that makes the bath thermal prevents them from extracting net work from it, and switching off the acceleration changes the description back. The effect is a change of state relative to an observer, not a creation ex nihilo that can be mined.',
    },
    {
      kind: 'misconception',
      heading: 'A second common error',
      claim: '"The Unruh effect and Hawking radiation are the same thing."',
      correction:
        'They share a mechanism — a horizon plus a change of mode basis — and the temperatures have the same 2π structure. But Hawking radiation is emitted to infinity from a curved spacetime with a real, dynamical horizon, while the Unruh effect is a flat-spacetime statement about an accelerating detector. The equivalence principle connects them locally; it does not make them identical.',
    },
    {
      kind: 'prose',
      heading: 'Why physicists take a 10⁻²⁰ kelvin prediction seriously',
      body: [
        'The first reason is that the derivation does not introduce anything new. It uses ordinary quantum field theory, ordinary coordinate changes, and the definition of a thermal state. If the framework is right, the effect is not optional.',
        'The second is that it explains the thermodynamic character of black holes without bolting thermodynamics on by hand. Bekenstein argued in 1973 that a black hole must have an entropy proportional to its horizon area, or the second law would be violated when hot gas falls in. Hawking\'s 1974 calculation produced the temperature that makes that entropy consistent. The Unruh effect is the flat-spacetime rehearsal for that calculation, and the reason the analogy is more than an analogy.',
        'The third is that the effect sits at the intersection of three things physicists do not fully understand: the ontology of the quantum vacuum, the meaning of observers in quantum theory, and the relationship between entanglement and geometry. The ER=EPR conjecture, the firewall debate, and attempts to derive spacetime from entanglement all use the same machinery. A phenomenon that is 10⁻²⁰ K in the laboratory can still be central to theory.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If particle number depends on the observer\'s motion, in what sense does the field contain particles at all?',
        'Does the Unruh effect give an operational meaning to the equivalence principle, or does it expose a tension in it?',
        'If the vacuum is entangled across a horizon, is the thermal character of the radiation a statement about physics or about information?',
        'Would a detector with internal structure see the same temperature, or would the effect depend on how the detector is built?',
      ],
    },
  ],
  sources: [
    { label: 'W. G. Unruh, "Notes on black-hole evaporation", Physical Review D 14, 870 (1976)', url: 'https://doi.org/10.1103/PhysRevD.14.870' },
    { label: 'P. C. W. Davies, "Scalar production in Schwarzschild and Rindler metrics", Journal of Physics A 8, 609 (1975)', url: 'https://doi.org/10.1088/0305-4470/8/4/022' },
    { label: 'S. A. Fulling, "Nonuniqueness of canonical field quantization in Riemannian space-time", Physical Review D 7, 2850 (1973)', url: 'https://doi.org/10.1103/PhysRevD.7.2850' },
    { label: 'L. C. B. Crispino, A. Higuchi, G. E. A. Matsas, "The Unruh effect and its applications", Reviews of Modern Physics 80, 787 (2008)', url: 'https://arxiv.org/abs/0710.5373' },
    { label: 'J. Steinhauer, "Observation of thermal Hawking radiation and its temperature in an analogue black hole", Nature 569, 688 (2019)', url: 'https://doi.org/10.1038/s41586-019-1241-0' },
  ],
  related: ['casimir-effect', 'quantum-zeno', 'time-crystals'],
};

export const CASIMIR_DOSSIER = {
  id: 'casimir-effect',
  title: 'The Casimir Effect',
  standfirst:
    'Two uncharged metal plates, a fraction of a micron apart, are pushed together by nothing. The force is real, it has been measured to a few per cent, and the usual explanation — "vacuum fluctuations push the plates" — is only one of two correct ways to describe what is happening.',
  field: 'Physics',
  lenses: ['Reality', 'Matter'],
  status: 'Measured, with a disputed popular explanation',
  difficulty: 'Intermediate',
  minutes: 21,
  opening:
    'In 1948 the Dutch physicist Hendrik Casimir was working on colloidal suspensions and asked a question about the quantum electromagnetic field between two conducting plates. The answer he found was a force that depends only on the separation, the speed of light and Planck\'s constant. It took until 1997 to measure it convincingly. The measurement is not controversial. The story told about it in popular science is.',
  sections: [
    {
      kind: 'prose',
      heading: 'A force with no charge and no temperature',
      body: [
        'Put two flat, uncharged, perfectly conducting plates in a vacuum at a separation of one micrometre. Classical electromagnetism predicts no force between them: no charge, no current, no field. Quantum electrodynamics predicts an attraction of about 1.3 millipascals — roughly one hundred-millionth of atmospheric pressure. At 100 nanometres the same formula gives about 13 pascals; at 10 nanometres, about 130 kilopascals, more than an atmosphere.',
        'The dependence is steep because the force falls as the fourth power of distance. Halve the gap and the pressure rises sixteenfold. That is why the effect was first seen only when experimentalists learned to hold surfaces at sub-micron separations without letting them snap together, and why it matters so much in microelectromechanical systems, where the same force can pull a suspended part into the substrate and destroy it.',
      ],
    },
    {
      kind: 'prose',
      heading: 'The mode-counting argument',
      body: [
        'The field between conducting plates can only support standing waves whose electric field vanishes at both surfaces. That restricts the allowed wavelengths in the gap. Outside the plates, there is no such restriction. Count the zero-point energy of the allowed modes inside, subtract the zero-point energy of the modes outside, and the difference depends on the separation. Differentiate with respect to separation and you have a force.',
        'Two things about this argument are easy to get wrong. The first is that both sums are infinite. The infinities are not physically meaningful, and the calculation only makes sense after a regularisation that subtracts the same infinite constant from both sides; what survives is the finite, distance-dependent part. The second is that the force is not simply "more modes outside than inside". The boundary conditions change the spectrum in a way that lowers the total energy as the plates approach, and the sign of the effect depends on the geometry and the materials, not on a universal "pressure from outside".',
      ],
    },
    {
      kind: 'terms',
      heading: 'Terms that carry the argument',
      items: [
        { term: 'Zero-point energy', definition: 'The lowest possible energy of a quantum mode, ħω/2. It cannot be removed from a single mode, but the total can change when boundary conditions change.' },
        { term: 'Boundary condition', definition: 'A constraint on a field at a surface. A conductor forces the tangential electric field to zero, which removes some modes from the gap.' },
        { term: 'Regularisation', definition: 'A mathematical procedure for handling divergent sums so that a finite, physically meaningful difference can be extracted. It is a calculation technique, not a claim that the vacuum energy is finite.' },
        { term: 'Lifshitz theory', definition: 'The 1956 theory of dispersion forces between macroscopic dielectric bodies, derived from their electromagnetic response functions. It includes the Casimir result as a limiting case.' },
        { term: 'Casimir–Polder force', definition: 'The closely related attraction between a neutral atom and a surface, caused by correlated dipole fluctuations. It falls as a different power of distance.' },
      ],
    },
    {
      kind: 'math',
      heading: 'The ideal-plate result',
      equation: 'F/A = − π² ħ c / (240 d⁴)',
      symbols: [
        { symbol: 'F/A', meaning: 'Attractive pressure between the plates. The minus sign means the force reduces the separation.', unit: 'pascal (N/m²)' },
        { symbol: 'ħ', meaning: 'Reduced Planck constant', unit: 'J·s' },
        { symbol: 'c', meaning: 'Speed of light', unit: 'm/s' },
        { symbol: 'd', meaning: 'Plate separation', unit: 'm' },
        { symbol: '240', meaning: 'A numerical factor from the mode sum. It is not adjustable; it follows from the geometry and the polarisation count.', unit: 'dimensionless' },
      ],
      body: [
        'The equation is for perfect conductors at zero temperature, with infinite area and perfectly flat, parallel surfaces. Real experiments depart from every one of those assumptions, which is why the measurement is a test of a model with corrections rather than a direct readout of this formula.',
        'The fourth power is the striking part. It means the force is negligible at millimetre scales and dominant at nanometre scales. The coefficient is fixed by the number of polarisations and the dimensionality of the mode sum; there is no free parameter to tune. That is what makes the effect a test of quantum field theory rather than a fit.',
      ],
      assumptions: [
        'Perfectly conducting, infinitely thick, perfectly flat plates.',
        'Zero temperature. At finite temperature there is an additional thermal contribution that becomes important when d is comparable to the thermal wavelength ħc/(k_BT), about 7.6 micrometres at 300 K.',
        'No real-material dispersion. Real metals become transparent at high frequencies, which suppresses the contribution of high-frequency modes and changes the numerical answer.',
        'Negligible roughness and no electrostatic patch potentials. In a real experiment these can dominate the force at the smallest separations.',
      ],
    },
    {
      kind: 'table',
      heading: 'From prediction to measurement',
      columns: ['Year', 'Work', 'Result'],
      rows: [
        ['1948', 'Casimir, "On the attraction between two perfectly conducting plates"', 'Predicted the force from the mode sum.'],
        ['1956', 'Lifshitz', 'Derived the force between real dielectric bodies from their response functions, including the ideal-conductor case.'],
        ['1958', 'Sparnaay', 'First attempt at a measurement with parallel plates. The result was consistent with the prediction but not precise enough to establish it.'],
        ['1997', 'Lamoreaux, Physical Review Letters', 'Measured the force between a sphere and a plate with a torsion pendulum at 0.6–6 μm, finding agreement at roughly the 5% level.'],
        ['1998', 'Mohideen and Roy', 'Used an atomic force microscope to measure the force to about 1% at 0.1–0.9 μm.'],
        ['2001–2011', 'Multiple groups', 'Measured the thermal correction, the dependence on material, and the geometry dependence. Repulsion has been reported in specific metamaterial and fluid systems; those results are subtle and not a general "negative Casimir force".'],
      ],
      note:
        'The sphere–plate geometry is used because two flat plates are almost impossible to keep parallel. The sphere–plate force is related to the plate–plate energy by the proximity-force approximation, which is accurate when the sphere radius is much larger than the gap.',
    },
    {
      kind: 'misconception',
      heading: 'The story most people are told',
      claim: '"Virtual particles from the vacuum bounce off the outside of the plates and push them together, while fewer fit between them."',
      correction:
        'This picture is a heuristic, and it misleads in several ways. There are no little particles bouncing. The effect follows from the change in the spectrum of the electromagnetic field under boundary conditions. More importantly, the same force can be derived without mentioning the vacuum at all: Lifshitz theory treats the plates as dielectrics and computes the attraction between fluctuating dipoles in the two bodies. The two derivations agree because they are two descriptions of the same correlations. The "pressure from outside" language also suggests a universal outward push, which is false: the sign and magnitude depend on geometry, material and temperature, and a thin metallic sphere near a plate does not feel a simple universal pressure.',
    },
    {
      kind: 'prose',
      heading: 'Why it still matters',
      body: [
        'The Casimir effect is one of the few places where the quantum structure of the electromagnetic field produces a force on a macroscopic object. That makes it a laboratory for the relationship between quantum field theory and materials. Modern precision measurements are sensitive enough to test the finite-temperature corrections, the role of real dielectric response, and the geometry dependence predicted by Lifshitz theory.',
        'It also has an engineering consequence. As mechanical devices shrink, surfaces come closer, and the Casimir force becomes a design constraint rather than a curiosity. It contributes to stiction in microelectromechanical systems, and it has to be accounted for in proposals for nanoscale machines. Some researchers have explored whether particular geometries or metamaterials could produce repulsion, which would be useful for levitation at small scales; the claims exist, but they are model-dependent and have not become a general engineering tool.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If two derivations — vacuum modes and fluctuating dipoles — give the same answer, which one is the explanation?',
        'Does the Casimir effect prove that zero-point energy is real, or only that the energy differences between boundary conditions are real?',
        'What would it mean for a force to be "caused by the vacuum" if the vacuum has no preferred state?',
        'Why does the effect grow so sharply with decreasing distance, and what does that imply for machines built at the nanoscale?',
      ],
    },
  ],
  sources: [
    { label: 'H. B. G. Casimir, "On the attraction between two perfectly conducting plates", Proc. K. Ned. Akad. Wet. 51, 793 (1948)', url: 'https://www.sciencedirect.com/science/article/pii/S0920563297800668' },
    { label: 'S. K. Lamoreaux, "Demonstration of the Casimir force in the 0.6 to 6 μm range", Physical Review Letters 78, 5 (1997)', url: 'https://doi.org/10.1103/PhysRevLett.78.5' },
    { label: 'U. Mohideen and A. Roy, "Precision measurement of the Casimir force from 0.1 to 0.9 μm", Physical Review Letters 81, 4549 (1998)', url: 'https://doi.org/10.1103/PhysRevLett.81.4549' },
    { label: 'M. Bordag, G. L. Klimchitskaya, U. Mohideen, V. M. Mostepanenko, Advances in the Casimir Effect (Oxford, 2009)', url: 'https://global.oup.com/academic/product/advances-in-the-casimir-effect-9780199238743' },
    { label: 'K. A. Milton, The Casimir Effect: Physical Manifestations of Zero-Point Energy (World Scientific, 2001)', url: 'https://www.worldscientific.com/worldscibooks/10.1142/4505' },
  ],
  related: ['unruh-effect', 'quantum-zeno', 'landauer-principle'],
};

export const ZENO_DOSSIER = {
  id: 'quantum-zeno',
  title: 'The Quantum Zeno Effect',
  standfirst:
    'A quantum system that is watched closely enough can be stopped from changing. Not slowed by friction, not frozen by temperature — prevented by the act of asking it the same question over and over.',
  field: 'Physics',
  lenses: ['Time', 'Reality'],
  status: 'Measured in trapped ions and cold atoms',
  difficulty: 'Intermediate',
  minutes: 19,
  opening:
    'Zeno of Elea argued that motion is impossible because an arrow in flight is at rest at every instant. The argument is a confusion about limits, and modern physics does not take it seriously as a claim about arrows. But in 1977 two physicists noticed that a quantum system repeatedly measured really can be held in place, and in 1990 an experiment with beryllium ions showed it happening. The effect is named after the wrong argument and is real anyway.',
  sections: [
    {
      kind: 'prose',
      heading: 'Short times behave differently from long times',
      body: [
        'A quantum state does not rotate away from itself at a constant rate. For very short times, the overlap between the initial state and the evolved state falls off quadratically: P(t) ≈ 1 − (ΔH)² t²/ħ². That is the same shape as the first terms of a cosine. It means the state barely moves at first, then begins to move faster.',
        'A measurement projects the system back onto an eigenstate of the measured observable. If you measure "are you still in the initial state?" quickly, the answer is almost certainly yes, and after the measurement the system is back in that state. Repeat the measurement N times over a total time T, and the survival probability is approximately the product of N factors each close to 1. As N grows, the product approaches 1. Taking the limit of continuous measurement, the system never leaves its initial state.',
      ],
    },
    {
      kind: 'terms',
      heading: 'Terms before the mathematics',
      items: [
        { term: 'Projective measurement', definition: 'A measurement that leaves the system in an eigenstate of the measured observable, with probabilities given by the Born rule. It is an idealisation, but it is the one the Zeno argument uses.' },
        { term: 'Survival probability', definition: 'The probability that the system is still found in its initial state when measured. It is the square of the overlap between the initial and evolved states.' },
        { term: 'Rabi oscillation', definition: 'The periodic exchange of population between two quantum states driven at resonance, with angular frequency Ω. It is the simplest system in which the effect is visible.' },
        { term: 'Decoherence', definition: 'The loss of quantum coherence when a system becomes entangled with its environment. It can act like a continuous measurement without any observer.' },
        { term: 'Anti-Zeno effect', definition: 'The opposite behaviour: measurement at a particular, not-too-fast rate can accelerate a decay rather than inhibit it.' },
      ],
    },
    {
      kind: 'math',
      heading: 'Two levels, N measurements',
      equation: 'P(N) = [cos(Ωτ/2)]^{2N},  τ = T/N',
      symbols: [
        { symbol: 'P(N)', meaning: 'Probability of finding the system in its initial state after N measurements', unit: 'dimensionless, 0 to 1' },
        { symbol: 'Ω', meaning: 'Rabi frequency: how fast the two states exchange population', unit: 'rad/s' },
        { symbol: 'τ', meaning: 'Time between measurements', unit: 's' },
        { symbol: 'T', meaning: 'Total duration of the experiment', unit: 's' },
        { symbol: 'N', meaning: 'Number of measurements', unit: 'dimensionless' },
      ],
      body: [
        'At fixed total time T, increasing N makes each interval shorter. For small τ, cos(Ωτ/2) ≈ 1 − Ω²τ²/8, so the power becomes approximately exp(−NΩ²τ²/4) = exp(−Ω²T²/(4N)). The survival probability rises toward 1 as N grows. This is the Zeno limit.',
        'The formula also shows what the effect is not. It is not that the system has stopped evolving in any absolute sense; it is that each measurement resets the phase relationship that would have allowed the population to transfer. The evolution between measurements is ordinary. The interruption is what changes the outcome.',
        'If τ is not small compared with the system\'s own timescale, the approximation fails. In that regime, a measurement can disturb the system in a way that increases the transition rate. That is the anti-Zeno effect, predicted by Kofman and Kurizki in 2000 and observed in 2001 by Fischer, Gutiérrez-Medina and Raizen using ultracold sodium atoms.',
      ],
      assumptions: [
        'Ideal projective measurements with no error and no duration.',
        'A closed two-level system between measurements.',
        'The measurement observable commutes with the initial state and does not itself drive transitions.',
        'The intervals are short compared with the Rabi period. Outside that regime the simple product formula is not valid.',
      ],
    },
    {
      kind: 'table',
      heading: 'The experimental record',
      columns: ['Year', 'Experiment', 'Finding'],
      rows: [
        ['1977', 'Misra and Sudarshan, theoretical paper', 'Showed that continuous observation can suppress transitions in quantum mechanics, and named the effect after Zeno.'],
        ['1990', 'Itano, Heinzen, Bollinger and Wineland, Physical Review A', 'Used about 5,000 beryllium ions driven by a radio-frequency field. Frequent short pulses suppressed the transition, with the survival probability following the predicted dependence on pulse interval.'],
        ['2001', 'Fischer, Gutiérrez-Medina and Raizen, Physical Review Letters', 'Observed the anti-Zeno effect in ultracold sodium atoms: measurements at an intermediate rate accelerated decay.'],
        ['2010s', 'Single-ion and superconducting-qubit experiments', 'Demonstrated Zeno and anti-Zeno behaviour in individual quantum systems with high control, and used the effect to test measurement back-action.'],
      ],
      note:
        'The 1990 experiment is often described as "watching a quantum system prevents it from changing". The pulses were not a passive look; they were resonant π-pulses that inverted the population and effectively asked the system whether it had made the transition. The idealisation in the formula is cleaner than any real experiment.',
    },
    {
      kind: 'misconception',
      heading: 'Consciousness is not required',
      claim: '"The Zeno effect proves that a conscious observer freezes reality by looking at it."',
      correction:
        'No observer needs to be conscious, or even present. A measurement is any physical interaction that entangles the system with a device in a way that records which state it is in. A photodetector, a second ion, or the environment itself can do it. The effect is a statement about the dynamics of a measured quantum system, not about minds. The "watched pot" metaphor is also misleading: the pot is not frozen by attention, and a system under continuous measurement can still evolve under a Hamiltonian that does not commute with the measured observable.',
    },
    {
      kind: 'prose',
      heading: 'Where the effect shows up outside the textbook',
      body: [
        'Quantum error correction relies on measuring stabiliser operators repeatedly without disturbing the encoded logical state. The Zeno effect is the mechanism that makes some of those protocols work: frequent measurements can suppress the very errors the code is designed to detect, provided the measurement commutes with the logical information.',
        'The same mathematics describes decoherence. A system strongly coupled to an environment is being measured continuously by that environment, and the result can be the suppression of transitions between pointer states. This is one route to understanding why macroscopic objects appear to have definite positions while microscopic ones do not. It is not a complete explanation of the measurement problem, but it is a precise, testable piece of the puzzle.',
        'In quantum thermodynamics, the effect has been used to control the flow of energy and information in small systems. Repeated measurement can act as a valve, and the thermodynamic cost of the measurement itself has to be included in the accounting — which connects directly to Landauer\'s principle.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If a measurement can stop a transition, what exactly is a measurement, physically?',
        'Does the Zeno effect support the idea that the arrow of time is created by observation, or does it only show that measurement changes dynamics?',
        'Where is the boundary between the Zeno and anti-Zeno regimes, and what does that boundary depend on?',
        'Could a quantum computer use Zeno measurements as a resource rather than treating measurement as an error?',
      ],
    },
  ],
  sources: [
    { label: 'B. Misra and E. C. G. Sudarshan, "The Zeno\'s paradox in quantum theory", Journal of Mathematical Physics 18, 756 (1977)', url: 'https://doi.org/10.1063/1.523304' },
    { label: 'W. M. Itano, D. J. Heinzen, J. J. Bollinger, D. J. Wineland, "Quantum Zeno effect", Physical Review A 41, 2295 (1990)', url: 'https://doi.org/10.1103/PhysRevA.41.2295' },
    { label: 'M. C. Fischer, B. Gutiérrez-Medina, M. G. Raizen, "Observation of the quantum Zeno and anti-Zeno effects in an unstable system", Physical Review Letters 87, 040402 (2001)', url: 'https://doi.org/10.1103/PhysRevLett.87.040402' },
    { label: 'A. G. Kofman and G. Kurizki, "Acceleration of quantum decay processes by frequent observations", Nature 405, 546 (2000)', url: 'https://doi.org/10.1038/35014537' },
  ],
  related: ['unruh-effect', 'landauer-principle', 'time-crystals'],
};

export const LANDAUER_DOSSIER = {
  id: 'landauer-principle',
  title: 'Landauer\'s Principle',
  standfirst:
    'Forgetting has a minimum price. Erasing one bit of information costs at least k_B T ln 2 of energy, and that small inequality ties computation to thermodynamics more tightly than any other result in the field.',
  field: 'Physics & Information',
  lenses: ['Mind & Machine', 'Reality'],
  status: 'Derived, measured, and still argued about',
  difficulty: 'Intermediate',
  minutes: 23,
  opening:
    'A computer does not just compute. It also erases. Every time a gate overwrites a bit, it destroys information, and in 1961 Rolf Landauer argued that this destruction has an unavoidable thermodynamic cost. The argument turns a bookkeeping rule into a physical law, and it is the reason Maxwell\'s demon cannot run a power station.',
  sections: [
    {
      kind: 'prose',
      heading: 'The demon and the price of forgetting',
      body: [
        'In 1867 James Clerk Maxwell imagined a tiny being who sorts fast molecules from slow ones through a trapdoor, apparently reducing entropy without doing work. The second law says entropy cannot decrease in a closed system, so either the demon is impossible or the second law is incomplete. For a century the puzzle was treated as a clever paradox about information.',
        'Leó Szilárd sharpened it in 1929 with a one-molecule engine. A single particle in a box, a partition, and a measurement of which side it is on: the information allows the engine to extract k_B T ln 2 of work per cycle. That is exactly the work that would be needed to erase the information again. In 1982 Charles Bennett completed the argument: measurement can in principle be reversible, but the demon must eventually reset its memory, and erasing a bit is irreversible. The cost of forgetting pays for the entropy the demon appeared to save.',
      ],
    },
    {
      kind: 'terms',
      heading: 'Terms before the inequality',
      items: [
        { term: 'Bit', definition: 'A physical system with two distinguishable states. The information content is one bit when the two states are equally likely.' },
        { term: 'Logically irreversible operation', definition: 'An operation that maps two or more input states to the same output state, so the input cannot be recovered from the output. Erasure is the canonical example.' },
        { term: 'Entropy', definition: 'A measure of the number of microscopic arrangements consistent with a macroscopic description. In information theory the same formula, −Σ p log p, measures uncertainty.' },
        { term: 'Szilard engine', definition: 'A thought experiment in which information about a single molecule is converted into work. It is the cleanest link between information and thermodynamics.' },
        { term: 'Reversible computing', definition: 'Computation built from gates that are one-to-one, so no information is destroyed. Such gates can in principle run with arbitrarily little energy dissipation, though practical machines still dissipate.' },
      ],
    },
    {
      kind: 'math',
      heading: 'The minimum cost of erasing one bit',
      equation: 'Q_min = k_B T ln 2',
      symbols: [
        { symbol: 'Q_min', meaning: 'Minimum heat that must be released to the environment when one bit is erased', unit: 'joules' },
        { symbol: 'k_B', meaning: 'Boltzmann constant, 1.381 × 10⁻²³', unit: 'J/K' },
        { symbol: 'T', meaning: 'Temperature of the environment', unit: 'kelvin' },
        { symbol: 'ln 2', meaning: 'Natural logarithm of two, 0.6931', unit: 'dimensionless' },
      ],
      body: [
        'At room temperature, 300 K, the bound is 2.87 × 10⁻²¹ joules, or about 0.0179 electronvolts. That is tiny compared with the energy of a visible photon (roughly 2 eV), which is why it took until 2012 to measure directly. It is not zero, and the inequality is not an engineering guideline: it is a consequence of the second law applied to the joint system of memory and environment.',
        'The derivation is a counting argument. Before erasure the bit is unknown, so the memory has two possible states and entropy k_B ln 2. After erasure it is definitely 0, with entropy zero. The second law requires the total entropy of memory plus environment not to decrease, so the environment must gain at least k_B ln 2 of entropy, which means at least k_B T ln 2 of heat must flow into it.',
        'The bound is a lower bound, not an equality. Real erasure dissipates far more, because transistors are not ideal and because speed costs energy. The interest of the result is that no engineering improvement can take you below the line while the operation remains logically irreversible.',
      ],
      assumptions: [
        'The bit is erased to a known state, not merely copied or flipped.',
        'The memory and environment are in thermal equilibrium at temperature T.',
        'The erased information is truly lost to the environment, not stored elsewhere in a correlated system.',
        'The operation is logically irreversible. Copying a bit, or applying a reversible NOT, is not erasure and has no such bound.',
      ],
    },
    {
      kind: 'table',
      heading: 'The experimental record',
      columns: ['Year', 'Work', 'Result'],
      rows: [
        ['1929', 'Szilárd', 'Linked one bit of information to k_B T ln 2 of extractable work.'],
        ['1961', 'Landauer', 'Argued that logically irreversible erasure must dissipate at least k_B T ln 2 per bit.'],
        ['1982', 'Bennett', 'Showed that measurement need not be irreversible, relocating the cost to erasure and rescuing the demon paradox.'],
        ['2012', 'Bérut et al., Nature', 'Measured the heat released when erasing a bit stored in a colloidal particle held in a double-well potential, finding the Landauer bound as the erasure speed slowed.'],
        ['2014–2018', 'Nanomagnetic and single-electron experiments', 'Measured erasure costs in solid-state memory and explored the approach to the bound.'],
      ],
      note:
        'The 2012 experiment used a silica bead about 2 μm across in a laser trap shaped like two wells. The bead\'s position encoded the bit. Tilting the potential merged the wells, erasing the bit, and the work done was measured. Slower erasure approached the bound; faster erasure cost more, as the finite-time thermodynamics of the protocol predicts.',
    },
    {
      kind: 'misconception',
      heading: 'What the principle does not say',
      claim: '"Every computation costs k_B T ln 2 per operation, so computing has a hard energy floor."',
      correction:
        'Only logically irreversible operations are bounded this way. A reversible gate such as a Toffoli gate maps inputs one-to-one and can in principle be implemented with arbitrarily little dissipation, because it destroys no information. Modern processors dissipate enormously more than Landauer\'s bound for reasons that have nothing to do with information theory: charging capacitances, resistive losses, and the need to operate far from equilibrium. Landauer\'s principle sets a floor for erasure, not a budget for computing.',
    },
    {
      kind: 'misconception',
      heading: 'And a live dispute',
      claim: '"Landauer\'s principle is a proven law with no remaining conceptual problems."',
      correction:
        'The derivation is robust under the standard assumptions, and the 2012 experiment supports it. But there is a serious minority literature arguing that the principle is not universal: that in some setups the entropy cost can be paid by correlations, or that the identification of logical irreversibility with thermodynamic irreversibility needs stronger assumptions. John Norton and others have pressed this case. The mainstream view is that Landauer\'s bound holds for the erasure of an uncorrelated bit; the argument is about how general that statement is. It is a good example of a result that is both well established and still being examined at its edges.',
    },
    {
      kind: 'prose',
      heading: 'Why a 10⁻²¹ joule result matters',
      body: [
        'Landauer\'s principle is the bridge between two languages that are often taught separately: the language of bits and the language of heat. It says that information is physical — not metaphorically, but in the sense that a memory has an entropy and changing that entropy has a thermodynamic price. That idea now appears in quantum error correction, in the thermodynamics of small systems, and in attempts to understand black hole entropy as information.',
        'It also changes what counts as progress in computing. For decades, the energy cost of a logic operation fell as transistors shrank. That cannot continue indefinitely: the Landauer bound is set by temperature, not by device size, and reversible computing is the only known route around it in principle. Whether reversible architectures can be made practical is an open engineering question, but the theoretical reason to try is exactly this inequality.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'Is information a physical quantity, or a useful description of physical correlations?',
        'If erasure costs energy, does the universe have a finite memory capacity?',
        'Can a computer be built that computes without ever erasing anything?',
        'Does the demon paradox dissolve once you account for memory, or does it point to something deeper about the second law?',
      ],
    },
  ],
  sources: [
    { label: 'R. Landauer, "Irreversibility and heat generation in the computing process", IBM Journal of Research and Development 5, 183 (1961)', url: 'https://doi.org/10.1147/rd.53.0183' },
    { label: 'C. H. Bennett, "The thermodynamics of computation — a review", International Journal of Theoretical Physics 21, 905 (1982)', url: 'https://doi.org/10.1007/BF02084158' },
    { label: 'A. Bérut et al., "Experimental verification of Landauer\'s principle linking information and thermodynamics", Nature 483, 187 (2012)', url: 'https://doi.org/10.1038/nature10872' },
    { label: 'L. Szilárd, "Über die Entropieverminderung in einem thermodynamischen System bei Eingriffen intelligenter Wesen", Zeitschrift für Physik 53, 840 (1929)', url: 'https://doi.org/10.1007/BF01341281' },
    { label: 'J. D. Norton, "Waiting for Landauer", Studies in History and Philosophy of Modern Physics 42, 184 (2011)', url: 'https://doi.org/10.1016/j.shpsb.2011.05.002' },
  ],
  related: ['quantum-zeno', 'casimir-effect', 'unruh-effect'],
};

export const TIME_CRYSTAL_DOSSIER = {
  id: 'time-crystals',
  title: 'Time Crystals',
  standfirst:
    'A crystal repeats in space. A time crystal repeats in time — and keeps repeating without settling into equilibrium. The idea was declared impossible, then redefined, then built in a laboratory.',
  field: 'Physics',
  lenses: ['Time', 'Matter'],
  status: 'Realised in driven and dissipative systems; the original proposal was ruled out',
  difficulty: 'Advanced',
  minutes: 22,
  opening:
    'Ordinary matter finds a lowest-energy arrangement and stops. A crystal is the simplest example: atoms settle into a repeating lattice because that configuration minimises the energy. In 2012 Frank Wilczek asked whether a system could do the same thing in time — settle into a state that repeats periodically, not because it is driven, but because that is its ground state. The answer turned out to be no in the setting he proposed, and yes in a different one.',
  sections: [
    {
      kind: 'prose',
      heading: 'What a crystal actually is',
      body: [
        'A crystal is a phase of matter in which the symmetry of the underlying laws is broken by the state. The laws of physics are the same everywhere, so they have continuous translation symmetry. A crystal is not the same everywhere: it repeats every lattice spacing. The symmetry is not lost, it is hidden — the state chooses a particular position, and the pattern is invariant only under a discrete subgroup of the original symmetry.',
        'This is the language that makes time crystals meaningful. The laws are also invariant under time translation: an experiment run now and the same experiment run a minute later should give the same result. A time crystal would be a state that breaks that symmetry spontaneously, repeating with a period of its own rather than the period of any drive. The definition matters, because it determines whether the thing you have built is a time crystal or just a driven oscillator.',
      ],
    },
    {
      kind: 'terms',
      heading: 'Terms before the no-go theorem',
      items: [
        { term: 'Spontaneous symmetry breaking', definition: 'When the equations have a symmetry but the lowest-energy state does not. A ferromagnet is the standard example: the laws do not pick a direction, but the magnet does.' },
        { term: 'Time-translation symmetry', definition: 'The statement that the laws do not change from moment to moment. It is what makes energy conservation possible, by Noether\'s theorem.' },
        { term: 'Floquet system', definition: 'A system driven periodically in time, so its Hamiltonian satisfies H(t+T) = H(t). It has no energy conservation in the usual sense, because the drive exchanges energy with the system.' },
        { term: 'Subharmonic response', definition: 'A response whose period is an integer multiple of the drive period. A period-doubled response, 2T, is the signature of a discrete time crystal.' },
        { term: 'Many-body localisation', definition: 'A quantum phase in which disorder prevents a system from thermalising. It can protect a time crystal from heating indefinitely in an ideal model.' },
      ],
    },
    {
      kind: 'prose',
      heading: 'The theorem that ended the first version',
      body: [
        'In 2013 Haruki Watanabe and Masaki Oshikawa, and independently Patrick Bruno, proved a no-go result: in thermal equilibrium, a quantum system with time-translation symmetry cannot spontaneously break it. The argument is a version of the same logic that forbids perpetual motion. If the ground state were periodic in time, it would have to return to itself after a period, and the energy would have to be both conserved and changing. The only way out is a state that is not in equilibrium.',
        'Wilczek\'s original proposal involved a ring of particles with a current, and the theorem applies to it. That is not a failure of the idea so much as a clarification of what the idea has to be. A time crystal cannot be an equilibrium ground state. It has to be a non-equilibrium phase, sustained by a drive or by dissipation, and it has to be robust — the periodicity must survive small perturbations, which is what makes it a phase rather than a finely tuned accident.',
      ],
    },
    {
      kind: 'math',
      heading: 'Period doubling, precisely',
      equation: 'H(t + T) = H(t),  ⟨O(t + 2T)⟩ = ⟨O(t)⟩,  ⟨O(t + T)⟩ ≠ ⟨O(t)⟩',
      symbols: [
        { symbol: 'H(t)', meaning: 'The Hamiltonian, including the periodic drive', unit: 'energy' },
        { symbol: 'T', meaning: 'The period of the drive', unit: 'seconds' },
        { symbol: 'O', meaning: 'An observable, such as the magnetisation of a spin chain', unit: 'varies' },
        { symbol: '⟨O⟩', meaning: 'Quantum expectation value', unit: 'same as O' },
      ],
      body: [
        'The first equation says the drive repeats every T. The second says the observable repeats every 2T — it is periodic, but with twice the drive\'s period. The third says it does not repeat after T alone. That combination is the definition of a discrete time crystal: the system responds at a subharmonic of the drive, and the response is locked there over a range of parameters rather than at a single fine-tuned point.',
        'The robustness is the physics. A driven pendulum can be made to swing at half the drive frequency by tuning it, but that is resonance, not a phase. A time crystal stays period-doubled when you change the drive strength, the initial state, or the details of the interaction, as long as you stay inside the phase. It is the same distinction as between a crystal and a carefully arranged pile of atoms.',
      ],
      assumptions: [
        'A periodically driven (Floquet) system, not an isolated equilibrium system.',
        'A disorder or many-body-localisation mechanism that prevents the system from absorbing energy and heating to infinite temperature.',
        'A finite system, or a system in the thermodynamic limit with a suitable protection mechanism. Finite-size effects can mimic the response without a true phase.',
        'A measured observable with the right symmetry. Not every observable shows the subharmonic, even in a genuine time crystal.',
      ],
    },
    {
      kind: 'table',
      heading: 'From proposal to laboratory',
      columns: ['Year', 'Work', 'Status'],
      rows: [
        ['2012', 'Wilczek, "Quantum time crystals"', 'Proposed a time crystal as a ground-state phase.'],
        ['2013', 'Bruno; Watanabe and Oshikawa', 'No-go theorems showing that equilibrium time crystals are impossible.'],
        ['2016', 'Else, Bauer and Nayak; Khemani et al.', 'Proposed discrete time crystals in periodically driven, many-body-localised systems.'],
        ['2017', 'Zhang et al., Nature; Choi et al., Nature', 'Reported discrete time-crystal signatures in trapped ions and nitrogen-vacancy centres in diamond.'],
        ['2021–2022', 'Superconducting-qubit and cold-atom experiments', 'Extended the observations to larger systems and to a dissipative, continuously driven setting.'],
      ],
      note:
        'The 2017 experiments are the ones usually cited as "time crystals built". They observed period-doubled oscillations in driven spin systems over many drive cycles, with the response persisting across a range of parameters. The systems are small, and the theoretical description relies on many-body localisation, which is itself an active research area.',
    },
    {
      kind: 'misconception',
      heading: 'It is not a perpetual motion machine',
      claim: '"A time crystal moves forever without energy input, which violates thermodynamics."',
      correction:
        'A discrete time crystal is driven. Energy is pumped in at frequency 2π/T, and the system responds at half that frequency. It is out of equilibrium by construction, and it does not produce work without input. The no-go theorem exists precisely to rule out the version that would be a free lunch. "It keeps moving" is not the same as "it keeps giving energy"; a clock also keeps ticking, and you wind it.',
    },
    {
      kind: 'prose',
      heading: 'Why the idea survived its own disproof',
      body: [
        'The redefinition is the interesting part. Wilczek\'s question — can a phase of matter break time translation? — was answered no for equilibrium and yes for driven systems. That is not a retreat; it is how phase transitions work. Ferromagnetism is not a failure of a theory that predicted magnetic order in the wrong setting. The no-go theorem told physicists where to look.',
        'Discrete time crystals now sit at the meeting point of several active fields: non-equilibrium quantum matter, many-body localisation, quantum simulation, and precision metrology. Their practical use is speculative, but the reason to study them is not practical. They are a new answer to an old question about what a phase of matter can be, and they show that the classification of matter is not finished.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'Is a driven system that responds at half the drive frequency genuinely a new phase, or a resonance with a fancy name?',
        'What would it take to observe a time crystal in a system large enough to survive in the thermodynamic limit?',
        'If time-translation symmetry can be broken by a state, what other symmetries might matter have found ways to hide?',
        'Does the no-go theorem tell us something deep about time, or only about equilibrium?',
      ],
    },
  ],
  sources: [
    { label: 'F. Wilczek, "Quantum time crystals", Physical Review Letters 109, 160401 (2012)', url: 'https://doi.org/10.1103/PhysRevLett.109.160401' },
    { label: 'H. Watanabe and M. Oshikawa, "Absence of quantum time crystals", Physical Review Letters 114, 251603 (2015)', url: 'https://doi.org/10.1103/PhysRevLett.114.251603' },
    { label: 'D. V. Else, B. Bauer, C. Nayak, "Floquet time crystals", Physical Review Letters 117, 090402 (2016)', url: 'https://doi.org/10.1103/PhysRevLett.117.090402' },
    { label: 'J. Zhang et al., "Observation of a discrete time crystal", Nature 543, 217 (2017)', url: 'https://doi.org/10.1038/nature21413' },
    { label: 'S. Choi et al., "Observation of discrete time-crystalline order in a disordered dipolar many-body system", Nature 543, 221 (2017)', url: 'https://doi.org/10.1038/nature21426' },
  ],
  related: ['unruh-effect', 'quantum-zeno', 'godel-incompleteness'],
};

export const ARROW_OF_TIME_DOSSIER = {
  id: 'arrow-of-time',
  title: 'The Arrow of Time',
  standfirst:
    'Every fundamental law of physics works just as well backwards. Yet cups break and never un-break. The arrow of time is not in the equations; it is in the condition the universe started from.',
  field: 'Physics',
  lenses: ['Time', 'Reality'],
  status: 'Established thermodynamics, contested origin',
  difficulty: 'Intermediate',
  minutes: 19,
  opening:
    'Play a film of two billiard balls colliding and run it backwards. Nothing looks wrong. Play a film of a glass falling off a table and shattering, and the reversed version is obviously impossible. The microscopic laws governing every molecule in both films are time-symmetric: replace t with −t and they still hold. So the asymmetry cannot come from the laws. It has to come from the state the universe was in.',
  sections: [
    {
      kind: 'prose',
      heading: 'The laws do not have a favourite direction',
      body: [
        'Newton’s second law, Maxwell’s equations, Schrödinger’s equation and Einstein’s field equations all admit reversed solutions. If a trajectory is allowed, so is the same trajectory traversed in the opposite order with momenta reversed. This is not a loophole in the mathematics; it is a structural feature of the equations. A universe governed only by them would have no built-in past or future.',
        'What breaks the symmetry is a boundary condition. The early universe was extraordinarily uniform, with matter and radiation at almost identical temperature across regions that had never been in causal contact. That is a very special, very low-entropy starting point. Given that start, entropy has overwhelmingly more room to increase than to decrease, and the direction of increase is what we experience as time passing.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of the problem',
      items: [
        {
          term: 'Entropy',
          definition:
            'A count of how many microscopic arrangements produce the same macroscopic appearance. A shuffled deck has higher entropy than a sorted one because vastly more shuffles look shuffled.',
        },
        {
          term: 'Past hypothesis',
          definition:
            'The assumption, stated by Albert and others, that the universe began in a specific low-entropy macrostate. It is an initial condition, not a law, and it is what makes the second law possible.',
        },
        {
          term: 'Recurrence',
          definition:
            'Poincaré’s theorem that a bounded, isolated system will eventually return arbitrarily close to its initial state. Given enough time, a gas in a box retraces its history — but the time required is astronomical.',
        },
        {
          term: 'Time-symmetric',
          definition:
            'A law is time-symmetric if replacing t by −t gives another valid solution. Almost all fundamental laws have this property; the second law does not.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'Boltzmann’s entropy, and why the logarithm is there',
      equation: 'S = k_B ln W',
      symbols: [
        { symbol: 'S', meaning: 'Entropy of the macrostate', unit: 'J/K' },
        { symbol: 'k_B', meaning: 'Boltzmann constant, 1.381 × 10⁻²³', unit: 'J/K' },
        { symbol: 'W', meaning: 'Number of microscopic arrangements that look the same macroscopically', unit: 'dimensionless' },
        { symbol: 'ln', meaning: 'Natural logarithm, which turns multiplication of independent arrangements into addition of entropies' },
      ],
      body: [
        'The logarithm is not decoration. If two systems are independent, the number of joint arrangements is the product W₁W₂, while entropy should add: S = S₁ + S₂. The only function that turns a product into a sum is a logarithm. Boltzmann’s formula is the unique way to make entropy extensive, and that is why it takes the form it does.',
        'The formula also explains why entropy increases without any force pushing it. There are simply more ways for a system to be spread out than concentrated. A gas occupies the whole box not because molecules prefer the edges but because the number of arrangements with molecules in one half is smaller than the number with them everywhere. The second law is a statement about counting, which is why it admits rare exceptions.',
      ],
      assumptions: [
        'The system is isolated, so no energy or matter crosses its boundary.',
        'All accessible microstates are equally probable — the microcanonical assumption.',
        'The system is large enough that fluctuations away from the most probable macrostate are negligible.',
      ],
    },
    {
      kind: 'table',
      heading: 'Several arrows, and what sets each one',
      columns: ['Arrow', 'What it describes', 'What would have to be true to reverse it'],
      rows: [
        ['Thermodynamic', 'Entropy increases toward the future', 'A low-entropy future boundary condition, not a change in the laws'],
        ['Radiation', 'Waves spread outward from sources', 'Ingoing waves converging on a source, which is a valid solution but not what we see'],
        ['Memory', 'We remember the past and not the future', 'A physical record-forming process that runs in the opposite direction'],
        ['Cosmological', 'The universe expands from a hot dense state', 'A contracting phase; expansion is not itself a thermodynamic arrow'],
      ],
      note:
        'The striking fact is that these arrows all point the same way. Nothing in the laws requires memory, radiation and entropy to agree; they do because they all inherit the direction set by the early universe.',
    },
    {
      kind: 'misconception',
      heading: 'The oldest confusion in the subject',
      claim: '"Entropy is disorder, and the second law says disorder always increases."',
      correction:
        '“Disorder” is a metaphor that fails as soon as it is tested. A crystal is ordered but can have higher entropy than a liquid at a different temperature; gravity makes a uniform gas collapse into a star, and the star has lower entropy than the cloud it formed from. Entropy counts accessible arrangements consistent with what you can measure, not how tidy something looks. The second law is also statistical: it says entropy is overwhelmingly likely to increase, not that it can never decrease. For a handful of molecules, fluctuations are routine.',
    },
    {
      kind: 'prose',
      heading: 'Why the past hypothesis is not a fudge',
      body: [
        'It can sound as though the arrow of time has been explained by assuming it. In one sense that is right: the past hypothesis is an input, not a derivation. But it is a very specific and testable input. It predicts that the cosmic microwave background should be almost perfectly uniform, that primordial perturbations should be nearly scale-invariant, and that the early universe should contain no large-scale structure. All three hold, to remarkable precision.',
        'The open problem is why that condition held. Inflation offers an explanation — a period of exponential expansion would stretch away almost any initial inhomogeneity and leave precisely the spectrum we observe. But inflation itself needs a low-entropy starting point and a mechanism to end, so the question is pushed back rather than closed. Competing proposals, including Carroll and Chen’s spontaneous inflation and Penrose’s Weyl curvature hypothesis, remain speculative. No experiment currently distinguishes them.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If the laws are time-symmetric, what kind of fact is “the universe started in a low-entropy state”?',
        'Does the existence of memory require an arrow, or could a time-symmetric system contain records of both directions?',
        'Poincaré recurrence says entropy will eventually decrease. Is that a refutation of the second law or a reminder that it is statistical?',
        'Why is the early universe’s low entropy so extreme? The number of possible states is vast, and the observed one looks chosen.',
      ],
    },
  ],
  sources: [
    { label: 'L. Boltzmann, Lectures on Gas Theory (1896); the entropy formula and the statistical interpretation', url: 'https://en.wikipedia.org/wiki/Ludwig_Boltzmann' },
    { label: 'J. L. Lebowitz, "Boltzmann’s entropy and time’s arrow", Physics Today 46, 32 (1993)', url: 'https://doi.org/10.1063/1.881363' },
    { label: 'S. M. Carroll and C. Chen, "Spontaneous inflation and the origin of the arrow of time" (2004)', url: 'https://arxiv.org/abs/hep-th/0410270' },
    { label: 'D. Z. Albert, Time and Chance (Harvard University Press, 2000)', url: 'https://www.hup.harvard.edu/books/9780674010321' },
  ],
  related: ['unruh-effect', 'landauer-principle', 'time-crystals'],
};

export const FALSE_VACUUM_DOSSIER = {
  id: 'false-vacuum',
  title: 'The False Vacuum',
  standfirst:
    'The Higgs field may not be sitting at the bottom of its energy curve. If it is not, a quantum tunnelling event could one day rewrite the laws of particle physics at nearly the speed of light. The calculation says the odds are astronomically small — and that the answer depends on physics we have not yet measured.',
  field: 'Physics',
  lenses: ['Reality', 'Infinity'],
  status: 'Hypothesis consistent with current data',
  difficulty: 'Advanced',
  minutes: 21,
  opening:
    'A ball in a valley is stable. A ball in a shallow dip on the side of a mountain is metastable: it will sit there for a very long time, but it is not at the bottom. The Higgs field, which gives elementary particles their mass, may be in the second situation. Its current value is a local minimum of the potential, not necessarily the global one. If a sufficiently large region tunnelled to the true minimum, the difference in the laws would propagate outward as a bubble of new vacuum.',
  sections: [
    {
      kind: 'prose',
      heading: 'What “vacuum” means when a field is everywhere',
      body: [
        'In quantum field theory the vacuum is the state of lowest energy, and the energy of a field configuration is given by its potential. The Higgs potential is shaped like a Mexican hat: the symmetric point at zero field is unstable, and the field settles somewhere on the circular valley of minima. The value it settles at is about 246 GeV, and the mass of the Higgs boson, 125 GeV, is a measure of the curvature of the valley at that point.',
        'The question is whether the valley we are in is the lowest one. Quantum corrections from the top quark, the W and Z bosons and the Higgs itself tilt the potential. The top quark, being heavy, pushes the potential down at large field values; the Higgs mass pulls it up. With the measured values, the calculation lands near the boundary between stable and metastable. The current best fit is that the vacuum is metastable, but only at a few standard deviations, and the result is sensitive to the top quark mass.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The ideas the argument needs',
      items: [
        {
          term: 'False vacuum',
          definition:
            'A local minimum of the energy that is not the global minimum. It is stable against small disturbances but can decay by tunnelling.',
        },
        {
          term: 'Metastability',
          definition:
            'The condition of being long-lived but not permanently stable. A metastable vacuum has a finite lifetime, even if that lifetime exceeds the age of the universe by many orders of magnitude.',
        },
        {
          term: 'Bounce solution',
          definition:
            'The field configuration that dominates the tunnelling calculation. It is a solution of the Euclidean equations of motion that interpolates between the false and true vacua.',
        },
        {
          term: 'Eternal inflation',
          definition:
            'A regime in which some regions of space keep inflating forever while others stop. If it occurred, a decaying vacuum could be continually recreated elsewhere, changing what “the end of the universe” means.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'The decay rate, and the exponential that controls it',
      equation: 'Γ/V = A e^{−B/ħ}',
      symbols: [
        { symbol: 'Γ/V', meaning: 'Tunnelling rate per unit volume, with units of inverse time per cubic metre' },
        { symbol: 'A', meaning: 'A pre-factor from quantum fluctuations around the bounce solution, with units that make the rate dimensionally correct' },
        { symbol: 'B', meaning: 'The Euclidean action of the bounce, a number with units of action that measures how much the field has to climb before it can fall' },
        { symbol: 'ħ', meaning: 'Reduced Planck constant; the smallness of ħ is why the exponential is so punishing' },
      ],
      body: [
        'The structure is the same as every tunnelling problem: a barrier height divided by ħ, exponentiated. Here the barrier is not a physical wall but the energy cost of a bubble of true vacuum forming inside the false one. The bubble must be large enough that the energy saved in its volume exceeds the energy cost of its surface, and the critical size is set by the shape of the potential.',
        'For the Standard Model the bounce action is enormous. Published calculations give a lifetime many orders of magnitude longer than the age of the universe, with the exact exponent depending on the top quark mass at the few-sigma level. That is not a reassurance that the vacuum is stable; it is a statement that the decay is slow compared with everything we can observe.',
      ],
      assumptions: [
        'The Standard Model is valid up to the Planck scale, with no new particles or interactions changing the potential in between.',
        'The calculation uses the measured Higgs and top quark masses and their experimental uncertainties; a different top mass can move the result across the stability boundary.',
        'Gravity is neglected in the tunnelling calculation, which is a good approximation while the bubble is much smaller than the Planck length scale.',
      ],
    },
    {
      kind: 'table',
      heading: 'What the measurements say',
      columns: ['Quantity', 'Measured value', 'Role in the calculation'],
      rows: [
        ['Higgs boson mass', '125.25 ± 0.17 GeV', 'Sets the curvature of the potential at the electroweak minimum'],
        ['Top quark mass', '172.69 ± 0.30 GeV', 'The largest driver of the instability at high field values'],
        ['Strong coupling', 'α_s(m_Z) ≈ 0.1179', 'Enters the running of the quartic coupling'],
        ['Resulting status', 'Metastable at ~2–3σ', 'Not a discovery; a fit whose significance depends on the inputs'],
      ],
      note:
        'The word “metastable” here is a statement about a calculation, not an observation. No experiment has seen a vacuum decay, and the confidence depends on assuming no new physics between the electroweak scale and the Planck scale.',
    },
    {
      kind: 'misconception',
      heading: 'Two ways to overread the result',
      claim: '"If the vacuum is metastable, a decay could happen at any moment and destroy the universe."',
      correction:
        'A finite lifetime is not a scheduled event. The expected lifetime from the Standard Model calculation is vastly longer than the age of the universe — the kind of number where writing out the zeros would take a page. More importantly, the decay would produce a bubble expanding at nearly the speed of light, and we would have no warning. But the rate is so small that the probability of a decay occurring in the observable universe during its entire history is negligible. The interesting question is not “will it happen tomorrow” but “why is the vacuum perched where it is”.',
    },
    {
      kind: 'misconception',
      heading: 'And a second',
      claim: '"Vacuum decay has been observed in an experiment."',
      correction:
        'It has not. What has been observed is the Higgs boson and the top quark, and what has been calculated is the shape of the potential they imply. Analogue experiments in cold atoms and superconducting circuits have simulated tunnelling between wells, which tests the mathematics of the model, not the vacuum of the real universe. The distinction matters because the claim “the vacuum is metastable” is a extrapolation over eighteen orders of magnitude in energy.',
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If the vacuum is metastable, is that a problem for the universe or only for our description of it?',
        'Does eternal inflation make vacuum decay inevitable somewhere, and if so, does “somewhere” include here?',
        'How would the existence of new particles at intermediate energies change the lifetime calculation?',
        'Why does the Higgs mass sit so close to the boundary between stability and instability?',
      ],
    },
  ],
  sources: [
    { label: 'S. Coleman, "Fate of the false vacuum: semiclassical theory", Physical Review D 15, 2929 (1977)', url: 'https://doi.org/10.1103/PhysRevD.15.2929' },
    { label: 'G. Degrassi et al., "Higgs mass and vacuum stability in the Standard Model at NNLO", JHEP 08, 098 (2012)', url: 'https://arxiv.org/abs/1205.6497' },
    { label: 'A. Andreassen, W. Frost, M. D. Schwartz, "Scale invariant instantons and the complete lifetime of the Standard Model", Physical Review D 97, 056006 (2018)', url: 'https://arxiv.org/abs/1707.08124' },
    { label: 'Particle Data Group, Review of Particle Physics (2024), Higgs boson listings', url: 'https://pdg.lbl.gov/' },
  ],
  related: ['unruh-effect', 'time-crystals', 'godel-incompleteness'],
};

export const SPIN_ICE_DOSSIER = {
  id: 'spin-ice',
  title: 'Spin Ice and Its Monopoles',
  standfirst:
    'In a class of magnetic crystals the atoms refuse to agree on a direction, and the resulting disorder is frozen in. The excitations of this frozen state behave like magnetic monopoles — particles with only one pole — even though no fundamental monopole has ever been found.',
  field: 'Physics',
  lenses: ['Matter'],
  status: 'Established material; monopoles are emergent quasiparticles',
  difficulty: 'Advanced',
  minutes: 18,
  opening:
    'Water ice has a strange rule named after Linus Pauling: each oxygen sits at the centre of a tetrahedron, and exactly two of the four hydrogen bonds around it point toward it. The protons are disordered, but the disorder is constrained. In 1997 a class of magnetic crystals was found to obey the same rule with magnetic moments instead of protons. The material is called spin ice, and its frozen disorder turns out to host excitations that carry a net magnetic charge.',
  sections: [
    {
      kind: 'prose',
      heading: 'Frustration: when every arrangement is a compromise',
      body: [
        'Put three magnetic moments on the corners of a triangle and ask each pair to point opposite ways. No arrangement satisfies all three. This is frustration: the interactions cannot all be minimised at once, so the system has many nearly degenerate ground states instead of one. In a pyrochlore lattice — corner-sharing tetrahedra — the geometry produces the same effect in three dimensions.',
        'The result is not a conventional magnet with a single ordered direction. It is a state with extensive entropy at low temperature: the number of arrangements remains macroscopic even as T approaches zero. Pauling estimated the residual entropy of water ice in 1935, and the same counting argument applies to spin ice, where it has been measured in heat-capacity experiments.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of a frustrated magnet',
      items: [
        {
          term: 'Frustration',
          definition:
            'A situation in which competing interactions cannot all be satisfied simultaneously. It produces many low-energy arrangements rather than a single ordered ground state.',
        },
        {
          term: 'Spin ice',
          definition:
            'A magnetic material whose moments obey the same “two in, two out” rule as protons in water ice, leaving a disordered but frozen magnetic state.',
        },
        {
          term: 'Quasiparticle',
          definition:
            'A collective excitation that behaves like a particle. It is not fundamental; it is a pattern in a many-body system that can be tracked, scattered and counted.',
        },
        {
          term: 'Magnetic monopole',
          definition:
            'A particle with a single magnetic pole. No fundamental monopole has been observed; in spin ice, pairs of excitations behave as effective monopoles with opposite charge.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'A defect that acts like a charge',
      body: [
        'Start with a perfectly obeying “two in, two out” tetrahedron. Flip one moment, and two adjacent tetrahedra now have three in and one out, or one in and three out. Those two tetrahedra are defects in the ice rule, and they are created together. The key observation, made by Castelnovo, Moessner and Sondhi in 2008, is that these defects behave exactly like a pair of opposite magnetic charges: they attract, they can be separated, and in a magnetic field they drift apart.',
        'They are not fundamental particles. They are emergent quasiparticles, made of many coordinated atomic moments. But the mathematics that describes them is the mathematics of monopoles, including a Coulomb interaction and a magnetic “current” when they move. Neutron scattering experiments in 2009 saw the signature: pinch-point patterns in reciprocal space, which are the fingerprint of a Coulomb phase with deconfined monopoles.',
      ],
    },
    {
      kind: 'table',
      heading: 'Where the effect has been seen',
      columns: ['Material', 'Lattice', 'What was observed'],
      rows: [
        ['Ho₂Ti₂O₇', 'Pyrochlore', 'Neutron pinch-point scattering consistent with a Coulomb phase'],
        ['Dy₂Ti₂O₇', 'Pyrochlore', 'Dirac strings and monopole excitations in neutron data'],
        ['Artificial spin ice', 'Nanomagnets on a lattice', 'Direct imaging of monopole-like defects and their dynamics'],
        ['Water ice', 'Hexagonal', 'The original Pauling residual entropy; no magnetic monopoles'],
      ],
      note:
        'The artificial systems are lithographically fabricated arrays of nanomagnets. They allow direct imaging of the defects, which natural crystals do not, but their energy scales and dynamics are different from the real material.',
    },
    {
      kind: 'misconception',
      heading: 'What “monopole” does and does not mean here',
      claim: '"Magnetic monopoles have been discovered in spin ice."',
      correction:
        'What has been discovered is a material whose collective excitations carry magnetic charge. The underlying constituents are ordinary magnetic dipoles, and Maxwell’s equation ∇·B = 0 still holds at the microscopic level. The quasiparticles are real in the sense that they can be measured, but they are not the fundamental monopoles that grand unified theories predict. Conflating the two is like saying that a phonon is a new fundamental particle because it behaves like one.',
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If a quasiparticle can carry a magnetic charge, is the distinction between fundamental and emergent particles a matter of degree or of kind?',
        'Why does the ice rule produce a Coulomb phase rather than a conventional ordered state?',
        'Could artificial spin ice be used to build logic devices that move monopoles instead of electrons?',
        'What would a genuine fundamental monopole look like, and how would it differ from the spin-ice excitation?',
      ],
    },
  ],
  sources: [
    { label: 'L. Pauling, "The structure and entropy of ice and of other crystals with some randomness of atomic arrangement", JACS 57, 2680 (1935)', url: 'https://doi.org/10.1021/ja01315a102' },
    { label: 'M. J. Harris et al., "A new pyrochlore magnet with a spin-ice ground state", Physical Review Letters 79, 2554 (1997)', url: 'https://doi.org/10.1103/PhysRevLett.79.2554' },
    { label: 'C. Castelnovo, R. Moessner, S. L. Sondhi, "Magnetic monopoles in spin ice", Nature 451, 42 (2008)', url: 'https://doi.org/10.1038/nature06433' },
    { label: 'D. J. P. Morris et al., "Dirac strings and magnetic monopoles in the spin ice Dy₂Ti₂O₇", Science 326, 411 (2009)', url: 'https://doi.org/10.1126/science.1178868' },
  ],
  related: ['time-crystals', 'casimir-effect', 'mycorrhizal-networks'],
};

export const PHYSICS_DOSSIERS = [
  UNRUH_DOSSIER,
  CASIMIR_DOSSIER,
  ZENO_DOSSIER,
  LANDAUER_DOSSIER,
  TIME_CRYSTAL_DOSSIER,
  ARROW_OF_TIME_DOSSIER,
  FALSE_VACUUM_DOSSIER,
  SPIN_ICE_DOSSIER,
];
