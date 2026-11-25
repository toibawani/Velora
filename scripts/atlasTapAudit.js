/**
 * Walk every field and discipline in the real built app in real Chrome, tap one
 * topic per discipline, and record whether content actually opened.
 *
 * The audit exists to answer "is a dead topic one bug or many", so it reports
 * per discipline rather than per field. It also exits non-zero when a written
 * topic opened nothing, which is the difference between an audit that ran and
 * one that proved something.
 *
 * The DOM it drives changed when home became two screens: fields are `.rh-field`
 * tabs, a field page has `.shelf-discipline` buttons, and its topics are
 * `.shelf-topic` rows (buttons when written, spans when not). There is no
 * preview panel any more, so the probe checks the thing that matters - whether
 * the click opened content - rather than whether a panel updated above it.
 *
 * Usage: node scripts/atlasTapAudit.js
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..', 'build');
const { findChrome } = require('./chrome');
const { stripBase } = require('./auditServe');
const CHROME = findChrome();

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon',
};

const serve = (root) =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const stripped = stripBase(req.url);
      const file = path.join(root, stripped === '/' ? 'index.html' : stripped);
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); res.end('nope'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const SEED = { velora_onboarding_done: 'true' };

const signIn = async (page, port) => {
  // Navigate before touching localStorage: about:blank has an opaque origin.
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((seed) => {
    localStorage.clear();
    Object.entries(seed).forEach(([k, v]) => localStorage.setItem(k, v));
  }, SEED);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('button', { timeout: 20000 });

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
  await page.waitForSelector('.rh-field', { timeout: 20000 });
  await wait(800);
};

(async () => {
  if (!CHROME) { console.error('No Chrome found'); process.exit(1); }
  const server = await serve(ROOT);
  const port = server.address().port;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  // page.evaluate, but survivable. A click that navigates swaps the frame
  // underfoot, and evaluating into the frame you held a moment ago throws
  // "Attempted to use detached Frame" - a statement about timing, not the atlas.
  const evaluate = async (fn, arg) => {
    const deadline = Date.now() + 20000;
    for (;;) {
      try {
        return await page.evaluate(fn, arg);
      } catch (e) {
        const transient = /detached frame|execution context|Target closed|Cannot find context|Session closed/i.test(e.message);
        if (!transient || Date.now() > deadline) throw e;
        await wait(250);
        try {
          await page.waitForFunction(
            () => document.readyState === 'complete' || document.readyState === 'interactive',
            { timeout: 5000 }
          );
        } catch { /* the retry below is the real attempt */ }
      }
    }
  };

  // Home is ready when its field tabs are on screen. Returning to it is a
  // click, and a click is not a navigation guarantee.
  const waitForAtlas = async () => {
    await page.waitForFunction(() => document.querySelectorAll('.rh-field').length > 0, { timeout: 20000 });
  };

  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

  await signIn(page, port);

  const fieldNames = await evaluate(() =>
    [...document.querySelectorAll('.rh-field')].map((b) => ({
      label: b.querySelector('.rh-field-name')?.textContent.trim() || b.getAttribute('aria-label') || '',
    }))
  );
  console.log(`reached atlas: true (${fieldNames.length} fields)`);

  const openField = async (name) => {
    // A lesson leaves home; the Atlas item in the bottom bar brings it back.
    await evaluate(() => {
      const nav = [...document.querySelectorAll('.mobile-bottom-nav button, .mobile-nav-item')]
        .find((b) => /^(Atlas|Home)$/.test(b.textContent.trim()));
      if (nav) nav.click();
    });
    await wait(500);
    await evaluate((label) => {
      const tab = [...document.querySelectorAll('.rh-field')]
        .find((b) => b.querySelector('.rh-field-name')?.textContent.trim() === label);
      if (tab) tab.click();
    }, name);
    await page.waitForFunction(() => document.querySelectorAll('.shelf-discipline').length > 0, { timeout: 15000 });
    await wait(250);
  };

  const rows = [];
  for (const field of fieldNames) {
    await openField(field.label);

    const disciplineNames = await evaluate(() =>
      [...document.querySelectorAll('.shelf-discipline')].map((b) => ({
        name: b.querySelector('span')?.textContent.trim() || '?',
      }))
    );

    for (let d = 0; d < disciplineNames.length; d += 1) {
      // Opening a lesson navigates away and coming back lands on Today, not on
      // the field being probed, so the field is re-selected every time.
      await openField(field.label);
      await evaluate((index) => {
        const button = document.querySelectorAll('.shelf-discipline')[index];
        if (button) button.click();
      }, d);
      await wait(300);

      const picked = await evaluate(() => {
        const topics = [...document.querySelectorAll('.shelf-topic')];
        const written = topics.filter((t) => t.tagName === 'BUTTON');
        const target = written[0] || topics[0];
        if (!target) return null;
        const topic = target.querySelector('.shelf-topic-name')?.textContent.trim();
        const isWritten = target.tagName === 'BUTTON';
        if (isWritten) target.click();
        return { topic, written: isWritten };
      });

      if (!picked) {
        rows.push({ field: field.label, discipline: disciplineNames[d].name, verdict: 'discipline has no topics' });
        continue;
      }
      await wait(300);

      let opened = 'skipped (topic is not written)';
      if (picked.written) {
        opened = await evaluate(async () => {
          const SELECTOR = '.lesson-reader, .bhm-pager, .deep-read-container, .lr-reader, [data-testid="lesson"]';
          const deadline = Date.now() + 15000;
          while (Date.now() < deadline) {
            if (document.querySelector(SELECTOR)) return 'topic -> content opened';
            await new Promise((r) => setTimeout(r, 100));
          }
          return `topic -> NOTHING OPENED (waited 15s for ${SELECTOR})`;
        });
      }

      rows.push({
        field: field.label,
        discipline: disciplineNames[d].name,
        topic: picked.topic,
        previewUpdated: true,
        opened,
      });
    }
  }

  console.log('\nfield / discipline'.padEnd(42), 'topic'.padEnd(24), 'result');
  console.log('-'.repeat(120));
  rows.forEach((r) => {
    const verdict = r.verdict
      || (r.opened.startsWith('skipped') ? 'listed, nothing written (expected)'
      : r.opened.includes('NOTHING OPENED') ? 'WRITTEN TOPIC OPENED NOTHING'
      : 'content opened');
    console.log(`${(r.field + ' / ' + r.discipline).padEnd(42)} ${(r.topic || '-').padEnd(24)} ${verdict}`);
  });

  const dead = rows.filter((r) =>
    r.verdict
    || !r.previewUpdated
    || r.opened.includes('NOTHING OPENED')
  );
  if (!rows.length) {
    console.error('\nno fields or disciplines were found on the atlas; nothing was probed');
    await browser.close();
    server.close();
    process.exit(1);
  }
  if (dead.length) {
    console.error(`\n${dead.length} of ${rows.length} field/discipline probes found no live topic:`);
    for (const r of dead) {
      console.error(`  ${r.field} / ${r.discipline} -> ${r.verdict || r.opened || 'no reaction to a topic tap'}`);
    }
  }
  if (consoleErrors.length) console.error(`\nconsole errors: ${consoleErrors.length}`);

  await browser.close();
  server.close();
  process.exit(dead.length || consoleErrors.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
