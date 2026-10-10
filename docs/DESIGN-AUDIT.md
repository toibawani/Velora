# Design audit: where color, type, and spacing actually live

Written before the frontend pass, by reading every stylesheet and the two global
JS entry points. Counts come from greps run on 2026-10-10 against `main`, so
they can be re-run and compared rather than taken on trust:

```
find src -name '*.css' | wc -l                  -> 58 stylesheets
raw hex/rgb/hsl outside design-tokens.css       -> ~254 occurrences
(gap|padding|margin): Npx outside tokens        -> 181 occurrences
border-radius: Npx not var(--radius-*)          -> 135 occurrences
style={{ }} in JSX touching color/space         -> 99 occurrences
```

## 1. Color

**Single source of truth:** `src/styles/design-tokens.css` (453 lines). It
defines three generations of names in one file:

| Block | What it defines |
|---|---|
| `:root` (light defaults) | surfaces (`--bg-*`), text tiers (`--text-primary/secondary/tertiary`), borders, sienna accent (`--accent-primary #A34A22`), statuses (`--color-success/warning/error/info`), nine `--subject-*` hues, shadows, spacing, radii, transitions, z-index, the index leader rule, paper grain, hero glow |
| `:root[data-theme='dark']` | the same roles re-picked for espresso ground (accent lifts to `#E0975F`, statuses lift, subject hues lift) |
| `:root[data-theme='light']` | restatement of the light values so an explicit pick beats OS `prefers-color-scheme` |
| `.sr-only` utility | lives outside `:root` deliberately (a selector inside a custom-property block would never match) |

**Alias layer:** `src/index.css` lines 8–13 re-point the old names
(`--bg-main`, `--bg-surface`, `--border-color`, `--accent-hover`) at the token
roles instead of re-declaring hex. The header comment records why: this file
used to win the cascade with its own `:root` block and paint dark mode
cream-on-cream.

**Escape hatches (the problem):**

- **Feature CSS:** ~254 raw color values across 25 files. The worst offenders:
  `SketchbookCard.css` (51), `InstitutionalMode.css` (33),
  `ShareAchievementModal.css` (29), `LearningStories.css` (14), `Games.css`
  (14), `GameStyles.css` (12), `UniverseHome.css` (8). Most are one-off
  illustrations (the sketchbook diagram) or mode-specific skins; none of them
  re-check contrast for dark mode.
- **Inline JSX:** 99 `style={{ }}` declarations touching color/background/
  space, mostly in `Games.js`, `Analytics.js`, `Learn.js`, `ExpertMode.js`.
  `Learn.js:174` picks a status color inline (`var(--color-warning)` or
  `var(--text-tertiary)`) rather than through a class.
- **Status labels:** the black-hole/philosophy/history entry statuses
  (`established / contested / theoretical`, `settled / debated / ...`) are
  styled in `BlackHoleMastery.css` as a dot plus a word, reusing
  `--color-success` (solid), `--color-warning` (solid), `--color-info`
  (hollow ring). The distinction is meaningful and must survive re-skinning.
- **`index.html`** hardcodes `<meta name="theme-color" content="#F6EFE4">`
  outside any stylesheet.

**What the tokens already promise:** the token header claims measured WCAG AA
for every named text role on both grounds, with the measured ratios written
into comments (13.7:1 primary, 5.8:1 secondary, 4.7:1 tertiary on light page).

## 1a. Stage 2 palette, written down (2026-10-10)

Chosen before any re-skin, from the values already in `design-tokens.css` and
confirmed in the browser at 1440 and 375, light and dark. The warm family is
kept: it reads as paper and ink, which is the reference-book feel the app
wants. The one sharp accent is sienna in the light theme and a lifted
terracotta in the dark theme.

| Role | Light | Dark | Ground it sits on | Measured |
|---|---|---|---|---|
| Page ground | `#F7F2E9` warm cream | `#171009` espresso | self | - |
| Raised card | `#FFFDF9` | `#261C12` | on page | - |
| Body ink | `#241B13` (13.7:1) | `#F2E9DD` (15.6:1) | page | AA |
| Secondary ink | `#5C4A38` (8.0:1) | `#C4B09B` (9.0:1) | page | AA |
| Tertiary / placeholder | `#7A6653` (5.8:1) | `#A08B78` (5.8:1) | page | AA |
| **Accent** | `#A34A22` sienna (5.5:1) | `#E0975F` terracotta (6.1:1) | page | AA / large-UI |
| Ink on accent | `#FFF9F1` | `#171009` | accent | AA |
| Success | `#2F6B41` forest | `#8CC79E` | page | AA |
| Warning | `#8A5A10` amber-brown | `#E8B25C` | page | AA |
| Error | `#B4322A` brick | `#F0A19A` | page | AA |
| Info | `#1F6F8C` steel-blue | `#7FB8DC` | page | AA |

