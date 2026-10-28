/**
 * Which entries are worth offering next to the one you just opened.
 *
 * Every entry was a dead end: the explanation finished and there was nowhere to
 * go except back to the search box, so following a thread through the
 * dictionary meant remembering a word and typing it. There is no editorial
 * "related" field in the data and inventing one for 138 entries by hand would
 * be a large amount of guesswork with no way to keep it true.
 *
 * So this is derived from what the entries say. Two entries are related when
 * they share distinctive words - five letters or more, not a stop word - with
 * weight given to the term itself, because a shared word in a term ("Angular
 * Momentum" and "Conservation of Momentum") is a stronger signal than a shared
 * word in a paragraph. Same-subject entries get a small bonus, which is the
 * difference between "also physics" and "actually connected", and never enough
 * to beat a real shared concept.
 *
 * It is a heuristic and the screen presents it as "Related" rather than as
 * "prerequisite". A wrong suggestion here costs one click; a wrong claim would
 * cost the reader's trust in the entry itself.
 */
import type { DictionaryTerm } from './types';

/** Words that say nothing about what an entry is about. */
const STOP_WORDS = new Set([
  'about', 'above', 'after', 'again', 'against', 'along', 'among', 'another',
  'because', 'before', 'being', 'below', 'between', 'both', 'cannot', 'could',
  'does', 'doing', 'down', 'during', 'each', 'either', 'else', 'enough', 'even',
  'every', 'from', 'further', 'have', 'having', 'here', 'herself', 'himself',
  'into', 'itself', 'just', 'less', 'like', 'made', 'make', 'makes', 'many',
  'might', 'more', 'most', 'much', 'must', 'myself', 'neither', 'never',
  'often', 'once', 'only', 'other', 'others', 'otherwise', 'ought', 'over',
  'rather', 'same', 'shall', 'should', 'since', 'some', 'still', 'such',
  'than', 'that', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'these', 'they', 'thing', 'things', 'this', 'those', 'though', 'through',
  'thus', 'together', 'under', 'until', 'upon', 'very', 'what', 'whatever',
  'when', 'where', 'whether', 'which', 'while', 'whose', 'with', 'within',
  'without', 'would', 'your', 'yourself', 'rather', 'other', 'first', 'second',
  'three', 'world', 'often', 'simply', 'become', 'becomes', 'called', 'using',
  'used', 'uses', 'example', 'explains', 'means', 'point', 'points',
  // Words that turn up in every explanation of everything. Without these, the
  // first draft suggested "Banality of Evil" for "Cognitive Dissonance" on the
  // strength of the word "individuals".
  'individuals', 'people', 'behavior', 'behaviour', 'concept', 'concepts',
  'process', 'processes', 'system', 'systems', 'different', 'certain',
  'considered', 'according', 'produce', 'produces', 'result', 'results',
  'based', 'whole', 'large', 'small', 'order', 'level', 'given', 'known',
  'usually', 'actually', 'common', 'commonest', 'general', 'important',
  'situation', 'situations', 'circumstances', 'something', 'someone',
  'anything', 'everything', 'nothing', 'somebody', 'everyone', 'however',
  'almost', 'nearly', 'quite', 'enough', 'still', 'together', 'instead',
]);

/**
 * The words in a piece of text that are specific enough to be worth matching.
 *
 * Lowercased and de-duplicated, so an entry that says "entropy" nine times does
 * not outweigh one that says it twice alongside eight other ideas.
 */
export function distinctiveWords(text: string): Set<string> {
  const words = new Set<string>();
  if (typeof text !== 'string') return words;
  text
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .forEach((word) => {
      const clean = word.replace(/^-+|-+$/g, '');
      if (clean.length < 5 || STOP_WORDS.has(clean)) return;
      // Crude singularisation, applied to both sides of a comparison so it
      // cannot make two words match that would not have matched anyway. It is
      // here because "price" and "prices" are one idea, and counting them as
      // two was enough to link Supply and Demand to Function.
      words.add(clean.length > 4 && clean.endsWith('s') ? clean.slice(0, -1) : clean);
    });
  return words;
}

/** How strongly two entries are connected, and whether they connect at all. */
export function relationScore(a: DictionaryTerm, b: DictionaryTerm): number {
  if (!a || !b || a.id === b.id) return 0;

  // Array.from rather than spread: the tsconfig targets an older ES level, and
  // spreading a Set does not compile there.
  const shared = (words: Set<string>, other: Set<string>): string[] =>
    Array.from(words).filter((word) => other.has(word));

  // The term carries more weight than the prose: two entries about the same
  // named concept are related even if one of them never says the other's name.
  const termHits = shared(distinctiveWords(a.term), distinctiveWords(b.term)).length;
  const aBody = distinctiveWords(`${a.tagline} ${a.explanation}`);
  const bBody = distinctiveWords(`${b.tagline} ${b.explanation}`);
  const bodyHits = shared(aBody, bBody).length;

  const crossTerm =
    shared(distinctiveWords(a.term), new Set(distinctiveWords(`${b.term} ${b.tagline}`))).length +
    shared(distinctiveWords(b.term), new Set(distinctiveWords(`${a.term} ${a.tagline}`))).length;

  // One shared word in two paragraphs is a coincidence, not a connection: it
  // was enough to pair Cognitive Dissonance with anchoring on the strength of
  // "decision". Two is a subject; the named concept has to be shared for a
  // single hit to count.
  const bodyWeight = bodyHits >= 2 ? bodyHits : 0;

  const score = termHits * 4 + crossTerm * 2 + bodyWeight;
  if (score === 0) return 0;
  return score + (a.subject === b.subject ? 1 : 0);
}

/**
 * Up to `limit` entries related to `term`, strongest first.
 *
 * Ties break alphabetically so the row cannot reshuffle between renders, and an
 * entry with no connection is left out rather than padded in to fill the row.
 */
export function relatedTerms(
  term: DictionaryTerm,
  all: DictionaryTerm[] = [],
  limit = 3
): DictionaryTerm[] {
  if (!term || !Array.isArray(all) || limit <= 0) return [];

  return all
    .map((candidate) => ({ candidate, score: relationScore(term, candidate) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.term.localeCompare(b.candidate.term))
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
