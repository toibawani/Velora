import { BlackHoleLevel } from './schema';

/**
 * Level 2: where black holes come from.
 *
 * The order is the causal chain: a star is held up by a balance, it runs out of
 * fuel, the balance breaks, and then one of three fates picks the remnant. The
 * mass categories come last because they are a way of sorting the results, not
 * part of the mechanism.
 */
const LEVEL_2: BlackHoleLevel = {
  id: 'formation',
  number: 2,
  title: 'How they form',
  blurb: 'Star death, supernovae, binary evolution, and the mass categories.',
  intro:
    'Almost every black hole you can name was made by a star running out of fuel. This level follows that process from a star that is working fine to the different objects left behind, and it ends with the awkward middle of the mass range where we have found almost nothing.',
  entries: [
    {
      id: 'hydrostatic-equilibrium',
      name: 'A star held up by pressure',
      simple:
        'A star is a continuous standoff. Its gravity pulls every layer inward, and the pressure from the heat inside pushes every layer outward. While those two are equal, the star is stable.',
      deeper:
        'This is called {{hydrostatic equilibrium}}, and it is the state every ordinary star spends most of its life in. A star like the Sun fuses about 600 million tonnes of hydrogen every second, and the energy released pushes outwards hard enough to balance the pull of its own mass. The remarkable thing is how narrow the balance is. Adjust the energy output by a fraction of a percent and the star would either expand and cool, or collapse and heat up further. Stars spend their lives hunting for the setting that keeps them exactly balanced.',
      matters:
        'It explains why stars are round, why pressure rises with depth inside them, and why "a star runs out of fuel" is a euphemism for a balance failing in one direction. Every death in this level is a star leaving equilibrium.',
      status: 'established',
      source: 'Standard stellar structure; the main-sequence description is in every astrophysics text',
      sourceUrl: 'https://en.wikipedia.org/wiki/Hydrostatic_equilibrium',
    },
    {
      id: 'stellar-collapse',
      name: 'The collapse',
      simple:
        'When the fuel runs out the outward pressure stops. The core is now pulling on itself with nothing to hold it back, and it falls inward in about a second.',
      deeper:
        'The timescale is the striking part. When the fuel runs out in a massive star, the core does not shrink gradually over thousands of years. It collapses on something close to the free-fall time, about a second, which is why a supernova is sudden rather than a slow dimming. The core is typically about the size of the Earth and a little heavier than the Sun when it starts. Falling inward raises its temperature enormously, and that heat fights back: once the core is hot and dense enough, the outward pressure returns and arrests the collapse. That arrested core is a neutron star, or it is not.',
      matters:
        'It sets the size of the problem. Everything interesting about black hole formation happens inside a region roughly the size of a city, in less time than it takes to read this sentence. The black hole is small because the thing that collapsed was small.',
      status: 'established',
      source: 'Standard supernova theory; see review literature on core collapse',
      sourceUrl: 'https://en.wikipedia.org/wiki/Core_collapse',
    },
    {
      id: 'supernova',
      name: 'Supernova',
      simple:
        'The explosion that accompanies the collapse. It is bright enough to briefly outshine the entire galaxy it happened in.',
      deeper:
        'A {{supernova}} is not the cause of a black hole; it is what happens alongside one. When the infalling core rebounds off the newly formed neutron star, a shock wave travels out through the star and blows the outer layers into space. In a type II supernova, from massive stars, the core survives as a neutron star. There is another kind, type Ia, where a white dwarf in a binary system is fed just enough matter to tip it past a mass limit, and there is no core left at all. Between the two types you get most of the elements heavier than iron, including the calcium in your bones.',
      matters:
        'It changes where you are from. Every atom heavier than iron in your body was made in the core of a star and scattered by one of these explosions, including the iron in your blood. It also means black holes are a minority outcome: most massive star deaths leave a neutron star behind.',
      status: 'established',
      source: 'Standard supernova classification; heavy-element nucleosynthesis follows from the binding-energy curve',
      sourceUrl: 'https://en.wikipedia.org/wiki/Supernova',
    },
    {
      id: 'too-heavy-to-stop',
      name: 'When the core is too heavy',
      simple:
        'Above a certain mass, neutron star material cannot hold itself up either. Past that point the collapse does not stop, and a black hole is what is left.',
      deeper:
        'Above roughly 2 to 3 times the mass of the Sun, a neutron star is not in a stable configuration: the pressure from its internal particle interactions is not enough to resist its own weight, and it collapses further. There is also a ceiling in the other direction. Below about 2.1 solar masses a neutron star is comfortably stable. Between roughly 2.5 and 3 solar masses the outcome is genuinely uncertain, and there is a real possibility of a neutron star that then collapses into a low-mass black hole on a timescale far shorter than the age of the universe. That boundary is an active area of research, not a settled number, which is why the figures here are ranges.',
      matters:
        'It is why the stellar-mass range has a soft edge rather than a sharp line. "Black hole" is not one thing with one threshold; it is a range, and near its bottom the physics is still genuinely uncertain. Labelling that band as settled would be the easiest lie to tell in this subject.',
      status: 'contested',
      source: 'The maximum neutron-star mass depends on nuclear physics that is not yet settled; see the review literature',
      sourceUrl: 'https://en.wikipedia.org/wiki/Neutron_star',
    },
    {
      id: 'binary-evolution',
      name: 'Two stars instead of one',
      simple:
        'If a black hole forms in a pair with another compact object, they can orbit each other, lose energy to gravitational waves, and eventually merge into one bigger black hole.',
      deeper:
        'This is where most of the black holes detected by gravitational-wave detectors actually come from, because the collapse of a lone star makes one and hides it, whereas a binary makes two that orbit visibly and announce themselves. The process runs in stages. Two ordinary stars form; the heavier one dies first and leaves a black hole; the other star later sheds its outer layers, and what is left is a neutron star or a white dwarf orbiting close to that black hole. That companion then feeds from the outer layers of its own star, spiralling in over millions of years. Once the pair is close enough, they orbit faster and faster, radiate away their orbital energy as gravitational waves, and merge. There is a floor on how close they can get: they need a few kilometres of separation for the event to be observable, and the space around a black hole is not a Newtonian billiard table.',
      matters:
        'It explains why the ones we have heard are heavy. A pair of stars both heavier than about 20 solar masses is uncommon, and by the time they merge they have become something in the 30 to 100 solar-mass range. That population, previously inferred only indirectly from the rate at which compact binaries should merge, was observed for the first time in 2015. It also means there is a window of a few hundred million years in which a black hole has a visible companion, and that is how we found most of the known stellar-mass ones.',
      status: 'established',
      source: 'Binary evolution channels are standard; the population was confirmed by GW150914 (LIGO-Virgo, PRL 116, 061102, 2016)',
      sourceUrl: 'https://www.ligo.org/science/Publication-GW150914/index.php',
    },
    {
      id: 'mass-categories',
      name: 'The mass categories',
      simple:
        'Black holes are usually sorted by how much mass they have, in rough bands: a few Suns, up to a hundred, the awkward middle hundreds, billions in the centres of galaxies, and possibly some far smaller than anything a star could make.',
      deeper:
        'The five categories below are not official divisions. The boundaries are conventions that differ between papers, and the numbers here are the ones that come up most often. What is genuinely not a matter of convention is the large empty space between roughly 100 and about 100,000 solar masses, and the fact that the smallest category has never been observed at all. Each entry says which part of the range is settled and which is not, because treating all five as equally established would misrepresent three of them.',
      matters:
        'The categories are not a taxonomy for its own sake. Each one is a different formation route, and asking how something forms is the first question to ask about any mass you find. If you detect a black hole of 1,000 solar masses, you have found something that should not exist by the stellar route, and that is a much more interesting thing to know than its mass.',
      status: 'established',
      source: 'Category boundaries are conventions; the underlying mass measurements are from LIGO and the Event Horizon Telescope',
      sourceUrl: 'https://en.wikipedia.org/wiki/Black_hole',
    },
    {
      id: 'stellar-mass',
      name: 'Stellar-mass: about 3 to 100 Suns',
      simple:
        'The ones made when a single massive star collapses. The ones the gravitational-wave detectors mostly find.',
      deeper:
        'Everything from roughly 3 solar masses, just above the heaviest neutron stars, up to about 100. They are typically tens of kilometres across, small enough that one in the Solar System would fit inside the orbit of Mercury. They also rotate: a star\'s core carries angular momentum, and when it collapses that momentum has nowhere to go, so the result spins near the theoretical maximum rate. The detections are consistent with spins close to that limit, and how they got there is an active question. Separately, there is a gap expected between roughly 65 and 130 solar masses with few or no black holes in it, because stars in that range are thought to tear themselves apart rather than collapse. That gap is a predicted hole in the population rather than a measured one, and the 2020 detection of GW190521 landed squarely inside it.',
      matters:
        'It is the category where the population is best understood and where the theories have been tested hardest. When LIGO reported its first detection in 2015 it was two black holes of 36 and 29 solar masses merging into one of 62, and it is the only time anyone has watched the whole process happen.',
      status: 'established',
      source: 'GW150914 component and remnant masses: 36 and 29 solar masses merging to 62, from LIGO-Virgo PRL 116, 061102 (2016)',
      sourceUrl: 'https://arxiv.org/abs/1602.03837',
    },
    {
      id: 'intermediate-mass',
      name: 'Intermediate-mass: 100 to 100,000 Suns',
      simple:
        'The awkward middle. We have strong indirect evidence they exist, and very few confirmed examples.',
      deeper:
        'This range sits between the two categories we can actually find, which is why it is the most interesting gap in the subject. Stellar-mass black holes are found by gravitational waves and X-ray binaries; supermassive ones are found by the motion of gas and stars around galactic centres. Neither method works well in between. There are candidates: very bright X-ray sources, and globular clusters with stars moving too fast for their apparent mass. Neither is settled. One confirmed example arrived in 2020, when gravitational waves from a merger left a remnant of about 142 solar masses, comfortably inside this band. There is reason to expect more, because if a supermassive black hole is built by merging smaller ones, the last merger before it gets large should leave exactly this kind of object behind.',
      matters:
        'It is where the two populations we do know about should connect, so understanding it is the main handle on how supermassive black holes were built at all. Until recently the honest summary was that we had a population of light ones, a population of heavy ones, and nothing in between that anyone could point to.',
      status: 'contested',
      source: 'GW190521 remnant of 142 solar masses (LIGO-Virgo, PRL 125, 101102, 2020) is the first secure example; the rest of the range is candidate-only',
      sourceUrl: 'https://arxiv.org/abs/2009.01075',
    },
    {
      id: 'supermassive',
      name: 'Supermassive: 100,000 Suns and up',
      simple:
        'The ones at the centres of galaxies, from hundreds of thousands to billions of times the mass of the Sun.',
      deeper:
        'The Milky Way has one of about 4 million solar masses; the largest known are around 40 billion. They are not formed by any single star. A cloud of gas collapsing directly into one is a longstanding possibility that nobody has made work in a simulation: there is no way to shed angular momentum fast enough, so the cloud spins itself into a disc instead of collapsing. The alternatives are growth by accretion and by merger, starting from a smaller seed. The seed problem is the hard part. There are quasars in the early universe with black holes of a billion solar masses, in a universe less than a billion years old, so whatever made them did it fast. Proposed seeds range from the collapsed core of one unusually massive early star, through direct collapse of a gas cloud, to the collapse of a dense dark-matter halo.',
      matters:
        'They are the dominant gravitational objects in galaxies and the main suspects behind how galaxies themselves grew, so "how does a supermassive black hole get built this fast" is one of the standing questions in cosmology. It is also why we know there is a growth limit at all: quasars fade as the universe expands and cools and the gas supply runs out, which is the {{feedback}} mechanism of Level 8.',
      status: 'contested',
      source: 'That supermassive black holes exist is established; how the seeds form is not. Sagittarius A* mass from the EHT, ApJL 930 L12 (2022)',
      sourceUrl: 'https://arxiv.org/abs/2311.08680',
    },
    {
      id: 'primordial',
      name: 'Primordial and micro: much lighter than any star can make',
      simple:
        'A hypothetical category of black hole formed in the first moments of the universe, which could be far lighter than any stellar one, and in places a star could never form.',
      deeper:
        'Two different ideas share this entry. A primordial black hole would form directly from a region of unusually dense matter in the early universe, before there were stars to collapse. Depending on when and where that happened, its mass could be anything: some scenarios produce asteroid-mass objects, others stellar-mass ones. A micro black hole is the speculative smallest case, and it is the only category here never observed in any form. Their interest is as candidate dark matter, which is the subject of Level 8. Nothing about their existence is established, and the constraints from what they would have done if they existed are severe.',
      matters:
        'It is the one category where the honest position is that we do not know whether any of them exist. Including it is not padding: a reader who has heard primordial black holes described as dark matter candidates deserves to find out that the candidate part is the speculative part, and that both the mass range and the existence are open questions.',
      status: 'theoretical',
      source: 'Primordial black holes as dark matter are a hypothesis; existence constraints come from microlensing, CMB and evaporation limits',
      sourceUrl: 'https://en.wikipedia.org/wiki/Primordial_black_hole',
    },
  ],
};

export default LEVEL_2;