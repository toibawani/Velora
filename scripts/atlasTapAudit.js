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

  // The field tabs, which is what replaced .uh-field-button.
  const fields = await page.evaluate(() =>
    [...document.querySelectorAll('.aix-tab')].map((b) => ({
      label: b.querySelector('.aix-tab-name')?.textContent.trim() || b.textContent.trim(),
      aria: b.getAttribute('aria-label'),
    }))
  );

  const rows = [];
  for (const field of fields) {
    await page.evaluate((name) => {
      const tab = [...document.querySelectorAll('.aix-tab')]
        .find((b) => (b.querySelector('.aix-tab-name')?.textContent.trim() || b.textContent.trim()) === name);
      tab && tab.click();
    }, field.label);
    await wait(300);

    // The atlas was redesigned and this script was never updated with it.
    //
    // It looked for .uh-field-button, .uh-discipline-card, .uh-module-trigger and
    // .uh-topic-grid. None of those exist any more: fields are .aix-tab buttons,
    // disciplines are .aix-group sections, and topics are .aix-entry rows with no
    // grid and no separate module control. So `fields` came back empty, the loop
    // never ran, the table printed with no rows, and the script exited 0. It had
    // been reporting a clean pass over an atlas it never touched, and it is not
    // in CI, so nothing ever contradicted it.
    const structure = await page.evaluate(() => {
      const groups = [...document.querySelectorAll('.aix-group')];
      return {
        disciplineCount: groups.length,
        disciplineNames: groups.map((g) => g.querySelector('.aix-group-title')?.textContent.trim() || '?'),
        topicCount: document.querySelectorAll('.aix-entry').length,
      };
    });

    // Probe one topic per discipline, which is what the header claims.
    //
    // It probes the first *written* topic in each discipline, not the first
    // topic. The first topic in most groups is "not written yet" - that is what
    // the marker is for - and an unwritten topic has no call to action to
    // press, so probing it says nothing about whether the atlas works.
    const openField = async () => {
      await page.evaluate((name) => {
        const tab = [...document.querySelectorAll('.aix-tab')]
          .find((b) => (b.querySelector('.aix-tab-name')?.textContent.trim() || b.textContent.trim()) === name);
        tab && tab.click();
      }, field.label);
      await wait(320);
    };

    for (let d = 0; d < structure.disciplineCount; d++) {
      // Re-select the field every time.
      //
      // Opening a lesson navigates away from the atlas, and coming back lands on
      // the *first* field, not the one being probed. Without this, group index
      // 6 of a later field silently indexed into the first field's groups: the
      // table said "Philosophy / Philosophical Traditions -> Atomic Structure",
      // which is a Science topic. Two real disciplines were then reported as
      // having no topics at all, because the probe was looking in the wrong
      // field entirely.
      await openField();

      const picked = await page.evaluate((idx) => {
        const g = document.querySelectorAll('.aix-group')[idx];
        if (!g) return null;
        const entries = [...g.querySelectorAll('.aix-entry')];
        const target = entries.find((e) => !/unwritten/.test(e.className)) || entries[0];
        if (!target) return null;
        // The entry's own text is the topic plus its status marker, so read the
        // topic out of the span rather than the whole button.
        const topic = target.querySelector('.aix-entry-text')?.textContent.trim();
        target.click();
        return { topic, written: !/unwritten/.test(target.className) };
      }, d);
      if (!picked) {
        rows.push({ field: field.label, discipline: structure.disciplineNames[d], verdict: 'discipline has no topics' });
        continue;
      }
      await wait(300);

      const probe = await page.evaluate((topic) => {
        // Every topic must be addressable: selecting it should name it in the
        // preview panel, whether it has a lesson behind it or not.
        const preview = document.querySelector('.uh-topic-preview')?.innerText || '';
        const heading = document.querySelector('.uh-topic-preview h2')?.textContent?.trim();
        return {
          selected: document.querySelector('.aix-entry[aria-current="true"]') ? true : false,
          // Compare against the h2 rather than the whole panel text: the panel
          // also prints the status sentence, so a substring test on its innerText
          // can be satisfied or broken by wording that has nothing to do with
          // which topic is selected.
          previewUpdated: heading === topic,
          previewHeading: heading,
          previewText: preview.replace(/\s+/g, ' ').slice(0, 90),
        };
      }, picked.topic);

      // Press the call to action on a written topic and see what opens.
      let opened = 'skipped (topic is not written)';
      if (picked.written) {
        opened = await page.evaluate(async () => {
          const btn = document.querySelector('.uh-topic-preview button');
          if (!btn) return 'NO CALL TO ACTION RENDERED';
          const label = btn.textContent.trim();
          btn.click();
          await new Promise((r) => setTimeout(r, 900));
          const reader = document.querySelector('.lesson-reader, .bhm-pager, .lr-reader, [data-testid="lesson"]');
          return `${label} -> ${reader ? 'content opened' : 'NOTHING OPENED'}`;
        });
        await page.evaluate(() => {
          const b = [...document.querySelectorAll('button')].find((x) => /atlas|home/i.test(x.textContent || ''));
          b && b.click();
        });
        await wait(700);
      }

      rows.push({ field: field.label, discipline: structure.disciplineNames[d], topic: picked.topic, ...probe, opened });
    }
  }

  console.log('\nfield / discipline'.padEnd(42), 'topic'.padEnd(24), 'result');
  console.log('-'.repeat(120));
  rows.forEach((r) => {
    // The verdict used to be derived from `modalOpen`, a field this script no
    // longer sets, so every working row read "preview only, no content" - the
    // same words a genuinely broken row would produce. The outcome is now the
    // thing that actually opened, so a dead call to action is distinguishable
    // from a topic that simply has nothing behind it.
    const verdict = r.verdict
      || (!r.previewUpdated ? 'selecting the topic did not update the preview'
      : r.opened.startsWith('skipped') ? 'listed, nothing written (expected)'
      : r.opened.includes('NOTHING OPENED') ? 'PREVIEW SHOWN BUT CTA OPENED NOTHING'
      : r.opened.includes('NO CALL TO ACTION') ? 'written topic has no call to action'
      : 'preview + content opened');
    console.log(`${(r.field + ' / ' + r.discipline).padEnd(42)} ${(r.topic || '-').padEnd(24)} ${verdict}`);
  });

  /*
   * This script reports and never blocks, and that is the defect.
   *
   * It walks every field and discipline - the only audit here that does - and
   * then prints its findings and exits 0 whatever it found. A topic that renders
   * nothing, a discipline with no topic grid, a whole field of dead buttons:
   * all of it is printed, none of it fails anything. It is not in CI and not in
   * package.json, so nobody was ever shown the output either.
   *
   * Two checks are asserted, because both are the difference between "the
   * audit ran" and "the audit proved anything":
   *
   *  1. It reached the atlas at all. If sign-in or navigation fails, `rows` is
   *     empty, the table is blank, and the script still exits 0.
   *  2. Every discipline produced a live topic. `no reaction` and `no topic
   *     grid rendered` are dead topics - the exact thing the header says the
   *     script exists to find out about - and they used to be a row in a table
   *     rather than an exit code.
   *
   * Console errors are a failure too: a screen that throws is broken whether or
   * not its text happens to render.
   */
  const dead = rows.filter((r) =>
    r.verdict
    || !r.previewUpdated
    || r.opened.includes('NOTHING OPENED')
    || r.opened.includes('NO CALL TO ACTION')
  );
  if (!onAtlas) {
    console.error('\nnever reached the atlas; nothing was probed');
    await browser.close();
    server.close();
    process.exit(1);
  }
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