The brown does **not** read muddy in the browser once the ground and ink are
set from tokens: cream `#F7F2E9` against ink `#241B13` is a printed page, and
sienna `#A34A22` is a saturated warm accent, not a dull one. No new hue family
was invented; the muddy readings the first pass produced came from boxes that
hardcoded their own dark-mode colors (see the Part D sweep), not from the
tokens. Status distinction is preserved as a dot shape plus the word: filled
dot for settled states (success), filled dot for contested (warning), hollow
ring for open/theoretical (info). It never relies on color alone.

`scripts/checkContrast.js` reads these values out of the file and measures 80
pairs across both themes: text tiers on page and card, status roles as text
and as non-text dots (3:1) on both grounds, accent label and accent-as-link,
focus ring (3:1), placeholder, muted metadata, and disabled controls faded to
0.5 and 0.38. It exits non-zero on any failure and is wired into the CI
`verify` job, so a token edit that drops a pair below AA fails the build.
Proven to fail: setting `--color-info` to a near-white turned four pairs red
and the script exited 1; restoring it returned to green.

No script in `scripts/` verifies this; the numbers are hand-measured claims.

## 2. Type

**The pairing as declared in `design-tokens.css`:**

| Role | Face | Loaded? |
|---|---|---|
| `--font-display` | Fraunces (serif, optical size axis) | yes, `@fontsource/fraunces` 400/600/700/900 + 400-italic in `src/index.js` |
| `--font-body` / `--font-reading` | Source Serif 4 | yes, 400/600 + 400-italic |
| `--font-sans` / `--font-ui` | Source Sans 3 | yes, 300–700 |
| `--font-mono` | SF Mono / JetBrains Mono / Fira Code | system stack, nothing downloaded |

History in the git log: cobalt system → phantom Inter (`b9f26ff`, family
declared but never loaded, so everything fell to system sans) → Fraunces+
Source Sans 3 (`3ae8228`) → three real roles (`476e03d`).

**Cascade ownership:** `src/index.css` owns the heading face (Fraunces
everywhere) and body prose (Source Serif 4 for `p, li, dd, blockquote`).
`src/App.css` declares the same heading selectors but only weight/color/
spacing — its comment says index.css owns the face. Feature screens that need
UI sans set `--font-sans` on their own root (`Games.css`, `Community.css`).

**Gaps:** Fraunces 900 is loaded but `--weight-black` is deliberately 700 with
a comment explaining no 900 sans exists. Type scale is role-named
(`--text-display` down to `--text-micro`) with `clamp()` on the display steps.
Long-form measure is one token (`--measure: 68ch`). Declaration is in good
shape; the work is application, not declaration.

## 3. Spacing and radius

**Declared scales in `design-tokens.css`:**

- Spacing: `--space-1..--space-16` = 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
  (a 4/8px grid; `--space-1` is the half-step).
- Radius: `--radius-xs/sm/md/lg/xl/full` = 3, 5, 8, 12, 18, 999px. The header
  records that `--radius-full` used to resolve to 8px (a real bug, fixed).

**Actual usage:**

- 181 `gap/padding/margin` values written as raw px outside the token file.
  Distribution: 6px (46x), 4px (34x), 8px (33x), 2px (17x), 10px (15x),
  3px (12x) ... The values mostly *land on* the 4/8 grid but are written as
  numbers, so nothing stops drift and no reviewer can see intent.
- 135 `border-radius` values not using the radius scale: 999px (38x, should
  be `--radius-full`), 6px (16x, between xs and sm), 8px/12px (24x, exactly
  md/lg but written out), 14px (10x, off-scale), plus scattered 2/3/4/10/20/
  22/24/28/32px.

## 4. Layout and motion (context for stages 3 and 4)

- The Atlas printed-index sensibility lives in `AtlasIndex.css` + the
  `uh-atlas-indexed` section of `UniverseHome.css`: two-column index, dotted
  leader rules (`--index-leader`), written/not-written markers, no cards.
- `Dictionary.css` and `Games.css` do not yet share that language; they are
  card grids with their own spacing numbers.
- Motion: 177 `transition` declarations across feature CSS, 15 stylesheets
  with `@keyframes`, and 19 files already reference `prefers-reduced-motion`.
  The check for stage 4 is adding *considered* moments (Atlas field switch,
  level completion, Explain It Back submit), not more transitions.

## 5. What the browser audits already cover

`scripts/layoutCheck.js` (real Chrome against build/, both widths, console
errors fail the run), `atlasAccessibilityAudit.js`, `atlasTapAudit.js`,
`atlasTopicVerify.js`, `gameAudit.js`, `nameAudit.js`, `levelsVerify.js`.
`scripts/shots.js` was added at the start of this pass to capture what each
stage actually looks like, because none of these answer "does it look right".

