import { HistoryLevel } from './schema';

/**
 * Level 3: rights, revolutions, and empire.
 *
 * The Enlightenment's political arguments, the French Revolution that ran them
 * into the street, and the imperial system those arguments were written about.
 *
 * The Enlightenment is 'well-documented' - it is a set of published arguments we
 * can read. The French Revolution is 'disputed' because historians disagree
 * about what drove it, class or politics or fiscal crisis, and whether 1789 or
 * 1793 is the real break. Colonialism is 'contested' for the same reason as the
 * Age of Exploration: the framework, not just the interpretation, is in dispute.
 */
const LEVEL_3: HistoryLevel = {
  id: 'rights-and-rule',
  number: 3,
  title: 'Rights, revolutions, and empire',
  blurb: 'The Enlightenment, the Revolution it promised, and the empires it coexisted with.',
  intro:
    'The three here are usually taught as a straight line - thinkers write, revolutions follow - and the line is wrong in an instructive way. Enlightenment writers were arguing within empires, not outside them; many of the political arguments came from people embedded in colonial systems; and the French Revolution broke as much over whether to abolish slavery as over anything to do with the rights it proclaimed. The reader who expects a clean descent from Locke to 1789 will find instead that the arguments, the revolution, and the empire that funded them were tangled from the start.',
  entries: [
    {
      id: 'the-enlightenment',
      name: 'Enlightenment',
      simple:
        'Eighteenth-century writers - Locke, Montesquieu, Rousseau, Voltaire among them - who treated reason and comparison as tools for improving institutions, and wrote down arguments about rights that revolutions later used.',
      deeper:
        'The content is more specific than "people thought rationally." Locke argued that government exists to protect natural rights - life, liberty, property - and that if it ceases to, the people may break it, a claim made in 1689 in the Two Treatises of Government and used within a century by people who meant it. Montesquieu admired Britain\'s balance of power and is why we have the idea of separation of powers. Rousseau, the contrarian, argued in The Social Contract (1762) that legitimate authority is the general will, which is not the same as what a majority votes for and caused the revolutions to the left. The {{enlightenment}} was not one doctrine but a method - test institutions the way you test a claim - and its heirs disagreed with each other as much as with their opponents. What makes this well-documented rather than merely uncontroversial is that the texts survive: these are published arguments we can read directly, in a way we cannot read a bronze age conversation.',
      matters:
        'It supplies the actual arguments behind the {{suffrage}} and rights language that later revolutions and constitutions used, and it shows that political thought advanced by disagreeing with itself - which is the same point the trolley problem and {{determinism}} entries in Philosophy make from the other direction.',
      status: 'contested',
      source:
        'Locke, Two Treatises of Government (1689); Rousseau, The Social Contract (1762); Montesquieu, The Spirit of the Laws (1748) - all published primary sources, read directly in this entry',
      sourceUrl: 'https://en.wikipedia.org/wiki/Enlightenment',
    },
    {
      id: 'french-revolution',
      name: 'French Revolution',
      simple:
        'In 1789 the French destroyed their monarchy and wrote down rights that did not include most of the people watching. Whether it was a bourgeois revolt, a popular one, or a fiscal accident is the longest argument in French history.',
      deeper:
        'The event everyone knows - the storming of the Bastille on 14 July 1789 - was the visible part of a crisis with specific causes. The crown was broke, partly from decades of war debt and partly from a 1788 bad harvest; the Estates-General was summoned in May 1789 partly to raise more money; and when it met, the third estate declared itself a National Assembly. The Declaration of the Rights of Man and of the Citizen (August 1789) is the primary source that matters, and it is worth reading closely: it declares liberty and equality for all, and then, almost in the next breath, restricts them to men of property and excludes women, colonial subjects, and the enslaved from citizenship. That is not hypocrisy that later ages imposed on it; the wording was debated at the time and passed in that form. The big historiographical split is between the "classical" reading, that it was a bourgeois revolt that ended in a Napoleonic dictatorship, and the "revisionist" reading from the 1970s onward, led by historians like Robert Darnton, which recovered the political role of ordinary people - cobblers, market women - and argued the Terror was more fear than reign of terror. A live third question is whether 1789 or the later revolution of 1793 is the real dividing line between the Enlightenment and the Terror that followed it.',
      matters:
        'It shows a rights document reproducing the exclusions of its own society - a fact that needs no interpretation, only reading - and it is the cleanest case in this subject of the difference between what a revolution says and who it includes, which is why the "disputed" label is doing the honest work here rather than hiding a tidy answer.',
      status: 'disputed',
      source:
        'Declaration of the Rights of Man and of the Citizen (26 August 1789, primary text); the 1788-89 fiscal crisis; the classical versus revisionist historiography (Darnton and others, 1970s onward) over whether 1789 or 1793 is the real break',
      sourceUrl: 'https://en.wikipedia.org/wiki/French_Revolution',
    },
    {
      id: 'colonialism',
      name: 'Colonialism',
      simple:
        'Rule by one country over peoples in another, usually across a sea, for extraction as much as for settlement. Whether the word names a shared experience or one people\'s account of what it did to another is still being argued.',
      deeper:
        'This entry is labelled contested rather than disputed on purpose: the argument is not only about interpretation but about the framing itself. What colonialism was - a system of economic extraction, a variety of experiences under one empire, or an encounter between equals with a power imbalance - determines whose perspective a history of it is written from. The facts are not in contention. Europeans controlled vast overseas territories from roughly 1500 into the twentieth century; the extraction ran through cash crops, forced labour, and chartered trading companies; and where we have the colonized peoples\' own accounts - Las Casas on the Spanish encomienda, later anticolonial writers - they describe coercion, not partnership. What is argued is the unit of analysis. A revision of the field after about 1990, associated with postcolonial scholarship, argued that treating "colonialism" as one phenomenon smoothed over differences that matter, and that "discovery" and "civilising mission" were the colonizer\'s categories, not neutral description. That criticism is itself criticised for, among other things, risking making colonialism the only lens. The settlement this entry can honestly report is that the label is a live {{historiography}}, that the extraction is documented, and that every empire in this level - Britain, France, Spain - went through {{imperialism}} in more than one form.',
      matters:
        'It is where the discipline tests whether it can describe its own categories as contested rather than assuming them. The entry on the Age of Exploration names the word "discovery" as an argument; this one asks the harder question of whether "colonialism" can be described at all without choosing a side, and says plainly that the answer is still being argued.',
      status: 'contested',
      source:
        'Bartholomé de las Casas, Brevísima relación de la destrucción de las Indias (1552, primary account of the encomienda); the post-1990 postcolonial turn in colonial historiography on whether "colonialism" is one phenomenon or many',
      sourceUrl: 'https://en.wikipedia.org/wiki/Colonialism',
    },
  ],
};

export default LEVEL_3;