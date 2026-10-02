/**
 * The numbers in Level 1, re-derived rather than trusted.
 *
 * The Schwarzschild radius table in the level data is the most-repeated teaching
 * device in the whole subject, and it is the easiest kind of claim to have
 * quietly wrong: the figures are round, they get copied from one source to the
 * next, and a typo in the third decimal place survives because nobody re-checks
 * arithmetic they have seen a hundred times.
 *
 * So this recomputes them from the constants and compares against the strings
 * that actually appear in the content. If somebody edits "30 km" to "50 km" to
 * make an example land better, this fails.
 */

// G, the solar mass in kg, and c, as used for a Schwarzschild radius.
import LEVEL_1 from './level1-basics';

const G = 6.6743e-11; // m^3 kg^-1 s^-2 (CODATA 2018)
const C = 299792458; // m/s, exact by definition
const SOLAR_MASS_KG = 1.98892e30; // kg

/** 2GM/c^2, in kilometres, for a given number of solar masses. */
const schwarzschildRadiusKm = (solarMasses: number) =>
  (2 * G * solarMasses * SOLAR_MASS_KG) / (C * C) / 1000;

/**
 * Within 1% of `expected`.
 *
 * A relative tolerance rather than toBeCloseTo, because these values span nine
 * orders of magnitude and toBeCloseTo takes an absolute precision: asking for
 * 2.954 million km to three decimal places is a demand no float satisfies.
 *
 * One percent rather than one part in a thousand, because the text states these
 * to one or two significant figures ("about 3 km", "about 30 km"). Checking a
 * rounded figure to three decimals would be checking the rounding, not the
 * physics.
 */
const expectWithin = (actual: number, expected: number) => {
  expect(Math.abs(actual - expected) / expected).toBeLessThan(0.01);
};

const level1Text = LEVEL_1.entries!.map((entry) => `${entry.name} ${entry.deeper} ${entry.matters}`).join(' ');

describe('the Schwarzschild radius table in Level 1', () => {
  test('one solar mass gives about 3 km', () => {
    expectWithin(schwarzschildRadiusKm(1), 2.95);
    // The text says "about 3 km" for one solar mass.
    expect(level1Text).toMatch(/One solar mass is about 3 km/);
  });

  test('ten solar masses gives about 30 km, not 30 km per unit', () => {
    expectWithin(schwarzschildRadiusKm(10), 29.5);
    expect(level1Text).toMatch(/Ten solar masses is about 30 km/);
  });

  test('a million solar masses gives about 3 million km', () => {
    expectWithin(schwarzschildRadiusKm(1e6), 2.95e6);
    expect(level1Text).toMatch(/A million solar masses is about 3 million km/);
  });

  test('a billion solar masses fits inside the orbit of Neptune', () => {
    const billionSolar = schwarzschildRadiusKm(1e9);
    expectWithin(billionSolar, 2.95e9);
    // Neptune orbits at about 4.5 billion km. The claim in the text is that a
    // billion-solar-mass black hole would fit inside that.
    expect(billionSolar).toBeLessThan(4.5e9);
    expect(level1Text).toMatch(/about 3 billion km, which fits inside the orbit of Neptune/);
  });

  test('the Sun is far bigger than a black hole of its own mass', () => {
    // The text claims about 230,000 times. Recompute rather than trust it.
    const sunRadiusKm = 695700;
    const ratio = sunRadiusKm / schwarzschildRadiusKm(1);
    expect(ratio).toBeGreaterThan(200000);
    expect(ratio).toBeLessThan(260000);
    expect(level1Text).toMatch(/230,000 times smaller/);
  });

  test('the lunar-distance comparison in the text is right', () => {
    // This test earned its place. The first draft of this entry said "roughly
    // four times further than the Moon is from Earth", which is 2.953 million
    // km against 384,400 km: about eight times, not four. The claim survived a
    // read-through because it sounded plausible and the number above it was
    // correct. Only doing the arithmetic caught it.
    const moonDistanceKm = 384400;
    const millionSolar = schwarzschildRadiusKm(1e6);
    expect(millionSolar / moonDistanceKm).toBeGreaterThan(7);
    expect(millionSolar / moonDistanceKm).toBeLessThan(9);
    expect(level1Text).toMatch(/close to eight times the distance from Earth to the Moon/);
  });
});