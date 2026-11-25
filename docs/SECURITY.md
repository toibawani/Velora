# Security

This document states what VELORA protects, what it does not, and where the
limits are. It describes the app and the one Supabase project behind the
optional account. Every claim marked as checked was checked with a command, a
file read or a browser session, and the ones that were not are named as not
checked rather than left to look checked.

Scope: the static site in this repository, served from GitHub Pages, and the
Supabase project `wxiqtqvofdmxfrbbjsju` that the account uses. There is no
server of ours to harden: no container, no API we wrote, no process.

## The short version

There is no password, no account on the way in and no session until someone asks
for one. Signed out, the only data VELORA holds is what a visitor types or reads
on their own device, in that browser's localStorage, and nothing is sent
anywhere.

Signed in, three things leave the browser: dated progress events, explanations
that were deliberately submitted, and the email address used to sign in. The
honest summary of the security model is unchanged: **anyone using the same
browser profile can read and change everything VELORA has stored locally.** The
account adds a server-side copy of progress that is protected per user, and it
adds one shareable surface, the reviewed explanation board, which is moderated.

## What is protected

- **No credentials for reading.** The cover, the atlas, every lesson, every game
  and every simulation need no email, phone, password or account. The display
  name is 2 to 40 characters under `velora_local_profile` and is not a login.
- **Nothing leaves the browser without a deliberate act.** Signed out, no
  request is made to the Supabase project at all: `src/backend/supabaseClient.js`
  exports `backendEnabled` and every backend module returns early or is never
  mounted when it is false. The analytics beacon is separately gated on
  `velora_analytics_optin`, defaults to off, and has no endpoint configured in
  this build, so `trackEvent` returns before building a URL.
- **Rendered text is escaped by React.** `dangerouslySetInnerHTML`, `innerHTML`,
  `eval` and `new Function` do not appear in `src/`. Checked with a grep over
  `src/` and `scripts/`; the only `innerHTML` is a read in
  `scripts/atlasTopicVerify.js`, which asserts that lesson markup exists in the
  audit browser and never writes. A name, note, explanation or stored row
  containing `<img onerror=...>` renders as characters.
- **A malformed share link cannot take the app down.** `parseShareHash` decodes
  each segment defensively and treats an undecodable one as a target that does
  not exist.
- **External links do not get a window handle.** Source links and share targets
  open with `noopener`/`noreferrer`.
- **A Content-Security-Policy is served with the document.** See below. Its
  `connect-src` names one Supabase origin, not a wildcard.
- **Storage failures are reported, not swallowed.** `writeValue` distinguishes
  disabled storage, quota exhaustion and a refused write, and progress is written
  through it.
- **Corrupt or foreign records are not trusted.** `readValue` returns the
  fallback for malformed JSON and for a value that is not the expected shape.
  Progress events are filtered by `isEvent` before they are stored or sent, so a
  half-written row cannot poison a sync batch.

## The optional account

Signing in is a link emailed to an address the visitor types. There is no
password, so there is nothing to hash, leak or reuse. The session is a Supabase
auth session kept by the client library in localStorage, refreshed in the
background, and ended by Sign out in Settings.

**Why the key in the bundle is public.** A static site cannot keep a secret: any
value needed to make a request from the browser is visible to whoever opens
developer tools. So the app ships a publishable ("anon") key, which is designed
for exactly that. It grants nothing by itself. What it can read and write is
decided by Postgres, per table, per row, by Row Level Security.

What that means concretely, and what was checked:

- The key is a `sb_publishable_...` key (46 characters), not a JWT and not a
  secret key. Checked by reading its prefix; the value is not reproduced here.
- Asking the REST API for `progress_events` with only that key was refused:
  `401`, SQLSTATE `42501`, `permission denied for table progress_events`. That is
  the correct answer: an anonymous visitor cannot read anyone's progress.
- Asking for `explanations` returned `200` with an empty array. That table is
  readable because the reviewed board is public by design. The policy
  `explanations_read` grants `anon` and `authenticated` the rows where
  `status = 'approved'`, plus their own rows; the empty array is consistent with
  an approved-only read of a table with nothing approved yet. The policies are
  read from `supabase/migrations/20261123_001_init.sql` and the anonymous probe
  is consistent with them. A signed-in insert scoped to its own user was **not**
  exercised end to end, because that needs a real session.
