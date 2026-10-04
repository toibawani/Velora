/**
 * Plays every game end to end in real Chrome against the built app, and reports
 * what is actually reachable: which questions render, whether a wrong answer
 * gives feedback, what the score line claims, and whether the round terminates.
 *
 * The point is to find stubs. A file called ConceptScrabble.js proves nothing
 * about whether the game can be played, so this clicks the way a person does
 * and reports what came back.
 *
 * Usage: node scripts/gameAudit.js
 *
 * Exits non-zero if a game cannot be reached or if the page logged a console
 * error. It used to exit 0 on the grounds that it was a report rather than a
 * gate, which meant it could verify nothing and still look like it had passed.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const puppeteer = require('puppeteer-core');

const PORT = Number(process.env.PORT || 4175);

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};

const serve = (root) =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(root, urlPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(root, 'index.html');
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
      });
      res.end(fs.readFileSync(filePath));
    });
    server.listen(PORT, () => resolve(server));
  });

const findChrome = () =>
  [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ]
    .filter(Boolean)
    .find((p) => fs.existsSync(p));

const signIn = async (page, url) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('velora_onboarding_done', 'true');
  });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('button');
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (await page.$('#profile-name')) break;
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button, a')].find((x) =>
        /start learning|look around|begin your exploration/i.test(x.textContent.trim())
      );
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 500));
  }
  await page.type('#profile-name', 'Ada Lovelace');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 700));
  if (await page.$('.subject-selection-grid')) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[type="submit"]')].pop();
      if (b) b.click();
    });
  }
  await page.waitForFunction(() => document.querySelectorAll('nav').length > 0);
  await new Promise((r) => setTimeout(r, 800));
};

const clickByText = (page, text) =>
  page.evaluate((t) => {
    const target = [...document.querySelectorAll('.mobile-bottom-nav button')].find(
      (b) => b.textContent.trim() === t
    );
    if (!target) return false;
    target.click();
    return true;
  }, text);

/** Everything a screen currently shows, trimmed for the report. */
const snapshot = (page) =>
  page.evaluate(() => {
    const text = document.body.innerText.replace(/\n{2,}/g, '\n').trim();
    return {
      text: text.slice(0, 700),
      buttons: [...document.querySelectorAll('button')]
        .map((b) => b.textContent.trim())
        .filter(Boolean)
        .slice(0, 25),
      inputs: [...document.querySelectorAll('input, select, textarea')].map((i) => ({
        tag: i.tagName.toLowerCase(),
        type: i.type,
        placeholder: i.placeholder || '',
        label: i.getAttribute('aria-label') || '',
      })),
    };
  });

const audit = [];

const record = (name, data) => {
  audit.push({ name, ...data });
  console.log(`\n=== ${name}`);
  console.log(JSON.stringify(data, null, 1));
};

/**
 * Plays Connect the Concept through its whole deck.
 *
 * Three rounds of a six-puzzle deck. The loop now runs to the end of the deck
 * and stops when a title repeats, which is how the game wraps
 * (`(prev + 1) % CONNECT_PUZZLES.length`) - so reaching the wrap is what proves
 * the full deck was dealt.
 *
 * The correct option is matched by its thread text rather than by index, because
 * the options are shuffled per play and an index would answer the wrong thing
 * most of the time. Every option is now also checked for non-empty text: an
 * option that renders blank is a puzzle a learner cannot answer, and it used to
 * pass unnoticed because the verdict column only recorded CORRECT or WRONG.
 */
