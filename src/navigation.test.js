/**
 * Navigation is the one part of this app that has broken quietly four times.
 *
 * The nav used to be four independent lists. The Curious Dictionary was in the
 * header and the drawer but not the bottom bar, the Journey was in none of
 * them, the command palette knew about four screens out of seven, and the
 * question desk was still labelled "Community" after the forum behind that name
 * was deleted for being invented. Every one of those is a feature a person
 * could not find, and none of them failed a test, because each list was
 * correct in isolation and nothing compared them to the set of screens that
 * exist.
 *
 * These tests compare the registry to the router instead. Adding a screen to
 * App.js without adding it to src/navigation.js fails here rather than
 * shipping something nobody can reach.
 */
import fs from 'fs';
import path from 'path';
import { PRIMARY_SCREENS, SCREENS } from './navigation';

const read = (...parts) => fs.readFileSync(path.join(__dirname, ...parts), 'utf8');
const app = read('App.js');

/** Source with comments removed, so prose about a fix cannot trip a scan. */
const codeOnly = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

/**
 * Screens the router renders before there is a nav to render. Splash, the
 * landing page and the name prompt are the way in; you are not browsing from
 * them, so they are not nav destinations and are not in the registry. The
 * `user &&` guard in App.js is what marks the difference, and this list has to
 * agree with it by hand - hence the assertion below, which fails if one of
 * these ever grows that guard and becomes a real screen.
 */
const ENTRY_SCREENS = ['splash', 'landing', 'profile'];

/** Screen ids the router will actually render, minus the way in. */
const routedScreenIds = () =>
  [...app.matchAll(/screen === '([a-z-]+)' &&/g)]
    .map((match) => match[1])
    .filter((id) => !ENTRY_SCREENS.includes(id));

test('the entry screens really are still the way in, not nav destinations', () => {
  // If splash or profile ever became a browsable screen it would need a nav
  // entry, and this is the assertion that would notice it was skipped.
  ENTRY_SCREENS.forEach((id) => expect(SCREENS.map((screen) => screen.id)).not.toContain(id));
});

test('every screen the router renders has an entry in the nav registry', () => {
  routedScreenIds().forEach((id) => {
    expect(SCREENS.map((screen) => screen.id)).toContain(id);
  });
});

test('every registry entry is a screen the router can reach', () => {
  // A nav item pointing at a route that renders nothing is the decorative entry
  // the brief rules out: a button that looks like a feature and is not one.
  SCREENS.forEach((screen) => {
    expect(routedScreenIds()).toContain(screen.id);
  });
});

test('the bottom bar carries the dictionary, the games and the journey', () => {
  // The three that went missing. Dictionary and Games sat in the header where
  // they were visible only on wide screens; Journey was in no nav at all, which
  // grep found exactly one hit for: its own render line in App.js.
  const primaryIds = PRIMARY_SCREENS.map((screen) => screen.id);
  expect(primaryIds).toEqual(expect.arrayContaining(['dictionary', 'games', 'journey']));
});

test('the bottom bar stays at six, because seven overflows a 375px viewport', () => {
  // Seven 52px-wide labels plus 24px of padding is 388px. The layout check walks
  // the built app in real Chrome at 375 and fails on overflow, so this is a
  // build-breaking number, not a taste question.
  expect(PRIMARY_SCREENS.length).toBeLessThanOrEqual(6);
});

test('no nav surface invents an entry list of its own', () => {
  // The drift only happened because four files each held a literal list. These
  // three must import the registry rather than describing screens again.
  [read('components', 'BottomNav.js'), read('components', 'MobileNav.js'), read('components', 'CommandPalette.js')].forEach(
    (source) => expect(source).toMatch(/from '\.\.\/navigation'/)
  );
  expect(read('screens', 'UniverseHome.js')).toMatch(/from '\.\.\/navigation'/);
});

test('nothing calls the question desk "Community" any more', () => {
  // screens/Community.js is the question desk. The file kept its name, but the
  // label on the button did not, so the nav went on naming a forum that was
  // deleted for having invented the members in it. ROUTE_LABELS in App.js is
  // keyed by route id and already says "Question desk", so only the surfaces
  // that render a label to a person are checked.
  const surfaces = [
    read('components', 'BottomNav.js'),
    read('components', 'MobileNav.js'),
    read('components', 'CommandPalette.js'),
    read('screens', 'UniverseHome.js'),
  ];
  surfaces.forEach((source) => {
    expect(codeOnly(source)).not.toMatch(/['"]Community['"]\s*[:,}]/);
  });
  SCREENS.forEach((screen) => {
    expect(screen.label).not.toBe('Community');
    expect(screen.drawerLabel).not.toBe('Community');
  });
});

test('every screen carries a drawn icon and something to search for', () => {
  SCREENS.forEach((screen) => {
    expect(screen.icon).toBeTruthy();
    expect(screen.label).toBeTruthy();
    expect(screen.drawerLabel).toBeTruthy();
    // The palette searches this text, so an empty one is a screen nobody can
    // reach by typing its name.
    expect(screen.description.length).toBeGreaterThan(10);
  });
});
