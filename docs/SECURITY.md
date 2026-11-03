# Security

This document states what VELORA protects, what it does not, and where the
limits are. It describes the app as it ships, not an aspiration, and every
claim here was checked with a command, a file read or a browser session in the
stage that produced it.

Scope: the static site in this repository, served from GitHub Pages. There is no
server component, so nothing here describes server hardening.

## The short version

There is no server, no account and no session. The only data VELORA holds is
what a visitor types or reads on their own device, in that browser's
localStorage. Nothing is sent anywhere. The one outbound path, an optional
analytics beacon, is switched off by default and has no endpoint configured in
this build.

That means the security model is mostly the browser's, and the honest summary
is: **anyone using the same browser profile can read and change everything
VELORA has stored.** The app is built for a shared school iPad, but it cannot
defend that iPad against the next person who picks it up.

## What is protected

- **No credentials are collected.** No password, email, phone number or account.
  The profile is a display name, 2 to 40 characters, kept under
  `velora_local_profile` and used only to greet the reader. It is not a login and
  is not checked against anything.
- **Nothing leaves the browser.** `src/utils/siteAnalytics.js` gates every beacon
  on `velora_analytics_optin`, which defaults to false, and on a GoatCounter
  subdomain that is blank in this build. With the opt-in off, `trackEvent`
  returns before building a URL. A test calls all six trackers with an endpoint
  configured and asserts that no `sendBeacon` and no `fetch` happens.
- **Rendered text is escaped by React.** Nothing in `src/` uses
  `dangerouslySetInnerHTML`, `innerHTML`, `eval` or `new Function`. A name, a
  note or a saved question containing `<script>` renders as characters. The one
  `innerHTML` in the repository is a read in `scripts/atlasTopicVerify.js`, which
  asserts that lesson markup exists in the audit browser; it never writes.
- **A malformed share link cannot take the app down.** `parseShareHash` used to
  call `decodeURIComponent` on every segment of the URL hash, and it runs during
  startup, so a hand-edited link such as `#/lesson/physics/100%` threw a
  `URIError` and left a blank page. It now decodes each segment defensively and
  treats an undecodable segment as a target that does not exist.
- **External links do not get a window handle.** Source links and share targets
  open with `noopener`/`noreferrer`.
- **A Content-Security-Policy is served with the document.** See below.
- **Storage failures are reported, not swallowed.** `writeValue` distinguishes
  disabled storage, quota exhaustion and a refused write. Every write of
  learner data goes through it, including the four that used to bypass it (the
  daily question, the analytics opt-in and return counter, the onboarding flag,
  and the dialogue records in `src/utils/security.js`).
- **Corrupt or foreign records are not trusted.** `readValue` returns the
  fallback for malformed JSON and for a value that is not the expected shape.
  Records written by `secureUserStorage` carry a `userId` and are refused when
  the id does not match the caller's label.

## The Content-Security-Policy

