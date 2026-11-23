# Stage 1 audit: what Velora looks like today

Written before any Stage 2 change. Every number below came from a command run in this
session against the app served by `react-scripts start` at `http://localhost:3000/Velora/`,
driven in the real Chrome binary (`/Applications/Google Chrome.app`) at 1440x900, 768x1024
and 375x812, in light and dark.

Screens covered: 13. Screenshots taken: 88 (13 screens x 3 widths x 2 themes for the six
primary screens, 13 x 2 widths x 2 themes for the rest). Console errors across all of them:
**none**.

Evidence lives in `audit-artifacts/stage1/` (gitignored): `*.png`, `capture-report.txt`,
`secondary-report.txt`, `console-errors.txt`.

## Measured contrast of the palette as it stands

40 token pairs, light and dark, all text-on-ground combinations plus every subject and
status colour: **0 of 40 fall below 4.5:1**. The palette is not an accessibility problem.
Lowest pair in use: `--text-tertiary` on the recessed band, 4.56:1.

So the palette problem is not contrast. It is that the whole product sits inside one warm
pastel band: one cream ground, one sienna accent, four tinted plates (blush, butter, sage,
clay, lilac), and nine subject hues that are defined but almost never used at surface
scale. Nothing alternates dark against light, so every screen has the same value structure.

## Type sizes actually rendered

| Screen | h1 at 1440 | h1 at 375 | Body |
|---|---|---|---|
| Splash | 104px | 52px | 17px |
| Landing | 80px | 44px | 17px |
| Atlas | 62.4px | 40px | 17px |
| Learn | 29.6px | 21.6px | 17px |
| Dictionary | 54.4px | 32px | 17px |
| Games | 64px | 38.4px | 17px |
| Insights | 16.8px | 16.8px | 17px |
| Journey | 51.2px | 32px | 17px |

Two facts follow. The screen-title scale is not a scale: h1 ranges from 16.8px to 64px
across screens that are all top-level destinations, and Insights' h1 is smaller than body
text. And at 375 the Atlas h1 is 40/17 = **2.35x** body, under the 3x floor, because the
display step is a `clamp()` that shrinks with viewport width.

The faces are already right and already installed: Fraunces for display, Source Serif 4 for
long-form reading, Source Sans 3 for chrome. No new font packages are needed. The problem
is the sizes and the fact that the display face is used at section-head size rather than as
a confident page statement.

## What looks generic

Counted across `src/`, not eyeballed:

- 42 uses of `pill`/`badge` in class names.
- 10 cards drawn with a 3-4px coloured left border (`Games.css`, `Community.css`,
  `NextUp.css`, `ConversationBots.css` x2, `GameStyles.css` x2, `Universe.css`,
  `Settings.css`, `Dictionary.css`).
- 9 `backdrop-filter` declarations (glass bars in `CommandPalette.css`, `MobileNav.css`,
  `OnboardingTour.css` x4, `PhysicsSimulations.css`, `UniverseHome.css`, `global-compat.css`).
- 3 files containing `linear-gradient` (the two hero glows and one ambient wash).
- 0 gradient-text declarations.
- 35 em dashes in `src/screens`, `src/components`, `src/games`.
- 4 buzzword hits, of which one is user-facing copy (`Learn.js` line 447, "unlock").

The generic impression is not made of purple gradients and gradient text; those are absent.
It is made of five pastel plates, cards with coloured side borders, a pill for every
control, glass chrome, and no dark/light alternation.

## What is broken

1. **Fabricated progress on a brand-new profile.** `src/components/MasteryPath.js` hardcodes
   `completed: true` on two Physics lessons and two Philosophy lessons, plus "30 Days
   Cadence" and per-lesson "8 min"/"10 min" estimates. The Learn screen therefore tells a
   first-time visitor "2 of 5 core modules verified (40%)". Its Review and Start Module
   buttons have no `onClick` at all. This is the same class of defect the repo has been
   removing elsewhere, and it is the one a judge can catch in ten seconds by opening the
   app on a clean profile.

2. **The counts do not reconcile.** On a clean profile, in one session:
   - Splash: 05 fields, 32 disciplines, 121 lesson topics, 186 dictionary entries.
   - Atlas: 06 fields, 34 disciplines, 572 topics, 116 written.
   - Landing: 116 of 572 topics written across 6 fields.
   - Roadmap: 86 written lessons across 5 subjects.

   Each number is computed from a real module (`CURRICULUM` for the cover,
   `KNOWLEDGE_FIELDS` for the atlas), so none is invented, but the cover and the atlas are
   counting two different data sets and presenting both as "what is inside". A judge who
   reads the cover and then the atlas sees 121 and then 572.

