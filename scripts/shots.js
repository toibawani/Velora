/**
 * Screenshot the running app at 1440 and 375 for visual review.
 *
 * jsdom cannot render, so "what does this screen actually look like" is a
 * question only a real browser can answer. This walks the same sign-in flow as
 * layoutCheck.js (real form, no faked session) and captures the screens the
 * redesign stages touch, so every stage can be compared against the one before
 * it instead of being judged from memory.
 *
 * Usage: node scripts/shots.js [--url http://localhost:3000] [--out .freebuff/shots]
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { requireChrome } = require('./chrome');

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
};

const URL = arg('--url', 'http://localhost:3000');
const OUT = path.resolve(arg('--out', path.join('.freebuff', 'shots')));

/** Same entry flow as layoutCheck.js: seed local state, then the real forms. */
const signIn = async (page) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  // The five-step tour overlays every screen until it is dismissed, and its
  // dismissal writes this exact key. Seeding it (the same way layoutCheck.js
  // seeds its data) means screenshots show the app rather than step one of
  // onboarding, which is what the first run of this script captured for all
  // twelve shots.
  await page.evaluate(() => {
    localStorage.setItem('velora_onboarding_done', '1');
  });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('button', { timeout: 30000 });
  for (let i = 0; i < 20; i += 1) {
    const moved = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button, a')].find((x) =>
        /start learning|look around|begin your exploration/i.test(x.textContent.trim())
      );
      if (!b) return false;
      b.click();
      return true;
    });
    if (moved) break;
    await new Promise((r) => setTimeout(r, 400));
  }
  await page.waitForSelector('#profile-name', { timeout: 30000 });
  await page.type('#profile-name', 'Ada Lovelace');
  await page.click('button[type="submit"]');
  const interests = await page.$('.subject-selection-grid');
  if (interests) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[type="submit"]')].pop();
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 800));
  }
  await page.waitForSelector('.mobile-bottom-nav button', { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
};

const clickNav = (page, text) =>
  page.evaluate((t) => {
    const bars = [...document.querySelectorAll('.mobile-bottom-nav')];
    const target = bars.flatMap((bar) => [...bar.querySelectorAll('button, a')])
      .find((b) => b.textContent.trim() === t);
    if (!target) return false;
    target.click();
    return true;
  }, text);

const settle = (ms = 900) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  const chromePath = requireChrome();
  if (!chromePath) {
    console.error('No Chrome binary found. Set CHROME_PATH.');
    process.exit(2);
  }
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  for (const width of [1440, 375]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

    await signIn(page);

    const shot = async (name) => {
      await settle();
      const file = path.join(OUT, `${width}-${name}.png`);
      await page.screenshot({ path: file });
      console.log(`wrote ${file}`);
    };

    await shot('home');
    await clickNav(page, 'Learn'); await shot('learn');
    await clickNav(page, 'Dictionary'); await shot('dictionary');
    // The bottom bar calls the games screen "Flow" (navigation.js label); an
    // earlier version of this script asked for "Games", got false, and quietly
    // screenshotted the Dictionary twice.
    await clickNav(page, 'Flow'); await shot('games');

    // The Atlas index lives on Home; scroll it into view for a dedicated shot.
    await clickNav(page, 'Atlas');
    await page.evaluate(() => {
      document.getElementById('knowledge-atlas')?.scrollIntoView();
    });
    await shot('atlas-index');

    // A lesson reader, reached through Learn -> first module topic.
    await clickNav(page, 'Learn');
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('button')].find((b) => /Motion/.test(b.textContent));
      if (t) t.click();
    });
    await settle();
    await page.evaluate(() => {
      const t = [...document.querySelectorAll('button')].find((b) => /Read the lesson|Open/i.test(b.textContent));
      if (t) t.click();
    });
    await shot('lesson');

    if (errors.length) {
      console.error(`console errors at ${width}px:`);
      errors.forEach((e) => console.error(`  ${e}`));
      process.exitCode = 1;
    }
    await page.close();
  }
  await browser.close();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
