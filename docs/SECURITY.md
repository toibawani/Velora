# Security

This document states what VELORA protects, what it does not, and where the
limits are. It is about the app as it ships, not an aspiration.

## The short version

There is no server, no account and no session. The only data VELORA holds is
what a visitor types or reads on their own device, in that browser's
localStorage. Nothing is sent anywhere unless the visitor turns on the optional
analytics beacon, which is off by default.

That means the security model is mostly the browser's, and the honest summary is:
**anyone using the same browser profile can read and change everything VELORA
has stored.** The app is built for a shared school iPad, but it cannot defend
that iPad against the next person who picks it up.

## What is protected

- **No credentials are collected.** No password, email, phone number or account.
  The profile is a display name, 2–40 characters, kept under
  `velora_local_profile` and used only to greet the reader. It is not a login and
  is not checked against anything.
- **Nothing leaves the browser by default.** `src/utils/siteAnalytics.js` gates
  every beacon on `velora_analytics_optin`, which defaults to false. With it off,
  the module returns before touching the network. The privacy screen says so,
  and the code path matches the screen.
- **Rendered text is escaped by React.** Nothing in `src/` uses
  `dangerouslySetInnerHTML`, so a name or a note containing `<script>` renders as
  characters, not as markup. `src/utils/sanitize.js` is a second layer for
  stored text that might later be exported, shared or piped into a non-React
  surface; it deliberately does not strip all angle brackets, because that
  mangled legitimate text like `5 < 10`.
- **External links do not get a window handle.** Source links and share targets
  open with `noopener`/`noreferrer`.
- **Storage failures are reported, not swallowed.** `writeValue` distinguishes
  disabled storage, quota exhaustion and a refused write, and the UI says the
  data will be lost rather than showing a saved state that is not saved.
- **Corrupt or foreign records are not trusted.** `readValue` returns the
  fallback for malformed JSON. `secureUserStorage` records carry a `userId` and
  refuse a record whose id does not match the caller's.

## What is not protected

- **There is no authentication and no authorization boundary.** `authUid` in
  `src/utils/security.js` defaults to `'local_scholar'`; it is a scoping label,
  not an identity. The module's "RLS" checks are a leftover of a server design
  that was removed. They stop a record written by one local label from being read
  under another; they do not stop a person with the browser open.
- **localStorage is editable.** A visitor can open DevTools and change progress,
  saved questions or the profile name. None of it is a claim to anyone else, and
  nothing in the app treats it as verified.
- **No Content-Security-Policy is set.** `public/index.html` sets
  `X-Content-Type-Options: nosniff` but not a CSP. CRA inlines a small theme
  script, so a CSP would need a hash or nonce; until then, a successful script
  injection would not be blocked by policy. The absence is a known gap, not an
  oversight that the tests cover.
- **Client-side validation is not a control.** `validatePayload` and the
  injection pattern run in the page. They catch bad input and corrupt stored
  records; they do not defend against someone who can run JavaScript in the page.
- **The analytics opt-in is a promise, not a guarantee.** If the code is changed
  to send without checking the flag, nothing in the test suite would notice.
- **No encryption at rest.** Everything is plain JSON in localStorage. A person
  with access to the device's storage can read it.

## The limits of localStorage

- It is per origin and per browser profile. Clearing site data removes the
  profile, saved lessons, review schedule, questions and notes.
- It is usually capped around 5 MB per origin. When the quota is hit, writes fail
  and the app reports that instead of dropping data silently.
- Private browsing and some managed school profiles refuse storage entirely. The
  app still works for reading; it says nothing can be saved.
- It can be changed by any script on the same origin. There is no server copy to
  correct it against.

## Threat model, in plain terms

| Scenario | What happens |
|---|---|
| A classmate opens the app on the same iPad | They see the previous reader's name, progress and notes. The app cannot prevent this; clearing site data or using a separate profile does. |
| Someone edits localStorage | They can change their own progress. Nothing is shared, so nothing is defaced for anyone else. |
| A malicious script runs on the page | React escaping protects rendered text, but there is no CSP, and localStorage is readable. This is the gap to close first if the app ever accepts content from outside the repository. |
| The site is served over HTTP | GitHub Pages serves HTTPS. There is no mixed content: fonts are self-hosted and there are no third-party scripts. |
| Analytics is enabled | Page path, page title, topic opened, game id and a 7-day return count are sent to GoatCounter. No identifier, no cookies, no fingerprinting. It is off until the visitor turns it on. |

## Reporting

There is no security contact and no bug bounty. Open an issue in the repository
with the steps to reproduce, and do not include anyone's stored data. If the
report is about a real vulnerability and the repository is public, say so
without publishing an exploit first.
