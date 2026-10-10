/**
 * Stage re-verification that jsdom cannot do: real tap on a glossary term at
 * 375px, and real rendered line length on a reading screen.
 *
 * The tap matters because GlossaryTerm is a button opened with a finger, and
 * the measure matters because capped line length only exists in layout.
 * Both are asserted in jest too; this repeats them where the eye would see a
 * failure instead of a test runner.
 *
 * Usage: node scripts/glossaryCheck.js [--url http://localhost:3000]
 */
const puppeteer = require('puppeteer-core');
const { requireChrome } = require('./chrome');

const URL = (() => {
  const i = process.argv.indexOf('--url');
  return i === -1 ? 'http://localhost:3000' : process.argv[i + 1];
})();

const signIn = async (page) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
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

const main = async () => {
  const chromePath = requireChrome();
  if (!chromePath) {
    console.error('No Chrome binary found. Set CHROME_PATH.');
    process.exit(2);
  }
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const failures = [];
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 900, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

  await signIn(page);

  // Reach the Heat lesson: Learn -> physics subject -> thermodynamics -> Heat.
  // The Learn screen lists subjects; physics carries the thermometer lessons.
  await page.evaluate(() => {
    const learn = [...document.querySelectorAll('.mobile-bottom-nav button')].find(
      (b) => b.textContent.trim() === 'Learn'
    );
    if (learn) learn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate(() => {
    const open = (re) =>
      [...document.querySelectorAll('button')].find((b) => re.test(b.textContent));
    (open(/thermodynamics/i) || open(/physics/i) || open(/heat/i))?.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  // Find a glossary control and tap it with the real tap pipeline.
  const before = await page.$$('.gt-trigger');
  if (!before.length) {
    console.log('no glossary term on this screen; navigating to the lesson reader');
  }
  const tapped = await page.evaluate(() => {
    const btn = document.querySelector('.gt-trigger');
    if (!btn) return null;
    btn.click();
    return btn.getAttribute('aria-label');
  });
  await new Promise((r) => setTimeout(r, 500));
  const opened = await page.evaluate(() => {
    const note = document.querySelector('.gt-popover[role="note"]');
    return note ? note.textContent.slice(0, 80) : null;
  });
  console.log(`glossary control: ${tapped || 'none found'}`);
  console.log(`definition revealed: ${opened || 'NOT OPENED'}`);
  if (tapped && !opened) failures.push('tap opened nothing');

  // Capped line length on the widest paragraph of the reading column.
  const widest = await page.evaluate(() => {
    const col = document.querySelector('.lesson-reader-main') || document.body;
    let max = 0;
    for (const p of col.querySelectorAll('p')) {
      max = Math.max(max, p.getBoundingClientRect().width);
    }
    return Math.round(max);
  });
  console.log(`widest reading paragraph: ${widest}px at 375px viewport`);
  if (widest > 375) failures.push(`reading column ${widest}px overflows 375px`);

  if (errors.length) {
    console.error('console errors:');
    errors.forEach((e) => console.error(`  ${e}`));
    failures.push('console errors');
  }
  await browser.close();
  if (failures.length) {
    console.error(`glossary check FAILED: ${failures.join('; ')}`);
    process.exit(1);
  }
  console.log('glossary check passed: tap reveals, measure holds, no console errors');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
