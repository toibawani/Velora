/**
 * Numerical models behind the Lab.
 *
 * These are the equations the screens draw. They live here, away from the
 * components, for one reason: a simulation that cannot be tested is a picture of
 * a simulation. Everything in this file has a closed-form check or a known
 * limiting behaviour, and the tests in src/utils/labMath.test.js assert it.
 *
 * Units are explicit in the argument names. Energies are in electronvolts,
 * lengths in nanometres, times in arbitrary units unless stated.
 */

export const PLANCK_EV_S = 4.135667696e-15; // h in eV·s
export const HBAR_EV_S = 6.582119569e-16; // ħ in eV·s
export const ELECTRON_MASS_KG = 9.1093837015e-31;
export const HBAR_J_S = 1.054571817e-34;
export const ELEMENTARY_CHARGE = 1.602176634e-19;

/**
 * Transmission through a rectangular potential barrier, exact for a
 * one-dimensional, time-independent Schrödinger equation.
 *
 * For E > V0 the wavevector inside the barrier is real; for E < V0 it is
 * imaginary and the transmission decays exponentially with width. Both branches
 * come from the same matching conditions, and the function switches at E = V0
 * where T = 1 / (1 + m V0 L² / (2ħ²)).
 */
export function barrierTransmission({ energyEv, barrierEv, widthNm, massKg = ELECTRON_MASS_KG }) {
  const E = Number(energyEv);
  const V = Number(barrierEv);
  const L = Math.max(Number(widthNm), 0) * 1e-9;
  if (!Number.isFinite(E) || !Number.isFinite(V) || !Number.isFinite(L)) return 0;
  if (L === 0) return 1;
  // A barrier at or below zero energy is not a barrier; the particle passes.
  if (V <= 0) return 1;

  const hbar = HBAR_J_S;
  const m = massKg;
  const eJ = E * ELEMENTARY_CHARGE;
  const vJ = V * ELEMENTARY_CHARGE;

  if (Math.abs(eJ - vJ) < 1e-12 * Math.max(vJ, 1e-30)) {
    // The E = V limit, where k = κ = 0 and the naive formula is 0/0.
    const alpha = (m * vJ * L * L) / (2 * hbar * hbar);
    return 1 / (1 + alpha);
  }

  if (eJ < vJ) {
    const kappa = Math.sqrt((2 * m * (vJ - eJ)) / (hbar * hbar));
    const k = Math.sqrt((2 * m * eJ) / (hbar * hbar));
    const sinh = Math.sinh(kappa * L);
    const prefactor = ((k * k + kappa * kappa) ** 2 * sinh * sinh) / (4 * k * k * kappa * kappa);
    return 1 / (1 + prefactor);
  }

  const k1 = Math.sqrt((2 * m * eJ) / (hbar * hbar));
  const k2 = Math.sqrt((2 * m * (eJ - vJ)) / (hbar * hbar));
  const sin = Math.sin(k2 * L);
  const prefactor = ((k1 * k1 - k2 * k2) ** 2 * sin * sin) / (4 * k1 * k1 * k2 * k2);
  return 1 / (1 + prefactor);
}

/** de Broglie wavelength in nanometres for an electron at an energy in eV. */
export function deBroglieWavelengthNm(energyEv, massKg = ELECTRON_MASS_KG) {
  const eJ = Math.max(Number(energyEv), 1e-9) * ELEMENTARY_CHARGE;
  const p = Math.sqrt(2 * massKg * eJ);
  return (6.62607015e-34 / p) * 1e9;
}

/**
 * One classical Runge–Kutta 4 step of the Lorenz system.
 * dx/dt = σ(y − x), dy/dt = x(ρ − z) − y, dz/dt = xy − βz
 */
