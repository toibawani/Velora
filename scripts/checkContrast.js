/**
 * Machine-checked WCAG AA for the token palette, light and dark.
 *
 * The token header quotes contrast ratios by hand, and hand numbers drift:
 * a designer lightens a token by one stop, the comment goes stale, and dark
 * mode paints cream-on-cream while the file still says 4.7:1. This reads the
 * actual values out of design-tokens.css, composites translucent roles over
 * the ground they sit on, and fails on anything below AA. Run it after any
 * colour change; consider it a gate the same way layoutCheck is.
 *
 * Usage: node scripts/checkContrast.js
 */
const fs = require('fs');
const path = require('path');

const TOKENS = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'styles', 'design-tokens.css'),
  'utf8'
);

/** Extract the custom properties of one selector block. */
const block = (selector) => {
  const re = new RegExp(`${selector.replace(/[()[\]]/g, '\\$&')}\\s*\\{([\\s\\S]*?)\\}`, 'g');
  const out = {};
  let m;
  while ((m = re.exec(TOKENS)) !== null) {
    // Later declarations in the same block win, matching the cascade.
    for (const [, name, value] of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      out[name.trim()] = value.trim();
    }
  }
  return out;
};

const LIGHT = { ...block(':root'), ...block(":root[data-theme='light']") };
const DARK = block(":root[data-theme='dark']");

if (process.argv.includes('--debug')) {
  console.log('light keys:', Object.keys(LIGHT).length, 'dark keys:', Object.keys(DARK).length);
  console.log('light --color-bg:', JSON.stringify(LIGHT['--color-bg']));
  console.log('light --bg-elevated:', JSON.stringify(LIGHT['--bg-elevated']));
  process.exit(0);
}

/** Resolve var(--x) against one theme, one level deep (aliases are one hop). */
const resolve = (value, theme) => {
  const m = /^var\((--[\w-]+)\)$/.exec(value);
  return m && theme[m[1]] ? theme[m[1]] : value;
};

const parse = (color) => {
  let m = /^#([0-9a-f]{6})$/i.exec(color);
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/.exec(color);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] === undefined ? 1 : Number(m[4])];
  throw new Error(`cannot parse colour ${color}`);
};

/** Alpha-composite a foreground over an opaque background. */
const over = (fg, bg) => {
  const f = parse(fg);
  const b = parse(bg);
  const a = f[3];
  return [0, 1, 2].map((i) => Math.round(f[i] * a + b[i] * (1 - a)));
};

const lum = ([r, g, b]) => {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

/**
 * An opaque ground triple for a background role. A translucent role tints
 * whatever it sits on, so reporting its raw color would compare the status
 * text against the tint instead of the composited surface - the 1.00:1
 * self-match the first version of this script printed before dark mode was
 * actually measured. baseRole is the opaque ground beneath (page or card).
 */
const groundOf = (theme, bgRole, baseRole) => {
  const [r, g, b, a] = parse(resolve(theme[bgRole], theme));
  if (a >= 1) return [r, g, b];
  const [br, bgc, bb] = parse(resolve(theme[baseRole], theme));
  return [0, 1, 2].map((i) => Math.round([r, g, b][i] * a + [br, bgc, bb][i] * (1 - a)));
};

/** Contrast of a foreground role on an opaque ground triple. */
const ratio = (fg, ground) => {
  const l1 = lum(over(fg, `rgb(${ground.join(',')})`));
  const l2 = lum(ground);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
};

// [theme name, map, text roles on page, text roles on card, solid pairs]
const CHECKS = [
  ['light', LIGHT, '--color-bg', '--bg-elevated'],
  ['dark', DARK, '--bg-primary', '--bg-elevated'],
];

const TEXT_ROLES = ['--text-primary', '--text-secondary', '--text-tertiary'];
const STATUS_ROLES = ['--color-success', '--color-warning', '--color-error', '--color-info'];
const STATUS_SOFT = {
  '--color-success': '--color-success-soft',
  '--color-warning': '--color-warning-soft',
  '--color-error': '--color-error-soft',
  // Info has no soft token; it sits on paper, which is checked below.
};

// Disabled controls are an opacity fade over whatever they sit on. Measuring the
// raw label would pass while the faded control is unreadable, so composite the
// label at the real opacity over the ground and hold it to a "must not vanish"
// floor. WCAG 1.4.3 exempts inactive/disabled components from the 4.5:1 text
// rule, so demanding text AA here would be the wrong bar and would flag every
// faded button; the point is only that a disabled control is still perceptible
// as a control, which 1.5:1 guarantees without demanding full legibility.
const DISABLED_OPACITIES = [0.5, 0.38];

const solid = (value, theme) => {
  const resolved = resolve(value, theme);
  const [r, g, b, a = 1] = parse(resolved);
  return [r, g, b, a];
};

let failures = 0;
const check = (theme, fgRole, bgRole, baseRole, floor, why) => {
  const fg = resolve(theme[fgRole], theme);
  const ground = groundOf(theme, bgRole, baseRole);
  let r;
  try {
    r = ratio(fg, ground);
  } catch (e) {
    console.error(`cannot compute ${fgRole} on ${bgRole}: ${e.message}`);
    failures += 1;
    return;
  }
  const ok = r >= floor;
  if (!ok) failures += 1;
  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${fgRole} on ${bgRole}: ${r.toFixed(2)}:1 (needs ${floor}:1, ${why})`
  );
};

// A label faded to `alpha`, composited over an opaque ground, held to a floor.
const checkDisabled = (theme, fgRole, bgRole, baseRole, alpha, floor) => {
  const [r, g, b] = solid(theme[fgRole], theme);
  const ground = groundOf(theme, bgRole, baseRole);
  const faded = [0, 1, 2].map((i) => Math.round([r, g, b][i] * alpha + ground[i] * (1 - alpha)));
  let cr;
  try {
    cr = ratio(`rgb(${faded.join(',')})`, ground);
  } catch (e) {
    console.error(`cannot compute disabled ${fgRole} on ${bgRole}: ${e.message}`);
    failures += 1;
    return;
  }
  const ok = cr >= floor;
  if (!ok) failures += 1;
  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${fgRole} @${alpha} disabled on ${bgRole}: ${cr.toFixed(2)}:1 (needs ${floor}:1)`
  );
};

