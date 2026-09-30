import type { DictionaryTerm } from './types';

/**
 * Curious Dictionary: Psychology.
 *
 * Filed under the subject it belongs to rather than under whichever file
 * it happened to be typed into, so adding a term means opening one file and
 * the compiler checks it against DictionaryTerm while you type.
 */
export const PSYCHOLOGY_TERMS: DictionaryTerm[] = [
{
    id: 'cognitive-dissonance',
    term: 'Cognitive Dissonance',
    subject: 'psychology',
    letter: 'C',
    tagline: 'The psychological itch you feel when your actions clash with your beliefs.',
    explanation: 'When people hold two contradictory thoughts, or behave in a way that directly contradicts their self-image, their brain experiences genuine discomfort. Rather than admitting fault or changing stubborn habits, people will often invent elaborate rationalizations to soothe the tension.',
    example: 'Aesop’s fable of the fox who leaps repeatedly for high-hanging grapes and fails: rather than admit he isn’t tall or athletic enough, he walks away insisting the grapes were sour anyway.',
    source: 'Leon Festinger, A Theory of Cognitive Dissonance (1957)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cognitive_dissonance',
  },

{
    id: 'confirmation-bias',
    term: 'Confirmation Bias',
    subject: 'psychology',
    letter: 'C',
    tagline: 'Our subconscious habit of collecting facts that agree with us and discarding the rest.',
    explanation: 'The human brain is an efficient lawyer for its own preconceived notions. We quickly notice, remember, and amplify pieces of information that validate what we already suspect, while scrutinizing or instantly forgetting evidence that proves us wrong.',
    example: 'If you believe full moons make hospital emergency rooms chaotic, you will take vivid mental note of every unruly patient during a full moon, but completely ignore busy nights during a crescent moon.',
    source: 'Peter Wason, Quarterly Journal of Experimental Psychology (1960)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Confirmation_bias',
  },

{
    id: 'classical-conditioning',
    term: 'Classical Conditioning',
    subject: 'psychology',
    letter: 'C',
    tagline: 'Learning to link two things that have no natural link.',
    explanation: 'If one stimulus reliably predicts another, an organism starts responding to the first as if it were the second. The learned response is involuntary, which is why it is studied in infants and dogs as much as in adults.',
    example: 'Pavlov conditioned dogs to salivate at a bell, but the everyday version is the smell of a school canteen making you hungry before lunch. Phobias are usually the same process running in the other direction.',
    source: 'Pavlov, Lectures on Conditioned Reflexes (1927)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Classical_conditioning',
  },

{
    id: 'operant-conditioning',
    term: 'Operant Conditioning',
    subject: 'psychology',
    letter: 'O',
    tagline: 'Behaviour that pays off gets repeated.',
    explanation: 'Consequences select behaviour: a response followed by reward is more likely to recur, and one followed by punishment is less likely. Unlike classical conditioning this operates on voluntary behaviour and can change what an animal chooses to do.',
    example: 'A slot machine is built on this. The reinforcement is unpredictable, and variable schedules of reinforcement produce the most persistent behaviour, which is why they are the hardest to extinguish.',
    source: 'Skinner, The Behavior of Organisms (1938)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Operant_conditioning',
  },

{
    id: 'spaced-repetition',
    term: 'Spaced Repetition',
    subject: 'psychology',
    letter: 'S',
    tagline: 'Forgetting is the point, not the problem.',
    explanation: 'Memory strengthens when retrieval almost fails, so reviewing just before you would have forgotten it produces more durable memory than reviewing sooner. The spacing matters more than the total time, and the curve of forgetting is roughly logarithmic.',
    example: 'A study of 13,000 flashcards in a 2021 Science paper found spaced scheduling roughly halved the number of reviews needed for the same recall. Cramming gets you to the exam; spacing gets you to the exam and the re-exam.',
    source: 'Roediger and Karpicke, "Test Enhanced Learning" (2006)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Spaced_repetition',
  },

{
    id: 'working-memory',
    term: 'Working Memory',
    subject: 'psychology',
    letter: 'W',
    tagline: 'The small chalkboard you can hold things on briefly.',
    explanation: 'Working memory holds a few items in an active state long enough to use them, and it is far more limited than long-term memory. A classic result holds it to about four chunks when items can be grouped, which is why phone numbers are grouped.',
    example: 'Miller reported the magical number seven in 1956, but later work put the real figure closer to four, once grouping is controlled. The number of things you can hold is not the number of things you know.',
    source: 'Baddeley and Hitch, "Working Memory" (1974)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Working_memory',
  },

{
    id: 'dunning-kruger',
    term: 'Dunning-Kruger Effect',
    subject: 'psychology',
    letter: 'D',
    tagline: 'The less you know, the more confident you often are.',
    explanation: 'People with low skill in a domain tend to overestimate their own ability, partly because the effort that competence requires is invisible to them. The effect weakens once you are slightly competent, which is why a little knowledge does the most work.',
    example: 'The original 1999 study gave participants a test of logic and general knowledge. Those in the bottom quartile were the most confident in their performance, and the top quartile were the least confident, despite scoring far better.',
    source: 'Dunning and Kruger, "Unskilled and Unaware" (1999)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect',
  },

{
    id: 'fundamental-attribution-error',
    term: 'Fundamental Attribution Error',
    subject: 'psychology',
    letter: 'F',
    tagline: 'Explaining their character, excusing their situation.',
    explanation: 'When judging other people we overweight their disposition and underweight the situation, and we do the opposite for ourselves. It is a default, not a deliberate judgement, and it is the core mechanism behind most blame in conflict.',
    example: 'A classic study asked participants to explain a late essay, and a late essay from a student was blamed on the student while the same lateness from a professor was excused by their commute. Same person, same behaviour, different explanation.',
    source: 'Ross, "The Fundamental Attribution Error" (1977)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Fundamental_attribution_error',
  },

{
    id: 'sunk-cost-fallacy',
    term: 'Sunk Cost Fallacy',
    subject: 'psychology',
    letter: 'S',
    tagline: 'Already spent is gone, and it should not decide what happens next.',
    explanation: 'People keep investing in a failing course, project, or stock because of what they have already put in, even though that money cannot be recovered. The relevant question is only what a future dollar or hour buys, and the past spending is irrelevant to it.',
    example: 'Sunk cost is why people finish a novel they hate and why governments keep funding a project long after the case for it collapsed. The 2012 US presidential race had a climate scientist and a NASA strategist both say sunk cost decided it.',
    source: 'Arkes and Blumer, "The Psychology of Sunk Cost" (1985)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Sunk_cost_fallacy',
  },

{
    id: 'peak-end-rule',
    term: 'Peak-End Rule',
    subject: 'psychology',
    letter: 'P',
    tagline: 'You remember the best moment and the ending, not the length.',
    explanation: 'Judgements of an experience depend mostly on its most intense moment and how it ended, with the duration largely ignored. This is why a long good holiday followed by a bad flight can be remembered as bad overall.',
    example: 'Kahneman tested this by giving one group a painful ice pressor trial lasting 60 seconds and another the same trial lasting 120 seconds, with a longer trial including a mild 60 second stretch at the end. Most people preferred the long one, which predicts that stretching every holiday by a painful end would improve every memory.',
    source: 'Kahneman, Fredrickson, Schreiber, and Redelmeier, "When More Pain Is Preferred to Less" (1993)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Peak%E2%80%93end_rule',
  },

{
    id: 'placebo-effect',
    term: 'Placebo Effect',
    subject: 'psychology',
    letter: 'P',
    tagline: 'Expectation changes the experience, and sometimes the outcome.',
    explanation: 'Believing a treatment will help can change reported symptoms and some measurable ones, through real physiological pathways rather than imagination. It is not imagining pain away, which is the part that gets the effect dismissed.',
    example: 'The honest placebo is the open-label placebo, where patients are told they are getting a sugar pill with no active ingredient and still improve. Reviews of trials in irritable bowel syndrome found rates around 40 percent on average.',
    source: 'Kaptchuk, "The Placebo Effect in Medicine" (2020)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Placebo',
  },

{
    id: 'anchoring',
    term: 'Anchoring',
    subject: 'psychology',
    letter: 'A',
    tagline: 'The first number you hear sticks to every number after it.',
    explanation: 'People systematically under-adjust from an initial reference value even when they know it is arbitrary, and they do so without feeling they are adjusting. The effect appears across cultures, ages, and IQ levels, with very large effects.',
    example: 'Tversky and Kahneman had participants spin a numbered wheel, then asked for a percentage; groups given 10 or 65 estimated 15 and 45 respectively, when the correct answer was the same 10 percent. A wheel of chance changed the answer.',
    source: 'Tversky and Kahneman, "Judgment under Uncertainty" (1974)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Anchoring',
  },

{
    id: 'intrinsic-motivation',
    term: 'Intrinsic Motivation',
    subject: 'psychology',
    letter: 'I',
    tagline: 'Doing something because it is the interesting part.',
    explanation: 'Intrinsic motivation comes from the activity itself rather than a reward attached to it, and it is more durable than extrinsic motivation. The complication is that visible rewards can reduce it, by reframing play as work.',
    example: 'Lepper, Greene, and Nisbett gave children drawing materials; those promised a reward drew less and produced less interesting pictures. The finding is well replicated and it is a real problem for classroom and app design.',
    source: 'Deci and Ryan, "The Need for Self-Determination" (1985)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Intrinsic_motivation',
  },

{
    id: 'circadian-rhythm',
    term: 'Circadian Rhythm',
    subject: 'psychology',
    letter: 'C',
    tagline: 'An internal clock that does not care what time it is.',
    explanation: 'Almost every human process cycles on roughly a 24-hour schedule controlled by a pacemaker in the hypothalamus, entrained each morning by light. It continues in total darkness, drifting, which shows it is internal rather than learned from the clock.',
    example: 'The Nobel Prize in Physiology or Medicine in 2017 went to the researchers who identified the clock genes in fruit flies. People isolated from clocks without light signals still drift towards a 24.2 hour cycle, longer than the day.',
    source: 'Hastings, "The circadian system" (2000)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Circadian_rhythm',
  },
];
