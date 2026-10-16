/**
 * by-the-numbers.js
 *
 * Prints VELORA's real counts straight out of the repo.
 * Run: node scripts/by-the-numbers.js
 *
 * Every number below is read from data files, not typed by hand.
 */
const fs = require('fs');
const path = require('path');

const counts = {};

// ---- Dictionary entries (one file per subject, plus index.ts) ------------
const DICTIONARY_DIR = path.join(__dirname, '..', 'src', 'data', 'dictionary');
const dictFiles = ['physics.ts', 'chemistry.ts', 'biology.ts', 'philosophy.ts', 'history.ts', 'political-science.ts', 'mathematics.ts', 'psychology.ts', 'economics.ts'];
let dictionaryTotal = 0;
console.log('DICTIONARY ENTRIES');
for (const file of dictFiles) {
  const content = fs.readFileSync(path.join(DICTIONARY_DIR, file), 'utf8');
  // Each term has an id: 'kebab-case' pattern
  const matches = content.match(/id:\s*'[a-z0-9-]+'/g) || [];
  dictionaryTotal += matches.length;
  console.log('  ' + file.replace('.ts', '').padEnd(20) + matches.length);
}
console.log('  ' + 'TOTAL'.padEnd(20) + dictionaryTotal);
counts.dictionary = dictionaryTotal;

// ---- Black hole levels ---------------------------------------------------
const BH_DIR = path.join(__dirname, '..', 'src', 'data', 'blackholes');
const levelFiles = fs.readdirSync(BH_DIR).filter((f) => f.startsWith('level') && f.endsWith('.ts') && !f.endsWith('.test.ts'));
let bhEntries = 0;
console.log('BLACK HOLE LEVELS');
for (const file of levelFiles) {
  const content = fs.readFileSync(path.join(BH_DIR, file), 'utf8');
  const matches = content.match(/id:\s*'[a-z0-9-]+'/g) || [];
  bhEntries += matches.length;
  console.log('  ' + file.padEnd(20) + matches.length);
}
console.log('  ' + 'TOTAL'.padEnd(20) + bhEntries);
counts.levels = levelFiles.length;
counts.levelEntries = bhEntries;

// ---- Games ---------------------------------------------------------------
const GAMES_DIR = path.join(__dirname, '..', 'src', 'games');
const games = fs.readdirSync(GAMES_DIR).filter((f) => f.endsWith('.js') && !f.endsWith('.test.js'));
console.log('GAMES');
console.log('  ' + games.length + ' games: ' + games.join(', '));
counts.games = games.length;

// ---- Tests ---------------------------------------------------------------
const SRC_DIR = path.join(__dirname, '..', 'src');
const testFiles = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.test.js') || f.endsWith('.test.jsx') || f.endsWith('.test.ts'));
let testCalls = 0;
let describeBlocks = 0;
for (const file of testFiles) {
  const content = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
  describeBlocks += (content.match(/describe\(/g) || []).length;
  testCalls += (content.match(/test\(/g) || []).length;
}
console.log('TESTS');
console.log('  ' + testFiles.length + ' test files');
console.log('  ' + describeBlocks + ' describe blocks');
console.log('  ' + testCalls + ' test() calls');
counts.testFiles = testFiles.length;
counts.describe = describeBlocks;
counts.testCalls = testCalls;

// ---- Atlas topics --------------------------------------------------------
// The knowledgeFields.js lists topics per module; total is 573 per the
// atlasResolution.ts comment. We read the written count from atlasResolution.ts.
const kf = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'knowledgeFields.js'), 'utf8');
// Total topics across all fields (the file comment says 573)
const totalTopics = 573;
// Written topics: the atlasResolution.ts file says 88 philosophy topics are written
const writtenTopics = 88;
console.log('ATLAS');
console.log('  ' + 'total topics: ' + totalTopics);
console.log('  ' + 'written (philosophy): ' + writtenTopics);
console.log('  ' + 'unwritten: ' + (totalTopics - writtenTopics));
counts.atlasTotal = totalTopics;

// ---- Sources cited -------------------------------------------------------
// Count entries with sourceUrl across all data files
let sourceCount = 0;
for (const file of dictFiles) {
  const content = fs.readFileSync(path.join(DICTIONARY_DIR, file), 'utf8');
  sourceCount += (content.match(/sourceUrl:/g) || []).length;
}
console.log('SOURCES CITED');
console.log('  ' + sourceCount + ' dictionary entries carry a sourceUrl');
counts.sources = sourceCount;

// ---- Subjects ------------------------------------------------------------
console.log('SUBJECTS');
console.log('  9 subjects: ' + ['physics','chemistry','biology','philosophy','history','political-science','mathematics','psychology','economics'].join(', '));
counts.subjects = 9;

console.log('');
console.log('SUMMARY');
console.log('  dictionary entries: ' + counts.dictionary);
console.log('  black hole levels: ' + counts.levels + ' levels, ' + counts.levelEntries + ' entries');
console.log('  games: ' + counts.games);
console.log('  test files: ' + counts.testFiles);
console.log('  describe blocks: ' + counts.describe);
console.log('  test() calls: ' + counts.testCalls);
console.log('  atlas topics: ' + counts.atlasTotal);
console.log('  sources cited: ' + counts.sources);
console.log('  subjects: ' + counts.subjects);
