// Scripts/layoutCheck.js
//
// Horizontal-overflow regression check against the BUILT app.
//
// jsdom has no layout engine, so an element wider than the viewport is invisible
// to Jest: the "responsive overflow" in this repo was an artifact of a test
// harness, and the production build once shipped broken while 291 tests passed.
// This drives real Chrome against build/ via puppeteer-core, signs in through the
// real form, walks every screen by clicking, and reports scrollWidth vs
// clientWidth at 1440 and 375.
//
// Usage: node scripts/layoutCheck.js [--url http://localhost:4173]
// Exits non-zero on overflow or console error so CI fails.

const fs = require('fs');
const path = require('path');
const http = require('http');

const puppeteer = require('puppeteer-core');

const WIDTHS = [1440, 375];
const PORT = Number(process.env.PORT || 4173);

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const findChrome = () => CHROME_PATHS.find((p) => fs.existsSync(p));

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
};

const serve = (root) =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(root, urlPath);
      if (!filePath.startsWith(root)) {
        res.writeHead(403).end();
        return;
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(root, 'index.html'); // SPA fallback
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
      });
      res.end(fs.readFileSync(filePath));
    });
    server.listen(PORT, () => resolve(server));
  });

// Representative device-local data. Without these, Community and Insights
// render empty states, which is exactly where the white-card collision lived.
const SEED = {
  velora_onboarding_done: 'true',
  velora_question_desk: JSON.stringify([
    {
      id: 'q-seed-1',
      question:
        'If the observable universe is expanding, does that mean space itself is expanding into something else?',
      subject: 'physics',
      topicId: 'hubble-law',
      createdAt: '2026-01-04T10:00:00.000Z',
      notes: [
        {
          id: 'n-seed-1',
          text: 'Expansion is of distances between comoving observers, not of space into a container.',
          createdAt: '2026-01-04T10:05:00.000Z',
        },
      ],
    },
    {
      id: 'q-seed-2',
      question: 'Did Nietzsche mean the death of God descriptively, or did he mean Christians should stop believing?',
      subject: 'philosophy',
      topicId: 'nietzsche',
      createdAt: '2026-01-05T18:30:00.000Z',
      notes: [],
    },
    {
      id: 'q-seed-3',
      question: 'Why did the Treaty of Versailles fail to hold Europe together within a generation?',
      subject: 'history',
      topicId: 'treaty-of-versailles',
      createdAt: '2026-01-06T09:15:00.000Z',
      notes: [],
    },
  ]),
  velora_learning_analytics: JSON.stringify({ totalHoursStudied: 12.5, topicsCompleted: 9, streak: 4 }),
  velora_reviews: JSON.stringify([
    { topicId: 'hubble-law', due: '2026-01-01', ease: 2.5 },
    { topicId: 'nietzsche', due: '2026-01-02', ease: 2.1 },
  ]),
  velora_revision_schedule: JSON.stringify([{ topicId: 'hubble-law', due: '2026-01-01' }]),
  velora_events: JSON.stringify(
    Array.from({ length: 24 }, (_, i) => ({
      type: 'lesson_complete',
      topicId: `topic-${i}`,
      timestamp: new Date(Date.UTC(2026, 0, 1 + i)).toISOString(),
    }))
  ),
};

// Detection is per-element, not document scrollWidth.
//
// html and body carry `overflow-x: clip` (App.css), so scrollWidth is pinned to
// clientWidth no matter how far an element sticks out: an injected 5000px div
// still measured 0px overflow. A test that can only ever pass is worse than no
// test, so this reports every element whose border box crosses the right edge
// and is not inside a clipping ancestor.
const measure = (page) =>
  page.evaluate(() => {
    const de = document.documentElement;
    const limit = de.clientWidth;
    // A genuinely scrollable ancestor (auto/scroll) is an intentional overflow
    // region such as a carousel. `hidden`/`clip` is not: an element clipped by
    // html/body overflow-x: clip is content the user can never reach, which is
    // the defect this check exists to catch.
    const inScrollRegion = (el) => {
      for (let p = el.parentElement; p && p !== de; p = p.parentElement) {
        const ox = window.getComputedStyle(p).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
      }
      return false;
    };
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.right <= limit + 1) continue;
      const style = window.getComputedStyle(el);
      // A closed drawer parked off-canvas is not overflow the user can reach.
      if (style.position === 'fixed' && style.visibility === 'hidden') continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      if (inScrollRegion(el)) continue;
      const cls =
        el.className && el.className.baseVal !== undefined
          ? el.className.baseVal
          : String(el.className || '');
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: cls.slice(0, 60),
        right: Math.round(rect.right),
        limit,
      });
    }
    return {
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      offenders: offenders.slice(0, 8),
    };
  });

// Scope to the bottom bar: the drawer contains similar labels, and 'Learn' also
// appears on Home as a heading button.
const clickByText = async (page, text) =>
  page.evaluate((t) => {
    const bars = [...document.querySelectorAll('.mobile-bottom-nav')];
    const target = bars
      .flatMap((bar) => [...bar.querySelectorAll('button, a')])
      .find((b) => b.textContent.trim() === t);
    if (!target) return false;
    target.click();
    return true;
  }, text);

