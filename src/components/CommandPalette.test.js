import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CommandPalette from './CommandPalette';

test('opens the command palette and navigates to a destination', () => {
  const onNavigate = jest.fn();
  const onClose = jest.fn();
  render(<CommandPalette isOpen onClose={onClose} onNavigate={onNavigate} />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Search VELORA' }), { target: { value: 'analytics' } });
  fireEvent.click(screen.getByRole('option', { name: /Analytics/ }));
  expect(onNavigate).toHaveBeenCalledWith('analytics');
  expect(onClose).toHaveBeenCalled();
});
