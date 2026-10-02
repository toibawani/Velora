import { BlackHoleLevel } from './schema';

/**
 * Level 0: the big picture, with no jargon at all.
 *
 * This is the only level whose job is to be read once and understood, and it
 * deliberately uses no glossary terms. The brief says no jargon here, and a term
 * with a dotted underline in the opening paragraph would work against that: the
 * reader would be stopping to look things up before they know why they should
 * care. Level 1 is where the machinery starts.
 */
const LEVEL_0: BlackHoleLevel = {
  id: 'big-picture',
  number: 0,
  title: 'The big picture',
  blurb: 'What a black hole is, in one paragraph, with no jargon.',
  intro:
    'A black hole is a place where gravity has become so strong that nothing can get out, not even light. Stars make them when they run out of fuel and collapse; some galaxies have one at the centre that is millions or billions of times heavier than the Sun. A black hole itself gives off no light and has no surface, which is why the first photograph of one, made in 2019, is really a photograph of the glowing gas around it. Everything in these levels is about three questions: how they form, what is actually happening at the boundary, and what happens to whatever falls in.',
};

export default LEVEL_0;