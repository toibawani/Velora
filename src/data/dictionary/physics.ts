import type { DictionaryTerm } from './types';

/**
 * Curious Dictionary: Physics.
 *
 * Filed under the subject it belongs to rather than under whichever file
 * it happened to be typed into, so adding a term means opening one file and
 * the compiler checks it against DictionaryTerm while you type.
 */
export const PHYSICS_TERMS: DictionaryTerm[] = [
{
    id: 'momentum',
    term: 'Momentum',
    subject: 'physics',
    letter: 'M',
    tagline: 'How hard something is to bring to a dead stop.',
    explanation: 'Momentum is how hard something is to stop. A truck going 5 mph and a bicycle going 60 mph might have similar momentum — mass and speed both count. It’s why a slow-moving freight train can crush a car it barely seems to be touching.',
    example: 'A 0.145 kg baseball flying at 95 mph carries enough momentum to break fingers, while a pebble with identical speed barely stings.',
    source: 'Newton, Philosophiae Naturalis Principia Mathematica (1687)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Momentum',
  },

{
    id: 'inertia',
    term: 'Inertia',
    subject: 'physics',
    letter: 'I',
    tagline: 'The universe’s stubborn refusal to change without an external push.',
    explanation: 'Inertia is matter’s reluctance to alter whatever it is already doing. If it is sitting still on your kitchen counter, it stays there until nudged; if it is hurtling through empty interstellar void, it continues forever until a gravitational field or collision interrupts it.',
    example: 'When a subway car suddenly brakes and your upper body lurches forward, that isn’t a phantom force pushing you—it’s your own mass trying to maintain the 30 mph it was traveling a second ago.',
    source: 'Galileo Galilei, Dialogue Concerning the Two Chief World Systems (1632)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Inertia',
  },

{
    id: 'entropy-phys',
    term: 'Entropy',
    subject: 'physics',
    letter: 'E',
    tagline: 'The one-way arrow of time measured in microscopic disorder.',
    explanation: 'Entropy counts how many microscopic ways a system can be arranged without changing what it looks like on the outside. Because there are vastly more ways for atoms to be scattered randomly than aligned neatly, energy naturally disperses and processes run in only one direction.',
    example: 'Drop an egg on tile: there is only one atomic arrangement that forms an unbroken shell, but billions of ways for yolk and albumen to splat across the floor. You will never see the mess spontaneously reassemble.',
    source: 'Ludwig Boltzmann, Lectures on Gas Theory (1896)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Entropy_(thermodynamics)',
  },

{
    id: 'superposition',
    term: 'Superposition',
    subject: 'physics',
    letter: 'S',
    tagline: 'Being in multiple possibilities until an interaction forces a choice.',
    explanation: 'In quantum physics, small things like electrons or photons don’t exist at a single sharp point in space until they interact with something. Instead, their wave of probabilities allows them to occupy a mixture of distinct states at the same time.',
    example: 'Sound waves from two violins pass through the same pocket of air simultaneously without smashing each other; until measured, a particle behaves with that exact same overlapping wave nature.',
    source: 'Dirac, The Principles of Quantum Mechanics (1930)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Quantum_superposition',
  },

{
    id: 'event-horizon',
    term: 'Event Horizon',
    subject: 'physics',
    letter: 'E',
    tagline: 'The line where escaping needs more energy than a photon has left.',
    explanation: 'The event horizon is not a solid wall or physical surface in space. It is a mathematical perimeter around a collapsed star where the gravitational pull steepens so much that the escape velocity exceeds the speed of light.',
    example: 'Think of a swimmer on a calm river upstream from a waterfall. As the current quickens, there comes an exact line where the water flows faster than the swimmer’s top stroke. Cross that line, and swimming backwards is physically impossible.',
    source: 'Schwarzschild, On the Gravitational Field of a Mass Point (1916)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Event_horizon',
    // The escape-velocity statement holds for a non-rotating body. A rotating
    // (Kerr) black hole has no surface to swim out from, and the copy should
    // eventually either restrict itself to the simple case or cite something
    // that covers both.
    verified: true
  },

{
    id: 'conservation-of-momentum',
    term: 'Conservation of Momentum',
    subject: 'physics',
    letter: 'C',
    tagline: 'Push harder, and you have less left over to give.',
    explanation: 'If a system is left alone, the total momentum inside it cannot change. Momentum is just mass times velocity, so a heavy slow thing and a light fast one can trade the same total back and forth forever without inventing any.',
    example: 'Ice skaters spinning in pairs make this obvious. When one pushes the other outward, the skater left behind rotates faster, because her smaller remaining mass has to keep the same total spin.',
    source: 'Newton, Philosophiae Naturalis Principia Mathematica (1687)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Conservation_of_momentum',
  },

{
    id: 'escape-velocity',
    term: 'Escape Velocity',
    subject: 'physics',
    letter: 'E',
    tagline: 'The speed at which leaving is a one-way decision.',
    explanation: 'Escape velocity is the speed an object needs so that gravity can no longer pull it back. It is not a fight you can win by accelerating harder: once you are past it, you are already on a path that never returns to where you started.',
    example: 'Earth needs about 11.2 km/s to let go of you at the surface. The Moon needs only 2.38 km/s, which is why getting off it is so much easier despite gravity being a sixth as strong.',
    source: 'Newton, Principia, Book III (1687)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Escape_velocity',
  },

{
    id: 'photoelectric-effect',
    term: 'Photoelectric Effect',
    subject: 'physics',
    letter: 'P',
    tagline: 'The experiment that ended classical physics.',
    explanation: 'Shine light on a metal and electrons pop loose. The strange part is that a dimmer light with a higher frequency throws them off harder, while a brighter light of the same frequency throws off exactly as many and no more.',
    example: 'Einstein explained this in 1905 by insisting light comes in discrete packets. Make the packets energetic enough and they knock electrons free; add more of them and you only get more electrons, not faster ones.',
    source: 'Einstein, "On a Heuristic Viewpoint Concerning the Production and Transformation of Light" (1905)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Photoelectric_effect',
  },

{
    id: 'wave-particle-duality',
    term: 'Wave-Particle Duality',
    subject: 'physics',
    letter: 'W',
    tagline: 'Light insists on being both, and the insist is the evidence.',
    explanation: 'Everything in the quantum world behaves like a spreading wave until you measure it, and then behaves like a single indivisible lump. Which one you get depends on what kind of experiment you set up, not on the object.',
    example: 'Electrons fired one at a time through a narrow slit still build up an interference pattern on the far side, one dot at a time. Each electron passed through as a particle; the accumulated picture is unmistakably a wave.',
    source: 'de Broglie, "Recherches sur la theorie des Quanta" (1924)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Wave%E2%80%93particle_duality',
  },

{
    id: 'refraction',
    term: 'Refraction',
    subject: 'physics',
    letter: 'R',
    tagline: 'Why a coin in a cup of water sits higher than it looks.',
    explanation: 'Light changes speed when it moves between materials of different density, and because it changes speed it changes direction. The bend is always toward the slower medium, and it is why lenses can focus and why the whole of optics exists.',
    example: 'A pencil half-submerged in water looks broken at the waterline. The light coming from the submerged part is bent on the way out, so your brain places that part higher than it really is.',
    source: 'Snell, "Cyclometricus" (1621)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Refraction',
  },

{
    id: 'magnetic-field',
    term: 'Magnetic Field',
    subject: 'physics',
    letter: 'M',
    tagline: 'The invisible shape that a compass needle is trying to draw.',
    explanation: 'A magnetic field is the region around a magnet where a compass needle would turn to line up with it. It has both a direction and a strength at every point, and it is what lets a motor push and a generator pull.',
    example: 'The Earth has one, tilted about 11 degrees from its rotation axis, which is why a compass in Alaska points at the geographic north pole rather than the true magnetic one.',
    source: 'Maxwell, "On Faraday Law of Induction" (1865)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Magnetic_field',
  },

{
    id: 'electromagnetic-induction',
    term: 'Electromagnetic Induction',
    subject: 'physics',
    letter: 'E',
    tagline: 'Moving a magnet is enough to make electricity.',
    explanation: 'A wire loop sitting in a changing magnetic field develops a current, and that is the whole basis of the electric grid. The important part is the word changing: a magnet sitting perfectly still next to a wire produces nothing at all.',
    example: 'Every generator works this way, spinning a coil through a magnet. A bicycle dynamo is the same idea in miniature, and it is why it lights up only while the wheel turns.',
    source: 'Faraday, "On Induction" (1831)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Electromagnetic_induction',
  },

{
    id: 'ohms-law',
    term: "Ohm's Law",
    subject: 'physics',
    letter: 'O',
    tagline: 'Current equals voltage divided by resistance.',
    explanation: 'Push harder on a wire and more current runs through it; make it harder for current to pass and less does. Ohm found that relationship is linear, which sounds dull until you realise it means circuits are actually calculable.',
    example: 'Halving the resistance of a bulb on a fixed supply doubles its current, and therefore its power, which is why bulbs fail most often the moment a dimmer switch is turned up.',
    source: 'Ohm, "Die galvanische Kette" (1827)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Ohm%27s_law',
  },

{
    id: 'double-slit-experiment',
    term: 'Double-Slit Experiment',
    subject: 'physics',
    letter: 'D',
    tagline: 'The most unsettling thing in physics, and it still works.',
    explanation: 'Send light through two narrow slits and you do not get two bright strips, you get a pattern of many. Interference means waves are involved, which is expected, but the pattern still appears when you send the light one particle at a time.',
    example: 'Fire electrons one per second at two slits and the detector builds the same interference fringes. No individual electron can know about both slits, so the pattern has to be in how the particles and the apparatus are set up together.',
    source: 'Young, "On the Theory of Light and Colours" (1802)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Double-slit_experiment',
  },

{
    id: 'nuclear-fission',
    term: 'Nuclear Fission',
    subject: 'physics',
    letter: 'N',
    tagline: 'Splitting one heavy atom to get a very large amount of energy.',
    explanation: 'A heavy nucleus that absorbs a slow neutron can break into two smaller ones, release more neutrons, and those go on to split further nuclei. A chain reaction is exactly that, and the energy released is mostly the mass that vanished.',
    example: 'A kilogram of uranium releasing fission energy gives about eight times the energy of burning a kilogram of coal. What is doing the work is E equals mc squared, applied to a mass difference of roughly 0.1 percent.',
    source: 'Hahn and Strassmann, paper on uranium fission (1939)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Nuclear_fission',
  },

{
    id: 'radioactivity',
    term: 'Radioactivity',
    subject: 'physics',
    letter: 'R',
    tagline: 'An atom deciding to fall apart, with no warning.',
    explanation: 'An unstable nucleus throws off a particle or a burst of energy and becomes something more stable, repeating until it reaches a form that holds still. The rate is a fixed property of each isotope, and it does not care about temperature, pressure, or what the atom is doing.',
    example: 'Carbon-14 has a half-life near 5,730 years, so wood dated to 6,000 years old is about half decayed. Cobalt-60, used to sterilise equipment, halves in about five years and is still giving off heat years later.',
    source: 'Becquerel, "Rayons emis par l uranium" (1896)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Radioactivity',
  },

{
    id: 'equivalence-principle',
    term: 'Equivalence Principle',
    subject: 'physics',
    letter: 'E',
    tagline: 'You cannot tell gravity from acceleration by any local test.',
    explanation: 'Einstein noticed that someone sealed in a small closed room cannot distinguish between sitting still on Earth and accelerating upward fast enough in empty space. The two situations feel identical from the inside, and that is the seed of general relativity.',
    example: 'A freely falling elevator drops the same way whether it is near the floor of the Empire State Building or in deep space, because the passenger is not feeling their own weight either way.',
    source: 'Einstein, "On the Relativity Principle and the Foundations of General Relativity" (1907)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Equivalence_principle',
  },
];
