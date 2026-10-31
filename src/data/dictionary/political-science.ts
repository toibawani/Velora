import type { DictionaryTerm } from './types';

/**
 * Curious Dictionary: Political Science.
 *
 * Filed under the subject it belongs to rather than under whichever file
 * it happened to be typed into, so adding a term means opening one file and
 * the compiler checks it against DictionaryTerm while you type.
 */
export const POLITICAL_TERMS: DictionaryTerm[] = [
{
    id: 'separation-of-powers',
    term: 'Separation of Powers',
    subject: 'political-science',
    letter: 'S',
    tagline: 'Dividing government into competing branches so no single person holds total sway.',
    explanation: 'Montesquieu observed that any person given unchecked power will naturally abuse it. By splitting government into three distinct branches—legislative (makes laws), executive (enforces laws), and judicial (interprets laws)—each branch checks the ambitions of the others.',
    example: 'In the United States, Congress passes a budget, the President can veto it, Congress can override the veto with a two-thirds majority, and the Supreme Court can strike the resulting statute down if it violates constitutional rights.',
    source: 'Baron de Montesquieu, The Spirit of the Laws (1748)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Separation_of_powers',
  },

{
    id: 'tragedy-of-the-commons',
    term: 'Tragedy of the Commons',
    subject: 'political-science',
    letter: 'T',
    tagline: 'When individually rational self-interest leads to collective ruin of shared resources.',
    explanation: 'When a resource is open to everyone with no property boundaries or collective rules—like ocean fish stocks, clean air, or public pastures—every user gains 100% of the benefit from taking one more unit, while sharing the degradation with everyone else. Left unregulated, ruin is the logical destination.',
    example: 'Overfishing in international waters: if a boat skipper holds back out of environmental concern, other trawlers simply take those fish anyway. Without binding international treaties, everyone rushes to harvest until the fishery collapses.',
    source: 'Garrett Hardin, Science (1968) / Elinor Ostrom, Governing the Commons (1990)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Tragedy_of_the_commons',
  },

{
    id: 'judicial-review',
    term: 'Judicial Review',
    subject: 'political-science',
    letter: 'J',
    tagline: 'The courts deciding what laws are allowed to mean.',
    explanation: 'Judicial review lets a court strike down a law that conflicts with a constitution. It was barely used for its first 150 years, and a constitutional system can have either a strong version of it or none at all.',
    example: 'Marbury v. Madison in 1803 set the United States on the strong footing, striking down a federal law over a minor point of procedure. Britain, by contrast, has no written constitution and no court with that power.',
    source: 'Marbury v. Madison, 5 U.S. 137 (1803)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Judicial_review',
  },

{
    id: 'federalism',
    term: 'Federalism',
    subject: 'political-science',
    letter: 'F',
    tagline: 'Two governments, one of them legally above the other.',
    explanation: 'Federalism splits power between a national government and regional ones, each with its own authority. The usual tension is not who is stronger in law but who pays for what, because that is where the disputes actually happen.',
    example: 'Medicaid is jointly funded but jointly administered, and that shared arrangement has produced decades of litigation between states and the federal government over reimbursement rates. A clean division of powers would not need a lawsuit to resolve it.',
    source: 'Hamilton, Federalist No. 15 (1780)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Federalism',
  },

{
    id: 'separation-church-state',
    term: 'Separation of Church and State',
    subject: 'political-science',
    letter: 'S',
    tagline: 'Government decides, and it decides for everyone.',
    explanation: 'The idea is not that religion must be private or that government should be atheist, but that the state cannot assume any one religious position when it binds people who disagree. It is a rule about the reasons a government may give, not about how religious its citizens are.',
    example: 'In Everson v. Board of Education (1947), the US Supreme Court struck down a New Jersey program paying for children to be taken to religious school, which remains the strongest statement of the principle in the country.',
    source: 'Jefferson, "A Well-Regulated Militia" letter to Mazzei (1809)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Separation_of_church_and_state_in_the_United_States',
  },

{
    id: 'gerrymandering',
    term: 'Gerrymandering',
    subject: 'political-science',
    letter: 'G',
    tagline: 'Drawing the lines so one party cannot lose.',
    explanation: 'Electoral districts are drawn by whoever won the previous election, and because districts are not equally sized or equally shaped, those lines can be arranged to reliably favour a party. It is the one place in a democracy where the rules are set by the people they decide.',
    example: 'The term was coined in 1812 after the district drawn for one Massachusetts legislator was so contorted that a newspaper cartoon showed it shaped like a salamander, and the name stuck.',
    source: 'Elbridge Gerry, "The Gerrys and the Men of the People" (1812)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Gerrymandering',
  },

{
    id: 'rule-of-law',
    term: 'Rule of Law',
    subject: 'political-science',
    letter: 'R',
    tagline: 'The law applies to the people who made it too.',
    explanation: 'The rule of law is the idea that government decisions come from published rules applied consistently, including to those in power. It is distinct from having laws at all, since plenty of regimes have extensive law codes and no rule of law.',
    example: 'The 1946 Nuremberg trials put senior officials on trial under a legal standard that had not existed before, precisely because those officials had governed a state where no law bound them. That is what the concept is for.',
    source: 'Albert Venn Dicey, Introduction to the Study of the Law of the Constitution (1885)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Rule_of_law',
  },

{
    id: 'habeas-corpus',
    term: 'Habeas Corpus',
    subject: 'political-science',
    letter: 'H',
    tagline: 'Show me the reason you are holding someone.',
    explanation: 'Habeas corpus is a court order requiring that a detained person be brought before a judge, so the lawfulness of the detention can be examined. It is often called the cornerstone of liberty because it is what makes unlawful imprisonment contestable.',
    example: 'The writ was suspended in the UK repeatedly during the Irish conflict, and in the US it was suspended by Lincoln in 1861 and by Wilson in 1918. Each suspension prompted a fight over whether the executive may suspend it, and none of those fights fully settled the question.',
    source: ' habeas corpus, 29 Car. 2 c. 9 (1679)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Habeas_corpus',
  },

{
    id: 'civil-disobedience',
    term: 'Civil Disobedience',
    subject: 'political-science',
    letter: 'C',
    tagline: 'Breaking an unjust law openly, and taking the penalty.',
    explanation: 'Civil disobedience is a public, non-violent refusal to obey a law on grounds that obedience would contradict a deeper moral principle. Accepting the punishment is part of the definition, which is what separates it from ordinary protest.',
    example: 'The Salt March of 1930, where Gandhi walked 385 km to the sea to make salt illegally, was obeyed in the open and the participants went to prison for it. That contrast with a hidden breach is what made the tactic politically effective rather than merely illegal.',
    source: 'Thoreau, "Resistance to Civil Government" (1849)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Civil_disobedience',
  },

{
    id: 'filibuster',
    term: 'Filibuster',
    subject: 'political-science',
    letter: 'F',
    tagline: 'Talking until the other side gives up on the clock.',
    explanation: 'A filibuster is a procedural tactic to block a vote by extending debate, most famously in the US Senate. It is not in the rules; it is a consequence of a general right to unlimited debate, which the Senate never saw fit to limit.',
    example: 'The 2013 filibuster of the Comprehensive Immigration Reform Act ran for 21 hours of continuous speaking. The nuclear option that followed in 2013 closed the debate for certain categories of nomination, cutting the tactic back sharply.',
    source: 'Senate Rule XXII, Standing Rules of the Senate',
    sourceUrl: 'https://en.wikipedia.org/wiki/Filibuster',
  },

{
    id: 'universal-suffrage',
    term: 'Universal Suffrage',
    subject: 'political-science',
    letter: 'U',
    tagline: 'When the vote stops being for a subset of people.',
    explanation: 'Universal suffrage is the principle that voting rights belong to adult citizens without property, sex, race, or literacy qualifications. Most democracies got there in stages, and the arguments against it were usually arguments about whether particular people were capable of voting.',
    example: 'New Zealand in 1893 was the first self-governing country where women got the vote, by a margin of 13 votes. Britain took until 1918, and the United States fought a civil war and passed three amendments before most of its own citizens could vote.',
    source: 'Property Qualification and the Representation of the People Act (1867)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Women%27s_suffrage',
  },

{
    id: 'lobbying',
    term: 'Lobbying',
    subject: 'political-science',
    letter: 'L',
    tagline: 'Asking the government for something, in public or not.',
    explanation: 'Lobbying is the business of trying to influence what a legislature does, and it is legal in most democracies provided the lobbying is disclosed. The concern is not that it happens but that it is unevenly available, since access to legislators is expensive.',
    example: 'The Open Lobbying Act of 2007 in the US requires lobbyists to register and disclose their clients and payments quarterly. The disclosure is what turns a private arrangement into something a voter can check.',
    source: 'Title II of the Internal Revenue Code, Lobbying Disclosure Act (2007)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Lobbying',
  },

{
    id: 'constitutional-amendment',
    term: 'Constitutional Amendment',
    subject: 'political-science',
    letter: 'C',
    tagline: 'The only way to change the rules you are playing by.',
    explanation: 'Amending a constitution requires more agreement than passing an ordinary law, often a supermajority in more than one chamber plus ratification by states. The difficulty is deliberate: it makes the legal foundation harder to revise casually.',
    example: 'The US has amended its constitution 27 times, and the first ten were the Bill of Rights, ratified in 1791. The most recent, the 27th, was in 1992, so the record includes long stretches of no change at all.',
    source: 'United States Constitution, Article V',
    sourceUrl: 'https://en.wikipedia.org/wiki/Constitutional_amendment',
  },

{
    id: 'popular-sovereignty',
    term: 'Popular Sovereignty',
    subject: 'political-science',
    letter: 'P',
    tagline: 'The authority comes from the governed, not the ruler.',
    explanation: 'Popular sovereignty holds that legitimate political authority comes from the people and is delegated, not possessed. It is what distinguishes a government from a regime, since a regime can govern a country without having any claim to be authorised by its population.',
    example: 'The US Supreme Court put it plainly in McCulloch v. Maryland in 1819: the people are the sole fountain of all just authority. That case upheld a national bank, which is a much more permissive reading than the sentence alone suggests.',
    source: 'McCulloch v. Maryland, 17 U.S. 316 (1819)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Popular_sovereignty',
  },

  // Six more, because this and mathematics were the two thinnest subjects, and
  // a reader who arrives from a lesson on Rousseau or on electoral systems had
  // nothing to open.
  {
    id: 'oligarchy',
    term: 'Oligarchy',
    subject: 'political-science',
    letter: 'O',
    tagline: 'Rule by the few, whatever the constitution calls itself.',
    explanation: 'An oligarchy is a polity in which power is held by a small group, whether or not its institutions are labelled democratic. Aristotle treated it as the corrupted form of aristocracy: rule by the rich in their own interest rather than rule by the best in everyone\'s.',
    example: 'A country can hold regular elections and still be an oligarchy if candidacy, media and finance are closed to everyone outside a small circle. The test is who could plausibly hold power, not whether a vote takes place.',
    source: 'Aristotle, Politics, Book III (c. 350 BCE)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Oligarchy',
  },

  {
    id: 'social-contract',
    term: 'Social Contract',
    subject: 'political-science',
    letter: 'S',
    tagline: 'Political obligation as an agreement rather than an inheritance.',
    explanation: 'Contract theory explains why anyone has to obey a state by positing an agreement among the governed. Hobbes used it to argue for a sovereign strong enough to prevent civil war, Locke to argue that a government which breaks its trust can be replaced, and Rousseau to argue that legitimate authority is the general will rather than any individual\'s.',
    example: 'Rawls reused the device as a test rather than a history: choose the rules you would accept before knowing what position you would occupy under them. That is the veil of ignorance, and it is a contract argument with no claim that any such meeting ever happened.',
    source: 'Hobbes, Leviathan (1651)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Social_contract',
  },

  {
    id: 'technocracy',
    term: 'Technocracy',
    subject: 'political-science',
    letter: 'T',
    tagline: 'Government by expertise, selected for knowledge rather than for votes.',
    explanation: 'Technocracy holds that decisions should be made by people with the technical knowledge to make them, and that political competition selects for persuasion rather than competence. The objection is not that expertise is worthless but that technical questions and distributive questions are different, and the second cannot be settled by measurement.',
    example: 'Central banks are deliberately insulated from elections because monetary policy is thought to need independence from short-term politics. That insulation is a technocratic arrangement sitting inside a democracy, and it is contested every time interest rates rise.',
    source: 'Veblen, The Engineers and the Price System (1921)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Technocracy',
  },

  {
    id: 'proportional-representation',
    term: 'Proportional Representation',
    subject: 'political-science',
    letter: 'P',
    tagline: 'Seats in proportion to votes, rather than one winner per district.',
    explanation: 'Under proportional representation, parties receive seats roughly in proportion to their share of the vote, usually from multi-member districts or a national list. It tends to produce more parties and coalition governments, and it makes it much harder for a party with a minority of votes to govern alone.',
    example: 'A party with 20% of the vote wins about 20% of the seats, where first-past-the-post in single-member districts might give it none at all. The trade is that voters choose a party list rather than a named local representative, and forming a government can take weeks of negotiation.',
    source: 'Mill, Considerations on Representative Government (1861)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Proportional_representation',
  },

  {
    id: 'electoral-college',
    term: 'Electoral College',
    subject: 'political-science',
    letter: 'E',
    tagline: 'The body that actually elects the American president.',
    explanation: 'In the United States the president is chosen by electors apportioned to states, not by the national popular vote. Each state gets electors equal to its members of Congress, and most award all of theirs to the state\'s winner, which is how a candidate can win the presidency while losing the popular vote.',
    example: 'That has happened five times, most recently in 2016, when the winner received about 2.9 million fewer votes than the runner-up. The mechanism also concentrates campaigning on a handful of competitive states rather than on the country as a whole.',
    source: 'United States Constitution, Article II, Section 1',
    sourceUrl: 'https://en.wikipedia.org/wiki/United_States_Electoral_College',
  },

  {
    id: 'civil-liberties',
    term: 'Civil Liberties',
    subject: 'political-science',
    letter: 'C',
    tagline: 'The protections a majority cannot simply vote away.',
    explanation: 'Civil liberties are limits on what the state may do to a person - speech, assembly, religion, a fair trial, freedom from arbitrary detention - as distinct from civil rights, which concern equal treatment between groups. Liberties constrain the state directly; rights are claimed against discrimination.',
    example: 'The First Amendment protects speech the majority dislikes, which is the only case in which the protection does any work. A guarantee that covered only popular opinions would never need to be written down.',
    source: 'United States Bill of Rights (1791)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Civil_liberties',
  },
  {
    id: 'single-transferable-vote',
    term: 'Single Transferable Vote',
    subject: 'political-science',
    letter: 'S',
    tagline: 'Rank the candidates, and surplus votes move to the next preference instead of being wasted.',
    explanation: 'Voters rank candidates in multi-member districts. Anyone reaching a quota is elected, their surplus transfers at a reduced value, and the lowest candidate is eliminated until the seats are filled. Because a vote can help elect a second-choice candidate after the first is safe, far fewer ballots end up counting for nobody.',
    example: 'Ireland uses it for the Dáil and Malta for parliament, and Scotland uses a related version for local councils. In a district with four seats and a quota near twenty per cent, a party with fifteen per cent of first preferences can still win a seat, which plurality rules would deny it.',
    source: 'Thomas Hare, The Machinery of Representation (1857)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Single_transferable_vote',
  },
];
