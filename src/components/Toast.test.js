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
