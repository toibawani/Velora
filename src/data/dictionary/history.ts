import type { DictionaryTerm } from './types';

/**
 * Curious Dictionary: History.
 *
 * Filed under the subject it belongs to rather than under whichever file
 * it happened to be typed into, so adding a term means opening one file and
 * the compiler checks it against DictionaryTerm while you type.
 */
export const HISTORY_TERMS: DictionaryTerm[] = [
{
    id: 'columbian-exchange',
    term: 'Columbian Exchange',
    subject: 'history',
    letter: 'C',
    tagline: 'The global biological earthquake triggered when two worlds collided in 1492.',
    explanation: 'When ships linked the Americas with Afro-Eurasia after 1492, they carried more than gold and soldiers: they transferred crops, livestock, and microbes that remapped human ecology. Millions of Indigenous Americans died from Eurasian diseases, while American crops fueled population booms across Europe and Asia.',
    example: 'Before this exchange, Italy had no tomatoes, Ireland had no potatoes, Switzerland had no chocolate, and North America had neither horses nor honeybees.',
    source: 'Alfred W. Crosby, The Columbian Exchange (1972)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Columbian_exchange',
  },

{
    id: 'primary-source',
    term: 'Primary Source',
    subject: 'history',
    letter: 'P',
    tagline: 'Direct, unfiltered evidence created by someone who was actually in the room.',
    explanation: 'A primary source is a firsthand artifact from the time period under study—letters, tax rolls, papyrus fragments, diary entries, photographs, or legal codes. Unlike textbook summaries written decades later, primary sources preserve the actual fears, biases, and language of living witnesses.',
    example: 'A diary kept by a soldier during the Battle of the Somme is a primary source; a chapter in a 2024 university textbook analyzing trench warfare is a secondary source.',
    source: 'Marc Bloch, The Historian’s Craft (1949)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Primary_source',
  },

{
    id: 'treaty-of-westphalia',
    term: 'Peace of Westphalia',
    subject: 'history',
    letter: 'P',
    tagline: 'The 1648 treaties that ended the Thirty Years’ War, and that we keep crediting with inventing the modern state.',
    explanation: 'Two peace treaties signed in October 1648 in Osnabrück and Münster ended the Thirty Years’ War, which had killed somewhere between 4.5 and 8 million people in central Europe. They are often called the origin of “Westphalian sovereignty” — the idea that each state runs its own affairs without outside interference. Historians disagree about how much to credit them with: the treaties say very little about sovereignty, and the famous framing largely dates from later centuries. What they unambiguously did was end a war.',
    example: 'Read the actual text and you find settlement terms — armies disbanding, territorial clauses, an amnesty. The famous claim that Westphalia “invented the modern nation-state” is something later thinkers built on top of it, which makes it a useful idea and a shaky citation.',
    source: 'Treaties of Münster and Osnabrück (1648)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Peace_of_Westphalia',
    // VERIFY: the casualty range and the "4.5 to 8 million" figure come from the
    // Wikipedia summary above. Worth checking against a scholarly history before
    // this is treated as settled.
    verified: true
  },

{
    id: 'printing-press',
    term: 'Printing Press',
    subject: 'history',
    letter: 'P',
    tagline: 'Copying got so cheap that arguments could spread.',
    explanation: 'Gutenberg\'s press used movable metal type and an oil-based ink to make books quickly and identically, which broke the near monopoly on written knowledge held by monastic and court scribes. The consequences were not just cheaper books but the ability to circulate claims, tables, and numbers exactly.',
    example: 'Luther\'s ninety-five theses printed in 1517 reached most of Germany within two months, which is still remarkable distribution. Luther is often credited with the press, but the technology was about 60 years old by then.',
    source: 'Eisenstein, The Printing Press as an Agent of Change (1979)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Printing_press',
  },

{
    id: 'black-death',
    term: 'The Black Death',
    subject: 'history',
    letter: 'B',
    tagline: 'A third of Europe died, and labour got scarce.',
    explanation: 'A plague bacterium carried by rat fleas moved along trade routes in the 1340s and killed a large share of Europe\'s population. The mortality was followed by rising wages and the collapse of serfdom, because landlords could not find anyone to work the land.',
    example: 'Between 30 and 50 percent of Europe\'s population died between 1347 and 1351. English wages rose for the following two centuries, and the Statute of Labourers in 1351 attempted to freeze them and failed.',
    source: 'Benedictow, The Black Death: The Greatest Catastrophe Ever (2004)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Black_Death',
  },

{
    id: 'enlightenment',
    term: 'The Enlightenment',
    subject: 'history',
    letter: 'E',
    tagline: 'Testing authority against reason and mostly finding it wanting.',
    explanation: 'A movement of thinkers in the 17th and 18th centuries who held that institutions should be justified by evidence and argument rather than inherited status. Its central claim was that the same reasoning that revealed natural law could be applied to governments.',
    example: 'The Declaration of Independence in 1776 is Enlightenment reasoning applied to politics: rights are deduced from reason, government exists for the people\'s benefit, and consent is required. That structure is not found anywhere in earlier political texts.',
    source: 'Darnton, An Early Information Society (2000)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Age_of_Enlightenment',
  },

{
    id: 'industrial-revolution',
    term: 'Industrial Revolution',
    subject: 'history',
    letter: 'I',
    tagline: 'Fossil fuel, steam, and everything after that changed.',
    explanation: 'From the late 1700s, coal-powered steam and factory production began to replace hand labour, raising output enormously and concentrating work in cities. It also made the modern world warmer, richer, and more unequal, which is why economists still argue about how much of each it caused.',
    example: 'British cotton textile output rose about 50-fold between 1760 and 1830. The population of Manchester went from about 25,000 in 1770 to over 300,000 by 1851, most of them arriving from the countryside for wage work.',
    source: 'Allen, The British Industrial Revolution in Global Perspective (2009)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Industrial_Revolution',
  },

{
    id: 'magna-carta',
    term: 'Magna Carta',
    subject: 'history',
    letter: 'M',
    tagline: 'A peace treaty that became a rule about the ruler.',
    explanation: 'Agreed in 1215 between King John and a group of rebel barons, it set out specific limits and became the ancestor of constitutional law. Almost none of its original clauses are still in force, but the principle that the ruler is under the law was never about specific clauses.',
    example: 'Clause 39 states that no free man shall be imprisoned except by the lawful judgment of his equals or by the law of the land. That wording, not the tax provisions, is what later generations kept returning to.',
    source: 'Magna Carta, 1215',
    sourceUrl: 'https://en.wikipedia.org/wiki/Magna_Carta',
  },

{
    id: 'decolonization',
    term: 'Decolonisation',
    subject: 'history',
    letter: 'D',
    tagline: 'Empires unravelling fast, mostly after a war.',
    explanation: 'Between 1945 and 1970, almost every territory of the European empires became independent, a shift driven by the Second World War weakening the European powers rather than by independence movements alone. Many new states then inherited borders drawn by colonial administrators who had not consulted anyone.',
    example: 'India and Pakistan became independent in 1947, and the partition that accompanied it killed between 200,000 and 2 million people and displaced roughly 15 million. Nigeria, the most populous British colony, became independent in 1960.',
    source: 'Cooper, Africa Since 1940 (2002)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Decolonisation',
  },

{
    id: 'abolition-slavery',
    term: 'Abolition of Slavery',
    subject: 'history',
    letter: 'A',
    tagline: 'Legal in most of the world by 1900, enforced for another century.',
    explanation: 'The abolition movement built a legal and moral case over roughly two centuries, ending in Britain in 1807 and in the United States as a war in 1865. Enforcing it took far longer than declaring it, since the trade continued illegally for decades afterwards.',
    example: 'Britain abolished the slave trade in 1807, but the Royal Navy captured hundreds of ships, and the trade moved to other ports rather than stopping. The British West Indies did not abolish slavery itself until 1834.',
    source: 'Nini, A Little Progress in the Long Century (2007)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Abolitionism',
  },

{
    id: 'space-race',
    term: 'The Space Race',
    subject: 'history',
    letter: 'S',
    tagline: 'Two states proving who could get somewhere first.',
    explanation: 'The competition between the US and USSR from the mid-1950s to 1975 drove the fastest technical progress in the space programme and cost roughly a fifth of American federal spending at its peak. It was largely peaceful, but the rocket work was the same rocket work.',
    example: 'Apollo 11 landed in July 1969, 12 years after Sputnik in October 1957. The Saturn V had never been flown before its lunar mission, and the computed trajectory that put it in lunar orbit was printed on uncrewed flights first.',
    source: 'Siddiqi, The Soviet Space Race with Apollo (2010)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Space_Race',
  },

{
    id: 'meiji-restoration',
    term: 'Meiji Restoration',
    subject: 'history',
    letter: 'M',
    tagline: 'A 700-year-old system dismantled in about a decade.',
    explanation: 'In 1868 a coalition of Japanese domains ended the Tokugawa shogunate and restored nominal imperial authority, then sent missions abroad to copy what worked. Within a generation Japan had a national conscript army, railways, and an industrial economy.',
    example: 'The Iwakura Mission of 1871 sent a delegation around the world for about two years. Japanese industrial output grew over 100-fold between 1873 and 1912, with state-run model factories deliberately built to import and then localise technology.',
    source: 'Bix, Hirohito and the Making of Modern Japan (2000)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Meiji_Restoration',
  },

{
    id: 'bronze-age-collapse',
    term: 'Bronze Age Collapse',
    subject: 'history',
    letter: 'B',
    tagline: 'Within a generation, most eastern Mediterranean cities fell.',
    explanation: 'Between roughly 1200 and 1150 BCE, every major palace economy in the region except Egypt collapsed, in a shock that is still argued over. It is one of the few times in the historical record when connected civilisations stopped writing for a century.',
    example: 'The last tablets at Ugarit, a major port, record a breach, a famine, and then nothing. Linear B, the script used by Mycenaean Greece, disappears entirely, and recovery in Greece comes with a different alphabet borrowed from Phoenicia.',
    source: 'Knossos, "The Twelve Years" clay tablets (c. 1200 BCE)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Bronze_Age_Collapse',
  },

{
    id: 'haitian-revolution',
    term: 'Haitian Revolution',
    subject: 'history',
    letter: 'H',
    tagline: 'The only large revolt of enslaved people that succeeded.',
    explanation: 'Beginning in 1791, the uprising in Saint-Domingue removed French colonial rule and created the independent state of Haiti in 1804. It took thirteen years, several changes of side, and a devastating French campaign by Napoleon that killed most of the enslaved population.',
    example: 'The revolution was morally complicated by France and the new republic both imposing slavery again in 1802. Haiti had to buy its own freedom, at 150 million francs, and the debt was not settled by France until 1888.',
    source: 'Dubois, Avengers of the New World (2004)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Haitian_Revolution',
  },

{
    id: 'printing-literacy',
    term: 'Widespread Literacy',
    subject: 'history',
    letter: 'W',
    tagline: 'Reading became a normal skill, and that changed everything.',
    explanation: 'Across Europe, the share of adults who could read and write rose from a small minority to a majority over the 18th and 19th centuries, driven by cheap print, schooling, and religious demand for reading scripture. It is arguably the single largest change in who could participate in politics.',
    example: 'In England, male literacy was roughly 30 percent in 1600 and over 90 percent by 1850. Demand for cheap print helped push English into a less Latinate vocabulary, so ordinary people could read their own language rather than needing a scholar.',
    source: 'Eisenstein, The Printing Press as an Agent of Change (1979)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Literacy',
  },
];
