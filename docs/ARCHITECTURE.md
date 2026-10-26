# Architecture

What follows is the shape of the app as it exists in `src/`, not a plan. Every
file named here is one you can open; every number was read from the data files
or from `node scripts/by-the-numbers.js` on 26 October 2026.

## One paragraph

VELORA is a client-only React application built with Create React App. It has no
server, no accounts and no database. Content is TypeScript and JavaScript in
`src/data/`; state is localStorage, behind one registry; the build is a folder of
static files. A learner can open it on a school iPad, read, close the tab, and
come back without anything having been sent anywhere.

## Screens and routing

`src/App.js` holds the active screen in React state. There is no URL router: a
screen is a value, and `setScreen(id)` changes it. The screen bundles are loaded
with `React.lazy`, so the initial paint does not wait for the dictionary, the
games or the deep reads.

`src/navigation.js` is the registry of 13 screens. Each entry names the id, the
label in the bottom bar, the label in the drawer, a description and whether it is
primary. The navigation components render from this list, and so do the audits:
`scripts/layoutCheck.js` parses `SCREENS` rather than carrying its own copy, which
is why adding a screen gets it measured without editing the audit.

A lesson is not a screen. It opens inside Learn and is reached from a topic, so
the screen registry cannot see it. `scripts/layoutCheck.js` keeps a short
`LESSONS` list for this reason and opens the newest written subjects at both
widths.

## Content model

There are three content surfaces, and they do not share a file format.

1. **The Atlas** (`src/data/knowledgeFields.js`) is the map: 6 fields, 34
   disciplines and 572 topics. A field is Science, Philosophy, History,
   Political Science, Geography or Literature. The topics are the inventory,
   including the ones nobody has written.
2. **Curricula** (`src/data/*Curriculum.js`) are the reading. Five subjects have
   one: physics (37 topics), chemistry (32), biology (43, of which 8 are
   written), philosophy (4) and history (5). A topic with `story` and `sections`
   is readable; a topic with only a title and an id is planned. Planned topics
   keep their place in the Atlas order and resolve as unwritten.
3. **Deep reads** (`src/data/blackholes/`, `philosophy/`, `history/`,
   `computerscience/`) are multi-level structured reads rather than lessons:
   eight levels for black holes, six for philosophy, five for history, six for
   computer science. Each level is a file, and each subject's `index.ts` sorts
   them by number.

`src/data/atlasResolution.ts` is the only thing that decides what a tap on an
Atlas topic does. It returns a closed union: `lesson`, `deep-read` (with an
optional level id), `unwritten`, or `unmapped-field`. The lesson index is built
once at module load and only from topics that carry a story and at least one
section. A title-only stub is deliberately not indexed: the reader used to open
on it and crash on an undefined `sections` array.

Deep-read keys are topic slugs, so the file carries explicit comments where the
Atlas spelling matters ("World War I" slugs to `world-war-i`, and "&" becomes
"and"). Tests at the bottom of the resolver file assert that every key names a
real Atlas topic.

## The learning loop

`Learn` shows the subject's modules, each topic with a count of interactive
parts. Opening one mounts `LessonReader`, which renders the story, sections,
sources, uncertainty note and connections, and records time on unmount.
`src/utils/resumePath.js` saves the last lesson so `UniverseHome` can offer a
one-tap resume. Progress is not points or levels: it is time spent, topics
touched, and what the learner asked to come back to.

The dictionary is separate (`src/data/dictionary/`): 138 terms across 9
subjects, each with a tagline, an explanation, an example, a cited source and a
URL. `verified` is optional and only means someone read the entry back against
that source; 3 of 138 carry it and the screen states the count.

Games and simulations are also content, not services. `src/games/` holds the
question-first games; `CLASSIC_GAMES` in `src/screens/Games.js` is the list the
roadmap and the audit agree on.

## State

All state lives in localStorage. `src/utils/storage.js` is the registry: every
key, a version number, a migration table, and `readValue` / `writeValue` /
`removeValue` wrappers. Payloads are `{ v, data }`; an unwrapped payload is read
as version 0 and passed through that key's migration rather than discarded.

The rule in that file is real: no module outside it spells a `velora_*` key.
`src/utils/storageRegistry.test.js` scans non-test source for quoted literals and
fails if one appears.

The local profile (`src/utils/localProfile.js`) is a display name, 2 to 40
characters, held under `velora_local_profile`. It is not a login. It cannot be
verified and does not identify anyone across devices. Clearing site data removes
it, along with every lesson read and every saved question.

## Fonts, styling and layout

Styles are plain CSS under `src/styles/`, with design tokens in
`src/styles/design-tokens.css`. There is no CSS framework and no CSS-in-JS.
Fonts are self-hosted through `@fontsource` (Fraunces, Source Sans 3, Source
Serif 4); no request goes to a font CDN.

Two layout facts are easy to get wrong. `html` and `body` set `overflow-x: clip`,
so `document.scrollWidth` cannot detect an element sticking out; the browser
audits measure each element's right edge instead. And several lists scroll
horizontally on purpose (subject rails, the A–Z bar), so the audit treats
`auto`/`scroll` ancestors as intentional and everything else as a defect.

## Checks

Jest covers the data, the utilities and the screens in jsdom. The current suite
and test counts are printed by `node scripts/by-the-numbers.js`, which is the
page the README quotes; they are not repeated here, where they would go stale
without anything failing. Jest cannot see layout, which is why the rest are
real-Chrome scripts against `build/`:

| Script | What it proves |
|---|---|
| `layoutCheck.js` | every screen, and two lessons, has no element past the right edge at 1440 and 375, and logs no console error |
| `nameAudit.js` | screens use the names the navigation registry gives them |
| `gameAudit.js` | every game can be reached and played, and the page logs no error |
| `atlasAccessibilityAudit.js` | the Atlas search label and index are usable |
| `atlasTopicVerify.js` | every tapped topic resolves to a lesson, a deep read, or an honest "not written yet" |
| `atlasTapAudit.js` | every field and discipline has a live topic and every written topic's call to action opens content |
| `levelsVerify.js` | every black hole level renders real content |
| `checkContrast.js` | the composited design tokens meet WCAG AA |

`src/auditCoverage.test.js` checks the checks: every browser script is wired to
an npm script and to CI, resolves Chrome through `scripts/chrome.js`, can exit
non-zero on its own findings, and the layout audit still opens lessons.

CI (`.github/workflows/ci.yml`) has four jobs: commit authorship, tsc + Jest +
build + contrast + `lint:all`, the layout job, and the atlas job. A fifth
workflow deploys `build/` to GitHub Pages.

## Build and deploy

`npm run build` is CRA's build. The Pages workflow publishes the output. The
app is served from a subpath on Pages, and `scripts/auditServe.js` strips that
base path so the audits can serve `build/` at the root.

## Known limits

- No server means no sync, no recovery and no real account. This is a deliberate
  choice, documented in `docs/DECISIONS.md`, not an unfinished backend.
- localStorage is per browser and per origin. Private browsing can refuse writes;
  the storage module reports that rather than pretending a save worked.
- 456 of 572 Atlas topics have nothing to read yet and say so. The count is
  visible in the README, the roadmap and the app.
- The games are content checks with a score, not a game engine.