for (const [name, theme, page, card] of CHECKS) {
  console.log(`--- ${name} ---`);
  for (const role of TEXT_ROLES) {
    check(theme, role, page, page, 4.5, 'body text');
    check(theme, role, card, card, 4.5, 'card text');
  }
  for (const role of STATUS_ROLES) {
    check(theme, role, page, page, 4.5, 'status text on page');
    check(theme, role, card, card, 4.5, 'status text on card');
    // Translucent tints sit on the page, so the check composites them first.
    if (STATUS_SOFT[role]) check(theme, role, STATUS_SOFT[role], page, 4.5, 'status on its tint');
  }
  // Paper text on the solid accent, both directions of the accent pair.
  check(theme, '--accent-contrast', '--accent-primary', page, 4.5, 'button label');
  check(theme, '--accent-primary', page, page, 3.0, 'accent UI at large sizes');
  check(theme, '--inverse-text', '--inverse-surface', page, 4.5, 'inverted bands');
  // Links are the accent on the page ground, held to text AA.
  check(theme, '--accent-primary', '--bg-primary', page, 4.5, 'link on page');
  check(theme, '--accent-primary', '--bg-elevated', page, 4.5, 'link on card');
  // Placeholder text is tertiary on the input ground, text AA.
  check(theme, '--text-tertiary', page, page, 4.5, 'placeholder on input');
  check(theme, '--text-tertiary', card, card, 4.5, 'placeholder on card input');
  // The focus ring must clear a 3:1 non-text floor against both grounds.
  check(theme, '--ring', page, page, 3.0, 'focus ring on page');
  check(theme, '--ring', card, card, 3.0, 'focus ring on card');
  // Disabled buttons: fade the label, hold a "must not vanish" floor (WCAG 1.4.3
  // exempts disabled controls from the text rule, so 1.5:1, not 3:1).
  for (const alpha of DISABLED_OPACITIES) {
    checkDisabled(theme, '--text-secondary', page, page, alpha, 1.5);
    checkDisabled(theme, '--text-primary', card, card, alpha, 1.5);
  }
  // Muted metadata (byline, captions) is its own token and must clear text AA.
  check(theme, '--color-text-muted', page, page, 4.5, 'muted metadata on page');
  check(theme, '--color-text-muted', card, card, 4.5, 'muted metadata on card');
}

if (failures) {
  console.error(`contrast check FAILED: ${failures} pair(s) below AA`);
  process.exit(1);
}
console.log('contrast check passed: every named pair holds WCAG AA');
