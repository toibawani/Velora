/**
 * Cosmology dossiers.
 *
 * Cosmology is where the gap between "the model fits" and "we know why" is
 * widest, so these essays are explicit about which number comes from which
 * measurement and what would count as a resolution. No claim here is stronger
 * than the published disagreement it comes from.
 */

export const HUBBLE_TENSION_DOSSIER = {
  id: 'hubble-tension',
  title: 'The Hubble Tension',
  standfirst:
    'Two of the most precise measurements in cosmology disagree about how fast the universe is expanding. One says 67, the other says 73, and the gap has survived every attempt to explain it away. Either one team is wrong, or the standard model is incomplete.',
  field: 'Cosmology',
  lenses: ['Reality', 'Time'],
  status: 'Live discrepancy, roughly five sigma; cause unresolved',
  difficulty: 'Advanced',
  minutes: 25,
  opening:
    'The expansion rate of the universe is not a philosophical abstraction. It sets the age of the universe, the distance to everything, and the growth of structure. There are two ways to measure it. One reads the cosmic microwave background, the afterglow of the early universe, and fits a model to it. The other climbs a ladder of distance indicators from nearby stars to distant supernovae. The first gives about 67 kilometres per second per megaparsec. The second gives about 73. The error bars are small enough that the two numbers no longer overlap.',
  sections: [
    {
      kind: 'prose',
      heading: 'What the number means',
      body: [
        'The Hubble constant is the slope of the relation between distance and recession velocity for galaxies: a galaxy one megaparsec away recedes at H₀ kilometres per second faster than one at zero distance. A megaparsec is about 3.26 million light years. The value is not constant in time — the expansion rate changes as the universe evolves — so H₀ is specifically the value now, and the subscript matters. A measurement of 73 versus 67 is a difference of about nine per cent, which sounds small until you remember that the error bars are around one per cent.',
        'The two numbers are not measurements of the same thing in the same way. The cosmic microwave background measurement is a fit: given the pattern of temperature fluctuations, and assuming the standard cosmological model with its six parameters, you infer H₀. The distance-ladder measurement is local and direct: you measure distances to stars and supernovae, calibrate the relation between distance and redshift, and read off the slope. If the two disagree, either the local measurements have a systematic error, or the model used to interpret the early universe is missing something.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of the dispute',
      items: [
        {
          term: 'Hubble constant',
          definition:
            'The present-day rate of cosmic expansion, expressed as kilometres per second per megaparsec. It is not a constant of nature; it changes with cosmic time.',
        },
        {
          term: 'Standard candle',
          definition:
            'An object whose intrinsic brightness is known, so its observed brightness gives its distance. Type Ia supernovae and Cepheid variables are the classical examples.',
        },
        {
          term: 'Distance ladder',
          definition:
            'A chain of overlapping distance measurements, each calibrated by the one below it: parallax for nearby stars, Cepheids for nearby galaxies, supernovae for distant ones.',
        },
        {
          term: 'Cosmic microwave background',
          definition:
            'The relic radiation from the time the universe became transparent, about 380,000 years after the Big Bang. Its temperature pattern encodes the composition and expansion history of the early universe.',
        },
        {
          term: 'Baryon acoustic oscillations',
          definition:
            'A preferred distance scale imprinted on galaxy clustering by sound waves in the early universe. It provides a cosmic ruler independent of stellar distance indicators.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'How each side gets its number',
      body: [
        'The local ladder starts with parallax, the apparent shift of a nearby star against background stars as the Earth moves around the Sun. That calibrates Cepheid variables, whose pulsation period is related to their luminosity. Cepheids in nearby galaxies calibrate Type Ia supernovae, which are bright enough to be seen far away. Each rung is checked against the one below it, and the current SH0ES analysis gives 73.0 ± 1.0 kilometres per second per megaparsec. The James Webb Space Telescope was used to re-measure the Cepheids in the same galaxies, specifically to rule out crowding and blending errors from Hubble; the number did not move much.',
        'The early-universe route starts with the cosmic microwave background. The positions and amplitudes of its temperature and polarisation fluctuations depend on the expansion rate, the density of matter, and the density of dark energy. Fitting the standard six-parameter model to the Planck data gives 67.4 ± 0.5. Independent early-universe probes agree with this value: baryon acoustic oscillations measured by galaxy surveys, and the abundance of light elements produced in Big Bang nucleosynthesis, both prefer a lower expansion rate than the local ladder.',
      ],
    },
    {
      kind: 'table',
      heading: 'Representative measurements, and what each assumes',
      columns: ['Probe', 'Value (km/s/Mpc)', 'Key assumption'],
      rows: [
        ['Planck CMB, ΛCDM fit', '67.4 ± 0.5', 'The standard six-parameter cosmological model is complete'],
        ['SH0ES Cepheid–supernova ladder', '73.0 ± 1.0', 'Cepheid period–luminosity calibration is accurate at the relevant metallicities'],
        ['Tip of the red giant branch', '≈ 70', 'A different stellar distance indicator; between the two, with its own systematics'],
        ['Baryon acoustic oscillations + CMB', '≈ 67–68', 'The sound horizon at recombination is correctly modelled'],
        ['Time-delay lensing', '≈ 73 (H0LiCOW)', 'The lens mass profile is modelled correctly'],
      ],
      note:
        'The pattern is not simply "early universe low, local high": some local indicators sit in between. That pattern is itself a clue, because it suggests the disagreement may depend on which rung of the ladder is being calibrated rather than on cosmology alone.',
    },
    {
      kind: 'math',
      heading: 'Hubble’s law, and why a slope is not a speed',
      equation: 'v = H₀ d',
      symbols: [
        { symbol: 'v', meaning: 'Recession velocity inferred from redshift', unit: 'km/s' },
        { symbol: 'H₀', meaning: 'The Hubble constant today', unit: 'km/s per Mpc' },
        { symbol: 'd', meaning: 'Proper distance to the galaxy', unit: 'megaparsecs' },
      ],
      body: [
        'The equation is linear, which is why the expansion looks like a uniform stretching rather than a explosion from a point. Every observer sees every other galaxy receding, with the speed proportional to distance, and there is no centre. The linearity is also why the measurement is hard: at small distances the recession velocity is small compared with peculiar velocities from local gravity, and at large distances the distance itself must be inferred from something else, which is where the ladder enters.',
        'A useful sanity check: H₀ = 70 km/s/Mpc corresponds to about 2.3 × 10⁻¹⁸ per second, or roughly one part in 4 × 10¹⁷ per second. The inverse, about 14 billion years, is the Hubble time, an estimate of the age of the universe. The fact that it is close to the actual age is not a coincidence; it is why the expansion rate and the age are two views of the same history.',
      ],
      assumptions: [
        'Redshift is dominated by cosmic expansion, not by peculiar velocities or gravitational redshift.',
        'The distance indicator is calibrated on objects whose physics is understood well enough to know their intrinsic brightness.',
        'The universe is homogeneous and isotropic on the scales being averaged, which is the cosmological principle.',
      ],
    },
    {
      kind: 'misconception',
      heading: 'Two ways to misread a tension',
      claim: '"The Hubble tension proves cosmology is broken and the Big Bang did not happen."',
      correction:
        'A nine per cent disagreement in one parameter does not invalidate a framework that predicts the abundances of light elements, the pattern of the microwave background, and the growth of galaxies. It points to an incomplete model or an unrecognised systematic, not to the absence of a hot early universe. The Big Bang is supported by independent evidence — the microwave background itself, nucleosynthesis, and the observed evolution of galaxies — none of which depends on which H₀ value is correct. A tension is a precise question, not a refutation.',
    },
    {
      kind: 'misconception',
      heading: 'And the other',
      claim: '"It is obviously a measurement error; the error bars will shrink and the numbers will meet."',
      correction:
        'That is possible, and it is what most cosmologists expected. But the gap has survived a decade of scrutiny: Planck reanalyses, new Cepheid calibrations, JWST re-measurements, tip-of-the-red-giant-branch distances, and independent lensing analyses. The local ladder could still contain a shared systematic — metallicity effects on Cepheids, or crowding in the photometry — but no such error has been demonstrated at the size needed. Calling it "obviously" an error is a prediction, not an argument.',
    },
    {
      kind: 'prose',
      heading: 'What would count as a resolution',
      body: [
        'On the measurement side, the decisive test is an independent local distance indicator that does not share the Cepheid systematics. Tip-of-the-red-giant-branch distances and J-region asymptotic giant branch stars are the leading alternatives; they currently land between the two values, which is either a clue or a sign that their own systematics are not under control. A geometric distance to a megamaser or a gravitational-wave standard siren would be stronger still, because it would bypass the ladder entirely.',
        'On the theory side, the candidates are early dark energy, extra relativistic species, a time-varying equation of state, and modifications of gravity. Each can raise the early-universe prediction toward 73 without changing the local measurement, and each has consequences elsewhere: the abundance of light elements, the growth of structure, the pattern of CMB polarisation. So far none fits all the data better than the standard model plus a systematic error. That is the honest state of the field: a real discrepancy, no confirmed cause, and a great deal of careful work on both sides.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If the local and early measurements disagree, which one is measuring "the" expansion rate?',
        'What would a gravitational-wave standard siren add that a Cepheid calibration cannot?',
        'Could the tension be a sign that the cosmological principle fails on the largest scales?',
        'Why is it so difficult to find a systematic that shifts the ladder by nine per cent without breaking anything else?',
      ],
    },
  ],
  sources: [
    { label: 'A. G. Riess et al., "A comprehensive measurement of the local value of the Hubble constant with 1 km/s/Mpc uncertainty from the Hubble Space Telescope and the SH0ES Team", ApJL 934, L7 (2022)', url: 'https://arxiv.org/abs/2112.04510' },
    { label: 'Planck Collaboration, "Planck 2018 results VI: cosmological parameters", A&A 641, A6 (2020)', url: 'https://arxiv.org/abs/1807.06209' },
    { label: 'E. Di Valentino et al., "In the realm of the Hubble tension: a review of solutions", Classical and Quantum Gravity 38, 153001 (2021)', url: 'https://arxiv.org/abs/2103.01183' },
    { label: 'W. L. Freedman, "Measurements of the Hubble constant: tensions in perspective", ApJ 919, 16 (2021)', url: 'https://arxiv.org/abs/2106.15656' },
  ],
  related: ['cosmological-constant', 'dark-matter', 'false-vacuum'],
};

export const DARK_MATTER_DOSSIER = {
  id: 'dark-matter',
  title: 'Dark Matter, and the Case Against It',
  standfirst:
    'Galaxies rotate too fast for their visible mass. The standard answer is a substance nobody has detected. The standard objection is that gravity itself might behave differently. Both are serious positions, and the evidence does not yet settle it.',
  field: 'Cosmology',
  lenses: ['Reality', 'Matter'],
  status: 'Dark matter is the leading model; modified gravity is not excluded on all scales',
  difficulty: 'Advanced',
  minutes: 26,
  opening:
    'In the 1970s Vera Rubin and Kent Ford measured the rotation curves of spiral galaxies and found that they stayed flat far beyond the visible disc. Newtonian gravity predicts that orbital speed should fall with distance once most of the mass is enclosed. The curves did not fall. Either there was more mass than the light showed, or the law of gravity was wrong on galactic scales. Forty years later, the missing mass has a name, a candidate list and no confirmed detection, while the alternative — modifying gravity — has survived every attempt to kill it but cannot explain everything.',
  sections: [
    {
      kind: 'prose',
      heading: 'The observation that started it',
      body: [
        'A rotation curve plots orbital speed against distance from a galaxy’s centre. For a spiral galaxy, the stars and gas in the disc orbit roughly together, and their Doppler shifts give the speed. If the mass were distributed like the light, the curve would rise steeply in the centre and fall as 1/√r outside the bright region. Instead it stays roughly flat, sometimes out to several times the visible radius. A flat curve implies that the enclosed mass grows linearly with radius, which means a mass density falling as 1/r² — a dark halo extending far beyond the stars.',
        'The same conclusion appears in galaxy clusters. Fritz Zwicky noticed in 1933 that the galaxies in the Coma Cluster were moving too fast for the cluster to be bound by its visible mass, and he called the missing component dunkle Materie, dark matter. Cluster masses measured by gravitational lensing and by X-ray gas temperatures agree with the dynamical estimate. The dark component is not a small correction; it is roughly five times the mass of the ordinary matter.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of the missing mass',
      items: [
        {
          term: 'Rotation curve',
          definition:
            'A plot of orbital speed against radius for a galaxy. Its shape measures the mass distribution, because orbital speed depends on the mass enclosed.',
        },
        {
          term: 'Gravitational lensing',
          definition:
            'The bending of light by mass. It measures the total mass along the line of sight, whether or not that mass emits light, which makes it the cleanest probe of dark matter.',
        },
        {
          term: 'Dark matter',
          definition:
            'A hypothetical component of matter that interacts gravitationally but not, or only very weakly, with light. It is inferred from its gravity, not observed directly.',
        },
        {
          term: 'MOND',
          definition:
            'Modified Newtonian Dynamics, proposed by Milgrom in 1983: below a small acceleration threshold, gravity is stronger than Newton predicts. It fits many galaxy rotation curves without dark matter.',
        },
        {
          term: 'Baryon acoustic oscillations',
          definition:
            'A preferred scale in galaxy clustering left by sound waves in the early universe. It constrains the total matter density, including the dark component, independently of galaxies.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'The evidence that does not depend on a single galaxy',
      body: [
        'The strongest arguments for dark matter are cosmological rather than galactic. The cosmic microwave background has acoustic peaks whose relative heights depend on the ratio of baryons to total matter. Fit the peaks and you get a total matter density about five times the baryon density; the same fit predicts the observed pattern of galaxy clustering. Big Bang nucleosynthesis independently fixes the baryon density from the abundances of deuterium and helium, and it agrees with the baryon fraction inferred from the microwave background. So the ordinary matter budget is known, and it is not enough to explain the gravity.',
        'The Bullet Cluster is the most cited local example. Two galaxy clusters have collided, and the X-ray gas — most of the ordinary mass — has been shocked and slowed in the middle, while the gravitational lensing mass has passed through on either side. That separation is hard to explain if the only mass is the gas. MOND can fit the cluster with additional unseen mass, but it cannot fit it without any. That is the recurring pattern: modified gravity describes galaxies beautifully and struggles with clusters and the microwave background.',
      ],
    },
    {
      kind: 'math',
      heading: 'Why a flat rotation curve implies a halo',
      equation: 'v(r) = √(G M(r) / r)',
      symbols: [
        { symbol: 'v(r)', meaning: 'Orbital speed at radius r', unit: 'km/s' },
        { symbol: 'G', meaning: 'Newton’s gravitational constant', unit: 'm³/(kg·s²)' },
        { symbol: 'M(r)', meaning: 'Mass enclosed within radius r', unit: 'solar masses' },
        { symbol: 'r', meaning: 'Distance from the galaxy centre', unit: 'kiloparsecs' },
      ],
      body: [
        'The equation is Newtonian: circular motion requires a centripetal acceleration supplied by gravity. If v is constant, then M(r)/r is constant, so M(r) grows linearly with r. A mass that grows linearly inside radius r corresponds to a density falling as 1/r², which is exactly the profile of an isothermal dark halo. That is why the flat curve is such a direct argument: it does not depend on a particular model of galaxy formation, only on Newton and the observed speed.',
        'The same equation shows where MOND enters. Milgrom noticed that the discrepancy appears when the gravitational acceleration falls below about 1.2 × 10⁻¹⁰ metres per second squared, a value suspiciously close to cH₀. Below that scale, MOND replaces the inverse-square law with a different force law that produces flat curves automatically. The coincidence with cH₀ is either a deep clue or a coincidence, and nobody knows which.',
      ],
      assumptions: [
        'The galaxy is in dynamical equilibrium, so the measured velocities reflect the gravitational potential rather than a recent collision.',
        'The gas and stars trace the same potential, so their rotation speeds can be combined into one curve.',
        'The mass is approximately spherically distributed on the scales being probed; a disc changes the details but not the flat-curve conclusion.',
      ],
    },
    {
      kind: 'table',
      heading: 'What each hypothesis explains, and what it does not',
      columns: ['Evidence', 'Dark matter', 'MOND'],
      rows: [
        ['Flat galaxy rotation curves', 'Fits with a halo of the right mass', 'Fits with a modified force law, often with fewer parameters'],
        ['Cluster mass from lensing and X-rays', 'Fits', 'Needs additional dark mass; does not replace it entirely'],
        ['Bullet Cluster separation of gas and mass', 'Natural: collisionless dark matter passes through', 'Difficult: requires unseen mass in the clusters'],
        ['CMB acoustic peaks', 'Fits the standard six-parameter model', 'Requires a relativistic extension and still struggles with the third peak'],
        ['Galaxy formation and structure growth', 'Fits simulations of hierarchical structure', 'Requires additional ingredients to match large-scale structure'],
      ],
      note:
        'The table is not a scorecard with a winner. It shows a pattern: dark matter is a better fit to cosmology, MOND is a better fit to individual galaxies, and the two are not measuring the same regime.',
    },
    {
      kind: 'misconception',
      heading: 'What "dark matter" does not mean',
      claim: '"Dark matter is a made-up substance invented to rescue a failing theory."',
      correction:
        'It is a hypothesis with a precise job: supply the gravity that the visible mass does not. The job is defined by measurements — rotation curves, lensing, cluster dynamics, the microwave background — that predate any particular candidate. What is made up is not the requirement but the particle: WIMPs, axions, sterile neutrinos and primordial black holes are candidate explanations, and decades of direct-detection experiments have found nothing conclusive. It is entirely possible that the requirement is real and the particle is something nobody has proposed. "We do not know what it is" is not the same as "it is not there".',
    },
    {
      kind: 'prose',
      heading: 'Where the search stands',
      body: [
        'Direct detection experiments look for a dark matter particle scattering off a nucleus in a shielded detector. The strongest limits now exclude ordinary WIMPs over a wide mass range, which has pushed the field toward lighter candidates: axions, hidden-sector particles, and ultralight fields. Axion haloscopes have improved by orders of magnitude, and a detection would be unmistakable because the signal would depend on the Earth’s motion through the galaxy.',
        'Modified gravity has meanwhile become more sophisticated. Relativistic extensions such as TeVeS are constrained by gravitational-wave speed measurements and by cluster data, and the simplest versions are in trouble. A pragmatic position, held by some working cosmologists, is that dark matter is the effective description on cosmological scales while MOND captures something real about galaxy dynamics that a dark-matter-only model has not yet reproduced. That is not a comfortable position, but it is an honest one.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If dark matter exists, why has no experiment detected it in forty years?',
        'Why does MOND’s acceleration threshold sit so close to cH₀?',
        'Could the answer be a modification of gravity that mimics dark matter on large scales and departs from it on small ones?',
        'What observation would make you abandon dark matter, and what would make you abandon MOND?',
      ],
    },
  ],
  sources: [
    { label: 'V. C. Rubin and W. K. Ford, "Rotation of the Andromeda nebula from a spectroscopic survey of emission regions", ApJ 159, 379 (1970)', url: 'https://doi.org/10.1086/150317' },
    { label: 'M. Milgrom, "A modification of the Newtonian dynamics as a possible alternative to the hidden mass hypothesis", ApJ 270, 365 (1983)', url: 'https://doi.org/10.1086/161130' },
    { label: 'D. Clowe et al., "A direct empirical proof of the existence of dark matter", ApJL 648, L109 (2006)', url: 'https://arxiv.org/abs/astro-ph/0608407' },
    { label: 'Planck Collaboration, "Planck 2018 results VI: cosmological parameters", A&A 641, A6 (2020)', url: 'https://arxiv.org/abs/1807.06209' },
    { label: 'S. McGaugh, F. Lelli, J. Schombert, "Radial acceleration relation in rotationally supported galaxies", PRL 117, 201101 (2016)', url: 'https://arxiv.org/abs/1609.05917' },
  ],
  related: ['hubble-tension', 'cosmological-constant', 'spin-ice'],
};

export const COSMOLOGICAL_CONSTANT_DOSSIER = {
  id: 'cosmological-constant',
  title: 'The Worst Prediction in Physics',
  standfirst:
    'The energy of empty space should be enormous. Measurement says it is tiny but not zero. The mismatch is about 120 orders of magnitude, and it is the clearest sign that gravity and quantum field theory have not been reconciled.',
  field: 'Cosmology',
  lenses: ['Reality', 'Infinity'],
  status: 'Measured dark energy; the origin of its value is unsolved',
  difficulty: 'Advanced',
  minutes: 24,
  opening:
    'In 1998 two supernova teams reported that distant supernovae were dimmer than expected, which meant the expansion of the universe was accelerating rather than slowing. The simplest explanation was a cosmological constant: an energy density intrinsic to space itself. The measurement has been confirmed many times. The problem is that nobody can calculate the value. Quantum field theory predicts a vacuum energy density about 10¹²⁰ times larger than the observed dark energy density, a discrepancy often called the worst prediction in the history of physics.',
  sections: [
    {
      kind: 'prose',
      heading: 'What a cosmological constant is',
      body: [
        'Einstein introduced the cosmological constant in 1917 as a term in his field equations that could hold a static universe open against gravity. When Hubble showed the universe is expanding, the term became unnecessary, and Einstein reportedly called it his greatest blunder — a remark that may be apocryphal and is in any case unfair, since the term is now essential. In modern language, Λ is an energy density of the vacuum: a constant energy per unit volume that does not dilute as the universe expands.',
        'That last property is what makes it cosmologically important. Matter density falls as the universe expands; radiation falls faster. A constant vacuum energy does not fall at all, so even a tiny value eventually dominates. The observed dark energy density is about 6 × 10⁻¹⁰ joules per cubic metre, which corresponds to about 10⁻²⁶ kilograms per cubic metre — roughly six protons’ worth of mass per cubic metre, spread through the entire universe. It is small, but it is not zero, and it is now about 68 per cent of the total energy budget.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of the problem',
      items: [
        {
          term: 'Dark energy',
          definition:
            'The unknown component that drives the accelerated expansion of the universe. It is inferred from the expansion history, not observed directly.',
        },
        {
          term: 'Cosmological constant',
          definition:
            'A constant energy density associated with space itself, written Λ. It is the simplest model of dark energy and the one most data are fitted to.',
        },
        {
          term: 'Equation of state',
          definition:
            'The relation between pressure and energy density, written w = p/ρ. A cosmological constant has w = −1; other dark energy models have different, possibly time-varying values.',
        },
        {
          term: 'Fine-tuning',
          definition:
            'A situation in which a parameter must take an improbably precise value for the observed outcome to occur. The smallness of the vacuum energy is the canonical example.',
        },
        {
          term: 'Quintessence',
          definition:
            'A dynamical dark energy model in which a scalar field evolves over cosmic time, so the equation of state changes instead of staying at −1.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'The energy density of the vacuum',
      equation: 'ρ_Λ = Λ c² / (8πG)',
      symbols: [
        { symbol: 'ρ_Λ', meaning: 'Energy density of the cosmological constant', unit: 'J/m³' },
        { symbol: 'Λ', meaning: 'The cosmological constant, with units of inverse length squared', unit: 'm⁻²' },
        { symbol: 'c', meaning: 'Speed of light', unit: 'm/s' },
        { symbol: 'G', meaning: 'Newton’s gravitational constant', unit: 'm³/(kg·s²)' },
        { symbol: '8π', meaning: 'The geometric factor from Einstein’s field equations, fixed by the Newtonian limit' },
      ],
      body: [
        'The equation converts the geometric constant Λ into an energy density. The observed value is Λ ≈ 1.1 × 10⁻⁵² m⁻², which gives ρ_Λ ≈ 6 × 10⁻¹⁰ J/m³. That is a real number, measured from the expansion history, and it is not in dispute. The dispute is why it has that value.',
        'The quantum field theory estimate is different in kind. Each mode of a quantum field contributes a zero-point energy of ½ħω, and summing over all modes up to some cutoff gives an energy density that diverges. If the cutoff is the Planck scale, the natural estimate is around 10¹¹³ J/m³. The ratio to the observed value is about 10¹²⁰. Even cutting the calculation off at the electroweak scale leaves a discrepancy of more than fifty orders of magnitude. Cancelling the terms to the required precision would need a fine-tuning of one part in 10¹²⁰, which is the fine-tuning problem in its starkest form.',
      ],
      assumptions: [
        'The cosmological constant is exactly constant; if dark energy evolves, the conversion between Λ and ρ is only approximate at a given epoch.',
        'The quantum field theory estimate uses a cutoff, and the choice of cutoff is itself an assumption; different choices change the number but not the order-of-magnitude problem.',
        'Gravity is described by general relativity on cosmological scales, with no modification that would absorb the vacuum energy.',
      ],
    },
    {
      kind: 'table',
      heading: 'How the acceleration was established',
      columns: ['Observation', 'Year', 'What it showed'],
      rows: [
        ['Type Ia supernovae at high redshift', '1998', 'Distant supernovae are dimmer than a decelerating universe predicts'],
        ['CMB acoustic peaks', '2000s', 'The geometry of the universe is close to flat, requiring dark energy to match the total density'],
        ['Baryon acoustic oscillations', '2005 onward', 'The expansion history is consistent with ΛCDM over a wide redshift range'],
        ['DESI galaxy survey', '2024–25', 'Hints that w may evolve with time; significance is debated and not yet decisive'],
      ],
      note:
        'The first row established the phenomenon; the later rows test the model. The DESI hints are the most interesting current development, because a time-varying w would make the cosmological constant an approximation rather than a constant.',
    },
    {
      kind: 'misconception',
      heading: 'The blunder story',
      claim: '"Einstein called the cosmological constant his biggest blunder, so he was wrong to introduce it."',
      correction:
        'The quote is reported, not documented in Einstein’s own hand, and it is usually torn from context. Einstein introduced Λ to allow a static universe, which was the prevailing assumption in 1917 and not unreasonable before Hubble’s 1929 result. The term itself is now the leading description of dark energy. If Einstein had not introduced it, the discovery of accelerated expansion would have required inventing the same term. The story is a useful anecdote about how assumptions shape equations, not evidence that the constant was a mistake.',
    },
    {
      kind: 'prose',
      heading: 'The candidate responses',
      body: [
        'One response is anthropic. If the vacuum energy can take different values in different regions of a multiverse, observers will necessarily find themselves in a region where it is small enough for galaxies to form. The argument is not a calculation of the value, and it is disliked by many physicists because it seems to give up on explaining the number. It is also difficult to falsify, which is a serious objection rather than a knockdown.',
        'Another is that the vacuum energy is cancelled by a symmetry or a dynamical mechanism. Supersymmetry would cancel bosonic and fermionic contributions, but supersymmetry is broken in our universe and no known mechanism cancels the remainder to the required precision. Sequestering models try to decouple the vacuum energy from gravity; they are ingenious and unconfirmed. A third possibility is that general relativity itself is modified on cosmological scales, so that the accelerated expansion is not a vacuum energy at all. The data so far are consistent with a cosmological constant, and the honest position is that the problem is open.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'Is a number that requires fine-tuning of one part in 10¹²⁰ a problem with the theory or a problem with our expectations?',
        'If dark energy evolves, what would that mean for the cosmological constant?',
        'Can an anthropic argument ever be tested, or is it a boundary of physics rather than a theory?',
        'Why does the vacuum energy gravitate at all, if only differences in energy are measurable in ordinary physics?',
      ],
    },
  ],
  sources: [
    { label: 'A. G. Riess et al., "Observational evidence from supernovae for an accelerating universe and a cosmological constant", AJ 116, 1009 (1998)', url: 'https://arxiv.org/abs/astro-ph/9805201' },
    { label: 'S. Perlmutter et al., "Measurements of Ω and Λ from 42 high-redshift supernovae", ApJ 517, 565 (1999)', url: 'https://arxiv.org/abs/astro-ph/9812133' },
    { label: 'S. Weinberg, "The cosmological constant problem", Reviews of Modern Physics 61, 1 (1989)', url: 'https://doi.org/10.1103/RevModPhys.61.1' },
    { label: 'DESI Collaboration, "DESI 2024 VI: cosmological constraints from the measurements of baryon acoustic oscillations", JCAP (2025)', url: 'https://arxiv.org/abs/2404.03002' },
  ],
  related: ['hubble-tension', 'false-vacuum', 'arrow-of-time'],
};

export const COSMOLOGY_DOSSIERS = [
  HUBBLE_TENSION_DOSSIER,
  DARK_MATTER_DOSSIER,
  COSMOLOGICAL_CONSTANT_DOSSIER,
];
