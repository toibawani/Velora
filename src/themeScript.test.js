import fs from 'fs';
import path from 'path';

// The dark-mode contract lives in public/index.html: the theme must be
// resolved on <html> BEFORE any paint, otherwise dark-mode visitors see the
// cream page flash until React mounts. These assertions guard the inline
// script so a template edit can't silently reintroduce the flash.
describe('pre-paint theme resolution (public/index.html)', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');

  test('inline theme script exists in <head>', () => {
    const head = html.slice(0, html.indexOf('</head>'));
    expect(head).toContain('<script>');
  });

  test('reads the same storage key as ThemeContext', () => {
    expect(html).toContain("localStorage.getItem('velora_theme_preference')");
  });

  test('runs before the root container so it applies pre-paint', () => {
    const scriptIndex = html.indexOf("velora_theme_preference");
    const rootIndex = html.indexOf('<div id="root">');
    expect(scriptIndex).toBeGreaterThan(-1);
    expect(scriptIndex).toBeLessThan(rootIndex);
  });

  test('honours all three modes and guards against storage failures', () => {
    expect(html).toMatch(/stored === 'dark' \|\| stored === 'light' \? stored : 'auto'/);
    expect(html).toContain("prefers-color-scheme: dark");
    expect(html).toContain("setAttribute('data-theme'");
    expect(html).toContain('catch');
  });
});