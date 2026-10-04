import { PhilosophyLevel } from './schema';

/**
 * Level 0: what philosophy is, with no jargon at all.
 *
 * This is the only level whose job is to be read once and understood, and it
 * deliberately uses no glossary terms, for the same reason the black hole Level
 * 0 does not: a dotted underline in the opening paragraph asks a reader to stop
 * and look something up before they know why they should care. Level 1 is where
 * the machinery starts.
 *
 * The intro also states the thing the rest of this read is built on, which is
 * that these questions do not all have the same status, and that saying which is
 * which is part of the work rather than a footnote to it.
 */
const LEVEL_0: PhilosophyLevel = {
  id: 'big-picture',
  number: 0,
  title: 'The big picture',
  blurb: 'What this subject is, and why the entries carry honesty labels.',
  intro:
    'Philosophy is what happens when a question will not go away just because you have an answer. What is a person? What makes an action wrong? Is the future already fixed? These are not riddles. They are the questions that stay open after every technique we have has been applied, and the discipline is mostly about learning to tell the open ones from the closed ones. Some of what follows is settled and you can rely on it. Some is a live argument between people who know the field well, and the wrong thing to do with those is to read one side and call it the answer. Every entry below says which it is, in a label you can see before you read the entry at all. Five areas are covered here: what there is, what we can know, what we should do, who we are, and whether we are free.'
};

export default LEVEL_0;
