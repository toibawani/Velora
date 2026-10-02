import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CommandPalette from './CommandPalette';
import { SCREENS } from '../navigation';

test('opens the command palette and navigates to a destination', () => {
  const onNavigate = jest.fn();
  const onClose = jest.fn();
  render(<CommandPalette isOpen onClose={onClose} onNavigate={onNavigate} />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Search VELORA' }), { target: { value: 'insights' } });
  fireEvent.click(screen.getByRole('option', { name: /Insights/ }));
  expect(onNavigate).toHaveBeenCalledWith('analytics');
  expect(onClose).toHaveBeenCalled();
});

test('finds the dictionary and the games, which the palette used to omit', () => {
  // The palette listed four destinations while the app had seven screens. Cmd-K
  // is the fastest way to a screen there is one, so this is where a feature
  // nobody remembered to add is hardest to notice.
  const onNavigate = jest.fn();
  render(<CommandPalette isOpen onClose={jest.fn()} onNavigate={onNavigate} />);

  ['dictionary', 'games', 'journey'].forEach((id) => {
    expect(screen.getAllByRole('option', { name: new RegExp(SCREENS.find((s) => s.id === id).label) }).length)
      .toBeGreaterThan(0);
  });
});