export function lorenzStep(state, { sigma = 10, rho = 28, beta = 8 / 3 } = {}, dt = 0.005) {
  const { x, y, z } = state;
  const f = (s) => ({
    x: sigma * (s.y - s.x),
    y: s.x * (rho - s.z) - s.y,
    z: s.x * s.y - beta * s.z,
  });
  const k1 = f({ x, y, z });
  const k2 = f({ x: x + (dt / 2) * k1.x, y: y + (dt / 2) * k1.y, z: z + (dt / 2) * k1.z });
  const k3 = f({ x: x + (dt / 2) * k2.x, y: y + (dt / 2) * k2.y, z: z + (dt / 2) * k2.z });
  const k4 = f({ x: x + dt * k3.x, y: y + dt * k3.y, z: z + dt * k3.z });
  return {
    x: x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    y: y + (dt / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
    z: z + (dt / 6) * (k1.z + 2 * k2.z + 2 * k3.z + k4.z),
  };
}

/**
 * Separation growth between two nearby Lorenz trajectories, used as a finite
 * time estimate of the largest Lyapunov exponent. Positive means divergence.
 */
export function lorenzDivergence({ sigma = 10, rho = 28, beta = 8 / 3 } = {}, { steps = 12000, dt = 0.005 } = {}) {
  let a = { x: 1, y: 1, z: 1 };
  let b = { x: 1 + 1e-8, y: 1, z: 1 };
  const separation = (p, q) => Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z);
  const initial = separation(a, b);
  let sum = 0;
  let counted = 0;
  for (let i = 0; i < steps; i += 1) {
    a = lorenzStep(a, { sigma, rho, beta }, dt);
    b = lorenzStep(b, { sigma, rho, beta }, dt);
    const d = separation(a, b);
    if (d > 0 && Number.isFinite(d)) {
      // Renormalise so the two trajectories stay in the linear regime.
      const scale = initial / d;
      b = {
        x: a.x + (b.x - a.x) * scale,
        y: a.y + (b.y - a.y) * scale,
        z: a.z + (b.z - a.z) * scale,
      };
      sum += Math.log(d / initial);
      counted += 1;
    }
  }
  if (!counted) return 0;
  return sum / (counted * dt);
}

/** The logistic map. The whole of chaos in one line. */
export const logisticStep = (r, x) => Number(r) * Number(x) * (1 - Number(x));

/**
 * Bifurcation data: for each r, run the map past its transient and keep the
 * distinct late values. This is a sweep, so the length is bounded by the caller.
 */
export function logisticBifurcation({ rMin = 2.4, rMax = 4, samples = 420, transient = 300, keep = 40 } = {}) {
  const points = [];
  for (let i = 0; i < samples; i += 1) {
    const r = rMin + ((rMax - rMin) * i) / (samples - 1);
    let x = 0.4;
    for (let n = 0; n < transient; n += 1) x = logisticStep(r, x);
    for (let n = 0; n < keep; n += 1) {
      x = logisticStep(r, x);
      points.push({ r, x });
    }
  }
  return points;
}

/**
 * Survival probability after N ideal projective measurements, for a two-level
 * system driven at Rabi frequency omega, with total time fixed at N * tau.
 * P = cos^(2N)(omega tau / 2). At omega tau = 0 this is 1; at N = 1 it is the
 * ordinary Rabi survival probability.
 */
export function zenoSurvival({ omega = 1, tau = 0.2, measurements = 10 } = {}) {
  const N = Math.max(1, Math.round(Number(measurements)));
  const w = Number(omega);
  const t = Math.max(Number(tau), 0);
  const base = Math.cos((w * t) / 2);
  const p = base ** (2 * N);
  return Math.min(1, Math.max(0, p));
}

/** Total time represented by a Zeno run, so the readout can state it. */
export const zenoTotalTime = ({ tau = 0.2, measurements = 10 } = {}) =>
  Math.max(0, Number(tau)) * Math.max(1, Math.round(Number(measurements)));

/**
 * The honest form of the Zeno comparison: total time is held fixed, so adding
 * measurements shortens each interval (τ = T/N) rather than extending the
 * experiment. This is the only version in which survival rises with N, which is
 * the effect the Zeno name refers to.
 */
