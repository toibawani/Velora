/**
 * PART 1 audit: what actually happens when you tap a topic in the Atlas.
 *
 * Walks every field -> discipline in the real built app in real Chrome, taps
 * one topic per discipline, and records what the DOM did. The point is to find
 * out whether a dead topic is one bug or many, so it reports per discipline.
 *
 * Usage: node scripts/atlasTapAudit.js
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..', 'build');
// Chrome discovery lives in scripts/chrome.js.
//
// This list named only the macOS bundle and /usr/bin/chromium. On a GitHub
// Actions ubuntu runner Chrome is at /usr/bin/google-chrome, so these four
// scripts would all have exited with "No Chrome found" - which is why none of
// them was in CI, and why nobody could tell the difference between an audit
// that found nothing and one that never ran.
const { findChrome } = require('./chrome');
const CHROME = findChrome();

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon',
};

const serve = (root) =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const file = path.join(root, req.url === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); res.end('nope'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// The onboarding preference key is the same one layoutCheck.js seeds. Setting it
// is not faking a session: there is no session. It only skips the interest
// question, which is not what this audit is measuring.
const SEED = { velora_onboarding_done: 'true' };

const signIn = async (page, port) => {
  // Navigate before touching localStorage: the initial about:blank document has
  // an opaque origin and throws SecurityError on any storage access.
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((seed) => {
    localStorage.clear();
    Object.entries(seed).forEach(([k, v]) => localStorage.setItem(k, v));
  }, SEED);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('button', { timeout: 20000 });

  // Walk splash -> landing -> profile by clicking whatever the screen offers.
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (await page.$('#profile-name')) break;
    const moved = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button, a')].find((x) =>
        /start learning|look around|begin your exploration/i.test(x.textContent.trim()));
      if (!b) return false;
      b.click();
      return true;
    });
    await wait(moved ? 600 : 400);
  }
  await page.waitForSelector('#profile-name', { timeout: 20000 });
  await page.type('#profile-name', 'Ada Lovelace');
  await page.click('button[type="submit"]');
  await wait(800);
  const interests = await page.$('.subject-selection-grid');
  if (interests) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[type="submit"]')].pop();
      b && b.click();
    });
    await wait(800);
  }
  await page.waitForFunction(() => document.querySelectorAll('nav').length > 0, { timeout: 20000 });
  await wait(1000);
};

/**
 * Verification for the Atlas topic fix.
 *
 * The first audit script's "opened overlay" verdict was matching the navigation
 * drawer, which is a <dialog> and therefore not evidence that any content
 * opened. This script asserts on the thing that matters instead: for a chosen
 * set of topics, what is actually on screen after the call to action is
 * pressed. It checks all three outcomes the resolver can produce.
 *
 * Usage: node scripts/atlasTopicVerify.js
 */

/**
 * Search the atlas for a topic and select it, the way a reader would.
 *
 * Returns to the atlas first if the previous case navigated away, but only by
 * pressing the Home control when the atlas is genuinely not on screen. Pressing
 * it unconditionally navigates off the atlas and the search box disappears,
 * which made every case report NOT FOUND.
 */
