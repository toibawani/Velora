import {
  barrierTransmission,
  binaryEntropyBits,
  deBroglieWavelengthNm,
  landauerEnergy,
  logisticBifurcation,
  logisticStep,
  lorenzDivergence,
  lorenzStep,
  rabiSurvival,
  zenoSurvival,
  zenoSurvivalAtFixedTime,
} from './labMath';

/**
 * The Lab draws these functions. If they are wrong, the simulation is a
 * convincing picture of nothing, so each one is checked against a closed form
 * or a limiting case rather than against its own output.
 */

describe('barrierTransmission', () => {
  test('a barrier of zero width transmits everything', () => {
    expect(barrierTransmission({ energyEv: 3, barrierEv: 5, widthNm: 0 })).toBeCloseTo(1, 10);
  });

  test('a non-positive barrier is not a barrier', () => {
    expect(barrierTransmission({ energyEv: 3, barrierEv: 0, widthNm: 1 })).toBe(1);
  });

  test('below the barrier, transmission falls exponentially with width', () => {
    const thin = barrierTransmission({ energyEv: 4, barrierEv: 5, widthNm: 0.4 });
    const thick = barrierTransmission({ energyEv: 4, barrierEv: 5, widthNm: 0.8 });
    expect(thin).toBeGreaterThan(0);
    expect(thick).toBeGreaterThan(0);
    expect(thin).toBeGreaterThan(thick);
    expect(thick / thin).toBeLessThan(0.5);
  });

  test('at the barrier height the limit is finite and less than one', () => {
    const t = barrierTransmission({ energyEv: 5, barrierEv: 5, widthNm: 1.2 });
    expect(Number.isFinite(t)).toBe(true);
    expect(t).toBeGreaterThan(0);
    expect(t).toBeLessThan(1);
  });

  test('far above the barrier transmission approaches one', () => {
    const t = barrierTransmission({ energyEv: 9.9, barrierEv: 0.5, widthNm: 0.1 });
    expect(t).toBeGreaterThan(0.9);
  });

  test('transmission is bounded between zero and one for a sweep of inputs', () => {
    for (let energy = 0.5; energy <= 9; energy += 0.5) {
      for (let width = 0.1; width <= 2; width += 0.3) {
        const t = barrierTransmission({ energyEv: energy, barrierEv: 5, widthNm: width });
        expect(t).toBeGreaterThanOrEqual(0);
        expect(t).toBeLessThanOrEqual(1);
      }
    }
  });

  test('de Broglie wavelength shrinks as energy rises', () => {
    expect(deBroglieWavelengthNm(4)).toBeGreaterThan(deBroglieWavelengthNm(100));
    // An electron at 100 eV has a wavelength near 0.12 nm.
    expect(deBroglieWavelengthNm(100)).toBeCloseTo(0.123, 2);
  });
});

describe('Lorenz integration', () => {
  test('a tiny step moves the state only slightly', () => {
    const start = { x: 1, y: 1, z: 1 };
    const next = lorenzStep(start, {}, 1e-5);
    expect(Math.abs(next.x - start.x)).toBeLessThan(1e-3);
  });

  test('the same input gives the same output', () => {
    const a = lorenzStep({ x: 2, y: 3, z: 4 }, { sigma: 10, rho: 28, beta: 8 / 3 }, 0.01);
    const b = lorenzStep({ x: 2, y: 3, z: 4 }, { sigma: 10, rho: 28, beta: 8 / 3 }, 0.01);
    expect(a).toEqual(b);
  });

  test('nearby trajectories diverge for the classic chaotic parameters', () => {
    const exponent = lorenzDivergence({ sigma: 10, rho: 28, beta: 8 / 3 });
    expect(exponent).toBeGreaterThan(0.5);
    expect(Number.isFinite(exponent)).toBe(true);
  });

  test('a stable parameter set does not diverge as fast', () => {
    const chaotic = lorenzDivergence({ sigma: 10, rho: 28, beta: 8 / 3 }, { steps: 400 });
    const stable = lorenzDivergence({ sigma: 10, rho: 8, beta: 8 / 3 }, { steps: 400 });
    expect(stable).toBeLessThan(chaotic);
  });
});

describe('logistic map', () => {
  test('r = 2 drives any starting value to the fixed point 0.5', () => {
    let x = 0.2;
    for (let i = 0; i < 60; i += 1) x = logisticStep(2, x);
    expect(x).toBeCloseTo(0.5, 6);
  });

  test('r = 3.83 settles into a period-3 orbit', () => {
    let x = 0.4;
    for (let i = 0; i < 600; i += 1) x = logisticStep(3.83, x);
    const cycle = [];
    for (let i = 0; i < 3; i += 1) {
      cycle.push(x);
      x = logisticStep(3.83, x);
    }
    expect(x).toBeCloseTo(cycle[0], 5);
    expect(new Set(cycle.map((value) => value.toFixed(3))).size).toBe(3);
  });

  test('the bifurcation sweep returns the requested number of points', () => {
    const points = logisticBifurcation({ samples: 40, keep: 8 });
    expect(points).toHaveLength(320);
    points.forEach((point) => {
      expect(point.r).toBeGreaterThanOrEqual(2.4);
      expect(point.r).toBeLessThanOrEqual(4);
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(1);
    });
  });
});

describe('Zeno survival', () => {
  test('one measurement is ordinary Rabi survival', () => {
    const p = zenoSurvival({ omega: 2, tau: 0.3, measurements: 1 });
    expect(p).toBeCloseTo(Math.cos(0.3) ** 2, 10);
  });

  test('holding total time fixed, more measurements raise survival', () => {
    let previous = -1;
    for (let n = 1; n <= 60; n += 1) {
      const p = zenoSurvivalAtFixedTime({ omega: 1, totalTime: 2, measurements: n });
      expect(p).toBeGreaterThanOrEqual(previous - 1e-12);
      previous = p;
    }
    expect(zenoSurvivalAtFixedTime({ omega: 1, totalTime: 2, measurements: 200 })).toBeGreaterThan(0.99);
  });

  test('with a fixed interval instead, more measurements lengthen the run and lower survival', () => {
    const short = zenoSurvival({ omega: 1, tau: 0.3, measurements: 1 });
    const long = zenoSurvival({ omega: 1, tau: 0.3, measurements: 40 });
    expect(long).toBeLessThan(short);
  });

  test('a zero interval freezes the system completely', () => {
    expect(zenoSurvival({ omega: 2, tau: 0, measurements: 50 })).toBe(1);
  });

  test('survival stays inside [0, 1]', () => {
    for (let n = 1; n <= 40; n += 3) {
      const p = zenoSurvival({ omega: 3, tau: 0.4, measurements: n });
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
  });

  test('the unmeasured reference starts at one', () => {
    expect(rabiSurvival({ omega: 2, time: 0 })).toBe(1);
  });
});

describe('information bounds', () => {
  test('a fair bit has exactly one bit of entropy', () => {
    expect(binaryEntropyBits(0.5)).toBeCloseTo(1, 10);
  });

  test('a certain bit has no entropy', () => {
    expect(binaryEntropyBits(0)).toBe(0);
    expect(binaryEntropyBits(1)).toBe(0);
  });

  test('Landauer cost at room temperature is 2.87e-21 J', () => {
    expect(landauerEnergy(300)).toBeCloseTo(2.871e-21, 24);
  });

  test('the cost is zero at absolute zero', () => {
    expect(landauerEnergy(0)).toBe(0);
  });
});