const playConnect = async (page) => {
  const rounds = [];
  const titles = [];
  for (let i = 0; i < 12; i++) {
    const title = await page.evaluate(() => {
      const h = [...document.querySelectorAll('h3')].find(x => /Connect the Concept/.test(x.textContent));
      return h ? h.textContent.replace('Connect the Concept: ', '') : 'NONE';
    });
    // The game wraps by index, so a repeated title means we have seen the deck.
    if (title !== 'NONE' && titles.includes(title)) break;
    titles.push(title);

    const optionTexts = await page.evaluate(() =>
      [...document.querySelectorAll('.bg-option-btn')].map(b => b.textContent.trim()));
    const blankOptions = optionTexts.filter(t => !t).length;

    const clicked = await page.evaluate(() => {
      const opts = [...document.querySelectorAll('.bg-option-btn')];
      const target = opts.find(o => /reproduce itself|trace of it|every other level|arrow of time|negative feedback|updating beliefs|reversible|irreversible|feedback/i.test(o.textContent));
      if (!target) return null;
      target.click();
      return target.textContent.trim().slice(0, 40);
    });
    await new Promise(r => setTimeout(r, 600));

    const verdict = await page.evaluate(() => {
      const c = document.querySelector('.bg-result-card');
      return c ? (c.className.includes('success') ? 'CORRECT' : 'WRONG') : 'no result card';
    });
    rounds.push({ title, optionsShown: optionTexts.length, blankOptions, clicked, verdict });

    // Scope this to the game's own result card, and match its actual label.
    //
    // It used to be [...document.querySelectorAll('button')].find(x =>
    // /next/i.test(...)), which matches the global "Next up" nav item as readily
    // as the game's "Next Connection" button - so the audit answered one puzzle,
    // clicked straight out of the games screen into Next Up, and then reported
    // the other two games as "tab not found" because it was no longer in them.
    // Two of the three games had never been played by this script, and the
    // output looked like a report rather than a failure.
    const hasNext = await page.evaluate(() => {
      const b = [...document.querySelectorAll('.bg-result-card button')].find((x) =>
        /next connection/i.test(x.textContent)
      );
      if (!b) return false;
      b.click();
      return true;
    });
    if (!hasNext) break;
    await new Promise(r => setTimeout(r, 700));
  }

  return {
    puzzlesPlayed: rounds.length,
    distinctTitles: new Set(titles).size,
    blankOptions: rounds.filter(r => r.blankOptions > 0).map(r => r.title),
    unanswered: rounds.filter(r => r.clicked === null).map(r => r.title),
    noResult: rounds.filter(r => r.verdict === 'no result card').map(r => r.title),
    rounds,
  };
};

/**
 * Plays Counterintuitive through its whole deck.
 *
 * This used to click one answer, snapshot the page, and call it played. The deck
 * is six questions; five of them were never opened by anything, and the
 * "Next Intuition Check" button - the only way past a result card - was never
 * clicked at all. So a broken second question, a missing explanation, or a
 * source link that 404s on questions two through six passed every run.
 *
 * It also now reports each claim's own text, so a deck that silently stops
 * dealing new questions is visible as repeated claims rather than as a short
 * array nobody reads.
 */
const playMyth = async (page) => {
  const rounds = [];
  const seenClaims = [];
  for (let i = 0; i < 8; i++) {
    const claim = await page.evaluate(() => {
      const el = document.querySelector('.bg-myth-claim, .bg-claim, [class*="claim"]');
      return el ? el.textContent.trim() : null;
    });
    if (claim) seenClaims.push(claim);

    const answered = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')]
        .find((x) => /it.?s a myth|it.?s true/i.test(x.textContent));
      if (!b) return null;
      const label = b.textContent.trim();
      b.click();
      return label;
    });
    if (!answered) break;
    await new Promise((r) => setTimeout(r, 500));

    const result = await page.evaluate(() => {
      const card = document.querySelector('.bg-result-card');
      const link = card && card.querySelector('a[href]');
      return {
        verdict: card ? card.innerText.replace(/\s+/g, ' ').slice(0, 60) : 'no result card',
        // Every myth claim is checkable against a source. If one renders with
        // no link, the reader is asked to take it on faith.
        source: link ? link.getAttribute('href') : null,
      };
    });

    // Advance only through the game's own button, and only once the result card
    // is up - the same scoping bug that once sent this script out to Next Up.
    const hasNext = await page.evaluate(() => {
      const b = [...document.querySelectorAll('.bg-result-card button')]
        .find((x) => /next intuition check/i.test(x.textContent));
      if (!b) return false;
      b.click();
      return true;
    });
    rounds.push({ claim: claim ? claim.slice(0, 44) : null, answered, ...result });
    if (!hasNext) break;
    await new Promise((r) => setTimeout(r, 600));
  }

  const missingSource = rounds.filter((r) => r.claim && !r.source);
  return {
    questionsPlayed: rounds.length,
    distinctClaims: new Set(seenClaims).size,
    missingSource: missingSource.map((r) => r.claim),
    rounds,
  };
};

/**
 * Plays Explain It Back through its whole deck.
 *
 * Four rounds of an eight-prompt deck. The sprint advances by index and wraps,
 * so it now runs until a prompt repeats, which is what proves the full deck was
 * dealt rather than that four rounds happened to succeed.
 *
 * It reports how many of the required intuition cues the typed answer actually
 * matched. The game scores on that number, so a prompt whose keyConcepts cannot
 * be hit by an ordinary explanation is a prompt that scores every learner zero
 * and looks like a working game while it runs.
 */
