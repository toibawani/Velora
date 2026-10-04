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
  // The edge-input trace. This game has no score and no submit, so the shape of
  // bug that was live elsewhere - a second click booking a second advance - has
  // nothing to attach to. The risk here is arithmetic instead: a slider taken to
  // its limit, where the time-dilation factor diverges, must not print NaN or
  // Infinity at the reader.
  test('no slider extreme prints NaN, Infinity, undefined or null', () => {
    render(<RelativityLab onBack={() => {}} />);
    const [mass, radius, duration] = screen.getAllByRole('slider');

    const scan = () => document.body.textContent;
    expect(scan()).not.toMatch(/NaN|Infinity|undefined|null/);

    // Closest the radius slider gets to the horizon, at both mass extremes.
    // timeDilationFactor is Infinity below r/r_s = 1.0001, so this is the case
    // that has to say "Diverges at the horizon" rather than print the number.
    fireEvent.change(radius, { target: { value: radius.min } });
    expect(scan()).not.toMatch(/NaN|Infinity|undefined|null/);

    fireEvent.change(mass, { target: { value: mass.min } });
    expect(scan()).not.toMatch(/NaN|Infinity|undefined|null/);

    fireEvent.change(mass, { target: { value: mass.max } });
    expect(scan()).not.toMatch(/NaN|Infinity|undefined|null/);

    fireEvent.change(radius, { target: { value: radius.max } });
    fireEvent.change(duration, { target: { value: duration.max } });
    expect(scan()).not.toMatch(/NaN|Infinity|undefined|null/);
  });

  // The divergence branch in formatDistantTime is unreachable through the UI:
  // timeDilationFactor only returns Infinity at r/r_s <= 1.0001, the slider stops
  // at 1.02, and the closest preset is 1.05. Two guards therefore protect a
  // state no reader can reach, and no test can prove them, because no test can
  // get there either.
  //
  // So this does not claim to cover them. It pins the value at the closest
  // approach the UI does allow, computed rather than copied, which is the part
  // that is reachable and the part that could quietly go wrong.
  test('the closest approach the slider allows produces the right finite factor', () => {
    render(<RelativityLab onBack={() => {}} />);
    const radius = screen.getAllByRole('slider')[1];
    fireEvent.change(radius, { target: { value: radius.min } });

    // t/t0 = 1 / sqrt(1 - r_s/r), at the slider's minimum r/r_s.
    const ratio = Number(radius.min);
    const expected = 1 / Math.sqrt(1 - 1 / ratio);
    expect(screen.getByText(`${expected.toFixed(2)} hours`)).toBeInTheDocument();
  });

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
