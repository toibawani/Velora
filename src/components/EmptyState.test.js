import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState Component', () => {
  test('renders icon, title, and description correctly', () => {
    render(
      <EmptyState
        icon="📚"
        title="No reviews yet"
        description="Complete topics to unlock smart reviews"
        actionText="Start Learning"
        action={() => {}}
      />
    );

    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
    expect(screen.getByText('Complete topics to unlock smart reviews')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start learning/i })).toBeInTheDocument();
  });

  test('calls action callback on button click', () => {
    const handleAction = jest.fn();
    render(
      <EmptyState
        icon="🚀"
        title="Empty"
        description="Nothing here"
        actionText="Take Action"
        action={handleAction}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /take action/i }));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
