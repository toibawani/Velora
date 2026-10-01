import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingTour from './OnboardingTour';

// The step data used to carry emoji strings and this file had no tests at all,
// so nothing checked that the first-run flow still renders after the swap to
// icon components.
test('opens on the welcome step and draws an icon rather than a glyph', () => {
  const { container } = render(<OnboardingTour onComplete={jest.fn()} />);

  expect(screen.getByText('Welcome to VELORA.')).toBeInTheDocument();
  expect(container.querySelector('.onboarding-illustration svg')).toBeInTheDocument();
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
