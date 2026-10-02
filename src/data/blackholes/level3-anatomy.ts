import { BlackHoleLevel } from './schema';

/**
 * Level 3: what the parts are called, and which solutions describe them.
 *
 * Order matters here more than anywhere else in the subject. The exact solution
 * comes first because everything after it is a modification of it, then the
 * features of a spinning one, then the region outside the horizon where the
 * matter you can actually see is.
 */

/**
 * Radii in units of the Schwarzschild radius (r_s = 2GM/c^2), which is how all
 * of these are written in the literature and therefore in this level.
 *
 *   horizon        1        the point of no return
 *   photon sphere  1.5      light can orbit here
 *   ISCO           3        closest stable circular orbit, non-spinning
 *
 * A spinning black hole moves the photon sphere in to 1 and the ISCO out to 1,
 * so a near-maximally-spinning one has an accretion disk sitting very close to
 * the horizon. That is not a detail: it is why the inner disk temperature goes
 * as high as it does, which is why supermassive black holes make the brightest
 * objects in the universe.
 */
const LEVEL_3: BlackHoleLevel = {
  id: 'anatomy',
  number: 3,
  title: 'Anatomy and types',
  blurb: 'Schwarzschild and Kerr, ergosphere, photon sphere, ISCO, disks, coronae and jets.',
  intro:
    'A black hole has no surface, so "what is it made of" has an unusual answer: almost nothing is inside, and almost everything interesting is outside. This level works outward from the centre, describing the three exact solutions that general relativity permits, and then the layers of gas, light and plasma around the event horizon that are the only reason we can see these objects at all.',
  entries: [
    {
      id: 'schwarzschild',
      name: 'Schwarzschild: the non-rotating, uncharged case',
      simple:
        'The simplest real black hole. Not spinning, not electrically charged. Every textbook picture of a black hole is this one.',
      deeper:
        'Karl Schwarzschild found this solution in 1916, months after Einstein published general relativity, and it came out of solving the equations for a point mass with no spin and no charge. It is the only case with a spherically symmetric shape, which matters practically: any other black hole, being lumpy, will have radiated away its lumpiness by spinning or radiating gravitational waves until it settled down. This is called the no-hair theorem, and its consequence is stark. Once a black hole has settled, the only things an external observer can measure are its mass, its charge and its spin. Nothing else survives. Two black holes with the same three numbers are indistinguishable, so an isolated non-rotating black hole really is just mass in a place.',
      matters:
        'It is the baseline every measurement is compared against, and the fact that it is so featureless is itself the surprising result. It also means the rotation we do see has to be maintained somehow, since a black hole left alone loses it.',
      status: 'established',
      source: 'Schwarzschild, On the Gravitational Field of a Mass Point (1916); no-hair results by Israel, Carter and Robinson',
      sourceUrl: 'https://en.wikipedia.org/wiki/Schwarzschild_metric',
    },
    {
      id: 'kerr',
      name: 'Kerr: the rotating case',
      simple:
        'The real version. Nearly every black hole in nature is spinning, and being spinning changes the geometry around it considerably.',
      deeper:
        'Roy Kerr found the solution for a spinning, uncharged black hole in 1963, and it is what a real collapsing star produces, because the star was rotating and its core could not stop. A Kerr black hole is not round. It is flattened at the poles, like Earth, and it drags space around with it, so the geometry is different everywhere and not even spherically symmetric. It also cannot have an event horizon of a single radius. There is an outer horizon and an inner one, and in between lies a region called the ergosphere where the rotation is so strong that nothing can stay still. Rotate a black hole as fast as it will go and the outer horizon nearly touches the inner one. Push past that limit and, according to the mathematics, there is no horizon at all and the object stops being a black hole. That limit is not known to be reachable by any realistic process, so it sits in the same category as the singularity: something the equations permit that nothing has been observed to do.',
      matters:
        'It is why the exact solution matters. An accretion disk can sit far closer to a spinning black hole than to a non-rotating one, which pushes the inner disk much hotter, which is how supermassive black holes reach the brightest luminosity anything in the universe can produce. The 2022 image of Sagittarius A* was in fact better explained by a rotating black hole than by a non-rotating one.',
      status: 'established',
      source: 'Kerr, Gravitational Field of a Spinning Mass as an Example of Algebraically Special Metrics (1963); Sgr A* spin preference from the EHT, ApJL 930 L12 (2022)',
      sourceUrl: 'https://arxiv.org/abs/2311.08680',
    },
    {
      id: 'charged-variants',
      name: 'The charged variants, and why you will not meet one',
      simple:
        'General relativity also permits a charged black hole, described by two different solutions. Neither is thought to exist in nature.',
      deeper:
        'The Reissner-Nordstrom solution describes a charged, non-rotating black hole, and Kerr-Newman a charged, rotating one. They have something the others do not: two horizons rather than one, so the geometry can be extended through the outer horizon and the inner region is not simply a dead end in the mathematical description. That sounds appealing and is part of why the problem in Level 6 is so awkward. The problem for the universe is more mundane. Charge does not last. A black hole picks up charge from matter falling in, and the moment it has any charge at all, the electric field discharges it into the surroundings on a short timescale. Since the universe is full of plasma, a charged black hole would be neutralised almost immediately. The two solutions are exactly right and almost certainly empty.',
      matters:
        'It is a clean example of a prediction being simultaneously mathematically sound and physically irrelevant. It also matters for Level 6: the charged solutions do not evaporate the way the uncharged ones do, which is part of why the information problem looks different depending on whether you allow the charge.',
      status: 'theoretical',
      source: 'Reissner-Nordstrom (1916) and Kerr-Newman (1965) solutions; the neutralisation argument is standard',
      sourceUrl: 'https://en.wikipedia.org/wiki/Reissner%E2%80%93Nordstr%C3%B6m_metric',
    },
    {
      id: 'ergosphere',
      name: 'Ergosphere',
      simple:
        'The region around a spinning black hole where its rotation drags everything with it. Nothing can stay still inside it.',
      deeper:
        'Outside the horizon but inside the ergosphere, the {{frame dragging}} is so strong that every possible path takes you around with the black hole. You cannot hover. You cannot hold still. This has a consequence that sounds like a free lunch and is not: inside the ergosphere the black hole\'s rotation forces all particles to co-rotate, so a particle that appears to move backwards from far away is, in effect, extracting rotational energy from the black hole. That is the {{Penrose process}}, and it is the basis of the most speculative part of Level 6. In practice the amount available this way is small unless the black hole is already spinning very fast, and matter in the ergosphere usually just spirals in rather than being arranged to extract anything.',
      matters:
        'It shows that a spinning black hole is a rotating energy source rather than an inert object, which turns a dead thing into a mildly active one. It is also the clearest example of general relativity making something Newtonian physics says is impossible.',
      status: 'established',
      source: 'Standard Kerr geometry; the Penrose process is Penrose (1969)',
      sourceUrl: 'https://en.wikipedia.org/wiki/Ergosphere',
    },
    {
      id: 'photon-sphere',
      name: 'Photon sphere',
      simple:
        'A shell at 1.5 times the horizon radius where light can orbit the black hole in a perfect circle without falling in.',
      deeper:
        'At exactly 1.5 Schwarzschild radii for a non-rotating black hole, light can orbit indefinitely. It is a knife edge. Light emitted slightly further in spirals away and crosses the horizon; light emitted slightly further out escapes. Because the band that circles is so narrow, light that passes near is bent through a large angle, which is what produces the bright ring in the images of M87* and Sagittarius A*. Some of that ring is light from the accretion disk bent round the back. Some is light from the near side bent round the front. Some is photons that passed close and orbited part of the way before escaping. For a spinning black hole the photon sphere moves inward, down towards the horizon. It is worth noticing that the photon sphere is not the horizon. It is a separate surface outside it, and light can be in the region between them.',
      matters:
        'It is why the EHT images show a ring rather than a plain dark disc, and it is a purely general-relativity prediction with no Newtonian equivalent. Measuring a ring of the right size and shape is one of the strongest tests of the theory at the smallest scale available.',
      status: 'established',
      source: 'Photon orbit at r = 3GM/c^2 = 1.5 r_s is standard; the ring structure is measured in EHT ApJL 875 L1 (M87) and 930 L12 (Sgr A*)',
      sourceUrl: 'https://arxiv.org/abs/1906.11238',
    },
    {
      id: 'isco',
      name: 'The innermost stable orbit',
      simple:
        'The closest an orbiting disk of gas can get before it spirals in. For a still black hole that is three times the horizon radius.',
      deeper:
        'An orbit at 1.5 horizon radii, the photon sphere, is where light can circle, but matter cannot: at that distance the gravitational field is shearing so hard that any small disturbance sends an orbiting object spiralling in, so no circular orbit there is stable. The {{isco}} is the innermost orbit that is genuinely stable. For a non-rotating black hole it sits at 3 Schwarzschild radii, or 6GM/c^2. A rotating black hole changes this substantially: with maximum spin the stable orbit comes inward to barely above the horizon, a distance roughly equal to the horizon itself rather than three times it, so a spinning black hole allows its disk to sit far closer in.',
      matters:
        'Because the disk can sit at 1.5 horizon radii for a non-rotating black hole but comes down to about 1 for a maximally spinning one, the same mass of gas ends up in a much more strongly curved region and gets far hotter. That single geometric fact is the main reason supermassive black holes can outshine entire galaxies.',
      status: 'established',
      source: 'ISCO at r = 6GM/c^2 (Schwarzschild) and r ~ GM/c^2 (extremal Kerr) is standard',
      sourceUrl: 'https://en.wikipedia.org/wiki/Innermost_stable_circular_orbit',
    },
    {
      id: 'accretion-disk',
      name: 'Accretion disk',
      simple:
        'A whirl of gas spiralling in towards the black hole. Friction heats it until it is one of the brightest things in the universe.',
      deeper:
        'Gas does not arrive in a straight line. It carries angular momentum, and angular momentum has to go somewhere, so the gas flattens into a disk and rotates. As neighbouring rings rub against each other, the gas loses energy to that friction and heats up. Close in, where the gravity is strongest and the orbital speeds fastest, the heating is extreme: for a supermassive black hole the innermost disk reaches millions of degrees. The disk cannot sit still either, because inside the innermost stable orbit everything spirals in and heats as it goes. That is what makes a black hole an engine rather than a sink. It has no fuel of its own, and every photon attributed to it is from gas that fell in from somewhere else.',
      matters:
        'It is the reason black holes are visible at all. A black hole emits nothing. It also means being active is a temporary condition: when the gas supply stops, the disk drains in and the object goes quiet, which is why dormant and active black holes coexist in the same galaxy.',
      status: 'established',
      source: 'Standard accretion disc theory; inner disc temperatures of order 10^7 K for supermassive black holes',
      sourceUrl: 'https://en.wikipedia.org/wiki/Accretion_disc',
    },
    {
      id: 'corona',
      name: 'Corona',
      simple:
        'A hot, faint region of plasma above the accretion disk, held up by magnetic fields. It is where the X-rays come from.',
      deeper:
        'The disk glows in ultraviolet light. The X-rays come from somewhere else: a region above it, reaching millions of degrees, that is nearly transparent and enormously extended, threaded and shaped by magnetic fields running through the disk. Its exact size is not something anyone has pinned down. It was needed because the X-ray spectrum of an active black hole requires emission from a region far hotter than any disk, and no disk model produced it. It is also the part of the system most relevant to observation, because the corona is what an X-ray telescope actually sees: both the disk and the horizon sit behind it.',
      matters:
        'It separates the object from its signature. The corona is part of the environment rather than the black hole, so the most detailed data we have on any black hole is data about the gas around it. That is a limit on what is observable, not a temporary inconvenience.',
      status: 'established',
      source: 'The corona is required by X-ray spectra and is standard in the accretion literature; its extent remains genuinely uncertain',
      sourceUrl: 'https://en.wikipedia.org/wiki/Accretion_disc',
    },
    {
      id: 'jets',
      name: 'Jets',
      simple:
        'Narrow beams of plasma fired out at near the speed of light from near the black hole, often far beyond the galaxy that holds it.',
      deeper:
        'Something that looks like a firehose has to be launched from somewhere specific, and the only region where the physics is extreme enough is just outside the event horizon, where the black hole\'s spin is extracting energy from the space around it. The details are genuinely unresolved. The leading idea is that magnetic fields threading the disk get wound up by the rotation and accelerate plasma along their length. NASA\'s own description is careful about this: how the jets fire is not fully understood. What is observed is unambiguous even where the mechanism is not. Jets reach near the speed of light, and supermassive black hole jets extend hundreds of thousands of light-years, well past the edge of their own galaxy. When one points at us, {{Doppler beaming}} makes the near jet look far brighter than the far one, which is why we often only see one.',
      matters:
        'It turns a black hole into something that shapes its surroundings far beyond itself, enough to ionise gas and affect star formation across a whole galaxy. It is also the clearest standing reminder that knowing what something is made of is not the same as knowing how it works.',
      status: 'contested',
      source: 'The jets are observed; the launching mechanism is not settled. NASA black hole anatomy pages on coronae and jets',
      sourceUrl: 'https://science.nasa.gov/universe/black-holes/anatomy/',
    },
  ],
};

export default LEVEL_3;