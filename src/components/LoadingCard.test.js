import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingCard from './LoadingCard';

test('renders correct count of skeleton cards', () => {
  render(<LoadingCard count={4} />);
  // The skeletons are aria-hidden by design, so a test id is the only honest
  // way to count what was rendered.
  expect(screen.getAllByTestId('loading-card')).toHaveLength(4);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
