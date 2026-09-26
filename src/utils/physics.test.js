import {
  predictedFallTime,
  predictedAirborneTime,
  frictionFor,
  netAcceleration,
  maxHeight,
  hangTime,
  projectileRange,
  circularSpeed,
  escapeSpeed,
  orbitType,
} from './physics';

describe('free fall and terminal velocity', () => {
  // A body released from 100 m in a vacuum lands in sqrt(2h/g) = 4.52 s.
  test('predicts the textbook drop time from rest', () => {
    expect(predictedFallTime(100)).toBeCloseTo(4.5175, 3);
  });

  test('doubles the time for four times the height', () => {
    expect(predictedFallTime(400)).toBeCloseTo(2 * predictedFallTime(100), 3);
  });

  test('refuses to divide by a zero or negative height', () => {
    expect(predictedFallTime(0)).toBe(0);
    expect(predictedFallTime(-10)).toBe(0);
    expect(predictedFallTime(NaN)).toBe(0);
  });

  // The feather is slow in air because of drag, which free fall ignores.
  test('gives the feather a much longer time in air than in vacuum', () => {
    expect(predictedAirborneTime(100)).toBeCloseTo(31.25, 2);
    expect(predictedAirborneTime(100)).toBeGreaterThan(predictedFallTime(100) * 6);
  });

  test('falls back to free fall if terminal velocity is unusable', () => {
    expect(predictedAirborneTime(100, 0)).toBeCloseTo(predictedFallTime(100), 6);
  });
});

describe("Newton's second law", () => {
  test('friction can never exceed the force driving it', () => {
    expect(frictionFor(100, true)).toBeLessThanOrEqual(100);
    expect(frictionFor(100, false)).toBe(0);
  });

  test('subtracts friction from the applied force', () => {
    // (10 N - 1.8 N) / 2 kg
    expect(netAcceleration(10, 2, 1.8)).toBeCloseTo(4.1, 6);
  });

  test('gives zero rather than dividing by a zero mass', () => {
    expect(netAcceleration(10, 0)).toBe(0);
  });

  test('opposes motion when the driving force is reversed', () => {
    expect(netAcceleration(-10, 2, 1.8)).toBeCloseTo(-5.9, 6);
  });
});

describe('projectile motion', () => {
  // Fired at 45 degrees, the classic optimum for range.
  test('a 45 degree launch travels furthest for a given speed', () => {
    const at45 = projectileRange(20, 45);
    expect(projectileRange(20, 30)).toBeLessThan(at45);
    expect(projectileRange(20, 60)).toBeLessThan(at45);
  });

  test('fired straight up, the range is zero', () => {
    expect(projectileRange(20, 90)).toBeCloseTo(0, 6);
  });

  test('height and hang time agree with the range', () => {
    // At 45 degrees h = v²/4g and R = v²/g, so the range is four times the peak
    // height: the projectile covers half the range on the way up.
    const h = maxHeight(20, 45);
    expect(projectileRange(20, 45)).toBeCloseTo(4 * h, 6);
  });

  test('hang time counts the way back down as well as up', () => {
    expect(hangTime(20, 90)).toBeCloseTo(4.0816, 3);
  });

  test('a negative angle is treated as a flat shot, not a backwards range', () => {
    expect(projectileRange(20, -45)).toBe(0);
  });
});

describe('orbits', () => {
  const mu = 380;
  const r = 85;

  test('circular speed is sqrt(mu / r)', () => {
    expect(circularSpeed(mu, r)).toBeCloseTo(Math.sqrt(mu / r), 9);
  });

  test('escape speed is sqrt(2) times circular', () => {
    expect(escapeSpeed(mu, r) / circularSpeed(mu, r)).toBeCloseTo(Math.SQRT2, 6);
  });

  test('circular speed is flagged as circular', () => {
    expect(orbitType(circularSpeed(mu, r), mu, r)).toBe('circular');
  });

  test('at or above escape speed the orbit is lost', () => {
    expect(orbitType(escapeSpeed(mu, r), mu, r)).toBe('escape');
    expect(orbitType(escapeSpeed(mu, r) * 1.5, mu, r)).toBe('escape');
  });

  test('a satellite too slow for its orbit decays', () => {
    expect(orbitType(circularSpeed(mu, r) * 0.5, mu, r)).toBe('decaying');
  });

  test('a speed between circular and escape gives an ellipse', () => {
    expect(orbitType(circularSpeed(mu, r) * 1.2, mu, r)).toBe('elliptical');
  });

  test('a zero radius is not a division by zero', () => {
    expect(circularSpeed(mu, 0)).toBe(0);
    expect(escapeSpeed(mu, 0)).toBe(0);
  });
});