import { BlackHoleLevel } from './schema';

/**
 * Level 4: how we know they are there.
 *
 * Every entry here is a measurement rather than a prediction, which is why this
 * is the level where specific detection names matter most. "Observed by LIGO" is
 * checkable; "confirmed by science" is not. Each established entry names the
 * instrument, the event or the object, and a test enforces that.
 *
 * Two kinds of evidence appear and are worth keeping apart. Most entries measure
 * light from the gas around a black hole. Two measure the spacetime distortion
 * itself. The second kind is what stops this level being purely indirect: a
 * gravitational wave passes through the Earth as a change in the distance
 * between two mirrors, distorted by the same curvature that defines the horizon.
 */
const LEVEL_4: BlackHoleLevel = {
  id: 'evidence',
  number: 4,
  title: 'How we know',
  blurb: 'X-ray binaries, quasars, the two EHT images, gravitational waves, tidal events, microlensing.',
  intro:
    'A black hole gives off no light, so almost nothing here is a photograph of one. Most of it is a careful inference from what the gas around a black hole does, plus two lines of evidence that are much closer to direct: a ring of light around two of them, and a distortion in spacetime that arrives as a ripple through the Earth.',
  entries: [
    {
      id: 'x-ray-binaries',
      name: 'X-ray binaries',
      simple:
        'A black hole with a normal star orbiting close enough to feed from it. The friction heats the stolen gas until it shines in X-rays.',
      deeper:
        'An {{x-ray binary}} is the workhorse of stellar-mass black hole astronomy. A normal star orbits a compact object at a distance of only a few million kilometres, close enough that the black hole\'s gravity strips gas from the star\'s outer layers. That gas spirals in through the {{accretion disk}}, heats to millions of degrees, and radiates X-rays. The companion is the point: a black hole alone would be invisible, and gas falling from interstellar space is far too thin to make a bright disk. A nearby ordinary star solves both problems at once, and the resulting systems are catalogued in large numbers by all-sky X-ray surveys such as Swift and INTEGRAL.',
      matters:
        'It is the reason the stellar-mass population is known at all. You cannot see these black holes, but you can see the ordinary stars they are taking gas from, and there are enough of them to build a population model. It is also the strongest evidence that a black hole does not simply sit at the centre of a quiet solar system swallowing everything near it.',
      status: 'established',
      source: 'Catalogued by the Swift and INTEGRAL all-sky X-ray surveys; the accretion picture is standard in the literature',
      sourceUrl: 'https://en.wikipedia.org/wiki/X-ray_binary',
    },
    {
      id: 'quasars',
      name: 'Quasars',
      simple:
        'A galaxy whose central black hole is feeding so hard that it outshines every other star in that galaxy put together.',
      deeper:
        'A {{quasar}} is not a separate kind of object. It is an ordinary galaxy with an unusually well-fed supermassive black hole at its centre. The light comes from the accretion disk and corona, not from the black hole. The luminosities are astonishing on their own terms: the brightest quasars outshine whole galaxies by factors of a hundred. And they are far enough away that the light left when the universe was a small fraction of its present age. Those two facts together are the problem: a black hole of a billion solar masses, seen in a universe under a billion years old, which is not enough time for ordinary growth from a small seed.',
      matters:
        'They are the reason supermassive black holes are a cosmological problem and not just an astronomical one. They are also how we know there is a growth limit at all: quasars fade as the universe expands and cools and the gas supply runs out, and the most distant ones are rarer. That decline is one of the strongest large-scale tests of how black holes grow.',
      status: 'established',
      source: 'Catalogued in large numbers by the Sloan Digital Sky Survey quasar catalogue; the distance-dependent decline is a standard result in quasar demographics',
      sourceUrl: 'https://en.wikipedia.org/wiki/Quasar',
    },
    {
      id: 'sgr-a-star',
      name: 'Sagittarius A*, at the centre of our Galaxy',
      simple:
        'The black hole at the centre of the Milky Way, about four million Suns. We have watched individual stars orbit it for thirty years.',
      deeper:
        'Two independent lines of evidence agree on Sgr A*, and that agreement is why it is treated as settled. The first is dynamical: the GRAVITY instrument on the Very Large Telescope has tracked individual stars, notably S2, swinging around it at distances of a few billion kilometres with periods of about sixteen years, and their orbital speeds pin the mass at roughly 4 million solar masses. The second is the 2022 image from the Event Horizon Telescope, which resolved a bright ring 51.8 plus or minus 2.3 microarcseconds across. That analysis found the images are better explained by a rotating black hole than a non-rotating one, and actively disfavoured some alternative central objects.',
      matters:
        'It is the nearest supermassive black hole and the only one whose immediate surroundings we can resolve star by star. It also anchors the whole supermassive population, since masses are measured this way for a handful of nearby galaxies and Sgr A* is what calibrates the rest. That two methods sharing almost no physics and almost no instrumentation arrive at the same answer is what makes the identification secure rather than merely plausible.',
      status: 'established',
      source: 'EHT Collaboration, First Sagittarius A* Results I, ApJL 930 L12 (12 May 2022): ring diameter 51.8 +/- 2.3 microarcseconds, mass ~4e6 solar masses',
      sourceUrl: 'https://arxiv.org/abs/2311.08680',
    },
    {
      id: 'm87-star',
      name: 'M87*, the first image of a black hole',
      simple:
        'The black hole in the centre of a nearby giant elliptical galaxy, about 6.5 billion Suns. In 2019 it became the first black hole ever imaged.',
      deeper:
        'The EHT published the first image of a black hole in April 2019. What it resolved was not the horizon but the shadow: a bright asymmetric ring of light, 42 plus or minus 3 microarcseconds across, with a dark depression in the middle. The ring is emission from plasma, bent around the black hole by {{lensing}}, with the asymmetry explained by relativistic beaming from material moving near light speed. Comparing the image against a library of ray-traced simulations gave a mass of 6.5 plus or minus 0.7 billion solar masses. A follow-up paper found that non-spinning models could not reproduce the observation, because they do not produce a powerful enough jet.',
      matters:
        'It is the first direct image of the region around an event horizon, and a test of general relativity with no Newtonian analogue. It also turned a theoretical result into something a person could look at. The mass figure is worth stating precisely: 6.5 billion solar masses is the value in the paper, and the round numbers used elsewhere are approximations to it.',
      status: 'established',
      source: 'EHT Collaboration, First M87 Results I, ApJL 875 L1 (10 April 2019): mass (6.5 +/- 0.7)e9 solar masses, ring diameter 42 +/- 3 microarcseconds. Spin preference from ApJL 875 L5',
      sourceUrl: 'https://arxiv.org/abs/1906.11238',
    },
    {
      id: 'gravitational-waves',
      name: 'Gravitational waves',
      simple:
        'Ripples in spacetime made by two heavy objects orbiting each other. We can hear them, and they carry away mass.',
      deeper:
        'A gravitational wave is a travelling distortion of spacetime, and it passes through the Earth as an alternating change in the distance between the mirrors of an interferometer, of order one part in 10^21. That is the hardest measurement ever attempted in physics, and LIGO achieved it. The first detection, GW150914, was on 14 September 2015 and was announced in February 2016. The signal swept upward from 35 to 250 hertz in about two tenths of a second, matching the general-relativistic prediction for two black holes of 36 and 29 solar masses spiralling together and merging into one of 62, with three solar masses converted into gravitational-wave energy. The remnant was measured in the ringdown too, from the ringing left after the merger.',
      matters:
        'It turned black holes from inferred objects into directly detected ones, by measuring the thing general relativity is actually about. The result that matters is not that the waves were seen but that they matched the prediction in detail, including the frequencies and the time spent in each phase. It also opened a way of doing astronomy through obstacles, since these waves pass through everything.',
      status: 'established',
      source: 'LIGO-Virgo Collaboration, PRL 116, 061102 (2016), arXiv:1602.03837. GW150914: 36 and 29 solar masses merging to 62, 3.0 solar masses radiated, 410 Mpc, matched-filter SNR 24, significance above 5.1 sigma',
      sourceUrl: 'https://arxiv.org/abs/1602.03837',
    },
    {
      id: 'gw190521',
      name: 'GW190521: the heaviest merger yet heard',
      simple:
        'A 2020 detection of two unusually heavy black holes merging, leaving a remnant in the range nobody had ever confirmed.',
      deeper:
        'The signal was detected on 21 May 2019 at 03:02:29 UTC and lasted about a tenth of a second, peaking at roughly 60 hertz. That was the giveaway: a heavier pair spins more slowly, so its signal sits lower in the detectors\' band. The discovery paper gives component masses of 85 and 66 solar masses in the detector frame, and a remnant of 142 solar masses, which it describes as an intermediate-mass black hole. The remnant landed inside the predicted {{pair instability}} gap, the range where stars are thought to tear themselves apart instead of collapsing. The paper puts only a 0.32 percent probability on the primary being below 65 solar masses.',
      matters:
        'It was the first confirmation of an intermediate-mass black hole, the category that had been the missing link between the two populations we can find. It also produced a genuine puzzle: how do you make two black holes that heavy in the first place, when the stars that made them should not have existed at that mass? The detection is solid. The formation route is not.',
      status: 'established',
      source: 'LIGO-Virgo Collaboration, PRL 125, 101102 (2020), arXiv:2009.01075. Components 85 (+21/-14) and 66 (+17/-18) solar masses detector frame; remnant 142 (+28/-16); z = 0.82',
      sourceUrl: 'https://arxiv.org/abs/2009.01075',
    },
    {
      id: 'tidal-disruption',
      name: 'Tidal disruption events',
      simple:
        'A star gets too close to a black hole, is pulled apart, and the stretched-out remains make a bright flare that fades.',
      deeper:
        'A {{tidal disruption event}} is a black hole caught in the act of eating. A star wanders or is deflected too close, the {{tidal force}} tears it apart, and the debris falls in. Because the material arrives spread out rather than in an orderly disk, it takes months rather than hours to fall in, so the flare lasts months instead of seconds. That long, bright, fading signature is what makes these relatively easy to spot, and hundreds have been found since the first in 1990. There is a size limit. A black hole above roughly 100 million solar masses would swallow a Sun-like star whole rather than pulling it apart, so a tidal disruption event is also a way of measuring: if you see one, the black hole cannot be too massive. The largest event found so far came from a black hole of about that mass, almost exactly at the limit.',
      matters:
        'It gives the population a lower limit on mass that no other single technique does, and it is a reminder that most of what we can observe about a black hole is about the stars falling into it rather than about the black hole itself.',
      status: 'established',
      source: 'Hundreds catalogued since the first in 1990 by wide-field transient surveys including the Palomar Transient Factory and the Zwicky Transient Facility; the disruption limit above ~1e8 solar masses is standard',
      sourceUrl: 'https://en.wikipedia.org/wiki/Tidal_disruption_event',
    },
    {
      id: 'microlensing',
      name: 'Microlensing',
      simple:
        'A dark compact object drifts in front of a distant star and bends its light, making it briefly brighter, with the light arriving hours late.',
      deeper:
        '{{Microlensing}} needs no light from the lens at all, which is what makes it unusual. Any sufficiently massive compact object, and not only a black hole, will bend the light of a star passing behind it, focusing it and making the star brighter. The distinguishing detail is timing: because the light has travelled a longer path it arrives later than it otherwise would, by hours, and that delay gives the geometry. Surveys watching millions of stars in the Large and Small Magellanic Clouds are specifically looking for this. Most events are caused by ordinary dim stars in our own Galaxy. The hard part is telling a lens that is a black hole from one that is a small, dim, ordinary star, and no isolated black hole has been confirmed by this route.',
      matters:
        'It is the only technique here that could detect a black hole with no matter around it, which would be the cleanest possible confirmation of the primordial category from Level 2. It also has a habit of producing candidates that are not what people hoped: several celebrated microlensing detections were later shown to be ordinary foreground stars. None so far has survived.',
      status: 'contested',
      source: 'Microlensing is established as a technique; no isolated black hole has been confirmed by it, and several past candidates were foreground stars',
      sourceUrl: 'https://en.wikipedia.org/wiki/Microlensing',
    },
  ],
};

export default LEVEL_4;