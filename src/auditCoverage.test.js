/**
 * Every audit script has to be run by somebody.
 *
 * This repository had seven scripts under scripts/, each driving real Chrome
 * against the built app. Three of them - atlasTopicVerify, atlasTapAudit and
 * levelsVerify - were not in package.json and not in CI. They could report
 * success while verifying nothing, and nobody would ever have seen the output.
 * Two of those three also only looked for Chrome at a macOS path, so on the
 * ubuntu runner they would have exited before looking at the app at all.
 *
 * The failure mode is quiet in a specific way: an unwired audit is not a
 * failing audit, it is an absent one, and an absent audit does not turn a build
 * red. That is why this is a test rather than a convention.
 *
 * Every assertion here was run against a knowingly wrong value first and
 * watched to fail.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(ROOT, ...parts), 'utf8');

const packageJson = JSON.parse(read('package.json'));
const ci = read('.github', 'workflows', 'ci.yml');

/**
 * Every script in scripts/ that launches a browser and audits the app.
 *
 * Detected by what the script does - it launches puppeteer and serves the
 * build - rather than by a filename convention. The first version of this
 * filter matched on names like `*.Audit.js` and `*Check.js` and found three of
 * the seven, because gameAudit.js and levelsVerify.js fit neither pattern. A
 * list that has to be extended every time a script is named differently is the
 * same fragility this file exists to remove, so the test asks the scripts
 * themselves instead.
 *
 * chrome.js is excluded: it finds a browser, it does not drive one.
 */
const auditScripts = fs
  .readdirSync(path.join(ROOT, 'scripts'))
  .filter((file) => {
    if (!file.endsWith('.js') || file === 'chrome.js') return false;
    const source = fs.readFileSync(path.join(ROOT, 'scripts', file), 'utf8');
    return /puppeteer/.test(source) && /build/.test(source);
  })
  .sort();

const npmTestScripts = Object.entries(packageJson.scripts)
  .filter(([name, value]) => name.startsWith('test:') && value.includes('node scripts/'))
  .map(([, value]) => path.basename(value.trim().split(/\s+/).pop()));

const scriptsInvokedByCI = new Set(
  [...ci.matchAll(/npm run ([\w:-]+)/g)].map(([, name]) => name)
);

test('every audit script is reachable through an npm script', () => {
  // A script nobody can name is a script nobody runs. `node scripts/foo.js`
  // works on a developer's machine and nowhere else.
  expect(auditScripts.length).toBeGreaterThanOrEqual(7);
  auditScripts.forEach((file) => {
    expect(npmTestScripts).toContain(file);
  });
});

test('every audit script is run by CI, not just by whoever remembers it', () => {
  // This is the assertion that was missing when three audits were orphaned.
  // Checked by npm script name rather than filename, because CI invokes
  // `npm run test:games` and never mentions gameAudit.js.
  const notRun = auditScripts.filter((file) => {
    const entry = Object.entries(packageJson.scripts).find(
      ([, value]) => value.includes(`scripts/${file}`)
    );
    return !entry || !scriptsInvokedByCI.has(entry[0]);
  });
  expect(notRun).toEqual([]);
});

test('the npm scripts CI invokes are the ones that exist', () => {
  // The other direction: CI must not reference a script that has been renamed or
  // deleted, which would make a job fail for a reason that has nothing to do
  // with the app.
  [...scriptsInvokedByCI]
    .filter((name) => name.startsWith('test:'))
    .forEach((name) => {
      expect(packageJson.scripts[name]).toBeDefined();
    });
});

test('every audit script resolves Chrome through the shared resolver', () => {
  // Each script used to carry its own copy of the browser path list, and the
  // copies had drifted: four of them knew only the macOS bundle and
  // /usr/bin/chromium, so on a GitHub Actions runner they would have exited
  // with "No Chrome found" - which reads like a clean skip rather than a
  // missing browser.
  auditScripts.forEach((file) => {
    const source = read('scripts', file);
    expect({ file, usesShared: /require\('\.\/chrome'\)/.test(source) }).toEqual({
      file,
      usesShared: true,
    });
    // No script may hardcode a browser path of its own again.
    expect({ file, hardcoded: /\/Applications\/Google Chrome/.test(source) }).toEqual({
      file,
      hardcoded: false,
    });
  });
});

test('every audit script can exit non-zero on its own findings', () => {
  // The whole point of this file. A script that always exits 0 is a report, and
  // a report nobody reads is not a check.
  //
  // It has to be the audit's own verdict, not merely the presence of a
  // `process.exit(1)` somewhere in the file. Checking for the literal string
  // passed while the real exit code was hardcoded to 0, because the file still
  // contained `process.exit(1)` in its "no browser" guard and its catch block.
  // So this strips those two, which only ever fire on a setup error, and
  // requires the remaining exit to depend on the audit's findings.
  auditScripts.forEach((file) => {
    const source = read('scripts', file);
    const body = source
      // `if (!CHROME)` and `catch (err)` guards: setup failures, not findings.
      .replace(/if\s*\(\s*!\s*CHROME[^}]*}/gs, '')
      .replace(/\}\)\(\)\.catch\([^]*$/s, '');
    const exits = [...body.matchAll(/process\.exit\(([^)]*)\)/g)].map(([, arg]) => arg.trim());
    expect({ file, exits }).toEqual({ file, exits: expect.any(Array) });
    // At least one exit must be able to yield 1, and none may be a bare 0.
    expect(exits.some((arg) => /1/.test(arg))).toBe(true);
    expect(exits).not.toContain('0');
  });
});
