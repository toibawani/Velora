#!/usr/bin/env bash
# Measures the deployed site with Lighthouse and writes docs/lighthouse.json,
# which is the only place the README's Lighthouse numbers come from.
#
# Run: ./scripts/measure-lighthouse.sh [url]
# Needs network access and Chrome. Lighthouse finds Chrome itself; CHROME_PATH
# is only honoured if you export it, because pointing it at the macOS app
# bundle made this script fail with NO_FCP (page painted nothing) while the
# default discovery worked.
set -euo pipefail
cd "$(dirname "$0")/.."

URL="${1:-https://toibawani.github.io/Velora/}"
OUT="docs/lighthouse.json"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# The version is pinned on purpose: a score measured with a version nobody
# wrote down is not reproducible.
VERSION="12.2.1"

echo "Measuring $URL with Lighthouse $VERSION (mobile, the default)"
npx --yes "lighthouse@$VERSION" "$URL" \
  --output=json --output-path="$TMP/report.json" \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new --no-sandbox" \
  --quiet

node - "$TMP/report.json" "$URL" > "$OUT" <<'NODE'
const fs = require('fs');
const report = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const url = process.argv[3];
const categories = Object.fromEntries(
  Object.entries(report.categories).map(([id, category]) => [id, Math.round(category.score * 100)])
);
const metric = (id) => report.audits[id]?.displayValue || null;
const opportunities = Object.entries(report.audits)
  .filter(([, audit]) => audit.details && audit.details.type === 'opportunity' && audit.score !== null && audit.score < 0.9)
  .map(([id, audit]) => ({ id, title: audit.title, score: audit.score, detail: (audit.displayValue || '').trim() }))
  .sort((a, b) => a.score - b.score);
const out = {
  url,
  formFactor: report.configSettings.formFactor,
  measuredAt: new Date().toISOString().slice(0, 10),
  lighthouseVersion: report.lighthouseVersion,
  categories,
  metrics: {
    firstContentfulPaint: metric('first-contentful-paint'),
    largestContentfulPaint: metric('largest-contentful-paint'),
    totalBlockingTime: metric('total-blocking-time'),
    cumulativeLayoutShift: metric('cumulative-layout-shift'),
    speedIndex: metric('speed-index'),
  },
  opportunities,
};
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
NODE

echo "Wrote $OUT"
cat "$OUT"