GitHub Pages cannot set response headers and this project has no server, so the
policy is a meta tag at the top of `public/index.html`. A meta policy only
applies to what follows it, which is why it sits above the stylesheet, the
fonts and every script.

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://*.goatcounter.com;
font-src 'self';
connect-src 'self' https://*.goatcounter.com;
media-src 'self';
manifest-src 'self';
base-uri 'self';
form-action 'none';
object-src 'none';
frame-src 'none'
```

Two decisions are worth naming:

- **No inline script.** The pre-paint theme resolver moved from an inline
  `<script>` in `index.html` to `public/theme-init.js`. It could not be hashed:
  create-react-app minifies inline script in a production build, so a hard-coded
  hash would stop matching the moment the HTML was built. A file in `public/` is
  served unchanged and needs neither a hash nor a nonce.
- **The webpack runtime chunk is no longer inlined.** create-react-app inlines a
  small runtime chunk into the HTML by default. With `script-src 'self'` that
  inline script is blocked in a built bundle while working fine in development,
  which is the worst way for this to fail. `npm run build` therefore sets
  `INLINE_RUNTIME_CHUNK=false`. This is the one `package.json` change in the
  security pass, and it is a script change, not a dependency change.

`style-src` still allows inline style because React writes style attributes and
the development build injects `<style>` elements; neither can be hashed. That is
a real weakening and it is the next thing to tighten, not something this policy
already solves.

Verified in a real browser against the production build served at `/Velora/`:
the landing page renders with no console message of any kind and no network
request outside this origin. The only non-HTTP request is a `data:` SVG used for
the paper texture, which `img-src data:` allows.

What a meta tag cannot do, and this deployment therefore does not have:

- `frame-ancestors` and `X-Frame-Options`. The app can be framed by another
  site. Nothing in the app reads a frame-busting workaround, and adding one
  would be worse than stating the gap.
- `Strict-Transport-Security`. GitHub Pages serves HTTPS; the browser is not
  told to refuse a future downgrade.
- `X-Content-Type-Options` as a header. The meta form is ignored by browsers.
- Reporting. There is no `report-to`, so a blocked request is visible only in
  the visitor's own console.

## Secrets

Scan performed in this pass over the working tree and all 1215 commits:

- `git rev-list --objects --all` enumerates every blob, and each unique blob was
  read once and searched for private key blocks, `sk-`, `ghp_`, `github_pat_`,
  `AKIA`, `xox[baprs]-`, `AIza` and `service_role`. No match.
- `.env` files in history: one, `.env.example`, added in `11e4317`.
- Values in `.env.example` are placeholders that name themselves as such
  (`change_me_in_production`, empty keys, a localhost Postgres URL). No real
  credential has ever been committed.
- `.env` is ignored by `.gitignore`, including `.env.*` with `.env.example`
  re-included.

No secrets were found, so no secret was rotated.

## Third parties

Nothing is loaded from another origin. Every item below was checked by reading
the file and by watching the network panel on the built app.

| What | Where from | Notes |
|---|---|---|
| Fonts (Fraunces, Source Serif 4, Source Sans 3) | this origin | `@fontsource` packages, copied into the build by webpack. No Google Fonts, no CDN, no `preconnect`. |
| Icons | this origin | `lucide-react` renders inline SVG in the bundle. |
| Paper texture | `data:` URI | Inline SVG filter, no network request. |
| Analytics | `*.goatcounter.com` | Only when the visitor opts in **and** a subdomain is configured. This build configures none, so the code path cannot fire. |
| `via.placeholder.com` | not requested | Four dead URLs in `src/components/WhatIfSimulator.js` sit in a `visuals` array that the component never renders. They are not requests, but they are also not useful; they should be deleted with the next edit of that file. |

Subresource Integrity is not used, because there is no cross-origin subresource
to pin. Self-hosting is the stronger form of the same protection and is what this
app does.

## Every key VELORA stores

All of these live in `src/utils/storage.js` and nowhere else: no other file in
`src/` contains a `velora_` key literal except `src/components/OnboardingTour.js`
(which imports the constant) and the pre-paint theme script, which reads the
theme key before the bundle loads. Payloads are wrapped as
`{ v: 1, data: <payload> }`.

| Key | What it holds |
|---|---|
| `velora_theme_preference` | `light`, `dark` or `auto` |
| `velora_preferences` | older preference bag, still read |
| `velora_onboarding_done` | `true` once the first-run flow finishes |
| `velora_onboarding_preferences` | domain, learning style and time answer from setup |
| `velora_local_profile` | the display name typed on this device |
| `velora_question_desk` | questions the reader saved to come back to |
| `velora_learning_analytics` | minutes recorded per topic |
| `velora_events` | last 100 usage events, pruned after 30 days |
| `velora_reviews` | spaced-review schedule |
| `velora_revision_schedule` | revision plan entries |
| `velora_performance_log` | slow operations observed in this browser |
| `velora_last_error` | the last error boundary report |
| `velora_last_operation_error` | the last failed write or fetch |
| `velora_my_explanations` | "explain it back" answers |
| `velora_myth_streak` | myth-or-fact streak |
| `velora_next_up` | the reader's own list of things to return to |
| `velora_pref_<name>` | one key per individual preference |
| `velora_explanations_<term>` | explanation board per dictionary term |
| `velora_analytics_optin` | `true` only if the visitor switched analytics on |
| `velora_return_visits` | first seen, last seen, return count |
| `velora_today_question` | today's question id and whether it was answered |
| `velora_last_lesson` | the last lesson opened, for the resume link |
| `velora_game_results` | best round and play count per game |
| `velora_recent_terms` | recently opened dictionary entries |
| `velora_dialogue_<figure>_<label>` | chat transcripts, scoped by a local label |

Two keys live outside this list on purpose: `sessionStorage.velora_redirect`
written by `public/404.html` (a one-shot path to bounce a deep link back to the
app root), and nothing else.

What the browser does with a failure:

- storage disabled (private mode, a managed profile): reads return the caller's
  fallback and writes return `FAILURE.DISABLED`, so the UI can say the data will
  not be kept.
- quota exhausted: the write returns `FAILURE.QUOTA` and the screen says the
  save did not land, rather than showing a saved state.
- corrupt JSON: the stored value is treated as a legacy plain string if it
  parses as one, otherwise the fallback. Nothing throws at startup.
- a value written by a future version: `readValue` reads it as the shape it is,
  and `parseBackup` refuses a backup file from a newer format rather than
  half-reading it.

## Dependencies

`npm audit` could not complete on this machine: it hung for more than ten
minutes on two attempts, including `--package-lock-only`, with no output. The
same registry endpoint was queried directly instead, with the package names and
versions in `package-lock.json` posted to
`https://registry.npmjs.org/-/npm/v1/security/advisories/bulk`.

What came back: **92 advisories across 32 packages**, counted as 50 high, 31
moderate, 9 low and 2 critical. Every one of those packages is a build or test
tool: `react-scripts`, `webpack-dev-server`, `js-yaml`, `node-forge`,
`brace-expansion`, `fast-uri`, `postcss`, `svgo`, `extract-zip`,
`puppeteer-core` and their dependencies. None is `react`, `react-dom`,
`lucide-react`, `web-vitals` or a `@fontsource` package, which are the only
runtime libraries in the shipped bundle.

