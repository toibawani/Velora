import {
  advanceSpring,
  isSettled,
  snapSpring,
  SPRING_PRESETS,
  SpringConfig,
  SpringState,
} from './spring';

const STIFF: SpringConfig = { stiffness: 110, damping: 24, mass: 0.5 };

const run = (state: SpringState, target: number, seconds: number, config = STIFF): SpringState => {
  // 60fps worth of frames.
  const frames = Math.round(seconds * 60);
  for (let i = 0; i < frames; i += 1) {
    advanceSpring(state, target, config, 1 / 60);
  }
  return state;
};

describe('advanceSpring', () => {
  test('lands on the target and reports itself settled', () => {
    const state: SpringState = { value: 0, velocity: 0 };
    // This preset is overdamped (damping ratio ~1.6), so it creeps home rather
    // than ringing. The slow pole sits at about 5/s, which means the last few
    // percent take the best part of two seconds.
    run(state, 100, 2.2);

    expect(state.value).toBeCloseTo(100, 1);
    expect(isSettled(state, 100)).toBe(true);
  });

  test('actually overshoots and comes back, which is what makes it a spring', () => {
    const state: SpringState = { value: 0, velocity: 0 };
    let peak = 0;
    for (let i = 0; i < 120; i += 1) {
      advanceSpring(state, 100, { stiffness: 300, damping: 10, mass: 1 }, 1 / 60);
      peak = Math.max(peak, state.value);
    }
    expect(peak).toBeGreaterThan(100);
  });

  test('produces the same path whether the browser runs 30 or 120 fps', () => {
    const at30: SpringState = { value: 0, velocity: 0 };
    const at120: SpringState = { value: 0, velocity: 0 };

    for (let i = 0; i < 30; i += 1) advanceSpring(at30, 100, STIFF, 1 / 30);
    for (let i = 0; i < 120; i += 1) advanceSpring(at120, 100, STIFF, 1 / 120);

    // Frame-rate independent means the two agree at the same moment in time,
    // not merely that both arrive eventually.
    expect(at30.value).toBeCloseTo(at120.value, 1);
    expect(at30.velocity).toBeCloseTo(at120.velocity, 0);
  });

  test('survives the multi-second delta a backgrounded tab reports', () => {
    const state: SpringState = { value: 0, velocity: 0 };
    advanceSpring(state, 100, STIFF, 14);

    // Clamping means one enormous frame is treated as several ordinary ones:
    // it must not teleport and it must not blow up.
    expect(Number.isFinite(state.value)).toBe(true);
    expect(Math.abs(state.value)).toBeLessThan(200);

    run(state, 100, 1.5);
    expect(isSettled(state, 100)).toBe(true);
  });

  test('ignores a delta that is zero, negative, or not a number', () => {
    const state: SpringState = { value: 12, velocity: 3 };
    advanceSpring(state, 100, STIFF, 0);
    advanceSpring(state, 100, STIFF, -5);
    advanceSpring(state, 100, STIFF, NaN);

    expect(state).toEqual({ value: 12, velocity: 3 });
  });

  test('treats a zero mass as a snap rather than dividing by it', () => {
    const state: SpringState = { value: 0, velocity: 0 };
    advanceSpring(state, 50, { stiffness: 100, damping: 10, mass: 0 }, 1 / 60);

    expect(state.value).toBe(50);
    expect(state.velocity).toBe(0);
  });

  test('recovers if the value is somehow already broken', () => {
    const state: SpringState = { value: NaN, velocity: 0 };
    advanceSpring(state, 42, STIFF, 1 / 60);

    expect(state.value).toBe(42);
    expect(Number.isFinite(state.velocity)).toBe(true);
  });
});

describe('isSettled', () => {
  test('is false while there is still visible travel left', () => {
    expect(isSettled({ value: 90, velocity: 0 }, 100)).toBe(false);
    // Close to home but still moving: coasting would cross the target.
    expect(isSettled({ value: 99.99, velocity: 40 }, 100)).toBe(false);
  });

  test('is true once it is home and barely moving', () => {
    expect(isSettled({ value: 99.99, velocity: 0.01 }, 100)).toBe(true);
  });
});

describe('snapSpring', () => {
  test('puts it on the target with no momentum carried over', () => {
    const state: SpringState = { value: 4, velocity: -900 };
    snapSpring(state, 77);
    expect(state).toEqual({ value: 77, velocity: 0 });
  });
});

describe('SPRING_PRESETS', () => {
  test('both presets are usable, which means a mass above zero', () => {
    Object.values(SPRING_PRESETS).forEach((config) => {
      expect(config.mass).toBeGreaterThan(0);
      expect(config.stiffness).toBeGreaterThan(0);

      const state: SpringState = { value: 0, velocity: 0 };
      run(state, 10, 2, config);
      expect(isSettled(state, 10)).toBe(true);
    });
  });
});
