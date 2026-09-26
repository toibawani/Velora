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