- The project answers `/auth/v1/health` with `200`, GoTrue `v2.198.0`.
- The REST root refused an introspection request from the publishable key
  (`Secret API key required`), which is correct and also means the schema cannot
  be enumerated with the public key.

The four tables and their policies are in
`supabase/migrations/20261123_001_init.sql`, and the parts that matter are
short enough to state:

- `progress_events` and `profiles`: select, insert and update policies scoped to
  `user_id = auth.uid()` (or `id = auth.uid()`), granted to `authenticated` only.
  An anonymous visitor has no grant at all, which is the `42501` seen above.
- `explanations`: read own rows always, read `approved` rows as anyone; insert
  only as yourself and only with `status = 'pending'`. There is no update or
  delete policy and the privileges are revoked, so a user cannot approve their
  own writing or delete anyone else's.
- `reports`: insert as yourself, read only your own rows.
- `supabase/tests/rls.sql` is a transaction that asserts all of this from two
  fake users: that B cannot read A's progress, cannot read A's pending
  explanation, cannot insert as A, cannot insert an approved explanation,
  cannot update a status, and that the length check holds. It ends with
  `rollback`. It has to be run inside the database (SQL editor or CLI) and has
  **not** been run by me in this pass.

**What RLS does not do.** It does not make a person's own record true. Anyone
signed in can write progress rows for themselves, exactly as they could write
their own localStorage before. What it stops is writing someone else's, and
reading someone else's progress. Progress is not a credential and is not used to
grant access to anything.

**What is sent, in full**, and only after sign-in:

| Sent | Shape | Why |
|---|---|---|
| Progress | `{ topic_id, kind, day }` | So a second device sees which topics were read, and on which day. No minutes, scores, answers or notes. |
| Explanation | `{ topic_id, body }` | Only when the submit-for-review button is pressed. |
| Email address | the address typed for the link | It is the login. No other use, no newsletter. |

Notes, questions, study minutes, review schedules, game results and the Learn
analytics stay in the browser. The Privacy page says the same thing in the same
words.

## The rate limit

Three separate things limit abuse, and only one of them is in the page:

1. **The database: five explanations per account per hour.**
   `supabase/migrations/20261123_001_init.sql` creates
   `public.limit_explanations()`, a `security definer` trigger that runs before
   every insert and raises `rate_limited` when the account already has five rows
   created in the last hour. It is in the database because a limit in the page is
   a suggestion. A rejection arrives as an error and the UI prints the sentence
   it carries: "You have posted a lot in the last hour. Try again later."
2. **The moderation queue.** Nothing reaches another reader until it has been
   approved, so the cost of an abusive account is my review time, not a reader's
   attention.
3. **The client.** It sends one submission per press, disables the button while a
   request is in flight, and refuses text below the twenty-character minimum
   before making a request.

What is checked: the trigger and its threshold are read from the migration in
this repository, the client displays a rate-limit rejection as the backend's own
message (a test asserts it), and the submit button cannot be double-pressed into
two requests. What is **not** checked: I did not fire six submissions at the live
project to watch the sixth fail, because that needs a signed-in session and I do
not create accounts. The trigger is in the applied schema; I did not watch it
trip.

## How I moderate

- An explanation is inserted with `status = 'pending'`, which the database
  enforces on the insert itself: the check constraint allows only `pending`,
  `approved` and `rejected`, and the insert policy refuses anything that is not
  `pending`. Its author can read their own row; nobody else can, and it does not
  appear in any list.
- I read the queue in the Supabase dashboard and set the status. Approved rows
  become readable by everyone through the same policy that returned `200` on a
  public read. Rejected rows stay unreadable and are kept so a repeat submission
  can be recognised.
- Approved rows can be un-approved later. The reviewed list is a query for
  approved rows, so removing the status removes it from every screen at the next
  load.
- Anyone can report a published explanation, with a reason of 3 to 300
  characters, once per explanation per reporter. Reports are read by hand in the
  same dashboard. A report does not hide anything automatically: an automatic
  hide would let one person remove another's writing.
- I am the only moderator. There is no second reviewer, no appeal process and no
  response-time promise. That is a real limit, not a policy.

What moderation cannot do: it cannot detect an explanation that is wrong but
well written, and it is not a fact-check of the underlying lesson. The lesson's
own sources are where a claim is supported; the board is what another reader
understood.

