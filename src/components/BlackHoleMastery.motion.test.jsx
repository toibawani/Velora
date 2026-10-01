import React from 'react';
import { render, act } from '@testing-library/react';
import BlackHoleMastery from './BlackHoleMastery';

const setReducedMotion = (matches) => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query.includes('prefers-reduced-motion') ? matches : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

const originalMatchMedia = window.matchMedia;
const originalRAF = global.requestAnimationFrame;
const originalResizeObserver = global.ResizeObserver;

beforeEach(() => {
  // jsdom has no canvas backend, so count the frames instead of reading pixels.
  global.requestAnimationFrame = jest.fn(() => 1);
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  global.requestAnimationFrame = originalRAF;
  global.ResizeObserver = originalResizeObserver;
});

const renderAndCountFrames = () => {
  global.requestAnimationFrame.mockClear();
  act(() => {
    render(<BlackHoleMastery onBack={jest.fn()} onOpenLab={jest.fn()} />);
  });
  return global.requestAnimationFrame.mock.calls.length;
};

test('keeps animating when motion is allowed', () => {
  setReducedMotion(false);
  expect(renderAndCountFrames()).toBeGreaterThan(0);
});

test('stops requesting frames when the visitor asked for reduced motion', () => {
  setReducedMotion(true);
  // Before this fix the count was 1 too, but it was the permanent accretion-disk
  // loop continuing; now it must be zero, meaning no loop was ever started.
  expect(renderAndCountFrames()).toBe(0);
});

test('resumes when the preference changes back mid-session', () => {
  let handler = null;
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: true,
    media: query,
    addEventListener: (_event, cb) => {
      handler = cb;
    },
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  expect(renderAndCountFrames()).toBe(0);

  act(() => {
    handler({ matches: false });
  });
  expect(global.requestAnimationFrame).toHaveBeenCalled();
});