export const zenoSurvivalAtFixedTime = ({ omega = 1, totalTime = 2, measurements = 10 } = {}) => {
  const N = Math.max(1, Math.round(Number(measurements)));
  return zenoSurvival({ omega, tau: Math.max(0, Number(totalTime)) / N, measurements: N });
};

/**
 * The Rabi survival probability with no measurement at all. The Zeno plot
 * shows this as the reference line the measurements are compared against.
 */
export const rabiSurvival = ({ omega = 1, time = 2 } = {}) =>
  Math.min(1, Math.max(0, Math.cos((Number(omega) * Number(time)) / 2) ** 2));

/* -------------------------------------------------------------------------
   The oscillating reaction
   ------------------------------------------------------------------------- */

/**
 * The Oregonator's scaled parameters. These are the values at which the
 * two-variable reduction has a stable limit cycle: f = 1, eps = 0.02, q = 0.002.
 * They are dimensionless; they are not molar concentrations and not a recipe.
 */
export const OREGONATOR_DEFAULTS = { f: 1, eps: 0.02, q: 0.002 };

/**
 * One classical Runge-Kutta 4 step of the Oregonator:
 *   eps dx/dt = x(1 - x) - f z (x - q)/(x + q),   dz/dt = x - z
 *
 * eps is small, so this system is stiff: the caller must keep dt proportional
 * to eps or the integration leaves the physical range. oregonatorRun does that.
 */
export function oregonatorStep(state, { f = 1, eps = 0.02, q = 0.002 } = {}, dt = 4e-4) {
  const F = Number(f);
  const E = Math.max(Number(eps), 1e-6);
  const Q = Math.max(Number(q), 1e-9);
  const { x, z } = state;

  const derivative = (s) => ({
    x: (s.x * (1 - s.x) - (F * s.z * (s.x - Q)) / Math.max(s.x + Q, 1e-9)) / E,
    z: s.x - s.z,
  });

  const k1 = derivative({ x, z });
  const k2 = derivative({ x: x + (dt / 2) * k1.x, z: z + (dt / 2) * k1.z });
  const k3 = derivative({ x: x + (dt / 2) * k2.x, z: z + (dt / 2) * k2.z });
  const k4 = derivative({ x: x + dt * k3.x, z: z + dt * k3.z });

  return {
    x: x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    z: z + (dt / 6) * (k1.z + 2 * k2.z + 2 * k3.z + k4.z),
  };
}

/**
 * Integrates the Oregonator and reports what the trajectory does. The step is
 * tied to eps because the model is stiff; samples are subsampled for drawing,
 * while the period is measured from every integration step in the late window.
 *
 * The period is the mean interval between upward crossings of the window's mean
 * x, which is robust for a relaxation oscillation and meaningless for a fixed
 * point. oscillating is false when the late amplitude is negligible.
 */
export function oregonatorRun({
  f = 1,
  eps = 0.02,
  q = 0.002,
  duration = 40,
  dt,
  sampleLimit = 900,
} = {}) {
  const E = Math.min(0.2, Math.max(Number(eps) || 0.02, 1e-4));
  const stable = E * 0.02;
  const stepDt = Math.max(1e-6, Math.min(Number(dt) || stable, stable));
  const steps = Math.min(600000, Math.max(400, Math.round(Math.max(1, Number(duration)) / stepDt)));
  const span = steps * stepDt;
  const keepEvery = Math.max(1, Math.floor(steps / sampleLimit));
  const windowStart = Math.floor(steps * 0.6);

  let state = { x: 0.1, z: 0.1 };
  const samples = [{ t: 0, x: state.x, z: state.z }];
  const late = [];
  let diverged = false;

  for (let i = 1; i <= steps; i += 1) {
    const next = oregonatorStep(state, { f, eps: E, q }, stepDt);
    if (!Number.isFinite(next.x) || !Number.isFinite(next.z) || next.x < -10 || next.x > 10) {
      diverged = true;
      break;
    }
    state = next;
    if (i >= windowStart) late.push(state.x);
    if (i % keepEvery === 0) samples.push({ t: i * stepDt, x: state.x, z: state.z });
  }

  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  late.forEach((value) => {
    if (value < min) min = value;
    if (value > max) max = value;
    sum += value;
  });
  const mean = late.length ? sum / late.length : state.x;

  let crossings = 0;
  for (let i = 1; i < late.length; i += 1) {
    if (late[i - 1] < mean && late[i] >= mean) crossings += 1;
  }

  const windowSpan = (late.length * stepDt) || 1;
  const period = crossings > 0 ? windowSpan / crossings : null;
  const amplitude = Number.isFinite(max - min) ? max - min : 0;

  return {
    samples,
    period,
    min: Number.isFinite(min) ? min : state.x,
    max: Number.isFinite(max) ? max : state.x,
    mean,
    amplitude,
    final: state,
    oscillating: !diverged && period !== null && amplitude > 0.02,
    diverged,
    span,
    dt: stepDt,
  };
}

