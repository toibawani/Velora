import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RelativityLab from './RelativityLab';

const setMotionPref = (reduce) => {
  global.__veloraMediaPrefs = reduce ? { 'prefers-reduced-motion': true } : {};
};

describe('Relativity Lab', () => {
  beforeEach(() => setMotionPref(false));
  afterEach(() => setMotionPref(false));

  // The written explanation for each preset existed in the data and was
  // never rendered anywhere.
  test('shows the note for the selected preset', () => {
    render(<RelativityLab onBack={() => {}} />);
    expect(screen.getByText(/supermassive black hole at the centre/i)).toBeInTheDocument();
  });

  test('the note changes when another preset is chosen', () => {
    render(<RelativityLab onBack={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /sun/i }));
    expect(screen.getByText(/2\.95 km/i)).toBeInTheDocument();
  });

  // Gargantua is a film prop. It sat in a list of observed objects with the
  // same treatment and nothing marking it as invented.
  test('marks the fictional black hole as fictional', () => {
    render(<RelativityLab onBack={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /gargantua/i }));

    expect(screen.getByText(/not a real object/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gargantua \(fictional\)/i })).toBeInTheDocument();
  });

  // Cygnus X-1 has been a candidate for fifty years. No stellar-mass black
  // hole has been confirmed by direct observation.
  test('does not call Cygnus X-1 confirmed', () => {
    render(<RelativityLab onBack={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /cygnus/i }));
    expect(screen.getByText(/leading stellar-mass black hole candidate/i)).toBeInTheDocument();
    expect(screen.queryByText(/first confirmed/i)).not.toBeInTheDocument();
  });

  test('does not claim time stands still at the horizon', () => {
    render(<RelativityLab onBack={() => {}} />);
    expect(screen.queryByText(/time stood still/i)).not.toBeInTheDocument();
  });

  // The lab animated from mount with no play control and no reduced-motion
  // check, unlike the other simulations.
  test('respects reduced motion by not scheduling frames', () => {
    setMotionPref(true);
    const raf = jest.spyOn(window, 'requestAnimationFrame');
    render(<RelativityLab onBack={() => {}} />);

    // At most the single still frame that draws the static picture.
    expect(raf.mock.calls.length).toBeLessThanOrEqual(1);
    raf.mockRestore();
  });

  test('animates when motion is allowed', () => {
    const raf = jest.spyOn(window, 'requestAnimationFrame');
    render(<RelativityLab onBack={() => {}} />);
    expect(raf).toHaveBeenCalled();
    raf.mockRestore();
  });
});
