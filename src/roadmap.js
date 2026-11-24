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
import { KNOWLEDGE_FIELDS, KNOWLEDGE_STATS } from './data/knowledgeFields';
import { CURIOUS_TERMS } from './data/dictionary';
import { fieldCoverageByDiscipline } from './data/atlasResolution';

// A curriculum file lists planned topics as well as written ones. A planned
// topic is a title with no story and no sections; counting it as a lesson made
// the roadmap claim 121 written lessons when 89 have anything to read. The
// roadmap is a page about what exists, so it counts only the written ones.
const isWritten = (topic) => Array.isArray(topic.sections) && topic.sections.length > 0;

const lessonTopics = (subject) =>
  CURRICULUM[subject].modules.reduce(
    (total, module) => total + module.topics.filter(isWritten).length,
    0
  );

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
/**
 * How many atlas topics actually open something.
 *
 * This is not the lesson count. The curriculum holds 89 written lessons, but
 * the atlas also opens deep reads, and some curriculum lessons live inside
 * those reads rather than beside them, so the two numbers cannot be added or
 * substituted for one another. The resolver is the only thing that knows the
 * truth, so the roadmap asks it rather than counting lessons and calling the
 * result coverage.
 */
export const atlasWrittenCount = KNOWLEDGE_FIELDS.reduce(
  (total, field) => total + fieldCoverageByDiscipline(field).written,
  0
);
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
          'A settings screen: the theme, and the answers given during setup, which were write-once until it existed. There are no reminder switches, because nothing here has a scheduled job or a notification permission to send one with.',
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
        detail: `The atlas lists ${atlasTopicCount} topics across ${atlasFieldCount} fields. Written content exists for ${atlasWrittenCount} of them, which is ${lessonTopicCount} lessons in the curriculum plus the philosophy, history, black hole and computer science deep reads. Clicking a topic with no lesson says so and offers nothing in its place, which is honest but not much of a destination. Closing this gap is the largest single piece of work in this app.`,
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
          'Removed, and only partly replaced. There was a forum with handles, vote counts, room member counts and verified-mentor badges, all typed out by hand, so none of it existed, and the answers on those threads were marked correct by the same hand that wrote them. What exists now is one shared board per topic: no handles, no votes, no member count, and nothing appears until it has been reviewed. A forum with people replying to each other is still not here, and it is listed so its absence is a decision you can see rather than a gap you have to guess about.',
      },
      {
        name: 'Accounts and sign-in',
        state: 'partial',
        detail:
          'Partly back, and differently. The old form collected an email address, a phone number, a username and a password, verified none of them and sent none of them anywhere. Signing in now is a link emailed to an address you type, it is optional, it lives in Settings, and no password is ever collected or stored. The display name is still just a name in one browser.',
      },
      {
        name: 'Leaderboards, streaks and milestones',
        state: 'removed',
        detail:
          'Removed. A Journey screen showed five fixed achievements with mastery scores of 94, 88 and 92 beside them, identical for everyone including someone who had just arrived, because no measurement produced any of it. The screen now shows study sessions that were actually recorded.',
      },
      {
        name: 'Explanations you write',
        state: 'partial',
        detail:
          'Partial. The board where you explain a concept in your own words is real. It used to ship three explanations typed out in advance, with vote counts of 24, 12, 31, 42 and similar, which no person produced; those rows and the vote controls were deleted. It starts empty. Signed out, what you write stays in this browser. Signed in, you can submit it for review, and it becomes readable by other people only after I approve it. There are no votes and no counters.',
      },
      {
        name: 'Sharing and sync',
        state: 'partial',
        detail:
          'Partly started. Progress moves between devices when you sign in from Settings: topic, kind and day, nothing more. Notes, questions, study minutes, review schedules and game results do not sync, because they never leave the browser. Two devices are only reconciled while both are online, and a failed push is shown as failed rather than as synced.',
      },
      {
        name: 'Lessons for the remaining fields',
        state: 'notstarted',
        detail:
          'Partly started. Chemistry has seven physical chemistry lessons at the atlas topics Atomic Structure through Solutions, and Biology has eight across Cell Biology and Molecular Biology. Space science has the black hole deep read and computer science has eleven entries in its own deep read. The rest is not started: the other eight biology modules, Earth and environmental science, and Political Science, Geography and Literature, which appear as browsable topics with no curriculum behind them. Mathematics, Psychology and Economics have dictionary entries but no atlas field and no lessons.',
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
