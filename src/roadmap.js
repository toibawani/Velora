/**
 * VELORA learning roadmap
 * Generated from curriculum data and knowledge fields
 */
/**
 * What is actually built, what is half-built, and what is not started.
 *
 * This file is the roadmap's content, and it is written as data rather than
 * markup so a test can check it against the code. A roadmap that drifts from
 * what shipped is worse than no roadmap: it is a second set of claims nobody
 * verifies, and this app has spent its recent history deleting claims of
 * exactly that kind. So every number below is read from the source by
 * src/roadmap.test.js, and a wrong one fails the build.
 *
 * Voice: the same as the rest of this build. No dates, because nothing here
 * has a schedule, and no "coming soon", because that is a promise about
 * someone else's time.
 */

// Counts come from the data files, not from memory. The test resolves these
// same exports, so a number here cannot disagree with the data.
import { CURRICULUM } from './data/curriculum';
import { KNOWLEDGE_STATS } from './data/knowledgeFields';
import { CURIOUS_TERMS } from './data/dictionary';

const lessonTopics = (subject) =>
  CURRICULUM[subject].modules.reduce((total, module) => total + module.topics.length, 0);

const lessonSubjectList = () =>
  Object.keys(CURRICULUM)
    .map((id) => `${CURRICULUM[id].name} (${lessonTopics(id)})`)
    .join(', ');

export const lessonSubjectCount = Object.keys(CURRICULUM).length;
export const lessonTopicCount = Object.keys(CURRICULUM).reduce(
  (total, subject) => total + lessonTopics(subject),
  0
);
export const dictionaryTermCount = CURIOUS_TERMS.length;
export const atlasTopicCount = KNOWLEDGE_STATS.topics;
export const atlasFieldCount = KNOWLEDGE_STATS.fields;
export const atlasDisciplineCount = KNOWLEDGE_STATS.disciplines;
export const lessonSubjectSummary = lessonSubjectList();

