import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileNav from './MobileNav';

test('opens and closes mobile nav drawer when clicking toggle and item', () => {
  const mockSetScreen = jest.fn();
  const mockLogout = jest.fn();

  render(
    <MobileNav
      currentScreen="universe"
      setScreen={mockSetScreen}
      onLogout={mockLogout}
    />
  );

  const toggleBtn = screen.getByRole('button', { name: /open mobile navigation/i });
  expect(toggleBtn).toBeInTheDocument();

  // Click toggle to open
  fireEvent.click(toggleBtn);
  expect(screen.getByText('VELORA')).toBeInTheDocument();

  // Click nav item
  const learnBtn = screen.getByRole('button', { name: 'Learn' });
  fireEvent.click(learnBtn);
  expect(mockSetScreen).toHaveBeenCalledWith('learn');
});
