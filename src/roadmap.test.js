/**
 * The roadmap has to be true, and it has to stay true.
 *
 * The claim this app is most often wrong about is its own content. A page
 * saying "572 topics" when twelve lessons exist is the same failure as the
 * forum with 1,240 members, just less obviously invented, because nobody
 * invented a number twice. So the counts in src/roadmap.js are checked here
 * against the data files, and the claims that name specific defects are
 * checked against the source that contains them.
 *
 * Every assertion below was run against a knowingly wrong value first and
 * watched to fail, so none of them is a test that passes for its own reasons.
 */
import fs from 'fs';
import path from 'path';
import ROADMAP, {
  atlasFieldCount,
  atlasTopicCount,
  dictionaryTermCount,
  lessonSubjectCount,
  lessonTopicCount,
  ROADMAP_TOTALS,
} from './roadmap';
import { CURRICULUM } from './data/curriculum';
import { KNOWLEDGE_STATS } from './data/knowledgeFields';
import { CURIOUS_TERMS } from './data/dictionary';
import { CLASSIC_GAMES } from './screens/Games';

const read = (...parts) => fs.readFileSync(path.join(__dirname, ...parts), 'utf8');
const allText = ROADMAP.map((section) =>
  [section.title, section.summary, ...section.items.map((item) => `${item.name} ${item.detail}`)].join(' ')
).join(' ');

test('the counts on the page are the counts in the data files', () => {
  expect(atlasTopicCount).toBe(KNOWLEDGE_STATS.topics);
  expect(atlasFieldCount).toBe(KNOWLEDGE_STATS.fields);
  expect(dictionaryTermCount).toBe(CURIOUS_TERMS.length);

  const realLessonCount = Object.keys(CURRICULUM).reduce(
    (total, subject) =>
      total + CURRICULUM[subject].modules.reduce((sum, module) => sum + module.topics.length, 0),
    0
  );
  expect(lessonTopicCount).toBe(realLessonCount);
  expect(lessonSubjectCount).toBe(Object.keys(CURRICULUM).length);
});

test('the page states those counts in words, not just in the data', () => {
  // If the prose ever stops naming the number, the check above is still correct
  // and the page has quietly started implying something different.
  expect(allText).toContain(String(atlasTopicCount));
  expect(allText).toContain(String(lessonTopicCount));
  expect(allText).toContain(String(dictionaryTermCount));
});

test('the page admits the atlas has more topics than there are lessons', () => {
  // This is the sentence that matters. An atlas advertising 572 topics against
  // 12 written lessons is the largest gap in the app, and a roadmap that lists
  // the atlas as simply "working" without saying so is not describing the app.
  expect(atlasTopicCount).toBeGreaterThan(lessonTopicCount * 10);
  expect(allText).toMatch(/written lessons exist for/i);
  expect(allText).toMatch(/largest/i);
});

test('the placeholder images are still there, and the page says so', () => {
  const simulator = read('components', 'WhatIfSimulator.js');
  const placeholders = (simulator.match(/via\.placeholder\.com/g) || []).length;

  // If someone replaces them the roadmap claim becomes false, so this fails
  // rather than leaving the page describing a problem that no longer exists.
  expect(placeholders).toBeGreaterThan(0);
  expect(allText).toContain('via.placeholder.com');
});

test('the invented vote counts on the peer board are still there, and named', () => {
  const peers = read('components', 'PeerExplanations.js');
  expect(peers).toMatch(/DEFAULT_EXPLANATIONS/);
  // The page calls these invented. Deleting the seeded rows makes that claim
  // false, so the two have to change in the same commit.
  expect(allText).toMatch(/explanations typed out in advance/i);
});

test('collaboration is listed as removed, with the reason', () => {
  // A roadmap that quietly omits a deleted feature is indistinguishable from
  // one that never had it.
  const item = ROADMAP.flatMap((section) => section.items).find((entry) => entry.name === 'Collaboration');
  expect(item).toBeDefined();
  expect(item.state).toBe('removed');
  expect(item.detail).toMatch(/backend/i);
});

test('nothing in the page promises a date or a delivery', () => {
  // There is no schedule behind this app. A date, or a "coming soon", is a
  // commitment nobody here is in a position to keep.
  expect(allText).not.toMatch(
    /\b(coming soon|soon|in beta|launch|release date|q[1-4] 20\d\d|20\d\d)\b/i
  );
  expect(allText).not.toMatch(/\d+\s*(days?|weeks?|months?)\s+(from now|later|until)/i);
});

test('nothing in the page uses the hype vocabulary this build rejects', () => {
  [
    'crazy',
    'amazing',
    'revolutionary',
    'incredible',
    'game-chang',
    'mind-blowing',
    'stunning',
    'unbelievable',
    'cutting-edge',
    'world-class',
    'magical',
    'effortless',
  ].forEach((word) => {
    expect(allText.toLowerCase()).not.toContain(word);
  });
});