3. **Every game icon is invisible.** `Games.js` passes `color: '--text-secondary'` to the
   lucide icon, so the SVG inherits `stroke: none`. Measured on the live games hub:
   `getComputedStyle(svg).stroke === "none"`, icon box 24x24. Six empty circles sit where
   the game icons should be.

4. **The games hub contradicts itself.** The hero says "Six rounds, one sitting" and the line
   directly above the grid says "8 games and 6 simulations, holding 269 questions...". Both
   are computed, from different lists. The hub also wraps its back button and tab row at
   1440 (header is `flex-wrap` with no basis).

5. **The fixed bottom nav covers content at 375.** The games hub's "Pick one for me" and the
   dictionary's "JUMP TO" rail both render under the 64px bar. There is no padding for it.

6. **The Dialogues header is transparent.** Scrolled content stays visible above and beside
   the "Intellectual Dialogues" title, and the subtitle runs under the hairline rule. The
   screen also offers a free-text "Ask Albert Einstein a question..." box answered by a
   scripted reply — the honest caveat is present, but the input invites exactly the question
   it cannot answer.

7. **Roadmap's stat strip overlaps.** "9 WORKING NOW / 6 PARTLY BUILT / 6 NOT STARTED" is
   drawn so the labels collide ("PAREDLY BUILT") at 1440.

8. **Landing at 375 collides.** "Back to the cover" in the masthead runs into the control
   beside it and clips at the right edge.

9. **Touch targets at 375.** Atlas: 223 controls, **192 under 44px** (188 of them 32px tall —
   every topic row in the index). Dictionary: 248 controls, **159 under 44px** (146 at 38px).
   Learn: module buttons at 27-29px tall. Games: 15 under 44px, including one 16x16 control.

10. **The dictionary is one 89,000px column.** 186 entries render at once: 89,048px tall at
    1440, 133,191px at 375. There is an A-Z rail with counts and subject filters, so the
    structure exists, but there is no paging or windowing and the page is unnavigable by
    scroll. Its honesty line reads "3 of 186 checked against source".

11. **No horizontal scroll anywhere.** `scrollWidth === innerWidth` on all 13 screens at 375
    and 1440. The only negative-position elements are the closed off-canvas drawer, which is
    expected. This one passes.

## Why each game is boring

Basis: I read the round logic of Concept Check, Knowledge Chain, Definition Duel, Concept
Scrabble and Concept Puzzle, and the hub that lists all eight. Hands-on play of all eight is
Stage 4, and the verdicts there may sharpen these; nothing below is a guess about how a game
feels, only about what its code does when it is played.

The shared cause: five of the eight are the same interaction — read a prompt, produce one
answer, receive a verdict — and the score is the count of correct answers times a constant.
Only one game has a clock. None escalates beyond "more items". There is no reason to play a
second time except to see a larger number.