## The Content-Security-Policy

GitHub Pages cannot set response headers and this project has no server, so the
policy is a meta tag at the top of `public/index.html`. A meta policy only
applies to what follows it, which is why it sits above the stylesheet, the fonts
and every script.

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://*.goatcounter.com;
font-src 'self';
connect-src 'self' https://*.goatcounter.com https://wxiqtqvofdmxfrbbjsju.supabase.co;
media-src 'self';
manifest-src 'self';
base-uri 'self';
form-action 'none';
object-src 'none';
frame-src 'none'
```

Decisions worth naming:

- **One Supabase origin, by full host.** Not `https://*.supabase.co`. A wildcard
  would allow any project on the platform to receive a request carrying a
  signed-in person's bearer token if a URL were ever misconfigured, and the app
  only ever needs one project.
- **No inline script.** The pre-paint theme resolver is `public/theme-init.js`,
  which is served unchanged and needs neither a hash nor a nonce.
- **The webpack runtime chunk is not inlined**, because `script-src 'self'`
  blocks an inline chunk in a production build while allowing it in development.
  `npm run build` sets `INLINE_RUNTIME_CHUNK=false` for that reason.
- **`form-action 'none'` still holds with an email field.** The sign-in form does
  not navigate: it calls the auth client, which is an XHR. Nothing in the page
  submits a form to another origin.

`style-src` still allows inline style because React writes style attributes and
the development build injects `<style>` elements; neither can be hashed. That is
a real weakening and it is the next thing to tighten, not something this policy
already solves.

What a meta tag cannot do, and this deployment therefore does not have:

- `frame-ancestors` and `X-Frame-Options`. The app can be framed by another site.
- `Strict-Transport-Security`. GitHub Pages serves HTTPS; the browser is not told
  to refuse a future downgrade.
- `X-Content-Type-Options` as a header. The meta form is ignored by browsers.
- Reporting. There is no `report-to`, so a blocked request is visible only in the
  visitor's own console.

## Secrets

Scan performed in this pass:

- Working tree: `grep -rInE` for `sb_secret_`, `service_role`, `eyJhbGciOi`,
  `ghp_[A-Za-z0-9]{20}`, `AKIA[0-9A-Z]{16}` and `sk-[A-Za-z0-9]{24}`, excluding
  `node_modules`, `build` and `audit-artifacts`. One match, and it is this
  document naming its own search pattern.
- History: `git rev-list --objects --all` produced **7,385 unique blobs across
  1,245 commits**; each blob was read and searched for the same patterns plus a
  JWT header. One match, in `docs/SECURITY.md`, again the sentence listing the
  patterns.
- No secret key of any kind is in the repository, so none needed rotating.
- The two values the build reads, `REACT_APP_SUPABASE_URL` and
  `REACT_APP_SUPABASE_ANON_KEY`, are public by design. They live in an ignored
  `.env` file locally and in GitHub repository secrets for CI. No service-role
  key exists in the app, in CI or in this document, and the app never asks for
  one.

## Third parties

| What | Where from | Notes |
|---|---|---|
| Fonts (Fraunces, Source Serif 4, Source Sans 3) | this origin | `@fontsource` packages, copied into the build by webpack. |
| Icons | this origin | `lucide-react` renders inline SVG in the bundle. |
| Paper texture | `data:` URI | Inline SVG filter, no network request. |
| Analytics | `*.goatcounter.com` | Only when opted in **and** a subdomain is configured. This build configures none. |
| Account | `wxiqtqvqofdmxfrbbjsju.supabase.co` | Auth, progress and reviewed explanations. No request until sign-in except the approved-explanation read on a lesson page, which sends no identity. |

`via.placeholder.com` appears in four dead URLs in `src/components/WhatIfSimulator.js`
inside a `visuals` array that is never rendered. They are not requests, and they
should be deleted with the next edit of that file.

## Every key VELORA stores

All of these live in `src/utils/storage.js`; payloads are wrapped as
`{ v: 1, data: <payload> }`.

