// Measures every control the user can click, at the widths that matter, and
// reports the ones with no accessible name and the decorative icons that are
// wrongly exposed to the screen reader.
//
// Runs against the BUILT app, like the layout check, because axe in jsdom only
// sees a detached fragment -- it cannot evaluate the page as rendered.
const fs = require('fs');
const path = require('path');
const http = require('http');

const puppeteer = require('puppeteer-core');

const PORT = Number(process.env.PORT || 4174);

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
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
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

const audit = (page) =>
  page.evaluate(() => {
    const accessibleName = (el) => {
      const aria = el.getAttribute('aria-label');
      if (aria && aria.trim()) return aria.trim();
      const labelledBy = el.getAttribute('aria-labelledby');
      if (labelledBy) {
        const text = labelledBy
          .split(/\s+/)
          .map((id) => document.getElementById(id))
          .filter(Boolean)
          .map((n) => n.textContent.trim())
          .join(' ');
        if (text) return text;
      }
      if (el.title && el.title.trim()) return el.title.trim();
      const text = (el.innerText || el.textContent || '').trim();
      // An icon-only button renders its SVG's text, which is nothing useful.
      return text || '';
    };

    const unnamed = [];
    for (const el of document.querySelectorAll('button, a[href], [role="button"]')) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      if (!accessibleName(el)) {
        unnamed.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className || '').slice(0, 60),
          html: el.outerHTML.slice(0, 90),
        });
      }
    }

    // A decorative SVG inside a labelled button is fine; an SVG inside a
    // button with no label is the unnamed case above. This catches SVGs that
    // are siblings of text and should have been hidden.
    const exposedIcons = [];
    for (const svg of document.querySelectorAll('svg')) {
      if (svg.getAttribute('aria-hidden') === 'true') continue;
      if (svg.closest('button, a[href], [role="button"]')) {
        const control = svg.closest('button, a[href], [role="button"]');
        if (!accessibleName(control)) continue; // already reported above
      }
      // Standalone decorative icon next to text with no accessible name of its own.
      if (!svg.closest('button, a[href], [role="button"]') && !svg.getAttribute('role')) {
        exposedIcons.push(String(svg.parentElement?.className || '').slice(0, 50));
      }
    }

    return { unnamed, exposedIcons: exposedIcons.slice(0, 10), unnamedCount: unnamed.length };
  });

// Both scripts walk the built app by clicking real nav controls, so the screens
// they visit are read from src/navigation.js instead of being typed out again
// here. That duplication is why the layout check visited five screens and called
// it a pass while the dictionary, the question desk and the Journey were walked
// by hand through a second list that had already fallen behind the app.
//
// navigation.js is a module, so it cannot be require()d from here. It is parsed
// instead, and the parser is checked against a count below: if a future entry
// stops matching this shape the script fails rather than quietly visiting fewer
// screens and reporting a pass.
const readRegistry = () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'navigation.js'), 'utf8');
  const body = source.slice(source.indexOf('export const SCREENS = ['));
  return [...body.matchAll(
    // Order inside an entry is fixed, so one lazy match across fields is safe.
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

// The bottom bar shows the primary screens, the drawer shows all of them. Both
// are walked by clicking, so the labels here are the ones a person sees.
const SCREENS = REGISTRY.filter((screen) => screen.primary).map((screen) => screen.label);
const DRAWER_SCREENS = REGISTRY.filter((screen) => !screen.primary).map((screen) => screen.drawerLabel);

const clickNav = async (page, label) =>
  page.evaluate((t) => {
    const target = [...document.querySelectorAll('.mobile-bottom-nav button')].find(
      (b) => b.textContent.trim() === t
    );
    if (!target) return false;
    target.click();
    return true;
  }, label);

// The drawer is the only route to Dictionary and Journey. Open it by clicking
// the real toggle rather than driving state, so this stays an honest check.
const clickDrawerItem = async (page, label) => {
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
  }, label);
  await new Promise((r) => setTimeout(r, 700));
  return ok;
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

  const failures = [];
  for (const width of [1440, 375]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.setItem('velora_onboarding_done', 'true'));
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
    await new Promise((r) => setTimeout(r, 800));
    const interests = await page.$('.subject-selection-grid');
    if (interests) {
      await page.evaluate(() => {
        const b = [...document.querySelectorAll('button[type="submit"]')].pop();
        if (b) b.click();
      });
    }
    await page.waitForFunction(() => document.querySelectorAll('nav').length > 0);
    await new Promise((r) => setTimeout(r, 800));

    for (const [screen, navigate] of [
      ...SCREENS.map((label) => [label, clickNav]),
      ...DRAWER_SCREENS.map((label) => [label, clickDrawerItem]),
    ]) {
      const clicked = await navigate(page, screen);
      if (!clicked) {
        failures.push({ width, screen, reason: 'nav item not found' });
        continue;
      }
      await new Promise((r) => setTimeout(r, 700));
      const result = await audit(page);
      console.log(`${width}px ${screen.padEnd(10)} unnamed-controls=${result.unnamedCount} exposed-icons=${result.exposedIcons.length}`);
      if (result.unnamedCount) {
        failures.push({ width, screen, reason: 'controls with no accessible name', unnamed: result.unnamed });
      }
    }
    await page.close();
  }

  await browser.close();
  server.close();
  if (failures.length) {
    console.error('\nFAILURES:');
    for (const f of failures) console.error(JSON.stringify(f));
    process.exit(1);
  }
  console.log('\nnaming check passed: every control has an accessible name');
};

main().catch((err) => {
  console.error(err);
  process.exit(2);
});