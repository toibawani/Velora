/**
 * One-off codemod: point every raw gap/padding/margin and border-radius value
 * in feature CSS at the token scales in design-tokens.css.
 *
 * Why a script: the audit counted 181 raw spacing values and 135 raw radii
 * across 58 stylesheets. Hand-editing that invites typos and misses files;
 * a script that prints every change is reviewable, and running it twice is
 * idempotent because already-tokenised values contain '(' and are skipped.
 *
 * Rules, chosen so the sweep cannot silently restyle the app:
 *   - Comments are masked first, so a value quoted as documentation stays
 *     quoted.
 *   - Declarations whose value contains '(' (calc/env/var) are skipped whole;
 *     rewriting a safe-area expression is how a notch gets a padding bug.
 *   - border-radius: 50% stays: those are circles, not radii on a ladder.
 *   - Negative margins stay: both existing ones are hairline-overlap tricks
 *     that a snapped -4px would break.
 *   - Values snap to the nearest scale step; ties go UP for spacing (a little
 *     more air is the safer error) and DOWN for radii (crisper corners suit
 *     the printed-index look).
 *
 * Usage: node scripts/tokenizeSpacing.js [--dry]
 */
const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry');

// The scales, mirrored from design-tokens.css. Values are px.
const SPACE = [
  [4, 'var(--space-1)'],
  [8, 'var(--space-2)'],
  [12, 'var(--space-3)'],
  [16, 'var(--space-4)'],
  [20, 'var(--space-5)'],
  [24, 'var(--space-6)'],
  [32, 'var(--space-8)'],
  [40, 'var(--space-10)'],
  [48, 'var(--space-12)'],
  [64, 'var(--space-16)'],
];

// Radii include the two steps added alongside this pass (24, 32) because real
// panels were drawn at 20-32px and the old ladder ended at 18. 999 is in the
// table because the first run of this script omitted it: every pill in the app
// snapped to the "nearest" step (32px) and lost its shape. A value the table
// does not describe must never be guessed for.
const RADIUS = [
  [3, 'var(--radius-xs)'],
  [6, 'var(--radius-sm)'],
  [8, 'var(--radius-md)'],
  [12, 'var(--radius-lg)'],
  [18, 'var(--radius-xl)'],
  [24, 'var(--radius-2xl)'],
  [32, 'var(--radius-3xl)'],
  [999, 'var(--radius-full)'],
];

const snap = (value, table, tie) => {
  let best = table[0];
  let bestDist = Math.abs(value - table[0][0]);
  for (const step of table.slice(1)) {
    const dist = Math.abs(value - step[0]);
    if (dist < bestDist || (dist === bestDist && tie === 'up' && step[0] > best[0])) {
      best = step;
      bestDist = dist;
    }
  }
  return best;
};

/** Blank out /* ... *\/ comments so quoted example values are never rewritten. */
const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '));

const SPACING_PROPS =
  '(?:gap|row-gap|column-gap|padding|padding-(?:top|right|bottom|left)|margin|margin-(?:top|right|bottom|left))';

const rewriteValueList = (value, table, tie, log, context) =>
  // Bare numbers with px or rem units; a token name never matches because
  // var(--space-6) has no number directly before px.
  value.replace(/(-?[0-9]*\.?[0-9]+)(px|rem)\b/g, (match, num, unit) => {
    const px = unit === 'rem' ? Number(num) * 16 : Number(num);
    if (px <= 0 || !Number.isFinite(px)) return match;
    const [step, token] = snap(px, table, tie);
    log.push(`  ${context}: ${match} -> ${token} (${step}px)`);
    return token;
  });

const processFile = (file, log) => {
  const original = fs.readFileSync(file, 'utf8');
  const masked = stripComments(original);
  const decl = new RegExp(`(${SPACING_PROPS}|border-radius)\\s*:\\s*([^;{}]+)`, 'g');
  let out = '';
  let last = 0;
  let changed = false;
  let match = decl.exec(masked);
  while (match !== null) {
    const [whole, prop, value] = match;
    if (value.includes('(') || value.includes('50%')) {
      match = decl.exec(masked);
      continue; // eslint-disable-line no-continue
    }
    const table = prop === 'border-radius' ? RADIUS : SPACE;
    const tie = prop === 'border-radius' ? 'down' : 'up';
    const next = rewriteValueList(value, table, tie, log, `${path.basename(file)} ${prop}`);
    if (next !== value) {
      out += original.slice(last, match.index) + whole.replace(value, next);
      last = match.index + whole.length;
      changed = true;
    }
    match = decl.exec(masked);
  }
  out += original.slice(last);
  if (changed && !DRY) fs.writeFileSync(file, out);
  return changed;
};

const walk = (dir, files = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.css') && entry.name !== 'design-tokens.css') files.push(full);
  }
  return files;
};

const main = () => {
  const log = [];
  const files = walk(path.join(__dirname, '..', 'src'));
  const touched = files.filter((file) => processFile(file, log));
  console.log(`${DRY ? '[dry] ' : ''}${touched.length} files changed:`);
  touched.forEach((f) => console.log(` ${path.relative(process.cwd(), f)}`));
  console.log(`${log.length} value replacements:`);
  log.forEach((line) => console.log(line));
};

main();
