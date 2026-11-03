import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingTour from './OnboardingTour';

// The step data used to carry emoji strings and this file had no tests at all,
// so nothing checked that the first-run flow still renders after the swap to
// icon components.
test('opens on the welcome step and draws an icon rather than a glyph', () => {
  render(<OnboardingTour onComplete={jest.fn()} />);

  expect(screen.getByText('Welcome to VELORA.')).toBeInTheDocument();
  expect(screen.getByTestId('onboarding-illustration')).toContainHTML('<svg');
});

test('finishing the flow stores setup as a versioned record, not a bare string', () => {
  localStorage.clear();
  const onComplete = jest.fn();
  render(<OnboardingTour onComplete={onComplete} />);

  fireEvent.click(screen.getByText("I'm ready →"));
  fireEvent.click(screen.getByRole('button', { name: /Astrophysics/i }));
  fireEvent.click(screen.getByRole('button', { name: /Set My Domain/i }));
  fireEvent.click(screen.getByRole('button', { name: /Visual/i }));
  fireEvent.click(screen.getByRole('button', { name: /Save this answer/i }));
  fireEvent.click(screen.getByRole('button', { name: /Lock In My Intention/i }));
  fireEvent.click(screen.getByRole('button', { name: /Enter the Cosmos/i }));

  expect(onComplete).toHaveBeenCalled();
  const done = JSON.parse(localStorage.getItem('velora_onboarding_done'));
  expect(done.v).toBe(1);
  expect(done.data).toBe(true);
  const prefs = JSON.parse(localStorage.getItem('velora_onboarding_preferences'));
  expect(prefs.data).toMatchObject({ domain: 'physics', style: 'visual' });
});

test('the domain step offers real choices and the flow can be completed', () => {
  const onComplete = jest.fn();
  render(<OnboardingTour onComplete={onComplete} />);

  fireEvent.click(screen.getByText('I\'m ready →'));
  fireEvent.click(screen.getByRole('button', { name: /Astrophysics/i }));
  fireEvent.click(screen.getByRole('button', { name: /Set My Domain/i }));

  expect(screen.getByText('How do you learn best?')).toBeInTheDocument();
  expect(onComplete).not.toHaveBeenCalled();
});
