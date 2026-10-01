import React from 'react';
import { KEYS, readValue } from '../utils/storage';
import { render, screen, fireEvent, act } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import BrainGames, { EXPLAIN_PROMPTS } from './BrainGames';

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
