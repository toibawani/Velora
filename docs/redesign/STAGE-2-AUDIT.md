# Stage 2 audit: the six simulations

Written before any Stage 2 change. Every finding below was seen in the running
build at 1440 and 375, or read in the component that draws it. The before
screenshots are in `docs/redesign/sims-before/`, one per simulation per width.

## What counts as a simulation here

| # | Simulation | Component | Where a reader finds it |
| - | ---------- | --------- | ----------------------- |
| 1 | Newton's second law | `PhysicsSimulations.js` | Flow → Physics Simulations |
| 2 | Projectile motion | `PhysicsSimulations.js` | Flow → Physics Simulations |
| 3 | Vacuum vs air drop | `PhysicsSimulations.js` | Flow → Physics Simulations |
| 4 | Wave interference | `PhysicsSimulations.js` | Flow → Physics Simulations |
| 5 | Orbital mechanics | `PhysicsSimulations.js` | Flow → Physics Simulations |
| 6 | Relativity Lab | `RelativityLab.js` | Flow → Concept Puzzles → Relativity Lab |

`WhatIfSimulator` is not one of the six. It is four written counterfactuals
behind a two-second fake loader and empty picture boxes, with no variable to
change and no behaviour to observe. It is recorded here and left out of the
count; calling it a simulation is the kind of label this stage exists to remove.

## What is wrong, in the order a reader meets it

1. **Two headers stack.** The games hub draws its own back button, three tab
   pills and a count line above the laboratory's own back button, kicker and
   headline. At 375 the hub chrome fills the first 330 pixels, so the
   simulation itself starts below the fold and the tab rail is cut mid-word
   ("Projectile Motio"). The lab is a screen, not a tab inside a second screen.
2. **The tab rail is a strip of five pills with no order and no context.** The
   labels are long ("Newton's 2nd Law (F=ma)"), two of them are shortened into
   jargon ("Vacuum vs Air Drop", "Wave Interference"), and at 375 the third,
   fourth and fifth are off-screen with nothing to say so.
3. **Diagram text shrinks to unreadable at 375.** Five figures use a 620-unit
   viewBox drawn into about 330 CSS pixels, so a 10px label renders at roughly
   5px. The distance ticks under the Newton track and the axis labels under the
   projectile arc are decoration at phone width, not information.
4. **The figures ignore the theme.** Every stroke and fill in the five physics
   drawings is a fixed hex value (`#6E5846`, `#2C2118`, `#FFF9F1`, `#A33B32`,
   `#3F6B4A`, `#A56A2A`). None of them follows the paper-and-ink tokens, so the
   drawings do not change with the theme and the greens and reds sit outside the
   one-ember palette.
5. **Measured values and formulas share the same slot.** Orbit's telemetry reads
   "Circular Orbital Velocity: v_circ = √(GM/r)" and "Escape Velocity Threshold:
   v_esc = √2 · v_circ" where the other simulations print numbers. A reader
   cannot tell what the satellite's speed actually is.
6. **Newton's friction arrow disagrees with its own dynamics.** The arrow and
   label print `f = μmg` (17.6 N for 10 kg at μ = 0.18), while the acceleration
   uses `min(F, 0.18F)` (7.2 N at F = 40 N). The picture is right and the motion
   is wrong, and the screen shows both.
7. **The free-fall note has the mass ratio wrong.** It says Earth pulls "four
   hundred times harder" on a 20 kg ball than on a 5 g feather. The ratio is
   4,000. The point of the paragraph is that the two effects cancel exactly, so
   the number has to be the real one.
8. **Wave interference prints a fringe spacing that is not measured and not
   reproducible.** The readout is `λ × 300 / d` while the tank's screen edge sits
   at 320 units from the sources, and nothing on the screen is sampled. The
   number is an assertion in the same typeface as the measurement.
9. **Orbit's escape state leaves the picture before it announces itself.** The
   simulation declares escape at r > 240 in a 600 × 220 viewBox whose centre is
   at (300, 110), so the satellite is outside the drawing for most of the
   approach to the threshold.
10. **Relativity Lab prints raw LaTeX.** Visible strings include `($M$)`,
    `($r / r_s$)`, `($10^{-6} M_\odot$)`, `($R_S$)`, `($\GAMMA_G$)` and
    `($\THETAS$)` — dollar signs, backslashes and all. The data was written for a
    renderer this app does not have.
11. **Relativity's three sliders have no accessible name.** The visible labels
    are sibling spans with no `for`/`id` pair and no `aria-label`; the five
    physics sliders do have labels. A screen reader announces "slider" three
    times.
12. **Relativity is laid out as a dashboard, not a page.** A 3.5rem title with
    an icon that renders as a missing-glyph box, a 570-pixel dark plate, and
    four metrics in boxes that run past the fold. There is no table where the
    four numbers can be compared, which is the only reason to compute four.
13. **Old numbers are untested.** Only Newton's `a = F/m` and the Relativity
    sliders' extreme values have a test. Range, apex, flight time, measured drop
    times, fringe spacing and orbital speeds are printed with no known-value
    check, so a wrong formula would ship looking authoritative.

## What Stage 2 changes

- The laboratory becomes its own screen: one masthead, a numbered index of
  experiments on the left at desktop and a scrolling rail at 375, and one
  experiment at a time. The games hub header no longer wraps it.
- Each experiment gets the same bones: a question, a figure, its parameters, a
  readout of measured numbers, and one note. The five drawings move to the
  paper-and-ink classes the home diagrams already use, with labels sized for a
  375 screen.
- Newton's friction is computed once, physically, and the arrow prints the same
  number the dynamics use. The free-fall ratio is computed from the two masses.
  The wave spacing is measured from the interference pattern and compared with
  `λL/d` using the tank's real screen distance. Orbit prints speeds in numbers.
- Relativity Lab gets the same masthead/index/readout discipline, real symbols
  instead of LaTeX, labelled sliders, and a metrics table.
- Tests are added for each displayed formula, with known values.

## What Stage 2 does not change

- The physics engine stays in `src/utils/physics.js`; it is adjusted only where
  this audit found it wrong.
- The games hub, the game cards and the game decks are Stage 3.
- `WhatIfSimulator` is not rebuilt or deleted here. Its removal belongs with the
  lesson surfaces in Stage 5, and deleting it quietly inside a simulation commit
  would hide the change.
