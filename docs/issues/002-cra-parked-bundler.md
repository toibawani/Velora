# Issue 002: Create React App is the parked bundler

## What is true right now

The app is bundled with Create React App (react-scripts 5). The package.json
has scripts for start, build, test, typecheck, lint. CRA was the default
choice for a React project in 2021. It works. But it is no longer the
recommended approach. Vite is the modern bundler. TypeScript tooling is
separate from the bundler. Eject is deprecated.

## What I want

1. Track the decision to stay with CRA as a parked decision, not a permanent
   one
2. Add a note to the README or docs about what happens if we want to move to
   Vite
3. List the specific blockers to migrating (CRA's webpack config, the
   eject/compile step, the test setup)

## Why it matters

CRA is fine for a small project. But it makes tooling hard to add. The CRA
build can be slow. The test setup is opinionated. The new tooling is faster
and more flexible. The trade-off is funding, which I do not have.

## Notes

- The project is small enough that the migration cost is high for a small gain
- The CRA versions are pinned in package.json
- No config files needed for CRA; all configuration is in the react-scripts
  package