/**
 * Shannon entropy of a binary distribution, in bits. Used by the Landauer
 * readout on the information panel, where the point is that one bit of
 * uncertainty costs k_B T ln 2 when it is erased.
 */
export function binaryEntropyBits(p) {
  const q = Math.min(1, Math.max(0, Number(p)));
  if (q === 0 || q === 1) return 0;
  return -(q * Math.log2(q) + (1 - q) * Math.log2(1 - q));
}

/** Landauer energy for one bit at a temperature in kelvin, in joules. */
export const landauerEnergy = (temperatureK) => 1.380649e-23 * Number(temperatureK) * Math.LN2;

/**
 * Kullback–Leibler divergence in bits between two Bernoulli distributions,
 * clipped so a zero probability gives a finite (large) number rather than
 * Infinity. The simulation panel uses it to show how far a biased memory is
 * from the uniform guess it replaces.
 */
export function klDivergenceBits(p, q) {
  const a = Math.min(1 - 1e-9, Math.max(1e-9, Number(p)));
  const b = Math.min(1 - 1e-9, Math.max(1e-9, Number(q)));
  return a * Math.log2(a / b) + (1 - a) * Math.log2((1 - a) / (1 - b));
}

/**
 * The Drake estimate, with the factors named the way the panel labels them.
 *
 * This is not a measurement and the function does not pretend to be one: it
 * multiplies six numbers, four of which have never been measured, and returns
 * the expected number of detectable civilisations in the galaxy. It returns 0
 * for a negative or non-finite factor rather than a NaN, because the panel has
 * to render something when a slider is dragged to an edge.
 */
export const DRAKE_DEFAULTS = {
  starRate: 1.5,
  habitablePerStar: 0.2,
  lifeFraction: 0.1,
  intelligenceFraction: 0.01,
  technologyFraction: 0.1,
  lifetimeYears: 1000,
};

export function drakeNumber({
  starRate = DRAKE_DEFAULTS.starRate,
  habitablePerStar = DRAKE_DEFAULTS.habitablePerStar,
  lifeFraction = DRAKE_DEFAULTS.lifeFraction,
  intelligenceFraction = DRAKE_DEFAULTS.intelligenceFraction,
  technologyFraction = DRAKE_DEFAULTS.technologyFraction,
  lifetimeYears = DRAKE_DEFAULTS.lifetimeYears,
} = {}) {
  const factors = [starRate, habitablePerStar, lifeFraction, intelligenceFraction, technologyFraction, lifetimeYears];
  if (factors.some((value) => !Number.isFinite(Number(value)) || Number(value) < 0)) return 0;
  return factors.reduce((product, value) => product * Number(value), 1);
}

/**
 * The chance that a galaxy with expectation n holds no other civilisation,
 * under a Poisson model. This is the honest reading of the Drake product: the
 * expectation is small, and a small expectation still leaves most skies empty.
 */
export const emptySkyProbability = (n) => {
  const value = Number(n);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.exp(-value);
};
