/**
 * Shared failure evidence for the real-Chrome audits.
 *
 * When signIn times out waiting for `button`, the page is blank and the log
 * says nothing about why. This attaches console errors, page errors, failed
 * requests (with status) and a screenshot to the page, and dumps them to
 * audit-artifacts/ on failure so CI can upload them. No behaviour change
 * when the audit passes.
 */
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = path.join(__dirname, '..', 'audit-artifacts');

const ensureDir = () => {
  if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
};

const attach = (page, tag) => {
  const state = { consoleErrors: [], pageErrors: [], failedRequests: [], badResponses: [], jsAsHtml: [] };
  page.on('console', (msg) => {
    if (msg.type() === 'error') state.consoleErrors.push(msg.text().slice(0, 500));
  });
  page.on('pageerror', (err) => state.pageErrors.push(String(err && err.message || err).slice(0, 500)));
  page.on('requestfailed', (req) => {
    state.failedRequests.push(`${req.url()} :: ${req.failure() ? req.failure().errorText : 'failed'}`.slice(0, 500));
  });
  page.on('response', async (res) => {
    try {
      const url = res.url();
      const status = res.status();
      if (status >= 400) state.badResponses.push(`${status} ${url}`.slice(0, 500));
      // The blank-page trap: the audit server falls back to index.html with
      // 200 for a missing /velora/static/*.js, so Chrome parses HTML as JS.
      // Status alone hides it, so record content-type on every JS/CSS hit.
      if (/\.(js|css)(\?|$)/.test(url)) {
        const ct = (res.headers()['content-type'] || '').slice(0, 80);
        if (/text\/html/.test(ct)) state.jsAsHtml.push(`${status} ${ct} ${url}`.slice(0, 500));
      }
    } catch (e) { /* header read failed, console/page errors carry it */ }
  });
  state.tag = tag;
  return state;
};

const dump = async (page, state) => {
  ensureDir();
  const buttonCount = await page.evaluate(() => document.querySelectorAll('button').length).catch(() => -1);
  const url = page.url();
  const lines = [
    `tag: ${state.tag}`,
    `url: ${url}`,
    `buttons: ${buttonCount}`,
    `consoleErrors (${state.consoleErrors.length}):`,
    ...state.consoleErrors.slice(0, 20).map((e) => `  ! ${e}`),
    `pageErrors (${state.pageErrors.length}):`,
    ...state.pageErrors.slice(0, 20).map((e) => `  ! ${e}`),
    `failedRequests (${state.failedRequests.length}):`,
    ...state.failedRequests.slice(0, 20).map((e) => `  ! ${e}`),
    `badResponses (${state.badResponses.length}):`,
    ...state.badResponses.slice(0, 20).map((e) => `  ! ${e}`),
    `jsAsHtml (${state.jsAsHtml.length}):`,
    ...state.jsAsHtml.slice(0, 20).map((e) => `  ! ${e}`),
  ];
  const safe = String(state.tag).replace(/[^a-z0-9-_]+/gi, '-');
  fs.writeFileSync(path.join(ARTIFACT_DIR, `${safe}.log`), lines.join('\n') + '\n');
  try {
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `${safe}.png`), fullPage: false });
  } catch (e) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, `${safe}.screenshot-error.txt`), String(e).slice(0, 500));
  }
};

module.exports = { attach, dump, ARTIFACT_DIR };
