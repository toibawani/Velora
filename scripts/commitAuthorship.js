#!/usr/bin/env node
/*
 * Fails when a commit credits someone other than toibawani.
 *
 * The commit-msg hook stops this on the machine that is committing, which is
 * the only place it can be stopped cheaply. This script exists because a hook
 * is local configuration: a fresh clone, a CI runner, or a tool that passes
 * --no-verify can all produce a commit the hook never saw. Run against a
 * range, it answers the question the hook cannot answer after the fact.
 *
 * Usage:
 *   node scripts/commitAuthorship.js <range>     e.g. origin/main..HEAD
 *   node scripts/commitAuthorship.js             checks HEAD itself
 *
 * Exit codes: 0 clean, 1 violation, 2 could not run.
 */

const { execFileSync } = require('child_process');

const NAME = 'toibawani';
const EMAIL = 'toibawani14@gmail.com';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' });
}

function commitsIn(range) {
  // Record separator and field separator are chosen so a commit body cannot
  // forge a boundary: NUL never appears in a commit message field.
  const format = ['%H', '%an', '%ae', '%cn', '%ce', '%B'].join('%x00') + '%x1e';
  const out = git(['log', '--no-color', '--format=' + format, range]);
  return out
    .split('\x1e')
    .map((chunk) => chunk.replace(/^\n/, ''))
    .filter((chunk) => chunk.length > 0)
    .map((chunk) => {
      const [hash, an, ae, cn, ce, body] = chunk.split('\x00');
      return { hash, author: { name: an, email: ae }, committer: { name: cn, email: ce }, body: body || '' };
    });
}

function trailerLines(body) {
  return body
    .split('\n')
    .map((line, index) => ({ line: line.trim(), number: index + 1 }))
    .filter((entry) => /^co-authored-by\s*:/i.test(entry.line));
}

function main() {
  const range = process.argv[2] || 'HEAD';
  let commits;
  try {
    commits = commitsIn(range);
  } catch (error) {
    console.error(`commit-authorship: could not read commits in "${range}": ${error.message.trim()}`);
    process.exit(2);
  }

  if (commits.length === 0) {
    console.error(`commit-authorship: no commits in "${range}"`);
    process.exit(2);
  }

  const problems = [];
  for (const commit of commits) {
    if (commit.author.name !== NAME || commit.author.email !== EMAIL) {
      problems.push(
        `${commit.hash.slice(0, 7)} author is "${commit.author.name} <${commit.author.email}>"`
      );
    }
    if (commit.committer.name !== NAME || commit.committer.email !== EMAIL) {
      problems.push(
        `${commit.hash.slice(0, 7)} committer is "${commit.committer.name} <${commit.committer.email}>"`
      );
    }
    for (const trailer of trailerLines(commit.body)) {
      problems.push(`${commit.hash.slice(0, 7)} message line ${trailer.number}: ${trailer.line}`);
    }
  }

  if (problems.length > 0) {
    console.error(`commit-authorship: ${problems.length} problem(s) in ${commits.length} commit(s) (${range})`);
    for (const problem of problems) console.error(`  ${problem}`);
    console.error('Commits must be authored and committed by toibawani <toibawani14@gmail.com> with no Co-Authored-By trailer.');
    process.exit(1);
  }

  console.log(`commit-authorship: ${commits.length} commit(s) in ${range} are all toibawani <${EMAIL}> and carry no credit trailers`);
}

main();