const playExplain = async (page) => {
  const seen = [];
  const results = [];
  for (let i = 0; i < 14; i++) {
    const label = await page.evaluate(() => {
      const h = [...document.querySelectorAll('h3')].find(x => /Explain It Back/.test(x.textContent));
      return h ? h.textContent.trim() : 'NONE';
    });
    if (label !== 'NONE' && seen.includes(label)) break;
    seen.push(label);

    const started = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find(x => /start 30s timer/i.test(x.textContent));
      if (!b) return false;
      b.click();
      return true;
    });
    if (!started) break;
    await new Promise(r => setTimeout(r, 500));
    await page.type('textarea', 'momentum is how hard something is to stop and a heavy thing moving slowly still has lots of it');
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find(x => /submit explanation/i.test(x.textContent));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const outcome = await page.evaluate(() => {
      // Scoped to the sprint's own results panel.
      //
      // It used to read `document.querySelector('[role="status"]')`, which on this
      // screen is the "paused" note - an element that only exists when the timer
      // was paused. On a normal run there is no such element, so every prompt
      // reported "no feedback rendered" and the run would have failed for a
      // reason that had nothing to do with the game.
      const panel = document.querySelector('.bg-feynman-results');
      if (!panel) return 'no results rendered';
      const cues = [...panel.querySelectorAll('.bg-cue-pill')].map(c => c.textContent.trim());
      const peers = [...panel.querySelectorAll('blockquote')].length;
      // No matched cues means the explanation scored zero. That can be a fair
      // result for a weak answer, but it is worth seeing.
      return `cues matched ${cues.length}; peer examples ${peers}`;
    });
    results.push({ prompt: label, feedback: outcome });

    const hasNext = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find(x => /next concept sprint/i.test(x.textContent));
      if (!b) return false;
      b.click();
      return true;
    });
    if (!hasNext) break;
    await new Promise(r => setTimeout(r, 700));
  }

  return {
    promptsSeen: seen.length,
    distinctPrompts: new Set(seen).size,
    // A sprint that submits but renders no results panel is a sprint a learner
    // cannot finish. This used to read [role="status"], which on this screen is
    // the paused-timer note and only exists while paused, so every prompt read
    // as having no feedback.
    noResults: results.filter(r => r.feedback === 'no results rendered').map(r => r.prompt),
    results,
  };
};

/**
 * Plays the six Concept Puzzles games end to end.
 *
 * The script used to snapshot the hub and then play only the three Brain Games
 * modes, while printing "every game reached and played". Six of the nine games -
 * Concept Check, Concept Scrabble, Knowledge Chain, Definition Duel, Concept
 * Puzzle and Relativity Lab - were never opened by anything. A deck with an
 * unreachable card, a crash on mount, or an input that never fires would have
 * passed CI every single time.
 *
 * It also checks that Definition Duel is actually serving the philosophy deck.
 * The ten philosophy terms are held to the philosophy entries by a unit test,
 * but a unit test reads the array; it does not prove the game the array belongs
 * to will hand those clues to a player.
 */
const CLASSIC = [
  { name: 'Concept Check', clue: null },
  { name: 'Concept Scrabble', clue: null },
  { name: 'Knowledge Chain', clue: null },
  { name: 'Definition Duel', clue: '.duel-definition' },
  { name: 'Concept Puzzle', clue: null },
  { name: 'Relativity Lab', clue: null },
];

const PHILOSOPHY_CLUE_MARKERS = [
  /two thousand years/i,
  /physical description/i,
  /cells are replaced/i,
  /actually get wrong/i,
  /1963/,
  /awake right now/i,
  /merely allowing/i,
  /looks at it/i,
];

/** Clicks whatever the current game offers to advance, and reports if there was one. */
const advanceIfOffered = (page, patterns) =>
  page.evaluate((res) => {
    for (const src of res.patterns) {
      const re = new RegExp(src, 'i');
      const b = [...document.querySelectorAll('button')].find((x) => re.test(x.textContent));
      if (b && !/next up|return to universe/i.test(b.textContent)) {
        b.click();
        return true;
      }
    }
    return false;
  }, { patterns });

/** Types into the first visible text field, the way a player would. */
const typeInto = (page, text) =>
  page.evaluate((t) => {
    const field = [...document.querySelectorAll('input:not([type]), textarea, input[type="text"]')]
      .filter((f) => f.offsetParent !== null)[0];
    if (!field) return false;
    const proto = field.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement : window.HTMLInputElement;
    Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(field, t);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }, text);