- **Concept Check** (quiz, 79 questions): no timer, every question worth the same, one
  question per screen behind a Next button. Many distractors are eliminable on sight ("A
  type of telescope", "It is smaller than light"), so the round rewards reading speed, not
  knowledge. Crucially for the demo: 79 questions by default means the end screen is not
  reachable in three minutes, and the end screen is the best thing in the game.
- **Concept Scrabble**: build terms from a rack, 100 points per word regardless of word
  length or rarity. No clock, no escalation within the rack. The only tension is running out
  of letters.
- **Knowledge Chain**: 12 chains of four concepts, orders graded as a whole. No clock, and a
  forced 2.6-second pause after each correct chain stops the momentum it just built. A hint
  halves that chain's points. Feedback is one sentence: "Not quite: that is the right four
  concepts in the wrong order."
- **Definition Duel**: the only game with real pressure — 60 seconds, typed answers, 40
  pairs. The core loop is good and the clock creates stakes. Its weakness is typing
  precision rather than knowledge.
- **Concept Puzzle**: fill in a missing word, 100 points each, no clock, no escalation.
- **Relativity Lab**: sliders over formulas with no goal, no score and no failure. It is a
  demonstration of an equation; as a game it has nothing to win.
- **Connect the Concept / Counterintuitive True-Myth / Explain It Back**: three brain-game
  tabs, of which True/Myth is the only rapid-fire round. Explain It Back asks for writing in
  30 seconds and cannot judge what was written, so it cannot feed back.

## Proposed direction

### Palette: "Ink, Paper, Ember"

Measured with the same WCAG function as above; 21 pairs checked, all AA except two that the
rules below deliberately exclude from text.

| Role | Light | Dark |
|---|---|---|
| Page ground | `#F3EDE1` paper | `#14100B` night |
| Recessed band | `#EAE0CD` | `#1E1710` |
| Index band (ochre) | `#E7D6B4` | `#2A2118` |
| Ink | `#191009` (16.09:1) | `#F4ECDF` (16.15:1) |
| Ink soft | `#4E3F31` (8.66:1) | `#C6B5A2` (9.50:1) |
| Ink mute | `#6F5F4D` (5.27:1) | `#A08B78` (5.80:1) |
| Ember (dominant warm) | `#B1431A` (4.88:1) | `#F08A4B` (7.61:1) |
| Ochre (rules, numerals) | `#8A5A12` (5.07:1) | `#D8A94E` |
| Signal (sharp cold accent, interaction only) | `#14565F` (7.13:1) | `#8FCFD2` (10.84:1) |
| Oxblood (deep section band) | `#5E2318` with 10.36:1 paper text | - |

Rules that come out of the measurements:

- `#B1431A` ember on night measures 3.33:1. That passes the 3:1 non-text threshold and fails
  AA for text, so on dark bands ember is a rule or a graphic and never a label. Text there
  uses `#F08A4B` (7.61:1).
- `#14565F` signal on night measures 2.28:1 and is ruled out entirely. Dark bands use
  `#8FCFD2` (10.84:1).
- `#6F5F4D` ink-mute on the ochre band measures 4.29:1 and is not used there; that band uses
  ink-soft at 7.06:1.

Against the current palette, this is a colder paper, a darker and more saturated ember, a
genuinely separate cold accent that appears only on interactive state, and two dark grounds
(ink and oxblood) that sections can alternate onto. `scripts/checkContrast.js` reads the real
token values and composites translucent roles, so any change must keep that gate green.

### Type

- Display: **Fraunces** (installed), 400/600, set at 96-160px on desktop and never below
  56px at 375, tracking -0.03em, the second clause in italic. 112px display against 18px body
  is 6.2x; 56px at 375 against 18px is 3.1x, above the floor at the smallest width.
- Reading: **Source Serif 4** (installed), 18px/1.7, measure 62ch.
- Marginalia and numerals: the system mono stack already in `--font-mono` (SF Mono on this
  machine). Folios, section numerals, counts and sources are set in it. Source Sans 3 stays
  for form controls only.
- The screen-title scale becomes one step (`--text-title`) applied identically on all 13
  screens, replacing the 16.8px-to-64px spread measured above.

No package.json or lockfile change is required for any of this.

### The one visual idea: "The Printed Index"

Every screen is a page of one physical reference book, and the structure — not the colour —
is what makes it recognisable:

1. A left margin rail carrying section numerals in mono and a single hairline that runs the
   height of the page. A thin ember thread (1px, or 3px on mobile) runs inside that rail and
   turns the corner at each section boundary.
2. A running folio bottom-right in mono ("VELORA - 042") that reads position in the page.
3. Heads flush left, ragged right, one large numeral per section, rules instead of card
   borders and no shadows and no pills.
4. Exactly one moving, saturated thing per section: the figure or the simulation. Everything
   else is ink on paper.
5. Original line-drawing plates per subject, in the same hand as the existing Splash
   `CoverPlate` (which is already good and already subject-agnostic), with the grain tile
   the tokens already define. One plate per field, drawn as a diagram rather than decoration.

At 375 the rail collapses to the ember thread at the left edge of the header plus the folio,
so the motif survives the width change instead of disappearing.

### Flagship: Black Holes

Reasons, from what is on disk rather than preference:

- It is the only subject with a real multi-level structure: 8 levels (files
  `level0-big-picture.ts` through `level7-frontier.ts`), 53 entries as rendered, a level rail
  that reports position ("LEVEL 0 OF 7").
- It already carries checkable physics and tests: `level1Schwarzschild.test.ts` and
  `level6Thermodynamics.test.ts` exist, so a formula can be asserted rather than described.
- It can be made visual in a way a 3-minute demo needs: curvature, photon paths, orbit
  capture, two clocks. `RelativityLab` and `BlackHoleCanvas` already exist to build on.
- Philosophy, the only other candidate, is text-only in this build: 4 written lessons per the
  Roadmap. There is nothing on that screen to watch for 20 seconds, which is what the demo
  path requires.

## What the demo path needs that does not exist yet

- A 10-second answer to "what is this". The cover does say it, but the atlas that follows
  opens on a 572-topic index, not on the flagship.
- A simulation worth stopping for. Relativity Lab has sliders and no goal.
- A game with an end screen inside 90 seconds. Only Definition Duel (60s) qualifies today;
  Concept Check needs 79 questions.
- Nothing that shows a false number. MasteryPath currently does.

## Not done in this stage

No product code changed. No test suite run, because nothing changed; the first full
tsc/jest/lint/build/layout run happens with the Stage 2 commit. Two pre-existing working-tree
items are untouched and uncommitted: a modification to `src/screens/UniverseHome.js` that
defaults the atlas to Black Holes, and an untracked scratch script `walk.js` at the repo root.
