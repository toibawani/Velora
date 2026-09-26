/**
 * The physics behind the simulations, kept out of the React components so it
 * can be tested directly. The numbers are in metres and seconds, because a
 * formula you cannot check against a textbook is not worth showing anyone.
 */

export const G = 9.8;

/** Free-fall time from rest under gravity g: t = sqrt(2h/g). */
export const predictedFallTime = (height, g = G) => {
  if (!Number.isFinite(height) || height <= 0) return 0;
  return Math.sqrt((2 * height) / g);
};

/** A feather in air reaches terminal velocity quickly, so t = h / v. */
export const predictedAirborneTime = (height, terminalVelocity = 3.2) => {
  if (!Number.isFinite(height) || height <= 0) return 0;
  if (!Number.isFinite(terminalVelocity) || terminalVelocity <= 0) {
    return predictedFallTime(height);
  }
  return height / terminalVelocity;
};

/** Friction opposing a force, capped so it can never exceed it. */
export const frictionFor = (force, frictionEnabled, coefficient = 0.18) =>
  frictionEnabled ? Math.min(force, force * coefficient) : 0;

/** Net acceleration once friction is taken off the driving force. */
export const netAcceleration = (force, mass, frictionForce = 0) => {
  if (!Number.isFinite(force) || !Number.isFinite(mass) || mass <= 0) return 0;
  return (force - Math.max(0, frictionForce)) / mass;
};

const toRadians = (degrees) => (degrees * Math.PI) / 180;

/** Peak height of a projectile: h = (v sin θ)² / 2g. */
export const maxHeight = (velocity, angleDeg, g = G) => {
  const vy = velocity * Math.sin(toRadians(angleDeg));
  return (vy * vy) / (2 * g);
};

/** Time in the air, counting the descent as well: 2v sin θ / g. */
export const hangTime = (velocity, angleDeg, g = G) =>
  (2 * velocity * Math.sin(toRadians(angleDeg))) / g;

/** Flat-ground range: R = v² sin 2θ / g. Clamped, since a negative range is meaningless. */
export const projectileRange = (velocity, angleDeg, g = G) => {
  const range = (velocity * velocity * Math.sin(toRadians(2 * angleDeg))) / g;
  return Math.max(0, range);
};

/** Circular speed at radius r for gravitational parameter mu: v = sqrt(mu / r). */
export const circularSpeed = (mu, r) => {
  if (!Number.isFinite(mu) || !Number.isFinite(r) || r <= 0) return 0;
  return Math.sqrt(mu / r);
};

/** Escape speed at radius r: v = sqrt(2mu / r). */
export const escapeSpeed = (mu, r) => {
  if (!Number.isFinite(mu) || !Number.isFinite(r) || r <= 0) return 0;
  return Math.sqrt((2 * mu) / r);
};

/**
 * Orbit classification. A satellite is captured below escape velocity, in a
 * near-circular orbit close to circular speed, and lost above escape.
 */
export const orbitType = (speed, mu, r, circularTolerance = 0.2) => {
  if (speed >= escapeSpeed(mu, r)) return 'escape';
  if (Math.abs(speed - circularSpeed(mu, r)) < circularTolerance) return 'circular';
  if (speed < circularSpeed(mu, r)) return 'decaying';
  return 'elliptical';
};
