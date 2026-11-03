import fs from 'fs';
import path from 'path';

// The dark-mode contract lives in public/index.html plus public/theme-init.js:
// the theme must be resolved on <html> BEFORE any paint, otherwise dark-mode
// visitors see the cream page flash until React mounts. The script moved out of
// the HTML so the Content-Security-Policy can forbid inline script, and these
// assertions keep both halves of that move honest.
const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
const themeScript = fs.readFileSync(path.resolve(__dirname, '../public/theme-init.js'), 'utf8');

describe('pre-paint theme resolution', () => {
  test('index.html loads the theme script from public/ instead of inlining it', () => {
    const head = html.slice(0, html.indexOf('</head>'));
    expect(head).toContain('<script src="%PUBLIC_URL%/theme-init.js"></script>');
    // No inline script anywhere in the document: the CSP forbids it, and an
    // inline one would be minified in production, which is why a hash is not an
    // option either.
    expect(html).not.toMatch(/<script(?![^>]*\bsrc=)[^>]*>/i);
  });

  test('the script tag comes before the root container so it applies pre-paint', () => {
    const scriptIndex = html.indexOf('theme-init.js');
    const rootIndex = html.indexOf('<div id="root">');
    expect(scriptIndex).toBeGreaterThan(-1);
    expect(scriptIndex).toBeLessThan(rootIndex);
  });

  test('reads the same storage key as ThemeContext', () => {
    expect(themeScript).toContain("localStorage.getItem('velora_theme_preference')");
  });

  test('honours all three modes and guards against storage failures', () => {
    expect(themeScript).toMatch(/stored === 'dark' \|\| stored === 'light' \? stored : 'auto'/);
    expect(themeScript).toContain("prefers-color-scheme: dark");
    expect(themeScript).toContain("setAttribute('data-theme'");
    expect(themeScript).toContain('catch');
  });

  test('is same-origin: the browser loads it from this site, never a CDN', () => {
    expect(themeScript).not.toMatch(/https?:\/\//);
  });
});
