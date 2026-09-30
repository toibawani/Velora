import type { DictionaryTerm } from './types';

/**
 * Curious Dictionary: Chemistry.
 *
 * Filed under the subject it belongs to rather than under whichever file
 * it happened to be typed into, so adding a term means opening one file and
 * the compiler checks it against DictionaryTerm while you type.
 */
export const CHEMISTRY_TERMS: DictionaryTerm[] = [
{
    id: 'activation-energy',
    term: 'Activation Energy',
    subject: 'chemistry',
    letter: 'A',
    tagline: 'The energetic hill molecules must climb before a reaction can roll downhill.',
    explanation: 'Even reactions that release enormous amounts of energy (like burning paper or wood) don’t happen spontaneously at room temperature. Activation energy is the initial push required to break existing chemical bonds before new, more stable bonds can form.',
    example: 'A dry match head contains plenty of chemical energy to sustain a flame, but it will sit quietly on a table for decades until friction against the strike strip supplies the spark of activation energy.',
    source: 'Svante Arrhenius, Zeitschrift für Physikalische Chemie (1889)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Activation_energy',
  },

{
    id: 'electronegativity',
    term: 'Electronegativity',
    subject: 'chemistry',
    letter: 'E',
    tagline: 'How greedily an atom pulls shared electrons toward its own nucleus.',
    explanation: 'In a covalent chemical bond, atoms share electrons like two children holding a rope. Electronegativity measures how strongly one atom tugs the electron cloud toward itself, creating partial electrical charges on opposite ends of the molecule.',
    example: 'In a water molecule (H2O), oxygen is far more electronegative than hydrogen. It hoards the negative electrons, giving water its polar clinginess—which is why water beads on glass and dissolves salt so easily.',
    source: 'Linus Pauling, The Nature of the Chemical Bond (1939)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Electronegativity',
  },

{
    id: 'catalysis',
    term: 'Catalysis',
    subject: 'chemistry',
    letter: 'C',
    tagline: 'A helper that speeds up a reaction without getting consumed in the fire.',
    explanation: 'A catalyst offers an alternate chemical route with a lower energetic hurdle. It guides reactant molecules into the exact alignment needed to bond, then slips away unchanged, ready to repeat the process millions of times per second.',
    example: 'Your car’s catalytic converter uses platinum and rhodium meshes to turn toxic carbon monoxide and unburnt hydrocarbons into harmless carbon dioxide and nitrogen before they exit the tailpipe.',
    source: 'Jöns Jacob Berzelius, Edinburgh New Philosophical Journal (1836)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Catalysis',
  },

{
    id: 'ionic-bonding',
    term: 'Ionic Bonding',
    subject: 'chemistry',
    letter: 'I',
    tagline: 'Opposite charges, holding on as hard as they can.',
    explanation: 'When a metal atom gives an electron to a non-metal, both end up more stable as ions with full outer shells. The attraction between the resulting positive and negative ions is what holds a crystal together.',
    example: 'Sodium chloride is just sodium ions and chloride ions in a repeating cube. Cut a grain of table salt in half and you have half as much salt; the arrangement extends beyond anything you can hold.',
    source: 'Kossel, "Valence and the periodic law" (1916)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Ionic_bonding',
  },

{
    id: 'covalent-bonding',
    term: 'Covalent Bonding',
    subject: 'chemistry',
    letter: 'C',
    tagline: 'Atoms that keep their electrons and share them instead.',
    explanation: 'Two non-metal atoms can be more stable together than apart by pooling their outer electrons into a shared pair. Neither atom gives anything away, and the bond that results explains most of the chemistry of living things.',
    example: 'Water is two hydrogen atoms hooked to one oxygen by two shared pairs. Those two bonds bend to about 104 degrees, and that angle is why water is a liquid at room temperature instead of a gas.',
    source: 'Lewis, "The Bonding of Atoms" (1916)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Covalent_bond',
  },

{
    id: 'ph-level',
    term: 'pH Level',
    subject: 'chemistry',
    letter: 'P',
    tagline: 'A logarithmic scale, which means small moves matter a lot.',
    explanation: 'pH measures how acidic or alkaline a solution is, and because it counts powers of ten each step is a tenfold jump. Being logarithmic is the detail people miss: pH 3 is not twice as acidic as pH 6, it is a thousand times.',
    example: 'Human stomach fluid sits near pH 1.5, roughly a thousand times more acidic than cola at 3.4, which is why a stomach burn feels like it does. Lemon juice is around 2, and baking soda dissolved in water around 8.',
    source: 'Sorensen, "Ein Versuch zur analytischen Behandlung des Kohlendioxidats" (1909)',
    sourceUrl: 'https://en.wikipedia.org/wiki/PH',
  },

{
    id: 'oxidation-reduction',
    term: 'Oxidation-Reduction',
    subject: 'chemistry',
    letter: 'O',
    tagline: 'Electrons changing hands, and that is the whole story.',
    explanation: 'Oxidation is losing electrons and reduction is gaining them, and they always happen together because the electrons have to go somewhere. The two words are defined by electron flow, not by oxygen, despite what the names suggest.',
    example: 'Iron rusting is iron atoms losing electrons to oxygen. Your car battery discharging is the same pair of reactions run backwards, which is why charging a battery is a matter of pushing electrons back up the hill.',
    source: 'Lavoisier, "Recherches sur la combustion en general" (1772)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Redox',
  },

{
    id: 'le-chatelier',
    term: "Le Chatelier's Principle",
    subject: 'chemistry',
    letter: 'L',
    tagline: 'A system pushes back against whatever disturbs it.',
    explanation: 'A chemical reaction at equilibrium can be pushed to one side or the other, and when you change the pressure, temperature, or concentration, the mixture shifts to partly undo your change. It is why a reaction is not frozen but constantly adjusting.',
    example: 'In the Haber process that makes ammonia, raising the pressure shifts the equilibrium toward product because four moles of gas become two. The reaction gives ground rather than refusing outright.',
    source: 'Le Chatelier, "Recherches sur les equilibres chimiques" (1884)',
    sourceUrl: "https://en.wikipedia.org/wiki/Le_Chatelier's_principle",
  },

{
    id: 'isotopes',
    term: 'Isotopes',
    subject: 'chemistry',
    letter: 'I',
    tagline: 'Same element, different number of neutrons.',
    explanation: 'An element is defined by its proton count, which leaves the neutron count free to vary, and the resulting atoms differ in mass while keeping identical chemistry. That single difference explains why carbon dating works and why a blade of grass is not a diamond.',
    example: 'Carbon-12 and carbon-14 both have six protons. Carbon-14 is unstable and decays, which is what lets archaeologists date once-living material; carbon-12 is stable, which is why it makes up about 99 percent of natural carbon.',
    source: 'Soddy, "The Origins of the Isotopes" (1921)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Isotope',
  },

{
    id: 'half-life',
    term: 'Half-Life',
    subject: 'chemistry',
    letter: 'H',
    tagline: 'The time for half of it to go, not the time for all of it.',
    explanation: 'Half-life is how long it takes for half the atoms in a sample to decay, and it never changes no matter how many are left. It also never quite reaches zero, only keeps approaching it, which is why you can date something a billion years old.',
    example: 'After 5,730 years a carbon-14 sample is half gone; after 11,460 it is a quarter. The 3,210 years of radiocarbon already present when the tree died is a correction every calculation has to subtract.',
    source: 'Rutherford, "Radioactive Change" (1903)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Half-life',
  },

{
    id: 'valence-electrons',
    term: 'Valence Electrons',
    subject: 'chemistry',
    letter: 'V',
    tagline: 'The outer ring decides almost everything a molecule will do.',
    explanation: 'Atoms are generally keen to reach a full outer shell, and the electrons in that outermost shell are the ones available for bonding. Change which shell is the outside one and you change the element completely.',
    example: 'Sodium has one outer electron and gives it away easily, making it violently reactive. Neon has a full outer shell and has nothing to offer anyone, which is why it sits in a jar and does nothing at all.',
    source: 'Kossel, "Valence and the periodic law" (1916)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Valence_(chemistry)',
  },

{
    id: 'free-radical',
    term: 'Free Radical',
    subject: 'chemistry',
    letter: 'F',
    tagline: 'A molecule missing an electron, and desperate to pair up.',
    explanation: 'When a covalent bond breaks evenly, both halves leave with one electron each, and each is now highly reactive because it is lonely and has a spare hand. These fragments chain together, attacking whatever they meet first.',
    example: 'A tan line is a controlled radical attack: ultraviolet light splits a fatty acid in skin and the resulting radicals trigger melanin production. It is the same chemistry, in a place you can see.',
    source: 'Gomberg, "The Radical Hypothesis" (1897)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Free_radical',
  },

{
    id: 'concentration',
    term: 'Concentration',
    subject: 'chemistry',
    letter: 'C',
    tagline: 'How much of a thing is dissolved in how much of a solution.',
    explanation: 'Concentration turns an intuitive idea into a number you can calculate with, usually in moles per litre. Moles exist because counting atoms is impossible, so chemists count them by mass using molar mass instead.',
    example: 'A 1 M solution of sodium chloride means one mole of salt, about 58.5 grams, in exactly one litre of water. A 0.1 M solution has one tenth as much and reacts one tenth as fast for a first-order reaction.',
    source: 'Avogadro, "Essai sur la determination des masses atomiques" (1811)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Molar_concentration',
  },

{
    id: 'electrolysis',
    term: 'Electrolysis',
    subject: 'chemistry',
    letter: 'E',
    tagline: 'Using electricity to force a reaction that will not happen alone.',
    explanation: 'Pass current through a solution and the ions inside are driven to opposite electrodes, where even the weakest reactions can be forced. It is the opposite of a battery, which uses a reaction to make current.',
    example: 'Aluminium is too reactive to be found naturally as metal, so it is refined by passing current through molten alumina. The metal you drink from a can began as a molecule that had to be broken apart electrically.',
    source: 'Faraday, "On Faradaic laws" (1833)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Electrolysis',
  },
];
