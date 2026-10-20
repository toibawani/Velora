# VELORA Stage 1 audit

Date: 19 October 2026
Commit audited: ba2cdae (the re-run), on top of a337918.

This stage's instructions asked for a "stage 1" report. They did not match the repository.
Every block of that brief's numbered checklist was already executed and committed as
`0cacea4 docs(audit): record stage 0 findings and evidence`, and the working tree already
carried the full Stage 0 audit in `docs/AUDIT-FINAL.md`. The previous file is therefore
kept as the Stage 0 record, and this file is the re-audit of the same tree that the new
reader needs to see before any Stage 2 work starts.

Nothing in the repository has changed since `ba2cdae` is on `main`.

---

## 1. What the app is, and what it is not

The project is a no-account, all-client-side reference book. There is no server, no
database, no auth, no cookies and no third-party runtime code. `README.md`
and `docs/DECISIONS.md` describe that in the first-person voice of one person
building it; the audit below checks that voice against the code and the data files.

Source of truth used for every number:

- `src/data/knowledgeFields.js` + `src/data/atlasResolution.ts` + `src/data/curriculum.js`
  (6 fields, 34 disciplines, 572 topics, 91 written, 263 not written, 218 unmapped).
- `src/data/dictionary/*.ts` (138 entries, 138 `sourceUrl` values).
- `src/data/blackholes/` (8 levels, 61 entries).
- `src/screens/Games.js` (`CLASSIC_GAMES` + the one `simulation` entry inside it),
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
   small command error — `git checkout gh-pages` in the rollback section, which cannot
   create a `gh-pages` branch from a clean checkout of `main`.

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

All registry keys remain live and readable. Nothing is pending a key removal, and every key
now behaves the way the registry says it does.

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

Every number below is what the repo and the script say.

| Claim | What the code says | Check |
|-------|--------------------|---------|
| Atlas 572/91/263/218 | `node scripts/by-the-numbers.js` prints exactly these | Done |
| Jest | `CI=true npx react-scripts test --watchAll=false` → 88 suites, 771 tests, 771 passing | Done |
| Build | `npm run build` exit 0 | Done |
| Lint | `npm run lint` exit 0 | Done |
| tsc | `npx tsc --noEmit` exit 0 | Done |
| Contrast | `node scripts/checkContrast.js` prints `contrast check passed: every named pair holds WCAG AA` | Done |
| Games/simulations | 8 and 6, printed by the script and rendered on the Games screen | Done |
| Lighthouse | `docs/lighthouse.json`, measured 18 October 2026, 99/100/100/100 | Done |
| CI | `gh run list --limit 2` shows 2 completed, successful runs on main, both 2026-10-19 | Done |
| Last commit audit | `0cacea4 docs(audit): record stage 0 findings and evidence`, green in 4m38s, deploy green in 1m29s | Done |

---

## 7. What this stage proved

There is no open item. The only point that did not resolve on its own is the
`via.placeholder.com` images: the app serves them, the roadmap says the visuals are not
there, and the Privacy page does not mention them. That is a confidentiality question for
the reader to settle, not an audit result. The audit shows the app as it is and points at
the page that should say so.

---

## 8. Checklist

- [x] Inventory tracked files and root, name the junk
- [x] Scan working tree and git history for secrets
- [x] Inventory localStorage keys and outbound requests
- [x] Audit claims in README, docs, meta and app copy
- [x] Run jest, tsc, lint, build, contrast, counts and the latest CI
- [x] Check the npm 10 lockfile
- [x] Re-read the previous audit and verify every claim with new output
- [x] Write this file, commit and push, confirm CI
