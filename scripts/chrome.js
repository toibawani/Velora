/**
 * One place to find a Chrome binary, because seven copies of this list had
 * already drifted apart.
 *
 * The layout check, the naming check and the game audit each looked for
 * /usr/bin/google-chrome, which is where a GitHub Actions ubuntu runner puts
 * it. The accessibility audit and all three atlas scripts did not: they knew
 * only the macOS application bundle and /usr/bin/chromium. On Linux those four
 * would have exited with "No Chrome found" - not a wrong answer, but no answer
 * at all, which is why none of them was in CI and nobody noticed.
 *
 * The order matters only for the local developer, who may have both installed.
 * Chrome is preferred over Chromium because it is what the audits were written
 * against; Chromium is last as a fallback.
 *
 * CHROME_PATH overrides everything, which is how a runner with the browser
 * somewhere unusual points at it without editing seven files.
 */
const fs = require('fs');
const path = require('path');

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
].filter(Boolean);

/** The first candidate that exists on disk, or null if none do. */
const findChrome = () => CANDIDATES.find((candidate) => fs.existsSync(candidate));

/**
 * Resolves a Chrome binary or explains why it could not, so a missing browser
 * is a clear message rather than a stack trace from deep inside puppeteer.
 */
const requireChrome = () => {
  const found = findChrome();
  if (found) return found;
  console.error(
    'No Chrome binary found. Install Chrome or Chromium, or set CHROME_PATH.\nLooked in:\n  ' +
      CANDIDATES.join('\n  ')
  );
  return null;
};

// Self-check: `node scripts/chrome.js` prints what it found and whether it runs.
if (require.main === module) {
  const found = findChrome();
  console.log(found ? `found: ${found}` : 'found: nothing');
  console.log('candidates:');
  CANDIDATES.forEach((c) => console.log(`  ${fs.existsSync(c) ? 'yes' : ' no'}  ${c}`));
  console.log(`script dir: ${path.dirname(__filename)}`);
  process.exit(found ? 0 : 1);
}

module.exports = { findChrome, requireChrome, CANDIDATES };
