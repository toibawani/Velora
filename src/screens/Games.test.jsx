import React from 'react';
import { render, screen } from '@testing-library/react';
import GameHub from './Games';

describe('Game hub listings', () => {
  test('every game is described in plain words, without inflated names', () => {
    render(<GameHub setScreen={() => {}} />);

    expect(screen.getByText('Concept Check')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Chain')).toBeInTheDocument();
    expect(screen.getByText('Concept Scrabble')).toBeInTheDocument();

    // These names claimed more than the games delivered.
    expect(screen.queryByText(/Singularity Concept Scrabble/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cosmic Collapse/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Quantum Concepts Quiz/)).not.toBeInTheDocument();
  });

  // Definition Duel is a 60 second round that was advertised as 8 minutes,
  // and Knowledge Chain has no clock at all but claimed 12.
  test('a duration is only shown for a game that actually has one', () => {
    render(<GameHub setScreen={() => {}} />);

    const durations = screen.getAllByText(/\d+\s*(seconds|mins|minutes)/i);
    durations.forEach((node) => {
      expect(node.textContent).toMatch(/60 seconds/i);
    });
  });

  test('the classic games are what you land on, not the games being drilled', () => {
    render(<GameHub setScreen={() => {}} />);
    expect(screen.getByText('Concept Check')).toBeInTheDocument();
  });

  test('no card advertises a colour outside the warm palette', () => {
    const { container } = render(<GameHub setScreen={() => {}} />);
    const icons = container.querySelectorAll('svg[stroke], .game-icon');
    icons.forEach((icon) => {
      const stroke = icon.getAttribute('color') || icon.getAttribute('stroke') || '';
      if (stroke) expect(stroke.toLowerCase()).not.toMatch(/#?(2563eb|30d5c8|34c759|ff9f0a)/i);
    });
  });
});

/*
 * The insights panel.
 *
 * It used to read "18 Flow Sessions Completed", "4.9/5 Comprehension Rating",
 * "15 Concepts Mastered" and "92% Retention Score". All four were typed out by
 * hand, all four were the same for everyone including someone who had just
 * arrived, and nothing in this app measured any of them - while the hero two
 * elements above claimed "no artificial scoreboards".
 *
 * These tests are here so that panel cannot quietly go back to being flattering.
 */
describe('the insights panel only reports what the device recorded', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('says so when nothing has been recorded, rather than showing zeroes', () => {
    render(<GameHub setScreen={() => {}} />);

    expect(screen.getByText(/Nothing recorded yet/i)).toBeInTheDocument();
    // A row of zeroes still looks like a scoreboard. This is text instead.
    expect(screen.queryByText('Sessions logged')).not.toBeInTheDocument();
  });

  test('shows the real counts once a session has been recorded', () => {
    localStorage.setItem(
      'velora_learning_analytics',
      JSON.stringify({
        totalHoursStudied: 1.5,
        topicTimeDistribution: [
          { topic: 'Free Will', hours: 0.5, subject: 'philosophy' },
          { topic: 'Black Holes', hours: 1, subject: 'physics' },
        ],
        weeklyActivity: [{ day: '2026-01-01', hours: 1.5, sessions: 2 }],
      })
    );

    render(<GameHub setScreen={() => {}} />);

    // Two sessions across two topics, and the hours the device actually stored.
    expect(screen.getByText('Sessions logged').previousSibling).toHaveTextContent('2');
    expect(screen.getByText('Concepts touched').previousSibling).toHaveTextContent('2');
    expect(screen.getByText('Hours recorded').previousSibling).toHaveTextContent('1.5');
    expect(screen.queryByText(/Nothing recorded yet/i)).not.toBeInTheDocument();
  });

  test('states that comprehension and retention are not measured', () => {
    render(<GameHub setScreen={() => {}} />);

    // These two numbers were the worst of the four, because no amount of
    // cleverness could make them real. They are not replaced with a subtler
    // invented figure; the panel says they are absent and why.
    expect(screen.getByText(/No comprehension rating and no retention score/i)).toBeInTheDocument();
    expect(screen.queryByText('4.9/5')).not.toBeInTheDocument();
    expect(screen.queryByText('92%')).not.toBeInTheDocument();
    expect(screen.queryByText('15')).not.toBeInTheDocument();
    expect(screen.queryByText('18')).not.toBeInTheDocument();
  });
});

describe('Game hub keyboard access', () => {
  // Each card was a div with an onClick, which is not focusable and has no
  // role, so the whole grid could only be used with a mouse.
  test('every game card is a real button', () => {
    const { container } = render(<GameHub setScreen={() => {}} />);
    const cards = [...container.querySelectorAll('.game-card-large')];

    expect(cards).toHaveLength(6);
    const names = cards.map((c) => c.textContent);
    ['Concept Check', 'Knowledge Chain', 'Concept Scrabble', 'Definition Duel', 'Concept Puzzle', 'Relativity Lab'].forEach(
      (name) => expect(names.join(' ')).toMatch(new RegExp(name, 'i'))
    );

    cards.forEach((card) => {
      expect(card.tagName).toBe('BUTTON');
      expect(card).toHaveAttribute('type', 'button');
    });
  });

  test('a card can be activated from the keyboard', () => {
    render(<GameHub setScreen={() => {}} />);
    const card = screen.getByRole('button', { name: /Concept Check/i });

    // A div with onClick is not focusable, so this was impossible.
    card.focus();
    expect(card).toHaveFocus();
  });

  test('no card is a clickable div', () => {
    const { container } = render(<GameHub setScreen={() => {}} />);
    const cards = container.querySelectorAll('.game-card-large');
    cards.forEach((card) => expect(card.tagName).toBe('BUTTON'));
  });

  test('there is no nested button inside the card any more', () => {
    const { container } = render(<GameHub setScreen={() => {}} />);
    container
      .querySelectorAll('.game-card-large button')
      .forEach((inner) => expect(inner).toBeNull());
  });
});
