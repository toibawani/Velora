# Three bugs, and what each one taught me

Velora is a browser-only reference book I built for people who want to
understand a subject rather than pass a test on it. These are the three problems
that changed how I work on it. Every hash and date below is from this repository,
and every number was measured before I wrote it down.

---

## 1. CI failed 58 runs out of 59, and my laptop could not see it

**What I saw.** I added the first workflow on 1 October 2026 (`7696e2b`). It ran
typecheck, jest, the production build and ESLint. I then kept committing for
three days, glancing at the badge and assuming it was green. On 4 October I
looked at the run list properly: 58 of 59 runs had failed, one was cancelled, and
every failure happened at `npm ci` within about ten seconds. No test, no build,
and no browser audit had ever run on the runner (`6d8aaec`).

**Root cause.** The lockfile was not in sync with `package.json`, and the gap was
invisible on my machine.

```
npm error `npm ci` can only install packages when your package.json and
package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: yaml@2.9.1 from lock file
```

tailwindcss's nested `postcss-load-config` declares an optional peer dependency
on `yaml@^2.4.2`. The lockfile recorded the peer requirement but shipped no yaml
2.x entry. The only yaml in the tree was 1.10.3, held by cosmiconfig and cssnano
for their own `^1.10` ranges. npm 11 tolerated the gap. npm 10 did not, and
refused to install anything. CI pinned Node 20, which ships npm 10. My laptop had
npm 11. So `npm ci` succeeded locally and failed on every push, and the two
facts were not contradictory, they were two different package managers.

**How I proved the fix.** I reproduced the runner's toolchain instead of
reasoning about it:

```
npx npm@10 ci          -> fails with the error above
(add the yaml entry)
npx npm@10 ci          -> 1397 packages, exit 0
```

The fix is 17 added lines in `package-lock.json` (`6d8aaec`). One day later npm
11 pruned the same nested entry again while installing a font, and CI went red
for the same reason; I restored it in `3d1dd92` and verified with a clean clone
and `npm ci` rather than trusting the local tree.

**What I learned.** "It installs on my machine" is a statement about my
machine. A dependency gate has to be reproduced with the runner's exact
toolchain, or it is a guess with a green checkmark. I now run `npx npm@10 ci`
before touching the lockfile, and I read the Actions run instead of the badge.

---

## 2. Two checks that passed while testing nothing

These were found on the same day, 4 October 2026, and they share a shape.

**The dedup test that could not see duplicates.** Definition Duel and Concept
Scrabble both quiz vocabulary, and a test was supposed to stop the same term
appearing in both decks. It normalised each term by stripping every character
that was not an uppercase letter. "FALSIFIABILITY" survived intact.
"Falsifiability" was reduced to "F". Seven terms were in both decks (Black Hole,
Photosynthesis, Catalyst, Regression, Confirmation Bias, Market Equilibrium,
Falsifiability) and the test passed with a clean run (`7249063`).

The fix was to fold case before dropping anything, which surfaced all seven. The
freed slots took ten philosophy terms, because a subject with eleven written
lessons had a game that never mentioned it. The terms are now read from
`PHILOSOPHY_LEVELS` rather than copied, so the two cannot drift apart, and a new
check fails if a clue contains its own answer.

**The audit that never opened six games.** The game audit answered one Connect
the Concept puzzle, then advanced by clicking any button whose text matched
`/next/i`. That also matches the global "Next up" navigation item. So it walked
out of the games screen, could not find the other tabs, printed "tab not found"
for two of three games, and exited 0 (`1d2156e`). The output looked like a
successful run of a script that had played one puzzle.

Scoping the selector to the game's own result card fixed the walk. The second
change mattered more: an unreachable game became a failure instead of a printed
note. A week of output had been describing a report, not a gate.

That was not the end of it. On the same day I found that the audit opened only
the three Brain Games modes and none of the six Concept Puzzles games
(`1ebb5c0`). A crash on mount or an input that never fired in those six would
have passed CI forever, while the script printed "every game reached and
played". The audit now opens and plays all six. Getting real coverage out of
Definition Duel exposed another version of the same problem: a wrong answer does
not advance the card, so the script re-read the first clue twenty times and
reported twenty clues. It now reads the game's own "the answer was X" feedback
to deal the deck.

**What I learned.** A test that cannot fail is worse than no test, because it
buys confidence you have not earned. The diagnostic question is not "does this
pass" but "what change would make this fail". If I cannot name one, I do not
have a check. That question is why the odds-and-ends in this repo now assert
counts, exit non-zero on unreachable screens, and get proven red before they are
trusted.

---

## 3. One answer scored two puzzles

**What I saw.** The game audit traced a double submit on the Concept Puzzle
(`e5b8bab`, 4 October 2026). Filling the correct words and clicking Submit
twice produced:

```
Puzzle 3/21, Score: 200
```

One correct answer paid twice and skipped a puzzle. The same shape existed in
Concept Scrabble (`1d84294`): one submit was Level 2/17 and Score 100, two
submits were Level 3/17 and Score 200. Skipping after solving threw the solve
away from the other direction.

**Root cause.** `handleSubmit` booked the move to the next puzzle with a
1200ms `setTimeout`, and left the solved word sitting in the boxes with the
Submit button still enabled for that window. The second click passed the same
guard the first one did. The guard asked "is this word correct", which was still
true. It never asked "has this puzzle already been settled".

**How I proved the fix.** I kept the measurement, not just the test. Before the
fix, on the real component: fill, submit, submit again, `Puzzle 3/21, Score 200`.
After adding a settled flag, returning early from both handlers and disabling
both buttons while settled: `Puzzle 2/21, Score 100`. Then I removed the guard
and the disabled state together and the measurement went back to `Puzzle 3/21`
with the new tests failing. That last step is the one that matters. It proves the
test is attached to the bug rather than to the passing state.

Reveal was not affected, and the commit says so, because the Reveal button was
already disabled on press. I also had to correct an earlier claim of mine in
`1d84294`: a probe had reported that the solve was erased entirely, and that
probe was wrong, because it clicked the same tile twice for a word with a
repeated letter. The bug was real, the first description of it was not.

**What I learned.** The bug was not "the user clicked twice". It was that the
interface kept offering an action it had already taken. Disabling the control is
the fix; the settled flag is the belt to that braces. And a measurement I can
repeat is worth more than a paragraph explaining what I think happened.

---

## The thread through all three

Each problem was a case of a signal that looked trustworthy and was not: a green
badge, a passing test, a confident audit summary. None of them were caught by
reading the code. They were caught by running the thing that claimed to check
it, under the conditions it would actually meet, and then making it prove it
could go red.