export const ROADMAP = [
  {
    id: 'live',
    title: 'Working now',
    summary:
      'Finished enough to use. Each one reads and writes this browser, and each has tests behind it.',
    items: [
      {
        name: 'The atlas',
        state: 'live',
        detail: `${atlasFieldCount} fields, ${atlasDisciplineCount} disciplines and ${atlasTopicCount} topics you can search and browse. It maps the subject areas. How much of it has writing behind it is a different question, answered under "Partly built" below.`,
      },
      {
        name: 'Lessons',
        state: 'live',
        detail: `${lessonTopicCount} written lessons across ${lessonSubjectCount} subjects: ${lessonSubjectSummary}. Each has teaching sections, a note on what is still uncertain, and a note on where the idea is used at work.`,
      },
      {
        name: 'Curious Dictionary',
        state: 'live',
        detail: `${dictionaryTermCount} terms across nine subjects, each with a plain-language meaning, an example, and a note on what the term is often confused with.`,
      },
      {
        name: 'Flow games',
        state: 'live',
        detail: 'Games over the curriculum: Concept Check, Concept Scrabble, Knowledge Chain, Definition Duel, Concept Puzzle and Relativity Lab, plus Explain It Back, Counterintuitive and Connect the Concept under Brain Games. Each deck writes its own clues, because a clue that names its own answer is not a clue - but the terms are not invented, and a test holds Definition Duel\u2019s ten philosophy terms to the philosophy entries themselves rather than to a copy of their names.',
      },
      {
        name: 'Question desk',
        state: 'live',
        detail: 'Questions and notes you write down, stored on this device, each one linkable to a lesson that actually exists.',
      },
      {
        name: 'Progress and Journey',
        state: 'live',
        detail: 'Minutes actually spent, and a timeline of the sessions recorded on this device. There are no scores, because nothing in the app produces one.',
      },
      {
        name: 'Theme',
        state: 'live',
        detail: 'Light, dark, or follow the system. Applied before the first paint, so a reload does not flash the wrong colours.',
      },
      {
        name: 'Settings',
        state: 'live',
        detail:
          'A settings screen: the theme, and the answers given during setup, which were write-once until it existed. There are no reminder switches, because nothing here can send a reminder without a server to send it from.',
      },
      {
        name: 'Next up',
        state: 'live',
        detail:
          'A short list of things to come back to, stored on this device. No due dates and no reminders, for the reason above. Items can point at a lesson that exists.',
      },
    ],
  },
  {
    id: 'partial',
    title: 'Partly built',
    summary:
      'Real code with something missing. Each of these works, but does less than its name suggests, and it is worth being specific about which part.',
    items: [
      {
        name: 'The atlas has far more topics than there are lessons',
        state: 'partial',
        detail: `The atlas lists ${atlasTopicCount} topics across ${atlasFieldCount} fields. Written lessons exist for ${lessonTopicCount} of them. Clicking a topic with no lesson says so and offers nothing in its place, which is honest but not much of a destination. Closing this gap is the largest single piece of work in this app.`,
      },
      {
        name: 'What-if simulator',
        state: 'partial',
        detail:
          'Six counterfactual scenarios with real explanations. Three of them illustrate with images pointing at via.placeholder.com, a service that renders the words "Doubled Gravity" where a picture should be. The writing is sound; the visuals are not there.',
      },
      {
        name: 'The whiteboard',
        state: 'partial',
        detail:
          'A working canvas you can draw on, with preset science templates. It does not save what you draw: reload and it is gone.',
      },
      {
        name: 'Sensory rooms',
        state: 'partial',
        detail:
          'Several rooms with sound and visual settings. It drives the device rather than the lesson, so what it does for a given topic is untested.',
      },
      {
        name: 'Universe builder and concept map',
        state: 'partial',
        detail:
          'You can place concepts on a graph and draw relations between them. There is no way to read a built map back afterwards, and nothing else in the app looks at it.',
      },
      {
        name: 'Review scheduling',
        state: 'partial',
        detail:
          'A spaced-repetition scheduler with real due dates. It has never been measured against someone doing repeated sessions over weeks, so whether the intervals are any good is genuinely unknown.',
      },
    ],
  },
  {
    id: 'notstarted',
    title: 'Not started',
    summary:
      'Named because they were removed or never built, not because they are on the way. None of these has a date, because none of them has a schedule behind it.',
    items: [
      {
        name: 'Collaboration',
        state: 'removed',
        detail:
          'Removed. There was a forum with handles, vote counts, room member counts and verified-mentor badges, all typed out by hand: the app has no server, so none of it existed, and the answers on those threads were marked correct by the same hand that wrote them. This needs a backend that can hold two people at once. It is not something that can be added to an app that stores everything in one browser, and it is listed here so its absence is a decision you can see rather than a gap you have to guess about.',
      },
      {
        name: 'Accounts and sign-in',
        state: 'removed',
        detail:
          'Removed. The old form collected an email address, a phone number, a username and a password, verified none of them and sent none of them anywhere. What exists now is a name stored in one browser, and the control that removes it says what it does instead of calling itself a sign out.',
      },
      {
        name: 'Leaderboards, streaks and milestones',
        state: 'removed',
        detail:
          'Removed. A Journey screen showed five fixed achievements with mastery scores of 94, 88 and 92 beside them, identical for everyone including someone who had just arrived, because no measurement produced any of it. The screen now shows study sessions that were actually recorded.',
      },
      {
        name: 'Peer explanations',
        state: 'partial',
        detail:
          'The board where you write an explanation of a concept in your own words and vote on others is real, and what you write is stored. But it also ships three explanations typed out in advance, each with vote counts of 24, 12, 31, 42 and similar, which no person produced. Those are the same invented numbers the removed screens were deleted for, so this one is on the list to be looked at again.',
      },
      {
        name: 'Sharing and sync',
        state: 'notstarted',
        detail:
          'Not started, and deliberately not stubbed out. Everything here lives in one browser. There is no account to sync to and no second device to sync from, so nothing in this app claims to do it.',
      },
      {
        name: 'Lessons for the remaining fields',
        state: 'notstarted',
        detail:
          'Not started. Political Science, Geography and Literature appear in the atlas as browsable topics, and Biology, Chemistry, Mathematics, Psychology and Economics have dictionary entries, but neither has written lessons behind it.',
      },
    ],
  },
];

/** One line per state, for the count strip at the top of the page. */
export const ROADMAP_TOTALS = ROADMAP.map((section) => ({
  id: section.id,
  title: section.title,
  count: section.items.length,
}));

export default ROADMAP;
