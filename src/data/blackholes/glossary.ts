/**
 * Every difficult word in the black hole levels, defined once.
 *
 * The brief asks for inline definitions that open without navigating away, and
 * for them to come from one source rather than hand-written tooltips in the
 * JSX. That second part is the important one: "entropy" appears in Level 6 and
 * again in Level 7, and two hand-written tooltips for it would drift into two
 * different wordings within one sitting. This file is that one source.
 *
 * Definitions are written for someone who has never taken a physics class. Each
 * is short enough to read without losing the sentence you were in, which is the
 * whole constraint: a definition that takes longer than the paragraph it
 * interrupts has defeated itself.
 *
 * `see` chains a term to a simpler one, so reading "geodesic" does not require
 * having already read "spacetime". Chains are followed one level at display
 * time so they cannot loop.
 */

export interface GlossaryEntry {
  /** Matches what is written inside {{double braces}} in the level data. */
  term: string;
  definition: string;
  /** A simpler term to point at, when this one rests on another. */
  see?: string;
}

const TERMS: GlossaryEntry[] = [
  // --- Relativity, in the order the levels introduce them -----------------
  {
    term: 'spacetime',
    definition:
      'The four-dimensional arena that space and time together make. Einstein showed they cannot be separated: where mass is, clocks run slower and distances stretch.',
  },
  {
    term: 'geodesic',
    definition:
      'The straightest possible path through curved space. In a flat room it is a straight line; near a black hole it curves, because space there is curved.',
    see: 'spacetime',
  },
  {
    term: 'proper time',
    definition:
      'The time measured by a clock that is actually there. Two people can agree completely about an event and still disagree about how long it took, if one was moving or deep in a gravitational field.',
    see: 'spacetime',
  },
  {
    term: 'light cone',
    definition:
      'A diagram of what can still influence you and what can never reach you, drawn as light spreading from one moment. Once something is outside your light cone, nothing in your future can ever be caused by it.',
  },
  {
    term: 'lensing',
    definition:
      'Light bending around a massive object, the way a road appears to bend over a hill. Around a black hole it bends so hard that you can see light emitted from behind it.',
    see: 'spacetime',
  },
  {
    term: 'frame dragging',
    definition:
      'A spinning mass dragging space around it, so everything nearby turns even while holding still. Tiny on Earth, enormous near a rotating black hole.',
  },
  {
    term: 'infinity',
    definition:
      'Not a very large number. In physics it is what a quantity tends toward as you keep going, and a result called "infinite" usually means the theory has stopped being usable rather than that the answer is big.',
  },

  // --- Black hole mechanics ----------------------------------------------
  {
    term: 'escape velocity',
    definition:
      'The speed you need to leave, once you account for gravity pulling you back the whole way. It is not a fight you win by accelerating harder: past a certain speed you are already on a path that never returns.',
  },
  {
    term: 'event horizon',
    definition:
      'The boundary where leaving needs more speed than light has. Nothing happens when you cross it. It is not a wall or a surface; it is a region of space where the way out is closed.',
    see: 'escape velocity',
  },
  {
    term: 'singularity',
    definition:
      'Where relativity predicts all the mass is crushed into a point of no size. Most physicists read this as a sign the theory has been pushed past where it works, not as a description of a real object.',
  },
  {
    term: 'photon sphere',
    definition:
      'A shell around a black hole where light can orbit. A photon on the right path stays in a circle forever; one slightly further in spirals in, and one slightly further out escapes.',
    see: 'event horizon',
  },
  {
    term: 'ergosphere',
    definition:
      'The region outside a spinning black hole where its rotation forces everything to turn with it. Nothing stays still inside it, so a spacecraft gains energy from being dragged around, and that energy comes out of the black hole.',
    see: 'frame dragging',
  },
  {
    term: 'isco',
    definition:
      'The innermost stable circular orbit: the closest a disk of gas can circle a non-spinning black hole without spiralling in. It sits at three times the horizon radius, so a fast-spinning one leaves much more room.',
    see: 'event horizon',
  },
  {
    term: 'accretion disk',
    definition:
      'The flattened whirl of matter falling toward a black hole. Friction heats it to hundreds of thousands of degrees, which is why it glows in X-rays while the black hole itself emits nothing.',
  },
  {
    term: 'corona',
    definition:
      'The hot, tenuous region of plasma above an accretion disk, held in place by magnetic fields and reaching millions of degrees. It is where the X-rays a black hole system is famous for actually come from.',
    see: 'accretion disk',
  },
  {
    term: 'tidal force',
    definition:
      'The difference in gravity across an object, rather than the gravity itself. Standing on Earth you do not notice it; falling past a small black hole you would, because your feet would be pulled harder than your head.',
  },
  {
    term: 'spaghettification',
    definition:
      'Being stretched lengthwise and squeezed sideways, because the pull on your feet is stronger than the pull on your head. It only matters very close in, but past a certain distance it is unavoidable.',
    see: 'tidal force',
  },
  {
    term: 'redshift',
    definition:
      'Light arriving stretched to a longer, lower frequency. Anything moving away from us does this, and so does light climbing out of a gravitational field: it loses energy on the way, which is what "red" means here.',
  },
  {
    term: 'Doppler beaming',
    definition:
      'Light from something moving towards you arriving brighter, and from something moving away arriving dimmer. The same effect that makes a siren drop in pitch as it passes.',
  },

  // --- Stars and formation ----------------------------------------------
  {
    term: 'hydrostatic equilibrium',
    definition:
      'The balance inside a star where outward pressure from its burning fuel exactly matches the inward pull of its own gravity. Every stable star is in this balance, and a star dies when one side finally wins.',
  },
  {
    term: 'metallicity',
    definition:
      'How much of the heavier elements a star is made of, as astronomers use the word. Anything heavier than helium counts as a metal here, so pure hydrogen and helium are zero metallicity.',
  },
  {
    term: 'supernova',
    definition:
      'The explosive end of a massive star, bright enough to briefly outshine its entire galaxy. Supernovae are also the main event that makes the elements heavier than iron, including the ones you are made of.',
  },
  {
    term: 'pair instability',
    definition:
      'A runaway a very massive star can suffer, where it makes so much of its own energy that it tears itself apart before it can collapse any further. It is thought to leave no black hole behind at all.',
  },
  {
    term: 'feedback',
    definition:
      'A system that limits itself. An active black hole heats the gas around it and blows it away, which star formation then has to work without, so growth slows down. Believed to be what keeps the most massive black holes in check.',
  },

  // --- Observing them ----------------------------------------------------
  {
    term: 'quasar',
    definition:
      'An extremely bright active galactic nucleus: a black hole at the centre of a galaxy feeding so vigorously that the light it outshines every star in that galaxy combined.',
    see: 'accretion disk',
  },
  {
    term: 'x-ray binary',
    definition:
      'A pair of stars, one of them compact, close enough that matter from the ordinary star is pulled across onto it. The friction heats that matter until it shines in X-rays.',
    see: 'accretion disk',
  },
  {
    term: 'tidal disruption event',
    definition:
      'What happens when a star is pulled apart by a black hole. The stretched-out remains make a bright flare that fades over days or months, which is one of the easier ways to spot a black hole that emits nothing itself.',
  },
  {
    term: 'microlensing',
    definition:
      'A distant star briefly appearing brighter because a compact dark object drifted in front of it and bent its light around itself. The light arrives a few hours late, which is the tell.',
  },
  {
    term: 'luminosity distance',
    definition:
      'A complicated way of saying how far away something looks based on how bright it is. Because the universe has expanded the whole time the light travelled, it is larger than the distance the light\'s travel time alone would suggest.',
  },
  {
    term: 'chirp',
    definition:
      'The rising whoop of a merging pair: as they spiral together they speed up, so the signal sweeps upward through the detectors rather than sitting at one pitch.',
  },

  // --- Thermodynamics ----------------------------------------------------
  {
    term: 'entropy',
    definition:
      'A measure of how many arrangements something could be in that look the same from far away. It is why heat flows one way and not the other, and it is the quantity black holes were eventually shown to have.',
  },
  // The thermodynamics lessons share this glossary, so a word like "heat engine"
  // is defined once here rather than twice in the physics lessons.
  {
    term: 'thermal-equilibrium',
    definition:
      'Two things at the same temperature, so no heat flows between them however long they sit together. A thermometer works by settling into this state with whatever it touches.',
  },
  {
    term: 'latent-heat',
    definition:
      'The energy that goes into changing a substance from one state to another rather than raising its temperature, such as melting ice into water or boiling water into steam.',
  },
  {
    term: 'absolute-zero',
    definition:
      'The lowest possible temperature, where particles have as little motion as the rules of quantum mechanics allow. It is minus 273.15 degrees Celsius, written 0 K, and it can never be reached.',
  },
  {
    term: 'kinetic-theory',
    definition:
      'The explanation of temperature as the motion of countless tiny particles: the faster they jiggle, the hotter the thing is. Pressure is those same particles striking the walls of their container.',
    see: 'entropy',
  },
  {
    term: 'specific-heat-capacity',
    definition:
      'The amount of energy needed to raise one kilogram of a material by one degree. Water has a high value, which is why it holds heat so well and warms and cools slowly.',
  },
  {
    term: 'internal-energy',
    definition:
      'All the kinetic and potential energy of the particles inside a system added together. Heating it or making it do work changes this total, and the first law says the books must balance.',
  },
  {
    term: 'microstate',
    definition:
      'One particular way of arranging the particles of a system that looks the same from the outside. Entropy counts how many microstates a system could be in.',
    see: 'entropy',
  },
  {
    term: 'heat-engine',
    definition:
      'Any machine that turns a flow of heat from something hot into something cold into useful work, from a steam engine to a power station. It can never convert all of the heat it takes in.',
    see: 'entropy',
  },
  {
    term: 'Hawking radiation',
    definition:
      'The extremely faint glow a black hole gives off because of quantum effects at its edge, which makes it lose mass over time and eventually evaporate.',
  },
  {
    term: 'vacuum',
    definition:
      'Not nothing, and not empty. The lowest-energy state a quantum field can sit in, which still fluctuates. That last part is what makes black holes radiate at all.',
    see: 'Hawking radiation',
  },

  // --- The frontier ------------------------------------------------------
  {
    term: 'unitarity',
    definition:
      'The rule that the basic operations of physics never destroy information, only move it around. Much of the trouble in this area comes from general relativity and quantum mechanics disagreeing about whether that rule survives.',
  },
  {
    term: 'complementarity',
    definition:
      'The proposal that the information inside a black hole is scattered into the radiation outside, so that no observer ever sees both descriptions at once and can put them together. Both accounts are correct; they just cannot be compared.',
  },
  {
    term: 'firewall',
    definition:
      'The proposal that the old and young descriptions of what is happening must disagree, so the disagreement resolves itself as a high-energy membrane sitting just outside the horizon, destroying anything that touches it. Nobody likes the answer.',
  },
  {
    term: 'holographic principle',
    definition:
      'The idea that everything happening inside a volume can be described completely by what happens on its boundary, rather like a hologram. It says a region holds no more information in it than its surface can carry.',
  },
  {
    term: 'AdS/CFT',
    definition:
      'A correspondence between a gravity theory in a curved space with a boundary, and a quantum theory living on that boundary. It turns questions about quantum gravity into questions about something we already know how to calculate.',
  },
  {
    term: 'Anti-de Sitter space',
    definition:
      'A universe with negative curvature, where space bends the opposite way from ours and the angles in a triangle sum to less than 180 degrees. Physicists study it because it is simpler than our universe, and because AdS/CFT works there.',
  },
  {
    term: 'quantum gravity',
    definition:
      'The theory that would combine quantum mechanics with general relativity. We do not have one. It matters here because a black hole is the one place where neither theory on its own is sufficient.',
  },
  {
    term: 'string theory',
    definition:
      'An attempt to unify forces by proposing that what we call particles are really tiny vibrating strings, so a single entity can behave as different particles at different energies.',
    see: 'quantum gravity',
  },
  {
    term: 'loop quantum gravity',
    definition:
      'An attempt to combine quantum mechanics with gravity by proposing that space itself has a fine-grained structure built from loops. It differs sharply from string theory about what the fundamental objects are.',
    see: 'quantum gravity',
  },
  {
    term: 'Planck scale',
    definition:
      'The length below which the known theories stop agreeing with each other, roughly 10^-34 metres. Gravity is expected to become as important as the other forces there, and nothing describes what happens at that size.',
  },
];

/** Term -> entry, for lookup by whatever is written inside the double braces. */
export const GLOSSARY: Record<string, GlossaryEntry> = TERMS.reduce(
  (acc, entry) => {
    if (acc[entry.term]) {
      // Two definitions for one term is exactly the drift this file exists to
      // prevent, so it is a build failure rather than a silent overwrite.
      throw new Error(`glossary: "${entry.term}" is defined twice`);
    }
    acc[entry.term] = entry;
    return acc;
  },
  {} as Record<string, GlossaryEntry>
);

export const GLOSSARY_TERMS = TERMS.map((entry) => entry.term);

export const lookupTerm = (term: string): GlossaryEntry | undefined => GLOSSARY[term];