import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingCard from './LoadingCard';

test('renders correct count of skeleton cards', () => {
  const { container } = render(<LoadingCard count={4} />);
  const cards = container.querySelectorAll('.loading-card');
  expect(cards.length).toBe(4);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
