# VELORA Stage 0 audit

Date: 19 October 2026
Commit audited: a337918
Working tree before this file: three modified screenshots, nine untracked screenshots, `.freebuff/` and `audit-artifacts/` untracked. Nothing else was changed in this stage.

This stage changes no application code. Every section below pastes the command and its output. Where a claim could not be checked, it says so.

---

## 1. Repository inventory

```console
$ git ls-files | wc -l
368

$ git ls-files | awk -F/ '{print $1}' | sort | uniq -c | sort -rn
305 src
 18 docs
 17 scripts
 15 public
  3 runbooks
  2 .github
  1 tsconfig.json
  1 package.json
  1 package-lock.json
  1 components
  1 README.md
  1 LICENSE
  1 .gitignore
  1 .env.example
```

Root listing:

```console
$ ls -1A
.DS_Store
.devin
.env.example
.freebuff
.git
.github
.gitignore
LICENSE
README.md
audit-artifacts
build
components
coverage
docs
node_modules
package-lock.json
package.json
public
runbooks
scripts
src
tsconfig.json
```

Tracked root files are only `.env.example`, `.gitignore`, `LICENSE`, `README.md`, `package-lock.json`, `package.json` and `tsconfig.json`. `node_modules`, `build`, `coverage` and `.DS_Store` are ignored correctly:

```console
$ git check-ignore -v .DS_Store build coverage node_modules
.gitignore:34:.DS_Store	.DS_Store
.gitignore:5:build	build
.gitignore:24:coverage	coverage
.gitignore:2:node_modules	node_modules
```

`.devin`, `.freebuff` and `audit-artifacts` are not tracked and not ignored.

### Files that do not belong in a recruiter's first view

1. `.env.example` (tracked). It describes a Postgres, JWT and OpenAI backend that does not exist. It includes a database URL with a placeholder password, `JWT_SECRET`, `ENCRYPTION_KEY_AES256`, empty `OPENAI_API_KEY` and `ANTHROPIC_API_KEY`, and a CORS origin at `https://velora.app`, a domain this project does not own. The app has no backend, so this file is a false description of the system and a distraction in the root.
2. `components/ui/stack-spread.tsx` (tracked, at the repository root). It is a third-party sample component. It imports `motion/react`, which is not in `package.json`, and loads eight images from a `r2.dev` bucket. Nothing imports it:

```console
$ grep -rn "stack-spread\|components/ui" src package.json tsconfig.json
src/styles/LandingPage.css:455:.stack-spread-section {

$ python3 -c "import json;d=json.load(open('package.json'));print('motion' in d.get('dependencies',{}), 'motion' in d.get('devDependencies',{}))"
False False
```

3. `scripts/secrets-scan-report.txt` (tracked). It is a prose conclusion, not raw scanner output, and its stated method greps for the words `password` and `secret`, which is not a secret scan. It should be replaced by command output or removed.
4. `runbooks/` (3 files, tracked). The deployment runbook is mostly accurate for a static site, but it also plans `REACT_APP_API_URL` and `REACT_APP_SENTRY_DSN` for a backend that does not exist. The incident runbook assigns severity targets and talks about "users" for an app with no server and no accounts. Neither belongs in a first view unless it is clearly labelled as a template.
5. `.gitignore` contains a stray line with two backticks. It is harmless but looks careless.
6. Untracked `.devin/`, `.freebuff/`, `audit-artifacts/`, and the nine new screenshots. They are not committed, but they are visible in the working tree and will show up in `git status` for every reviewer who clones and opens the folder.

The three modified screenshots are from an earlier audit. They were left untouched because they carry uncommitted work.

---

## 2. Secret scan

High-signal patterns scanned in the working tree: private key blocks, AWS access keys, GitHub tokens, Stripe live keys, Anthropic keys, Google API keys and Slack tokens.

```console
$ python3 <scan of working tree, skipping .git, node_modules, build, coverage, .freebuff, audit-artifacts, .devin>
working tree high-signal matches: 0
```

The same patterns across all history:

