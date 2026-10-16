# Issues

These are the real issues in the repository, written as a person would write
them. Each one is something true about the app that needs work.

1. [Atlas topic coverage per subject](001-topic-coverage-per-subject.md)
   - The Atlas shows 573 topics, but only 88 philosophy topics have entries.
     The other eight subjects are empty. This is by design, but it needs to be
     visible and honest.

2. [Create React App is the parked bundler](002-cra-parked-bundler.md)
   - We use CRA 5. It works. It is not the modern choice. Vite is the modern
     choice. We are not moving yet because we do not have funding for a
     migration.

3. [Only a few dictionary entries marked verified](003-dictionary-verified-entries.md)
   - The dictionary has 138 entries. Very few have the verified flag. The
     flag means I checked the entry against its source. It is an editorial
     signal that should be visible.

4. [Game content audit is a report, not a gate](004-game-content-audit-not-a-gate.md)
   - The game audit prints findings and exits 0. It does not fail if a game
     is broken. A test that cannot fail is not a test.

5. [63 lint violations in test files](005-lint-violations-in-test-files.md)
   - The test files have 63 ESLint violations. The source code is clean.
     These are test-specific issues that need to be fixed or documented.

6. [375px checks on new lessons](006-375px-checks-on-new-lessons.md)
   - The layout audit checks 1440 and 375px. But it only checks the main
     screens. New lessons are not checked. This causes overflow at 375px.

7. [npm 10 lockfile generated with npx](007-npm-10-lockfile.md)
   - The lockfile is generated with npm 10. The CI uses npm ci which fails
     on older npm versions. Need to document the requirement.
