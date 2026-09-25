const list = (...items) => items;
const module = (name, topics) => ({ name, topics: list(...topics) });

/**
 * Metadata-only editorial curriculum for the authenticated home page. Keeping
 * this separate from curriculum.js prevents the home screen from loading every
 * full lesson payload before the learner chooses a subject.
 */
export const KNOWLEDGE_FIELDS = [
  {
    id: 'science',
    label: 'Science',
    eyebrow: 'The natural world',
    description: 'From classical mechanics to quantum information, explore the rules that make the universe predictable.',
    lessonFieldId: 'physics',
    disciplines: [
      {
        id: 'physics',
        name: 'Physics',
        description: 'Motion, matter, energy, space, time, and the fundamental forces.',
        modules: [
          module('Classical Mechanics', ['Motion', 'Force', 'Work, Energy & Power', 'Momentum', 'Gravitation', 'Rotational Motion', 'Oscillations']),
          module('Thermodynamics', ['Heat', 'Temperature', 'Laws of Thermodynamics', 'Entropy', 'Heat Engines']),
          module('Electromagnetism', ['Electric Charge', 'Electric Fields', 'Electric Potential', 'Current Electricity', 'Magnetism', 'Electromagnetic Induction', 'Maxwell’s Equations']),
          module('Optics', ['Reflection', 'Refraction', 'Lenses', 'Mirrors', 'Interference', 'Diffraction', 'Polarization']),
          module('Waves', ['Mechanical Waves', 'Sound', 'Wave Motion', 'Resonance']),
          module('Modern Physics', ['Special Relativity', 'General Relativity', 'Photoelectric Effect', 'Atomic Physics', 'Nuclear Physics', 'Particle Physics']),
          module('Quantum Physics', ['Wave-Particle Duality', 'Quantum States', 'Uncertainty Principle', 'Superposition', 'Quantum Entanglement', 'Quantum Tunneling', 'Quantum Field Theory', 'Quantum Computing', 'Quantum Information']),
          module('Condensed Matter Physics', ['Solids', 'Crystals', 'Semiconductors', 'Superconductivity', 'Nanophysics']),
          module('Plasma Physics', ['Plasma Physics']),
          module('Astrophysics', ['Astrophysics']),
          module('Cosmology', ['Cosmology']),
          module('Biophysics', ['Biophysics']),
          module('Computational Physics', ['Computational Physics'])
        ]
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        description: 'Matter, its properties, its reactions, and the molecular machinery of life.',
        modules: [
          module('Physical Chemistry', ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Chemical Equilibrium', 'Chemical Kinetics', 'Electrochemistry', 'Solutions']),
          module('Organic Chemistry', ['Hydrocarbons', 'Functional Groups', 'Reactions', 'Polymers', 'Biomolecules']),
          module('Inorganic Chemistry', ['Periodic Table', 'Metals', 'Non-metals', 'Coordination Chemistry', 'Minerals']),
          module('Analytical Chemistry', ['Chemical Analysis', 'Spectroscopy', 'Chromatography']),
          module('Biochemistry', ['Proteins', 'Carbohydrates', 'Lipids', 'Enzymes', 'DNA & RNA', 'Metabolism']),
          module('Nuclear Chemistry', ['Nuclear Chemistry']),
          module('Environmental Chemistry', ['Environmental Chemistry']),
          module('Industrial Chemistry', ['Industrial Chemistry']),
          module('Materials Chemistry', ['Materials Chemistry']),
          module('Computational Chemistry', ['Computational Chemistry']),
          module('Medicinal Chemistry', ['Medicinal Chemistry'])
        ]
      },
      {
        id: 'biology',
        name: 'Biology',
        description: 'The structures, processes, and histories of living organisms.',
        modules: [
          module('Cell Biology', ['Cell Structure', 'Organelles', 'Cell Division', 'Cell Signaling']),
          module('Molecular Biology', ['DNA', 'RNA', 'Gene Expression', 'Protein Synthesis']),
          module('Genetics', ['Heredity', 'Mutations', 'Genetic Disorders', 'Genomics']),
          module('Microbiology', ['Bacteria', 'Viruses', 'Fungi', 'Protozoa']),
          module('Botany', ['Plant Structure', 'Plant Physiology', 'Reproduction', 'Plant Evolution']),
          module('Zoology', ['Animal Anatomy', 'Animal Physiology', 'Animal Behaviour']),
          module('Human Biology', ['Anatomy', 'Physiology', 'Nervous System', 'Circulatory System', 'Respiratory System', 'Digestive System', 'Endocrine System']),
          module('Ecology', ['Ecosystems', 'Food Chains', 'Biodiversity', 'Conservation']),
          module('Evolution', ['Natural Selection', 'Adaptation', 'Speciation']),
          module('Specialized Fields', ['Biotechnology', 'Bioinformatics', 'Neuroscience', 'Immunology', 'Marine Biology', 'Genetics & Genomics'])
        ]
      },
      {
        id: 'earth-environmental-science',
        name: 'Earth & Environmental Science',
        description: 'The systems that shape our planet, its resources, and its future.',
        modules: [
          module('Earth Systems', ['Geology', 'Geophysics', 'Meteorology', 'Climatology', 'Oceanography', 'Hydrology', 'Soil Science', 'Environmental Science']),
          module('Natural Disasters', ['Earthquakes', 'Volcanoes', 'Tsunamis', 'Landslides']),
          module('Environmental Futures', ['Climate Change', 'Conservation', 'Pollution', 'Natural Resources'])
        ]
      },
      {
        id: 'space-science',
        name: 'Space Science',
        description: 'Observation, exploration, and the physics of the universe beyond Earth.',
        modules: [
          module('Astronomy', ['Stars', 'Planets', 'Moons', 'Asteroids', 'Comets', 'Meteors']),
          module('Astrophysics', ['Stellar Physics', 'Black Holes', 'Neutron Stars', 'Galaxies']),
          module('Cosmology', ['Big Bang', 'Dark Matter', 'Dark Energy', 'Expansion of Universe', 'Multiverse Theories']),
          module('Planetary Science', ['Planetary Science']),
          module('Space Exploration', ['Rockets', 'Satellites', 'Space Stations', 'Space Missions']),
          module('Emerging Frontiers', ['Exoplanets', 'Astrobiology', 'Space Technology'])
        ]
      },
      {
        id: 'computer-science',
        name: 'Computer Science',
        description: 'Computation, information, intelligent systems, and the architecture of the digital world.',
        modules: [
          module('Foundations', ['Programming', 'Algorithms & Data Structures', 'Computer Architecture', 'Operating Systems', 'Databases', 'Computer Networks']),
          module('Intelligence & Robotics', ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing', 'Robotics']),
          module('Computing Systems', ['Cloud Computing', 'Distributed Systems', 'Quantum Computing']),
          module('Human-Centered Computing', ['Web Development', 'Software Engineering', 'Human-Computer Interaction', 'Cybersecurity'])
        ]
      }
    ]
  },
  {
    id: 'philosophy',
    label: 'Philosophy',
    eyebrow: 'How to think and live',
    description: 'Study reality, knowledge, morality, logic, beauty, and the traditions that shaped human thought.',
    lessonFieldId: 'philosophy',
    disciplines: [
      {
        id: 'philosophy-branches',
        name: 'Branches',
        description: 'The core questions and methods that define philosophy.',
        modules: [
          module('Metaphysics', ['Reality', 'Existence', 'Being', 'Time', 'Space', 'Free Will', 'Determinism']),
          module('Epistemology', ['Knowledge', 'Truth', 'Belief', 'Skepticism', 'Reason']),
          module('Ethics', ['Morality', 'Virtue', 'Duty', 'Consequentialism', 'Applied Ethics']),
          module('Logic', ['Deductive Reasoning', 'Inductive Reasoning', 'Arguments', 'Fallacies']),
          module('Aesthetics', ['Beauty', 'Art', 'Taste']),
          module('Political Philosophy', ['Justice', 'Liberty', 'Equality', 'Rights', 'State']),
          module('Philosophy of Mind', ['Consciousness', 'Identity', 'Mind-Body Problem', 'Artificial Consciousness']),
          module('Foundations', ['Philosophy of Science', 'Philosophy of Language', 'Philosophy of Religion', 'Philosophy of Mathematics'])
        ]
      },
      {
        id: 'philosophical-traditions',
        name: 'Philosophical Traditions',
        description: 'Enduring schools of thought across cultures and centuries.',
        modules: [
          module('Ancient & Hellenistic', ['Ancient Greek Philosophy', 'Socrates', 'Plato', 'Aristotle', 'Stoicism', 'Epicureanism', 'Skepticism']),
          module('Modern Traditions', ['Existentialism', 'Nihilism', 'Absurdism', 'Rationalism', 'Empiricism', 'Idealism', 'Materialism', 'Pragmatism', 'Analytic Philosophy', 'Continental Philosophy']),
          module('Global Traditions', ['Islamic Philosophy', 'Indian Philosophy', 'Hindu Philosophy', 'Buddhist Philosophy', 'Jain Philosophy', 'Chinese Philosophy', 'Confucianism', 'Taoism'])
        ]
      },
      {
        id: 'major-philosophers',
        name: 'Major Philosophers',
        description: 'A reading path through the thinkers who changed the questions.',
        modules: [
          module('Ancient & Hellenistic Thinkers', ['Socrates', 'Plato', 'Aristotle', 'Marcus Aurelius', 'Epictetus', 'Seneca']),
          module('Medieval Thinkers', ['Augustine', 'Avicenna', 'Al-Ghazali', 'Ibn Rushd']),
          module('Early Modern Thinkers', ['Descartes', 'Spinoza', 'Locke', 'Hume', 'Kant']),
          module('Nineteenth-Century Thinkers', ['Hegel', 'Kierkegaard', 'Nietzsche', 'Marx']),
          module('Modern & Contemporary Thinkers', ['Dostoevsky', 'Sartre', 'Camus', 'Simone de Beauvoir', 'Wittgenstein', 'Hannah Arendt', 'Michel Foucault'])
        ]
      }
    ]
  },
  {
    id: 'history',
    label: 'History',
    eyebrow: 'Human time',
    description: 'Follow the forces, decisions, and encounters that shaped societies from prehistory to the present.',
    lessonFieldId: 'history',
    disciplines: [
      {
        id: 'prehistory', name: 'Prehistory', description: 'Human life before written records.',
        modules: [module('Early Ages', ['Stone Age', 'Paleolithic', 'Mesolithic', 'Neolithic', 'Bronze Age', 'Iron Age'])]
      },
      {
        id: 'ancient-history', name: 'Ancient History', description: 'Early states, empires, and urban civilizations.',
        modules: [module('Ancient Worlds', ['Mesopotamia', 'Ancient Egypt', 'Ancient Greece', 'Ancient Rome', 'Persian Empires', 'Ancient China', 'Indus Valley Civilization', 'Ancient India', 'Maya Civilization', 'Aztec Civilization', 'Inca Civilization'])]
      },
      {
        id: 'medieval-history', name: 'Medieval History', description: 'Connected worlds of trade, faith, empire, and innovation.',
        modules: [module('Medieval Worlds', ['Medieval Europe', 'Byzantine Empire', 'Islamic Golden Age', 'Abbasid Caliphate', 'Ottoman Empire', 'Medieval India', 'Delhi Sultanate', 'Mughal Empire', 'Medieval China', 'Medieval Japan'])]
      },
      {
        id: 'early-modern-history', name: 'Early Modern History', description: 'Transformations in knowledge, power, and global exchange.',
        modules: [module('Early Modern Transformations', ['Renaissance', 'Reformation', 'Age of Exploration', 'Scientific Revolution', 'Enlightenment', 'Colonialism', 'Industrial Revolution'])]
      },
      {
        id: 'modern-history', name: 'Modern History', description: 'Revolution, empire, world war, and globalization.',
        modules: [module('Modern Transformations', ['American Revolution', 'French Revolution', 'Nationalism', 'Imperialism', 'World War I', 'Russian Revolution', 'World War II', 'Holocaust', 'Cold War', 'Decolonization', 'Civil Rights Movements', 'Globalization'])]
      },
      {
        id: 'indian-history', name: 'Indian History', description: 'Continuities and transformations across the Indian subcontinent.',
        modules: [module('Indian Historical Traditions', ['Indus Valley Civilization', 'Vedic Period', 'Mahajanapadas', 'Mauryan Empire', 'Gupta Empire', 'Medieval India', 'Delhi Sultanate', 'Mughal Empire', 'Marathas', 'Sikh Empire', 'British Rule', 'Indian Rebellion of 1857', 'Indian National Movement', 'Independence', 'Partition', 'Post-Independence India'])]
      },
      {
        id: 'regional-history', name: 'Regional History', description: 'Place-specific histories connected to wider currents.',
        modules: [module('Regional Histories', ['Kashmir History', 'Jammu History', 'Ladakh History', 'Punjab History', 'Himalayan History', 'Central Asian History'])]
      },
      {
        id: 'history-themes', name: 'History Themes', description: 'Read history through forces that cross borders and generations.',
        modules: [module('Historical Themes', ['Military History', 'Economic History', 'Social History', 'Cultural History', 'Religious History', 'Intellectual History', 'History of Science', 'History of Art', 'History of Technology', 'Women’s History'])]
      }
    ]
  },
  {
    id: 'political-science',
    label: 'Political Science',
    eyebrow: 'Power and public life',
    description: 'Examine institutions, political ideas, public policy, governance, and relations between nations.',
    disciplines: [
      {
        id: 'political-theory', name: 'Political Theory', description: 'The concepts behind power, legitimacy, and justice.',
        modules: [module('Foundations of Political Thought', ['State', 'Government', 'Power', 'Authority', 'Sovereignty', 'Liberty', 'Equality', 'Justice', 'Rights', 'Democracy', 'Citizenship', 'Nationalism', 'Secularism', 'Socialism', 'Liberalism', 'Conservatism', 'Marxism', 'Feminism', 'Anarchism'])]
      },
      {
        id: 'political-institutions', name: 'Political Institutions', description: 'How constitutions and institutions distribute authority.',
        modules: [module('Institutional Foundations', ['Constitution', 'Legislature', 'Executive', 'Judiciary', 'Bureaucracy', 'Political Parties', 'Elections', 'Electoral Systems', 'Federalism', 'Local Government'])]
      },
      {
        id: 'comparative-politics', name: 'Comparative Politics', description: 'How political systems differ across countries.',
        modules: [module('System Comparisons', ['Democracies', 'Authoritarian Systems', 'Presidential Systems', 'Parliamentary Systems', 'Federal Systems', 'Unitary Systems', 'Political Institutions Across Countries'])]
      },
      {
        id: 'indian-politics', name: 'Indian Politics', description: 'The institutions and constitutional ideas of India.',
        modules: [module('Indian Political System', ['Indian Constitution', 'Parliament', 'President', 'Prime Minister & Council of Ministers', 'Supreme Court', 'High Courts', 'State Governments', 'Panchayati Raj', 'Election Commission', 'Political Parties', 'Centre-State Relations', 'Fundamental Rights', 'Directive Principles', 'Public Policy'])]
      },
      {
        id: 'international-relations', name: 'International Relations', description: 'How states and institutions interact across borders.',
        modules: [module('Global Affairs', ['Diplomacy', 'Foreign Policy', 'International Organizations', 'United Nations', 'International Law', 'Geopolitics', 'International Security', 'War & Peace', 'Nuclear Politics', 'Globalization', 'International Trade', 'Human Rights', 'Regional Organizations'])]
      },
      {
        id: 'public-administration', name: 'Public Administration & Policy', description: 'How societies turn public values into decisions and services.',
        modules: [module('Governance & Policy', ['Governance', 'Public Administration', 'Public Policy', 'Development', 'Welfare State', 'Corruption & Accountability', 'Public Finance', 'Policy Analysis'])]
      }
    ]
  },
  {
    id: 'geography',
    label: 'Geography',
    eyebrow: 'Our inhabited earth',
    description: 'Connect physical systems, human societies, economies, regions, and geospatial evidence.',
    disciplines: [
      {
        id: 'physical-geography', name: 'Physical Geography', description: 'Earth’s land, water, atmosphere, climate, and life-support systems.',
        modules: [
          module('Geomorphology', ['Mountains', 'Plateaus', 'Plains', 'Rivers', 'Glaciers', 'Caves']),
          module('Climatology', ['Weather', 'Climate', 'Atmospheric Circulation', 'Monsoons', 'Climate Change']),
          module('Oceanography', ['Oceans', 'Currents', 'Tides', 'Waves']),
          module('Biogeography & Hydrology', ['Ecosystems', 'Biomes', 'Biodiversity', 'Soil Geography', 'Hydrology'])
        ]
      },
      {
        id: 'human-geography', name: 'Human Geography', description: 'How people organize space, movement, settlement, and culture.',
        modules: [module('Human Landscapes', ['Population Geography', 'Migration', 'Settlements', 'Urban Geography', 'Rural Geography', 'Cultural Geography', 'Social Geography', 'Political Geography', 'Economic Geography'])]
      },
      {
        id: 'economic-geography', name: 'Economic Geography', description: 'The spatial organization of production, exchange, and resources.',
        modules: [module('Economic Systems', ['Agriculture', 'Industry', 'Mining', 'Energy', 'Trade', 'Transportation', 'Tourism', 'Resources'])]
      },
      {
        id: 'regional-geography', name: 'Regional Geography', description: 'Regional character and place-specific systems.',
        modules: [module('World Regions', ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Australia & Oceania', 'Antarctica', 'Middle East', 'South Asia', 'Central Asia', 'India', 'Jammu & Kashmir'])]
      },
      {
        id: 'geospatial-science', name: 'Geospatial Science', description: 'Tools for measuring and understanding place.',
        modules: [module('Spatial Methods', ['Cartography', 'GIS', 'Remote Sensing', 'GPS', 'Satellite Geography', 'Geographic Data Science'])]
      }
    ]
  },
  {
    id: 'literature',
    label: 'Literature',
    eyebrow: 'Language and imagination',
    description: 'Read across forms, movements, traditions, authors, themes, and the craft of interpretation.',
    disciplines: [
      {
        id: 'literary-forms', name: 'Literary Forms', description: 'The shapes stories and language take.',
        modules: [
          module('Poetry', ['Lyric', 'Epic', 'Sonnet', 'Haiku', 'Ghazal', 'Free Verse']),
          module('Fiction', ['Novel', 'Novella', 'Short Story', 'Flash Fiction']),
          module('Drama', ['Tragedy', 'Comedy', 'Historical Drama', 'Absurdist Drama']),
          module('Non-fiction & Criticism', ['Essays', 'Memoir', 'Biography', 'Autobiography', 'Diaries', 'Letters', 'Literary Criticism', 'Literary Theory'])
        ]
      },
      {
        id: 'literary-movements', name: 'Literary Movements', description: 'Ideas and styles that shaped periods and generations.',
        modules: [module('Literary Movements', ['Classical Literature', 'Romanticism', 'Realism', 'Naturalism', 'Modernism', 'Postmodernism', 'Symbolism', 'Surrealism', 'Existentialist Literature', 'Absurdist Literature', 'Magical Realism', 'Feminist Literature', 'Postcolonial Literature', 'Gothic Literature', 'Beat Literature'])]
      },
      {
        id: 'world-literature', name: 'World Literature', description: 'Literary traditions across languages and regions.',
        modules: [module('World Traditions', ['English Literature', 'American Literature', 'Russian Literature', 'French Literature', 'German Literature', 'Latin American Literature', 'African Literature', 'Arabic Literature', 'Persian Literature', 'Chinese Literature', 'Japanese Literature', 'Indian Literature'])]
      },
      {
        id: 'indian-literature', name: 'Indian Literature', description: 'The multilingual literary traditions of India.',
        modules: [module('Indian Languages & Traditions', ['Sanskrit Literature', 'Urdu Literature', 'Hindi Literature', 'Kashmiri Literature', 'Bengali Literature', 'Punjabi Literature', 'Tamil Literature', 'Malayalam Literature', 'Marathi Literature', 'Gujarati Literature', 'Telugu Literature', 'Kannada Literature'])]
      },
      {
        id: 'literary-analysis', name: 'Literary Analysis', description: 'Tools for reading form, language, context, and meaning.',
        modules: [module('Analytical Elements', ['Themes', 'Characters', 'Plot', 'Setting', 'Symbolism', 'Metaphor', 'Allegory', 'Narrative', 'Point of View', 'Language & Style', 'Characterization', 'Literary Devices', 'Context & Interpretation'])]
      },
      {
        id: 'major-authors', name: 'Major Authors', description: 'An index of writers whose work reshaped literary culture.',
        modules: [module('Major Authors', ['Shakespeare', 'Dostoevsky', 'Tolstoy', 'Kafka', 'Nietzsche', 'Virginia Woolf', 'Sylvia Plath', 'George Orwell', 'Gabriel García Márquez', 'Franz Kafka', 'Albert Camus', 'Fyodor Dostoevsky', 'Rumi', 'Gibran', 'Mirza Ghalib', 'Faiz Ahmed Faiz', 'Rabindranath Tagore', 'Premchand'])]
      }
    ]
  }
];

export const KNOWLEDGE_STATS = KNOWLEDGE_FIELDS.reduce((stats, field) => {
  stats.fields += 1;
  field.disciplines.forEach((discipline) => {
    stats.disciplines += 1;
    discipline.modules.forEach((moduleItem) => {
      stats.topics += moduleItem.topics.length;
    });
  });
  return stats;
}, { fields: 0, disciplines: 0, topics: 0 });

export function findKnowledgeTopic(fieldId, disciplineId, moduleName, topic) {
  const field = KNOWLEDGE_FIELDS.find((item) => item.id === fieldId);
  const discipline = field?.disciplines.find((item) => item.id === disciplineId);
  const parentModule = discipline?.modules.find((item) => item.name === moduleName);

  return parentModule?.topics.includes(topic)
    ? { field, discipline, module: parentModule, topic }
    : undefined;
}
