import { HistoryLevel } from './schema';

/**
 * Level 4: the century of wars.
 *
 * The First World War - the entry this subject was pointed at, because the causes
 * of it are the most argued causation question in modern history - plus the two
 * twentieth-century continuities that grew out of it, decolonisation and the Cold
 * War.
 *
 * This level is 'disputed' throughout, and that is the honest report: by the
 * twentieth century the events are densely recorded but the reasons are exactly
 * what historians fight over. Having found the pattern in the ancient levels -
 * where the record is thinner but the label was well-documented because the
 * sources carry it - and here, where the record is rich but the label is disputed
 * because reading it does not settle meaning, is the clearest demonstration that
 * history's status vocabulary is neither the physics nor the philosophy one and
 * should not have been either.
 */
const LEVEL_4: HistoryLevel = {
  id: 'the-century-of-wars',
  number: 4,
  title: 'The century of wars',
  blurb: 'The First World War, and the two twentieth-century orders it made.',
  intro:
    'By 1914 the first level\'s question - how do large states govern together - had been answered by machinery, not argument: mass conscription, rail transport, machine guns, and poison gas, all industrial products. This level is about what that capacity made possible and how the world that followed tried to restrain it. Every entry here is disputed or contested, and the level intro says so up front, because a reader who does not expect the label will read these as settled and then meet an argument.',
  entries: [
    {
      id: 'world-war-one',
      name: 'World War I',
      simple:
        'In 1914 an argument in the Balkans pulled in every major power through alliance, and the war killed over seventeen million people. Whether it was a tragedy, a blunder, or a civil war among empires is still argued.',
      deeper:
        'The immediate cause is narrow: on 28 June 1914 Archduke Franz Ferdinand, heir to Austria-Hungary, was assassinated in Sarajevo by Gavrilo Princip, a Bosnian Serb nationalist. That is the spark, not the reason, and historians have argued about the reason for decades. The older "war guilt" reading held Germany chiefly responsible; Fritz Fischer\'s 1961 work The Griff nach der Weltmacht revived the case that German policy before the war was deliberately expansionist, and it remains mainstream. Against it, historians like Christopher Clark, in The Sleepwalkers (2012), argue July-August 1914 is better described as a shared failure of diplomacy among several powers than as one country\'s plot - Serbia\'s overreach, Russia\'s mobilisation, Germany\'s blank cheque to Austria, France and Britain\'s responses. What none of this disputes is the alliance system that turned a Balkan crisis into a world war: France and Russia backed Serbia, Germany backed Austria-Hungary, and Britain entered on Belgium\'s side. The war\'s consequences - roughly 17 million dead, the collapse of four empires, the League of Nations - set up the rest of this level.',
      matters:
        'It is the hardest causation question in modern European history and the reason the discipline needs the disputed label at all: the events are certain, and even after a century the reason is not. Reading this as settled is the most common error in popular accounts of 1914, and it is the question {{appeasement}} has to live inside thirty years later.',
      status: 'disputed',
      source:
        'Fischer, The Griff nach der Weltmacht (1961) for the expansionist reading; Clark, The Sleepwalkers (2012) for the shared-diplomatic-failure reading; standard scholarship dating the outbreak to the July Crisis of 1914 and the alliance system',
      sourceUrl: 'https://en.wikipedia.org/wiki/World_War_I',
    },
    {
      id: 'decolonisation',
      name: 'Decolonization',
      simple:
        'After 1945 the empires from the last two levels came apart, and a majority of the world\'s people became independent states in a few decades. It was many local struggles, not one event.',
      deeper:
        'Calling decolonisation a single event is the error the entry avoids, because it was dozens of different struggles against different empires, won by different means. India\'s independence movement was nonviolent civil disobedience under Gandhi and the Congress Party, ending in independence in 1947 amid a partition that killed in the region of a million people and created Pakistan and what is now Bangladesh. Algeria\'s war against France was violent, from 1954 to 1962. Many African states became independent in the 1950s and 1960s through negotiated transfers after the Second World War weakened the European powers. What united them was that European colonial rule had depended on those powers being strong, and the two world wars had spent that strength. The historiographical argument is whether this was colonial withdrawal at the point of weakness or a continuation of European power by other means - the last entry in this level, {{containment}}, has a stake in that. The processes were local and specific; the timing was global.',
      matters:
        'It corrects the reflexive telling of decolonisation as a clean second act of the Age of Exploration. Each independence was its own negotiation or war, and the cost varied enormously - from a largely peaceful transition to a partition that killed a million - which a single word cannot hold.',
      status: 'disputed',
      source:
        'Indian independence and partition, 1947; the Algerian war, 1954-1962; the post-1945 negotiation of African independence; the standard argument over whether decolonisation was retreat or a continuation of empire by other means',
      sourceUrl: 'https://en.wikipedia.org/wiki/Decolonization',
    },
    {
      id: 'cold-war',
      name: 'Cold War',
      simple:
        'From roughly 1947 to 1991 the United States and the Soviet Union divided the world between them without ever fighting directly, and the division shaped everything from science funding to the space race.',
      deeper:
        'The {{containment}} policy - keeping Soviet expansion from spreading, whatever the cost - was the organising idea, and it is debated for what it bought and what it cost. It kept a second world war from happening between the two blocs, but it also cost enormous sums, backed regimes that repressed their own people, and made several proxy wars - Korea, Vietnam - into hot wars that the superpowers fought without fighting each other. The rivalries reached into science directly: the space race and the arms race are the same competition seen from two ends. The Cold War ended without a treaty, which is unusual for a conflict of that size; it ended when the Soviet economy could not sustain the race and the Soviet bloc broke up in 1990-91. The entries before it - the origins of the First World War, and {{appeasement}} toward a Germany that had already taken the Sudetenland in 1938 - are the run-up, and reading them together is how this level resists telling itself as a chapter that begins in 1945 out of nowhere.',
      matters:
        'It connects the last two levels. {{appeasement}} toward an expansionist Germany is not a separate story from containment around the Soviet Union - both are attempts to stop a major power overturning the order, and the difference in outcome is one of the biggest live questions in how this period is taught.',
      status: 'disputed',
      source:
        'Truman Doctrine address (March 1947) as the primary statement of containment; the standard debate over the costs and benefits of containment from Korea and Vietnam to the dissolution of the USSR in 1991',
      sourceUrl: 'https://en.wikipedia.org/wiki/Cold_War',
    },
  ],
};

export default LEVEL_4;