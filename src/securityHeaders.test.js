import fs from 'fs';
import path from 'path';

/**
 * The security headers, as the app actually ships them.
 *
 * GitHub Pages cannot set response headers, so the policy lives in a meta tag
 * in public/index.html. That makes it ordinary text in the repository: easy to
 * weaken in a hurry, and invisible to every other test. These assertions read
 * the file that is served and fail on the changes that would quietly remove the
 * protection:
 *
 *  - the policy disappearing
 *  - 'unsafe-inline' or 'unsafe-eval' appearing in script-src
 *  - an inline script reappearing (which is what would force 'unsafe-inline')
 *  - the policy drifting below the first script or link, where it would not
 *    apply to what comes before it
 *  - the build inlining the webpack runtime chunk, which the policy blocks
 */
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const policyMatch = html.match(
  /http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i,
);
const policy = policyMatch ? policyMatch[1] : '';

/** The value of one directive in the policy, or '' when it is absent. */
const directive = (name) => {
  const found = policy
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.split(/\s+/)[0] === name);
  return found ? found.slice(name.length).trim() : '';
};

const sources = (name) => directive(name).split(/\s+/).filter(Boolean);

describe('content security policy', () => {
  test('is present in the served HTML', () => {
    expect(policyMatch).not.toBeNull();
    expect(policy.length).toBeGreaterThan(0);
  });

  test('defaults to this origin only', () => {
    expect(sources('default-src')).toEqual(["'self'"]);
  });

  test('allows same-origin scripts, and never inline or eval', () => {
    const scriptSrc = sources('script-src');
    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
    expect(scriptSrc).not.toContain('*');
  });

  test('blocks plugin content and retargeted bases and forms', () => {
    expect(sources('object-src')).toEqual(["'none'"]);
    expect(sources('base-uri')).toEqual(["'self'"]);
    expect(sources('form-action')).toEqual(["'none'"]);
    expect(sources('frame-src')).toEqual(["'none'"]);
  });

  test('permits outbound requests to this origin and the optional analytics host only', () => {
    expect(sources('connect-src').sort()).toEqual(
      ["'self'", 'https://*.goatcounter.com'].sort(),
    );
    expect(sources('img-src').sort()).toEqual(
      ["'self'", 'data:', 'https://*.goatcounter.com'].sort(),
    );
    expect(sources('font-src')).toEqual(["'self'"]);
  });

  test('sits above every resource it governs', () => {
    const policyAt = html.indexOf('Content-Security-Policy');
    const firstScript = html.indexOf('<script');
    const firstLink = html.indexOf('<link');
    expect(policyAt).toBeGreaterThan(-1);
    expect(firstScript).toBeGreaterThan(-1);
    expect(firstLink).toBeGreaterThan(-1);
    expect(policyAt).toBeLessThan(firstScript);
    expect(policyAt).toBeLessThan(firstLink);
  });

  test('no document in public/ loads a script from another origin', () => {
    const publicDir = path.join(root, 'public');
    fs.readdirSync(publicDir)
      .filter((name) => name.endsWith('.html'))
      .forEach((name) => {
        const text = fs.readFileSync(path.join(publicDir, name), 'utf8');
        expect(text).not.toMatch(/<script[^>]+src="https?:/i);
      });
  });
});

describe('permissions policy', () => {
  test('disables powerful browser features the app never uses', () => {
    expect(html).toMatch(/<meta\s+http-equiv="Permissions-Policy"[^>]*>/i);
  });
});

describe('referrer policy', () => {
  test('sends no referrer to the sites a lesson cites', () => {
    expect(html).toMatch(/<meta\s+name="referrer"\s+content="no-referrer"\s*\/?>/i);
  });
});

describe('production build keeps the policy workable', () => {
  test('the webpack runtime chunk is not inlined, because script-src forbids inline script', () => {
    // create-react-app inlines the runtime chunk by default. That inline script
    // would be blocked by the policy in a built bundle while working in
    // development, so the build has to emit it as a file.
    expect(pkg.scripts.build).toContain('INLINE_RUNTIME_CHUNK=false');
    expect(pkg.scripts.build).toContain('react-scripts build');
  });
});
