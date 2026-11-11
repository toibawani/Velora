# Security policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.0   | Initial release    |

No older releases are maintained. There is no installed base of servers to patch: VELORA is a static site, and fixes ship by rebuilding and redeploying the repository.

## Reporting a vulnerability

VELORA is a no-account, all-client-side reference book served from GitHub Pages. There is no server, no database, no login and no cookies. Nothing is sent anywhere unless a visitor switches optional analytics on, and this build has no analytics endpoint configured, so nothing is sent at all.

If you believe you have found a security issue, open an issue in this repository with steps to reproduce. Do not include anyone's stored browser data (names, notes, questions or progress). If the report is about a real vulnerability and the repository is public, describe the issue without publishing an exploit first.

## What is out of scope

- **localStorage on a shared device.** Anyone using the same browser profile can read and change everything VELORA has stored. That is a device-control issue, not an app vulnerability; the app documents it plainly in docs/SECURITY.md and on its Privacy screen.
- **The optional GoatCounter beacon.** Opt-in only, off by default, and unconfigured in this build, so no data leaves the browser.

## Full threat model

See [docs/SECURITY.md](../docs/SECURITY.md) for what the app protects, what it does not, and the tests that pin each claim.
