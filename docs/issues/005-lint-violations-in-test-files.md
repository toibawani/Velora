# Issue 005: 63 lint violations in test files

## What is true right now

The ESLint config runs over src/ with --max-warnings=0. This means any
warning fails CI. The test files (src/**/*.test.js) have 63 violations:

- Unnecessary escapes
- Deprecated APIs
- Unused variables
- Non-strict ESLint rules
- Missing semicolons

These are all test-specific issues. The source code is clean. The test files
are the debt.

## What I want

1. Count the violations exactly (currently 63)
2. Fix them or document them
3. Track the debt in the README or docs

## Why it matters

The CI fails with 63 warnings even though the code is fine. A clean lint
saying "passed" is better than a failing lint that is actually just a test
issue. The test files are the paid-off debt from the first month of the
project.

## Notes

- The lint script ignores test files: --ignore-pattern '*.test.js' --ignore-pattern '*.test.jsx'
  --ignore-pattern '*.test.ts' --ignore-pattern '*.test.tsx'
- Without those patterns, the lint fails on the test files
- The fix is either to fix each violation or to document the debt
