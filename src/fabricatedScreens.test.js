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
