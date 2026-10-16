# Issue 004: Game audit is a report, not a gate

## What is true right now

The game audit (scripts/gameAudit.js) plays every game in the built app in
real Chrome. It reports whether each game can be reached and whether the page
logs errors. But it does not fail if a game content is broken or if a game
does not work.

The audit runs and prints its findings. It exits 0 even if a game is broken.
The CI runs it, but the output is notes, not a pass/fail.

## What I want

Change the game audit to:

1. Fail if a game cannot be reached
2. Fail if a game page logs a console error
3. Fail if a game content is empty or broken

## Why it matters

A test that cannot fail is not a test. The game audit is currently a report.
A reader who plays a game and finds it broken should see it fail CI, not see
it printed and ignored.

## Notes

- The layout check and atlas audit were wired into CI with the same
  reasoning: a check nobody runs is not a check
- This is the same defect that let a selector bug through because the game
  audit "passed" while testing one puzzle
