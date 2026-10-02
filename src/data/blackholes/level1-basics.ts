import { BlackHoleLevel } from '../schema';

/**
 * Level 1: the absolute basics.
 *
 * The order here is a dependency order, not a ranking of importance. Escape
 * velocity has to come before the horizon, because the horizon is defined in
 * terms of it. The horizon has to come before the redshift, because the
 * redshift is what you can actually see happening near it. A reader who jumps
 * to the last entry first will hit four undefined words, and that is the
 * failure mode this level is built to avoid.
 */
const LEVEL_1: BlackHoleLevel = {
  id: 'basics',
  number: 1,
  title: 'The basics',
  blurb: 'Escape velocity, the horizon, the Schwarzschild radius, and why light cannot escape.',
  intro:
    'Everything in this level follows from one idea, and the idea is not really about black holes at all. It is about how fast you have to be moving to escape something, and what happens when that number passes a limit nothing can exceed.',
  entries: [
    {
      id: 'escape-velocity',
      name: 'Escape velocity',
      simple:
        'The speed you need to be moving to get away from something, when you account for that thing pulling you back the whole time. You do not have to beat gravity in a fight. You have to be moving so fast that gravity cannot bend your path back down.',
      deeper:
        'Here is the build-up. Throw a ball up. It leaves your hand, slows as it rises, and comes back. Throw it harder and it goes higher, but it still comes back. There is no speed at which it escapes Earth, because gravity pulls on the ball no matter how fast you throw it, and the pull is what turns it back. But if Earth were a hundred times more massive, the speed needed to escape would be ten times higher. Now imagine a body so massive, and so compact, that the speed needed to leave its surface is faster than light itself. That body has no outward direction left. Every path bends back into it, and in {{spacetime}} every path bends back into it too, for the same reason.',
      matters:
        'This reframes what a black hole is. It is not a vacuum cleaner with suction, and not a hole in the floor. It is a place where the exit speed is above the speed limit, so every future path from inside leads inward. That is a statement about trajectories, not about the strength of a pull.',
      status: 'established',
      source: 'Newton, Principia (1687); see also the Newtonian derivation of the escape speed used in every first-year physics course',
      sourceUrl: 'https://en.wikipedia.org/wiki/Escape_velocity',
    },
    {
      id: 'why-light-cannot-escape',
      name: 'Why light cannot escape',
      simple:
        'Because light cannot slow down. Every other thing can be pushed around, slowed, or stopped. Light always travels at exactly the same speed, so when the {{escape velocity}} reaches that speed and then passes it, there is no way for anything to adjust.',
      deeper:
        'The usual picture is a river with a waterfall. Far upstream the current is gentle and a swimmer can make headway against it. Closer in, the current gets stronger. At some exact line, the water moves downstream faster than the swimmer can swim upstream. Cross that line and swimming back is not difficult, it is impossible, no matter how hard you try. A black hole works the same way, with light in place of the swimmer. The "current" near a black hole is not a force pushing light inward; it is the curving of space itself, so that all the paths light could take lead back down. Which is why the phrase "light cannot escape because it is pulled in" is subtly wrong, and it matters, because it implies a tug that could in principle lose.',
      matters:
        'Once you stop picturing light being sucked backwards, the odd cases stop being odd. Light can orbit a black hole in a stable circle, and light that passes nearby can be bent all the way around so that you see the far side of the accretion disk. Nothing is being tugged. The space it moves through is simply shaped so that going outward is no longer an available direction.',
      status: 'established',
      source: 'Newton, Principia (1687) for the escape speed; the curved-space version is general relativity, see Level 5',
      sourceUrl: 'https://en.wikipedia.org/wiki/Black_hole',
    },
    {
      id: 'event-horizon',
      name: 'Event horizon',
      simple:
        'The boundary where leaving needs more speed than light has. Nothing special happens when you cross it. You would not notice the moment.',
      deeper:
        'It is worth being exact about what this is not. It is not a surface, not a wall, and not made of anything. If the Sun were replaced by a black hole of exactly one solar mass, the horizon would be a sphere about 3 km across, and you could fly through where it used to be with nothing at all stopping you. The name is also a warning about time. An event horizon is defined for an event seen from outside: it is the line on a map of spacetime separating the region whose light can still reach you from the region whose light cannot. For someone falling in, there is no moment at which the escape routes visibly close, and nothing about the crossing is a place rather than a moment.',
      matters:
        'It means "point of no return" is a description of the geometry rather than a force acting on you. Nothing pushes. The directions you could have gone simply stop leading anywhere, and that distinction is what makes the rest of this level interesting rather than frightening.',
      status: 'established',
      source: 'Schwarzschild, On the Gravitational Field of a Mass Point (1916)',
      sourceUrl: 'https://en.wikipedia.org/wiki/Event_horizon',
    },
    {
      id: 'schwarzschild-radius',
      name: 'Schwarzschild radius',
      simple:
        'The size a black hole of a given mass has to be. It is astonishingly small. A black hole with the mass of the Sun would be about 3 km across, which is smaller than a small town.',
      deeper:
        'The radius grows in direct proportion to mass, so a table is more useful than a formula here. One solar mass is about 3 km. Ten solar masses is about 30 km, a bit wider than a large airport. A hundred solar masses is about 300 km, wider than the UK. A million solar masses is about 3 million km, close to eight times the distance from Earth to the Moon. One billion solar masses is about 3 billion km, which fits inside the orbit of Neptune. Set against that, the Sun itself is about 700,000 km across. If the Sun became a black hole it would be roughly 230,000 times smaller than it is now, and Earth would survive, in a much larger orbit, unharmed.',
      matters:
        'This is the number that makes the whole subject concrete. Black holes are not enormous places; they are extremely dense places, and most of the ones we know about are small and far away. It also explains why black holes are easy to miss: one of solar mass is the size of a town, which is invisible from anywhere else in the galaxy.',
      status: 'established',
      source: 'Schwarzschild (1916). The arithmetic is re-derived in level1Schwarzschild.test.ts rather than trusted.',
      sourceUrl: 'https://en.wikipedia.org/wiki/Schwarzschild_radius',
    },
    {
      id: 'spacetime',
      name: 'Spacetime',
      simple:
        'The single thing that space and time are made of together. You can think of it as the room everything happens in, where the room is shaped by what is inside it.',
      deeper:
        'Newton thought of space as a fixed stage and time as a separate clock running over it. Einstein merged them, and the consequence is larger than it sounds: if the room is curved, then a straight line through it is not straight, and a good clock sitting in different parts of the room does not agree with another. Mass curves the room. A black hole is the one place where the room is curved so hard that all the straight lines lead to the same point.',
      matters:
        'It removes the need for gravity as a force pulling things around. Objects are not dragged toward each other; they are following the straightest available path through a curved space, and "down" is whatever direction that happens to be. That is why the escape-speed story in this level and the general-relativity story in Level 5 turn out to be the same fact told twice.',
      status: 'established',
      source: 'Einstein, Die Grundlage der allgemeinen Relativitätstheorie (1916)',
      sourceUrl: 'https://en.wikipedia.org/wiki/Spacetime',
    },
    {
      id: 'time-dilation',
      name: 'Time dilation',
      simple:
        'Clocks run at different rates in different places. The deeper in a gravitational field you are, the slower your clock runs compared with someone far away.',
      deeper:
        'Two people can watch the same event happen and both be right while recording completely different elapsed times. If one of them is closer to a black hole, their clock runs slower. So does a clock moving fast, even in empty space with no gravity present. There is no preferred rest: everyone measures their own time normally and sees everyone else as the strange one. This is not an instrument artefact. It has been measured directly, and it has to be corrected for in practice every day, because the GPS satellites in orbit run fast enough without the correction to slide tens of kilometres from their intended positions.',
      matters:
        'It is the practical reason to care about a black hole at all. Near the horizon of a small black hole, time dilation becomes so extreme that, seen from far away, an infalling object appears to slow down and fade rather than cross. The object does cross. It is the view from outside that runs out of time first, which is why a distant observer never sees anything actually reach the horizon.',
      status: 'established',
      source: 'Einstein (1916); confirmed by Hafele-Keating (1971) and applied as a daily correction in GPS',
      sourceUrl: 'https://en.wikipedia.org/wiki/Time_dilation',
    },
    {
      id: 'redshift',
      name: 'Redshift',
      simple:
        'Light loses energy climbing out of a gravitational field, and lower-energy light is redder. So anything near a black hole looks redder to us than an identical thing far away.',
      deeper:
        'The same word covers two different effects. There is the ordinary kind, where a galaxy moving away stretches its light, which is how we know the universe is expanding. And there is the gravitational kind, where light leaving a strong field is stretched no matter which direction it goes, including sideways. Black holes let us separate the two, because light from the gas right at the edge of one is measurably redder than light from the same gas further out, which tells you the depth you are looking at.',
      matters:
        'It gives gravity a measurable signature on light that is not simply "this came from a long way off". It is one of the ways a black hole is confirmed to exist without anyone going near it, and it is why a black hole can be found by looking for something unexpectedly red.',
      status: 'established',
      source: 'Gravitational component follows directly from Einstein (1916); observed across decades in X-ray binary spectra',
      sourceUrl: 'https://en.wikipedia.org/wiki/Gravitational_redshift',
    },
    {
      id: 'spaghettification',
      name: 'Spaghettification',
      simple:
        'The pull on your feet is stronger than the pull on your head, so you are stretched lengthwise and squeezed sideways before you reach a black hole.',
      deeper:
        'The name is memorable and the picture is right, but the scale is usually exaggerated. It only matters very close in, because the difference in gravity across your body falls off steeply with distance. Passing a supermassive black hole at a safe distance is fine. Passing a small one at the same distance would tear you apart. So the same journey can be survivable or fatal depending only on how massive the black hole is, not on how fast you are travelling.',
      matters:
        'It sets a size threshold that is easy to forget: there is no single safe distance that works for every black hole. The dangerous distance scales with mass, so the more massive the black hole, the further out you can get before gravity starts doing damage.',
      status: 'established',
      source: 'Standard tidal-force analysis in Schwarzschild and Kerr geometry, standard in any general relativity text',
      sourceUrl: 'https://en.wikipedia.org/wiki/Spaghettification',
    },
    {
      id: 'singularity',
      name: 'Singularity',
      simple:
        'Relativity predicts that inside a black hole all the mass ends up at a single point with no size at all. Almost nobody believes that is literally true.',
      deeper:
        'It is worth being exact about what the word means. It is not an observed object. It is what the equations produce when you follow them all the way in, and the near-total confidence among physicists is that this marks a failure of the theory rather than a real place. The same equations describe the entire history of a black hole correctly right up to the point where the density becomes unbounded, which is exactly what you would expect from a good approximation that has been pushed past the end of its range.',
      matters:
        'It marks the edge of what is known. General relativity is not vague inside a black hole; it fails in a specific and identifiable way, and finding the theory that does not fail there is one of the standing problems in physics. That is the subject of Level 7.',
      status: 'theoretical',
      source: 'Predicted by Schwarzschild (1916); interpretation as a real object is not established',
      sourceUrl: 'https://en.wikipedia.org/wiki/Singular_black_hole',
    },
  ],
};

export default LEVEL_1;