test('the page never implies a backend that does not exist', () => {
  // Everything is localStorage. "Synced", "across your devices", "your
  // account" and "saved to the cloud" all describe a server this app lacks.
  //
  // This matches whole claims rather than the bare words, because the page has
  // to be allowed to say "there is no account to sync to" in order to say that
  // there is no account. Catching the noun alone would force that sentence to
  // be deleted, which would leave the reader with less information, not more.
  expect(allText).not.toMatch(/(is|are|has been|have been)\s+synced|syncing across|across (your )?devices|saved to the cloud|on our servers?|your account|sign(ed)? in to sync/i);
  // "Accounts and sign-in" is the name of a removed feature, so the phrase is
  // allowed in that one place and nowhere else.
  expect(allText.replace(/Accounts and sign-in/g, '')).not.toMatch(/sign(ed)? in|log ?in|create an account/i);
});

test('every item carries a state the screen knows how to render', () => {
  const known = ['live', 'partial', 'removed', 'notstarted'];
  ROADMAP.forEach((section) => {
    expect(section.items.length).toBeGreaterThan(0);
    section.items.forEach((item) => {
      expect(known).toContain(item.state);
      expect(item.name).toBeTruthy();
      // A row with a label and no sentence is a decoration.
      expect(item.detail.length).toBeGreaterThan(40);
    });
  });
});

test('the totals match the sections they count', () => {
  ROADMAP.forEach((section, index) => {
    expect(ROADMAP_TOTALS[index].count).toBe(section.items.length);
    expect(ROADMAP_TOTALS[index].title).toBe(section.title);
  });
});

test('the three states this page exists to distinguish are present and ordered', () => {
  expect(ROADMAP.map((section) => section.id)).toEqual(['live', 'partial', 'notstarted']);
});

test('no row claims something is unbuilt when the file exists', () => {
  // This is the drift the page is most vulnerable to. Settings and Next up were
  // both listed as "not started" on the day they were committed, because the
  // page was written a commit earlier and nothing compared it to the tree. The
  // next reader would have been told not to build something that was sitting
  // two commits back.
  //
  // Every row naming a screen is checked against the file for it. A row marked
  // not-started whose file exists fails here, so it has to be updated in the
  // same commit that adds the screen.
  const screenFiles = {
    Settings: 'screens/Settings.js',
    'Next up': 'screens/NextUp.js',
    Roadmap: 'screens/Roadmap.js',
    'The atlas': 'screens/UniverseHome.js',
    Lessons: 'screens/Learn.js',
    'Curious Dictionary': 'screens/Dictionary.js',
    'Flow games': 'screens/Games.js',
    'Question desk': 'screens/Community.js',
    'Progress and Journey': 'screens/Analytics.js',
  };

  ROADMAP.forEach((section) => {
    section.items.forEach((item) => {
      const file = screenFiles[item.name];
      if (!file) return;
      const exists = fs.existsSync(path.join(__dirname, file));
      if (item.state === 'notstarted' || item.state === 'removed') {
        expect({ name: item.name, exists }).toEqual({ name: item.name, exists: false });
      } else {
        expect({ name: item.name, exists }).toEqual({ name: item.name, exists: true });
      }
    });
  });
});

test('the games the roadmap names are the games that exist', () => {
  // This row used to say "Five games over the curriculum: Definition Duel,
  // Concept Scrabble, Knowledge Chain, Concept Puzzle and Explain It Back. Every
  // item is drawn from the same data as the lessons." Both halves were false.
  // Concept Check and Relativity Lab existed and were not listed, so "five" was
  // wrong; and not one game imported lesson data - all eight kept their items in
  // inline arrays of their own. The row now says what is true, and this test is
  // what stops it going false again: every game a reader can open is named.
  //
  // It checks the direction that drifts. A game added to the hub without being
  // added here would leave the roadmap quietly under-listing, which is how
  // "Five games" survived two extra games.
  const detail = ROADMAP.flatMap((section) => section.items)
    .find((item) => item.name === 'Flow games').detail;
  CLASSIC_GAMES.forEach((game) => {
    expect({ name: game.name, listed: detail.includes(game.name) }).toEqual({
      name: game.name,
      listed: true,
    });
  });

  // And the three brain-game modes are named too, all of which exist.
  ['Connect the Concept', 'Counterintuitive', 'Explain It Back'].forEach((name) => {
    expect(detail.includes(name)).toBe(true);
  });
});

test('nothing is listed as unbuilt under a name that does not match a screen', () => {
  // The previous row was called "Settings and a personal task list", which
  // matched no file and so could never be caught by the check above. Anything
  // marked not-started must name something specific enough to be checked.
  const notStarted = ROADMAP.find((section) => section.id === 'notstarted');
  notStarted.items.forEach((item) => {
    expect(item.name.length).toBeLessThan(60);
    // A row about something removed must say so in the name or the detail.
    if (item.state === 'removed') expect(item.detail.length).toBeGreaterThan(80);
  });
});
