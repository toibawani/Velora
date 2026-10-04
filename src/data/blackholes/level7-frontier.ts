import { BlackHoleLevel } from './schema';

/**
 * Level 7: the information paradox and the frontier.
 *
 * Every entry here is contested or theoretical except AdS/CFT, and the level
 * intro says so before the reader arrives. That matters more in this level than
 * anywhere else in the subject: this is where a writer is most tempted to
 * present a conjecture as a finding, and where a reader is most likely to leave
 * thinking something has been solved.
 */
const LEVEL_7: BlackHoleLevel = {
  id: 'frontier',
  number: 7,
  title: 'Information and the frontier',
  blurb: 'The information paradox, complementarity, firewalls, holography, quantum gravity.',
  intro:
    'Almost nothing in this level has been tested against an experiment. It is a set of proposals about what must be true, and several of them are mutually incompatible. This is the least settled material in the subject and the most interesting, and the distinction is stated here so nobody discovers it by reading a caption at the bottom.',
  entries: [
    {
      id: 'information-paradox',
      name: 'The information paradox',
      simple:
        'If information can never be destroyed, and everything that falls into a black hole disappears past a one-way boundary, then information is being destroyed. Both of those are things physics is confident about.',
      deeper:
        'This is a genuine contradiction rather than a puzzle that resolves with more thought. Quantum mechanics says the basic operations of physics never destroy {{unitarity}}: information is always shuffled around, never lost. That is not a hunch, it is the rule everything else is built on. General relativity says the event horizon is exactly one-way, from the {{light cone}} picture in Level 5. Now let something carrying information fall in. From outside, it is gone forever. If information cannot be destroyed it cannot be gone, so it must still be somewhere. The natural answer, that it ends up behind the horizon, is unavailable, because nothing behind the horizon can communicate out. Don Page worked this out in the early 1990s, and Hawking conceded in 2004 that he had been wrong to assert the information was simply destroyed.',
      matters:
        'It is not an oddity about black holes. It asks whether the two frameworks that describe everything else can both be complete, and it was the reason a great deal of physics was rebuilt around them. Getting it right probably requires quantum gravity, and it is why black holes stopped being a curiosity and became a test case for the foundations of physics.',
      status: 'contested',
      source: 'Page (1993) for the paradox as a genuine contradiction; Hawking (2004) on abandoning information loss. No consensus resolution.',
      sourceUrl: 'https://en.wikipedia.org/wiki/Black_hole_information_paradox',
    },
    {
      id: 'complementarity',
      name: 'Complementarity',
      simple:
        'The information is both inside the black hole and scattered in the radiation outside, and both are true. No observer can ever see both descriptions and check them against each other.',
      deeper:
        'Proposed through the 1990s, complementarity says the paradox comes from assuming an observer could see the inside description and the outside description at once. Nobody can. The infalling observer sees the information pass the horizon. The distant observer sees the same information emerge in the Hawking radiation, scrambled but complete. Each description is internally consistent, and they cannot be compared because no single observer has access to both. It is sometimes compared to a book having two complete descriptions, one in the text and one in the sum of letter frequencies, where reading both at once is not an operation that makes sense.',
      matters:
        'It is a solution many physicists find elegant and others unsatisfying, and the objection is old: a description that cannot be tested against its rival is not obviously better than one that can. That argument has never been settled, which is exactly why the level is labelled contested.',
      status: 'contested',
      source: 'Susskind and Wald, developed through the 1990s; the framing is standard in the review literature',
      sourceUrl: 'https://en.wikipedia.org/wiki/Black_hole_complementarity',
    },
    {
      id: 'firewall',
      name: 'The firewall proposal',
      simple:
        'If the two descriptions must agree, they might disagree violently, and the disagreement resolves itself as a wall of high-energy particles just outside the horizon, burning anything that arrives.',
      deeper:
        'AMPS made this argument in 2012, and the logic is worth stating because the name is memorable and the reasoning is not. It is generally accepted that an old black hole radiates in a thermal-looking spectrum with no correlations, which is not what ordinary thermal radiation looks like. Incoming particles falling into an old black hole are entangled with the outgoing radiation, which is not what ordinary local physics looks like. And general relativity says a freely falling observer meets nothing special at the horizon. Each of those three is fine on its own. The trouble is they cannot all three be true. The firewall proposal drops the third and keeps the other two, and the horizon becomes a real physical membrane of high-energy particles. Nothing in the argument prefers that outcome. It is the least of the available evils.',
      matters:
        'It is a striking result because a well-defined calculation rules out the most obvious answer. Most physicists found it unappealing, but the argument is not easily dismissed, and the fact that it cannot be is itself informative about how incomplete the current understanding is.',
      status: 'contested',
      source: 'AMPS (2012). The tension is a result about the three assumptions together, not a prediction that firewalls exist',
      sourceUrl: 'https://en.wikipedia.org/wiki/Firewall_(physics)',
    },
    {
      id: 'holographic-principle',
      name: 'The holographic principle',
      simple:
        'Everything that happens inside a region can be described completely by what happens on its boundary. The interior is in some sense a projection.',
      deeper:
        'The clue is black hole entropy from Level 6: a black hole entropy is proportional to its horizon area, not its volume, so the maximum information a region can hold is set by its surface. If a black hole can hold that much information on a surface with nothing inside, then nothing inside was needed. The idea was sharpened by t Hooft and Susskind in the early 1990s, and its claim is startling stated plainly: gravity might be an emergent feature rather than a fundamental one, arising from a quantum description of information on a boundary that needs no gravity and no location. The name is a metaphor that overstates the case, since a hologram is a flat encoding of an image, whereas this boundary description does not reconstruct an interior so much as account for everything happening in one.',
      matters:
        'It is the strongest structural idea linking quantum mechanics, gravity and black holes, and it inverts the expectation that more space means more room for information. It is also the one idea in this level that has produced an exact correspondence you can calculate with, which is the next entry.',
      status: 'contested',
      source: 'Bekenstein (1973) for the area scaling; t Hooft and Susskind (1993) for the principle',
      sourceUrl: 'https://en.wikipedia.org/wiki/Holographic_principle',
    },
    {
      id: 'ads-cft',
      name: 'AdS/CFT, the one calculation that works',
      simple:
        'A gravitational theory in a curved space with a boundary can be calculated exactly using a quantum theory living on that boundary, with no gravity and no black holes in it.',
      deeper:
        'Proposed by Maldacena in 1997, the correspondence is between general relativity with a negative cosmological constant in {{Anti-de Sitter}} space and a quantum field theory without gravity on its boundary, one dimension lower down. It is exact: the two have the same physics and the same exact spectrum, not just the same limit. The practical consequences are large. A problem about a black hole in a gravitational theory can be turned into one about a quantum field theory that is solvable in principle, including black holes that form and evaporate. Many results that previously needed years of calculation were obtained in days. It is also why the information problem is tractable at all, since it is precisely the setting where this correspondence is well defined.',
      matters:
        'It is the first non-trivial case of quantum gravity that can actually be calculated, and it works in a universe that is not ours, which is its main limitation and the reason it does not settle the paradox outright. It has nonetheless become one of the most important results in theoretical physics, because it showed the boundary idea is not a metaphor.',
      status: 'established',
      source: 'Maldacena (1997). Exact within its setting; it does not cover our own expanding universe directly',
      sourceUrl: 'https://en.wikipedia.org/wiki/AdS/CFT_correspondence',
    },
    {
      id: 'quantum-gravity-programmes',
      name: 'String theory, loop quantum gravity, and the Planck scale',
      simple:
        'Two serious attempts to combine quantum mechanics with gravity, and the length below which both say the current theories stop working.',
      deeper:
        'Both are research programmes rather than finished theories, and they disagree about fundamentals. {{String theory}} proposes that what we call particles are tiny vibrating strings, so one underlying entity can behave as different particles at different energies, and gravity emerges as the lowest-energy vibration. {{Loop quantum gravity}} takes a different route, proposing space itself has a fine-grained structure built from loops, so area is quantised and there is a smallest possible length. Neither is ruled out. Neither has made a testable prediction that has been confirmed. The {{Planck scale}} is where gravity is expected to matter as much as the other forces, around 10^-34 metres, and below it both say the smooth geometry of spacetime breaks down. What is missing is not candidates but a handle: something to test that would say which, if either, is on the right track.',
      matters:
        'It sets the honest state of the subject. There is no agreed theory of quantum gravity, and the information problem is the clearest statement of what is missing, because it is the one place the two frameworks are forced into direct contradiction rather than merely failing to agree.',
      status: 'theoretical',
      source: 'Both programmes are active and neither confirmed; the Planck length follows from combining G, hbar and c',
      sourceUrl: 'https://en.wikipedia.org/wiki/Quantum_gravity',
    },
  ],
};

export default LEVEL_7;
