import React from 'react';
import { KEYS, readValue } from '../utils/storage';
import { render, screen, fireEvent, act } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import BrainGames, { EXPLAIN_PROMPTS, CONNECT_PUZZLES, shuffleOptions } from './BrainGames';

const openGame = async (name) => {
  fireEvent.click(screen.getByRole('tab', { name: new RegExp(name, 'i') }));
  await act(async () => {});
};

describe('Brain Games', () => {
  beforeEach(() => localStorage.clear());

  test('offers the three games and does not invent other players', () => {
    render(<BrainGames onBack={() => {}} />);
    ['Connect the Concept', 'True/Myth', 'Explain It Back'].forEach((label) => {
      expect(screen.getByRole('tab', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    });
    expect(screen.queryByText(/players? online/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/leaderboard/i)).not.toBeInTheDocument();
  });

  test('a mashed answer button only counts once', async () => {
    render(<BrainGames onBack={() => {}} />);
    await openGame('True/Myth');

    const firstQuestion = screen.getByRole('heading', { level: 3 }).textContent;
    const choices = screen.getAllByRole('button').filter((b) => /true|myth/i.test(b.textContent));
    expect(choices.length).toBeGreaterThanOrEqual(2);

    fireEvent.click(choices[0]);
    fireEvent.click(choices[0]);
    fireEvent.click(choices[1]);

    // Still the same question, answered once: it did not race ahead.
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe(firstQuestion);
  });

  test('marks the example explanations as examples, not as quotes from people', async () => {
    render(<BrainGames onBack={() => {}} />);
    await openGame('Explain It Back');

    fireEvent.click(screen.getByRole('button', { name: /start 30s timer/i }));
    fireEvent.change(screen.getByLabelText(/your concept explanation/i), {
      target: { value: 'Momentum is how hard something is to stop, so a slow train still hits hard.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit explanation/i }));

    expect(screen.getAllByText(/written by velora/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not a quote/i).length).toBeGreaterThan(0);
  });

  test('says where the saved explanations came from', async () => {
    localStorage.setItem(
      'velora_explanations_momentum',
      JSON.stringify([{ id: 1, text: 'Momentum is mass times velocity.', votes: { clear: 3, funny: 0, mindBending: 0 } }])
    );

    render(<BrainGames onBack={() => {}} />);
    await openGame('Explain It Back');

    fireEvent.click(screen.getByRole('button', { name: /start 30s timer/i }));
    fireEvent.change(screen.getByLabelText(/your concept explanation/i), {
      target: { value: 'Momentum is how hard something is to stop, and mass and speed both count.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit explanation/i }));

    // The stored explanation from this device is actually read and shown.
    expect(screen.getByText(/Momentum is mass times velocity/)).toBeInTheDocument();
    expect(screen.getByText(/from this browser only/i)).toBeInTheDocument();
  });

  test('says plainly when nothing has been written for this term yet', async () => {
    render(<BrainGames onBack={() => {}} />);
    await openGame('Explain It Back');

    fireEvent.click(screen.getByRole('button', { name: /start 30s timer/i }));
    fireEvent.change(screen.getByLabelText(/your concept explanation/i), {
      target: { value: 'A first attempt at explaining this one in plain words.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit explanation/i }));

    expect(screen.getByText(/nothing from this browser for/i)).toBeInTheDocument();
  });

  test('the sprint cannot be submitted twice', async () => {
    render(<BrainGames onBack={() => {}} />);
    await openGame('Explain It Back');

    fireEvent.click(screen.getByRole('button', { name: /start 30s timer/i }));
    fireEvent.change(screen.getByLabelText(/your concept explanation/i), {
      target: { value: 'One clear explanation of the idea in a single sentence.' },
    });
    const submit = screen.getByRole('button', { name: /submit explanation/i });
    fireEvent.click(submit);
    fireEvent.click(submit);

    const stored = readValue(KEYS.MY_EXPLANATIONS, []);
    expect(stored).toHaveLength(1);
  });
});

describe('True or Myth accuracy', () => {
  beforeEach(() => localStorage.clear());

  const openMyth = () => {
    render(<BrainGames onBack={() => {}} />);
    fireEvent.click(screen.getByRole('tab', { name: /True\/Myth/i }));
  };

  const answer = (choice) =>
    fireEvent.click(
      screen.getByRole('button', {
        name: choice ? /it’s real/i : /it’s a myth/i,
      })
    );

  const advanceTo = (idx) => {
    for (let i = 0; i < idx; i += 1) {
      answer(false);
      fireEvent.click(screen.getByRole('button', { name: /next intuition check/i }));
    }
  };

  // The old text claimed gravity pulls "four thousand times harder" on a
  // 20 kg ball than on a falcon feather, and the rewrite nearly shipped
  // "forty thousand" instead. Both numbers were invented. The honest version
  // states the principle and names the real demonstration without a ratio.
  test('the feather drop names the principle instead of an invented ratio', () => {
    openMyth();
    advanceTo(1); // cathedral glass first, the feather is question two
    answer(true);
    expect(screen.getByText(/equivalence principle/i)).toBeInTheDocument();
    expect(screen.getByText(/geologist/i)).toBeInTheDocument();
    expect(screen.queryByText(/four thousand|forty thousand/i)).not.toBeInTheDocument();
  });

  // The Napoleon explanation used to convert French inches to modern units
  // in one step and never mention that the English reader's "five foot two"
  // was measuring with a different inch.
  test('the Napoleon answer no longer mixes up the two inch units', () => {
    openMyth();
    advanceTo(5); // Napoleon is the last of the six claims
    answer(false);
    expect(screen.getByText(/French and English inches were different lengths/i)).toBeInTheDocument();
  });

  test('every answered claim offers a source to check', () => {
    openMyth();
    answer(false);
    expect(screen.getByRole('link', { name: /read more/i })).toHaveAttribute(
      'href',
      expect.stringContaining('https://')
    );
  });
});

describe('no invented people in the game data', () => {
  const INVENTED = [
    'Priya S.',
    'Aiko T.',
    'Javier M.',
    'VELORA Scholar',
    'Scholar_',
    'Richard Feynman',
    'John Rawls',
    'C.H. Waddington',
  ];

  test('no source file attributes text to a named person', () => {
    // A rendered card said "Written by VELORA / example, not a quote" while the
    // data it rendered still claimed 'Richard Feynman, Lectures on Physics
    // (1961)'. The UI relabelled it; the data did not. Reading the file is the
    // only check that catches that, because rendering was already correct.
    const source = fs.readFileSync(path.join(__dirname, 'BrainGames.js'), 'utf8');
    INVENTED.forEach((name) => {
      expect(source).not.toMatch(new RegExp(`author:\\s*'${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`));
    });
  });

  test('every peer explanation carries a body, an author and no role claim', () => {
    const prompts = EXPLAIN_PROMPTS;
    expect(prompts.length).toBeGreaterThan(0);
    prompts.forEach((prompt) => {
      expect(prompt.peerExplanations.length).toBeGreaterThan(0);
      prompt.peerExplanations.forEach((peer) => {
        expect(typeof peer.body).toBe('string');
        expect(peer.body.length).toBeGreaterThan(40);
        expect(peer.by).toBeTruthy();
        expect(peer.role).toBeUndefined();
        expect(peer.author).toBeUndefined();
      });
    });
  });
});

describe('sprint content breadth', () => {
  test('offers more than three prompts, which is what it had', () => {
    expect(EXPLAIN_PROMPTS.length).toBeGreaterThanOrEqual(8);
  });

  test('every prompt has a distinct id and a distinct term', () => {
    const ids = EXPLAIN_PROMPTS.map((p) => p.id);
    const terms = EXPLAIN_PROMPTS.map((p) => p.term);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(terms).size).toBe(terms.length);
  });

  test('every prompt gives a real mission and at least six intuition cues', () => {
    EXPLAIN_PROMPTS.forEach((prompt) => {
      expect(prompt.targetAudience.length).toBeGreaterThan(40);
      expect(prompt.subject).toBeTruthy();
      expect(prompt.keyConcepts.length).toBeGreaterThanOrEqual(6);
      // Cues are matched as plain substrings against what the learner typed,
      // so a multi-word cue is fine -- 'gave up' fires on 'the price you gave
      // up'. What cannot work is an empty or single-character cue.
      prompt.keyConcepts.forEach((cue) => {
        expect(cue.length).toBeGreaterThan(2);
      });
    });
  });

  test('a plausible good answer actually matches at least two cues', () => {
    // Guards the cue lists themselves: a list of plausible-sounding words that
    // no real explanation would contain would show zero intuition cues forever,
    // which looks like the learner writing badly rather than a broken game.
    EXPLAIN_PROMPTS.forEach((prompt) => {
      const sample = prompt.peerExplanations[0].body.toLowerCase();
      const hits = prompt.keyConcepts.filter((cue) => sample.includes(cue));
      expect(hits.length).toBeGreaterThanOrEqual(2);
    });
  });

  test('spans more than the three subjects it started with', () => {
    const subjects = new Set(EXPLAIN_PROMPTS.map((p) => p.subject));
    expect(subjects.size).toBeGreaterThanOrEqual(5);
  });
});

describe('connect the concept answers are not always the first option', () => {
  test('the correct answer is not stuck at index 0 in every puzzle', () => {
    // All three puzzles shipped with correctIdx: 0, so the answer was always
    // option A and the game could be passed by clicking the top button.
    const positions = CONNECT_PUZZLES.map((p) => p.correctIdx);
    expect(new Set(positions).size).toBeGreaterThan(1);
  });

  test('shuffling is a real permutation, not a partial or duplicated one', () => {
    for (let trial = 0; trial < 200; trial += 1) {
      const order = shuffleOptions(4);
      expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3]);
    }
  });

  test('the correct answer reaches every position over many shuffles', () => {
    // The whole point of the fix: whatever order the buttons are drawn in, the
    // learner who understands the thread can pick it.
    const seen = new Set();
    for (let trial = 0; trial < 500; trial += 1) {
      const order = shuffleOptions(4);
      seen.add(order.indexOf(2));
    }
    expect(seen.size).toBe(4);
  });

  test('every puzzle has a correct index that exists', () => {
    CONNECT_PUZZLES.forEach((puzzle) => {
      expect(puzzle.correctIdx).toBeGreaterThanOrEqual(0);
      expect(puzzle.correctIdx).toBeLessThan(puzzle.options.length);
      expect(puzzle.options[puzzle.correctIdx]).toBeTruthy();
    });
  });
});

describe('connect the concept data points at the right answer', () => {
  // These are the threads the insights actually describe. If an option array is
  // reordered without moving correctIdx with it, the game marks a wrong answer
  // correct -- which is exactly what happened while writing this change.
  const THREADS = {
    'dissipation-arrow': 'one-way arrow of time',
    'homeostatic-equilibrium': 'negative feedback',
    'rational-updating': 'updating beliefs',
    'path-dependence': 'reproduce itself',
    'measurement-problem': 'only a trace of it',
    'scale-dependence': 'one level of description',
  };

  test('correctIdx points at the option that states the thread', () => {
    CONNECT_PUZZLES.forEach((puzzle) => {
      const thread = THREADS[puzzle.id];
      expect(thread).toBeTruthy();
      expect(puzzle.options[puzzle.correctIdx].toLowerCase()).toContain(thread);
    });
  });

  test('the option order is varied across puzzles rather than all-alike', () => {
    const positions = CONNECT_PUZZLES.map((p) => p.correctIdx);
    expect(new Set(positions).size).toBeGreaterThanOrEqual(3);
  });

  test('every puzzle has five terms from five different subjects', () => {
    CONNECT_PUZZLES.forEach((puzzle) => {
      expect(puzzle.terms.length).toBe(5);
      const subjects = puzzle.terms.map((t) => t.subject);
      expect(new Set(subjects).size).toBeGreaterThanOrEqual(3);
      puzzle.terms.forEach((t) => {
        expect(t.clue.length).toBeGreaterThan(20);
      });
    });
  });
});
