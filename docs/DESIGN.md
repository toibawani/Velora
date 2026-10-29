# The Collection

Velora is a reference book, not a dashboard. This document is the reasoning
behind the visual system the screens are built from, so that a new screen can be
added without re-deciding what a card is.

The short version: **a screen is a spread.** A flat field of pigment, one
oversized statement in Fraunces, a hairline rule, and an object — an arch, a
scallop, a disc — that carries the eye down the page.

---

## 1. What was wrong before

Three things, and all three were systemic rather than cosmetic.

**Everything was a card.** The hero was a card, each statistic was a card, each
module was a card, each lesson section was a card, and the empty state was a
dashed card. When every element has the same edge, radius, border and shadow,
nothing is a figure and nothing is a ground. A page becomes a list of equally
important boxes, which is the visual signature of a dashboard template.

**One material decided the shape of every control.** `index.css` contained a
global `button:not(...)` rule with eight exceptions that set the background,
border and radius of every control in the product. A page could not choose its
own material; it could only out-specify the global rule, which is why several
feature stylesheets are full of `!important`.

**Colour was tonal, not structural.** The palette was warm espresso and cream
with a sienna accent — a good palette — but it was used as a *tint*. Panels were
`bg-tertiary`, cards were `bg-elevated`, and the difference between the two was
four percent lightness. Nothing on a page was a block of colour, so nothing could
be composed with.

---

## 2. The layer

`src/styles/edition.css` holds the primitives. It loads after the design tokens
and before the page CSS, so a page composes the system and never redeclares it.

| Primitive | What it is for |
| --- | --- |
| `.vl-page` | the shared margins, so moving between screens does not move the left edge |
| `.vl-statement` | the one oversized sentence a screen gets, with an italic half |
| `.vl-kicker` | the small uppercase line above a section, optionally with a rule running out of it |
| `.vl-numeral` | the `01 / 02` marker that turns a section into a chapter |
| `.vl-field` + `--blush/butter/sage/lilac/clay/ink` | a flat block of pigment with its own ink |
| `.vl-arch`, `.vl-scallop`, `.vl-disc`, `.vl-blob` | the silhouettes the spreads are built around |
| `.vl-pill`, `.vl-btn`, `.vl-textlink` | three weights of action |
| `.vl-card` | the one shadowed, raised thing, used sparingly |
| `.vl-settle` | the single entrance animation, staggerable with `--i` |

### Fields, not tints

A field is a paper stock, not a transparency. Each one has a text partner,
because a field always carries type:

```
--field-blush: #F0D3CB;   --field-blush-ink: #57241A;
--field-butter: #EFD58E;  --field-butter-ink: #4A3608;
--field-sage: #D8DFC4;    --field-sage-ink: #2E3618;
--field-lilac: #D9D3EC;   --field-lilac-ink: #2F2450;
--field-clay: #E3BFA8;    --field-clay-ink: #4E2A18;
--field-ink: #221A12;     --field-ink-text: #FBF6EC;
```

The night edition is not these values dimmed. The papers become inks and the
inks become papers, and each pair is chosen for its own contrast — pastel fields
lightened by a few percent glow, they do not darken.

Two consequences are easy to miss and both were bugs during the rewrite:

1. **A track inside a field is drawn in the field's ink, not in white or black.**
   `--field-tint` exists for exactly this. A hard-coded `rgba(255,255,255,.4)`
   progress track is invisible on the same plate at night.
2. **A solid ink slab inverts at night**, so its label takes the field's paper
   value, never `#fff`.

### Type

Three families, three jobs:

- **Fraunces** — display. Statements, headings, numerals, the drop cap.
- **Source Serif 4** — long-form body. Lessons, dictionary definitions, legal.
- **Source Sans 3** — chrome. Nav, labels, buttons, metadata.

The rules that keep a page readable:

- A statement is `clamp(2.4rem, 5.4vw, 4.5rem)` at `-0.028em` with `0.98`
  leading. It is allowed to dominate, because it is the only one on the screen.
- Body is `1.0625rem` at `1.7–1.75` leading, capped at `68ch`.
- Metadata is `0.6875rem` uppercase at `0.14–0.16em` tracking. Anything under
  12px is not text, it is a texture.

### One shadow

There is one shadow in the system, and it means *this object is above the page*:
a hovered card, a floating dock, an open palette, a toast. Nothing at rest has a
shadow, which is what lets the spreads read as printed rather than as a stack of
floating panels.

---

## 3. The screens

Each screen is composed from the same parts, but the *proportion* changes, which
is what stops the app from looking like one long template.

| Screen | Ground | The object | The move |
| --- | --- | --- | --- |
| **Cover** (`Splash`) | paper | blush plate with a drawn arch composition; butter index riser | the title is the largest thing in the product, and the counts are read from the curriculum, not typed |
| **Look around** (`LandingPage`) | paper | sage plate with the written count; ink section for what is missing; clay invitation | four numbered sections, each with its own ground |
| **Setup** (`LocalProfile`) | paper | blush plate holding the step numeral and the question | the consent sentence sits next to the question, not under the form |
| **Atlas** (`UniverseHome`) | paper | butter index panel; ink topic plate | statement column against a pigment panel; the field rail is a thumb index of plates |
| **Subject** (`Learn`) | paper | — | sections open above a hairline; a module's topics are lines you scan down |
| **Dictionary** | paper | sage example block per entry | a lexicon: ruled entries, a printer's drop cap instead of a boxed badge |
| **Games** | paper | one soft disc of each game's own colour | the colour that was only an icon tint now has an area |
| **Journey** | paper | — | totals between two rules; the feed is one ruled column |
| **Insights** | paper | — | four figures divided by rules, no containers |
| **Question desk** | paper | blush card you write on | notes hang off a hairline, not out of a box |
| **Next up** | paper | blush add-card | items are ruled lines |
| **Settings** | paper | — | numbered sections, lozenge choices |
| **Lesson** | paper | butter "where the edge is" | the only screen that is only text: drop cap, numbered sections, no cards |
| **Legal** | paper | — | a document: dated rule, numbered sections in the margin, 62ch |
| **Dialogue** | paper | ink figure chip | portrait strip over ruled biography |
| **Roadmap** | paper | — | a report: figure totals, stamped states, numbered sections |

---

## 4. Motion

One entrance (`.vl-settle`, 520ms, 14px, `cubic-bezier(.16,1,.3,1)`), staggered
by `--i` and capped at six steps so a long list cannot take a second to appear.
One hover lift (`-1px` for a button, `-2px`/`-3px` for a card). One slow drift
for decorative shapes only.

Everything is switched off under `prefers-reduced-motion: reduce`, including the
transforms, not just the durations.

---

## 5. Print

`src/styles/print.css` is loaded last and applies only inside `@media print`. It
forces the daylight edition (a dark theme printed as a black page is a bug), hides
everything that exists to be pressed, sets the reading column to 68 characters at
11pt, prints the address after a prose link, and keeps a lesson block or a legal
section from breaking across a page.

---

## 6. Rules for the next screen

1. Compose from `edition.css`; do not add a fourth card style.
2. One statement per screen. If there are two, one of them is a heading.
3. A field carries type. Give it its own ink, never `#fff` and never black.
4. Rules before boxes. A hairline between two things is cheaper than two borders
   around them.
5. A shadow means "above the page". At rest, nothing is.
6. Never write a number into a screen that the data can answer.
7. Check both themes and a coarse pointer before calling it done. The three
   screens that print are the Dictionary, the Lesson and the legal pages.
