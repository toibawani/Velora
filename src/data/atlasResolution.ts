/**
 * The one place an Atlas topic turns into something a reader can open.
 *
 * THE BUG THIS FILE EXISTS TO FIX
 * -------------------------------
 * The Atlas (src/data/knowledgeFields.js) lists 573 topics across six fields as
 * plain display strings: 'Motion', 'Stoicism', 'Stone Age'. The content layer
 * (src/data/*Curriculum.js) keys its 13 real lessons by slug: 'newtons-laws',
 * 'stoicism', 'medieval-era'. Nothing joined those two vocabularies.
 *
 * UniverseHome's "Open learning path" did not even try. It called
 * setSelectedSubject() + setLearnView('overview') and threw the selected topic
 * away, so a tap landed on the subject's topic *index* rather than the topic.
 * Three of the six fields (Political Science, Geography, Literature) have no
 * lessonFieldId at all, so those taps produced nothing but a toast reading
 * "coming next".
 *
 * That is one missing binding, not 573 missing topics. A real-browser audit of
 * one topic per discipline (34 probes, scripts/atlasTapAudit.js) found the same
 * result in all 34.
 *
 * WHY A RESOLVER AND NOT 573 WIRES
 * -------------------------------
 * Because the fix has to be total. Adding a route per topic would leave the
 * next 500 topics exactly as dead as these were, and would make "works" and
 * "still broken" differ only by whether someone remembered a line of wiring.
 * Every topic now goes through resolveAtlasTopic(), so a topic either resolves
 * to real content or is honestly reported as unwritten. There is no third state
 * where a tap silently does nothing.
 */

import { CURRICULUM } from './curriculum';

/**
 * 'Motion' -> 'motion'. The display strings in the Atlas are prose-cased and
 * contain punctuation the slugs do not ('Work, Energy & Power', 'Maxwell's
 * Equations'), so any comparison between the two vocabularies has to normalise
 * first or it will miss on the apostrophe alone.
 */
