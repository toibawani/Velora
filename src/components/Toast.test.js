import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Toast from './Toast';

jest.useFakeTimers();

test('renders toast with message and dismiss button', () => {
  const mockClose = jest.fn();
  render(
    <Toast message="Profile saved" type="success" onClose={mockClose} />
  );

  expect(screen.getByText('Profile saved')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
});

test('announces errors assertively', () => {
  render(<Toast message="Something failed" type="error" onClose={() => {}} />);
  expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
});

test('calls onClose after default duration', () => {
  const mockClose = jest.fn();
  render(
    <Toast message="Auto dismiss" type="info" duration={3000} onClose={mockClose} />
  );

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  expect(mockClose).toHaveBeenCalledTimes(1);
});

test('shows a plain status word so the variant does not rest on color alone', () => {
  render(<Toast message="Profile saved" type="success" onClose={() => {}} />);
  expect(screen.getByText('Done')).toBeInTheDocument();
  // The message is still there, next to the word.
  expect(screen.getByText('Profile saved')).toBeInTheDocument();
});

test('renders a distinct status word for each variant', () => {
  const { rerender } = render(<Toast message="x" type="error" onClose={() => {}} />);
  expect(screen.getByText('Error')).toBeInTheDocument();
  rerender(<Toast message="x" type="info" onClose={() => {}} />);
  expect(screen.getByText('Note')).toBeInTheDocument();
});
