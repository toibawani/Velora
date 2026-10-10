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


