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
  const server = await serve(ROOT);
  const port = server.address().port;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 800 });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await signIn(page, port);

  // Reach the black hole masterclass through the Atlas, the new path.
  await page.type('#curriculum-search', 'Black Holes', { delay: 15 });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    [...document.querySelectorAll('.uh-search-results button')][0]?.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => document.querySelector('.uh-topic-preview button')?.click());
  await new Promise(r => setTimeout(r, 900));
  console.log('viewport 375px');
  console.log('reached masterclass:', await page.evaluate(() => Boolean(document.querySelector('.bhm-pager'))));

  const total = await page.evaluate(() => {
    return document.querySelectorAll('.bhm-rail-item').length;
  });
  console.log('level buttons in rail:', total);

  // Click each level in turn and confirm it renders real content.
  let bad = 0;
  for (let i = 0; i < total; i++) {
    const r = await page.evaluate((idx) => {
      const btn = document.querySelectorAll('.bhm-rail-item')[idx];
      if (!btn) return null;
      const label = btn.textContent.trim().replace(/\s+/g, ' ');
      btn.click();
      return label;
    }, i);
    if (!r) continue;
    await new Promise(res => setTimeout(res, 450));
    const info = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      const text = main.innerText.replace(/\s+/g, ' ');
      const entries = document.querySelectorAll('.gt-trigger').length;
      return { chars: text.length, entries, head: text.slice(0, 70) };
    });
    const ok = info.chars > 200;
    if (!ok) bad++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${r.padEnd(42)} ${String(info.chars).padStart(6)} chars, ${info.entries} glossary terms`);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('horizontal overflow at 375:', overflow);
  console.log('\nempty levels:', bad);
  console.log('console errors:', errors.length);
  errors.slice(0,5).forEach(e => console.log(' !', e.slice(0,140)));
  await browser.close(); server.close();
  process.exit(bad || errors.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
