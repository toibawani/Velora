import { HistoryLevel } from './schema';

/**
 * Level 1: the ancient worlds.
 *
 * Three civilizations that between them invented writing, the city, the
 * republic, and empire - and left written records good enough that we can argue
 * about them with actual documents rather than archaeology alone.
 *
 * This level gets the fuller treatment the brief asked for, because these three
 * are both the most likely to be opened first and the ones where the primary
 * record is richest. Egypt has hieroglyphic inscriptions and Herodotus writing
 * about it in his own time; Greece has Herodotus and Thucydides, who were
 * closer to the events than any modern historian; Rome has Cicero's letters and
 * speeches preserved because they were brilliant. Each entry leans on what those
 * near-contemporaries actually wrote, because the alternative - a smooth
 * textbook narrative - is exactly what this subject is meant to avoid.
 *
 * All three are 'well-documented', and the label is doing real work rather than
 * being the safe default: it is a claim about the survival of the record. What
 * the sources do not settle - why Rome fell, what Egyptian religion believed -
 * is named as unsettled inside the entries rather than tidied by the label.
 */
const LEVEL_1: HistoryLevel = {
  id: 'ancient-worlds',
  number: 1,
  title: 'The ancient worlds',
  blurb: 'Egypt, Greece, and Rome - the three that later ones kept reinventing.',
  intro:
    'These are the civilizations that become the reference points. Greece supplies the vocabulary of politics - democracy, republic, tyranny - that we still argue in. Rome supplies the model of law, citizenship, and empire that Europe kept returning to for two thousand years. Egypt supplies the oldest continuous writing system and the first attempt to run a large state on a calendar. What follows is not a march of progress toward the present - Greece and Rome each fell, and neither was the peak - but three genuinely different answers to the same question about how a lot of people can be governed together.',
  entries: [
    {
      id: 'ancient-egypt',
      name: 'Ancient Egypt',
      simple:
        'A kingdom on the Nile that ran for roughly three thousand years without a break in its ruler - longer than the gap between Cleopatra and the pyramids. It was held together by a bureaucracy of writing, not by conquest.',
      deeper:
        'The thing that makes Egypt legible to us is {{hieroglyph}} writing, and the surprising thing about it is not the pictures but what they were for. Egyptian scribes used it to run the state: recording grain tallies, collecting taxes, tracking labour for irrigation. The monuments everyone photographs were a by-product of an information system. The Nile flooded on a schedule you could predict, and a kingdom that had to feed a large population needed to know how much grain existed and where it was before it could redistribute any of it. Writing was the accounting. Then the accounts turned into history: kings carved their own campaigns and temple dedications into stone, which meant the record of Egypt is overwhelmingly the record of Egypt\'s rulers being described well by themselves. That is why Herodotus, writing from outside, and a man from inside the same century, can disagree with the stone. Herodotus visited Egypt around 450 BCE, several centuries after the interesting period, and reported what he was told - including that the Egyptians had invented slavery, a claim he attributed to the Greeks and did not endorse. The genuinely deep question Egypt raises - why it fell, and whether the Bronze Age collapse was one event or a century of separate ones - the sources do not answer cleanly. So the entry on Egypt is labelled well-documented on the strength of what the inscriptions establish, and the fall is treated as the separate, harder problem it is.',
      matters:
        'It changes what "advanced" means. Egypt had bureaucracy, mathematics, medicine, and monumental architecture without any of the things a textbook implies are required first, and it lasted three times as long as Rome has existed. It also shows why a historian reads with suspicion of a record that praises the rulers it was written by.',
      status: 'well-documented',
      source:
        'Herodotus, The Histories, Book II (on Egypt, c. 450 BCE); the Rosetta Stone (196 BCE) and its decipherment by Champollion (1822); widely accepted Bronze Age collapse scholarship dating it to c. 1200-1150 BCE',
      sourceUrl: 'https://en.wikipedia.org/wiki/Ancient_Egypt',
    },
    {
      id: 'ancient-greece',
      name: 'Ancient Greece',
      simple:
        'A scatter of independent city-states - {{polis}} plural - rather than one country, whose writers invented the political vocabulary and much of the philosophy in this app. They were also almost constantly at war with each other.',
      deeper:
        'The first thing to unlearn is that Greece was one place. It was hundreds of independent cities with their own laws, calendars, and foreign policy, and when the Persians invaded in 480 BCE it was a coalition of them that won, at Plataea, and a handful of ships at Salamis. Athens and Sparta were allies in that and rivals for a hundred years after. The political experiment everyone quotes is narrower than the word suggests. Athens in 400 BCE had {{democracy}} in the strict sense of rule by citizens, but citizens were free adult men, which was perhaps a fifth of the adult male population and a smaller fraction of everyone; women, enslaved people, and resident foreigners had no political voice at all. Athens also went to war for twenty-seven years against Sparta and nearly lost, which is a useful corrective to the idea that it was a serene philosophical place. The writers are closer to their events than any of ours. Thucydides wrote his history of the Peloponnesian War while it was still being fought, and Herodotus interviewed survivors of the Persian Wars. That closeness is why these are primary sources in the strict sense and why disagreements about them - how democratic Athens really was, whether the thinkers were inventing something new - are disagreements about evidence, not just taste.',
      matters:
        'It supplies the words the rest of this app uses. {{republic}}, tyranny, democracy, and the idea that a society can argue with itself in public all come from here, and the entries for the trolley problem and for {{democracy}} in the Philosophy levels are arguing about questions these cities first posed.',
      status: 'well-documented',
      source:
        'Herodotus, The Histories; Thucydides, History of the Peloponnesian War (written c. 400 BCE, contemporary with the war); Athenian democracy and the limits of citizenship are standard in Hellenistic scholarship',
      sourceUrl: 'https://en.wikipedia.org/wiki/Ancient_Greece',
    },
    {
      id: 'ancient-rome',
      name: 'Ancient Rome',
      simple:
        'A city-state that became an empire and gave the West its law, its calendar, and its idea of citizenship. Its founders could not have imagined it, and its fall is still one of the most argued questions in history.',
      deeper:
        'Rome is the hard case for this whole subject because the parts are well documented and the whole is not. We have Cicero\'s letters and speeches because they were brilliant and because people copied them; we have the Twelve Tables of law, the first codification of Roman law, from the fifth century BCE. What we do not have is a single text called "why Rome fell," because no one contemporary thought that was the interesting question - Gibbon wrote it in 1776, thirteen centuries after the last western emperor was deposed, and titled it The History of the Decline and Fall of the Roman Empire. That gap is the whole method of the subject. Gibbon blamed the loss of civic virtue and Christianity; modern historians generally point to frontier pressure, currency debasement, and the fact that the empire was too big and too reliant on soldiers who were increasingly non-citizens to govern it. Every one of those is a {{historiography}} rather than a fact, and the honest entry says so rather than picking one. On the way there, Rome contributed something almost unique: citizenship as a legal status rather than an ethnic fact. A provincial who served in the legions could become a Roman citizen, which is a much more portable idea than Greek identity and one the empire spread everywhere it went. That may be Rome\'s most consequential idea and the least discussed.',
      matters:
        'It separates the well-evidenced from the well-argued in a single subject. We know the law, the calendar, and the succession in detail; we argue about the decline. Reading both with the same confidence, which is what a summary does, loses the distinction the whole discipline rests on.',
      status: 'well-documented',
      source:
        'Gibbon, The History of the Decline and Fall of the Roman Empire (1776); the Twelve Tables (c. 450 BCE); standard Roman constitutional and citizenship scholarship',
      sourceUrl: 'https://en.wikipedia.org/wiki/Ancient_Rome',
    },
  ],
};

export default LEVEL_1;