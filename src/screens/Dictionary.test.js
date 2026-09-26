import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dictionary from './Dictionary';

describe('Curious Dictionary', () => {
  test('renders top-level Curious Dictionary with cross-subject terms', () => {
    const mockSetScreen = jest.fn();
    render(<Dictionary setScreen={mockSetScreen} />);

    expect(screen.getByText('Curious Dictionary')).toBeInTheDocument();
    expect(screen.getByText('Momentum')).toBeInTheDocument();
    expect(screen.getByText('Epistemology')).toBeInTheDocument();
  });

  test('filters by cross-subject search query', () => {
    const mockSetScreen = jest.fn();
    render(<Dictionary setScreen={mockSetScreen} />);

    const searchInput = screen.getByLabelText(/search across all subjects/i);
    fireEvent.change(searchInput, { target: { value: 'momentum' } });

    expect(screen.getByText('Momentum')).toBeInTheDocument();
    expect(screen.queryByText('Epistemology')).not.toBeInTheDocument();
  });

  test('filters by subject pill selection', () => {
    const mockSetScreen = jest.fn();
    render(<Dictionary setScreen={mockSetScreen} />);

    const philosophyBtn = screen.getByRole('button', { name: /philosophy/i });
    fireEvent.click(philosophyBtn);

    expect(screen.getByText('Epistemology')).toBeInTheDocument();
    expect(screen.queryByText('Momentum')).not.toBeInTheDocument();
  });
});