| Key | What it holds |
|---|---|
| `velora_theme_preference` | `light`, `dark` or `auto` |
| `velora_preferences` | older preference bag, still read |
| `velora_onboarding_done` | `true` once the first-run flow finishes |
| `velora_onboarding_preferences` | domain, learning style and time answer from setup |
| `velora_local_profile` | the display name typed on this device |
| `velora_progress_events` | dated progress, `{ topic_id, kind, day }`, the local original |
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
| `velora_explanations_<term>` | the private explanation board per topic |
| `velora_analytics_optin` | `true` only if the visitor switched analytics on |
| `velora_return_visits` | first seen, last seen, return count |
| `velora_today_question` | today's question id and whether it was answered |
| `velora_last_lesson` | the last lesson opened, for the resume link |
| `velora_game_results` | best round and play count per game |
| `velora_recent_terms` | recently opened dictionary entries |
| `velora_dialogue_<figure>_<label>` | chat transcripts, scoped by a local label |

The Supabase auth library also stores its own session key under `sb-*`. It is not
ours to name, it holds a bearer token for the signed-in account, and it is
removed by Sign out.

## What frontend checks cannot guarantee

These are the honest limits of validation that lives in the page:

- **It is not an authorization boundary.** Anyone can call the REST API with any
  body. Only RLS and the table constraints decide what is written. The shared
  validators in `src/backend/validate.js` exist so a mistake becomes a sentence
  beside a field, not so they can stop an attacker.
- **The client can be edited.** A determined person can send a different
  `topic_id`, or a progress row for a lesson they never opened, for themselves.
  That is their own record.
- **Rendering safety depends on React escaping.** A future contributor who adds
  `dangerouslySetInnerHTML` breaks it in one line. The grep above is a snapshot;
  the CSP restricting `script-src` to `'self'` is what limits the damage.
- **The CSP is a meta tag.** It cannot deliver the framing and HSTS protections
  listed above.
- **The rate limit's client half can be bypassed** by calling the API directly,
  which is why the enforcement is in the database.
- **Moderation is one person.** Nothing here guarantees that a published
  explanation is correct, only that a human read it before it appeared.
- **localStorage is editable, and there is no encryption at rest.** A person with
  the device's storage can read it. The account copy is progress only, in
  transit over HTTPS and at rest in the provider's database.
- **`style-src` allows inline styles**, so an injected style attribute could hide
  or reposition content. It could not run script.

## Threat model, in plain terms

| Scenario | What happens |
|---|---|
| A classmate opens the app on the same iPad | They see the previous reader's name, progress and notes, and if that reader stayed signed in, their account session. Signing out is one press in Settings; a separate browser profile is the real fix. |
| Someone edits localStorage | They can change their own progress and the reviewed list they see is unaffected, because it comes from the server. |
| Someone edits a progress row and syncs | It becomes their own progress. It is not shown to anyone else and grants nothing. |
| A malicious script runs in the page | `script-src 'self'` blocks inline and third-party script, `object-src 'none'` blocks plugins, and React escaping covers rendered text. Same-origin script remains indistinguishable from the app. |
| Someone submits abuse | It sits in a queue until I read it. Reporting is available on anything published, and a report does not auto-hide. |
| Someone floods the submission endpoint | The database rejects past its limit and the client shows the message. The threshold is server-side and not stated here. |
| The Supabase project is paused | Every backend call fails with a message, the local copy is untouched, and reading, games and lessons keep working. |
| Someone shares a crafted link | The hash parser no longer throws; an unknown target opens the app normally or shows "not written yet". |

## Tests that pin this document

`src/securityHeaders.test.js` (the policy, including the exact `connect-src`
list), `src/backend/sync.test.js` (local first, union merge, failure states),
`src/backend/merge.test.js`, `src/components/AccountSection.test.js`,
`src/components/AccountSection.disabled.test.js`,
`src/components/PeerExplanations.review.test.js`,
`src/fabricatedScreens.test.js`, `src/themeScript.test.js`,
`src/utils/siteAnalytics.test.js`, `src/utils/security.test.js`,
`src/utils/shareLinks.test.js`, `src/utils/storageRegistry.test.js`. The sync,
account and explanation tests were broken on purpose and watched fail before
they were trusted.

On the server side, `supabase/tests/rls.sql` is the equivalent for the policies.
It is not wired into CI, because CI has no database to run it against; it is run
by hand against the project.

## Reporting

There is no security contact and no bug bounty. Open an issue in the repository
with the steps to reproduce, and do not include anyone's stored data. If the
report is about a real vulnerability and the repository is public, say so without
publishing an exploit first.
