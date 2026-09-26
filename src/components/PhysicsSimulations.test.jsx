import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PhysicsSimulations from './PhysicsSimulations';

/** The matchMedia stub in setupTests reads these, and reads them on render. */
const setPrefs = (prefs) => {
  global.__veloraMediaPrefs = prefs;
};

afterEach(() => {
  setPrefs({});
});

const openTab = async (name) => {
  fireEvent.click(screen.getByRole('tab', { name: new RegExp(name, 'i') }));
  await act(async () => {});
};

describe('Physics simulations', () => {
  test('offers all five topics as tabs', () => {
    render(<PhysicsSimulations />);
    ['Newton', 'Projectile', 'Drop', 'Wave', 'Orbital'].forEach((label) => {
      expect(screen.getByRole('tab', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    });
  });

  test('starts the wave sim paused with an explanation when motion is reduced', async () => {
    setPrefs({ reduce: true });
    render(<PhysicsSimulations />);
    await openTab('Wave');

    // A still frame, not a faster animation, plus a button that still works.
    expect(screen.getByRole('status')).toHaveTextContent(/motion is switched off in your system settings/i);
    const play = screen.getByRole('button', { name: /play/i });
    fireEvent.click(play);
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('starts the orbit sim paused when motion is reduced', async () => {
    setPrefs({ reduce: true });
    render(<PhysicsSimulations />);
    await openTab('Orbital');

    expect(screen.getByRole('status')).toHaveTextContent(/motion is switched off in your system settings/i);
    fireEvent.click(screen.getByRole('button', { name: /play/i }));
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  test('runs the wave sim without complaint when motion is welcome', async () => {
    setPrefs({ reduce: false });
    render(<PhysicsSimulations />);
    await openTab('Wave');

    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.queryByText(/motion is switched off/i)).not.toBeInTheDocument();
  });

  test('the Newton sim shows live F=ma numbers from the two sliders', () => {
    render(<PhysicsSimulations />);

    const mass = screen.getByLabelText(/inertial mass/i);
    const force = screen.getByLabelText(/applied force/i);

    fireEvent.change(mass, { target: { value: '4' } });
    fireEvent.change(force, { target: { value: '20' } });

    // a = F/m = 20/4 = 5
    expect(screen.getByText(/5\.00 m\/s²/)).toBeInTheDocument();
  });

  test('doubling the mass at the same force halves the acceleration', () => {
    render(<PhysicsSimulations />);
    const mass = screen.getByLabelText(/inertial mass/i);
    const force = screen.getByLabelText(/applied force/i);

    fireEvent.change(mass, { target: { value: '2' } });
    fireEvent.change(force, { target: { value: '10' } });
    expect(screen.getByText(/5\.00 m\/s²/)).toBeInTheDocument();

    fireEvent.change(mass, { target: { value: '4' } });
    expect(screen.getByText(/2\.50 m\/s²/)).toBeInTheDocument();
  });
});
