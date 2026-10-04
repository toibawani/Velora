/**
 * The fabricated social screens, and the routes that reached them.
 *
 * Three screens used to render numbers and people that were typed out by hand
 * because there is no server here to know them: a sprint with a leaderboard of
 * five invented names, a community feed of invented handles, rooms and votes,
 * and a peer-review board with invented mentors, reputations and token
 * balances. Deleting the files was a decision, not an oversight, so this test is
 * the part that makes the decision stick - otherwise the next person to add a
 * "top contributors" panel has nothing standing in the way.
 */
import fs from 'fs';
import path from 'path';

const REMOVED = ['Challenges', 'Doubts', 'SocialProof'];

const read = (...parts) => fs.readFileSync(path.join(__dirname, ...parts), 'utf8');

/**
 * The source with its comments taken out.
 *
 * A rule that greps a file has to ignore comments, or the next person cannot
 * even write down which bug they are fixing. The first version of the rule below
 * failed on its own fix, because the comment explaining the removed figures
 * spelled them out.
 *
 * Deliberately crude: this is not a parser, it only has to be good enough that
 * "explain the bug in a comment" stops being a way to break the build.
 */
const code = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');

test('nothing in the router or the nav still reaches a removed screen', () => {
  [read('App.js'), read('components', 'MobileNav.js')].forEach((source) => {
    REMOVED.forEach((name) => expect(source).not.toMatch(new RegExp(`screens/${name}`)));
    expect(source).not.toMatch(/screen:\s*'(challenges|doubts)'/);
  });
});

test('the removed screens are gone from disk', () => {
  REMOVED.forEach((name) => {
    expect(fs.existsSync(path.join(__dirname, 'screens', `${name}.js`))).toBe(false);
  });
});

test('no screen carries a leaderboard of people it cannot see', () => {
  fs.readdirSync(path.join(__dirname, 'screens'))
    .filter((f) => f.endsWith('.js') && !f.endsWith('.test.js'))
    .forEach((f) => {
      const source = read('screens', f);
      expect(source).not.toMatch(/leaderboard/i);
      expect(source).not.toMatch(/TOP_MENTORS/);
    });
});

/*
 * The games hub shipped a panel reading "18 Flow Sessions Completed", "4.9/5
 * Comprehension Rating", "15 Concepts Mastered" and "92% Retention Score".
 * Every one was typed out by hand, identical for every learner, and produced by
 * nothing - on the same screen whose hero promised "no artificial scoreboards".
 * The leaderboard rule above did not catch it, because four invented numbers in
 * a row are not a leaderboard; they are just a scoreboard.
 *
 * So the rule is about the shape rather than the wording: a statistic has to be
 * a number in braces, read from somewhere. A bare digit is a number somebody
 * made up, wherever it appears.
 */
test('no screen prints a hand-written number where a measurement belongs', () => {
  fs.readdirSync(path.join(__dirname, 'screens'))
    .filter((f) => f.endsWith('.js') && !f.endsWith('.test.js'))
    .forEach((f) => {
      const source = code(read('screens', f));
      const literals = source.match(/stat-number"[^>]*>([^<]*)</g) || [];
      literals.forEach((match) => {
        const value = match.replace(/.*>/, '').replace(/<.*$/, '').trim();
        expect({ file: f, value }).toEqual({ file: f, value: expect.stringMatching(/^\{.+\}$/) });
      });
    });
});

/*
 * An earlier version of this also banned the strings "Comprehension Rating" and
 * "Retention Score" outright. That was wrong, and it failed on its own fix: the
 * games hub now says out loud that it has no comprehension rating, which is the
 * opposite of the sin, and a rule that forbids telling the truth is worse than
 * the thing it was guarding.
 *
 * The shape rule above is the one that matters. A made-up score has to be a
 * number somewhere, and this is the only place a bare one can appear. Where a
 * specific claim has been removed, the screen's own tests say so - see
 * Games.test.jsx, which asserts the old figures are absent by value.
 */