```console
$ git log -p --all | grep -acE "AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk_live_[A-Za-z0-9]{10,}|sk-ant-[A-Za-z0-9_-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----"
history high-signal matches: 0
```

Tracked environment files:

```console
$ git ls-files | grep -E '(^|/)\.env'
.env.example

$ git ls-files | grep -E '(^|/)\.env' | grep -v '\.env\.example'
none
```

A broader assignment-shaped scan found three matches, all code or test fixtures:

```console
assignment-shaped matches: 3
./src/utils/validation.js:12: return typeof password === 'string' && password.length >= 6;
./src/utils/errors.test.js:24: logError(new VeloraError('test', 'AUTH_FAILED', { email: 'person@example.com', password: 'secret', attempt: 1
./src/utils/analytics.test.js:18: trackEvent('login_attempt', { screen: 'login', email: 'person@example.com', password: 'secret', token: 'abc' }
```

Result: no real secret found in the tree or history. `.env.example` still has to go because it describes a backend that is not there, not because its values are live.

---

## 3. Storage and outbound requests

### Everything stored

`src/utils/storage.js` defines a versioned envelope, `{ v, data }`, and the key registry. The table lists every key that is written, including keys written outside the registry.

| Key | Shape | User text? | Written by |
|---|---|---|---|
| `velora_theme_preference` | string: `light`, `dark`, `auto` | No | `ThemeContext.js`, `public/index.html` (raw) |
| `velora_preferences` | object | No | preferences helpers |
| `velora_onboarding_done` | raw string `1` | No | `OnboardingTour.js` (raw) |
| `velora_onboarding_preferences` | `{ domain, style, time }` | No | onboarding |
| `velora_local_profile` | `{ name, createdAt }` | Yes, a name | `localProfile.js` |
| `velora_question_desk` | array of questions and notes | Yes | Question desk |
| `velora_learning_analytics` | totals, topic minutes, weekly activity | No | `analyticsStorage.js` |
| `velora_events` | array of event records | No | analytics |
| `velora_reviews` | saved lessons and due dates | No | `reviewPlanner.js` |
| `velora_revision_schedule` | shape from the deleted revision engine | No | Nothing now. The key is unused. |
| `velora_performance_log` | array of slow operation names, durations, timestamps | No | `performance.js` |
| `velora_last_error` | error message and timestamp | Possibly, if an error message contains input | `ErrorBoundary.js` |
| `velora_last_operation_error` | operation name, message, timestamp | Possibly | `performance.js` |
| `velora_my_explanations` | array of `{ term, text, date }` | Yes | Brain Games, Explain It Back |
| `velora_myth_streak` | number | No | Brain Games |
| `velora_next_up` | array of `{ id, text, ... }` | Yes | `nextUp.js` |
| `velora_pref_<name>` | per-preference value | No | `preferences.js` |
| `velora_explanations_<term>` | array of `{ id, text, timestamp }` | Yes | Explanation board |
| `velora_analytics_optin` | raw boolean | No | `siteAnalytics.js` (raw) |
| `velora_return_visits` | `{ firstSeen, lastSeen, returnCount }` | No | `siteAnalytics.js` (raw) |
| `velora_today_question` | `{ date, questionId, answered }` | No | `todayQuestion.js` (raw) |
| `velora_last_lesson` | `{ subject, topicId, topicTitle, openedAt }` | No | resume path |
| `velora_dialogue_<figure>_<uid>` | array of `{ sender, text, timestamp }` | Yes | `botStorage.js` through `security.js` |

Findings:

- The comment in `storage.js` says no raw `velora_*` string appears outside that file. That is not true. Theme, onboarding, analytics opt-in, return visits, today question and dialogue storage all write keys outside the registry.
- `velora_dialogue_<figure>_<uid>` is built by `secureUserStorage` in `src/utils/security.js`. The uid is the profile name, so the key contains the reader's name. The local "RLS" check is not a security boundary: it is a string comparison against a value in the same browser. The name is misleading, not malicious.
- `velora_revision_schedule` is dead. The module that wrote it was deleted, but the key remains in the registry.
- Error records can contain error messages. They do not intentionally store input, but nothing proves a message cannot include a topic name or an answer.

