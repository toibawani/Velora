// FlowStateGame no longer pulls in an animation library, so there is nothing
// left to stub here. It used to mock motion/react because AnimatePresence
// would not mount the next panel until jsdom ran an exit animation it never
// runs; the panels are plain keyed divs now and mount immediately.

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FlowStateGame from './FlowStateGame';

const start = () =>
  fireEvent.click(screen.getByRole('button', { name: /begin flow session/i }));

describe('FlowStateGame clock', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T12:00:00Z'));
  });
  afterEach(() => jest.useRealTimers());

  // A counter ticking once a second kept running in a backgrounded tab.
  test('the clock is wall clock, so time really elapses', () => {
    render(<FlowStateGame duration={1} gameName="Test" onBack={() => {}} />);
    start();
    expect(screen.getByText(/^1:00 remaining$/)).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(10_000));
    expect(screen.getByText(/^0:50 remaining$/)).toBeInTheDocument();
  });

  test('a duration that is not a number does not wedge the session', () => {
    // duration * 60 used to be NaN here, and the check was NaN > 0, which is
    // false, so the timer never started and never ended.
    render(<FlowStateGame duration={undefined} gameName="Test" onBack={() => {}} />);
    start();
    expect(screen.getByText(/^10:00 remaining$/)).toBeInTheDocument();
  });

  test('running out of time ends the session', () => {
    render(<FlowStateGame duration={1} gameName="Test" onBack={() => {}} />);
    start();
    act(() => jest.advanceTimersByTime(61_000));
    expect(screen.queryByText('0:00')).not.toBeInTheDocument();
  });

  test('hiding the tab does not spend the clock', () => {
    render(<FlowStateGame duration={1} gameName="Test" onBack={() => {}} />);
    start();

    act(() => {
      Object.defineProperty(document, 'hidden', { value: true, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
      jest.advanceTimersByTime(20_000);
    });

    act(() => {
      Object.defineProperty(document, 'hidden', { value: false, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(screen.getByText(/^1:00 remaining$/)).toBeInTheDocument();
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
  });
});
