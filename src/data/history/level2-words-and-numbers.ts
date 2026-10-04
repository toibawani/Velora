import { HistoryLevel } from './schema';

/**
 * Level 2: words, numbers, and contact.
 *
 * The Reformation, the Scientific Revolution, and the Age of Exploration - the
 * three transformations that broke the medieval order and, in the case of
 * exploration and colonialism, the ones whose framing is still contested.
 *
 * The Reformation and the Scientific Revolution are 'disputed': the events are
 * documented, but historians argue about whether the causes were chiefly
 * theological or chiefly social and economic, and about whether the Scientific
 * Revolution was one event or a series. The Age of Exploration is 'contested' -
 * not only the interpretation but the word "discovery" is part of the argument,
 * because from the other side it was an invasion.
 */
const LEVEL_2: HistoryLevel = {
  id: 'words-and-numbers',
  number: 2,
  title: 'Words, numbers, and contact',
  blurb: 'The Reformation, the Scientific Revolution, and the voyages that connected oceans.',
  intro:
    'These three run into each other and are hard to date cleanly, which is part of the point. Luther\'s theses were printed in 1517 within a few years of Columbus\'s first voyage; the Scientific Revolution\'s landmark is usually Newton\'s Principia of 1687, a century later. Historians who try to draw a clean line - one thing happened, then another - are usually choosing a date to suit an argument about causation. What is not in dispute is that the same century produced the spread of printing, the collapse of a single authority on how to read scripture, and a permanent geographic fact: the Atlantic is now a highway between continents.',
  entries: [
    {
      id: 'the-reformation',
      name: 'Reformation',
      simple:
        'In 1517 a monk posted ninety-five arguments about indulgences to a church door in Wittenberg, and within a generation western Europe was permanently divided. Whether that was a revival of faith or a European power struggle is still argued.',
      deeper:
        'The spark was a {{schism}} over {{indulgence}}: the Church sold remissions of punishment, and reform-minded theologians - Luther and Calvin among them - argued this had become a transaction, buying a ticket rather than earning forgiveness. Luther\'s ninety-five theses, posted in 1517 and printed across Europe within weeks - print is not incidental here, it is what made a theological dispute into a continental one - said so. What no one predicted from those theses was the birth of Protestantism as a durable system. That took a war: the Schmalkaldic War and, above all, the Thirty Years\' War, which killed a large fraction of some populations of central Europe and ended in 1648 with the Peace of Westphalia. That settlement is the primary source that matters, because it is where Europe agreed - loosely, and not for the last time - that a ruler had the last word inside his own borders, which is a large part of what we now call a nation-state. Why it happened is where historians split: Luther argued it was a return to scripture and a rejection of a corrupt hierarchy, and several major historians agree it was partly a German princes\' bid to escape papal and imperial authority, with peasants using the moment for their own revolt.',
      matters:
        'It shows a religious argument and a political one can be the same event, which is why the entry refuses to pick one as "the" cause. It also produced the modern Westphalian state, so an idea about theology and paper quietly became the border-map of Europe.',
      status: 'disputed',
      source:
        'Luther, Disputation on the Power and Efficacy of Indulgences (1517); the Peace of Westphalia (1648), which ended the Thirty Years\' War; the standard debate between theological and socio-political readings of the Reformation',
      sourceUrl: 'https://en.wikipedia.org/wiki/Reformation',
    },
    {
      id: 'scientific-revolution',
      name: 'Scientific Revolution',
      simple:
        'Between the 1500s and the 1600s, people doing mathematics and astronomy stopped asking why the world was the way it was and started working out how it moved, by calculation. Whether that was one revolution or several is still argued.',
      deeper:
        'The landmark is usually Newton\'s Principia of 1687, which is where you get the modern idea of a law - something true everywhere and always - derived from calculation rather than read off scripture. Before it, the dominant Aristotelian framework put the Earth at the centre and treated the heavens as perfect and unchanging; Copernicus (1543), Kepler\'s laws of planetary motion (1609-1619), and Galileo\'s telescope (1610) had already dismantled that. What makes this entry disputed rather than well-documented is a historiographical fight about whether "the Scientific Revolution" was one thing at all. Alexandre Koyré argued in 1941 that there was no single scientific revolution and no one clean break, only medieval developments accelerating - a position the influential Stephen Shapin took up and developed in 1996. Against them, historians who point to the sustained experimental and mathematical practices - Boyle\'s air pump, the Royal Society\'s motto about distrusting authority - argue a distinctive culture of evidence really did emerge and can be dated to this period. The honest entry says the evidence and the resulting practices are not in doubt; whether that deserves one capitalised name is.',
      matters:
        'It separates finding things out from naming what happened. That natural philosophy became calculation, and institutions that tested claims publicly, are settled. Whether that was one revolution is a question about how to periodise, which is exactly the kind of argument {{periodisation}} exists to prompt.',
      status: 'disputed',
      source:
        'Copernicus, De revolutionibus (1543); Kepler\'s laws (1609-1619); Galileo\'s Sidereus Nuncius (1610); Newton, Principia (1687); the Koyré (1941) versus Shapin (1996) debate over whether there was a single Scientific Revolution',
      sourceUrl: 'https://en.wikipedia.org/wiki/Scientific_Revolution',
    },
    {
      id: 'age-of-exploration',
      name: 'Age of Exploration',
      simple:
        'Fifteenth- and sixteenth-century voyages that joined the Atlantic, Pacific, and Indian oceans into one system. From one side it opened trade and contact; from the other it began the conquest of the Americas, and that framing is itself contested.',
      deeper:
        'Columbus\'s 1492 crossing was the hinge, and the immediate cause was commercial: European demand for pepper and other Asian spices, a trade the overland routes made expensive, and a Portuguese explorer, Bartolomeu Dias, having rounded the Cape of Good Hope in 1488. Columbus was looking for a westward sea route to Asia and instead found the Caribbean. What followed is where the framing matters, and this entry is labelled contested for that reason. Columbus\'s own letter, the one he sent back to Spain describing what he had found, described well-defended villages, generous people, and gold - an account written to persuade a court to fund a third voyage. The fuller record is much darker: smallpox and other diseases killed the overwhelming majority of indigenous peoples within a century or two of first contact, and where we have indigenous accounts, such as those the Aztecs kept after the conquest, they do not describe an encounter of equals. A long-running historiographical disagreement - influenced by the "Black Legend" in Spain\'s favour and, later, by decolonisation - is whether this should be narrated as contact, discovery, conquest, or invasion. The entry takes no side on the label and does settle the facts: the voyages, the deaths, and the fact that the word "discovery" already embeds the European viewpoint.',
      matters:
        'It shows that a framing word is an argument. "Discovery" is not a neutral description of who found what; it decides in advance whose perspective the story is told from, and the deaths of the indigenous population make that framing load-bearing rather than cosmetic.',
      status: 'contested',
      source:
        'Columbus\'s 1492 letter to the Spanish Crown (primary source, written to secure funding); the 1494 Treaty of Tordesillas dividing overseas claims between Spain and Portugal; post-1990 decolonisation scholarship on the scale of indigenous depopulation and indigenous accounts',
      sourceUrl: 'https://en.wikipedia.org/wiki/Age_of_Exploration',
    },
  ],
};

export default LEVEL_2;