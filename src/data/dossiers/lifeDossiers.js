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

export const HORIZONTAL_TRANSFER_DOSSIER = {
  id: 'horizontal-gene-transfer',
  title: 'Horizontal Gene Transfer',
  standfirst:
    'Bacteria pass genes sideways, not only down. The result is that the tree of life is partly a web, antibiotic resistance travels between species, and the genome of a single organism can be a record of things that happened to its ancestors’ neighbours.',
  field: 'Biology',
  lenses: ['Life'],
  status: 'Established mechanism; extent in eukaryotes debated',
  difficulty: 'Intermediate',
  minutes: 18,
  opening:
    'In animals and plants, genes move from parent to offspring. That is the picture most people carry: a branching tree, with each species inheriting its genome from its ancestor. Bacteria break the picture. They can take up DNA from the environment, receive it through a physical connection from another cell, or have it delivered by a virus. Genes can jump between species that are not closely related at all, which is why a single genome can contain DNA from several branches of the tree.',
  sections: [
    {
      kind: 'prose',
      heading: 'Three routes, one consequence',
      body: [
        'The classical mechanisms are transformation, transduction and conjugation. Transformation is the uptake of free DNA from the environment, which competent bacteria do actively. Transduction is transfer by bacteriophages, viruses that accidentally package a fragment of host DNA and inject it into the next cell they infect. Conjugation is the direct transfer of DNA through a pilus connecting two cells, often carrying a plasmid.',
        'The consequence is the same in all three cases: a gene can appear in a lineage that did not inherit it from its parent. If the gene is useful — antibiotic resistance, a new metabolic pathway, a toxin — selection can fix it quickly. This is why resistance to a drug can spread between species in a hospital, and why the history of a single gene need not match the history of the organism that carries it.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of sideways inheritance',
      items: [
        {
          term: 'Horizontal gene transfer',
          definition:
            'The movement of genetic material between organisms by a route other than parent-to-offspring inheritance. It is common in bacteria and documented in many eukaryotes.',
        },
        {
          term: 'Plasmid',
          definition:
            'A small, usually circular piece of DNA that replicates independently of the main chromosome. Plasmids often carry genes for antibiotic resistance and are readily transferred by conjugation.',
        },
        {
          term: 'Conjugation',
          definition:
            'The transfer of DNA from one bacterium to another through a direct physical connection. It is one of the principal mechanisms of horizontal transfer in bacteria.',
        },
        {
          term: 'Endosymbiosis',
          definition:
            'The incorporation of one organism inside another, as when mitochondria and chloroplasts became permanent organelles. It is horizontal transfer at the largest scale.',
        },
      ],
    },
    {
      kind: 'table',
      heading: 'The mechanisms and what they move',
      columns: ['Mechanism', 'How it works', 'Typical cargo'],
      rows: [
        ['Transformation', 'A cell takes up free DNA from its surroundings', 'Fragments of chromosomal DNA, plasmids'],
        ['Transduction', 'A bacteriophage packages host DNA by mistake', 'Short chromosomal fragments, viral genes'],
        ['Conjugation', 'DNA passes through a pilus into another cell', 'Plasmids, integrative conjugative elements'],
        ['Gene transfer agents', 'Virus-like particles carry random host DNA', 'Short random fragments of the genome'],
      ],
      note:
        'The mechanisms differ in how much DNA they move and how selective they are, but all of them break the assumption that inheritance is strictly vertical.',
    },
    {
      kind: 'prose',
      heading: 'How common is it, really?',
      body: [
        'In bacteria it is frequent enough to matter clinically. Resistance genes such as the extended-spectrum beta-lactamases move between species on plasmids, and whole resistance cassettes can spread through a bacterial community in a patient. In eukaryotes the picture is patchier. There are well-documented cases — the acquisition of genes from bacteria by some insects, the transfer of genes between parasitic plants and their hosts, and the movement of transposable elements between animal species — but the rate is generally much lower than in bacteria.',
        'The methodological difficulty is distinguishing true horizontal transfer from incomplete lineage sorting or contamination. A gene that looks misplaced in a phylogenetic tree can be the result of a gene duplication followed by loss, or of a tree built from too little data. The strongest claims rest on multiple independent lines of evidence: anomalous phylogenetic placement, a plausible mechanism, and a dated event that fits the geological record.',
      ],
    },
    {
      kind: 'misconception',
      heading: 'The tree is not wrong; it is incomplete',
      claim: '"Horizontal gene transfer disproves the tree of life."',
      correction:
        'It complicates the tree rather than refuting it. Most genes in most organisms still follow a branching pattern, and the tree remains the best summary of vertical descent. What horizontal transfer shows is that a single tree cannot represent every gene’s history. For bacteria, the debate is whether to speak of a “tree of cells” plus a separate network of genes, or a “web of life” in which the trunk is a community rather than an individual. Either way, the evidence for common descent is not weakened; the picture of what descends is.',
    },
    {
      kind: 'prose',
      heading: 'Why it matters clinically',
      body: [
        'Antibiotic resistance is the clearest practical consequence. A resistance gene that arises in one species can be transferred to another, so treating one infection can select for resistance in the patient’s whole microbial community. This is one reason antibiotic stewardship is framed at the level of populations and hospitals, not only individual prescriptions.',
        'The same machinery is a tool. Horizontal transfer is how researchers introduce genes into bacteria, and how some gene therapies and engineered microbiomes are designed. It is also a risk: a gene engineered into a laboratory strain could, in principle, move into an environmental bacterium. Understanding the mechanisms is what makes that risk estimable rather than rhetorical.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If a gene’s history and its host’s history disagree, which one is the history of the organism?',
        'How would you prove that a gene moved horizontally rather than being inherited from an unsampled ancestor?',
        'Does horizontal transfer make bacterial species boundaries arbitrary, or merely porous?',
        'What would a tree of life look like if it were drawn to include every gene rather than every organism?',
      ],
    },
  ],
  sources: [
    { label: 'H. Ochman, J. G. Lawrence, E. A. Groisman, "Lateral gene transfer and the nature of bacterial innovation", Nature 405, 299 (2000)', url: 'https://doi.org/10.1038/35012500' },
    { label: 'W. F. Doolittle, "Lateral genomics", Trends in Cell Biology 9, M5 (1999)', url: 'https://doi.org/10.1016/S0962-8924(99)01670-0' },
    { label: 'J. P. Gogarten and J. P. Townsend, "Horizontal gene transfer, genome innovation and evolution", Nature Reviews Microbiology 3, 679 (2005)', url: 'https://doi.org/10.1038/nrmicro1204' },
    { label: 'S. Soucy, J. Huang, J. P. Gogarten, "Horizontal gene transfer: building the web of life", Nature Reviews Genetics 16, 472 (2015)', url: 'https://doi.org/10.1038/nrg3962' },
  ],
  related: ['mycorrhizal-networks', 'slime-mould', 'landauer-principle'],
};

export const PREDICTIVE_PROCESSING_DOSSIER = {
  id: 'predictive-processing',
  title: 'Predictive Processing',
  standfirst:
    'The brain may not build perception from the senses upward. On the predictive-processing account it guesses what is out there and uses the senses to correct the guess. The idea is elegant, influential, and harder to test than its popularity suggests.',
  field: 'Neuroscience',
  lenses: ['Mind & Machine'],
  status: 'Influential framework; mechanisms and scope contested',
  difficulty: 'Intermediate',
  minutes: 19,
  opening:
    'Look at a familiar room. You do not experience a flood of pixels that your brain assembles into objects; you experience the room as already meaningful. Predictive processing takes that everyday fact seriously. It proposes that the brain is constantly generating a model of the causes of its sensory input, and that perception is the process of correcting that model when the input disagrees.',
  sections: [
    {
      kind: 'prose',
      heading: 'From Helmholtz to the free-energy principle',
      body: [
        'The core idea is old. Helmholtz argued in the nineteenth century that perception is unconscious inference: the brain infers the external causes of sensory signals, and because the inference is underdetermined, it must use prior knowledge. Predictive processing formalises this with a hierarchical generative model. Each level predicts the activity of the level below; the mismatch is the prediction error, and it is passed upward to revise the model.',
        'Karl Friston’s free-energy principle extends the idea beyond perception. It proposes that all self-organising systems minimise a quantity called variational free energy, which bounds surprise. Perception minimises it by changing the model; action minimises it by changing the world. This is a ambitious unification, and it is also where the empirical difficulties begin.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The terms the theory is built from',
      items: [
        {
          term: 'Generative model',
          definition:
            'An internal model that produces expectations about sensory input from hypothesised causes. In predictive processing the brain is treated as such a model.',
        },
        {
          term: 'Prediction error',
          definition:
            'The difference between the input a level expected and the input it received. It is the signal that drives learning and perceptual revision.',
        },
        {
          term: 'Precision',
          definition:
            'The estimated reliability of a prediction or a sensory signal. Precision weighting decides how much a given error is allowed to change the model.',
        },
        {
          term: 'Active inference',
          definition:
            'The proposal that action is the brain changing the world to match its predictions, rather than only changing predictions to match the world.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'What “minimising free energy” is minimising',
      equation: 'F = E_q[ln q(s) − ln p(o, s)]',
      symbols: [
        { symbol: 'F', meaning: 'Variational free energy, a quantity the theory says the system minimises' },
        { symbol: 'q(s)', meaning: 'The system’s internal estimate of the probability of hidden states s' },
        { symbol: 'p(o, s)', meaning: 'The generative model’s joint probability of observations o and hidden states s' },
        { symbol: 'E_q', meaning: 'Expectation taken under the internal estimate q' },
      ],
      body: [
        'Free energy is an upper bound on surprise: minimising it minimises the surprise of observations, at least approximately. The formula is the standard variational expression from machine learning, not a new piece of mathematics. What is new is the claim that a biological system implements it.',
        'The bracket has two parts. The first is the entropy of the internal estimate; the second is how well that estimate predicts the observations. Minimising F trades off a simple, low-entropy model against accuracy. This is the same trade-off as in variational autoencoders, and it is why the framework connects so easily to machine learning.',
      ],
      assumptions: [
        'The system can be described as having an internal probability distribution over hidden states.',
        'The relevant quantity is variational free energy, not some other objective the brain might be optimising.',
        'The approximation is close enough that minimising the bound is a good description of what the brain does.',
      ],
    },
    {
      kind: 'table',
      heading: 'What the framework predicts, and what the evidence shows',
      columns: ['Prediction', 'Evidence', 'Status'],
      rows: [
        ['Faster processing of expected stimuli', 'Robust repetition-suppression effects', 'Consistent, but not unique to the theory'],
        ['Illusions as prior-dominated inference', 'Many illusions fit Bayesian models', 'Consistent; alternative explanations exist'],
        ['Precision modulates attention', 'Attention effects resemble precision weighting', 'Plausible, still debated'],
        ['Action reduces prediction error', 'Motor cortex shows predictive signals', 'Consistent, mechanism unclear'],
      ],
      note:
        'The evidence is largely consistent with the framework rather than decisive for it. A theory that can accommodate almost any result needs predictions that would count against it.',
    },
    {
      kind: 'misconception',
      heading: 'Two overstatements',
      claim: '"Perception is just a hallucination controlled by the senses, so we never really see the world."',
      correction:
        'The slogan captures something real — perception is model-driven — but it overstates the case. Prediction errors are not optional; they constrain the model, and in normal perception they do so reliably. The theory does not say the world is unknowable or that any hallucination is as good as another. It says that what we experience is a constructed model, continuously corrected by input. That is a claim about mechanism, not about whether the model tracks reality.',
    },
    {
      kind: 'misconception',
      heading: 'And a second',
      claim: '"Predictive processing has been confirmed by neuroscience."',
      correction:
        'It has not. The framework is influential and generates testable predictions, but its central claims are difficult to falsify: free-energy minimisation can be fitted to many behaviours after the fact. Critics, including some sympathetic ones, have argued that the theory needs to specify which generative model a brain uses and which predictions it makes, or it risks becoming unfalsifiable. The honest description is that it is a productive research programme with substantial support and unresolved questions, not an established mechanism.',
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If the brain minimises free energy, why does it ever seek out surprise — art, novelty, exploration?',
        'What experiment would distinguish predictive processing from a simpler feedforward account?',
        'Is “precision” a single quantity, or does it stand for several different mechanisms?',
        'Does the framework explain consciousness, or only perception and action?',
      ],
    },
  ],
  sources: [
    { label: 'H. von Helmholtz, Handbuch der physiologischen Optik (1867); unconscious inference in perception', url: 'https://archive.org/details/handbuchderphysi00helm' },
    { label: 'K. Friston, "The free-energy principle: a unified brain theory?", Nature Reviews Neuroscience 11, 127 (2010)', url: 'https://doi.org/10.1038/nrn2787' },
    { label: 'A. Clark, Surfing Uncertainty: Prediction, Action, and the Embodied Mind (Oxford, 2016)', url: 'https://global.oup.com/academic/product/surfing-uncertainty-9780190217013' },
    { label: 'M. Litwin and J. Miłkowski, "Unification by fiat: arrested development of predictive processing", Cognitive Science 44, e12867 (2020)', url: 'https://doi.org/10.1111/cogs.12867' },
  ],
  related: ['slime-mould', 'godel-incompleteness', 'monty-hall'],
};

export const CRISPR_DOSSIER = {
  id: 'crispr',
  title: 'The Immune System That Became a Scalpel',
  standfirst:
    'Bacteria keep pieces of the viruses that infect them and use the memory to cut the same virus apart next time. A decade after the mechanism was demonstrated, the same trick was editing human genomes.',
  field: 'Biology',
  lenses: ['Life', 'Meaning'],
  status: 'Established mechanism; therapeutic use is early and contested',
  difficulty: 'Intermediate',
  minutes: 24,
  opening:
    'In 2005 Francisco Mojica and colleagues noticed that the spacers between the short repeated sequences in bacterial genomes matched the DNA of viruses and plasmids. In 2007 Rodolphe Barrangou and colleagues showed that the yogurt bacterium Streptococcus thermophilus uses those spacers to survive phage infection: survivors had acquired a new spacer, and the spacer matched the phage that had attacked them. In 2012 Martin Jinek, Jennifer Doudna, Emmanuelle Charpentier and colleagues showed that one protein, Cas9, could be aimed at a chosen DNA sequence by a short RNA and would cut it in a test tube. By 2013 the system was editing human cells. In 2020 Doudna and Charpentier received the Nobel Prize in Chemistry.',
  sections: [
    {
      kind: 'prose',
      heading: 'A memory written into a genome',
      body: [
        'The CRISPR array is a library of past infections. Each spacer is a fragment of foreign DNA, inserted at one end of the array after an encounter with a phage or plasmid, and transcribed along with the repeats. The RNA is processed into short guide molecules, and a Cas protein loaded with one of them patrols the cell. If the guide matches incoming DNA, the protein cuts it. The memory is inherited: a cell that survives passes the array to its descendants, so the lineage is protected against a virus its ancestor met.',
        'Two details make the system work without destroying the cell’s own genome. The guide pairs with a protospacer, and the protein also requires a short neighbouring motif, the PAM, which is absent next to the spacer in the array itself. That asymmetry is the difference between a memory and an autoimmune disease. The other detail is the cut: Cas9 uses two nuclease domains, HNH and RuvC, to sever both strands, leaving a blunt end three bases upstream of the PAM. The cell then repairs the break, and the repair is where editing becomes possible and where it becomes unpredictable.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of CRISPR',
      items: [
        {
          term: 'CRISPR',
          definition:
            'A family of repeated DNA sequences in bacteria and archaea, separated by spacers copied from viruses. The array is a heritable record of past infections.',
        },
        {
          term: 'Cas9',
          definition:
            'The nuclease of the CRISPR system. Guided by an RNA matching a target, it cuts both DNA strands three bases upstream of a short motif.',
        },
        {
          term: 'Guide RNA',
          definition:
            'The short RNA that specifies a CRISPR target by base pairing. In the laboratory the natural two-RNA system is usually fused into a single guide.',
        },
        {
          term: 'PAM',
          definition:
            'The protospacer adjacent motif: a short sequence next to the target that Cas9 must recognise before cutting. For the common Streptococcus pyogenes Cas9 it is NGG.',
        },
        {
          term: 'Protospacer',
          definition:
            'The sequence in an invading genome that matches a CRISPR spacer, and therefore the sequence the guide RNA is aimed at.',
        },
        {
          term: 'Bacteriophage',
          definition:
            'A virus that infects bacteria. Phages are the pressure that CRISPR arrays evolved to resist, and they are also the source of the spacers.',
        },
      ],
    },
    {
      kind: 'steps',
      heading: 'How an edit is actually made',
      items: [
        {
          title: 'Choose a target next to a PAM',
          text: 'The guide must match the intended site, and the site must be followed by the PAM the Cas protein recognises. A target without a PAM cannot be cut, however well the guide matches.',
        },
        {
          title: 'Load the guide into Cas9',
          text: 'The guide RNA and the protein form a complex that searches DNA for a PAM, then checks the guide against the adjacent sequence. Mismatches, especially near the PAM, reduce the chance of a cut.',
        },
        {
          title: 'Cut both strands',
          text: 'Cas9 cuts the target three bases upstream of the PAM. The break is blunt, and the cell treats it as damage that has to be repaired before the chromosome can be copied.',
        },
        {
          title: 'Let the cell choose a repair pathway',
          text: 'Non-homologous end joining glues the ends back together and often leaves a small insertion or deletion, which can knock a gene out. Homology-directed repair copies a supplied template and can write a precise change.',
        },
        {
          title: 'Verify the result, not the intention',
          text: 'Sequencing the target site, and the predicted off-target sites, is the only way to know what happened. A cut is not an edit until the repair has been read.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'How specific is a twenty-base address?',
      equation: 'E = 2G · 4⁻ⁿ · (1/16),   n = 20, G = 3.1 × 10⁹ bp',
      symbols: [
        { symbol: 'E', meaning: 'Expected number of exact guide matches in the genome, counting both strands', unit: 'sites' },
        { symbol: 'G', meaning: 'Size of the human genome in base pairs', unit: 'bp' },
        { symbol: 'n', meaning: 'Length of the guide sequence that pairs with the target', unit: 'bases' },
        { symbol: '4⁻ⁿ', meaning: 'Chance that a given site matches a specific n-base sequence, assuming equal base frequencies', unit: 'probability' },
        { symbol: '1/16', meaning: 'Chance that a given site carries the two-base NGG PAM for Streptococcus pyogenes Cas9', unit: 'probability' },
      ],
      body: [
        'With n = 20, 4⁻²⁰ is about 9.1 × 10⁻¹³. Multiplying by 6.2 × 10⁹ base positions on two strands and by 1/16 gives about 0.0004: an exact twenty-base match is expected roughly once in every 2,500 human genomes. That sounds reassuring, and it is also the wrong number to be reassured by. The relevant question is not how often a perfect match occurs but how often a near-match occurs, because Cas9 can cut a site with one or two mismatches, particularly if they are far from the PAM.',
        'The arithmetic explains why guide design is a search problem rather than a recipe. Short guides are more likely to have near-matches; longer guides are more specific but can be less efficient. The genome is not random, so the uniform-base calculation is an order-of-magnitude estimate, not a guarantee. It is still useful, because it shows that specificity is bought with length and lost with mismatches, and that both have to be measured rather than assumed.',
      ],
      assumptions: [
        'Bases are treated as equally frequent and independent, which is false in regions with biased composition such as centromeres.',
        'Only exact matches are counted; the safety-relevant near-matches require a separate, empirically calibrated search.',
        'One PAM orientation and one guide length are assumed; different Cas proteins recognise different motifs and cut at different distances.',
      ],
    },
    {
      kind: 'table',
      heading: 'The toolbox, and what each tool still cannot do',
      columns: ['Tool', 'What it changes', 'What it leaves unresolved'],
      rows: [
        ['Cas9 nuclease', 'Cuts DNA at a guide-directed site; repair produces indels or a templated change', 'The outcome depends on the cell’s repair choice, so the same cut can give different edits'],
        ['Base editor', 'Converts one base into another chemically, without a double-strand break', 'Cannot insert or delete sequence, and the editable window is narrow'],
        ['Prime editor', 'Writes a new sequence using a reverse transcriptase guided by an extended RNA', 'Less efficient than Cas9 in many cells, and still limited by delivery and PAM'],
        ['Cas12a', 'Cuts with a staggered break and uses a single guide RNA', 'Recognises a different, T-rich PAM, so the targetable sites are a different set'],
      ],
      note:
        'The table is about capabilities, not approval. A tool that can make a change in a dish is not a therapy; delivery to the right tissue, immune response, durability and cost decide whether it becomes one.',
    },
    {
      kind: 'prose',
      heading: 'The ethics arrived before the medicine',
      body: [
        'In November 2018 He Jiankui announced that he had edited the CCR5 gene in human embryos and implanted them; twin girls were born, and he was sentenced to three years in prison in 2019. The scientific objections were not only that the edit was premature. CCR5 is not a gene whose disruption is known to be safe, the embryos were mosaics, and the consent process was inadequate. The deeper objection was that the change would be inherited by every cell of those children and by their descendants, which makes the experiment irreversible in a way that somatic gene therapy is not. Most countries prohibit clinical germline editing for exactly that reason.',
        'Somatic editing is a different proposition. In late 2023 a CRISPR therapy for sickle cell disease and beta thalassaemia was approved in Britain, and the sickle cell indication was approved in the United States. The cells are removed, edited outside the body and returned, so the change stays in the patient. It is a genuine success and a narrow one: the treatment is demanding, expensive, and aimed at a disease whose burden falls heavily on people with the least access to it. The ethical question has moved from whether editing can work to who will be able to afford it.',
      ],
    },
    {
      kind: 'misconception',
      heading: 'Precision is not the same as control',
      claim: '"CRISPR is a precise pair of scissors: it changes exactly the letter you choose."',
      correction:
        'A guide RNA specifies a address, not an outcome. Cas9 cuts both strands, and the cell then chooses among repair pathways: end joining can delete or insert bases, templated repair can copy a supplied sequence, and some breaks are repaired perfectly, leaving no edit at all. The same experiment can produce different alleles in different cells, which is why germline editing raises the additional problem of mosaicism. Base editors and prime editors reduce the dependence on the cell’s repair choice, but they have their own constraints and are not universal. Calling the system precise describes its targeting; it does not describe its result.',
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If a cut can be repaired perfectly, how should an editing experiment report efficiency: cutting, editing, or the intended allele?',
        'Should a therapy that edits somatic cells be regulated differently from one that edits embryos? Why, exactly?',
        'What would it take to make a CRISPR therapy accessible at the scale of a common disease rather than a rare one?',
        'Is a heritable edit ever justified by the prevention of a severe disease, and who would have to consent?',
      ],
    },
  ],
  sources: [
    { label: 'F. J. M. Mojica et al., "Intervening sequences of regularly spaced prokaryotic repeats derive from foreign genetic elements", Journal of Molecular Evolution 60, 174–182 (2005)', url: 'https://doi.org/10.1007/s00239-004-0046-3' },
    { label: 'R. Barrangou et al., "CRISPR provides acquired resistance against viruses in prokaryotes", Science 315, 1709–1712 (2007)', url: 'https://doi.org/10.1126/science.1138140' },
    { label: 'M. Jinek et al., "A programmable dual-RNA-guided DNA endonuclease in adaptive bacterial immunity", Science 337, 816–821 (2012)', url: 'https://doi.org/10.1126/science.1225829' },
    { label: 'J. A. Doudna and E. Charpentier, "The new frontier of genome engineering with CRISPR-Cas9", Science 346, 1258096 (2014)', url: 'https://doi.org/10.1126/science.1258096' },
  ],
  related: ['horizontal-gene-transfer', 'chirality', 'predictive-processing'],
};

export const LIFE_DOSSIERS = [
  SLIME_MOULD_DOSSIER,
  MYCORRHIZAL_DOSSIER,
  HORIZONTAL_TRANSFER_DOSSIER,
  PREDICTIVE_PROCESSING_DOSSIER,
  CRISPR_DOSSIER,
];