### Outbound requests

There are no runtime CDN scripts and no remote fonts. Fonts are bundled through `@fontsource` and local `src/fonts` files.

Actual requests the app can make:

1. Same-origin static assets, the bundle, styles, fonts and icons.
2. GoatCounter, only when `velora_analytics_optin` is true and `GOATCOUNTER_CODE` is configured. The code is blank in this build:

```console
$ grep -n "GOATCOUNTER_CODE = \|if (!isOptedIn())\|if (!url) return false" src/utils/siteAnalytics.js
35:let GOATCOUNTER_CODE = '';
54:  if (!url) return false;
112:  if (!isOptedIn()) return false;
114:  if (!url) return false;
```

3. `https://via.placeholder.com/300x200?...` for four What-If scenarios. This is a third-party image request and it is not mentioned in the Privacy page.

```console
$ grep -rn "via.placeholder.com" src --include=*.js | grep -v test
src/components/WhatIfSimulator.js:23,31,39,47
```

4. Share intents to Twitter, WhatsApp and LinkedIn, only after the reader clicks a share button. No request is made on load.
5. Content source links (`wikipedia.org`, `plato.stanford.edu`, `arxiv.org`, `openstax.org` and others) are anchors. They are not fetched by the app.

`src/components/WhatIfSimulator.js` is reachable from Learn, so item 3 is a real third-party request, not dead code.

---

## 4. Claims audit

### README numbers and their proof

| Claim | Value | Proof |
|---|---|---|
| Atlas written / total | 54 / 572 | `node scripts/by-the-numbers.js`, 54 written, 300 unwritten, 218 unmapped |
| Fields / disciplines | 6 / 34 | same script |
| Dictionary entries | 138, all with a source | same script, 138 entries, 138 sources |
| Black hole levels | 8 levels, 61 entries | same script |
| Games / simulations | 8 games, 6 simulations | same script, 5 concept + 3 brain, 6 simulations |
| Jest | 82 suites, 682 tests | `CI=true npx react-scripts test --watchAll=false`, 682 passed |
| CI jobs / checks | 4 jobs, 8 checks | script counts 3 jobs in `ci.yml` plus 1 in `pages.yml`; 8 npm/node checks |
| Lighthouse | 99 / 100 / 100 / 100 | `docs/lighthouse.json`, measured 2026-10-18, Lighthouse 12.2.1 |
| Cover image | `docs/images/velora-tour.gif` | committed, raw URL returns 200 and 285175 bytes |

### Claims that are not proven

1. **"Each gate was broken on purpose and watched going red."** `docs/DECISIONS.md` documents this for three gates: contrast, atlas tap and the game audit. The same claim is made for all eight in the demo script, and the README says "each gate". There is no record of a red run for layout, naming, levels, atlas topics or accessibility. Mark this as partially proven, not universal.
2. **"CI failed 58 runs out of 59."** The GitHub API returns only the last 200 runs, earliest 2026-10-07. The claim refers to 4 October, which is outside the window. It cannot be checked from here.

```console
$ gh run list --limit 200 --json conclusion,createdAt
runs returned: 200
earliest: 2026-10-07T16:19:37Z
latest: 2026-10-19T12:00:26Z
{'success': 55, 'cancelled': 99, 'failure': 46}
```

3. **"4 jobs"** is true only if the Pages deployment job is counted. `ci.yml` has three jobs: `verify`, `layout`, `atlas`. `pages.yml` has `build-and-deploy`. The README says "CI jobs", so the fourth job is a deploy, not a check.
4. **"8 checks"** counts the contrast gate and seven `npm run test:*` audits. It does not count typecheck, jest, build or lint, which also run in CI. The number is defensible as "eight audits" but not as "eight checks total".
5. **"Walk every screen."** The layout audit parses `SCREENS` from `src/navigation.js` and walks every registered screen at 375 and 1440. It does not walk every route state, such as a game in progress, a lesson scrolled to the end, or an error boundary. The narrower claim is proven; the broader implication is not.
6. **Lighthouse numbers** are proven by the committed JSON, but they were measured on 18 October, before the changes in this session. They cannot be quoted as the current deployed score until re-measured.
7. **"Pinned"** does not appear in the repository and cannot be verified from here.
8. Case study hashes all exist:

```console
$ for h in 6d8aaec 3d1dd92 7249063 1d2156e 1ebb5c0 e5b8bab; do git cat-file -t "$h"; done
commit
commit
commit
commit
commit
commit
```

No claim of a user count, testimonial, rating or "trusted by" line remains in the app. The old seeded boards and fake scores were removed before this audit. Comments in `LandingPage.js` and `ShadowLearning.js` describe those removals, which is history, not a claim.

---

## 5. State of play

```console
$ CI=true npx react-scripts test --watchAll=false
Test Suites: 82 passed, 82 total
Tests:       682 passed, 682 total
Time:        12.654 s
JEST_EXIT=0

$ npx tsc --noEmit
TSC_EXIT=0

$ npm run lint
LINT_EXIT=0

$ npm run build
BUILD_EXIT=0

$ node scripts/checkContrast.js
contrast check passed: every named pair holds WCAG AA
CONTRAST_EXIT=0
```

The script summary:

```json
{
  "atlasTotal": 572,
  "atlasWritten": 54,
  "atlasUnwritten": 300,
  "atlasUnmapped": 218,
  "fields": 6,
  "disciplines": 34,
  "dictionary": 138,
  "sources": 138,
  "levels": 8,
  "levelEntries": 61,
  "games": 8,
  "conceptGames": 5,
  "brainGames": 3,
  "simulations": 6,
  "testSuites": 82,
  "tests": 682,
  "testsPassing": 682,
  "workflows": 2,
  "jobs": 4,
  "ciChecks": 8,
  "lighthouse": { "performance": 99, "accessibility": 100, "best-practices": 100, "seo": 100 },
  "lighthouseMeasuredAt": "2026-10-18"
}
```

Latest Actions run on main:

```console
$ gh run list --limit 2
completed  success  Call the six cards cards, not games  CI                    main  push  39248735511  4m58s  2026-10-19T12:00:26Z
completed  success  Call the six cards cards, not games  Deploy to GitHub Pages  main  push  39248735495  2m28s  2026-10-19T12:00:26Z
```

The CI run for the audited commit is green. The working tree is not clean because of the screenshots named at the top.

### npm 10 lockfile check

```console
$ npx npm@10 ci --dry-run
...
added 1 package, and removed 222 packages in 1s
NPM10_EXIT=0
```

The dry run exited 0 and did not complain about the lockfile. It simulated adding one package and removing 222 extraneous packages that exist in the local `node_modules` but are not in the lockfile. `package-lock.json` did not change. The real `npm ci` on the CI runner is the stronger check and it is green.

---

## 6. What Stage 1 must do, in order

1. Delete `.env.example` and the root `components/ui/stack-spread.tsx`. Both describe things the app is not.
2. Replace or delete `scripts/secrets-scan-report.txt`. If kept, it must be the output of the scan above, not a written conclusion.
3. Decide on `runbooks/`. Either move them to `docs/archive/` with a line saying they are templates for a future backend, or delete the incident runbook and keep a short deployment note that matches GitHub Pages.
4. Add `.devin/`, `.freebuff/`, `audit-artifacts/` and the unreferenced screenshots to `.gitignore`, or delete the files. Fix the stray line in `.gitignore`.
5. Bring the storage registry back in line with its own rule. Move the raw theme, onboarding, today question, analytics and dialogue keys into `storage.js`, and remove the dead `REVISION_SCHEDULE` key.
6. Disclose or remove the `via.placeholder.com` requests. The Privacy page cannot say there are no third-party requests while four images load from one.
7. Correct the claims in the README and demo script: say which gates were actually proven to fail, count the deploy job separately, and replace the "58 of 59" line with a claim that can be checked in the current API window or with a saved run list.
8. Re-measure Lighthouse after the UI work and replace the 18 October numbers with the new file and date.

No visual judgment is recorded for any screen. Stage 3 has to produce screenshots and REVIEW.md questions before anyone calls the site good.