/**
 * Plays Definition Duel properly.
 *
 * Answering wrong does not move you to the next card - handleSubmit returns
 * before advancing - so a script that submits a plausible guess reads the same
 * first clue forever. This used to report "20 clues served" while all twenty
 * were the same sentence about predators.
 *
 * The game does, however, say the answer out loud in its own feedback: "Not
 * quite. The answer was Predator." So a deliberate wrong answer is used to ask
 * the question, the answer is read back, and the correct one is submitted to
 * move on. That also exercises the wrong-answer path on every card, which is
 * the path a real player hits most.
 *
 * The round is 60 seconds of real time, so this stops the moment a philosophy
 * clue is dealt rather than grinding through the remaining cards. The philosophy
 * cards start at index 8, so it reaches them with time to spare.
 */
const playDuel = async (page) => {
  const clues = [];
  for (let i = 0; i < 20; i++) {
    const clue = await page.evaluate(() => {
      const e = document.querySelector('.duel-definition');
      return e ? e.textContent.trim() : null;
    });
    if (clue) clues.push(clue);
    if (clue && PHILOSOPHY_CLUE_MARKERS.some((re) => re.test(clue))) break;

    await typeInto(page, 'definitely not the answer');
    await new Promise((r) => setTimeout(r, 200));
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => /submit/i.test(x.textContent) && !x.disabled);
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    const told = await page.evaluate(() => {
      const f = document.querySelector('.duel-feedback');
      const m = f && /the answer was (.+?)\.?$/i.exec(f.textContent.trim());
      return m ? m[1] : null;
    });
    if (!told) break; // no feedback means this is not the duel any more

    await typeInto(page, told);
    await new Promise((r) => setTimeout(r, 150));
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => /submit/i.test(x.textContent) && !x.disabled);
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 1000)); // the card advances at 800ms
  }
  return clues;
};

/**
 * Leaves whatever game screen is showing and returns to the Concept Puzzles
 * grid, so the next game in the list can be opened.
 *
 * Games end in three different places - some have a Back button, some finish
 * onto a score screen that only offers a restart, and some replace the hub
 * entirely - so the fallback walks out through the bottom nav rather than
 * assuming one shape.
 */
const backToClassicHub = async (page) => {
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /back/i.test(x.textContent));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 700));

  const onHub = await page.evaluate(() => !!document.querySelector('.games-hub-new'));
  if (!onHub) {
    await clickByText(page, 'Flow');
    await new Promise((r) => setTimeout(r, 800));
  }
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /concept puzzles/i.test(x.textContent));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 700));
};

const playClassicGames = async (page) => {
  // The six live under the Concept Puzzles tab, not the Brain Games one.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /concept puzzles/i.test(x.textContent));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 900));

  const unreachable = [];
  const duelClues = [];

  for (const game of CLASSIC) {
    const opened = await page.evaluate((n) => {
      const card = [...document.querySelectorAll('.game-card-large')]
        .find((c) => c.textContent.includes(n));
      if (!card) return false;
      card.click();
      return true;
    }, game.name);
    if (!opened) { unreachable.push(game.name); continue; }
    await new Promise((r) => setTimeout(r, 1100));

    // Definition Duel needs its own player: a wrong answer does not advance
    // the card, so the generic loop below would re-read the first clue forever.
    if (game.name === 'Definition Duel') {
      const clues = await playDuel(page);
      duelClues.push(...clues);
      record('classic: Definition Duel', { cluesDealt: clues.length, clues });
      await backToClassicHub(page);
      continue;
    }

    // Three turns is enough to prove the round renders, takes input and moves
    // on. Only Definition Duel needs to dig further into a deck.
    const turns = [];
    for (let i = 0; i < 3; i++) {
      const typed = await typeInto(page, 'momentum');
      await new Promise((r) => setTimeout(r, 250));

      // Prefer a real, labelled control. The first enabled button on a game
      // screen is often an icon with no text - clicking one does nothing and the
      // round never moves, which reads as a game that will not advance.
      const advanced = await page.evaluate(() => {
        const usable = [...document.querySelectorAll('button')].filter(
          (x) => !x.disabled
            && x.textContent.trim().length > 0
            && !/next up|return to universe|^\s*(back|←)/i.test(x.textContent)
        );
        const labelled = usable.find((x) => /submit|next|answer|check|continue|reveal|done|start|play/i.test(x.textContent));
        const target = labelled || usable[0];
        if (!target) return null;
        const label = target.textContent.trim().slice(0, 30);
        target.click();
        return label;
      });
      turns.push({ typed, advanced });
      if (!advanced) break;
      await new Promise((r) => setTimeout(r, 1200));
    }

    record(`classic: ${game.name}`, { turns });

    await backToClassicHub(page);
  }

  return { unreachable, duelClues };
};

