export const BIOLOGY_CURRICULUM = {
  name: 'Biology',
  description: 'How matter that copies itself builds cells, tissues and histories.',
  modules: [
    { id: 'cell-biology', title: 'Cell biology', intro: 'What a cell is, what is inside one, and how one becomes two.', topics: [
      { id: 'cell-structure', title: 'Cell Structure', kicker: 'The smallest thing that is unambiguously alive', minutes: 15 },
      { id: 'organelles', title: 'Organelles', kicker: 'Two of them used to be bacteria, and the evidence is in their DNA', minutes: 15 },
      { id: 'cell-division', title: 'Cell Division', kicker: 'Copying three billion letters without losing one', minutes: 15 },
      { id: 'cell-signaling', title: 'Cell Signaling', kicker: 'A molecule arrives, and the cell changes what it is doing', minutes: 14 },
      { id: 'metabolism', title: 'Metabolism', kicker: 'How cells extract energy from food', minutes: 14 }
    ] },
    { id: 'molecular-biology', title: 'Molecular biology', intro: 'The molecule that copies itself, and the two others that read it.', topics: [
      { id: 'dna', title: 'DNA', kicker: 'Two metres of it per cell, and a photograph that decided the question', minutes: 15 },
      { id: 'rna', title: 'RNA', kicker: 'The working copy, and possibly the original molecule', minutes: 14 },
      { id: 'gene-expression', title: 'Gene Expression', kicker: 'Every cell has the same genome and does something different with it', minutes: 14 },
      { id: 'protein-synthesis', title: 'Protein Synthesis', kicker: 'A four-letter alphabet writes a twenty-letter protein', minutes: 14 },
      { id: 'mutation', title: 'Mutation and Repair', kicker: 'When DNA makes mistakes and how cells fix them', minutes: 13 }
    ] },
    { id: 'genetics', title: 'Genetics', intro: 'How traits are passed from parents to offspring.', topics: [
      { id: 'heredity', title: 'Heredity', kicker: 'The code passes from parent to child', minutes: 13 },
      { id: 'mutations', title: 'Mutations', kicker: 'Changes in the DNA sequence', minutes: 13 },
      { id: 'genetic-disorders', title: 'Genetic Disorders', kicker: 'When genes go wrong', minutes: 13 },
      { id: 'genomics', title: 'Genomics', kicker: 'Reading the whole genome', minutes: 12 },
      { id: 'inheritance-patterns', title: 'Inheritance Patterns', kicker: 'Dominant, recessive and beyond', minutes: 12 }
    ] },
    { id: 'microbiology', title: 'Microbiology', intro: 'The study of microscopic organisms.', topics: [
      { id: 'bacteria', title: 'Bacteria', kicker: 'Single-celled organisms without a nucleus', minutes: 13 },
      { id: 'viruses', title: 'Viruses', kicker: 'Genetic material wrapped in protein', minutes: 12 },
      { id: 'fungi', title: 'Fungi', kicker: 'Organisms that include mushrooms and yeast', minutes: 12 },
      { id: 'protozoa', title: 'Protozoa', kicker: 'Single-celled organisms with a nucleus', minutes: 12 },
      { id: 'archaea', title: 'Archaea', kicker: 'Microorganisms distinct from bacteria', minutes: 12 }
    ] },
    { id: 'botany', title: 'Botany', intro: 'The study of plants.', topics: [
      { id: 'plant-structure', title: 'Plant Structure', kicker: 'Roots, stems and leaves', minutes: 13 },
      { id: 'plant-physiology', title: 'Plant Physiology', kicker: 'Photosynthesis and transpiration', minutes: 13 },
      { id: 'reproduction', title: 'Reproduction', kicker: 'Flowers, seeds and fruit', minutes: 12 },
      { id: 'plant-evolution', title: 'Plant Evolution', kicker: 'How plants changed the planet', minutes: 12 },
      { id: 'plant-environment', title: 'Plant-Environment Interactions', kicker: 'How plants respond to light, water and stress', minutes: 12 }
    ] },
    { id: 'zoology', title: 'Zoology', intro: 'The study of animals.', topics: [
      { id: 'animal-anatomy', title: 'Animal Anatomy', kicker: 'Tissue types, body plans and homeostasis', minutes: 13 },
      { id: 'animal-physiology', title: 'Animal Physiology', kicker: 'Gas exchange, circulation, digestion and temperature', minutes: 13 },
      { id: 'animal-behaviour', title: 'Animal Behaviour', kicker: 'Innate and learned communication and social', minutes: 12 },
      { id: 'animal-ecology', title: 'Animal Ecology', kicker: 'How animals interact with their environments', minutes: 12 },
      { id: 'evolutionary-animal', title: 'Evolutionary Animal Biology', kicker: 'How animal forms evolve over time', minutes: 12 }
    ] },
    { id: 'human-biology', title: 'Human Biology', intro: 'The organ systems that keep the human body functioning.', topics: [
      { id: 'anatomy', title: 'Anatomy', kicker: 'Body regions, systems and anatomical terms', minutes: 13 },
      { id: 'physiology', title: 'Physiology', kicker: 'Homeostasis, negative feedback and energy', minutes: 13 },
      { id: 'nervous-system', title: 'Nervous System', kicker: 'Neurons, brain and synapses', minutes: 12 },
      { id: 'circulatory-system', title: 'Circulatory System', kicker: 'Heart chambers, vessels and blood', minutes: 12 },
      { id: 'respiratory-system', title: 'Respiratory System', kicker: 'Lungs, alveoli and breathing mechanics', minutes: 12 },
      { id: 'digestive-system', title: 'Digestive System', kicker: 'Alimentary canal, absorption and liver', minutes: 12 },
      { id: 'endocrine-system', title: 'Endocrine System', kicker: 'Glands, hormones and feedback', minutes: 12 }
    ] },
    { id: 'ecology', title: 'Ecology', intro: 'How organisms interact with each other and with the planet.', topics: [
      { id: 'organisms-interact', title: 'Organisms Interact', kicker: 'Every organism interacts with its environment and other organisms', minutes: 13 },
      { id: 'food-webs', title: 'Food Webs', kicker: 'Energy flows through ecosystems in complex networks', minutes: 12 },
      { id: 'cycles-nutrients', title: 'Cycles and Nutrients', kicker: 'Matter cycles through biogeochemical pathways', minutes: 12 },
      { id: 'conservation', title: 'Conservation', kicker: 'Protecting biodiversity and ecosystem services', minutes: 13 }
    ] },
    { id: 'evolution', title: 'Evolution', intro: 'How life changes over time, and how every organism is related.', topics: [
      { id: 'natural-selection', title: 'Natural Selection', kicker: 'Differential survival and reproduction', minutes: 13 },
      { id: 'speciation', title: 'Speciation', kicker: 'How new species arise', minutes: 12 },
      { id: 'phylogeny', title: 'Phylogeny and Cladistics', kicker: 'Tracing evolutionary relationships', minutes: 12 },
      { id: 'evolutionary-development', title: 'Evolutionary Development', kicker: 'How development drives evolutionary change', minutes: 13 }
    ] },
    { id: 'specialized-fields', title: 'Specialized Fields', intro: 'Advanced biology topics at the frontiers of research.', topics: [
      { id: 'systems-biology', title: 'Systems Biology', kicker: 'Modeling complex biological networks', minutes: 13 },
      { id: 'synthetic-biology', title: 'Synthetic Biology', kicker: 'Engineering biological systems', minutes: 12 },
      { id: 'computational-biology', title: 'Computational Biology', kicker: 'Data-driven discovery in biology', minutes: 12 },
      { id: 'astrobio', title: 'Astrobiology', kicker: 'Life in the universe', minutes: 13 }
    ] }
  ]};