export const slugify = (value: string): string =>
  String(value)
    .toLowerCase()
    // Curly and straight apostrophes are the same character to a reader.
    .replace(/[‘’']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * One flat list of every lesson the curriculum layer can actually open.
 *
 * Built once at module load rather than rebuilt per tap: the Atlas renders a
 * topic list per discipline, and a 573-topic field would otherwise re-flatten
 * the curriculum on every keystroke of the search box.
 */
const LESSON_INDEX: Array<{
  subject: string;
  topicId: string;
  title: string;
  titleSlug: string;
}> = Object.entries(CURRICULUM).flatMap(([subject, curriculum]) =>
  (curriculum?.modules ?? []).flatMap((module) =>
    (module?.topics ?? []).map((topic) => ({
      subject,
      topicId: topic.id,
      title: topic.title,
      titleSlug: slugify(topic.title),
    }))
  )
);
/** An Atlas topic located precisely enough that no two collide. */
export interface AtlasAddress {
  fieldId: string;
  disciplineId: string;
  moduleName: string;
  /** The topic exactly as the Atlas writes it. */
  topic: string;
}

/**
 * What a tap on a topic actually produced.
 *
 * Modelled as a closed union rather than a nullable lesson so that "no content"
 * is a first-class, renderable answer. The previous code represented it as
 * null, which is what let a dead tap look like a slow one.
 */
export type AtlasResolution =
  /** Real lesson content exists. Open it with this subject and topic id. */
  | { kind: 'lesson'; subject: string; topicId: string; title: string; fieldId: string }
  /**
   * Deep multi-level content exists. `levelId` is set when the topic names one
   * level in particular, so a tap on "Free Will" can open the free will level
   * rather than the top of the subject.
   */
  | { kind: 'deep-read'; readId: string; levelId?: string; title: string; fieldId: string }
  /**
   * The topic is a real part of the curriculum but has not been written yet.
   * Named and counted rather than hidden, so an unwritten topic is visible as
   * unwritten and is never dressed up as finished.
   */
  | { kind: 'unwritten'; reason: 'no-content-yet'; title: string; fieldId: string }
  /** The field itself has no curriculum to resolve against. */
  | { kind: 'unmapped-field'; title: string; fieldId: string };

/**
 * Deep reads that are not single lessons.
 *
 * Black holes is the case that made this necessary. Its content is eight
 * levels of structured material, not one LessonReader-shaped lesson, and it
 * predates the Atlas entirely, so nothing in the topic list pointed at it. The
 * Atlas listed 'General Relativity' and 'Special Relativity' as topics with no
 * content behind them while the most-developed material in the app sat
 * unreachable next to it.
 *
 * Philosophy arrived the same way and is the test of whether the first fix was a
 * general one. It was: adding a subject here is a map entry per topic and a level
 * id, and no change to how a tap resolves. `levelId` is the one addition - with a
 * rail of levels, a tap on 'Free Will' should open the free will level rather
 * than the top of the subject, and the anchor is what lets it.
 */
const DEEP_READS: Record<string, { readId: string; title: string; levelId?: string }> = {
  // Keyed by slug of the Atlas topic name.
  'black-holes': { readId: 'black-holes', title: 'Black Holes' },
  'general-relativity': { readId: 'black-holes', title: 'Black Holes' },
  'special-relativity': { readId: 'black-holes', title: 'Black Holes' },

  // Philosophy: the ten topics with entries written, each pointing at the level
  // it lives in. Topics left off this list stay 'unwritten', which is the honest
  // marker and the reason the list is explicit rather than a subject-wide flag.
  reality: { readId: 'philosophy-core', levelId: 'what-is-there', title: 'The big questions' },
  existence: { readId: 'philosophy-core', levelId: 'what-is-there', title: 'The big questions' },
  knowledge: { readId: 'philosophy-core', levelId: 'what-we-can-know', title: 'The big questions' },
  skepticism: { readId: 'philosophy-core', levelId: 'what-we-can-know', title: 'The big questions' },
  morality: { readId: 'philosophy-core', levelId: 'what-we-should-do', title: 'The big questions' },
  consequentialism: { readId: 'philosophy-core', levelId: 'what-we-should-do', title: 'The big questions' },
  identity: { readId: 'philosophy-core', levelId: 'who-we-are', title: 'The big questions' },
  consciousness: { readId: 'philosophy-core', levelId: 'who-we-are', title: 'The big questions' },
  'free-will': { readId: 'philosophy-core', levelId: 'are-we-free', title: 'The big questions' },
  determinism: { readId: 'philosophy-core', levelId: 'are-we-free', title: 'The big questions' },

  // History: twelve entries across five levels, keyed to the exact Atlas topic
  // names. Note these drop leading articles and use the Atlas's z-spelling of
  // "Decolonization", because a key that does not match the topic's slug is the
  // same as no key at all: the topic would show as unwritten while its content
  // sat beside it, unreachable. The test at the bottom of this file asserts every
  // one of these names is a real Atlas topic.
  'ancient-egypt': { readId: 'history-core', levelId: 'ancient-worlds', title: 'History, from the record' },
  'ancient-greece': { readId: 'history-core', levelId: 'ancient-worlds', title: 'History, from the record' },
  'ancient-rome': { readId: 'history-core', levelId: 'ancient-worlds', title: 'History, from the record' },
  reformation: { readId: 'history-core', levelId: 'words-and-numbers', title: 'History, from the record' },
  'scientific-revolution': { readId: 'history-core', levelId: 'words-and-numbers', title: 'History, from the record' },
  'age-of-exploration': { readId: 'history-core', levelId: 'words-and-numbers', title: 'History, from the record' },
  enlightenment: { readId: 'history-core', levelId: 'rights-and-rule', title: 'History, from the record' },
  'french-revolution': { readId: 'history-core', levelId: 'rights-and-rule', title: 'History, from the record' },
  colonialism: { readId: 'history-core', levelId: 'rights-and-rule', title: 'History, from the record' },
  // The numeral in "World War I" slugs to "i", not "one". Spelled the English way
  // here it read as if correct, and the result was a topic reporting itself
  // unwritten while its entry sat in the level above it, unreachable.
  'world-war-i': { readId: 'history-core', levelId: 'the-century-of-wars', title: 'History, from the record' },
  decolonization: { readId: 'history-core', levelId: 'the-century-of-wars', title: 'History, from the record' },
  'cold-war': { readId: 'history-core', levelId: 'the-century-of-wars', title: 'History, from the record' },
};

/**
 * Which curriculum subject an Atlas field resolves to.
 *
 * Only fields with a curriculum can ever produce a lesson. Political Science,
 * Geography and Literature are absent, which is why their taps were inert: the
 * honest answer for them is 'unmapped-field', not a fake destination.
 */
const FIELD_SUBJECT: Record<string, string> = {
  science: 'physics',
  philosophy: 'philosophy',
  history: 'history',
};

/**
 * Resolves one Atlas tap to real content, or to an honest reason there is none.
 *
 * Resolution order matters. Deep reads are checked before curriculum lessons
 * because the black hole levels are richer than any single lesson and are the
 * material that actually exists; a lesson match on 'General Relativity' would
 * otherwise be a downgrade dressed up as a fix.
 */
export const resolveAtlasTopic = ({ fieldId, topic }: AtlasAddress): AtlasResolution => {
  const topicSlug = slugify(topic);

  const deepRead = DEEP_READS[topicSlug];
  if (deepRead) {
    return { kind: 'deep-read', readId: deepRead.readId, levelId: deepRead.levelId, title: deepRead.title, fieldId };
  }

  const subject = FIELD_SUBJECT[fieldId];
  if (!subject) {
    return { kind: 'unmapped-field', title: topic, fieldId };
  }

  // Match on the slug of the title rather than the raw string, so "Stoicism" in
  // the Atlas finds the 'stoicism' lesson even if either side is respelled,
  // repunctuated, or gains a leading article.
  const lesson = LESSON_INDEX.find(
    (entry) => entry.subject === subject && (entry.titleSlug === topicSlug || entry.topicId === topicSlug)
  );

  if (lesson) {
    return { kind: 'lesson', subject: lesson.subject, topicId: lesson.topicId, title: lesson.title, fieldId };
  }

  return { kind: 'unwritten', reason: 'no-content-yet', title: topic, fieldId };
};

/**
 * Counts, per field, how much is written and how much is honestly not.
 *
 * This exists so the Atlas can state its own coverage instead of implying that
 * 573 topics are all one click from a lesson. Before this, every field looked
 * identical from the outside because every tap behaved identically.
 */
export const fieldCoverage = (fieldId: string, topics: string[]) => {
  const tally = { written: 0, unwritten: 0, unmapped: 0 };
  topics.forEach((topic) => {
    const resolution = resolveAtlasTopic({ fieldId, disciplineId: '', moduleName: '', topic });
    if (resolution.kind === 'lesson' || resolution.kind === 'deep-read') tally.written += 1;
    else if (resolution.kind === 'unmapped-field') tally.unmapped += 1;
    else tally.unwritten += 1;
  });
  return tally;
};
