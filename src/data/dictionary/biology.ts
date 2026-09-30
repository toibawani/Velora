import type { DictionaryTerm } from './types';

/**
 * Curious Dictionary: Biology.
 *
 * Filed under the subject it belongs to rather than under whichever file
 * it happened to be typed into, so adding a term means opening one file and
 * the compiler checks it against DictionaryTerm while you type.
 */
export const BIOLOGY_TERMS: DictionaryTerm[] = [
{
    id: 'epigenetics',
    term: 'Epigenetics',
    subject: 'biology',
    letter: 'E',
    tagline: 'Sticky chemical bookmarks that turn your fixed genes on or off.',
    explanation: 'You inherit an unchangeable DNA sequence from your parents, but your cells don’t read every page all the time. Epigenetics describes chemical tags (like methyl groups) that attach to your chromosomes, switching specific genes on or off in response to diet, stress, or age.',
    example: 'A brain neuron and an epidermal skin cell inside your body carry the exact same genetic blueprint. What makes one send electrical pulses and the other produce protective keratin is simply which epigenetic switches are flipped.',
    source: 'C.H. Waddington, The Epigenetics of Embryology (1942)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Epigenetics',
  },

{
    id: 'homeostasis',
    term: 'Homeostasis',
    subject: 'biology',
    letter: 'H',
    tagline: 'The constant internal balancing act required to stay alive.',
    explanation: 'Living bodies are open systems constantly threatened by a fluctuating environment. Homeostasis is the web of negative feedback loops—sweating when hot, shivering when cold, releasing insulin when sugar spikes—that keeps your internal chemistry in a razor-thin safe band.',
    example: 'Your internal core temperature fluctuates barely one degree whether you are hiking in Death Valley or sitting in an air-conditioned library.',
    source: 'Walter B. Cannon, The Wisdom of the Body (1932)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Homeostasis',
  },

{
    id: 'natural-selection',
    term: 'Natural Selection',
    subject: 'biology',
    letter: 'N',
    tagline: 'Differential survival: traits that help an organism reproduce become more common.',
    explanation: 'Natural selection is not a conscious force or an ambition to build "better" creatures. It is simple math: organisms born with traits that help them survive long enough to have offspring pass those traits down, while less advantageous variations slowly fade out.',
    example: 'During the British Industrial Revolution, soot darkened tree bark across Manchester. Light-colored peppered moths became easy prey for birds, while rare dark mutants survived and multiplied until almost all moths in the city were black.',
    source: 'Charles Darwin, On the Origin of Species (1859)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Natural_selection',
  },

{
    id: 'allopatric-speciation',
    term: 'Allopatric Speciation',
    subject: 'biology',
    letter: 'A',
    tagline: 'How geographic isolation splits one family into two separate species.',
    explanation: 'When a single population gets physically cut in half by a rising mountain range, a diverted river, or continental drift, the two groups can no longer mate. Over generations of separate mutations and adaptations, they become genetically distinct species that cannot interbreed.',
    example: 'The Kaibab squirrel on the North Rim of the Grand Canyon and the Abert squirrel on the South Rim share a common ancestor, but centuries separated by the canyon chasm turned them into distinct sub-species with different coats and diets.',
    source: 'Ernst Mayr, Systematics and the Origin of Species (1942)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Allopatric_speciation',
  },

{
    id: 'dna-replication',
    term: 'DNA Replication',
    subject: 'biology',
    letter: 'D',
    tagline: 'Two billion copies a second, and almost no mistakes.',
    explanation: 'Before a cell divides it copies its entire genome, opening the double helix and building a matching strand against each original. The reaction is fast and the copying machinery checks its own work as it goes.',
    example: 'Human DNA polymerase adds around 50 nucleotides a second, but the whole 3 billion base pair genome is copied in about eight hours in a dividing cell. The proofreading step is why the error rate is closer to one in a billion.',
    source: 'Meselson and Stahl, "Genetic Replication in Escherichia Coli" (1958)',
    sourceUrl: 'https://en.wikipedia.org/wiki/DNA_replication',
  },

{
    id: 'central-dogma',
    term: 'Central Dogma of Molecular Biology',
    subject: 'biology',
    letter: 'C',
    tagline: 'Information flows one way: from DNA, to RNA, to protein.',
    explanation: 'DNA is transcribed into messenger RNA, which is then translated into a protein by a ribosome. The sequence of letters gets copied rather than read backwards, and that direction is the organizing fact of all cell chemistry.',
    example: 'A hemophilia patient can carry a normal gene and still have the disorder, because the gene is present but was not turned into protein. The information exists; the machinery never ran.',
    source: 'Crick, "On Protein Synthesis" (1958)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Central_dogma_of_molecular_biology',
  },

{
    id: 'atp',
    term: 'Adenosine Triphosphate',
    subject: 'biology',
    letter: 'A',
    tagline: 'The energy currency every cell spends.',
    explanation: 'ATP stores energy in the bonds between its phosphate groups, and cells constantly build it by burning food and then tear it down to do work. Because it is recycled so fast, a single human turns over roughly their own body weight in ATP each day.',
    example: 'A single ATP molecule may be hydrolyzed and rebuilt hundreds of times before it is finally degraded. It is a reusable unit of currency, not a fuel tank, which is why the word currency is the useful one.',
    source: 'Mitchell, "Coupling of Phosphorylation to Electron and Hydrogen Transfer by a Chemi-Osmotic Type of Mechanism" (1961)',
    sourceUrl: 'https://en.wikipedia.org/wiki/ATP',
  },

{
    id: 'diffusion',
    term: 'Diffusion',
    subject: 'biology',
    letter: 'D',
    tagline: 'How anything spreads out without being told to.',
    explanation: 'Particles in a fluid jostle constantly and gradually spread from where they are concentrated to where they are not, with no energy input needed. The net movement always goes down the concentration gradient, even though individual particles move both ways.',
    example: 'Open perfume in one corner and, without any convection, molecules random-walk across the room until the concentration is even. The same process moves oxygen from your alveoli into your blood across a membrane thinner than a soap bubble.',
    source: 'Brown, "On the existence of certain molecular motions among the particles of liquids" (1827)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Diffusion',
  },

{
    id: 'osmosis',
    term: 'Osmosis',
    subject: 'biology',
    letter: 'O',
    tagline: 'Water moving to wherever the salt is more concentrated.',
    explanation: 'Water can cross a cell membrane but dissolved salts generally cannot, so water moves toward the side with more solute. This is why a cell in salt water shrinks and why a wilted plant perks up when you water it.',
    example: 'Red blood cells swell into spheres in pure water and crumple into spiky shapes in salt water, because the membrane is permeable to water on one side only. It is also how a dialysis machine cleans your blood.',
    source: 'van \'t Hoff, "Theorie der in solution befindlichen Electrolyten" (1887)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Osmosis',
  },

{
    id: 'enzymes',
    term: 'Enzymes',
    subject: 'biology',
    letter: 'E',
    tagline: 'Biologists that lower the effort of a reaction.',
    explanation: 'An enzyme is a protein that binds specific molecules and makes a reaction far easier to start, which lets it happen at a temperature that would otherwise destroy it. They are not consumed and they do not change what is possible, only how fast it happens.',
    example: 'Catalase in your liver breaks down hydrogen peroxide, a product of your own metabolism, at about 40 million reactions a second per molecule. Uncatalysed, the same breakdown takes years.',
    source: 'Sumner, "Isolation, crystallization, and properties of urease" (1926)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Enzyme',
  },

{
    id: 'mitosis',
    term: 'Mitosis',
    subject: 'biology',
    letter: 'M',
    tagline: 'One cell becoming two, and the copy is exact.',
    explanation: 'Mitosis separates duplicated chromosomes and pulls them into two identical nuclei, so a daughter cell gets the same chromosome set as its parent. Errors in this are the direct mechanism behind most cancers.',
    example: 'The roughly 37 trillion cells in your body are mostly the result of mitosis, from a single fertilised cell dividing around 10^16 times. A fully grown adult replaces roughly 1 percent of its skin cells every day this way.',
    source: 'Flemming, "Cellsubstanz, Nucleus und Zelle" (1882)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mitosis',
  },

{
    id: 'meiosis',
    term: 'Meiosis',
    subject: 'biology',
    letter: 'M',
    tagline: 'Making four cells from one, each one different.',
    explanation: 'Meiosis halves the chromosome count so that a sperm and an egg can join without doubling, and it shuffles the deck while doing so. The shuffling comes from crossing over and from taking either half at random.',
    example: 'Crossing over happens between homologous chromosomes while a cell is paused in meiosis I, which is why siblings are not identical and why the human immune system can make antibodies for a molecule it has never seen.',
    source: 'Henderson, "Cell Division in the Ovary" (1891)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Meiosis',
  },

{
    id: 'antibiotic-resistance',
    term: 'Antibiotic Resistance',
    subject: 'biology',
    letter: 'A',
    tagline: 'The bacteria were always going to win this one.',
    explanation: 'Any population of bacteria contains some individuals that survive a drug because of a small genetic difference, and those are the ones that reproduce. The drug does not create resistance; it selects for resistance that was already there.',
    example: 'Treating a population with a drug that kills 99 percent leaves the 1 percent, so a second treatment with the same drug is a near-certainty for a more resistant strain. This is why agriculture banned sub-therapeutic doses years ago.',
    source: 'Fleming, "On the Antibiotic Action of Cultures of a Staphylococcus" (1929)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Antibiotic_resistance',
  },

{
    id: 'protein-folding',
    term: 'Protein Folding',
    subject: 'biology',
    letter: 'P',
    tagline: 'A chain decides its own shape, and the shape is the job.',
    explanation: 'A protein is a chain of amino acids that folds into a specific three-dimensional shape, and nearly all of its function follows from that shape alone. A misshapen protein usually does not half-work; it does nothing, or something harmful.',
    example: 'Sickle cell anaemia is a single amino acid change in haemoglobin that makes the protein surface slightly sticky, so red cells clump at low oxygen. The whole disease follows from one fold going wrong.',
    source: 'Anfinsen, "Principles that govern the Folding of Protein Chains" (1972)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Protein_folding',
  },

{
    id: 'synapse',
    term: 'Synapse',
    subject: 'biology',
    letter: 'S',
    tagline: 'The gap a signal has to jump, and the reason thinking feels effortful.',
    explanation: 'Neurons do not touch. One releases chemicals across a tiny gap and the next has receptors to catch them, so every signal costs energy and a delay. Learning is largely the business of making those connections stronger or weaker.',
    example: 'The signal takes roughly a millisecond to cross a synapse but far less to travel inside the nerve, so a signal crossing a metre of spinal cord costs a few milliseconds in crossings alone. That latency is why reflexes are fast and fine motor control is not.',
    source: 'Sherrington, "The integrative action of the nervous system" (1906)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Synapse',
  },
];
