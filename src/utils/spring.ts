/**
 * A damped spring, in plain arithmetic.
 *
 * This exists so the hero plate field can spring without pulling in an
 * animation library. The motion it reproduces is the same one a physics
 * textbook means by "damped harmonic oscillator": the further from home, the
 * harder the pull back; the faster you are going, the more the damping pushes
 * against you.
 *
 *   acceleration = (-stiffness * (x - target) - damping * v) / mass
 *
 * Two things here matter more than cleverness:
 *
 * 1. Fixed sub-steps. Integrating with whatever delta the display happened to
 *    hand us makes the motion depend on frame rate, so a 120Hz phone and a
 *    throttled one would visibly disagree. Real time is chopped into 240Hz
 *    slices and each slice is integrated the same way, so the path is the path.
 *
 * 2. A clamped delta. Come back to a backgrounded tab and the browser will
 *    report a delta of several seconds. Integrated naively that either throws
 *    the value across the screen or never settles. Anything past MAX_DELTA is
 *    treated as "we missed it" and the spring simply resumes.
 */

export interface SpringConfig {
  /** How hard it pulls toward the target. */
  stiffness: number;
  /** How quickly it loses energy. */
  damping: number;
  mass: number;
}

export interface SpringState {
  value: number;
  velocity: number;
}

/** 240Hz. Small enough that the error against the exact solution is invisible. */
const SUBSTEP = 1 / 240;

/** Longest frame we are willing to integrate in one go: ~15fps. */
const MAX_DELTA = 1 / 15;

/** Below these the eye has given up and the loop is burning battery for nothing. */
const SETTLED_DISTANCE = 0.05;
const SETTLED_SPEED = 0.5;

/**
 * Moves one spring `dt` seconds toward `target`, mutating `state`.
 *
 * Mutating is deliberate: the plate field runs this for eight plates across two
 * axes every frame, and allocating an object per spring per frame is the sort
 * of thing that turns into a visible GC hitch on a mid-range phone.
 */
export function advanceSpring(
  state: SpringState,
  target: number,
  config: SpringConfig,
  dt: number
): void {
  if (!Number.isFinite(dt) || dt <= 0) return;
  if (!Number.isFinite(target)) {
    state.value = target;
    state.velocity = 0;
    return;
  }

  // A mass of zero makes the acceleration infinite, so treat it as "snap".
  const mass = config.mass > 0 ? config.mass : 1;
  if (config.mass <= 0) {
    state.value = target;
    state.velocity = 0;
    return;
  }

  const elapsed = Math.min(dt, MAX_DELTA);
  let remaining = elapsed;

  while (remaining > 0) {
    const step = remaining > SUBSTEP ? SUBSTEP : remaining;
    // Semi-implicit Euler: update velocity first, then use the new velocity for
    // position. Explicit Euler diverges at these stiffness values.
    const acceleration =
      (-config.stiffness * (state.value - target) - config.damping * state.velocity) / mass;
    state.velocity += acceleration * step;
    state.value += state.velocity * step;
    remaining -= step;
  }

  // A spring that has drifted into NaN (a corrupted stage size, say) would
  // poison every frame forever. Land it on the target instead of hanging.
  if (!Number.isFinite(state.value) || !Number.isFinite(state.velocity)) {
    state.value = target;
    state.velocity = 0;
  }
}

/** True once the spring is close enough that continuing to animate is pointless. */
export function isSettled(
  state: SpringState,
  target: number,
  distance = SETTLED_DISTANCE,
  speed = SETTLED_SPEED
): boolean {
  return Math.abs(state.value - target) < distance && Math.abs(state.velocity) < speed;
}

/**
 * Snaps a spring onto its target. Used when an animation should not be shown —
 * reduced motion, or a resize that would otherwise look like a lunge.
 */
export function snapSpring(state: SpringState, target: number): void {
  state.value = target;
  state.velocity = 0;
}

export const SPRING_PRESETS: Record<string, SpringConfig> = {
  /** The plate field's journey from the resting fan into the grid. */
  plate: { stiffness: 110, damping: 24, mass: 0.5 },
  /** Pointer parallax: slower and softer, so the field feels like it is breathing. */
  pointer: { stiffness: 60, damping: 18, mass: 1 },
};