This pass changed no dependency versions. The reason is scope, not severity: the
affected code is the local build and test toolchain, no vulnerable package is
served to a visitor, and the repository rule is that the lockfile does not move
without a reason that outweighs the churn. The right next step is a deliberate
`npm audit fix` in its own branch, with a build and the full browser audits run
after it, and a note here about what moved.

Two packages deserve a specific mention because a developer does run them:

- `webpack-dev-server` (6 advisories) and `launch-editor` (3) are exposed when
  `npm start` is running. They are development-only and are not part of any
  deployment.
- `extract-zip` and `puppeteer-core` are used by the Chrome audit scripts, which
  run trusted local files.

## Is a backend needed?

No current feature needs one. Recorded here as a decision, because the question
will be asked again:

- **Accounts and sync**: not a feature. There is no login, and progress is
  per-browser by design. Sync would need identity, which contradicts the
  no-account premise and would create the first thing worth attacking.
- **Moderation**: nothing is published by a visitor. There are no comments,
  profiles, leaderboards or shared content. The explanation boards are private
  to the browser that wrote them.
- **Analytics**: the aggregate page-view count is optional and would be the only
  reason to talk to a network, and it needs no server of ours: GoatCounter is a
  hosted service and the beacon is a URL. A server would add an intake endpoint
  and a data store for numbers that a third party already aggregates.
- **Content delivery**: lessons are static data compiled into the bundle. A
  server would make the first paint slower, not faster.

What would genuinely force a server: visitor-authored content visible to other
people, cross-device progress, or paid access. If one of those arrives, the
decision changes, and so does this document.

## What is not protected

- **There is no authentication and no authorization boundary.** The `authUid`
  in `src/utils/security.js` defaults to `'local_scholar'`. It is a scoping
  label, not an identity. Its checks stop a record written under one local label
  being read under another; they do not stop a person with the browser open. The
  module is named after a server design that was removed, and the code now says
  so rather than implying a boundary.
- **localStorage is editable.** A visitor can open DevTools and change progress,
  saved questions or the profile name. Nothing in the app treats any of it as a
  claim to anyone else.
- **Client-side validation is not a control.** `validatePayload` and the
  sanitizer run in the page. They catch bad input and corrupt stored records;
  they do not defend against someone who can run JavaScript in the page. The CSP
  is what raises the cost of that, and it cannot remove it.
- **`style-src` allows inline styles**, so an injected `style` attribute could
  still hide or reposition content. It could not run script.
- **No framing protection**, because a meta policy cannot deliver
  `frame-ancestors`.
- **No encryption at rest.** Everything is plain JSON in localStorage. A person
  with access to the device's storage can read it.

## The limits of localStorage

- It is per origin and per browser profile. Clearing site data removes the
  profile, saved lessons, review schedule, questions and notes. Settings offers
  an export for exactly that reason.
- It is usually capped around 5 MB per origin. Writes fail past the cap and the
  app reports that instead of dropping data silently.
- Private browsing and some managed school profiles refuse storage entirely. The
  app still works for reading, and says nothing can be saved.
- Any script on the same origin can read and change it. There is no server copy
  to correct it against.

## Threat model, in plain terms

| Scenario | What happens |
|---|---|
| A classmate opens the app on the same iPad | They see the previous reader's name, progress and notes. The app cannot prevent this; clearing site data or a separate browser profile does. |
| Someone edits localStorage | They can change their own progress. Nothing is shared, so nothing is defaced for anyone else. |
| A malicious script runs in the page | `script-src 'self'` blocks inline and third-party script, `object-src 'none'` blocks plugins, and React escaping protects rendered text. What remains is same-origin script, which local storage of this kind cannot distinguish from the app. |
| Someone shares a crafted link | The hash parser no longer throws; an unknown target opens the app normally or shows "not written yet". |
| The site is served over HTTP | GitHub Pages serves HTTPS. Fonts are self-hosted and there are no third-party scripts, so there is no mixed content to downgrade. |
| Analytics is switched on and configured | Page path, page title, topic opened, game id and a 7-day return count go to GoatCounter. No identifier, no cookies, no fingerprinting. In this build no endpoint is configured, so nothing is sent even then. |

## Tests that pin this document

`src/securityHeaders.test.js`, `src/themeScript.test.js`,
`src/utils/siteAnalytics.test.js`, `src/utils/todayQuestion.test.js`,
`src/utils/security.test.js`, `src/utils/shareLinks.test.js`,
`src/components/OnboardingTour.test.js`, `src/utils/storageRegistry.test.js`.
Each was broken on purpose, watched fail, and restored.

## Reporting

There is no security contact and no bug bounty. Open an issue in the repository
with the steps to reproduce, and do not include anyone's stored data. If the
report is about a real vulnerability and the repository is public, say so
without publishing an exploit first.