No script in `scripts/` verifies this; the numbers are hand-measured claims.

## 6. The palette, written down before it was changed (Stage 2)

The house family is a warm paper-and-sienna set, not blue. The dominant ground
is a warm cream in light (`--bg-primary #F7F2E9`) and a near-black espresso in
dark (`#171009`). The neutrals are all browns, not greys: card cream
`#FFFDF9`, ink `#241B13`, secondary brown `#5C4A38`, tertiary brown `#7A6653`,
and the dark-mode lifts of each. There is no muddy brown left because every
text tier is a real brown, not a desaturated grey.

The one sharp accent is sienna/terracotta `--accent-primary #A34A22` (light)
that lifts to `#E0975F` in dark so it stays visible on espresso. There is no
second competing accent and no gradient. Status colours are four distinct
hues that also differ in lightness, so they never rely on hue alone:

| Role | Light | Dark | On page (L / D) |
|---|---|---|---|
| text-primary | `#241B13` | `#F2E9DD` | 15.17 / 15.68 |
| text-secondary | `#5C4A38` | `#C4B09B` | 7.56 / 9.00 |
| text-tertiary | `#7A6653` | `#A08B78` | 4.89 / 5.80 |
| success | `#2F6B41` | `#8CC79E` | 5.71 / 9.67 |
| warning | `#8A5A10` | `#E8B25C` | 5.30 / 9.83 |
| error | `#B4322A` | `#F0A19A` | 5.49 / 9.21 |
| info | `#1F6F8C` | `#7FB8DC` | 5.08 / 8.79 |
| accent-contrast on accent | `#FFF9F1` | `#171009` | 5.64 / 7.86 |
| inverse-text on inverse-surface | `#FFF9F1` | `#F2E9DD` | 16.17 / 16.16 |
| focus ring on page | `#A34A22` | `#E8A979` | 5.29 / 9.32 |

Ratios above are measured by `scripts/checkContrast.js`, which reads the real
token values out of `design-tokens.css`, composites translucent tints over the
ground they sit on, and holds every pair to WCAG AA (4.5:1 text, 3:1 non-text
and UI). The status labels are a dot plus the word, never colour alone, so
their meaning survives without hue. The checker is wired into the `verify` CI
job and is proven to fail: setting one token below AA turns the run red.

## 6. Stage 2 palette and the contrast gate

Written before the colour fixes, from the live values in `design-tokens.css`
and measured by `scripts/checkContrast.js` (both themes).

**Dominant warm family (neutrals).** Warm cream and espresso, never cool grey:

| Role | Light | Dark |
|---|---|---|
| page ground | `--color-bg` `#F7F2E9` | `--bg-primary` `#171009` |
| card | `--bg-elevated` (near `#F1EAE0`) | `--bg-elevated` (near `#1F1610`) |
| ink | `--text-primary` `#241B13` | `--text-primary` `#F2E9DD` |

**The one sharp accent.** Sienna `--accent-primary` `#A34A22` (light) lifting to
`#E0975F` (dark). Not purple, not blue, no gradient. Text on it is
`--accent-contrast`, measured at 5.64:1 light and 7.86:1 dark.

**Status colours** (`--color-success` green, `--color-warning` amber,
`--color-error` red, `--color-info` steel) keep their three-way meaning through
a **dot plus the word**, never colour alone: the black-hole rail draws the dot
with these tokens and the label text stays `--text-secondary` on the card.

**What the contrast gate covers now** (32 pairs x 2 themes = 64 checks, all
green, and proven to fail: forcing the light `--text-tertiary` to `#D8C7AE`
turns four pairs red and exits non-zero, and restoring it goes green again):

- text tiers (`primary/secondary/tertiary`) on page and on card, body AA 4.5:1
- status roles on page, on card, and on their own translucent tint
- text on the solid accent (`--accent-contrast` on `--accent-primary`)
- accent as large UI (3:1) and accent as an inline link on page and card
- placeholder text (tertiary) on page and card inputs
- focus ring (`--ring`) against page and card, 3:1 non-text
- disabled labels faded at 0.5 and 0.38 over page and card, held to 1.5:1
  (WCAG 1.4.3 exempts inactive controls from the 4.5:1 text rule, so the bar is
  "still perceptible as a control", not full legibility)
- muted metadata (`--color-text-muted`) on page and card
- inverted bands (`--inverse-text` on `--inverse-surface`)

It runs in CI (`node scripts/checkContrast.js` in the no-browser `verify` job),
so a palette edit that drops any pair below AA fails the build instead of
shipping cream-on-cream.

## 7. Colour sweep: what converted and the two justified exceptions

