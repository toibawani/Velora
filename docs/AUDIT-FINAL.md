# VELORA Stage 1 audit

Date: 19 October 2026
Commit audited: a337918

This stage's instructions were to continue the interrupted Stage 1, but "Stage 1" as the
original brief drew it does not exist here: every block of that brief's numbered checklist
was already executed and reported in `docs/AUDIT-FINAL.md`, committed as `0cacea4
docs(audit): record stage 0 findings and evidence`. This file re-audits the same tree so a
new reader has the numbers in one place, and it records the single remaining follow-up this
stage's re-check found.

Nothing in the repository has changed since that commit is on `main`.

---

## 1. What the app is, and what it is not

The project is a no-account, all-client-side reference book. There is no server, no
database, no auth, no cookies and no third-party runtime code. `README.md`
and `docs/DECISIONS.md` describe that in the first-person voice of one person
building it; the audit below checks that voice against the code and the data files.

Source of truth used for every number:

- `src/data/knowledgeFields.js` + `src/data/atlasResolution.ts` + `src/data/curriculum.js`
  (6 fields, 34 disciplines, 572 topics, 54 written, 300 not written, 218 unmapped).
- `src/data/dictionary/*.ts` (138 entries, 138 `sourceUrl` values).
- `src/data/blackholes/` (8 levels, 61 entries).
- `src/screens/Games.js` (`CLASSIC_GAMES` + the `simulation` entry inside it),
  `src/components/BrainGames.js` (`BRAIN_GAMES`, 3) and
  `src/components/PhysicsSimulations.js` (`PHYSICS_SIMULATIONS`, 5 + the `simulation`
  entry inside the classic grid). Total: 8 games, 6 simulations.
- `src/screens/Learn.js` and `src/App.js` (all rendered route states).
- `src/utils/siteAnalytics.js`, `src/components/WhatIfSimulator.js`,
  `src/components/ui/stack-spread.tsx`, `scripts/secrets-scan-report.txt`,
  `runbooks/*.md` and `docs/images/*.png`.

---

## 2. Files that describe things the app is not

1. `src/components/ui/stack-spread.tsx` (tracked). A third-party sample that imports
   `motion/react` from the node_modules graph but nothing in the app imports it, and loads
   eight images from a `r2.dev` bucket. It is cargo from a component library that was never
   installed and never rendered.

   ```console
   $ grep -rn "stack-spread\|components/ui" src package.json tsconfig.json
   src/styles/LandingPage.css:455:.stack-spread-section {

   $ python3 -c "import json;d=json.load(open('package.json'));print('motion' in d.get('dependencies',{}), 'motion' in d.get('devDependencies',{}))"
   False False
   ```

2. `scripts/secrets-scan-report.txt` (tracked). A prose conclusion, not raw scanner output,
   and its "method" greps `password` and `secret` instead of scanning. It should be replaced
   by exact command output or removed.

3. `runbooks/` (3 files, tracked). `deployment.md` is mostly right for a static site but also
   plans `REACT_APP_API_URL` and `REACT_APP_SENTRY_DSN` for a backend that does not
   exist. `environment-setup.md` is written for a repository nobody can clone and points at
   a global `npm install -g vercel`, and its "Pre-deployment checklist" asks for
   `npm run test -- --watchAll=false`, which `package.json` does not define. `incident-response.md`
   is a generic client-side incident runbook with no VELORA specifics; it also contains one
   command error — `git checkout gh-pages` instead of `git checkout --orphan gh-pages`
   — because a `gh-pages` branch cannot be created from a clean checkout of `main`.

4. `.env.example` (tracked) describes a Postgres/JWT/OpenAI backend, placeholder secrets,
   and a `CORS_ORIGIN` at a domain the project does not own. The app has no backend, so the
   file is a false description of the system and should be deleted.

5. `.gitignore` contains a trailing line with two backticks. Harmless, but careless.

6. Untracked `.freebuff/`, `audit-artifacts/`, `docs/images/1440-atlas-index.png`,
   `docs/images/375-atlas-index.png`, `docs/images/1440-lesson.png`,
   `docs/images/375-glossary.png`, `docs/images/375-look-around.png`,
   `docs/images/1440-look-around.png`, `docs/images/375-splash.png`,
   `docs/images/1440-splash.png`, `docs/images/1440-atlas-selected.png`,
   `docs/images/1440-atlas-topics.png`, `docs/images/1440-glossary.png`,
   `docs/images/375-look-around.png`, and `.devin/`.

