# Issue 007: npm 10 lockfile generated with npx

## What is true right now

The lockfile is generated with npm 10, not npm 8. The CI uses npm ci which
exacts the lockfile. If someone runs npm ci on npm 8, it fails. The lockfile
is a contract between the package manager and the machine.

## What I want

1. Document the npm version required to generate the lockfile
2. Add a CI check that reports the npm version
3. Add a note to the README about the npm version requirement

## Why it matters

npm ci installs exactly what is in the lockfile. If the lockfile is from a
different npm version, npm ci fails. The lockfile is the source of truth for
the install. npm 10 changed internal defaults and the lockfile reflects that.

## Notes

- The package-lock.json is generated with npm 10
- The CI runs on Node 20 which ships with npm 10
- The devDependencies in package.json are pinned to specific versions
