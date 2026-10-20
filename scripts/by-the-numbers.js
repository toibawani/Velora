/**
 * by-the-numbers.js
 *
 * Prints VELORA's real counts straight out of the repo.
 * Run: node scripts/by-the-numbers.js
 *      node scripts/by-the-numbers.js --skip-tests   (skip the jest run)
 *
 * Every number below is measured, not remembered. The earlier version of this
 * script had two Atlas numbers typed into it as constants, which meant the
 * README could report 88 written topics while the resolver disagreed. A
 * number that is typed by hand is a claim, not a measurement, so the script
 * now loads the real data and the real resolver.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const SKIP_TESTS = process.argv.includes('--skip-tests');
const counts = {};

/** Build a CommonJS copy of an ESM/TS data module so node can require it. */
function compileToTemp(files, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of files) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const js = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019, allowJs: true },
      fileName: file,
    }).outputText;
    fs.writeFileSync(path.join(outDir, path.basename(file).replace(/\.(ts|js)$/, '.js')), js);
  }
}

// ---- Atlas: real topics, real coverage ------------------------------------
const atlasTemp = fs.mkdtempSync(path.join(os.tmpdir(), 'velora-atlas-'));
// knowledgeFields.js declares a local helper called `module`, which collides
// with CommonJS's own binding, so it is renamed on the way through.
const kfSource = fs
  .readFileSync(path.join(ROOT, 'src/data/knowledgeFields.js'), 'utf8')
  .replace(/^export /gm, '')
  .replace(/const module = /, 'const makeModule = ')
  .replace(/module\('/g, "makeModule('")
  .concat('\nmodule.exports = { KNOWLEDGE_FIELDS, KNOWLEDGE_STATS };\n');
fs.writeFileSync(path.join(atlasTemp, 'knowledgeFields.js'), kfSource);

// The resolver is TypeScript that imports the curriculum data. Compiling the
// real files (rather than re-implementing the rules here) is the point: the
// count below is whatever the app itself answers.
// The curriculum modules are discovered from curriculum.js rather than listed
// here. The hardcoded list was correct until Biology was added, and then this
// script died with "Cannot find module './biologyCurriculum'" while the app
// itself was fine - a count that breaks when a subject is added is a count
// nobody can trust afterwards. Reading the imports means a new subject only
// has to be written once.
const curriculumSource = fs.readFileSync(path.join(ROOT, 'src/data/curriculum.js'), 'utf8');
const curriculumImports = [...curriculumSource.matchAll(/from\s+'\.\/([^']+)'/g)].map((m) => `src/data/${m[1]}.js`);
const curriculumFiles = [...new Set(curriculumImports)];
if (!curriculumFiles.length) throw new Error('no curriculum modules found in src/data/curriculum.js');

compileToTemp(['src/data/atlasResolution.ts', 'src/data/curriculum.js', ...curriculumFiles], atlasTemp);
const { KNOWLEDGE_FIELDS, KNOWLEDGE_STATS } = require(path.join(atlasTemp, 'knowledgeFields.js'));
const { fieldCoverageByDiscipline } = require(path.join(atlasTemp, 'atlasResolution.js'));

const coverage = { written: 0, unwritten: 0, unmapped: 0 };
const perField = [];
for (const field of KNOWLEDGE_FIELDS) {
  const topics = [];
  for (const discipline of field.disciplines) {
    for (const moduleItem of discipline.modules) topics.push(...moduleItem.topics);
  }
  const tally = fieldCoverageByDiscipline(field);
  coverage.written += tally.written;
  coverage.unwritten += tally.unwritten;
  coverage.unmapped += tally.unmapped;
  perField.push({ field: field.label, topics: topics.length, written: tally.written, unwritten: tally.unwritten, unmapped: tally.unmapped });
}

console.log('ATLAS TOPICS');
console.table(perField);
console.log('  ' + String(KNOWLEDGE_STATS.topics).padEnd(28) + 'topics total');
console.log('  ' + String(KNOWLEDGE_STATS.fields).padEnd(28) + 'fields');
console.log('  ' + String(KNOWLEDGE_STATS.disciplines).padEnd(28) + 'disciplines');
console.log('  ' + String(coverage.written).padEnd(28) + 'resolve to a lesson or a deep read');
console.log('  ' + String(coverage.unwritten).padEnd(28) + 'resolve to "not written yet"');
console.log('  ' + String(coverage.unmapped).padEnd(28) + 'sit in a field with no curriculum');
counts.atlasTotal = KNOWLEDGE_STATS.topics;
counts.atlasWritten = coverage.written;
counts.atlasUnwritten = coverage.unwritten;
counts.atlasUnmapped = coverage.unmapped;
counts.fields = KNOWLEDGE_STATS.fields;
counts.disciplines = KNOWLEDGE_STATS.disciplines;
fs.rmSync(atlasTemp, { recursive: true, force: true });

// ---- Dictionary entries ---------------------------------------------------
const DICTIONARY_DIR = path.join(ROOT, 'src', 'data', 'dictionary');
// The nine subject files are the data. index.ts merges them, subjects.ts is the
// filter rail and types.ts is the shape, so none of those are entries. Counting
// every .ts file in the folder is how a "138 entries" README became 148 here.
const dictFiles = fs
  .readdirSync(DICTIONARY_DIR)
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts') && !['index.ts', 'subjects.ts', 'types.ts'].includes(file));
let dictionaryTotal = 0;
let sourceCount = 0;
console.log('\nDICTIONARY ENTRIES');
for (const file of dictFiles) {
  const content = fs.readFileSync(path.join(DICTIONARY_DIR, file), 'utf8');
  const entries = (content.match(/id:\s*'[a-z0-9-]+'/g) || []).length;
  const sources = (content.match(/sourceUrl:/g) || []).length;
  dictionaryTotal += entries;
  sourceCount += sources;
  console.log('  ' + file.replace('.ts', '').padEnd(20) + String(entries).padStart(3) + '  ' + String(sources).padStart(3) + ' with a source URL');
}
console.log('  ' + 'TOTAL'.padEnd(20) + String(dictionaryTotal).padStart(3) + '  ' + String(sourceCount).padStart(3) + ' with a source URL');
counts.dictionary = dictionaryTotal;
counts.sources = sourceCount;

// ---- Black hole levels ----------------------------------------------------
const BH_DIR = path.join(ROOT, 'src', 'data', 'blackholes');
const levelFiles = fs.readdirSync(BH_DIR).filter((f) => f.startsWith('level') && f.endsWith('.ts') && !f.endsWith('.test.ts'));
let bhEntries = 0;
for (const file of levelFiles) {
  bhEntries += (fs.readFileSync(path.join(BH_DIR, file), 'utf8').match(/id:\s*'[a-z0-9-]+'/g) || []).length;
}
console.log('\nBLACK HOLES');
console.log('  ' + levelFiles.length + ' levels, ' + bhEntries + ' entries');
counts.levels = levelFiles.length;
counts.levelEntries = bhEntries;

// ---- Games ----------------------------------------------------------------
// Counting files in src/games/ answers a different question from "how many
// games can I open?". Five files live there, and the Brain Games tab holds
// three more, so the README said 5 while the app offered 8. Both numbers were
// true of different questions, which is how a count becomes a lie in practice.
// The number reported here is the one a reader can check by opening the Games
// screen: every game in 5 + 3, with simulations counted separately.
const GAMES_DIR = path.join(ROOT, 'src', 'games');
const gameFiles = fs.readdirSync(GAMES_DIR).filter((f) => f.endsWith('.js') && !f.endsWith('.test.js'));

const gamesSource = fs.readFileSync(path.join(ROOT, 'src', 'screens', 'Games.js'), 'utf8');
const classicBlock = (gamesSource.match(/export const CLASSIC_GAMES = \[([\s\S]*?)\n\];/) || [])[1];
if (!classicBlock) throw new Error('CLASSIC_GAMES not found in src/screens/Games.js');
const classicBlockEntries = (classicBlock.match(/id: '[a-z-]+'/g) || []).length;
const classicSimulations = (classicBlock.match(/type: 'simulation'/g) || []).length;
// Relativity Lab sits in the classic grid but is a simulation, so the game
// count is the grid minus the entries marked as simulations.
const classicGames = classicBlockEntries - classicSimulations;

const brainSource = fs.readFileSync(path.join(ROOT, 'src', 'components', 'BrainGames.js'), 'utf8');
const brainBlock = (brainSource.match(/export const BRAIN_GAMES = \[([\s\S]*?)\n\];/) || [])[1];
if (!brainBlock) throw new Error('BRAIN_GAMES not found in src/components/BrainGames.js');
const brainGames = (brainBlock.match(/id: '[a-z-]+'/g) || []).length;

const simSource = fs.readFileSync(path.join(ROOT, 'src', 'components', 'PhysicsSimulations.js'), 'utf8');
const simBlock = (simSource.match(/export const PHYSICS_SIMULATIONS = \[([\s\S]*?)\n\];/) || [])[1];
if (!simBlock) throw new Error('PHYSICS_SIMULATIONS not found in src/components/PhysicsSimulations.js');
const physicsSims = (simBlock.match(/id: '[a-z-]+'/g) || []).length;

// A parser that silently returns zero would print a confident wrong number,
// which is the failure this script exists to stop. Fail loudly instead.
if (classicGames === 0 || brainGames === 0 || physicsSims === 0) {
  throw new Error('Game arrays were found but no entries parsed; refusing to print a count');
}

console.log('\nGAMES');
console.log('  ' + String(classicGames).padEnd(4) + 'concept games: ' + gameFiles.map((f) => f.replace('.js', '')).join(', '));
console.log('  ' + String(brainGames).padEnd(4) + 'brain games: ' + (brainBlock.match(/label: '([^']+)'/g) || []).map((l) => l.replace(/label: '|'/g, '')).join(', '));
console.log('  ' + String(classicGames + brainGames).padEnd(4) + 'games total');
console.log('  ' + String(physicsSims + classicSimulations).padEnd(4) + 'simulations (counted separately)');
counts.games = classicGames + brainGames;
counts.conceptGames = classicGames;
counts.brainGames = brainGames;
counts.simulations = physicsSims + classicSimulations;

// ---- Tests: ask jest, do not count the word "test(" -----------------------
const JEST_RESULT = path.join(os.tmpdir(), 'velora-jest-numbers.json');
if (!SKIP_TESTS) {
  console.log('\nTESTS (running jest, this takes a few seconds)');
  try {
    execFileSync('npx', ['react-scripts', 'test', '--watchAll=false', '--json', '--outputFile=' + JEST_RESULT], {
      cwd: ROOT,
      env: { ...process.env, CI: 'true' },
      stdio: ['ignore', 'ignore', 'ignore'],
    });
  } catch {
    console.log('  jest did not exit clean: numbers below are the last run it wrote');
  }
}
if (fs.existsSync(JEST_RESULT)) {
  const result = JSON.parse(fs.readFileSync(JEST_RESULT, 'utf8'));
  console.log('  ' + String(result.numTotalTestSuites).padEnd(28) + 'test suites');
  console.log('  ' + String(result.numTotalTests).padEnd(28) + 'tests');
  console.log('  ' + String(result.numPassedTests).padEnd(28) + 'passing');
  console.log('  ' + String(result.numFailedTests).padEnd(28) + 'failing');
  counts.testSuites = result.numTotalTestSuites;
  counts.tests = result.numTotalTests;
  counts.testsPassing = result.numPassedTests;
} else {
  console.log('\nTESTS');
  console.log('  not measured (run without --skip-tests)');
  counts.testSuites = null;
  counts.tests = null;
}

// ---- CI: jobs and browser/node checks actually wired ----------------------
const WORKFLOW_DIR = path.join(ROOT, '.github', 'workflows');
const workflows = fs.readdirSync(WORKFLOW_DIR).filter((f) => f.endsWith('.yml'));
let jobCount = 0;
const checks = new Set();
for (const file of workflows) {
  const yml = fs.readFileSync(path.join(WORKFLOW_DIR, file), 'utf8');
  const jobsBlock = yml.split(/^jobs:\s*$/m)[1] || '';
  jobCount += (jobsBlock.match(/^ {2}[a-zA-Z0-9_-]+:\s*$/gm) || []).length;
  for (const line of yml.split('\n')) {
    const npm = line.match(/run:\s*npm run (test:[a-z0-9-]+)/);
    const node = line.match(/run:\s*node (scripts\/[A-Za-z-]+\.js)/);
    if (npm) checks.add('npm run ' + npm[1]);
    // chrome.js locates a browser for the other steps; it is a setup step, not
    // a check. checkContrast.js is a check and its capital C was missed by the
    // original lowercase-only pattern, which is how the count read 7 with 8
    // steps in the file.
    if (node && !node[1].endsWith('chrome.js')) checks.add('node ' + node[1]);
  }
}
console.log('\nCI');
console.log('  ' + String(workflows.length).padEnd(28) + 'workflows');
console.log('  ' + String(jobCount).padEnd(28) + 'jobs');
console.log('  ' + String(checks.size).padEnd(28) + 'checks run in them');
for (const check of [...checks].sort()) console.log('    - ' + check);
counts.workflows = workflows.length;
counts.jobs = jobCount;
counts.ciChecks = checks.size;

// ---- Lighthouse: read the committed measurement, never a memory ----------
const LH = path.join(ROOT, 'docs', 'lighthouse.json');
console.log('\nLIGHTHOUSE');
if (fs.existsSync(LH)) {
  const report = JSON.parse(fs.readFileSync(LH, 'utf8'));
  console.log('  measured ' + report.measuredAt + ' on ' + report.url + ' (' + report.formFactor + ')');
  for (const [id, category] of Object.entries(report.categories)) {
    // docs/lighthouse.json stores percentages (100, not 1), unlike the raw
    // Lighthouse report it is generated from.
    console.log('  ' + id.padEnd(20) + Math.round(category <= 1 ? category * 100 : category));
  }
  counts.lighthouse = report.categories;
  counts.lighthouseMeasuredAt = report.measuredAt;
} else {
  console.log('  not measured: run ./scripts/measure-lighthouse.sh');
  counts.lighthouse = null;
}

console.log('\nSUMMARY (machine-readable)');
console.log(JSON.stringify(counts, null, 2));
