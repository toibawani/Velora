/**
 * The physics the daily diagrams actually draw.
 *
 * Every number a diagram prints comes from this file, and every function here
 * has a test with a known value. The alternative - a slider that produces a
 * plausible-looking curve and a hard-coded label beside it - is how a
 * simulation teaches something false while looking authoritative.
 *
 * Units are named in the function, not in a comment somewhere else: km, m/s,
 * solar masses. A radius returned in metres that is printed as kilometres is
 * the kind of bug a test with a known value catches immediately.
 */

/** Gravitational constant, m^3 kg^-1 s^-2 (CODATA 2018). */
export const G = 6.6743e-11;

/** Speed of light in vacuum, m/s (exact, by definition of the metre). */
export const C = 299792458;

/** One solar mass, kg (IAU nominal value). */
export const SOLAR_MASS_KG = 1.98847e30;

/**
 * The Schwarzschild radius of a mass, in kilometres.
 *
 *     r_s = 2GM / c^2
 *
 * This is the radius of the event horizon of a non-rotating, uncharged black
 * hole: the distance at which the escape speed equals the speed of light.
 * For one solar mass it comes out at about 2.95 km, which is the figure the
 * diagram prints, so the label and the geometry cannot disagree.
 */
export const schwarzschildRadiusKm = (massSolar) => {
  if (!Number.isFinite(massSolar) || massSolar <= 0) return null;
  return (2 * G * massSolar * SOLAR_MASS_KG) / (C * C) / 1000;
};

/**
 * The speed needed to stay in a circular orbit, m/s.
 *
 *     v = sqrt(GM / r)
 *
 * `gm` is the standard gravitational parameter in m^3 s^-2, `radius` is in
 * metres. Using GM rather than G and M separately means the same function
 * works for a planet, a star or an arbitrary toy mass.
 */
export const circularOrbitSpeed = (gm, radius) => {
  if (!Number.isFinite(gm) || !Number.isFinite(radius) || gm <= 0 || radius <= 0) return null;
  return Math.sqrt(gm / radius);
};

/**
 * The escape speed from the same point, m/s.
 *
 *     v_esc = sqrt(2GM / r)
 *
 * Exactly sqrt(2) times the circular-orbit speed. That ratio is the whole
 * point of the orbit diagram: below it the path closes, above it the path
 * leaves and never returns.
 */
export const escapeSpeed = (gm, radius) => {
  const circular = circularOrbitSpeed(gm, radius);
  return circular === null ? null : circular * Math.SQRT2;
};

/**
 * Relative intensity on a screen lit by two coherent point sources.
 *
 *     I(theta) = 4 I0 cos^2( (pi d sin(theta)) / lambda )
 *
 * Returned normalised to 0..1 (I0 = 1/4). Bright fringes sit where the path
 * difference `d sin(theta)` is a whole number of wavelengths, which is what
 * the diagram's caption says in words.
 */
export const twoSourceIntensity = (separation, wavelength, sinTheta) => {
  if (!Number.isFinite(separation) || !Number.isFinite(wavelength) || wavelength <= 0) return 0;
  const phase = (Math.PI * separation * sinTheta) / wavelength;
  return Math.cos(phase) ** 2;
};
