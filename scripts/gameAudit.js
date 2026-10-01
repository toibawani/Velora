/**
 * Plays every game end to end in real Chrome against the built app, and reports
 * what is actually reachable: which questions render, whether a wrong answer
 * gives feedback, what the score line claims, and whether the round terminates.
 *
 * The point is to find stubs. A file called ConceptScrabble.js proves nothing
 * about whether the game can be played, so this clicks the way a person does
 * and reports what came back.
 *
 * Usage: node scripts/gameAudit.js
 * Exits 0 always: this is a report, not a gate.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const puppeteer = require('puppeteer-core');

const PORT = Number(process.env.PORT || 4175);

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};

const serve = (root) =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(root, urlPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(root, 'index.html');
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
      });
      res.end(fs.readFileSync(filePath));
    });
    server.listen(PORT, () => resolve(server));
  });

const findChrome = () =>
  [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ]
    .filter(Boolean)
    .find((p) => fs.existsSync(p));

const signIn = async (page, url) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('velora_onboarding_done', 'true');
  });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('button');
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (await page.$('#profile-name')) break;
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button, a')].find((x) =>
        /start learning|look around|begin your exploration/i.test(x.textContent.trim())
      );
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 500));
  }
  await page.type('#profile-name', 'Ada Lovelace');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 700));
  if (await page.$('.subject-selection-grid')) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[type="submit"]')].pop();
      if (b) b.click();
    });
  }
  await page.waitForFunction(() => document.querySelectorAll('nav').length > 0);
  await new Promise((r) => setTimeout(r, 800));
};

const clickByText = (page, text) =>
  page.evaluate((t) => {
    const target = [...document.querySelectorAll('.mobile-bottom-nav button')].find(
      (b) => b.textContent.trim() === t
    );
    if (!target) return false;
    target.click();
    return true;
  }, text);

/** Everything a screen currently shows, trimmed for the report. */
const snapshot = (page) =>
  page.evaluate(() => {
    const text = document.body.innerText.replace(/\n{2,}/g, '\n').trim();
    return {
      text: text.slice(0, 700),
      buttons: [...document.querySelectorAll('button')]
        .map((b) => b.textContent.trim())
        .filter(Boolean)
        .slice(0, 25),
      inputs: [...document.querySelectorAll('input, select, textarea')].map((i) => ({
        tag: i.tagName.toLowerCase(),
        type: i.type,
        placeholder: i.placeholder || '',
        label: i.getAttribute('aria-label') || '',
      })),
    };
  });

const audit = [];

const record = (name, data) => {
  audit.push({ name, ...data });
  console.log(`\n=== ${name}`);
  console.log(JSON.stringify(data, null, 1));
};

const playConnect = async (page) => {
  const first = await snapshot(page);
  // Answer the question by clicking an option, then read the feedback.
  await page.evaluate(() => {
    const opts = [...document.querySelectorAll('button')].filter((b) =>
      /bg-connect-option|bg-option|option/.test(b.className)
    );
    if (opts[0]) opts[0].click();
  });
  await new Promise((r) => setTimeout(r, 500));
  const answered = await snapshot(page);
  const advanced = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /next/i.test(x.textContent));
    if (!b) return false;
    b.click();
    return true;
  });
  await new Promise((r) => setTimeout(r, 500));
  return { first, answered, advanced };
};

const playMyth = async (page) => {
  const first = await snapshot(page);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /it.?s a myth|it.?s true/i.test(x.textContent));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  const answered = await snapshot(page);
  return { first, answered };
};

const playExplain = async (page) => {
  const seen = [];
  for (let i = 0; i < 4; i++) {
    const label = await page.evaluate(() => {
      const h = [...document.querySelectorAll('h3')].find(x => /Explain It Back/.test(x.textContent));
      return h ? h.textContent.trim() : 'NONE';
    });
    seen.push(label);
    {
      await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /start 30s timer/i.test(x.textContent)); if (b) b.click(); });
      await new Promise(r => setTimeout(r, 500));
      await page.type('textarea', 'momentum is how hard something is to stop and a heavy thing moving slowly still has lots of it');
      await new Promise(r => setTimeout(r, 300));
      await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /submit explanation/i.test(x.textContent)); if (b) b.click(); });
      await new Promise(r => setTimeout(r, 600));
    }
    const hasNext = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find(x => /next concept sprint/i.test(x.textContent));
      if (!b) return false;
      b.click();
      return true;
    });
    if (!hasNext) break;
    await new Promise(r => setTimeout(r, 700));
  }
  return { promptsSeen: seen };
};

const main = async () => {
  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) {
    console.error('build/ not found. Run npm run build first.');
    process.exit(2);
  }
  const server = await serve(buildDir);
  const url = `http://localhost:${PORT}`;
  const chromePath = findChrome();
  if (!chromePath) {
    console.error('No Chrome binary found. Set CHROME_PATH.');
    process.exit(2);
  }
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

  await signIn(page, url);
  await clickByText(page, 'Flow');
  await new Promise((r) => setTimeout(r, 900));

  record('hub', await snapshot(page));

  // Brain Games tab, then each of the three games.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /brain games/i.test(x.textContent));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 700));

  for (const [label, play] of [
    ['Connect the Concept', playConnect],
    ['Counterintuitive (True/Myth)', playMyth],
    ['Explain It Back (30s Sprint)', playExplain],
  ]) {
    const ok = await page.evaluate((t) => {
      const b = [...document.querySelectorAll('[role="tab"]')].find((x) => x.textContent.includes(t));
      if (!b) return false;
      b.click();
      return true;
    }, label);
    await new Promise((r) => setTimeout(r, 700));
    if (!ok) {
      record(label, { error: 'tab not found' });
      continue;
    }
    record(label, await play(page));
  }

  record('console-errors', consoleErrors);

  await browser.close();
  server.close();
  console.log('\n--- report only; exits 0 ---');
};

main().catch((err) => {
  console.error(err);
  process.exit(2);
});