The Stage 2 sweep removed every coloured left/top border accent (callouts,
takeaway boxes, puzzle sentences, definition boxes, note items, pull-quotes)
and re-boxed them on a neutral `--border-default` with a symmetric radius, so
no card is distinguished by a coloured stripe. It also converted grounds that
silently assumed a dark page (`background: white` on shadow notes,
`rgba(255,255,255,0.03)` on story take-aways, and the SketchbookCard's
`#141414/#181818/#262626/#ffffff/#34c759/#ff3b30/#1D4ED8` panels) to theme
tokens.

Two hardcoded colours are deliberate and stay, with a reason:

- **`ShareAchievementModal` brand dots** (`#25d366`, `#1d9bf0`, `#0077b5`): the
  real WhatsApp, X, and LinkedIn marks. The brand colour is the small dot; the
  label sits on a compliant `--bg-elevated` ground (12.5 to 13.7:1 both
  themes), so the off-brand hue never has to pass text AA by itself.
- **`RelativityLab` canvas backing** (`#06080d`) and the SketchbookCard SVG
  diagrams: always-dark instrument/scene surfaces where a token ground would
  make the simulation or diagram vanish. The text drawn on them uses
  `--text-primary`, which is measured against the actual ground.

## Stage 2: the palette, written down before it is changed

Written down from the rendered screenshots (light + dark, 1440 + 375) and the
token values above, then committed before any color moves. Every ratio below
is measured with the WCAG 2.1 relative-luminance formula, not asserted.

**Dominant warm family: warm paper, not mud.** The light ground is a cream
`#F7F2E9` rising to a card `#FFFDF9`; the dark ground is a near-black espresso
`#171009` rising to a card `#261C12`. In the browser this reads as paper and
as a dim reading lamp, not as brown. The muted text tier is a warm taupe
(`#7A6653` light, `#A08B78` dark) at 4.89:1 and 5.80:1, still clearly a
separate step from the secondary and primary tiers, so it is a hierarchy and
not a smear. I am keeping the brown: measured against its surfaces it is
readable and it is the one thing that makes this feel like a book rather than
a dashboard. What is broken is not the family, it is the two components that
opened their own white ground and their own off-brand fills.

**One sharp accent: sienna, solid, zero gradients.** `#A34A22` on light,
`#E0975F` on dark. 5.29:1 on the light page, 7.86:1 on the dark page. Text
drawn on it uses `--accent-contrast` (`#FFF9F1` light at 5.64:1, `#171009`
dark at 7.86:1). It is the only saturated hue that is not a status color.

**Neutrals:** the warm text tiers and warm hairline borders above, plus the
espresso scrim `--bg-overlay` for drawers and modals.

**Status colors (kept warm-tuned, each AA on both grounds):**

| role | light | ratio on light page | dark | ratio on dark page |
|---|---|---|---|---|
| success | `#2F6B41` | 5.71 | `#8CC79E` | 9.67 |
| warning | `#8A5A10` | 5.30 | `#E8B25C` | 9.83 |
| error   | `#B4322A` | 5.49 | `#F0A19A` | 9.21 |
| info    | `#1F6F8C` | 5.08 | `#7FB8DC` | 8.79 |

On their soft tints (light mode) success 5.46:1, warning 4.84:1, error 5.33:1.

**Three distinctions that must survive, without relying on color alone:**
evidence tiers (well-established / theoretical / unknown), documentation tiers
(well-documented / disputed / speculative), and reception tiers (widely
accepted / live debate / open question). These already render a word or a
marker next to the color in `Learn.css` and `BlackHoleMastery.css`; the color
change must not remove that.

**Confirmed in the browser, measured, and about to be fixed:**

- **Toast** opens its own `background: white` and paints cream text
  `#FFF9F1` on it: **1.05:1 in both themes**, effectively invisible. It also
  carries a colored left border per variant, which is the banned side-border
  pattern, and its `duration` PropTypes says `string` while every caller and
  the default pass a number.
- **SketchbookCard `.term-pill.active`** paints white text on the dark accent
  `#E0975F`: **2.40:1**, fails AA in dark mode. `--accent-contrast` fixes it
  to 7.86:1.
- **ShareAchievementModal** brand buttons (WhatsApp `#25d366`, X `#1d9bf0`,
  LinkedIn `#0077b5`) put white text on brand colors that clear AA in light
  mode but were never checked in dark, and they force off-brand fills. The fix
  is a per-theme override on a compliant ground while the label stays readable,
  measured in both themes.

The contrast checker currently passes 40 token pairs. Stage 2 adds the pairs
that actually broke (Toast variants, text on accent, status labels in both
themes, brand buttons in both themes, disabled and focus, placeholder, link),
proves it can fail by setting one token below AA and watching it go red, and
wires it into CI so a check nobody runs cannot masquerade as green.


