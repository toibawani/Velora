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
