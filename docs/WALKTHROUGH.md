# A walkthrough

This follows the app the way a first-time visitor meets it, and names the file
that renders each step. If a screen is described wrongly here, the code is
right and this page is wrong; open the file and fix this page.

## 1. Splash

`src/screens/Splash.js`. The wordmark, one sentence about what this is, and two
buttons: **Start learning** and **Look around first**.

- Start learning goes to the local profile.
- Look around first goes to the landing page, where the inventory is visible
  before anything asks for a name.

There is no email field, no password field and no "Sign in with" button anywhere
in this flow, because there is nothing to sign in to.

## 2. What should we call you?

`src/screens/LocalProfile.js`, step 1. One field, labelled **Display name**, and
a note that the name stays on this device. It has to be at least two characters.
Nothing is checked against a server, because there is no server.

Step 2 asks **What are you here for?** with a grid of subjects and a goal. The
answers are saved under `velora_onboarding_preferences` and shape what the atlas
opens first. Skipping is possible; nothing is gated on the answers.

The tour (`src/components/OnboardingTour.js`) can point at the atlas, Learn and
the dictionary, then gets out of the way.

## 3. The atlas

`src/screens/UniverseHome.js`. This is the home screen. From top to bottom:

- A greeting with the name from step 2.
- **Pick up where you left off**, if a lesson has been opened before. The card
  stores the last lesson and opens it in one press.
- A question of the day, drawn deterministically from the Curious Dictionary, so
  the same day shows the same question to everyone and tomorrow shows another.
- The knowledge atlas: 6 fields, 34 disciplines, 572 topics. Every topic is on
  screen in the index, with its written/unwritten state in its accessible name,
  not only in its colour.
- The coverage line, for example `Science: 89 of 188 topics written`, so the
  gap is visible before a reader taps anything. (116 is the total across all
  fields; 89 is Science alone.)

A tap resolves through `src/data/atlasResolution.ts` to one of four answers:

| Answer | What happens |
|---|---|
| a lesson exists | `LessonReader` opens the topic |
| a deep read exists | the read opens, on the exact level the topic names when it names one |
| the topic is planned but unwritten | the screen says **not written yet** and does not pretend otherwise |
| the whole field has no curriculum | the field is listed, and says so |

## 4. A lesson

`src/components/LessonReader.js`. The header has **Back to path**, **Rabbit
Hole**, **Save for review** and **Share**. The body is the kicker (module and
reading time), the title, the one-line hook, the story, the teaching sections, a
worked example or list where the topic has one, the sources with links, an
uncertainty note, and connections to nearby topics.

Two details are deliberate. Time is recorded when the reader unmounts, not on a
timer that runs while the tab is hidden. And the sources are links to real works,
not a bare citation, because a citation without a link is decoration.

## 5. The dictionary

`src/screens/Dictionary.js`. Search across every subject, subject pills, and an
A–Z bar where each letter states how many entries sit behind it. Empty letters are
disabled and labelled "No terms under X" rather than being a click that produces
nothing.

Each entry is a card: a tagline, an explanation, a **Concrete Example**, and
**Where this comes from** with a link. The header states `3 of 138 checked against
source`; entries that have not been read back say **not checked yet** on the
card. A source URL is not the same thing as verification, and the screen does not
blur the two.

## 6. Games, simulations and the rest

`src/screens/Games.js` lists the 8 games: five concept games (Scrabble,
Definition Duel, Knowledge Chain, Quantum Quiz, Word Puzzle) and three brain
games (Connect the Concept, Counterintuitive, Explain It Back). The six
simulations are a separate list. A game is a short round over material already in
the app, not a separate course.

The drawer holds the screens that do not fit in the bottom bar:

- **Next up** (`src/screens/NextUp.js`) — things the reader asked to come back to.
- **Roadmap** (`src/screens/Roadmap.js`) — what is built, half-built and not
  started, with the atlas/lesson gap stated.
- **Settings** — theme and the answers given at setup.
- **Question desk** (`src/screens/Community.js`) — the reader's own questions and
  notes against them. There is no forum and no other people; the old seeded
  explanations were removed rather than dressed up as a community.
- **Intellectual Dialogues** — scripted conversations with historical figures,
  written from their surviving work.
- **Privacy** and **Terms** — what leaves the browser (nothing, by default) and
  what the app promises.

## 7. Insights and Journey

`src/screens/Analytics.js` and `src/screens/Journey.js` read the event log in
localStorage. Insights shows time actually spent and what it went on; Journey is
a timeline of sessions on this device. Neither is a score, and neither is sent
anywhere. Clearing site data empties both, and the screens say so rather than
showing a friendly zero it cannot explain.

## 8. Coming back

The profile, the last lesson, saved reviews, tasks and notes all live in
localStorage under the registry in `src/utils/storage.js`. On a new browser there
is nothing to restore, and nothing is missing from a server, because there is no
server. That is the trade the app makes: no account, no sync, no recovery.

## Where the checks fit

- Every screen above is walked by `scripts/layoutCheck.js` at 1440 and 375, and
  two lessons are opened and measured at both widths.
- `scripts/atlasTopicVerify.js` taps every atlas topic in a real browser and
  fails if a tap produces neither content nor an honest "not written yet".
- `scripts/gameAudit.js` plays the games and fails on a console error.
- Jest covers the data and the screen logic in jsdom, including the resolver's
  four answers and the dictionary's verified count.

The rule for a new screen is in `src/navigation.js`: add it to `SCREENS` and the
navigation, the drawer and the layout audit all pick it up. The rule for a new
lesson is in `scripts/layoutCheck.js`: add the subject's first written topic to
`LESSONS` in the same commit.
