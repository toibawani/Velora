/**
 * Every difficult word in the history levels, defined once.
 *
 * Same file, same shape and same contract as the physics and philosophy
 * glossaries, because the brief asked for one tooltip system rather than a third
 * one bolted on for this subject. <GlossaryTerm> reads all three files through a
 * single lookup, so a term written as {{feudalism}} in a history level gets the
 * identical control a reader met in the other material.
 *
 * The definitions are written for a reader who has not studied history, and each
 * is short enough to read without losing the sentence they were in. The length
 * bound in glossary.test.ts holds that line: past roughly 400 characters a gloss
 * has stopped being a gloss.
 *
 * `see` chains a term to a simpler one, so reading "historiography" does not
 * require having already read "primary source". Chains are followed one level
 * deep, and a chain that loops or points at nothing fails a test.
 */

export interface GlossaryEntry {
  /** Matches what is written inside {{double braces}} in the level data. */
  term: string;
  definition: string;
  /** A simpler term to point at, when this one rests on another. */
  see?: string;
}

const TERMS: GlossaryEntry[] = [
  // --- The methods, named first so the levels can lean on them -------------
  {
    term: 'primary source',
    definition:
      'A record made at the time by someone who was there or near it - a treaty, a letter, a court transcript, a census, an inscription. It is the closest thing history has to direct evidence, though it is still written by someone with a point of view.',
    see: 'historiography',
  },
  {
    term: 'historiography',
    definition:
      'The study of how history has been written and by whom. Two historians can agree on the same events and disagree sharply about what they mean, often because they read different sources or ask different questions of them.',
  },
  {
    term: 'periodisation',
    definition:
      'The dividing of continuous time into named chunks - classical, medieval, modern - so that a period can be talked about at all. The boundaries are arguments, not facts: what counts as the end of the Middle Ages has been contested for two centuries.',
  },
  {
    term: 'whig history',
    definition:
      'History written as a march of progress, with the present as the goal and the past as stages on the way. The term is used mostly critically now, after historians noticed how many tidy upward arcs turned out to have been tidied.',
    see: 'historiography',
  },
  // --- Ancient and medieval ------------------------------------------------
  {
    term: 'hieroglyph',
    definition:
      'A picture-sign used in ancient Egyptian writing. It could record a name, a title, or a whole sentence, and scribes had to know hundreds to read it - it was a professional skill, not a code anyone could crack.',
  },
  {
    term: 'polis',
    definition:
      'An independent city-state of ancient Greece, with its own citizens, law, and decisions. Athens and Sparta were two of hundreds, not two halves of one country.',
  },
  {
    term: 'democracy',
    definition:
      'Rule by the many. The Greek version meant something narrower than the modern one: only free adult men were citizens, so at Athens in 400 BCE the electorate was perhaps a fifth of the adult male population and a smaller fraction of everyone.',
    see: 'polis',
  },
  {
    term: 'republic',
    definition:
      'A state without a monarch, in which offices are held by election or lot and held to limits. Rome\'s lasted about five centuries and is the model most later republics were built from or against.',
  },
  {
    term: 'patrician',
    definition:
      'In Rome, a member of an old aristocratic family. Plebeians were everyone else. The distinction mattered legally as well as socially for most of Roman history before a series of reforms closed it.',
  },
  {
    term: 'dynasty',
    definition:
      'A ruling family, and with it the idea that rule passes within one lineage rather than being chosen. Dynasties make succession stable, which is why they are everywhere in imperial history.',
  },
  {
    term: 'feudalism',
    definition:
      'The system of land-for-obligation that organised much of medieval Europe: a lord granted land in return for service, and peasants worked it. Historians now treat it as later and looser than the tidy model once taught.',
    see: 'manorialism',
  },
  {
    term: 'manorialism',
    definition:
      'The everyday economics of a medieval estate, where land, a dependent peasantry, and a lord were bound together on one holding. It is the plainer cousin of feudalism and sometimes the more accurate word.',
    see: 'feudalism',
  },
  {
    term: 'schism',
    definition:
      'A formal split within a body that had been one - the division of Christendom into Catholic and Eastern churches, or the break that produced Protestantism. A schism names a division that already had a single body to divide.',
  },
  {
    term: 'indulgence',
    definition:
      'Originally a remission of a penance a church had imposed. From the late medieval period they were also sold as a way to reduce time owed in purgatory, which is what made them the spark of the Reformation.',
  },
  // --- Early modern and empire ---------------------------------------------
  {
    term: 'absolutism',
    definition:
      'The concentration of power in a monarch not answerable to a standing body. Louis XIV\'s "L\'etat, c\'est moi" is the usual shorthand, though English and Japanese rulers reached comparable centralisation with different institutions.',
  },
  {
    term: 'enlightenment',
    definition:
      'The eighteenth-century movement of writers who treated reason, comparison, and doubt as tools for reform. Its slogan was often that religion had caused the wars and that testing institutions would do better.',
  },
  {
    term: 'colonialism',
    definition:
      'Rule by one country over peoples in another, usually across a sea, for extraction as much as for settlement. The word carries an argument inside it: whether it names a shared experience or one people\'s view of what it did to another is still argued.',
  },
  {
    term: 'imperialism',
    definition:
      'A policy of expanding power over other states, whether by conquest, annexation, or spheres of influence. It is broader than colonialism, which is one means empires have used.',
    see: 'colonialism',
  },
  {
    term: 'suffrage',
    definition:
      'The right to vote. "Universal suffrage" names a specific set of exclusions - property, sex, race, literacy - that were removed at different times in different countries and are still the subject of movements.',
  },
  {
    term: 'appeasement',
    definition:
      'A policy of making concessions to an aggressive power to avoid war, most associated with Britain and France toward Hitler in the 1930s. Whether it was cowardice, a rational reading of unreadable German aims, or diplomacy with no alternative is still argued.',
  },
  {
    term: 'decolonisation',
    definition:
      'The process by which colonies become independent states, largely after 1945. Calling it a single event flatters what were many local struggles against very different empires.',
    see: 'colonialism',
  },
  {
    term: 'containment',
    definition:
      'The post-1945 American policy of keeping Soviet expansion from spreading, whatever the cost. It shaped four decades of alliances, wars, and arms spending and is still debated for what it cost and what it bought.',
  },
];

export const GLOSSARY: Record<string, GlossaryEntry> = TERMS.reduce(
  (acc, entry) => {
    // Throwing here rather than overwriting means a duplicate is caught at import
    // time, in every subject, not only when a test happens to run.
    if (acc[entry.term]) {
      throw new Error(`history glossary: "${entry.term}" is defined twice`);
    }
    acc[entry.term] = entry;
    return acc;
  },
  {} as Record<string, GlossaryEntry>
);

export const GLOSSARY_TERMS = TERMS.map((entry) => entry.term);

export const lookupTerm = (term: string): GlossaryEntry | undefined => GLOSSARY[term];