const selectTopicViaSearch = async (page, query, topic) => {
  const onAtlas = await page.evaluate(() => Boolean(document.querySelector('#curriculum-search')));
  if (!onAtlas) {
    await page.evaluate(() => {
      const back = [...document.querySelectorAll('button')]
        .find((b) => /^(Home|Atlas)$/.test(b.textContent.trim()));
      back && back.click();
    });
    await wait(900);
  }

  // Type for real rather than assigning .value and dispatching an event. React's
  // controlled input listens to the native input sequence; setting the value
  // directly updates the DOM but leaves the component's state untouched, so
  // the search results never appear. page.type produces the keystrokes a person
  // would, which is also the thing this script is supposed to be testing.
  await page.click('#curriculum-search', { clickCount: 3 });
  await page.type('#curriculum-search', query, { delay: 15 });

  await wait(500);

  const clicked = await page.evaluate((t) => {
    const target = [...document.querySelectorAll('.uh-search-results button')]
      .find((b) => b.querySelector('span')?.textContent.trim() === t);
    if (!target) return false;
    target.click();
    return true;
  }, topic);

  // Clear the box so the next case is not searching inside the previous query.
  await page.evaluate(() => {
    const input = document.querySelector('#curriculum-search');
    if (!input) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  return clicked;
};

/** Press the preview call to action and report what is actually on screen. */
const pressCtaAndReport = (page) =>
  page.evaluate(async () => {
    const btn = document.querySelector('.uh-topic-preview button');
    if (!btn) return { label: null, note: 'no call to action rendered' };
    const label = btn.textContent.trim();
    btn.click();
    await new Promise((r) => setTimeout(r, 900));
    const body = document.body.innerText;
    return {
      label,
      heading: document.querySelector('h1')?.textContent?.trim() || null,
      // The lesson reader renders the topic title as its own h1 and its
      // sections with lesson-* classes.
      lessonOpen: /lesson-(story|kicker|block)/.test(document.body.innerHTML),
      // The black hole masterclass prints its own level counter. Matched on the
      // class rather than the text, because the text is capitalised
      // differently depending on where in the component it lands.
      levelRailOpen: Boolean(document.querySelector('.bhm-pager, .bhm-level-rail')),
      stillOnAtlas: Boolean(document.querySelector('#knowledge-atlas')),
      // The whole body, not a slice: the "not written yet" notice sits far
      // below the fold in the markup, so a 200-character sample never reached
      // it and every unwritten case looked like a failure.
      bodyText: body.replace(/\s+/g, ' '),
    };
  });

/**
 * Each case names the topic to tap and the outcome the resolver promises for it.
 * The query is the text typed into the atlas search box to reach that topic.
 */
const CASES = [
  { name: 'Stoicism (philosophy lesson)', query: 'Stoicism', topic: 'Stoicism', expect: 'lesson' },
  { name: 'Renaissance (history lesson)', query: 'Renaissance', topic: 'Renaissance', expect: 'lesson' },
  { name: 'Industrial Revolution (history)', query: 'Industrial', topic: 'Industrial Revolution', expect: 'lesson' },
  { name: 'Black Holes (deep read)', query: 'Black Holes', topic: 'Black Holes', expect: 'deep-read' },
  { name: 'General Relativity (deep read)', query: 'General Relativity', topic: 'General Relativity', expect: 'deep-read' },
  { name: 'Quantum Computing (cs deep read)', query: 'Quantum Computing', topic: 'Quantum Computing', expect: 'deep-read' },
  { name: 'Motion (classical mechanics lesson)', query: 'Motion', topic: 'Motion', expect: 'lesson' },
  { name: 'Work, Energy & Power (lesson)', query: 'Work, Energy', topic: 'Work, Energy & Power', expect: 'lesson' },
  { name: 'Entropy (listed, unwritten)', query: 'Entropy', topic: 'Entropy', expect: 'unwritten' },
  { name: 'Shakespeare (field unmapped)', query: 'Shakespeare', topic: 'Shakespeare', expect: 'unwritten' },
  { name: 'Monsoons (field unmapped)', query: 'Monsoons', topic: 'Monsoons', expect: 'unwritten' },
];

(async () => {
  if (!CHROME) { console.error('No Chrome found'); process.exit(1); }
  const server = await serve(ROOT);
  const port = server.address().port;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

  await signIn(page, port);

  let failures = 0;
  console.log('case'.padEnd(40), 'cta label'.padEnd(20), 'outcome');
  console.log('-'.repeat(112));
  for (const testCase of CASES) {
    const found = await selectTopicViaSearch(page, testCase.query, testCase.topic);
    if (!found) {
      const why = await page.evaluate(() => ({
        hasInput: Boolean(document.querySelector('#curriculum-search')),
        headings: [...document.querySelectorAll('h1,h2')].map((e) => e.textContent.trim()).slice(0, 3),
        results: [...document.querySelectorAll('.uh-search-results button')].map((b) => b.innerText.replace(/\n/g, ' | ')).slice(0, 3),
      }));
      console.log(`${testCase.name.padEnd(40)} NOT FOUND ${JSON.stringify(why)}`);
      failures += 1; continue;
    }
    const r = await pressCtaAndReport(page);
    let outcome; let ok = false;
    if (testCase.expect === 'lesson') {
      ok = r.lessonOpen === true;
      outcome = ok ? `lesson opened: "${r.heading}"` : `NO LESSON (heading ${r.heading})`;
    } else if (testCase.expect === 'deep-read') {
      ok = r.levelRailOpen === true;
      outcome = ok ? 'black hole levels open' : 'NO DEEP READ';
    } else {
      // Three things must all hold: we did not navigate, the notice names the
      // topic the reader tapped, and it says plainly that nothing is written.
      ok = r.stillOnAtlas === true
        && /not written yet/i.test(r.bodyText)
        && new RegExp(testCase.topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(r.bodyText);
      outcome = ok
        ? `stayed on atlas, said "${testCase.topic}" not written`
        : `unexpected: onAtlas=${r.stillOnAtlas} mentionsTopic=${r.bodyText.includes(testCase.topic)}`;
    }
    if (!ok) failures += 1;
    console.log(`${testCase.name.padEnd(40)} ${String(r.label).padEnd(20)} ${outcome}`);
  }

  console.log(`\nfailures: ${failures}`);
  console.log(`console errors: ${consoleErrors.length}`);
  consoleErrors.slice(0, 8).forEach((e) => console.log('  !', e.slice(0, 160)));
  await browser.close();
  server.close();
  process.exit(failures || consoleErrors.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
