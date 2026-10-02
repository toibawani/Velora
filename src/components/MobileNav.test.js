import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileNav from './MobileNav';
import { SCREENS } from '../navigation';

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

test('every nav entry carries a drawn icon rather than a text glyph', () => {
  render(<MobileNav currentScreen="universe" setScreen={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /open mobile navigation/i }));

  // Two entries used to render an emoji through a function that returned a
  // string, which the render code had to sniff for at runtime. An icon
  // component draws an svg and a glyph draws none, so this is the check that
  // keeps a glyph from coming back: every entry has to have a real icon.
  // Every entry in the shared registry, checked through the drawer. This used
  // to be a hardcoded list of the six the drawer happened to have, which meant
  // a seventh screen could be added to the app and never checked here. It is
  // now SCREENS itself, so the test cannot fall behind the registry.
  SCREENS.forEach(({ drawerLabel }) => {
    const button = screen.getByRole('button', { name: drawerLabel });
    expect(button.querySelector('svg')).not.toBeNull();
  });
});

test('the drawer offers every screen the app has, including the Journey', () => {
  render(<MobileNav currentScreen="universe" setScreen={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /open mobile navigation/i }));

  // The Journey was in no nav surface at all before this commit: grep for
  // 'journey' found exactly one hit in the whole of src, its own render line in
  // App.js. The screen existed and could not be reached.
  expect(screen.getByRole('button', { name: 'Journey' })).toBeInTheDocument();
});
