import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookOpen, Rocket } from 'lucide-react';
import EmptyState from './EmptyState';

describe('EmptyState Component', () => {
  test('renders icon, title, and description correctly', () => {
    const { container } = render(
      <EmptyState
        icon={<BookOpen size={28} aria-hidden="true" />}
        title="No reviews yet"
        description="Complete topics to unlock smart reviews"
        actionText="Start Learning"
        action={() => {}}
      />
    );

    // The icon is a component now, so the assertion is on the svg it renders
    // rather than on a glyph that used to arrive as a font.
    expect(container.querySelector('.empty-icon svg')).toBeInTheDocument();
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
    expect(screen.getByText('Complete topics to unlock smart reviews')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start learning/i })).toBeInTheDocument();
  });

  test('calls action callback on button click', () => {
    const handleAction = jest.fn();
    render(
      <EmptyState
        icon={<Rocket size={28} aria-hidden="true" />}
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
