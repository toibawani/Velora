import { BlackHoleLevel } from './schema';

const LEVEL_6: BlackHoleLevel = {
  id: 'thermodynamics',
  number: 6,
  title: 'Thermodynamics',
  blurb: 'Hawking radiation, temperature, evaporation, entropy, and the four laws.',
  intro:
    'This is where the subject stops being about gravity alone. A black hole turns out to have a temperature, and a thing with a temperature radiates, and a thing that radiates loses mass. That chain of consequences was found by Stephen Hawking in 1974 and it was not expected by anyone, including him.',
  entries: [
    {
      id: 'hawking-radiation',
      name: 'Hawking radiation',
      simple:
        'A black hole glows. The glow is so faint that nothing has ever detected it, but it is there, and it means a black hole slowly loses mass.',
      deeper:
        'The prediction came from combining general relativity with quantum field theory, and the mechanism is not "stuff leaking out of the hole". It is subtler than that. Quantum fields fluctuate everywhere, including where no particles can exist, and the region just outside the horizon is where that matters most. In 1974 Hawking showed that the fluctuations near a horizon are correlated in a particular way, and the effect is that the black hole emits thermal radiation at a temperature set by its mass. The word to be careful about is thermal: the black hole radiates exactly as a hot object does, with a spectrum depending only on temperature. That resemblance to a lump of hot coal is not a metaphor. It obeys thermodynamics.',
      matters:
        'It changes what a black hole is. Before Hawking they were thought permanent. After him they are objects with a lifetime, which means they are in some sense phases of matter rather than final states, and the whole subject acquires a clock. It is also the point where the two great theories of physics must be used at once and, as the next entries show, are immediately seen to disagree.',
      status: 'established',
      source: 'Hawking (1974); the temperature and thermal spectrum are standard results of semiclassical gravity',
      sourceUrl: 'https://en.wikipedia.org/wiki/Hawking_radiation',
    },
    {
      id: 'hawking-temperature',
      name: 'The temperature, and why smaller is hotter',
      simple:
        'A black hole made from less mass is hotter. One the size of an atom would be hot enough to be noticeable, and also extremely short-lived.',
      deeper:
        'The temperature goes as the inverse of the mass, which is the opposite of most things you meet. A larger object is normally the colder one because it is harder to heat; here a larger black hole is colder because it is larger, with more mass holding the same effect at lower intensity. A black hole of one solar mass sits at about 6 x 10^-8 kelvin, roughly a hundred-millionth of a degree above absolute zero. The cosmic microwave background is at about 2.7 kelvin, so any stellar-mass black hole is vastly colder than the universe around it and absorbs more than it emits. Balance with that background happens at about 4 x 10^22 kilograms, a little over half the mass of the Moon and about one twenty-millionth of the Sun. Anything lighter is hotter than the universe, net radiates, and evaporates.',
      matters:
        'It makes evaporation a real possibility rather than a theoretical one, and it says which black holes could ever be seen evaporating: only ones far lighter than any star. It also means the smallest black holes are the brightest and the shortest-lived, so the two properties that make them interesting pull against each other.',
      status: 'established',
      source: 'T = hbar c^3 / (8 pi G M k). Solar mass gives about 6.17e-8 K; the re-derived value is checked in level6Thermodynamics.test.ts',
      sourceUrl: 'https://en.wikipedia.org/wiki/Hawking_temperature',
    },
    {
      id: 'evaporation',
      name: 'Evaporation',
      simple:
        'A black hole radiates away its mass. As it gets lighter it gets hotter, radiates faster, and eventually disappears.',
      deeper:
        'The run-away is the important part. A black hole loses mass, so its temperature rises, so it radiates harder, so it loses mass faster still. The last stage is over in an instant: as the mass approaches zero, the temperature and luminosity climb without bound in the formula. That unbounded climb is the fingerprint of the theory breaking down, which is why nobody takes the final instant literally. A black hole of one solar mass takes around 2 x 10^67 years, about ten billion billion times the age of the universe. A black hole evaporating today would be far lighter: about 10^11 kilograms, roughly a small mountain, or about one ten-billion-billionth of the Sun\'s mass. Anything heavier than that has barely begun to evaporate; anything lighter is long gone.',
      matters:
        'It puts every black hole on a clock, which has consequences for cosmology: a universe long enough will eventually contain no macroscopic black holes at all. It is also why primordial black holes are interesting as dark matter, since only the small ones would have evaporated by now.',
      status: 'established',
      source: 'Evaporation time scales as M^3; about 2.1e67 years for one solar mass, giving about 1e23 kg for a hole as old as the universe',
      sourceUrl: 'https://en.wikipedia.org/wiki/Black_hole_evaporation',
    },
    {
      id: 'black-hole-entropy',
      name: 'Black hole entropy',
      simple:
        'A black hole has an entropy, and it scales with its surface area rather than its volume. That is the clue to the deepest idea in theoretical physics.',
      deeper:
        '{{Entropy}} measures how many arrangements of a system look the same from outside, and it is what makes heat flow one way and not the other. In 1973 Bekenstein pointed out a problem: a temperature and an energy had been worked out, so an entropy followed, and by the second law it could only go one way. But a black hole swallowing matter decreases the visible entropy of the universe by an amount that grows enormously, violating the second law unless the black hole itself carries entropy that grows by at least as much. Bekenstein showed the only formula that works is proportional to the area of the horizon, and Bekenstein and Hawking derived it properly in 1974. Area rather than volume is the striking part. Every other thermodynamic system has entropy going as its volume, growing with the cube of the size. A black hole\'s goes as the square.',
      matters:
        'It is the reason the holographic principle exists. If a black hole holds its whole entropy on its surface, then a region never contains more information than its boundary can hold. For gravity that is almost the reverse of expectation: adding more space gives you less information density, not more. The constant is such that the entropy is exactly a quarter of the horizon area measured in tiny squares a Planck length across, one of the few exactly-known numbers in the subject.',
      status: 'established',
      source: 'Bekenstein (1973), Bekenstein and Hawking (1974). S = k c^3 A / (4 G hbar), exactly a quarter of the horizon area in Planck squares',
      sourceUrl: 'https://en.wikipedia.org/wiki/Bekenstein%E2%80%93Hawking_entropy',
    },
    {
      id: 'four-laws',
      name: 'The four laws',
      simple:
        'Black holes obey thermodynamics so closely that you can write the standard four laws for them. They fit the ordinary laws as well as any other system.',
      deeper:
        'This is a test rather than a coincidence. The zeroth law says black holes in thermal equilibrium with a surrounding bath all have the same temperature, which is what lets temperature be defined for them at all. The first law says the change in energy equals the area times a temperature plus a pressure term, the standard form, with the pressure being the surface tension of the horizon. The second law says the horizon area can only increase, which is the most physically direct of the four: it is why a black hole cannot be un-made by any process at all. The third law says you cannot drive a black hole to zero temperature, which given that temperature rises as mass falls is another way of saying the mass cannot reach zero. They are the standard laws with different quantities standing in for temperature and entropy, and the fit is exact rather than approximate.',
      matters:
        'It is the strongest evidence that the Hawking calculation is describing something real. A formula that happened to give a temperature would be suggestive. Formulas that make an established four-part thermodynamic structure work unmodified are much harder to explain by accident.',
      status: 'established',
      source: 'The four laws follow from the surface gravity, horizon area and angular momentum; standard in Wald and other texts',
      sourceUrl: 'https://en.wikipedia.org/wiki/Black_hole_thermodynamics',
    },
  ],
};

export default LEVEL_6;