// The screens this walks come from src/navigation.js, split by how they are
// reached: primary ones sit in the bottom bar, the rest are opened through the
// drawer. It used to visit a hardcoded five, which is how this check went on
// reporting a pass for six of the seven screens in the app - Dictionary and
// Journey were never measured at either width.
const readRegistry = () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'navigation.js'), 'utf8');
  const body = source.slice(source.indexOf('export const SCREENS = ['));
  return [...body.matchAll(
    /id:\s*'([a-z-]+)',[\s\S]*?label:\s*'([^']+)',[\s\S]*?drawerLabel:\s*'([^']+)',[\s\S]*?primary:\s*(true|false),/g
  )].map(([, id, label, drawerLabel, primary]) => ({ id, label, drawerLabel, primary: primary === 'true' }));
};

const REGISTRY = readRegistry();

if (REGISTRY.length < 7) {
  console.error(
    `navigation.js parsed as ${REGISTRY.length} screens, expected at least 7. The parser is out of date, not the app.`
  );
  process.exit(2);
}

const SCREENS = [
  ...REGISTRY.filter((screen) => screen.primary).map((screen) => ({ name: screen.label, label: screen.label })),
  ...REGISTRY.filter((screen) => !screen.primary).map((screen) => ({ name: screen.drawerLabel, label: screen.drawerLabel, drawer: true })),
];

// Opens the drawer and clicks a drawer item. The drawer closes on navigation, so
// each drawer screen is reached by the same two clicks a person makes.
const clickDrawerItem = async (page, text) => {
  await page.evaluate(() => {
    const toggle = document.querySelector('.mobile-nav-toggle');
    if (toggle) toggle.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const ok = await page.evaluate((t) => {
    const target = [...document.querySelectorAll('.mobile-nav-item')].find(
      (b) => b.textContent.trim() === t
    );
    if (!target) return false;
    target.click();
    return true;
  }, text);
  await new Promise((r) => setTimeout(r, 700));
  return ok;
};

const signIn = async (page, url) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.evaluate((seed) => {
    for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, v);
  }, SEED);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('button', { timeout: 20000 });

  // Walk splash -> landing -> profile by clicking whatever the screen offers.
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
    if (!moved) await new Promise((r) => setTimeout(r, 400));
    else await new Promise((r) => setTimeout(r, 600));
  }
  // There is no session to fake: type a name into the real field and submit.
  await page.waitForSelector('#profile-name', { timeout: 20000 });
  await page.type('#profile-name', 'Ada Lovelace');
  await page.click('button[type="submit"]');
  // Step two asks what you are here for. Submit it for real as well.
  const interests = await page.$('.subject-selection-grid');
  if (interests) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[type="submit"]')].pop();
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 800));
  }
  await page.waitForFunction(() => document.querySelectorAll('nav').length > 0, {
    timeout: 20000,
  });
  // The bottom bar renders a tick after the first nav appears; without this
  // settle the very first click lands on a bar that is not mounted yet and the
  // run reports every screen as unreachable.
  await page.waitForSelector('.mobile-bottom-nav button', { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1000));
};

const main = async () => {
  const urlArg = process.argv.indexOf('--url');
  const chromePath = findChrome();
  if (!chromePath) {
    console.error('No Chrome binary found. Set CHROME_PATH.');
    process.exit(2);
  }

  let server = null;
  let url = `http://localhost:${PORT}`;
  if (urlArg === -1) {
    const buildDir = path.join(__dirname, '..', 'build');
    if (!fs.existsSync(buildDir)) {
      console.error('build/ not found. Run npm run build first.');
      process.exit(2);
    }
    server = await serve(buildDir);
  } else {
    url = process.argv[urlArg + 1];
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const failures = [];
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

    await signIn(page, url);

    for (const screen of SCREENS) {
      const opened = screen.drawer
        ? await clickDrawerItem(page, screen.label)
        : await clickByText(page, screen.label);
      if (!opened) {
        failures.push({ width, screen: screen.name, reason: 'nav item not found' });
        continue;
      }
      await new Promise((r) => setTimeout(r, 800));
      const m = await measure(page);
      const overflow = m.scrollWidth - m.clientWidth;
      console.log(
        `${width}px ${screen.name.padEnd(10)} scrollWidth=${m.scrollWidth} clientWidth=${m.clientWidth} offenders=${m.offenders.length}`
      );
      if (overflow > 1 || m.offenders.length) {
        failures.push({
          width,
          screen: screen.name,
          reason: `${m.offenders.length} element(s) past the right edge, scrollWidth overflow ${overflow}px`,
          offenders: m.offenders,
        });
      }
    }

    for (const e of consoleErrors.slice(0, 5)) {
      failures.push({ width, screen: 'console', reason: e });
    }
    await page.close();
  }

  await browser.close();
  if (server) server.close();

  if (failures.length) {
    console.error('\nFAILURES:');
    for (const f of failures) console.error(JSON.stringify(f));
    process.exit(1);
  }
  console.log('\nlayout check passed: no horizontal overflow, no console errors');
};

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