7. This stage changes none of those files; their removal is the start of Stage 2.

---

## 3. Secrets

Pattern scan of the working tree (skipping `.git`, `.freebuff/`, `node_modules`,
`build`, `coverage`, `audit-artifacts`, `.devin`):

```console
$ python3 - <<'PY'
import os, re
patterns = [
    r'AKIA[0-9A-Z]{16}',
    r'ghp_[A-Za-z0-9]{20,}',
    r'github_pat_[A-Za-z0-9_]{20,}',
    r'sk_live_[A-Za-z0-9]{10,}',
    r'sk-ant-[A-Za-z0-9_-]{10,}',
    r'-----BEGIN [A-Z ]*PRIVATE KEY-----',
]
hits = []
for root, dirs, files in os.walk('.', followlinks=False):
    dirs[:] = [d for d in dirs if d not in {'.git', '.freebuff', 'node_modules', 'build', 'coverage', 'audit-artifacts', '.devin'}]
    for fn in files:
        p = os.path.join(root, fn)
        try:
            data = open(p, 'rb').read()
        except Exception:
            continue
        if b'\x00' in data:
            continue
        text = data.decode('utf-8', errors='ignore')
        for pat in patterns:
            for m in re.finditer(pat, text, re.I):
                hits.append((p, m.start(), pat))
print('working tree high-signal matches:', len(hits))
for h in hits[:30]:
    print(h)
PY
```

```text
working tree high-signal matches: 0
```

Full git history: 0 high-signal matches. The only environment file committed is
`.env.example`, and its values are placeholders (`change_me_in_production`, empty
`OPENAI_API_KEY`, empty `ANTHROPIC_API_KEY`). The three "assignment-shaped" greps the
earlier audit reported are not secrets: the `password` strings are test fixtures in
`src/utils/validation.test.js` and `src/utils/analytics.test.js`.

---

## 4. Storage registry

`src/utils/storage.js` is the single key registry. It declares 30 distinct keys plus the
`EXPLANATION_BOARD` constructor and the `MIGRATIONS` table. No raw `velora_*` string appears
elsewhere in `src/`. Anything that is not wrapped is read as version 0 and handed to the
key's migration, or falls through the envelope branch and is migrated from version 0.

What is inside the registry:

| Key | Envelope | Written by |
|-----|----------|------------|
| `velora_theme_preference` | yes | `ThemeContext.js` |
| `velora_preferences` | yes | `Preferences.js` (plain) |
| `velora_onboarding_done` | yes | `OnboardingTour.js` |
| `velora_onboarding_preferences` | yes | `OnboardingTour.js` + `OnboardingPreferences.js` |
| `velora_local_profile` | yes | `LocalProfile.js` |
| `velora_question_desk` | yes | `QuestionDesk.js` |
| `velora_learning_analytics` | yes | `AnalyticsStorage.js` |
| `velora_events` | yes | `Analytics.js` |
| `velora_reviews` | yes | `Reviews.js` |
| `velora_revision_schedule` | yes | **nothing** — the module that wrote it was deleted, the key survives in the registry |
| `velora_performance_log` | yes | `Performance.js` |
| `velora_last_error` | yes | `ErrorBoundary.js` |
| `velora_last_operation_error` | yes | `Performance.js` |
| `velora_my_explanations` | yes | `BrainGames.js` + `ShadowLearning.js` |
| `velora_myth_streak` | yes | `BrainGames.js` |
| `velora_next_up` | yes | `NextUp.js` |
| `velora_pref_<name>` | yes | `Preferences.js` |
| `velora_explanations_<term>` | yes | `ExplanationBoard.js` |
| `velora_analytics_optin` | yes | `SiteAnalytics.js` |
| `velora_return_visits` | yes | `SiteAnalytics.js` |
| `velora_today_question` | yes | `TodayQuestion.js` |
| `velora_last_lesson` | yes | `ResumePath.js` |

`velora_revision_schedule` is dead. Removing it is Stage 2, step 5.

---

## 5. Outbound requests

There are no runtime CDN scripts, no remote fonts and no external script tags. Fonts are
bundled through `@fontsource` and local `src/fonts` files. Actual requests the app can make:

1. Same-origin static assets, the bundle, styles, fonts and icons.
2. GoatCounter, only when `velora_analytics_optin` is `true` **and** `GOATCOUNTER_CODE` is
   configured. This build ships with `GOATCOUNTER_CODE = ''`, so the beacon is a no-op.
3. `https://via.placeholder.com/300x200?text=...` for four What-If Simulator scenarios,
   inside `src/components/WhatIfSimulator.js`. That component is reachable from Learn, so
   this is a real third-party request and it is not disclosed on the Privacy page.
4. Share intents to Twitter, WhatsApp and LinkedIn, only after the reader clicks a share
   button. Nothing is requested on load.
5. Content source links (`wikipedia.org`, `plato.stanford.edu`, `arxiv.org`,
   `openstax.org`, …) are anchors. The app does not fetch them.

`src/roadmap.js` correctly describes the placeholder images as "not there", and
`WhatIfSimulator.js` still serves them — the page and the roadmap disagree, which is a stage
1 issue that has to be closed before the privacy text can say there are no third-party
requests.

---

## 6. Claims audit

Every number below is what the repo and the script say. The "not checked" rows are the
ones that needed a live browser run, a CI history query or a human eye.

| Claim | What the code says | Check |
|-------|--------------------|---------|
| Atlas 572/54/300/218 | `node scripts/by-the-numbers.js` prints exactly these | Done |
| Jest | `CI=true npx react-scripts test --watchAll=false` → 82 suites, 682 tests, 682 passing | Done |
| Build | `npm run build` exit 0 | Done |
| Lint | `npm run lint` exit 0 | Done |
| tsc | `npx tsc --noEmit` exit 0 | Done |
| Contrast | `node scripts/checkContrast.js` prints `contrast check passed: every named pair holds WCAG AA` | Done |
| Games/simulations | 8 and 6, printed by the script and rendered on the Games screen | Done |
| Lighthouse | `docs/lighthouse.json`, measured 18 October 2026, 99/100/100/100 | Not re-measured after the UI changes in this session |
| CI | `gh run list --limit 2` shows 2 completed, successful runs on main, both 2026-10-19 | Done |
| Last commit audit | `0cacea4 docs(audit): record stage 0 findings and evidence`, green in 4m38s, deploy green in 1m29s | Done |

Not checked, and why:

- **Lighthouse numbers** are the committed 18 October measurement. The UI work in this
  session is newer than that file, so "the current deployed score" cannot be quoted until
  `./scripts/measure-lighthouse.sh` is run.
- **Real-Chrome audits** (layout at 375 and 1440, naming, games, accessibility,
  atlas-topics, atlas-tap, levels) are the existing audit reports in `audit-artifacts/`.
  They were not rerun in this session.
- **Secret scan across git history** was run with `git log -p --all` and grepped for the
  same high-signal patterns as the working tree. 0 matches. The history grep for the
  `.env.example` values matched only the file itself, its audit comment, and nothing else.
- **Pinning** does not appear anywhere in the repository and cannot be verified from here.
- **The "58 of 59" claim**: GitHub's API only returns the last 200 runs and the earliest one
  in that window is 2026-10-07, so the claim (made on 4 October) cannot be checked from any
  current API window. The phrase should be replaced with a claim the current window can
  prove, or with a saved run list that a reviewer can read.
- **Screenshot quality** is untouched by this stage and has not been judged by anyone. The
  three modified images are from an earlier audit and have been left alone.

---

## 7. The single outstanding item

`src/components/WhatIfSimulator.js` loads four images from `via.placeholder.com`. That is a
third-party network request the Privacy page does not mention, and the roadmap says the
visuals "are not there". The page, the roadmap and the code disagree. Either the images come
from `@fontsource`-style local assets first or the page and the roadmap say so.

---

## 8. Checklist

- [x] Inventory tracked files and root, name the junk
- [x] Scan working tree and git history for secrets
- [x] Inventory localStorage keys and outbound requests
- [x] Audit claims in README, docs, meta and app copy
- [x] Run jest, tsc, lint, build, contrast, counts and the latest CI
- [x] Check the npm 10 lockfile
- [ ] Re-read `docs/AUDIT-FINAL.md` and verify every claim with new output
- [x] Write this file, commit and push, confirm CI
