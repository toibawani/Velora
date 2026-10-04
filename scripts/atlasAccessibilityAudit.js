/**
 * Atlas accessibility audit: two things the index claims and used not to do.
 *
 * 1. The search field's label is visually hidden but still announced. The class
 *    it uses is .sr-only, and this project does not use Tailwind, so the rule has
 *    to exist in design-tokens.css. When it went missing the label rendered as
 *    visible duplicate text above the search box, and the index printed its
 *    status marker twice on all 188 lines. Nothing failed loudly: the page still
 *    rendered, just wrong. jsdom cannot catch this - it applies no stylesheet -
 *    so this drives real Chrome and reads computed geometry.
 *
 * 2. No index line renders as a filled pill. index.css sets a global button rule
 *    with !important, and it has twice beaten the component styles meant to
 *    override it. The atlas resets it explicitly; this checks the result rather
 *    than the intent, because the whole failure mode is a stylesheet that is
 *    correct on the page and overruled in the browser.
 *
 * Usage: node scripts/atlasAccessibilityAudit.js
 * Exits non-zero on a regression, so this can sit in the layout job in CI.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..', 'build');
const CHROME =
  process.env.CHROME_PATH ||
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium'].find((p) =>
    fs.existsSync(p)
  );

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.ico': 'image/x-icon',
};

const WIDTHS = [1440, 375];

const serve = (root) =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(fs.readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const signIn = async (page, port) => {
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('velora_onboarding_done', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('button', { timeout: 20000 });
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (await page.$('#profile-name')) break;
    const moved = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button, a')].find((x) =>
        /start learning|look around|begin your exploration/i.test(x.textContent.trim())
      );
      if (!b) return false;
      b.click();
      return true;
    });
    await wait(moved ? 600 : 400);
  }
  await page.waitForSelector('#profile-name', { timeout: 20000 });
  await page.type('#profile-name', 'Ada Lovelace');
  await page.click('button[type="submit"]');
  await wait(900);
  const interests = await page.$('.subject-selection-grid');
  if (interests) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[type="submit"]')].pop();
      b && b.click();
    });
    await wait(900);
  }
  await page.waitForSelector('.aix-entry', { timeout: 20000 });
  await wait(600);
};

(async () => {
  if (!CHROME) {
    console.error('No Chrome found. Set CHROME_PATH.');
    process.exit(2);
  }
  const server = await serve(ROOT);
  const port = server.address().port;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

  let failures = 0;
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 1000 });
    const errors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    await signIn(page, port);

    const report = await page.evaluate(() => {
      const label = document.querySelector('label.sr-only');
      const input = document.querySelector('#curriculum-search');
      const rect = label ? label.getBoundingClientRect() : null;
      const style = label ? getComputedStyle(label) : null;
      // The accent in either theme. An index line still wearing it is a pill.
      const accent = /rgb\(\s*(140,\s*74,\s*47|217,\s*142,\s*99)/i;
      const controls = [...document.querySelectorAll('.aix-entry, .aix-tab')];
      const filled = controls.filter((c) => accent.test(getComputedStyle(c).backgroundColor));
      return {
        label: {
          found: Boolean(label),
          // Not display:none - that would take it out of the accessibility tree
          // too. Clipped to nothing, so a screen reader still announces it.
          display: style ? style.display : null,
          hiddenByClipping: Boolean(style && style.clip && style.clip !== 'auto'),
          size: rect ? `${Math.round(rect.width)}x${Math.round(rect.height)}` : null,
          associated: Boolean(label && input && label.htmlFor === input.id),
          text: label ? label.textContent.trim() : null,
        },
        index: {
          controls: controls.length,
          filledWithAccent: filled.length,
        },
      };
    });

    console.log(`\n${width}px`);
    console.log(`  search label: ${JSON.stringify(report.label)}`);
    console.log(`  index: ${JSON.stringify(report.index)}`);

    if (!report.label.found) {
      console.error('  FAIL no .sr-only label found - the rule may have been deleted');
      failures += 1;
    } else {
      // display:none and clipping are different failures. One hides the label
      // and takes it out of the accessibility tree with it, so a screen reader
      // reads nothing; the other hides it and keeps it. Only the second is right.
      if (report.label.display === 'none') {
        console.error('  FAIL the search label is display:none, which removes it from the accessibility tree too');
        failures += 1;
      } else if (!report.label.hiddenByClipping) {
        console.error('  FAIL the search label is not clipped away; a duplicate is visible above the box');
        failures += 1;
      }
      if (!report.label.associated) {
        console.error('  FAIL the search label is not associated with the search input');
        failures += 1;
      }
      if (report.label.size !== '1x1') {
        console.error(`  FAIL the search label occupies ${report.label.size}; expected 1x1`);
        failures += 1;
      }
    }
    if (report.index.filledWithAccent > 0) {
      console.error(`  FAIL ${report.index.filledWithAccent} index control(s) render as accent pills`);
      failures += 1;
    }
    if (errors.length) {
      console.error(`  FAIL ${errors.length} console error(s)`);
      errors.slice(0, 3).forEach((e) => console.error(`    ${e.slice(0, 160)}`));
      failures += 1;
    }
    await page.close();
  }

  await browser.close();
  server.close();

  if (failures) {
    console.error(`\natlas accessibility audit: ${failures} failure(s)`);
    process.exit(1);
  }
  console.log('\natlas accessibility audit passed: label hidden but announced, index is text, no console errors');
})().catch((e) => {
  console.error(e);
  process.exit(2);
});