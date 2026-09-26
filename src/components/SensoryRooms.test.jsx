import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SensoryRooms from './SensoryRooms';

describe('Sensory Rooms', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  // It cycled inhale/hold/exhale from the moment the screen opened, with no
  // control anywhere, in a screen whose whole purpose is calm.
  test('the breathing pacer does not start on its own', () => {
    render(<SensoryRooms />);
    expect(screen.getByText(/breathing paused/i)).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(20_000));
    expect(screen.getByText(/breathing paused/i)).toBeInTheDocument();
  });

  test('the pacer can be started and stopped', () => {
    render(<SensoryRooms />);
    fireEvent.click(screen.getByRole('button', { name: /start pacer/i }));

    expect(screen.getByText('inhale')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(4100));
    expect(screen.getByText('hold')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /stop pacer/i }));
    expect(screen.getByText(/breathing paused/i)).toBeInTheDocument();
  });

  test('the focus timer does not run until it is started', () => {
    render(<SensoryRooms />);
    act(() => jest.advanceTimersByTime(10_000));
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  test('the focus timer counts real seconds once started', () => {
    render(<SensoryRooms />);
    fireEvent.click(screen.getByRole('button', { name: /start focus block/i }));
    act(() => jest.advanceTimersByTime(65_000));
    expect(screen.getByText('23:55')).toBeInTheDocument();
  });

  test('pausing and resuming does not bank the time already used', () => {
    render(<SensoryRooms />);
    fireEvent.click(screen.getByRole('button', { name: /start focus block/i }));
    act(() => jest.advanceTimersByTime(60_000));
    fireEvent.click(screen.getByRole('button', { name: /pause session/i }));

    act(() => jest.advanceTimersByTime(60_000));
    expect(screen.getByText('24:00')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /start focus block/i }));
    act(() => jest.advanceTimersByTime(10_000));
    expect(screen.getByText('23:50')).toBeInTheDocument();
  });

  // 432 Hz is a number. Calling it cosmic is the A-432 tuning claim, and
  // "entraining calm focus" asserts a brain effect the evidence does not
  // support.
  test('does not call 432 Hz cosmic or claim brainwave entrainment', () => {
    render(<SensoryRooms />);
    expect(screen.queryByText(/cosmic harmonic/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/entraining/i)).not.toBeInTheDocument();
    expect(screen.getByText(/nothing about 432 hz is special/i)).toBeInTheDocument();
  });

  test('says the binaural evidence is weak rather than promising calm', () => {
    render(<SensoryRooms />);
    expect(screen.getByText(/evidence that it changes your brain state is weak/i)).toBeInTheDocument();
  });
});
