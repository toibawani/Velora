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
const CHROME =
  process.env.CHROME_PATH ||
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));

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
  const state = await page.evaluate(() => ({
    headings: [...document.querySelectorAll('h1,h2')].map((e) => e.textContent.trim()).slice(0, 5),
    atlas: Boolean(document.querySelector('#knowledge-atlas')),
    keys: Object.keys(localStorage).filter((k) => /profile|onboard/i.test(k)).map((k) => `${k}=${localStorage.getItem(k)}`),
  }));
  console.log('after signIn:', JSON.stringify(state, null, 1));
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /atlas|universe/i.test(b.textContent || ''));
    btn && btn.click();
  });
  await wait(600);

  const onAtlas = await page.evaluate(() => Boolean(document.querySelector('#knowledge-atlas')));
  if (!onAtlas) {
    const where = await page.evaluate(() => ({
      headings: [...document.querySelectorAll('h1,h2')].map((e) => e.textContent.trim()).slice(0, 5),
      buttons: [...document.querySelectorAll('button')].map((e) => e.textContent.trim()).filter(Boolean).slice(0, 16),
      dialog: document.querySelector('[role="dialog"]')?.innerText.replace(/\s+/g, ' ').slice(0, 200) || null,
    }));
    console.log('NOT ON ATLAS:', JSON.stringify(where, null, 1));
  }
  console.log(`reached atlas: ${onAtlas}`);

  const structure = await page.evaluate(() => {
    const fields = [...document.querySelectorAll('.uh-field-button')].map((b) => b.getAttribute('aria-label'));
    return { fields };
  });

  const rows = [];
  for (const field of structure.fields) {
    await page.evaluate((label) => {
      const btn = [...document.querySelectorAll('.uh-field-button')]
        .find((b) => b.getAttribute('aria-label') === label);
      btn && btn.click();
    }, field);
    await wait(250);

    const disciplines = await page.evaluate(() =>
      [...document.querySelectorAll('.uh-discipline-card')].map((card) =>
        card.querySelector('.uh-discipline-trigger').innerText.replace(/\n/g, ' ').trim()));

    for (const discipline of disciplines) {
      await page.evaluate((dname) => {
        const card = [...document.querySelectorAll('.uh-discipline-card')]
          .find((c) => c.querySelector('.uh-discipline-trigger').innerText.includes(dname));
        card && card.querySelector('.uh-discipline-trigger').click();
      }, discipline.split(' ')[0]);
      await wait(250);

      // Open the first subfield of that discipline so a topic grid exists.
      await page.evaluate(() => {
        const m = document.querySelector('.uh-discipline-card.active .uh-module-trigger');
        m && m.click();
      });
      await wait(200);

      const probe = await page.evaluate(() => {
        const grid = document.querySelector('.uh-topic-grid');
        if (!grid) return { verdict: 'no topic grid rendered' };
        const topicBtn = grid.querySelector('button');
        if (!topicBtn) return { verdict: 'topic grid present but empty' };
        const topic = topicBtn.textContent.trim();
        const beforeText = document.body.innerText;
        topicBtn.click();
        const afterText = document.body.innerText;
        const previewHeading = document.querySelector('.uh-topic-preview h2')?.textContent?.trim();
        const learnButton = [...document.querySelectorAll('.uh-topic-preview button')]
          .map((b) => b.textContent.trim())[0];
        return {
          topic,
          previewUpdated: previewHeading === topic,
          pageChanged: beforeText !== afterText,
          learnButton: learnButton || 'none',
          modalOpen: Boolean(document.querySelector('[role="dialog"]')),
        };
      });

      let opened = 'not tried';
      if (probe.previewUpdated) {
        opened = await page.evaluate(async () => {
          const btn = document.querySelector('.uh-topic-preview button');
          if (!btn) return 'no call to action';
          const label = btn.textContent.trim();
          btn.click();
          await new Promise((r) => setTimeout(r, 600));
          const h1 = document.querySelector('h1, h2')?.textContent?.trim() || '';
          const lessonBody = document.querySelector('.lesson-reader, .lr-reader, [data-testid="lesson"]');
          return `${label} -> heading "${h1.slice(0, 50)}" lessonPanel=${Boolean(lessonBody)}`;
        });
        await page.evaluate(() => {
          const btn = [...document.querySelectorAll('button')].find((b) => /atlas|universe/i.test(b.textContent || ''));
          btn && btn.click();
        });
        await wait(500);
      }

      rows.push({ field, discipline, ...probe, opened });
    }
  }

  console.log('\nfield / discipline'.padEnd(42), 'topic'.padEnd(24), 'result');
  console.log('-'.repeat(120));
  rows.forEach((r) => {
    const verdict = r.verdict || (r.previewUpdated
      ? (r.modalOpen ? 'preview + opened overlay' : 'preview only, no content')
      : 'no reaction');
    console.log(`${(r.field + ' / ' + r.discipline).padEnd(42)} ${(r.topic || '-').padEnd(24)} ${verdict}`);
  });
  console.log(`\ndiscipline probes: ${rows.length}`);
  console.log(`sample CTA outcome: ${rows.find((r) => r.opened !== 'not tried')?.opened}`);
  console.log(`console errors: ${consoleErrors.length}`);
  consoleErrors.slice(0, 8).forEach((e) => console.log('  !', e.slice(0, 160)));

  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
