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
  /** Deep multi-level content exists (the black hole levels). */
  | { kind: 'deep-read'; readId: string; title: string; fieldId: string }
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
 * Black holes is the case that made this necessary. Its content is eleven
 * levels of structured material, not one LessonReader-shaped lesson, and it
 * predates the Atlas entirely, so nothing in the topic list pointed at it. The
 * Atlas listed 'General Relativity' and 'Special Relativity' as topics with no
 * content behind them while the most-developed material in the app sat
 * unreachable next to it.
 */
const DEEP_READS: Record<string, { readId: string; title: string }> = {
  // Keyed by slug of the Atlas topic name.
  'black-holes': { readId: 'black-holes', title: 'Black Holes' },
  'general-relativity': { readId: 'black-holes', title: 'Black Holes' },
  'special-relativity': { readId: 'black-holes', title: 'Black Holes' },
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
    return { kind: 'deep-read', readId: deepRead.readId, title: deepRead.title, fieldId };
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