const main = async () => {
  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) {
    console.error('build/ not found. Run npm run build first.');
    process.exit(2);
  }
  const server = await serve(buildDir);
  const url = `http://localhost:${PORT}`;
  const chromePath = findChrome();
  if (!chromePath) {
    console.error('No Chrome binary found. Set CHROME_PATH.');
    process.exit(2);
  }
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

  await signIn(page, url);
  await clickByText(page, 'Flow');
  await new Promise((r) => setTimeout(r, 900));

  record('hub', await snapshot(page));

  // Brain Games tab, then each of the three games.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /brain games/i.test(x.textContent));
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 700));

  const unreachable = [];
  for (const [label, play] of [
    ['Connect the Concept', playConnect],
    ['Counterintuitive (True/Myth)', playMyth],
    ['Explain It Back (30s Sprint)', playExplain],
  ]) {
    const ok = await page.evaluate((t) => {
      const b = [...document.querySelectorAll('[role="tab"]')].find((x) => x.textContent.includes(t));
      if (!b) return false;
      b.click();
      return true;
    }, label);
    await new Promise((r) => setTimeout(r, 700));
    if (!ok) {
      unreachable.push(label);
      record(label, { error: 'tab not found' });
      continue;
    }
    record(label, await play(page));
    // Deck coverage is asserted, not reported.
    //
    // Connect the Concept played three rounds of six and Explain It Back four
    // of eight, and both looked identical in the output to a run that had dealt
    // everything. A game that stops advancing after the third puzzle now fails
    // here instead of producing a shorter array in a report.
    const played = audit[audit.length - 1];
    const coverage = played.distinctTitles ?? played.distinctClaims ?? played.distinctPrompts;
    const expected = { 'Connect the Concept': 6, 'Counterintuitive (True/Myth)': 6, 'Explain It Back (30s Sprint)': 8 }[label];
    if (expected && coverage !== undefined && coverage < expected) {
      unreachable.push(`${label} (${coverage}/${expected} items reached)`);
    }
    // An option that renders blank, or a prompt that scores without rendering
    // feedback, is a puzzle or a sprint a learner cannot finish.
    if (played.blankOptions && played.blankOptions.length) {
      unreachable.push(`${label} (blank options on: ${played.blankOptions.join(', ')})`);
    }
    if (played.noResults && played.noResults.length) {
      unreachable.push(`${label} (no results rendered on: ${played.noResults.join(', ')})`);
    }
  }

  // The six Concept Puzzles games, which until now nothing opened at all.
  const classic = await playClassicGames(page);
  unreachable.push(...classic.unreachable);

  const philosophyServed = classic.duelClues.filter((c) =>
    PHILOSOPHY_CLUE_MARKERS.some((re) => re.test(c))
  );
  record('definition-duel-philosophy-clues', {
    cluesSeen: classic.duelClues.length,
    philosophyClues: philosophyServed,
  });

  record('console-errors', consoleErrors);

  await browser.close();
  server.close();

  /*
   * A game this script could not reach is a failure, not a note.
   *
   * The audit used to print "tab not found" and carry on, and still exit 0, on
   * the grounds that it was a report and not a gate. That is how two of the three
   * brain games went unplayed for as long as the script existed: the run looked
   * successful and nobody was told. A verification step that can quietly verify
   * nothing is worse than no verification step, so an unreachable game now exits
   * non-zero and CI sees it.
   */
  if (unreachable.length) {
    console.error(`\nunreachable games: ${unreachable.join(', ')}`);
    process.exit(1);
  }
  if (consoleErrors.length) {
    console.error(`\nconsole errors: ${consoleErrors.length}`);
    process.exit(1);
  }
  // A deck can be correct in a unit test and still never reach a player. Prove
  // the game actually serves the philosophy clues, not just that the array has
  // them in it.
  if (!classic.duelClues.length) {
    console.error('\nDefinition Duel served no clues at all - the round never rendered.');
    process.exit(1);
  }
  if (!philosophyServed.length) {
    console.error(
      `\nDefinition Duel served ${classic.duelClues.length} clues and none were from the philosophy deck. ` +
      'The terms are in the data but the game is not dealing them.'
    );
    process.exit(1);
  }
  console.log(
    `\n--- every game reached and played; ${philosophyServed.length} philosophy clue(s) served by Definition Duel; no console errors ---`
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(2);
});