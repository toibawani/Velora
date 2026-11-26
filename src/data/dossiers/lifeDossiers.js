/**
 * Life-science dossiers.
 *
 * The two subjects here were chosen because they are genuinely surprising and
 * because both are routinely described with more certainty than the literature
 * supports. The mycorrhizal dossier in particular treats the "wood wide web" as
 * a claim to examine rather than a fact to repeat.
 */

export const SLIME_MOULD_DOSSIER = {
  id: 'slime-mould',
  title: 'Slime Mould Without a Brain',
  standfirst:
    'A single cell with no neurons can solve a maze, reproduce a transport network, and remember where it has been. The interesting question is not whether it is intelligent, but what it is doing instead.',
  field: 'Biology',
  lenses: ['Mind & Machine', 'Life'],
  status: 'Well documented behaviour; the interpretation is contested',
  difficulty: 'Intermediate',
  minutes: 19,
  opening:
    'Physarum polycephalum is a yellow, veined organism that lives on decaying wood. It is not a plant, not an animal, and not a fungus, though it was once classified as one. It is a giant single cell containing thousands of nuclei, and it has no brain, no neurons, and no nervous system. In 2000 a team in Japan put it in a maze with food at two exits. It found the shortest path. That result has been followed by two decades of experiments on decision-making, memory, and network design in an organism that has none of the machinery we usually associate with those words.',
  sections: [
    {
      kind: 'prose',
      heading: 'What the organism actually is',
      body: [
        'The feeding stage is a plasmodium: a single continuous membrane enclosing a cytoplasm full of nuclei, which flows back and forth through a branching network of tubes. The flow is driven by periodic contractions, and it has a direction that reverses roughly every minute or two. Where the flow is stronger, the tube widens; where it is weaker, the tube narrows. That feedback between flow and geometry is the whole machinery.',
        'When food is scarce, the organism converts into a fruiting body and releases spores. The plasmodium is the part that behaves in the ways that get called intelligent: it explores, it connects, it avoids, it remembers. All of it is done by a physical network rearranging itself, not by signals travelling along nerves.',
      ],
    },
    {
      kind: 'terms',
      heading: 'Terms used in the literature',
      items: [
        { term: 'Plasmodium', definition: 'The multinucleate, creeping feeding stage of a slime mould. It is a single cell with many nuclei and no cell walls between them.' },
        { term: 'Protoplasmic streaming', definition: 'The rhythmic flow of cytoplasm through the organism\'s tube network. It is both the transport system and the mechanism that reshapes the network.' },
        { term: 'Chemotaxis', definition: 'Directed movement towards or away from a chemical. Slime moulds follow gradients of nutrients and avoid repellents.' },
        { term: 'Habituation', definition: 'A decrease in response to a repeated stimulus that is not harmful. It is a simple form of learning, and it has been demonstrated in slime moulds.' },
        { term: 'Externalised memory', definition: 'A memory stored in the environment or in the organism\'s own body rather than in a nervous system — for example, a trail of slime that marks where it has been.' },
      ],
    },
    {
      kind: 'table',
      heading: 'The experiments people cite',
      columns: ['Year', 'Experiment', 'What was observed'],
      rows: [
        ['2000', 'Nakagaki, Yamada and Tóth, Nature', 'A plasmodium in a maze found the shortest route between two food sources, and the route was retained when the food was removed.'],
        ['2004', 'Nakagaki et al.', 'The organism constructively connected food sources in a pattern that approximated a Steiner tree, a network that minimises total length.'],
        ['2010', 'Tero et al., Science', 'When oat flakes were arranged to mirror the stations of the Tokyo rail network, the plasmodium produced a transport network with comparable efficiency and cost to the human-designed system.'],
        ['2012', 'Reid et al., PNAS', 'The organism used the slime trail it left behind as an externalised spatial memory, turning back at its own trail to avoid re-exploring.'],
        ['2014–2019', 'Habituation studies', 'Repeated exposure to a harmless repellent reduced the avoidance response, and the effect persisted for days.'],
      ],
      note:
        'These are real, replicated experiments. What is disputed is the vocabulary. "Solving", "deciding" and "remembering" are descriptions of behaviour; whether they imply anything like cognition is a separate question, and the researchers themselves are often careful about the distinction.',
    },
    {
      kind: 'prose',
      heading: 'How a network solves a maze without a solver',
      body: [
        'The maze result looks like planning. The mechanism is closer to annealing. The plasmodium initially spreads through every available passage, because it explores in all directions at once. Tubes that carry flow — the ones on routes between food sources — are reinforced by the flow. Tubes that carry little flow shrink and are abandoned. Over hours, the network converges on the paths that connect food most directly, and the dead ends disappear because nothing is flowing through them.',
        'There is no representation of the maze, no search, and no goal. There is a physical process that amplifies whatever is being used and prunes whatever is not. The same logic explains the Tokyo network result: the organism is not optimising a cost function, it is relaxing into a configuration that balances flow against the cost of maintaining tissue. The resemblance to an engineered network is real, but it is a resemblance produced by a different mechanism, not evidence of a hidden engineer.',
      ],
    },
    {
      kind: 'misconception',
      heading: 'The word "intelligence" is doing a lot of work',
      claim: '"Slime moulds are intelligent, which proves that intelligence does not require a brain."',
      correction:
        'The experiments show adaptive behaviour, and they are genuinely important. But "intelligence" is not a single measurable property, and the slime mould literature uses it in a weak sense: flexible, goal-directed-looking behaviour in response to environment. Whether that constitutes intelligence depends on the definition, and definitions in this area are contested. What the evidence supports is narrower and more interesting: a physical system with no neurons can perform computations by relaxing its own structure, and those computations can look like planning. That is a fact about the substrate of computation, not a proof that brains are unnecessary.',
    },
    {
      kind: 'prose',
      heading: 'Why this matters beyond the headline',
      body: [
        'The slime mould is a test case for a general question: what is the minimum machinery required for adaptive behaviour? If a tube network can approximate a shortest path, then the boundary between "mere physics" and "computation" is not a boundary at all. Computation is what a physical system does when its dynamics implements a mapping from input to output. The slime mould makes that abstract point concrete.',
        'It also has practical uses. The organism has been used as a model for network design, and researchers have built hybrid systems in which biological and electronic components interact. None of this requires the organism to be conscious. The interesting claim is about the variety of ways a system can process information, not about whether the slime mould has experiences.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If a network can solve a maze without representing it, does "solving" mean the same thing as it does for a brain?',
        'What is the difference between a computation and a physical relaxation?',
        'Does habituation in a single cell count as learning, and if not, what is missing?',
        'What would count as evidence that a slime mould has something like a preference?',
      ],
    },
  ],
  sources: [
    { label: 'T. Nakagaki, H. Yamada, Á. Tóth, "Maze-solving by an amoeboid organism", Nature 407, 470 (2000)', url: 'https://doi.org/10.1038/35035159' },
    { label: 'A. Tero et al., "Rules for biologically inspired adaptive network design", Science 327, 439 (2010)', url: 'https://doi.org/10.1126/science.1177894' },
    { label: 'C. R. Reid et al., "Slime mold uses an externalized spatial memory to navigate in complex environments", PNAS 109, 17490 (2012)', url: 'https://doi.org/10.1073/pnas.1215037109' },
    { label: 'R. B. Baluška and S. Levin, "On having no head: cognition throughout biological systems", Frontiers in Psychology 7, 902 (2016)', url: 'https://doi.org/10.3389/fpsyg.2016.00902' },
  ],
  related: ['mycorrhizal-networks', 'unruh-effect'],
};

