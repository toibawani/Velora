import {
  G,
  C,
  SOLAR_MASS_KG,
  schwarzschildRadiusKm,
  circularOrbitSpeed,
  escapeSpeed,
  twoSourceIntensity,
} from './physicsFormulas';

/**
 * These are the numbers a reader sees on the daily diagram, so they are
 * checked against values that can be looked up rather than against whatever
 * the function happened to return the first time it ran.
 */
describe('Schwarzschild radius', () => {
  test('one solar mass is about 2.95 km', () => {
    // 2GM/c^2 for 1.98847e30 kg is 2953.25 m.
    expect(schwarzschildRadiusKm(1)).toBeCloseTo(2.9532, 3);
  });

  test('scales linearly with mass', () => {
    expect(schwarzschildRadiusKm(10)).toBeCloseTo(schwarzschildRadiusKm(1) * 10, 6);
    // 1.27e7 km is a 3-significant-figure value; the exact result is
    // 12699359 km, about 0.005% below it. Use a 0.1% relative tolerance.
    const expected = 1.27e7;
    const actual = schwarzschildRadiusKm(4.3e6);
    expect(Math.abs(actual - expected) / expected).toBeLessThanOrEqual(0.001);
  });

  test('is computed from the constants, not a typed-in scale factor', () => {
    const fromConstants = (2 * G * SOLAR_MASS_KG) / (C * C) / 1000;
    expect(schwarzschildRadiusKm(1)).toBeCloseTo(fromConstants, 12);
  });

  test('rejects a mass that is zero, negative or not a number', () => {
    [0, -3, NaN, undefined, '4'].forEach((bad) => {
      expect(schwarzschildRadiusKm(bad)).toBeNull();
    });
  });
});

describe('orbital and escape speed', () => {
  test('Earth\'s orbital speed around the Sun is about 29.8 km/s', () => {
    const gmSun = G * SOLAR_MASS_KG;
    const oneAu = 1.495978707e11;
    expect(circularOrbitSpeed(gmSun, oneAu) / 1000).toBeCloseTo(29.79, 1);
  });

  test('escape speed is sqrt(2) times circular speed', () => {
    const gm = 3.986e14; // Earth
    const r = 6.371e6;
    expect(escapeSpeed(gm, r) / circularOrbitSpeed(gm, r)).toBeCloseTo(Math.SQRT2, 12);
  });

  test('escape speed at Earth\'s surface is about 11.2 km/s', () => {
    expect(escapeSpeed(3.986e14, 6.371e6) / 1000).toBeCloseTo(11.19, 1);
  });

  test('an invalid radius has no speed', () => {
    expect(circularOrbitSpeed(1, 0)).toBeNull();
    expect(escapeSpeed(0, 1)).toBeNull();
  });
});

describe('two-source interference', () => {
  test('is fully bright on the centre line', () => {
    expect(twoSourceIntensity(1, 1, 0)).toBeCloseTo(1, 12);
  });

  test('is dark exactly halfway to the first bright fringe', () => {
    // Path difference of half a wavelength: d sin(theta) = lambda / 2.
    expect(twoSourceIntensity(2, 1, 0.25)).toBeCloseTo(0, 12);
  });

  test('repeats every whole wavelength of path difference', () => {
    const first = twoSourceIntensity(1, 0.5, 0.5); // d sin(theta) = 0.5 = lambda
    const second = twoSourceIntensity(1, 0.5, 1); // d sin(theta) = 1 = 2 lambda
    expect(first).toBeCloseTo(1, 12);
    expect(second).toBeCloseTo(1, 12);
  });

  test('returns zero for a nonsensical wavelength rather than a curve', () => {
    expect(twoSourceIntensity(1, 0, 0.4)).toBe(0);
  });
});
