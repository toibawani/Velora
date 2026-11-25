import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PhysicsSimulations from './PhysicsSimulations';

/** The matchMedia stub in setupTests reads these, and reads them on render. */
const setPrefs = (prefs) => {
  global.__veloraMediaPrefs = prefs;
};

afterEach(() => {
  setPrefs({});
});

const openTab = (name) => {
  fireEvent.click(screen.getByRole('tab', { name: new RegExp(name, 'i') }));
};

describe('the physics laboratory', () => {
  test('lists all five experiments in one indexed tablist', () => {
    render(<PhysicsSimulations />);

    const tablist = screen.getByRole('tablist', { name: /experiments/i });
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');

    ['Newton', 'Projectile', 'vacuum drop', 'interference', 'Orbital'].forEach((label) => {
      expect(screen.getByRole('tab', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    });
  });

  test('opens on an experiment with a question, a figure and a readout', () => {
    render(<PhysicsSimulations />);

    expect(screen.getByRole('heading', { level: 2, name: /newton's second law/i })).toBeInTheDocument();
    expect(screen.getByText(/what does a push actually change/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /a cart of 10 kilograms/i })).toBeInTheDocument();
    expect(screen.getByText('Net force')).toBeInTheDocument();
  });

  // The old simulator used min(F, 0.18F) for friction while drawing an arrow
  // at μmg. On a 10 kg cart at 40 N that is 7.2 N of motion and a 17.6 N label.
  test('friction is μmg, and it is subtracted from the force exactly once', () => {
    render(<PhysicsSimulations />);

    fireEvent.click(screen.getByRole('button', { name: /μ = 0\.18/i }));

    // f = 0.18 x 10 x 9.8 = 17.64 N, so the net force is 40 - 17.64 = 22.36 N
    // and a = 22.36 / 10 = 2.236 m/s^2.
    expect(screen.getByText('22.4 N')).toBeInTheDocument();
    expect(screen.getByText('2.24 m/s²')).toBeInTheDocument();
  });

  test('the Newton readout follows both sliders', () => {
    render(<PhysicsSimulations />);

    fireEvent.change(screen.getByLabelText(/inertial mass/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/applied force/i), { target: { value: '20' } });

    // a = F/m = 20/4 = 5
    expect(screen.getByText('5.00 m/s²')).toBeInTheDocument();
  });

  test('the projectile readout matches the range and apex formulas', () => {
    render(<PhysicsSimulations />);
    openTab('Projectile');

    // R = 30^2 sin(90) / 9.8 = 91.8 m; H = (30 sin 45)^2 / 19.6 = 23.0 m.
    expect(screen.getByText('91.8 m')).toBeInTheDocument();
    expect(screen.getByText('23.0 m')).toBeInTheDocument();
    expect(screen.getByText('4.33 s')).toBeInTheDocument();
  });

  test('the free-fall note states the real mass ratio, not a rounded-down one', () => {
    render(<PhysicsSimulations />);
    openTab('vacuum drop');

    // 20 kg against 5 g is 4,000, which is the whole point of the paragraph.
    expect(screen.getByText(/4,000 times the force/i)).toBeInTheDocument();
    expect(screen.getByText('20 kg to 5 g')).toBeInTheDocument();
  });

  // The old readout printed wavelength x 300 / d while the tank's screen sat
  // 320 units away, and never sampled the pattern it claimed to measure.
  test('the wave readout compares a measured fringe with lambda L / d', () => {
    render(<PhysicsSimulations />);
    openTab('interference');

    // 24 x 220 / 70 = 75.4 px predicted; the sampled profile peaks near 80 px.
    expect(screen.getByText('75.4 px')).toBeInTheDocument();
    expect(screen.getByText('80 px')).toBeInTheDocument();
    expect(screen.getByText(/measured from the centre of the strip/i)).toBeInTheDocument();
  });

  test('the orbit readout prints speeds instead of formulas', () => {
    render(<PhysicsSimulations />);
    openTab('Orbital');

    // v = sqrt(380 / 78) = 2.21 u/s; escape = sqrt(2) v = 3.12 u/s.
    expect(screen.getByText('78.0 u')).toBeInTheDocument();
    expect(screen.getAllByText('2.21 u/s').length).toBeGreaterThan(0);
    expect(screen.getByText('3.12 u/s')).toBeInTheDocument();
  });

  test('reduced motion starts the orbit parked, with a working play button', () => {
    setPrefs({ reduce: true });
    render(<PhysicsSimulations />);
    openTab('Orbital');

    expect(screen.getByRole('status')).toHaveTextContent(/motion is switched off in your system settings/i);
    fireEvent.click(screen.getByRole('button', { name: /^play$/i }));
    expect(screen.getByRole('button', { name: /^pause$/i })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('reduced motion starts the waves as a still frame, not a faster loop', () => {
    setPrefs({ reduce: true });
    render(<PhysicsSimulations />);
    openTab('interference');

    expect(screen.getByRole('status')).toHaveTextContent(/motion is switched off in your system settings/i);
    fireEvent.click(screen.getByRole('button', { name: /^play$/i }));
    expect(screen.getByRole('button', { name: /^pause$/i })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('runs the wave simulation without complaint when motion is welcome', () => {
    setPrefs({ reduce: false });
    render(<PhysicsSimulations />);
    openTab('interference');

    expect(screen.getByRole('button', { name: /^pause$/i })).toBeInTheDocument();
    expect(screen.queryByText(/motion is switched off/i)).not.toBeInTheDocument();
  });
});