export const MYCORRHIZAL_DOSSIER = {
  id: 'mycorrhizal-networks',
  title: 'The Wood Wide Web, Examined',
  standfirst:
    'Fungal networks do connect trees underground. They move carbon and nutrients. Whether they are a cooperative market, a signalling internet, or a set of parasitic relationships with good public relations is the live scientific question.',
  field: 'Biology',
  lenses: ['Life', 'Mind & Machine'],
  status: 'The network is established; the cooperation story is contested',
  difficulty: 'Intermediate',
  minutes: 24,
  opening:
    'Almost every tree on Earth is partnered with fungi. The fungus threads its hyphae through the soil and into the tree\'s roots, trading mineral nutrients for sugar. In the 1990s Suzanne Simard and colleagues traced carbon moving between trees through these fungal connections, and the phrase "wood wide web" was born. Since then the idea has become one of the most repeated stories in popular ecology, and one of the most carefully re-examined.',
  sections: [
    {
      kind: 'prose',
      heading: 'What is not in dispute',
      body: [
        'Mycorrhizal fungi colonise plant roots and extend a network of hyphae into the soil. The association is ancient — evidence from the Rhynie chert, about 410 million years old, shows early land plants already partnered with fungi — and it is near-universal. Arbuscular mycorrhizas are found in the majority of land plants; ectomycorrhizas are the dominant form in temperate and boreal forests, where they associate with pines, oaks, birches and beeches.',
        'The exchange is real and measurable. The fungus supplies phosphorus, nitrogen and water in exchange for carbohydrates fixed by the plant. Labelled carbon and nitrogen tracers move between plant and fungus, and between plants connected to the same fungal network. None of that is controversial. The disputes begin when the movement is described as generosity, communication, or a market.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of the debate',
      items: [
        { term: 'Mycorrhiza', definition: 'A symbiotic association between a fungus and a plant root. The fungus extends the plant\'s effective root surface, and the plant supplies sugar.' },
        { term: 'Hypha', definition: 'A single fungal filament. Hyphae branch and fuse into a mycelium, which is the fungal body.' },
        { term: 'Common mycorrhizal network (CMN)', definition: 'A fungal network connecting the roots of two or more plants, potentially allowing resources to move between them.' },
        { term: 'Ectomycorrhiza', definition: 'A mycorrhizal type in which the fungus forms a sheath around root tips. Common in forest trees.' },
        { term: 'Arbuscular mycorrhiza', definition: 'A mycorrhizal type in which the fungus penetrates root cells and forms branched structures called arbuscules. Common in grasses and many crops.' },
      ],
    },
    {
      kind: 'table',
      heading: 'The evidence, and what it supports',
      columns: ['Finding', 'Evidence', 'What it does not show'],
      rows: [
        ['Carbon moves between connected plants', 'Labelled carbon tracer studies, including Simard et al. 1997 in Nature', 'That the donor benefits, or that the transfer is directed'],
        ['Seedlings can be supported by older trees', 'Field and mesocosm studies in Douglas fir and birch', 'That the support is adaptive rather than a by-product of fungal foraging'],
        ['Hyphal networks connect many trees', 'DNA sequencing of root-associated fungi', 'That the network is used for signalling'],
        ['Trees may warn neighbours of pests', 'Some studies report volatile or fungal-mediated signals', 'That the signal is intentional, or that it benefits the sender'],
        ['Fungal partners can be parasitic', 'Many plants receive little phosphorus and pay a high carbon cost', 'That the relationship is a cooperative market'],
      ],
      note:
        'The table is deliberately one-sided: it lists the gap between what is measured and what is often claimed. The gaps are not evidence against the network. They are the reason the interpretation is still being argued.',
    },
    {
      kind: 'prose',
      heading: 'The critique that changed the conversation',
      body: [
        'In 2023 Justine Karst, Melanie Jones and Jason Hoeksema published a review in Nature Ecology & Evolution arguing that the public story had outrun the evidence. Their points were specific. Many of the most cited results come from controlled mesocosms with artificial conditions. Tracer studies show that carbon moves, but not who controls the movement; the fungus is a partner with its own interests, and it may be moving carbon for its own reasons. Claims about "mother trees" nurturing seedlings are difficult to test in the field, and some have not replicated.',
        'The review did not claim that common mycorrhizal networks do not exist. It claimed that the strong version of the story — an intentional, cooperative, information-carrying web — is not supported by the evidence available. That distinction is the whole argument. A network that physically connects trees is not the same thing as a network that functions as a communication system, and the second claim requires different evidence from the first.',
      ],
    },
    {
      kind: 'misconception',
      heading: 'The story that gets told',
      claim: '"Trees talk to each other through a fungal internet, sharing resources and warning each other of danger."',
      correction:
        'The physical network exists, and resources move through it. But "talking", "sharing" and "warning" imply signalling with a function, and that is what the evidence has not established. Carbon transfer can be explained by fungal foraging, by source–sink gradients, or by leakage. A warning signal would need to be shown to change the receiver\'s behaviour in a way that benefits the sender, and to be produced in response to the threat rather than as a general stress response. Some studies point in that direction; none has closed the case. The honest summary is that forests are connected by fungal networks whose ecological function is still being worked out.',
    },
    {
      kind: 'prose',
      heading: 'Why the correction matters',
      body: [
        'The wood wide web is a useful case study in how a scientific finding becomes a cultural story. The original papers were careful. The press coverage was not. By the time the idea reached documentaries and children\'s books, a measured claim about carbon flux had become a claim about trees caring for their children. The correction is not a retreat from wonder. The measured version is stranger: a forest is a market in which plants and fungi bargain, cheat, and occasionally cooperate, and the bargaining is conducted by chemistry rather than by intention.',
        'There is also a practical stake. Forest management and carbon accounting increasingly rely on claims about underground networks. If the networks are described as cooperative carbon sinks, policy may follow. Getting the ecology right is not just a matter of narrative hygiene; it determines what interventions make sense.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'What evidence would be needed to show that a fungal network carries information rather than resources?',
        'Can a relationship be called cooperative if one partner is being exploited?',
        'Why do stories about nature tend to acquire intention as they spread?',
        'If the network is a market, who sets the prices?',
      ],
    },
  ],
  sources: [
    { label: 'S. W. Simard et al., "Net transfer of carbon between ectomycorrhizal tree species in the field", Nature 388, 579 (1997)', url: 'https://doi.org/10.1038/41557' },
    { label: 'J. Karst, M. D. Jones, J. D. Hoeksema, "Positive citation bias and overinterpreted results lead to misinformation on common mycorrhizal networks in forests", Nature Ecology & Evolution 7, 501 (2023)', url: 'https://doi.org/10.1038/s41559-023-01986-1' },
    { label: 'M. G. A. van der Heijden, F. M. Martin, M.-A. Selosse, I. R. Sanders, "Mycorrhizal ecology and evolution: the past, the present, and the future", New Phytologist 205, 1406 (2015)', url: 'https://doi.org/10.1111/nph.13288' },
    { label: 'K. Field et al., "Unity in diversity: structural and functional insights into the ancient partnerships between plants and fungi", New Phytologist 220, 996 (2018)', url: 'https://doi.org/10.1111/nph.15160' },
  ],
  related: ['slime-mould', 'landauer-principle'],
};

export const LIFE_DOSSIERS = [SLIME_MOULD_DOSSIER, MYCORRHIZAL_DOSSIER];
