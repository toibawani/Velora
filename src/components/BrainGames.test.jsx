import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BrainGames from './BrainGames';

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

    const stored = JSON.parse(localStorage.getItem('velora_my_explanations') || '[]');
    expect(stored).toHaveLength(1);
  });
});
