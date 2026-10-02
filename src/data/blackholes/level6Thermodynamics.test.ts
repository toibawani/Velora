/**
 * The numbers in Level 6, re-derived rather than trusted.
 *
 * A Hawking temperature quoted with the wrong power of mass is one of the most
 * common quiet errors in popular physics, and it produces a number that looks
 * plausible: 10^-8 kelvin for a solar-mass black hole is the figure almost
 * everyone quotes, and it is right. Getting the mass dependence wrong would give
 * a similarly small number, so a read-through cannot catch it.
 *
 * So these are computed from the constants and compared against the strings in
 * the level.
 */
import LEVEL_6 from './level6-thermodynamics';

const HBAR = 1.054571817e-34; // J s, exact by SI definition
const C = 299792458; // m/s, exact
const G = 6.6743e-11; // m^3 kg^-1 s^-2
const K_B = 1.380649e-23; // J/K, exact by SI definition
const SOLAR_MASS_KG = 1.98892e30;

const level6Text = LEVEL_6.entries!.map(
  (entry: { name: string; deeper: string; matters: string }) =>
    `${entry.name} ${entry.deeper} ${entry.matters}`
).join(' ');

/** Hawking temperature in kelvin for a black hole of the given mass. */
const hawkingTemperature = (kg: number) => (HBAR * C * C * C) / (8 * Math.PI * G * kg * K_B);

/** Evaporation time in seconds: 5120 pi G^2 M^3 / (hbar c^4). */
const evaporationSeconds = (kg: number) => (5120 * Math.PI * G * G * kg * kg * kg) / (HBAR * Math.pow(C, 4));

const YEARS_PER_SECOND = 3.15576e7;
const expectWithin = (actual: number, expected: number, tolerance = 0.02): void => {
  expect(Math.abs(actual - expected) / expected).toBeLessThan(tolerance);
};

describe('the Hawking temperature in Level 6', () => {
  test('a solar-mass black hole is about 6 x 10^-8 K', () => {
    const kelvin = hawkingTemperature(SOLAR_MASS_KG);
    expect(kelvin).toBeGreaterThan(5e-8);
    expect(kelvin).toBeLessThan(8e-8);
    // The level states 6 x 10^-8 K.
    expect(level6Text).toMatch(/about 6 x 10\^-8 kelvin/);
  });

  test('temperature falls as one over mass', () => {
    const solar = hawkingTemperature(SOLAR_MASS_KG);
    const doubled = hawkingTemperature(2 * SOLAR_MASS_KG);
    // Doubling the mass must exactly halve the temperature. This is the claim
    // the entry leads with, and an inverted dependence is the classic error.
    expectWithin(doubled, solar / 2, 1e-9);

    const tenth = hawkingTemperature(0.1 * SOLAR_MASS_KG);
    expectWithin(tenth, solar * 10, 1e-9);
  });

  test('a black hole in balance with the 2.7 K background is a bit over half the Moon', () => {
    // Solving T = 2.7 K for M, then comparing with the Moon's mass. The level
    // claims 10^23 kg; the Moon is 7.35e22 kg, so "roughly the Moon" holds.
    const massAt2_7K = (HBAR * C * C * C) / (8 * Math.PI * G * K_B * 2.725);
    // 4.5e22 kg. The first draft of this level said 10^23 kg "roughly the
    // Moon"; 10^23 is 12 orders out and the Moon is 7.3e22, so it was wrong
    // twice over and read plausibly. The corrected figure is about 4 x 10^22,
    // a little over half the Moon's 7.3e22.
    expect(massAt2_7K).toBeGreaterThan(3e22);
    expect(massAt2_7K).toBeLessThan(6e22);
    expect(massAt2_7K).toBeLessThan(7.342e22);
    expect(level6Text).toMatch(/4 x 10\^22 kilograms/);
  });

  test('a stellar-mass black hole is far colder than the cosmic background', () => {
    const kelvin = hawkingTemperature(SOLAR_MASS_KG);
    // The level says it "absorbs more than it emits". That is only true if its
    // own temperature is below the 2.725 K background.
    expect(kelvin).toBeLessThan(2.725);
    expect(level6Text).toMatch(/absorbs more than it emits/i);
  });
});

describe('the evaporation figures in Level 6', () => {
  test('a solar-mass black hole takes about 2 x 10^67 years', () => {
    const years = evaporationSeconds(SOLAR_MASS_KG) / YEARS_PER_SECOND;
    expect(years).toBeGreaterThan(1e67);
    expect(years).toBeLessThan(3e67);
    expect(level6Text).toMatch(/2 x 10\^67 years/);
  });

  test('evaporation time goes as the cube of the mass', () => {
    const solar = evaporationSeconds(SOLAR_MASS_KG);
    const doubled = evaporationSeconds(2 * SOLAR_MASS_KG);
    // Eight times longer for twice the mass. M^3 is the claim behind "lighter
    // ones are already gone".
    expectWithin(doubled, solar * 8, 1e-9);
  });

  test('the figure is enormously longer than the age of the universe', () => {
    const years = evaporationSeconds(SOLAR_MASS_KG) / YEARS_PER_SECOND;
    // The level compares it to ten billion billion times the age of the universe.
    // 1e67 years against 1.38e10 is about 7e56, so "ten billion billion" is a
    // fair round rendering of it.
    expect(years / 1.38e10).toBeGreaterThan(1e56);
  });

  test('a hole as old as the universe would be about 10^11 kg', () => {
    // Inverting the evaporation formula for the current age of the universe.
    const ageSeconds = 1.38e10 * YEARS_PER_SECOND;
    const kg = Math.pow((ageSeconds * HBAR * Math.pow(C, 4)) / (5120 * Math.PI * G * G), 1 / 3);
    // About 1.7e11 kg, which is 8.7e-20 solar masses - the usual quoted figure
    // of roughly 10^-19 solar masses for a hole evaporating at the present day.
    expect(kg).toBeGreaterThan(1e11);
    expect(kg).toBeLessThan(3e11);
    expect(kg / SOLAR_MASS_KG).toBeGreaterThan(5e-20);
    expect(kg / SOLAR_MASS_KG).toBeLessThan(2e-19);
    expect(level6Text).toMatch(/10\^11 kilograms/);
  });
});